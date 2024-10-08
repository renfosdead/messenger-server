const OneSignal = require("@onesignal/node-onesignal");

const configuration = OneSignal.createConfiguration({
  appId: process.env.NODE_ONE_SIGNAL_APP_ID,
});

const client = new OneSignal.DefaultApi(configuration);

const createUser = async (userId, deviceToken) => {
  try {
    await createSubscription(userId, deviceToken);
    if (res) {
      console.log("OneSignal User created successful");
      return Promise.resolve();
    }
  } catch (err) {
    console.log("OneSignal User create failed", err);
    return Promise.resolve();
  }
};

const createSubscription = async (userId, deviceToken) => {
  return client.createSubscription(
    process.env.NODE_ONE_SIGNAL_APP_ID,
    "external_id",
    userId,
    {
      subscription: {
        type: "AndroidPush",
        token: deviceToken,
      },
    }
  );
};

const removeUser = async (userId) => {
  try {
    await client.deleteUser(
      process.env.NODE_ONE_SIGNAL_APP_ID,
      "external_id",
      userId
    );
    console.log("OneSignal User deleted successful");
    return Promise.resolve();
  } catch (err) {
    console.log("OneSignal User delete failed", err);
    return Promise.resolve();
  }
};

const pushNewMessage = async (event, addresses) => {
  addresses = addresses
    .filter((addr) => addr.id !== event.userId)
    .map((addr) => addr.id);

  const notification = {
    name: "QIP",
    headings: { en: "QIP" },
    contents: {
      en: event.body.message,
    },
    app_id: process.env.NODE_ONE_SIGNAL_APP_ID,
    include_external_user_ids: addresses,
    android_channel_id: process.env.NODE_ONE_SIGNAL_ANDROID_CHANNEL_ID,
  };

  try {
    const res = await createNotification(notification);
    if (res) {
      console.log("Push success");
      return Promise.resolve();
    }
  } catch (err) {
    console.log("Push error:", err);
    return Promise.resolve();
  }
};

const createNotification = async (notification) => {
  return fetch(`${process.env.NODE_ONE_SIGNAL_API_URL}/notifications`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${process.env.NODE_ONE_SIGNAL_API_KEY}`,
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(notification),
  });
};

module.exports = {
  createUser,
  removeUser,
  pushNewMessage,
};
