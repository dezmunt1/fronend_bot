import { cifrusParser } from './utils/cifrusParser';
import { Telegraf } from 'telegraf';
import { startHandler, helpHandler } from './handlers';

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start(startHandler);
bot.help(helpHandler);
bot.hears('/cifrus', async (ctx) => {
  const message = await cifrusParser();
  ctx.replyWithHTML(message);
});

bot.launch().catch((e) => console.log(e));
bot.catch((err) => console.log(err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
