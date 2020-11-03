const fs = require('fs').promises;
const path = require('path');
const moment = require('moment');

const { NovelReviewModel } = require('./db');


class NovelReviews {
  constructor() {
    this.reviews = [];
  }

  async scrape(page) {
    const url = 'https://kakuyomu.jp/recent_reviews';
    await page.goto(url);

    const itemHandles = await page.$$('.widget-reviewsItem');

    this.reviews = [];

    for await (const itemHandle of itemHandles) {
      const review = new NovelReview();

      try {
        await review.parseReviewsItem(itemHandle);

        review.novel = new Novel();
        await review.novel.parseReviewsItem(itemHandle);

      } catch(err) {
        console.error(err);
      }

      this.reviews.push(review);
    }

    return this.reviews;
  }

  async detect() {
    return this.reviews.filter(review => review.novel.detect());
  }

  async restoreFromFile(jsonPath) {
    // Read file
    const reviewsJson = await fs.readFile(jsonPath, 'utf-8');
    if (! reviewsJson) {
      throw new Error('JSON file is invalid.');
    }

    const reviews = JSON.parse(reviewsJson);

    return this.restore(reviews);
  }

  restore(reviews) {
    // Restore instances
    this.reviews = reviews.map(reviewData => {
      const review = new NovelReview();
      review.setData(reviewData);

      review.novel = new Novel();
      review.novel.setData(reviewData.novel)

      return review;
    });

    return this.reviews;
  }

  async saveModels() {
    const models = this.generateModels();

    return await models.reduce(async (acc, model) => {
      try {
        acc = await acc; // for async

        const id = model.reviewId;
        const stored = await NovelReviewModel.get(id);

        if (stored) {
          console.log('saveModels: Already stored.', id);

        } else {
          await model.save();
          acc.push(model);
        }
      } catch(err) {
        console.error(err);
      }

      return acc;

    }, []);
  }

  generateModels() {
    return this.reviews.map(review => review.generateModel());
  }
}


class NovelReview {
  constructor() {
    this.novel = null;

    this.url = null;
    this.title = null;
    this.reviewerUrl = null;
    this.createdAt = null;
    this.star = null;
  }

  setData(data) {
    this.url = data.url;
    this.title = data.title;
    this.reviewerUrl = data.reviewerUrl;
    this.createdAt = data.createdAt;
    this.star = data.star;
  }

  getData() {
    return {
      url: this.url,
      title: this.title,
      reviewerUrl: this.reviewerUrl,
      createdAt: this.createdAt,
      star: this.star,
    };
  }

  async parseReviewsItem(itemHandle) {
    try {
      const titleHandle = await itemHandle.$('.widget-catchphrase-title a');
      if (titleHandle) {
        this.url = await titleHandle.evaluate(node => node.getAttribute('href'));
        this.title = await titleHandle.evaluate(node => node.innerText);
      }

      const authorHandle = await itemHandle.$('.widget-catchphrase-author a');
      if (authorHandle) {
        this.reviewerUrl = await authorHandle.evaluate(node => node.getAttribute('href'));
      }
    } catch(e) {
      console.error(e);
    }
  }

  generateModel() {
    const data = {
      source: 'kakuyomu',
      reviewId: this.getId(),
      reviewerId: this.getReviewerId(),
      title: this.title,
      written: this.createdAt,
      novelId: this.novel.getId(),
      novelTitle: this.title,
      authorId: this.novel.getAuthorId(),
      genre: this.novel.genre,
      points: this.novel.getPointsInt(),
      charCount: this.novel.getCharCountInt(),
      pageCount: this.novel.getPageCountInt(),
      status: this.novel.getStatusInt(),
      latUpdated: this.novel.getLastUpdatedDate(),
      flags: this.novel.flags,
      tags: this.novel.tags,
      created: moment().toDate(),
    };

    return new NovelReviewModel(data, data.reviewId);
  }

  getId() {
    if (! this.url) throw new Error('Review URL is required.')
    return this.url.split('/')[4];
  }

  getReviewerId() {
    return this.reviewerUrl.split('/')[2];
  }
}


class Novel {
  constructor() {
    this.url = null;
    this.title = null;
    this.writerUrl = null;
    this.points = null;
    this.genre = null;
    this.status = null;
    this.charCount = null;
    this.lastUpdatedAt = null;
    this.flags = null;
    this.tags = null;
  }

  setData(data) {
    this.url = data.url;
    this.title = data.title;
    this.writerUrl = data.writerUrl;
    this.points = data.points;
    this.genre = data.genre;
    this.status = data.status;
    this.charCount = data.charCount;
    this.lastUpdatedAt = data.lastUpdatedAt;
    this.flags = data.flags;
    this.tags = data.tags;
  }

