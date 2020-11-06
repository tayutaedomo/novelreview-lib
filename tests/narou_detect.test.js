const path = require('path');

const { NarouReviews } = require('../lib/novel');


test('NarouNovelReviews detect', async () => {
  const jsonPath = path.join(__dirname, 'data', 'narouw_reviews_20201107005407.json');
  const narouReviews = new NarouReviews();
  await narouReviews.restoreFromFile(jsonPath);

  expect(narouReviews.reviews.length).toBe(10);
  console.log(JSON.stringify(narouReviews, null, 2));

  // const detected = narouReviews.detect({ charCount: 100000 });
  // expect(detected.length).toBe();

  // const detected2 = narouReviews.detect({ points: 100 });
  // expect(detected2.length).toBe();

  // const detected3 = narouReviews.detect({ charCount: 100000, points: 100 });
  // expect(detected3.length).toBe();
});
