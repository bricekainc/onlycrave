import { Telegraf, Markup } from 'telegraf';
import { getCreators } from '../../lib/getCreators';

const bot = new Telegraf(process.env.BOT_TOKEN || '');

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('Use POST');

  bot.start((ctx) => {
    ctx.replyWithMarkdownV2(
      "Welcome to the *OnlyCrave Search Bot*\\!\n\nType any letter \\(e\\.g\\., 'A'\\) to see creators starting with that letter, or type a name to search\\.",
      Markup.inlineKeyboard([
        [Markup.button.url('🌐 Open Full Directory', 'https://your-app.vercel.app')]
      ])
    );
  });

  // Listener for any text message
  bot.on('text', async (ctx) => {
    const userInput = ctx.message.text.trim().toLowerCase();
    const creators = await getCreators();

    // Logic: If it's one letter, find by first letter. If more, search name.
    const results = creators.filter(c => {
      if (userInput.length === 1) {
        return c.name.toLowerCase().startsWith(userInput);
      }
      return c.name.toLowerCase().includes(userInput) || c.username.toLowerCase().includes(userInput);
    });

    if (results.length === 0) {
      return ctx.reply(`No creators found for "${ctx.message.text}". Try another letter!`);
    }

    await ctx.reply(`Found ${results.length} creators:`);

    // Only show top 5 in the bot to avoid spamming
    for (const c of results.slice(0, 5)) {
      await ctx.replyWithPhoto(c.avatar, {
        caption: `*${c.name}*\n${c.description.substring(0, 100)}...`,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([[Markup.button.url('✨ View Profile', c.link)]])
      });
    }
    
    if (results.length > 5) {
      await ctx.reply(`And ${results.length - 5} more... View them all on the website!`);
    }
  });

  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (err) {
    res.status(500).send('Bot Error');
  }
}
