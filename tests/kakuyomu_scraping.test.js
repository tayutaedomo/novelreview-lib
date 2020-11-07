const puppeteer = require('puppeteer');

const { KakuyomuReviews } = require('../lib/novel');


test('KakuyomuReviews scraping', async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();

  const kakuyomuReviews = new KakuyomuReviews();
  await kakuyomuReviews.scrape(page);

  await browser.close();

  expect(kakuyomuReviews.reviews.length).toBe(46);
});
