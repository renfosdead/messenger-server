const FileHelper = require("../helpers/file.js");

let chat = require(FileHelper.getFileName());

function getFullChat() {
  return Promise.resolve(chat);
}

function clearFullChat() {
  chat = [
    {
      id: chat[0].id,
      users: [],
      events: [],
    },
  ];
  FileHelper.writeJSONFile(chat);
  return Promise.resolve(chat);
}

const getChat = (chatId) => {
  const tab = chat.find((item) => item.id === chatId);
  if (tab) {
    return Promise.resolve(tab);
  }
  return Promise.resolve(null);
};

const getChatId = () => Promise.resolve(chat[0].id);

exports.getChat = getChat;
exports.getFullChat = getFullChat;
exports.clearFullChat = clearFullChat;
exports.getChatId = getChatId;
