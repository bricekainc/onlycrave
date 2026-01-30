import { Telegraf, Markup } from 'telegraf';
import { getCreators } from '../../lib/fetchCreators';

const bot = new Telegraf(process.env.BOT_TOKEN || '');

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('POST only');

  bot.start((ctx) => {
    ctx.replyWithMarkdownV2(
      "Welcome to the *OnlyCrave Search Bot*\\!\n\nType any **letter** to see creators starting with that letter\\, or type a **name** to search\\.",
      Markup.inlineKeyboard([
        [Markup.button.url('🌐 Open Full Directory', 'https://onlycrave.vercel.app')]
      ])
    );
  });

  bot.on('text', async (ctx) => {
    const query = ctx.message.text.trim().toLowerCase();
    const creators = await getCreators();

    // Search Logic:
    // If input is 1 character: Match by first letter
    // If input is longer: Search name and username
    const results = creators.filter(c => {
      if (query.length === 1) {
        return c.name.toLowerCase().startsWith(query);
      }
      return c.name.toLowerCase().includes(query) || c.username.toLowerCase().includes(query);
    });

    if (results.length === 0) {
      return ctx.reply(`No creators found for "${ctx.message.text}". Try another letter!`);
    }

    // Limit to 8 results in Telegram to avoid hitting message length limits
    const displayList = results.slice(0, 8);
    
    await ctx.reply(`🔍 Found ${results.length} creators:`);

    for (const c of displayList) {
      await ctx.replyWithPhoto(c.avatar, {
        caption: `*${c.name}*\n@${c.username}`,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([[Markup.button.url('✨ View Profile', c.link)]])
      });
    }

    if (results.length > 8) {
      await ctx.reply(`...and ${results.length - 8} more. Search the web app for the full list!`);
    }
  });

  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (err) {
    res.status(500).send('Error');
  }
}
