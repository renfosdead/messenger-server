const filename = "../data/chat.json";

let chat = require(filename);
const helper = require("../helpers/helper.js");

function getEvents() {
  return new Promise((resolve, reject) => {
    if (!chat[0].events.length) {
      resolve([]);
    }
    resolve(chat[0].events);
  });
}

function getEvent(id) {
  return new Promise((resolve, reject) => {
    helper
      .mustBeInArray(chat[0].events, id)
      .then((event) => resolve(event))
      .catch((err) => resolve(null));
  });
}

function addEvent(evt) {
  return new Promise(async (resolve, reject) => {
    const existedEvent = await getEvent(evt.type);
    if (existedEvent) {
      await deleteEvent(existedEvent.id);
    }
    const id = { id: helper.getNewId() };
    newEvent = { ...id, ...evt };
    chat[0].events.push(newEvent);
    helper.writeJSONFile(filename, chat);
    resolve(newEvent);
  });
}

function deleteEvent(id) {
  return new Promise((resolve, reject) => {
    helper
      .mustBeInArray(chat[0].events, id)
      .then(() => {
        chat[0].events = chat[0].events.filter((p) => p.id !== id);
        helper.writeJSONFile(filename, chat);
        resolve();
      })
      .catch((err) => reject(err));
  });
}

module.exports = {
  addEvent,
  getEvents,
  getEvent,
  deleteEvent,
};
