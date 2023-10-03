const OneSignal = require("@onesignal/node-onesignal");

const configuration = OneSignal.createConfiguration({
  appId: process.env.NODE_ONE_SIGNAL_APP_ID,
});

const client = new OneSignal.DefaultApi(configuration);

const createUser = async (userId) => {
  try {
    const res = await client.createUser(process.env.NODE_ONE_SIGNAL_APP_ID, {
      properties: {
        language: "en",
      },
      identity: { external_id: userId },
    });
    if (res) {
      console.log("OneSignal User created successful:", res);
      return Promise.resolve();
    }
  } catch (err) {
    console.log("OneSignal User create failed:", err);
    return Promise.resolve();
  }
};

const removeUser = async (userId) => {
  try {
    const res = await client.deleteUser(
      process.env.NODE_ONE_SIGNAL_APP_ID,
      "external_id",
      userId
    );
    console.log("OneSignal User deleted successful");
    return Promise.resolve();
  } catch (err) {
    console.log("OneSignal User delete failed:", err);
    return Promise.resolve();
  }
};

const pushNewMessage = async (event, addresses) => {
  addresses = addresses
    .filter((addr) => addr.id !== event.userId)
    .map((addr) => addr.id);

  const notification = {
    app_id: process.env.NODE_ONE_SIGNAL_APP_ID,
    headings: { en: "QIP" },
    contents: {
      en: event.body.message,
    },
    include_external_user_ids: [addresses],
    include_aliases: {
      external_id: [addresses],
    },
  };

  try {
    const res = await client.createNotification(notification);
    if (res) {
      console.log("Push success:", res);
      return Promise.resolve();
    }
  } catch (err) {
    console.log("Push error:", error);
    return Promise.resolve();
  }
};

module.exports = {
  createUser,
  removeUser,
  pushNewMessage,
};
