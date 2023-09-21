const FileHelper = require("../helpers/file.js");

function getFullChat() {
  const chat = FileHelper.getChatData();

  return Promise.resolve(chat);
}

function clearFullChat() {
  const chat = FileHelper.getChatData();
  const payload = [
    {
      id: chat[0].id,
      users: [],
      events: [],
    },
  ];
  FileHelper.writeJSONFile(payload);
  return Promise.resolve(payload);
}

const getChat = (chatId) => {
  const chat = FileHelper.getChatData();
  const tab = chat.find((item) => item.id === chatId);
  if (tab) {
    return Promise.resolve(tab);
  }
  return Promise.resolve(null);
};

const getChatId = () => {
  const chat = FileHelper.getChatData();

  return Promise.resolve(chat[0].id);
};

exports.getChat = getChat;
exports.getFullChat = getFullChat;
exports.clearFullChat = clearFullChat;
exports.getChatId = getChatId;
