const path = require('path');

const { KakuyomuReviews } = require('../lib/novel');

test('NovelReviews detect', async () => {
  const jsonPath = path.join(__dirname, 'data', 'kakuyomu_reviews_20201106105743.json');
  const kakuyomuReviews = new KakuyomuReviews();
  await kakuyomuReviews.restoreFromFile(jsonPath);

  expect(kakuyomuReviews.reviews.length).toBe(44);

  const detected = kakuyomuReviews.detect({ charCount: 100000 });
  expect(detected.length).toBe(18);

  const detected2 = kakuyomuReviews.detect({ points: 100 });
  expect(detected2.length).toBe(9);

  const detected3 = kakuyomuReviews.detect({ charCount: 100000, points: 100 });
  expect(detected3.length).toBe(6);
});
