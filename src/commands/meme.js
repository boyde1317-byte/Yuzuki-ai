/**
 * Command: meme
 * Random memes from Reddit via meme-api.com (free, no key).
 *
 * Usage:
 *   .meme              — random meme from r/memes
 *   .meme <subreddit>  — meme from a specific subreddit
 *
 * Aliases: memes, dankmeme, redditmeme
 * Permission: public
 */
import { sendInteractive, quickReply } from '../services/rich-messages.js';
import { config } from '../config/index.js';
import { log }   from '../utils/logger.js';

export const meta = {
  name:        'meme',
  description: 'Random meme from Reddit — or pick your subreddit',
  category:    'fun',
  aliases:     ['memes', 'dankmeme', 'redditmeme'],
  cooldown:    8,
  permission:  'public',
};

const DEFAULT_SUBS = ['memes', 'dankmemes', 'me_irl', 'wholesomememes', 'programmerhumor'];
const API_BASE     = 'https://meme-api.com/gimme';

export async function handler(ctx) {
  const { sock, chat: jid, args, rawMessage } = ctx;

  const sub = args[0]?.toLowerCase().replace(/[^a-z0-9_]/gi, '') || null;
  const url = sub ? `${API_BASE}/${sub}` : `${API_BASE}`;

  try { await ctx.react('😂'); } catch {}
  try { await sock.sendPresenceUpdate('composing', jid); } catch {}

  let meme;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    meme = await res.json();
    if (meme.code === 404 || !meme.url) throw new Error(meme.message ?? 'Subreddit not found or no memes available');
    if (meme.nsfw) throw new Error('NSFW content — try a different subreddit');
  } catch (e) {
    try { await sock.sendPresenceUpdate('paused', jid); } catch {}
    log.warn(`[meme] fetch error: ${e.message}`);
    return sendInteractive(sock, jid, {
      header: '😅 Meme Error',
      body:   `❌ ${e.message}\n\n_Try: \`.meme programmerhumor\` or \`.meme wholesomememes\`_`,
      footer: `🌸 ${config.botName}`,
      buttons: [quickReply('🎲 Try Random', 'meme'), quickReply('😄 Tell a Joke', 'joke')],
    }, rawMessage);
  }

  try { await sock.sendPresenceUpdate('paused', jid); } catch {}

  const caption =
    `*${meme.title}*\n` +
    `📌 r/${meme.subreddit} · 👍 ${meme.ups?.toLocaleString() ?? '?'}\n\n` +
    `🌸 ${config.botName}`;

  try {
    // Send as image with caption
    await sock.sendMessage(jid, {
      image: { url: meme.url },
      caption,
      contextInfo: { externalAdReply: {
        title:       meme.title,
        body:        `r/${meme.subreddit}`,
        sourceUrl:   meme.postLink,
        mediaType:   1,
        renderLargerThumbnail: false,
      }},
    }, { quoted: rawMessage });
  } catch (imgErr) {
    // Fallback: text only
    log.warn(`[meme] image send failed, text fallback: ${imgErr.message}`);
    await sock.sendMessage(jid, {
      text: `${caption}\n\n🔗 ${meme.url}`,
    }, { quoted: rawMessage });
  }
}
