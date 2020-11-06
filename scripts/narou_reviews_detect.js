const puppeteer = require('puppeteer');

const { NarouReviews, NarouWriter } = require('../lib/novel');
const LINE = require('../lib/line');

const LINE_POST_USER_ID = process.env['LINE_POST_USER_ID'];


const scraping = async (interval) => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();

  const novelReviews = new NarouReviews();
  await novelReviews.scrape(page);
  await novelReviews.novelsScraping(page, interval);

  await browser.close();

  const options = {
    charCount: 200000,
    points: 1000,
  };
  const reviews = novelReviews.detect();

  return reviews;
};

const postMessage = async (reviews) => {
  const message = createLineMessage(reviews);

  if (LINE_POST_USER_ID && message.length > 0) {
    await LINE.postMessage(LINE_POST_USER_ID, message, true);
    console.log('Message posted.');

  } else {
    console.log('Not posted yet.');
    console.log(message);
  }
};

const createLineMessage = (reviews) => {
  const messages = reviews.map(review => {
    const novel = review.novel;

    return [
      novel.title,
      [novel.charCount, novel.points, novel.status, novel.genre].join(' / '),
      novel.lastUpdatedAt,
      novel.getUrl(),
    ].join('\n');
  });

  return messages.join('\n');
};


if (require.main === module) {
  (async () => {

    try {
      const reviews = await scraping(process.argv[2]);

      await postMessage(reviews);

    } catch(err) {
      console.error(err);
    }

  })();
}
