const line = require('@line/bot-sdk');

const LINE_CHANNEL_ACCESS_TOKEN = process.env['LINE_CHANNEL_ACCESS_TOKEN'];


const postMessage = async (toUserId, text, notificationDisabled) => {
  const client = new line.Client({
    channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN
  });

  notificationDisabled = notificationDisabled || false;

  const message = {
    type: 'text',
    text: text
  };

  return client.pushMessage(toUserId, message, notificationDisabled);
}


module.exports = {
  postMessage: postMessage
};


if (require.main === module) {
  (async () => {
    try {
      const userId = process.argv[2];
      const text = process.argv[3];
      await postMessage(userId, text, true);
    } catch(err) {
      console.error(err);
    }
  })();
}