  getData() {
    return {
      url: this.url,
      title: this.title,
      writerUrl: this.writerUrl,
      points: this.points,
      genre: this.genre,
      status: this.status,
      charCount: this.charCount,
      lastUpdatedAt: this.lastUpdatedAt,
      flag: sthis.flags,
      tags: this.tags,
    };
  }

  async parseReviewsItem(itemHandle) {
    try {
      const titleHandle = await itemHandle.$('.widget-workCard-title a');
      if (titleHandle) {
        this.url = await titleHandle.evaluate(node => node.getAttribute('href'));
        this.title = await titleHandle.evaluate(node => node.innerText);
      }

      const authorHandle = await itemHandle.$('.widget-workCard-title span.widget-workCard-author a');
      if (authorHandle) {
        this.writerUrl = await authorHandle.evaluate(node => node.getAttribute('href'));
      }

      const pointsHandle = await itemHandle.$('.widget-workCard-reviewPoints');
      if (pointsHandle) {
        this.points = await pointsHandle.evaluate(node => node.innerText);
      }

      const genreHandle = await itemHandle.$('.widget-workCard-genre a');
      if (genreHandle) {
        this.genre = await genreHandle.evaluate(node => node.innerText);
      }

      const statusHandle = await itemHandle.$('.widget-workCard-status');
      if (statusHandle) {
        this.status = await statusHandle.evaluate(node => node.innerText);
      }

      const charCountHandle = await itemHandle.$('.widget-workCard-characterCount');
      if (charCountHandle) {
        this.charCount = await charCountHandle.evaluate(node => node.innerText);
      }

      const updatedHandle = await itemHandle.$('.widget-workCard-dateUpdated');
      if (updatedHandle) {
        this.lastUpdatedAt = await updatedHandle.evaluate(node => node.innerText);
      }

      const flagsHandle = await itemHandle.$('.widget-workCard-flags');
      if (flagsHandle) {
        this.flags = await flagsHandle.evaluate(node => {
          return Array.from(node.querySelectorAll('span')).map(node => node.innerText);
        });
      }

      const tagsHandle = await itemHandle.$('.widget-workCard-tags');
      if (tagsHandle) {
        this.tags = await tagsHandle.evaluate(node => {
          return Array.from(node.querySelectorAll('a')).map(node => node.innerText);
        });
      }
    } catch(e) {
      console.error(e);
    }
  }

  detect() {
    if (! this.charCount) return false;

    // Character count check
    if (this.getCharCountInt() < 100000) return false;

    return true;
  }

  getUrl() {
    if (! this.url) return '';
    return 'https://kakuyomu.jp' + this.url;
  }

  getId() {
    return this.url.split('/')[2];
  }

  getAuthorId() {
    return this.writerUrl.split('/')[2];
  }

  getPointsInt() {
    try {
      return parseInt(this.points.replace('★', ''));
    } catch {
      return 0;
    }
  }

  getCharCountInt() {
    if (! this.charCount) return 0;

    try {
      return parseInt(this.charCount.replace(/[\D]/g, ''));
    } catch {
      return 0;
    }
  }

  getPageCountInt() {
    if (! this.status) return 0;

    try {
      return parseInt(this.status.split(' ')[1].replace('話', ''));
    } catch {
      return 0;
    }
  }

  getStatusInt() {
    if (! this.status) return 0;

    return this.status.split(' ')[0] == '完結済' ? 1 : 0;
  }

  getLastUpdatedDate() {
    if (! this.lastUpdatedAt) return null;

    const s = this.lastUpdatedAt.split(/(年|月|日| )/g);
    const isoDate = `${s[0]}-${s[2].padStart(2, '0')}-${s[4].padStart(2, '0')}T${s[8]}:00+0900`;
    return moment(isoDate).toDate();
  }
}


class NovelWriter {
  constructor(destDirPath) {
    this.destDirPath = destDirPath;
  }

  async writeJsonAll(reviews) {
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const filename = `kakuyomu_reviews_${timestamp}.json`;
    const distPath = path.join(this.destDirPath, filename);
    const json = JSON.stringify(reviews, null, 2)

    await fs.writeFile(distPath, json);

    return distPath;
  }

  async writeJsonEach(reviews) {
    const filenames = [];

    for await (const review of reviews) {
      try {
        if (! review || ! review.url) return;

        const items = review.url.split('/');
        const reviewId = items[items.length - 1];
        const filename = `kakuyomu_review_${reviewId}.json`;
        const distPath = path.join(this.destDirPath, filename);
        const json = JSON.stringify(review, null, 2)

        await fs.writeFile(distPath, json);

        filenames.push(distPath);
      } catch(err) {
        console.error(err);
      }
    }

    return filenames;
  }
}



module.exports = {
  NovelReviews,
  NovelWriter,
};



if (require.main === module) {
}
