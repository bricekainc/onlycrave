import { Telegraf, Markup } from 'telegraf';
import { getCreators } from '../../lib/getCreators';

const bot = new Telegraf(process.env.BOT_TOKEN || '');

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('POST only');

  bot.start((ctx) => {
    ctx.replyWithMarkdownV2(
      "🚀 *Welcome to OnlyCrave Official*\\!\n\n" +
      "Discover exclusive content from your favorite creators\\.\n\n" +
      "✨ *How to use:* \n" +
      "• Type a **name** to search\n" +
      "• Browse trending profiles below",
      Markup.inlineKeyboard([
        [
          Markup.button.url('🔐 Login', 'https://onlycrave.com/login'), 
          Markup.button.url('💎 Join Now', 'https://onlycrave.com/register')
        ],
        [Markup.button.callback('❔ Frequently Asked Questions', 'show_faq')],
        [Markup.button.url('🌐 Open Web App', 'https://your.onlycrave.com')]
      ])
    );
  });

  bot.action('show_faq', (ctx) => {
    ctx.reply(
      "📝 *OnlyCrave Help Center*\n\n" +
      "• *Is it free?* Registration is free! Creators set their own monthly rates.\n" +
      "• *Account Safety:* We use industry-standard encryption for all payments.\n" +
      "• *Support:* Need help? Our team is available 24/7.",
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([[Markup.button.url('📧 Contact Support', 'https://onlycrave.com/contact')]])
      }
    );
  });

  bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    const query = text.trim().toLowerCase();

    if (text.includes('?') || query.startsWith('how') || query.startsWith('why')) {
      return ctx.reply("💡 *Need Help?*\n\nIt looks like you have a question. For account-specific issues, please contact our support team directly.", {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([[Markup.button.url('📩 Message Support', 'https://onlycrave.com/contact')]])
      });
    }

    const creators = await getCreators();
    const results = creators.filter(c => {
      if (query.length === 1) return c.name.toLowerCase().startsWith(query);
      return c.name.toLowerCase().includes(query) || c.username.toLowerCase().includes(query);
    });

    if (results.length === 0) {
      return ctx.reply(`❌ No creators found matching "*${text}*". Try another name!`, { parse_mode: 'Markdown' });
    }

    // Limit results to 5 to avoid flooding the user
    const displayResults = results.slice(0, 5);

    for (const [index, c] of displayResults.entries()) {
      const profileUrl = `https://your.onlycrave.com/${c.username}`;
      
      // Creating a "Premium" feel caption
      const caption = 
        `🌟 *${c.name}*\n` +
        `onlycrave username:[@${c.username}](https://onlycrave.briceka.com/?${c.username})\n\n` +
        `🔥 *Exclusive Content Available*\n` +
        `✨ 100+ Posts  •  ⭐ 4.9 Rating\n\n` +
        `👇 *Tap below to subscribe and view:*`;

      await ctx.replyWithPhoto(c.avatar, {
        caption: caption,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.url('💎 Subscribe & View Profile', profileUrl)],
          [Markup.button.url('✉️ Send Tip', `${profileUrl}/tip`)]
        ])
      });
    }

    if (results.length > 5) {
      await ctx.reply(
        `✨ *Wait, there's more!* \nWe found ${results.length - 5} other creators matching your search.`,
        Markup.inlineKeyboard([[Markup.button.url('🔎 View All Results', `https://your.onlycrave.com/search?q=${query}`)]])
      );
    }
  });

  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
}
