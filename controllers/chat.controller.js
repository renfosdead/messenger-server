const RequestHelper = require("../helpers/request.js");
const ChatModel = require("../models/chat.model.js");

function getFullChat(req) {
  return RequestHelper.isCorrectHeaders(req).then(async () => {
    const chat = await ChatModel.getFullChat();
    return Promise.resolve(chat);
  });
}

function clearFullChat(req) {
  return RequestHelper.isCorrectHeaders(req).then(async () => {
    const result = await ChatModel.clearFullChat();
    return Promise.resolve(result);
  });
}

exports.getFullChat = getFullChat;
exports.clearFullChat = clearFullChat;
