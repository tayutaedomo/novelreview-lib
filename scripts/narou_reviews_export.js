const puppeteer = require('puppeteer');

const { NarouNovelReviews } = require('../lib/novel');


const scraping = async (interval) => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();

  const novelReviews = new NarouNovelReviews();
  const reviews = await novelReviews.scrape(page);

  await novelReviews.novelsScraping(page, interval);

  await browser.close();

  return reviews;
};


if (require.main === module) {
  (async () => {

    try {
      const reviews = await scraping(process.argv[2]);
      console.log(JSON.stringify(reviews, null, 2));

      // TODO: Export

    } catch(err) {
      console.error(err);
    }

  })();
}
