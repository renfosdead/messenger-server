const RequestHelper = require("../helpers/request.js");

const EventsModel = require("../models/events.model.js");
const PushModel = require("../models/push.model.js");

const EVENT_TYPES = require("../messenger-types/src/event_types.js");
const { getChatUsers } = require("../models/user.model.js");

function getEvents(req) {
  return RequestHelper.isCorrectHeaders(req).then(
    async ({ userId, chatId }) => {
      const chatEvents = await EventsModel.getEvents(chatId);
      await EventsModel.readEvents(userId, chatEvents || []);
      return Promise.resolve(chatEvents);
    }
  );
}

function sendMessage(req) {
  return RequestHelper.isCorrectHeaders(req).then(
    async ({ userId, chatId }) => {
      const { message } = req.body;
      const newEvent = {
        chatId,
        userId,
        body: { message },
      };

      await EventsModel.addEvent(EVENT_TYPES.sendMessage, newEvent);

      const addresses = await getChatUsers(chatId);
      await PushModel.pushNewMessage(newEvent, addresses);

      return Promise.resolve({ chatId, userId, message });
    }
  );
}

function sendImage(req) {
  return RequestHelper.isCorrectHeaders(req).then(
    async ({ userId, chatId }) => {
      const { image } = req.body;

      //TODO: add imageUrl
      const newImageUrl =
        "https://www.kasandbox.org/programming-images/avatars/duskpin-sapling.png";

      const newEvent = {
        chatId,
        userId,
        body: { image: newImageUrl, message: "Картинка" },
      };

      await EventsModel.addEvent(EVENT_TYPES.sendImage, newEvent);

      const addresses = await getChatUsers(chatId);
      await PushModel.pushNewMessage(newEvent, addresses);

      return Promise.resolve({ chatId, userId, image: newImageUrl });
    }
  );
}

module.exports = {
  getEvents,
  sendMessage,
  sendImage,
};
