const FileHelper = require("../helpers/file.js");
const DataHelper = require("../helpers/data.js");

const EVENT_TYPES = require("../messenger-types/src/event_types");
let chat = require(FileHelper.getFileName());

function getEvents() {
  return Promise.resolve(chat[0].events);
}

function getEvent(type, userId) {
  const evt = chat[0].events.find(
    (e) => e.type === type && e.userId === userId
  );
  return Promise.resolve(evt);
}

function addEvent(type, evt) {
  chat[0].events =
    type !== EVENT_TYPES.sendMessage
      ? chat[0].events.filter(
          (p) => !(p.type === type && p.userId === evt.userId)
        )
      : chat[0].events;

  const id = { id: DataHelper.getNewId() };
  newEvent = { ...id, type, ...evt, date: Date.now() };
  chat[0].events.push(newEvent);
  FileHelper.writeJSONFile(chat);
  return Promise.resolve(newEvent);
}

function deleteEvent(type, userId) {
  chat[0].events = chat[0].events.filter(
    (p) => !(p.type === type && p.userId === userId)
  );
  FileHelper.writeJSONFile(chat);
  return Promise.resolve();
}

function deleteEvents(eventIds) {
  chat[0].events = chat[0].events.filter((p) => !eventIds.includes(p.id));

  FileHelper.writeJSONFile(chat);
  return Promise.resolve();
}

module.exports = {
  addEvent,
  getEvents,
  getEvent,
  deleteEvent,
  deleteEvents,
};
