const path = require('path');
const puppeteer = require('puppeteer');

const { NovelReviews, NovelWriter } = require('../lib/novel');


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
  console.log(JSON.stringify(reviews, null, 2));

  const destPath = path.join(__dirname, '..', '..', 'novelreview', 'data');
  const writer = new NovelWriter(destPath);
  const filename = await writer.writeJsonAll(reviews);
  console.log(filename);
  const filenames = await writer.writeJsonEach(reviews);
  console.log(filenames);

  await browser.close();

})();
