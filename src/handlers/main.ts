import { Context } from 'telegraf';

export const startHandler = async (ctx: Context) => {
  ctx.reply('Chimba hi 👋');
};

export const helpHandler = async (ctx: Context) => {
  ctx.reply(
    `*/cifrus* - _Get Google Pixel 7 prices_
*/meme [subreddit]* - _Get memes from Reddit_`,
    { parse_mode: 'Markdown' },
  );
};
