const RequestHelper = require("../helpers/request.js");

const EventsModel = require("../models/events.model.js");
const EVENT_TYPES = require("../messenger-types/src/event_types.js");

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

      await EventsModel.addEvent(EVENT_TYPES.sendMessage, {
        chatId,
        userId,
        body: { message },
      });

      return Promise.resolve({ chatId, userId, message });
    }
  );
}

module.exports = {
  getEvents,
  sendMessage,
};
