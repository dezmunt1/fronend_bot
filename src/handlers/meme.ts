import { Context, Markup } from 'telegraf';
import axios from 'axios';

type MemeContext = Context & { message: { text: string } };

const MoreButton = Markup.inlineKeyboard([
  Markup.button.callback('MOAR', 'next_meme'),
]);
const isGif = (url: string) => /\.gif$/.test(url);

async function nextMeme(ctx: MemeContext, subReddit?: string) {
  try {
    const { data } = await axios.get(
      `${process.env.MEME_API}${subReddit ?? ''}`,
    );

    const message = `_${data.title}_\n*Subreddit:* __${data.subreddit}__`;

    if (isGif(data.url)) {
      return await ctx.replyWithAnimation(data.url, {
        caption: message,
        parse_mode: 'Markdown',
        ...MoreButton,
      });
    }
    ctx.replyWithPhoto(data.url, {
      caption: message,
      parse_mode: 'Markdown',
      ...MoreButton,
    });
  } catch (e) {
    ctx.reply('Is not valid subreddit name');
  }
}

export const memeHandler = async (ctx: MemeContext) => {
  const [, subReddit] = ctx.message.text.split(' ');
  nextMeme(ctx, subReddit);
};

export const nextMemeAction = async (ctx: Context) => {
  nextMeme(ctx as MemeContext);
  ctx.answerCbQuery();
};
