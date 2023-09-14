const DataHelper = require("../helpers/data.js");
const RequestHelper = require("../helpers/request.js");

const UserModel = require("../models/user.model.js");
const ChatModel = require("../models/chat.model.js");
const EventsModel = require("../models/events.model.js");

const EVENTS = require("../messenger-types/src/event_types.js");

async function login(req) {
  return new Promise(async (resolve, reject) => {
    const { name, status, customStatus } = req.body;

    const chatId = await ChatModel.getChatId();

    const userId = DataHelper.getNewId();

    await UserModel.addUser(userId);

    await EventsModel.addEvent(EVENTS.changeName, {
      chatId,
      userId,
      name,
    });
    await EventsModel.addEvent(EVENTS.changeStatus, {
      chatId,
      userId,
      status,
    });
    await EventsModel.addEvent(EVENTS.changeCustomStatus, {
      chatId,
      userId,
      customStatus,
    });

    resolve({ chatId, userId });
  });
}

function logout(req) {
  return RequestHelper.isCorrectHeaders(req).then(async () => {
    const { userId, chatId } = RequestHelper.getRequestParams(req);

    await UserModel.removeUser(userId);

    await EventsModel.deleteEvent(EVENTS.changeName, userId);
    await EventsModel.deleteEvent(EVENTS.changeCustomStatus, userId);
    await EventsModel.addEvent(EVENTS.changeStatus, {
      chatId,
      userId,
      status: "offline",
    });

    return Promise.resolve({ user: userId });
  });
}

function changeStatus(req) {
  return RequestHelper.isCorrectHeaders(req).then(async () => {
    const { userId, chatId } = RequestHelper.getRequestParams(req);
    const { status } = req.body;

    await EventsModel.addEvent(EVENTS.changeStatus, {
      chatId,
      userId,
      status,
    });

    return Promise.resolve({ chatId, userId, status });
  });
}

function changeCustomStatus(req) {
  return RequestHelper.isCorrectHeaders(req).then(async () => {
    const { userId, chatId } = RequestHelper.getRequestParams(req);
    const { customStatus } = req.body;

    if (!customStatus) {
      return Promise.resolve({ error: "Wrong data" });
    } else {
      await EventsModel.addEvent(EVENTS.changeCustomStatus, {
        chatId,
        userId,
        customStatus,
      });

      return Promise.resolve({ chatId, userId, customStatus });
    }
  });
}

function changeName(req) {
  return RequestHelper.isCorrectHeaders(req).then(async () => {
    const { userId, chatId } = RequestHelper.getRequestParams(req);
    const { name } = req.body;
    await EventsModel.addEvent(EVENTS.changeName, {
      chatId,
      userId,
      name,
    });

    return Promise.resolve({ chatId, userId, name });
  });
}

module.exports = {
  login,
  logout,
  changeStatus,
  changeCustomStatus,
  changeName,
};
