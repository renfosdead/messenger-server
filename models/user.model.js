const FileHelper = require("../helpers/file.js");

let chat = require(FileHelper.getFileName());

function addUser(id) {
  if (!chat[0].users.includes(id)) {
    chat[0].users.push(id);
    FileHelper.writeJSONFile(chat);
  }
  return Promise.resolve();
}

const getUser = (userId) => {
  if (chat[0].users.includes(userId)) {
    return Promise.resolve(userId);
  }
  return Promise.resolve(null);
};

module.exports = {
  addUser,
  getUser,
};
