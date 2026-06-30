/**
 * Command: meme
 * Random memes from Reddit via meme-api.com (free, no key).
 * Images are uploaded to WhatsApp's CDN via sock.waUploadToServer
 * so they render inline — no download button.
 *
 * Usage:
 *   .meme              — 3 random memes (carousel)
 *   .meme <subreddit>  — 3 memes from a specific subreddit
 *
 * Aliases: memes, dankmeme, redditmeme
 */
import { sendCarousel, sendInteractive, quickReply } from '../services/rich-messages.js';
import { config } from '../config/index.js';
import { log }   from '../utils/logger.js';

export const meta = {
  name:        'meme',
  description: 'Random meme carousel from Reddit — images render inline',
  category:    'fun',
  aliases:     ['memes', 'dankmeme', 'redditmeme'],
  cooldown:    8,
  permission:  'public',
};

const API_BASE = 'https://meme-api.com/gimme';

export async function handler(ctx) {
  const { sock, chat: jid, args, rawMessage } = ctx;

  const sub     = args[0]?.toLowerCase().replace(/[^a-z0-9_]/gi, '') || null;
  // Fetch 3 memes at once for the carousel. The /gimme/<sub>/N endpoint
  // returns { memes: [...] }; single /gimme returns a single meme object.
  const apiUrl  = sub
    ? `${API_BASE}/${encodeURIComponent(sub)}/3`
    : `${API_BASE}/memes/3`;

  try { await ctx.react('😂'); } catch {}
  try { await sock.sendPresenceUpdate('composing', jid); } catch {}

  let memes;
  try {
    const res = await fetch(apiUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Yuzuki-AI/2.0)' },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    // meme-api.com returns { memes: [...] } for multi-fetch, or a single object
    const raw = Array.isArray(json.memes) ? json.memes : [json];
    memes = raw.filter(m => m?.url && !m.nsfw && m.url.match(/\.(jpg|jpeg|png|gif|webp)/i));

    if (!memes.length) throw new Error(json.message ?? 'No safe memes found — try another subreddit');
  } catch (e) {
    try { await sock.sendPresenceUpdate('paused', jid); } catch {}
    log.warn(`[meme] fetch error: ${e.message}`);
    return sendInteractive(sock, jid, {
      header:  '😅 Meme Error',
      body:    `❌ ${e.message}\n\n_Try: \`.meme programmerhumor\` or \`.meme wholesomememes\`_`,
      footer:  `🌸 ${config.botName}`,
      buttons: [
        quickReply('🎲 Try Random', 'meme'),
        quickReply('😄 Joke instead', 'joke'),
      ],
    }, rawMessage);
  }

  try { await sock.sendPresenceUpdate('paused', jid); } catch {}

  // Build carousel cards — sendCarousel downloads each imageUrl and uploads
  // to WhatsApp's CDN via sock.waUploadToServer so images render inline.
  const cards = memes.slice(0, 3).map(m => ({
    imageUrl: m.url,
    body: `*${m.title}*\n\n👍 ${m.ups?.toLocaleString() ?? '?'} upvotes`,
    footer: `r/${m.subreddit} · 🌸 ${config.botName}`,
    buttons: [
      quickReply('🔄 More Memes', `meme ${sub ?? ''}`),
      quickReply('😄 Joke', 'joke'),
    ],
  }));

  await sendCarousel(sock, jid, {
    body: `😂 *Meme Time!*${sub ? `  ·  r/${sub}` : ''}`,
    cards,
  }, rawMessage);
}
