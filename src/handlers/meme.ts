import { Context, Markup } from 'telegraf';
import axios from 'axios';

type MemeContext = Context & { message: { text: string } };

declare module 'telegraf' {
  interface Context {
    session: {
      isMemeLoading?: boolean;
    };
  }
}

const MoreButton = Markup.inlineKeyboard([
  Markup.button.callback('MOAR', 'next_meme'),
]);
const isGif = (url: string) => /\.gif$/.test(url);

async function nextMeme(ctx: MemeContext, subReddit?: string) {
  try {
    ctx.session.isMemeLoading = true;
    const { data } = await axios.get(
      `${process.env.MEME_API}${subReddit ?? ''}`,
    );

    const message = `<i>${data.title}</i>\n<b>Subreddit:</b> <code>${data.subreddit}</code>`;

    if (isGif(data.url)) {
      return await ctx.replyWithAnimation(data.url, {
        caption: message,
        parse_mode: 'HTML',
        ...MoreButton,
      });
    }
    ctx.replyWithPhoto(data.url, {
      caption: message,
      parse_mode: 'HTML',
      ...MoreButton,
    });
  } catch (e) {
    console.log((e as any)?.response);

    ctx.reply('Failure! Try again..');
  } finally {
    ctx.session.isMemeLoading = false;
  }
}

export const memeHandler = async (ctx: MemeContext) => {
  const [, subReddit] = ctx.message.text.split(' ');
  nextMeme(ctx, subReddit);
};

export const nextMemeAction = async (ctx: Context) => {
  if (ctx.session.isMemeLoading && ctx.callbackQuery) {
    await ctx.answerCbQuery('Request still in progress');
    return;
  }

  await nextMeme(ctx as MemeContext);
  ctx.answerCbQuery();
};
