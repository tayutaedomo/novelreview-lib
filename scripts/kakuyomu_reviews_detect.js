const puppeteer = require('puppeteer');

const { NovelReviews } = require('../lib/novel');
const LINE = require('../lib/line');

const LINE_POST_USER_ID = process.env['LINE_POST_USER_ID'];


(async () => {

  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();

  const novelReviews = new NovelReviews();
  const reviews = await novelReviews.scrape(page);

  const options = {
    charCount: 100000,
    points: 300,
  };
  const detected = novelReviews.detect(options);

  await browser.close();

  const message = createLineMessage(detected);

  if (LINE_POST_USER_ID && message.length > 0) {
    await LINE.postMessage(LINE_POST_USER_ID, message, true);
    console.log('Sent message.');

  } else {
    console.log('Not send message.', message);
  }

})();


const createLineMessage = (reviews) => {
  const messages = reviews.map(review => {
    return [
      review.novel.title,
      review.novel.genre + ' / ' +  review.novel.points + ' / ' + review.novel.charCount,
      review.novel.getUrl(),
    ].join('\n');
  });

  return messages.join('\n');
};
