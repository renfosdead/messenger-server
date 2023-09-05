const filename = __dirname + "/../data/chat.json";

let chat = require(filename);
const helper = require("../helpers/helper.js");
const chatModel = require("./chat.model.js");

const mainStatuses = require("../messenger-types/src/main_statuses.js");
const customStatuses = require("../messenger-types/src/custom_statuses");

function login({ name, status, customStatus }) {
  return new Promise(async (resolve, reject) => {
    if (!name || !status || !customStatus || !mainStatuses.includes(status)) {
      resolve({ error: "Wrong data" });
    } else {
      const chatId = chat[0].id;
      const userId = helper.getNewId();

      await addUser(userId);

      await chatModel.addEvent("changeName", {
        chatId,
        userId,
        name,
      });
      await chatModel.addEvent("changeStatus", {
        chatId,
        userId,
        status,
      });
      await chatModel.addEvent("changeCustomStatus", {
        chatId,
        userId,
        customStatus,
      });

      resolve({ chatId, userId });
    }
  });
}

function logout(chatId, userId) {
  return new Promise(async (resolve, reject) => {
    if (!userId) {
      resolve({ error: "User is not logged in" });
    } else {
      await removeUser(userId);

      await chatModel.deleteEvent("changeName", userId);
      await chatModel.deleteEvent("changeCustomStatus", userId);
      await chatModel.addEvent("changeStatus", {
        chatId,
        userId,
        status: "offline",
      });

      resolve({ user: userId });
    }
  });
}

function addUser(id) {
  return new Promise((resolve, reject) => {
    if (!chat[0].users.includes(id)) {
      chat[0].users.push(id);
      helper.writeJSONFile(filename, chat);
    }
    resolve();
  });
}

function removeUser(id) {
  return new Promise((resolve, reject) => {
    chat[0].users = chat[0].users.filter((uid) => uid !== id);
    helper.writeJSONFile(filename, chat);
    resolve();
  });
}

module.exports = {
  login,
  logout,
};
