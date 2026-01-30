import { Telegraf, Markup } from 'telegraf';
import { getCreators } from '../../lib/getCreators';

const bot = new Telegraf(process.env.BOT_TOKEN!);

// We use a webhook handler for Vercel
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  bot.start(async (ctx) => {
    await ctx.replyWithPhoto(
      'https://onlycrave.com/public/uploads/settings/logo.png', 
      {
        caption: "Welcome to the **OnlyCrave Discovery Bot**\n\nFind your favorite creators below.",
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('🔥 Discover Creators', 'list_creators')],
          [Markup.button.url('🌐 Open Web App', 'https://your-app.vercel.app')]
        ])
      }
    );
  });

  bot.action('list_creators', async (ctx) => {
    const creators = await getCreators();
    const topCreators = creators.slice(0, 5); // Show first 5

    for (const c of topCreators) {
      await ctx.replyWithPhoto(c.avatar, {
        caption: `*${c.name}*\n${c.description}`,
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.url('✨ View Profile', c.link)]
        ])
      });
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
