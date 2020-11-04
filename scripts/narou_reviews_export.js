const puppeteer = require('puppeteer');

const { NarouNovelReviews } = require('../lib/novel');


const scraping = async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();

  const novelReviews = new NarouNovelReviews();
  const reviews = await novelReviews.scrape(page);

  await browser.close();

  return novelReviews;
};


if (require.main === module) {
  (async () => {

    try {
      const novelReviews = await scraping();
      console.log(JSON.stringify(novelReviews, null, 2));

      // TODO: Export

    } catch(err) {
      console.error(err);
    }

  })();
}
