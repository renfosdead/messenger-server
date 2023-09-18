const ChatModel = require("../models/chat.model.js");
const UserModel = require("../models/user.model.js");

const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const tokenKey = process.env.NODE_TOKEN_KEY;

async function isCorrectHeaders(req) {
  if (req.headers.authorization) {
    jwt.verify(req.headers.authorization, tokenKey, async (err, payload) => {
      if (err) {
        throw { error: "Wrong headers" };
      } else if (payload) {
        const { chatId, userId } = jwt_decode(req.headers.authorization);
        if (
          chatId &&
          userId &&
          typeof chatId === "string" &&
          typeof userId === "string"
        ) {
          const chatExisted = await ChatModel.getChat(chatId);
          const userExisted = await UserModel.getUser(userId);
          if (chatExisted && userExisted) {
            return Promise.resolve(chatExisted && userExisted);
          }
        }
      }
    });
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
