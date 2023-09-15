const FileHelper = require("../helpers/file.js");
const DataHelper = require("../helpers/data.js");

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
  const id = DataHelper.getNewId();
  const addresses = ["-", "-"];
  chat[0].users.forEach((uid, i) => {
    if (addresses[i]) {
      addresses[i] = uid;
    } else {
      addresses.push(uid);
    }
  });

  newEvent = { id, type, date: Date.now(), addresses, ...evt };
  chat[0].events.push(newEvent);
  FileHelper.writeJSONFile(chat);
  return Promise.resolve(newEvent);
}

function refreshEventAddresses(newUser) {
  const evts = chat[0].events;
  evts.forEach((evt) => {
    if (!evt.addresses.includes(newUser)) {
      const noAddress = evt.addresses.findIndex((a) => a === "-");
      if (noAddress !== -1) {
        evt.addresses[noAddress] = newUser;
      } else {
        evt.addresses.push(newUser);
      }
    }
  });
  chat[0].events = evts;
  FileHelper.writeJSONFile(chat);
  return Promise.resolve();
}

function readEvents(userId, events) {
  const resultEvents = [];

  const readedEventsIds = events.map((e) => e.id);

  const chatEvents = chat[0].events;
  chatEvents.forEach((chatEvt) => {
    const isReaded = readedEventsIds.includes(chatEvt.id);
    if (isReaded) {
      chatEvt.addresses = chatEvt.addresses.filter((id) => id !== userId);
    }
    const isReadedByAll = !chatEvt.addresses.length;
    if (!isReadedByAll) {
      resultEvents.push(chatEvt);
    }
  });

  chat[0].events = resultEvents;
  FileHelper.writeJSONFile(chat);
  return Promise.resolve();
}

function deleteEvent(type, userId) {
  chat[0].events = chat[0].events.filter(
    (p) => !(p.type === type && p.userId === userId)
  );
  FileHelper.writeJSONFile(chat);
  return Promise.resolve();
}

module.exports = {
  addEvent,
  getEvents,
  getEvent,
  readEvents,
  refreshEventAddresses,
  deleteEvent,
};
