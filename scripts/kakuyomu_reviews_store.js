const { Datastore } = require('@google-cloud/datastore');

const datastore = new Datastore({
  keyFilename: process.env['DATASTORE_CREDENTIALS']
});

const { Gstore, instances } = require('gstore-node');
const gstore = new Gstore({
  cache: false,
  errorOnEntityNotFound: false,
});

instances.set('default', gstore);
gstore.connect(datastore);


const { NovelReviews } = require('../lib/novel');


(async () => {
  const jsonPath = process.argv[2];
  if (! jsonPath) {
    console.log('JSON file path is required.');
    return process.exit(1);
  }

  try {
    const novelReviews = new NovelReviews();
    await novelReviews.restoreFromFile(jsonPath);
    await novelReviews.saveModels();

  } catch(err) {
    console.error(err);
  }
})();
