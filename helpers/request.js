const ChatModel = require("../models/chat.model.js");
const UserModel = require("../models/user.model.js");

async function isCorrectHeaders(req) {
  const { chatid, userid } = req.headers;
  if (
    chatid &&
    userid &&
    typeof chatid === "string" &&
    typeof userid === "string"
  ) {
    const chatExisted = await ChatModel.getChat(chatid);
    const userExisted = await UserModel.getUser(userid);
    if (chatExisted && userExisted) {
      return Promise.resolve(chatExisted && userExisted);
    }
  }
  throw { error: "Wrong headers" };
}

function getRequestParams(req) {
  const { chatid, userid } = req.headers;

  return {
    chatId: chatid,
    userId: userid,
  };
}

exports.isCorrectHeaders = isCorrectHeaders;
exports.getRequestParams = getRequestParams;
