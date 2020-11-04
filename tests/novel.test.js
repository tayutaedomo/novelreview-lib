const puppeteer = require('puppeteer');

const { NarouNovel } = require('../lib/novel');


test('NarouNovel scraping', async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();

  const novel = new NarouNovel();
  novel.url = 'https://ncode.syosetu.com/novelview/infotop/ncode/n9669bk/';

  await novel.scrape(page);

  await browser.close();

  expect(novel.title).toBe('無職転生　- 異世界行ったら本気だす -');
  expect(novel.writerUrl).toBe('https://mypage.syosetu.com/288399/');
  //expect(novel.points).toBe('575,417pt');
  expect(novel.genre).toBe('ハイファンタジー〔ファンタジー〕');
  expect(novel.status).toBe('完結済全286部分');
  expect(novel.charCount).toBe('2,829,292文字');
  expect(novel.lastUpdatedAt).toBe('2015年 04月03日 23時00分');
  //expect(novel.flags).toBe([]);
  expect(novel.tags).toStrictEqual(['R15', '残酷な描写あり', '異世界転生']);
});
