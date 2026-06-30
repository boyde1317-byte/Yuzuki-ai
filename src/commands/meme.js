/**
 * Command: meme
 * Random meme carousel from Reddit via meme-api.com (free, no key).
 *
 * Images are pre-downloaded with Reddit-compatible headers, then passed as
 * imageBuffer to sendCarousel — which uploads each to WhatsApp's CDN via
 * sock.waUploadToServer so they render inline without a download button.
 *
 * Usage:
 *   .meme              — 3 random memes (carousel)
 *   .meme <subreddit>  — 3 memes from that subreddit
 */
import { sendCarousel, sendInteractive, quickReply } from '../services/rich-messages.js';
import { config } from '../config/index.js';
import { log }   from '../utils/logger.js';

export const meta = {
  name:        'meme',
  description: 'Random meme carousel — images uploaded to WA CDN inline',
  category:    'fun',
  aliases:     ['memes', 'dankmeme', 'redditmeme'],
  cooldown:    8,
  permission:  'public',
};

const API_BASE = 'https://meme-api.com/gimme';

/**
 * Download an image from any URL to a Buffer.
 * Passes Reddit-compatible headers so i.redd.it and preview.redd.it work.
 */
async function downloadImage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      'Referer':    'https://www.reddit.com/',
      'Accept':     'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    },
    signal:   AbortSignal.timeout(15_000),
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const ab = await res.arrayBuffer();
  if (!ab.byteLength) throw new Error(`Empty response for ${url}`);
  return Buffer.from(ab);
}

export async function handler(ctx) {
  const { sock, chat: jid, args, rawMessage } = ctx;

  const sub    = args[0]?.toLowerCase().replace(/[^a-z0-9_]/gi, '') || null;
  const apiUrl = sub
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
    if (!res.ok) throw new Error(`meme-api HTTP ${res.status}`);
    const json = await res.json();

    const raw  = Array.isArray(json.memes) ? json.memes : [json];
    // Only images — skip video posts
    memes = raw.filter(m => m?.url && !m.nsfw && !/v\.redd\.it/.test(m.url));
    if (!memes.length) throw new Error(json.message ?? 'No image memes found — try another subreddit');
  } catch (e) {
    try { await sock.sendPresenceUpdate('paused', jid); } catch {}
    log.warn(`[meme] API error: ${e.message}`);
    return sendInteractive(sock, jid, {
      header:  '😅 Meme Error',
      body:    `❌ ${e.message}\n\n_Try: \`.meme programmerhumor\` or \`.meme wholesomememes\`_`,
      footer:  `🌸 ${config.botName}`,
      buttons: [
        quickReply('🎲 Try Random',    'meme'),
        quickReply('😄 Joke instead', 'joke'),
      ],
    }, rawMessage);
  }

  // Pre-download each image to a Buffer so sendCarousel gets imageBuffer
  // instead of imageUrl. This bypasses the _downloadImageBuffer inside
  // sendCarousel (which lacks Referer) and ensures the WA CDN upload
  // always has real image bytes to work with.
  const cards = await Promise.all(
    memes.slice(0, 3).map(async m => {
      let imageBuffer = null;
      try {
        imageBuffer = await downloadImage(m.url);
        log.debug(`[meme] downloaded ${m.url.slice(0, 60)} — ${imageBuffer.length} bytes`);
      } catch (e) {
        log.warn(`[meme] image download failed (${e.message}) — card will show text header`);
      }
      return {
        ...(imageBuffer ? { imageBuffer } : { header: `😂 ${m.subreddit}` }),
        body:    `*${m.title}*\n\n👍 ${m.ups?.toLocaleString() ?? '?'} upvotes`,
        footer:  `r/${m.subreddit} · 🌸 ${config.botName}`,
        buttons: [
          quickReply('🔄 More Memes', `meme${sub ? ` ${sub}` : ''}`),
          quickReply('😄 Joke',       'joke'),
        ],
      };
    })
  );

  try { await sock.sendPresenceUpdate('paused', jid); } catch {}

  await sendCarousel(sock, jid, {
    body: `😂 *Meme Time!*${sub ? `  ·  r/${sub}` : ''}`,
    cards,
  }, rawMessage);
}
