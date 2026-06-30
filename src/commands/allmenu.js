/**
 * Command: allmenu
 * Full command list using a native WhatsApp List Message.
 * Trigger: .allmenu  (aliases: commands, allcmds)
 */
import { getByCategory, getCategoryNames } from "../plugins/registry.js";
import { config } from "../config/index.js";
import { sendList } from "../services/rich-messages.js";
import { BRAND_FOOTER } from "../services/brand.js";

export const meta = {
  name: "allmenu",
  description: "Full command list using interactive list",
  category: "utility",
  aliases: ["commands", "allcmds", "menu2", "list"],
  cooldown: 5,
  permission: "public",
};

const CAT_ICONS = {
  ai: "🧠",
  utility: "⚙️",
  owner: "👑",
  general: "📋",
  fun: "🎉",
  tools: "🛠️",
  downloader: "📥",
  search: "🔍",
  media: "🎬",
};

const SC_CATS = {
  ai: "ᴀɪ",
  utility: "ᴜᴛɪʟɪᴛʏ",
  owner: "ᴏᴡɴᴇʀ",
  general: "ɢᴇɴᴇʀᴀʟ",
  fun: "ꜰᴜɴ",
  tools: "ᴛᴏᴏʟs",
  downloader: "ᴅᴏᴡɴʟᴏᴀᴅ",
  search: "sᴇᴀʀᴄʜ",
  media: "ᴍᴇᴅɪᴀ",
};

function catIcon(cat) {
  return CAT_ICONS[cat?.toLowerCase()] ?? "📂";
}
function scCat(cat) {
  return SC_CATS[cat?.toLowerCase()] ?? cat.toUpperCase();
}

export async function handler(ctx) {
  const { sock, chat: jid, rawMessage } = ctx;
  const p = config.prefix;
  const cats = getCategoryNames();

  const sections = cats
    .map((cat) => {
      const entries = getByCategory(cat);
      if (!entries.length) return null;

      return {
        title: `${catIcon(cat)} ${scCat(cat)}`,
        rows: entries.map((e) => ({
          id: `help_${e.meta.name}`, // this will trigger the help command via button routing
          title: `${p}${e.meta.name}`,
          description: e.meta.description || "No description available",
        })),
      };
    })
    .filter(Boolean);

  const total = cats.reduce((n, c) => n + getByCategory(c).length, 0);

  return sendList(
    sock,
    jid,
    {
      title: `◆ ʏᴜᴢᴜᴋɪ ᴄᴏᴍᴍᴀɴᴅs (${total})`,
      description: `Browse all available commands by category. Tap the button below to view the interactive list.`,
      buttonText: "View Commands",
      footer: BRAND_FOOTER,
      sections,
    },
    rawMessage,
  );
}
