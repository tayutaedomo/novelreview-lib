const path = require('path');

const { NovelReviews } = require('../lib/novel');

test('NovelReviews detect', async () => {
  const jsonPath = path.join(__dirname, 'data', 'kakuyomu_reviews_20201106105743.json');
  const novelReviews = new NovelReviews();
  await novelReviews.restoreFromFile(jsonPath);

  expect(novelReviews.reviews.length).toBe(44);

  const detected = novelReviews.detect({ charCount: 100000 });
  expect(detected.length).toBe(18);

  const detected2 = novelReviews.detect({ points: 100 });
  expect(detected2.length).toBe(9);

  const detected3 = novelReviews.detect({ charCount: 100000, points: 100 });
  expect(detected3.length).toBe(6);
});
