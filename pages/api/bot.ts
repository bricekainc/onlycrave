import { Telegraf, Markup } from 'telegraf';
import { getCreators } from '../../lib/getCreators';

const bot = new Telegraf(process.env.BOT_TOKEN || '');

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('Use POST');

  bot.start((ctx) => {
    ctx.replyWithMarkdownV2(
      "Welcome to the *OnlyCrave Discovery Bot*\\!\n\nTap below to see trending creators\\.",
      Markup.inlineKeyboard([
        [Markup.button.callback('🔥 Discover Now', 'list_creators')]
      ])
    );
  });

  bot.action('list_creators', async (ctx) => {
    const creators = await getCreators();
    // We send the first 3 creators to avoid hitting Telegram rate limits
    for (const c of creators.slice(0, 3)) {
      await ctx.replyWithPhoto(c.avatar, {
        caption: `*${c.name}*\n${c.description}`,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([[Markup.button.url('✨ View Profile', c.link)]])
      });
    }
  });

  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (err) {
    res.status(500).send('Bot Error');
  }
}
