const path = require('path');
const puppeteer = require('puppeteer');

const { KakuyomuReviews, KakuyomuWriter } = require('../lib/novel');


(async () => {

  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();

  const kakuyomuReviews = new KakuyomuReviews();
  const reviews = await kakuyomuReviews.scrape(page);
  console.log(JSON.stringify(reviews, null, 2));

  const destPath = path.join(__dirname, '..', 'data');
  const writer = new KakuyomuWriter(destPath);
  const filename = await writer.writeJsonAll(reviews);
  console.log(filename);
  const filenames = await writer.writeJsonEach(reviews);
  console.log(filenames);

  await browser.close();

})();
