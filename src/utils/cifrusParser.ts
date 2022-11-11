import { JSDOM, VirtualConsole } from 'jsdom';
import dayjs from 'dayjs';

const virtualConsole = new VirtualConsole();

const HOUR = 1000 * 60 * 60;

const cache = {
  lastUpdateDate: 0,
  message: 'default',
};

export const cifrusParser = async () => {
  try {
    if (cache.lastUpdateDate + HOUR > Date.now()) {
      return cache.message;
    }
    const dom = await JSDOM.fromURL(
      'https://www.cifrus.ru/catalog/smartfony/google',
      {
        includeNodeLocations: true,
        pretendToBeVisual: true,
        runScripts: 'dangerously',
        resources: 'usable',
        virtualConsole,
      },
    );
    const pixels = dom.window.document.querySelectorAll(
      '.product-thumb .caption',
    );
    if (pixels.length) {
      const mapObj: Record<string, string> = {};
      pixels.forEach((element) => {
        const name = element.querySelector('.name a')?.textContent?.trim();
        const price = element
          .querySelector('.price .price-new')
          ?.textContent?.trim();

        if (!name || !/Pixel 7/.test(name) || /Japan/.test(name)) return;
        mapObj[name] = price ?? '';
      });
      cache.message = Object.entries(mapObj).reduce(
        (acc, current, idx) =>
          `${acc}${idx === 0 ? '' : '\n\n'}${current[0]}: <b>${current[1]}</b>`,
        '',
      );
      cache.lastUpdateDate = Date.now();
      cache.message = `<i>Last updated: ${dayjs(
        new Date(cache.lastUpdateDate),
      ).format('MMM D, YYYY h:mm:s A')}</i>\n<u>${cache.message}</u>`;
    }

    return cache.message;
  } catch (e) {
    return 'Prices not found';
  }
};
