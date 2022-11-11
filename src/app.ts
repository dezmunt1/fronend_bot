import { nextMemeAction } from './handlers/meme';
import { cifrusParser } from './utils/cifrusParser';
import { Telegraf } from 'telegraf';
import { startHandler, helpHandler, memeHandler } from './handlers';
import LocalSession from 'telegraf-session-local';

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.use((new LocalSession({database: 'session.json'}).middleware()));

bot.start(startHandler);
bot.help(helpHandler);
bot.hears('/cifrus', async (ctx) => {
  const message = await cifrusParser();
  ctx.replyWithHTML(message);
});
bot.hears(/\/meme/, memeHandler);
bot.action('next_meme', nextMemeAction);

bot.launch()
.then(() => console.log('Fronend BOT is startup...'))
.catch((e) => console.log(e));
bot.catch((err) => console.log(err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
