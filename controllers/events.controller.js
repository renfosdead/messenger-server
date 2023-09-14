const RequestHelper = require("../helpers/request.js");

const EventsModel = require("../models/events.model.js");

function getEvents(req) {
  return RequestHelper.isCorrectHeaders(req).then(async () => {
    const { chatId } = RequestHelper.getRequestParams(req);
    const chatEvents = await EventsModel.getEvents(chatId);

    await EventsModel.deleteEvents(
      (chatEvents || [])
        .filter((e) => e.type !== EVENT_TYPES.sendMessage)
        .map((e) => e.id)
    );
    return Promise.resolve(chatEvents);
  });
}

function sendMessage(req) {
  return RequestHelper.isCorrectHeaders(req).then(async () => {
    const { userId, chatId } = RequestHelper.getRequestParams(req);
    const { message } = req.body;

    await EventsModel.addEvent(EVENTS.sendMessage, {
      chatId,
      userId,
      message,
    });

    return Promise.resolve({ chatId, userId, message });
  });
}

module.exports = {
  getEvents,
  sendMessage,
};
