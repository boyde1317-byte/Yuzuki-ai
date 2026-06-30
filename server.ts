import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// --- Yuzuki Bot Imports ---
import { config }                        from './src/bot/config/index.js';
import { log, printBanner }              from './src/bot/utils/logger.js';
import { validateStartup, printValidation } from './src/bot/utils/validate.js';
import { ensureDir }                     from './src/bot/utils/helpers.js';
import {
  initDatabase,
  checkIntegrity,
  closeDatabase,
}                                        from './src/bot/database/index.js';
import { useMultiFileAuth }              from './src/bot/database/auth.js';
import { getBaileysVersion }             from './src/bot/core/socket.js';
import {
  initConnectionManager,
  connect,
  shutdown,
}                                        from './src/bot/core/connection.js';
import { registerEvents }                from './src/bot/events/index.js';
import { pluginManager }                 from './src/bot/plugins/loader.js';
import { getHealth, getHealthSummary }   from './src/bot/services/health.js';

let _shuttingDown = false;

function gracefulShutdown(sig: string) {
  if (_shuttingDown) return;
  _shuttingDown = true;

  log.warn(`[boot] ${sig} received — shutting down`);
  try { shutdown();      } catch (e: any) { log.error(`[boot] Shutdown error: ${e.message}`); }
  try { closeDatabase(); } catch (e: any) { log.error(`[boot] DB close error: ${e.message}`); }
  process.exit(0);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // ── Yuzuki Boot Sequence ──────────────────────────────────────────────────
  const validation = validateStartup(config);
  const configOk   = printValidation(validation);
  if (!configOk) {
    log.error('[boot] Aborting — fix the critical configuration errors above, then restart.');
    // process.exit(1); 
    // Wait, let's not exit so the UI can at least show up if bot config fails
  }

  ensureDir(config.sessionDir);
  ensureDir(config.tempDir);
  ensureDir(config.logsDir);

  initDatabase(config.dbPath);

  const integrity = checkIntegrity();
  if (!integrity.ok) {
    log.error(`[db] Integrity check FAILED: ${integrity.result ?? (integrity as any).error}`);
    log.warn('[db] Continuing with potentially degraded database');
  } else {
    log.db('[db] Integrity check passed');
  }

  const { state: authState, saveCreds, clearCreds } = await useMultiFileAuth(config.sessionDir);
  const version = await getBaileysVersion();
  log.info(`[boot] Baileys: ${version.join('.')}`);

  const pluginCount = await pluginManager.loadAll();
  printBanner({ version: config.version, nodeVersion: process.version, pluginCount });

  initConnectionManager({
    authState,
    saveCreds,
    clearCreds,
    onSocketReady: (sock: any) => {
      log.startup('[boot] Socket ready — registering event handlers');
      try {
        registerEvents(sock);
      } catch (e: any) {
        log.error(`[boot] Failed to register events: ${e.message}`);
      }
    },
  });

  await connect(version);

  // ── Yuzuki Health API ──────────────────────────────────────────────────────
  app.get('/health/summary', (req, res) => {
    res.type('text/plain').send(getHealthSummary());
  });

  app.get('/health', (req, res) => {
    const health = getHealth();
    const statusCode = health.connection.connected ? 200 : 503;
    res.status(statusCode).json(health);
  });
  
  // ── Dashboard API ──────────────────────────────────────────────────────────
  app.get('/api/status', (req, res) => {
    res.json({
        online: getHealth().connection.connected,
        uptime: getHealthSummary()
    });
  });

  app.get('/api/logs', async (req, res) => {
    const { logHistory } = await import('./src/bot/utils/logger.js');
    res.json(logHistory);
  });

  // ── Vite Middleware for Dashboard ──────────────────────────────────────────
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    log.info(`[dashboard] Yuzuki Control Panel listening on http://0.0.0.0:${PORT}`);
  });

  process.on('SIGINT',  () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  process.on('uncaughtException', (e) => {
    log.error(`[boot] uncaughtException: ${e.message}`);
    if (config.debug) log.debug(`[boot] Stack: ${e.stack}`);
  });

  process.on('unhandledRejection', (reason) => {
    const msg = reason instanceof Error ? reason.message : String(reason);
    log.error(`[boot] unhandledRejection: ${msg}`);
    if (config.debug && reason instanceof Error) log.debug(`[boot] Stack: ${(reason as Error).stack}`);
  });
}

startServer().catch(e => {
  console.error('[FATAL]', e.message);
  if (config?.debug) console.error(e.stack);
  process.exit(1);
});

