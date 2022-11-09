import { Context } from 'telegraf';

export const startHandler = async (ctx: Context) => {
  ctx.reply('Chimba hi 👋');
};

export const helpHandler = async (ctx: Context) => {
  ctx.reply('/cifrus - Get Google Pixel 7 prices');
};
