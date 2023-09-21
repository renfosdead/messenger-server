const FileHelper = require("../helpers/file.js");

function addUser(id) {
  const chat = FileHelper.getChatData();

  if (!chat[0].users.includes(id)) {
    chat[0].users.push(id);
    FileHelper.writeJSONFile(chat);
  }
  return Promise.resolve();
}

const getUser = (userId) => {
  const chat = FileHelper.getChatData();

  if (chat[0].users.includes(userId)) {
    return Promise.resolve(userId);
  }
  return Promise.resolve(null);
};

module.exports = {
  addUser,
  getUser,
};
