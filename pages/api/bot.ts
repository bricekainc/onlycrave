import { Telegraf, Markup } from 'telegraf';
import { getCreators } from '../../lib/getCreators';

const bot = new Telegraf(process.env.BOT_TOKEN || '');

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('POST only');

  bot.start((ctx) => {
    ctx.replyWithMarkdownV2(
      "🚀 *Welcome to the OnlyCrave Official Bot*\\!\n\nFind your favorite creators instantly\\.\n\n" +
      "• Type a **name** or **letter** to search\\.\n" +
      "• Use the buttons below for quick access\\.",
      Markup.inlineKeyboard([
        [Markup.button.url('🚪 Login', 'https://onlycrave.com/login'), Markup.button.url('📝 Sign Up', 'https://onlycrave.com/register')],
        [Markup.button.callback('❓ View FAQ', 'show_faq')],
        [Markup.button.url('🌐 Visit Website', 'https://onlycrave.vercel.app')]
      ])
    );
  });

  // Handle FAQ Button Click
  bot.action('show_faq', (ctx) => {
    ctx.reply(
      "📝 OnlyCrave FAQ:\n\n" +
      "1. Is OnlyCrave free? Registration is free, but creators set their own subscription prices.\n" +
      "2. How do I delete my account? Visit Settings > Security on the website.\n" +
      "3. Payment issues? Contact support below.",
      Markup.inlineKeyboard([[Markup.button.url('📧 Contact Support', 'https://onlycrave.com/contact')]])
    );
  });

bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    const query = text.trim().toLowerCase();

    // Check if it's a question
    if (text.includes('?') || query.startsWith('how') || query.startsWith('why')) {
      return ctx.reply("It looks like you have a question! For account-specific help, please contact our official team here: https://onlycrave.com/contact");
    }

    const creators = await getCreators();
    const results = creators.filter(c => {
      if (query.length === 1) return c.name.toLowerCase().startsWith(query);
      return c.name.toLowerCase().includes(query) || c.username.toLowerCase().includes(query);
    });

    if (results.length === 0) {
      return ctx.reply(`No creators found for "${text}".`);
    }

    await ctx.reply(`🔍 Found ${results.length} results:`);
    
    for (const c of results.slice(0, 5)) {
      // THE CHANGE IS HERE:
      // We use backticks to inject the creator's username into your Vercel URL
      const profileUrl = `https://onlycrave.vercel.app/${c.username}`;

      await ctx.replyWithPhoto(c.avatar, {
        caption: `*${c.name}*\n@${c.username}`,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.url('✨ View Profile', profileUrl)]
        ])
      });
    }

    if (results.length > 5) {
      await ctx.reply(`And ${results.length - 5} more results. Visit the website to see them all!`);
    }
  });

  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (err) { res.status(500).send('Error'); }
}
