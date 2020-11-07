const path = require('path');
const puppeteer = require('puppeteer');

const { NarouReviews, NarouWriter } = require('../lib/novel');


const scraping = async (interval) => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();

  const novelReviews = new NarouReviews();
  const reviews = await novelReviews.scrape(page);

  await novelReviews.novelsScraping(page, interval);

  await browser.close();

  return reviews;
};

const exporting = async (reviews) => {
  const destPath = path.join(__dirname, '..', 'data');
  const writer = new NarouWriter(destPath);
  return await writer.writeJsonAll(reviews);
};


if (require.main === module) {
  (async () => {

    try {
      const reviews = await scraping(process.argv[2]);
      console.log(JSON.stringify(reviews, null, 2));

      const filename = await exporting(reviews);
      console.log(filename);

    } catch(err) {
      console.error(err);
    }

  })();
}
