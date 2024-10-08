const DataHelper = require("../helpers/data.js");
const RequestHelper = require("../helpers/request.js");

const UserModel = require("../models/user.model.js");
const ChatModel = require("../models/chat.model.js");
const EventsModel = require("../models/events.model.js");
const PushModel = require("../models/push.model.js");

const EVENTS = require("../messenger-types/src/event_types.js");

async function login(req) {
  return new Promise(async (resolve, reject) => {
    let { chatId, userId } = RequestHelper.getRequestParams(req);

    const chatExisted = await ChatModel.getChat(chatId);
    chatId = chatExisted ? chatId : await ChatModel.getChatId();

    const userExisted = await UserModel.getUser(userId);
    userId = userExisted ? userId : DataHelper.getNewId();

    await UserModel.addUser(chatId, userId);
    await EventsModel.refreshEventAddresses(userId);

    const { name, status, customStatus, deviceToken } = req.body;

    console.log("Login with: ", req.body, userId);

    await EventsModel.addEvent(EVENTS.changeName, {
      chatId,
      userId,
      body: { name },
    });
    await EventsModel.addEvent(EVENTS.changeStatus, {
      chatId,
      userId,
      body: { status },
    });
    await EventsModel.addEvent(EVENTS.changeCustomStatus, {
      chatId,
      userId,
      body: { customStatus },
    });
    if (deviceToken) {
      await PushModel.createUser(userId, deviceToken);
    }
    resolve({
      chatId,
      userId,
      token: RequestHelper.getToken({ chatId, userId }),
    });
  });
}

async function logout(req) {
  const { userId, chatId } = RequestHelper.getRequestParams(req);

  if (userId) {
    await EventsModel.deleteEvent(EVENTS.changeName, userId);
    await EventsModel.deleteEvent(EVENTS.changeCustomStatus, userId);
    await PushModel.removeUser(userId);
    await EventsModel.addEvent(EVENTS.changeStatus, {
      chatId,
      userId,
      body: { status: "offline" },
    });
  }

  return Promise.resolve({ user: userId });
}

function changeStatus(req) {
  return RequestHelper.isCorrectHeaders(req).then(
    async ({ userId, chatId }) => {
      const { status } = req.body;

      await EventsModel.addEvent(EVENTS.changeStatus, {
        chatId,
        userId,
        body: { status },
      });

      return Promise.resolve({ chatId, userId, status });
    }
  );
}

function changeCustomStatus(req) {
  return RequestHelper.isCorrectHeaders(req).then(
    async ({ userId, chatId }) => {
      const { customStatus } = req.body;

      if (!customStatus) {
        return Promise.resolve({ error: "Wrong data" });
      } else {
        await EventsModel.addEvent(EVENTS.changeCustomStatus, {
          chatId,
          userId,
          body: { customStatus },
        });

        return Promise.resolve({ chatId, userId, customStatus });
      }
    }
  );
}

function changeName(req) {
  return RequestHelper.isCorrectHeaders(req).then(
    async ({ userId, chatId }) => {
      const { name } = req.body;
      await EventsModel.addEvent(EVENTS.changeName, {
        chatId,
        userId,
        body: { name },
      });

      return Promise.resolve({ chatId, userId, name });
    }
  );
}

module.exports = {
  login,
  logout,
  changeStatus,
  changeCustomStatus,
  changeName,
};
