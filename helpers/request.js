const ChatModel = require("../models/chat.model.js");
const UserModel = require("../models/user.model.js");

const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const tokenKey = process.env.NODE_TOKEN_KEY;

async function isCorrectHeaders(req) {
  try {
    const decoded = jwt.verify(req.headers.authorization, tokenKey);
    const { chatId, userId } = decoded;
    if (
      chatId &&
      userId &&
      typeof chatId === "string" &&
      typeof userId === "string"
    ) {
      const chatExisted = await ChatModel.getChat(chatId);
      const userExisted = await UserModel.getUser(userId);
      if (chatExisted && userExisted) {
        return Promise.resolve({
          chatId,
          userId,
        });
      }
    }
  } catch (err) {
    return Promise.reject({ error: "Wrong headers" });
  }
}

function getRequestParams(req) {
  try {
    const { chatId, userId } = jwt_decode(req.headers.authorization);

    return {
      chatId,
      userId,
    };
  } catch {
    return {};
  }
}

function getToken({ userId, chatId }) {
  return jwt.sign({ userId, chatId }, tokenKey);
}

exports.isCorrectHeaders = isCorrectHeaders;
exports.getRequestParams = getRequestParams;
exports.getToken = getToken;
