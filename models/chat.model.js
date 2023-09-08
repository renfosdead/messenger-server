const helper = require("../helpers/helper.js");
let chat = require(helper.getFileName());

function getEvents(chatId, userId) {
  return new Promise((resolve, reject) => {
    if (!chatId || !userId) {
      resolve({ error: "No data" });
    } else {
      const chatRoom = chat.find((e) => e.id === chatId);
      resolve(chatRoom.events);
    }
  });
}

function getEvent(type, userId) {
  return new Promise((resolve, reject) => {
    const evt = chat[0].events.find(
      (e) => e.type === type && e.userId === userId
    );
    resolve(evt);
  });
}

function addEvent(type, evt) {
  return new Promise((resolve, reject) => {
    chat[0].events = chat[0].events.filter(
      (p) => !(p.type === type && p.userId === evt.userId)
    );

    const id = { id: helper.getNewId() };
    newEvent = { ...id, type, ...evt };
    chat[0].events.push(newEvent);
    helper.writeJSONFile(chat);
    resolve(newEvent);
  });
}

function deleteEvent(type, userId) {
  return new Promise((resolve, reject) => {
    chat[0].events = chat[0].events.filter(
      (p) => !(p.type === type && p.userId === userId)
    );

    helper.writeJSONFile(chat);
    resolve();
  });
}

function deleteEvents(eventIds) {
  return new Promise((resolve, reject) => {
    chat[0].events = chat[0].events.filter((p) => !eventIds.includes(p.id));

    helper.writeJSONFile(chat);
    resolve();
  });
}

module.exports = {
  addEvent,
  getEvents,
  getEvent,
  deleteEvent,
  deleteEvents,
};
