
const puppeteer = require('puppeteer');

(async () => {
  const url = 'https://kakuyomu.jp/recent_reviews'

  //const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();
  await page.goto(url);

  //await page.screenshot({path: 'capture.png'});

  let itemHandles = await page.$$('.widget-reviewsItem');

  for await (itemHandle of itemHandles) {
    try {
      const titleHandle = await itemHandle.$('.widget-catchphrase-title a');
      if (titleHandle) {
        const title = await titleHandle.evaluate(node => node.innerText);
        const url = await titleHandle.evaluate(node => node.getAttribute('href'));
        console.log(url, title);
      }
    } catch(e) {
      console.log(e);
    }
  }

  await browser.close();
})();
