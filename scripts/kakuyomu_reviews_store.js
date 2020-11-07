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


const { KakuyomuReviews } = require('../lib/novel');


(async () => {

  const jsonPath = process.argv[2];
  if (! jsonPath) {
    console.log('JSON file path is required.');
    return process.exit(1);
  }

  try {
    const kakuyomuReviews = new KakuyomuReviews();
    await kakuyomuReviews.restoreFromFile(jsonPath);
    await kakuyomuReviews.saveModels();

  } catch(err) {
    console.error(err);
  }

})();
