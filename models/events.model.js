const DataHelper = require("../helpers/data.js");
const { db } = require("../data/db.js");
const { chatEvents, addresses } = require("../schema");
const { eq, and, inArray } = require("drizzle-orm");

async function getEvents(chatId) {
  const result = await db.query.chatEvents.findMany({
    where: eq(chatEvents.chatId, chatId),
    with: {
      user: true,
      chat: true,
    },
  });

  return Promise.resolve(result);
}

async function getEvent(type, userId) {
  const result = await db.query.chatEvents.findMany({
    where: and(
      eq(chatEvents.chatId, chatId),
      eq(chatEvents.type, type),
      eq(chatEvents.userId, userId)
    ),
    with: {
      user: true,
      chat: true,
    },
  });

  return Promise.resolve(result);
}

async function addEvent(type, evt) {
  const chat = await db.query.chat.findFirst({
    with: {
      users: true,
    },
  });

  const id = DataHelper.getNewId();
  const addressesPayload = ["-", "-"];
  chat.users.forEach((user, i) => {
    const uid = user.id;
    if (addressesPayload[i]) {
      addressesPayload[i] = uid;
    } else {
      addressesPayload.push(uid);
    }
  });

  newEvent = { id, type, date: new Date(), ...evt };
  await db.insert(chatEvents).values(newEvent);

  await db.insert(addresses).values(
    addressesPayload.map((addr) => ({
      id: DataHelper.getNewId(),
      eventId: id,
      userId: addr,
    }))
  );

  return Promise.resolve(newEvent);
}

async function refreshEventAddresses(newUser) {
  const evts = await db.query.chatEvents.findMany({
    with: { addresses: true },
  });

  const promises = [];
  evts.forEach((evt) => {
    const isUserSet = evt.addresses.find((addr) => addr.userId === newUser);

    if (!isUserSet) {
      const noAddress = evt.addresses.findIndex((addr) => addr.userId === "-");
      if (noAddress !== -1) {
        promises.push(
          db
            .update(addresses)
            .set({ userId: newUser })
            .where(eq(addresses.id, evt.addresses[noAddress].id))
        );
      } else {
        promises.push(
          db.insert(addresses).values({
            id: DataHelper.getNewId(),
            userId: newUser,
            eventId: evt.id,
          })
        );
      }
    }
  });
  await Promise.all(promises);

  return Promise.resolve();
}

async function readEvents(userId, events) {
  const readedEventsIds = events.map((e) => e.id);

  const chatEvents = await db.query.chatEvents.findMany({
    with: { addresses: true },
  });

  const promises = [];
  chatEvents.forEach(async (chatEvt) => {
    const isReaded = readedEventsIds.includes(chatEvt.id);
    if (isReaded) {
      const addressesToRemove = chatEvt.addresses.filter(
        (addr) => addr.userId === userId
      );
      addressesToRemove.forEach((addrToRemove) => {
        promises.push(
          db.delete(addresses).where(eq(addresses.id, addrToRemove.id))
        );
      });
    }
    const isReadedByAll = !chatEvt.addresses.length;
    if (isReadedByAll) {
      promises.push(removeEventWithAddresses(chatEvt.id));
    }
  });

  await Promise.all(promises);
  return Promise.resolve();
}

async function deleteEvent(type, userId) {
  await db.transaction(async (tx) => {
    let addressesToRemove = await tx.query.addresses.findMany({
      with: {
        event: {
          where: and(eq(chatEvents.type, type), eq(chatEvents.userId, userId)),
        },
      },
    });

    addressesToRemove = addressesToRemove
      .filter((addr) => addr.event)
      .map(({ id }) => id);

    if (addressesToRemove.length) {
      await tx
        .delete(addresses)
        .where(inArray(addresses.id, addressesToRemove));
    }

    await tx
      .delete(chatEvents)
      .where(and(eq(chatEvents.type, type), eq(chatEvents.userId, userId)));
  });
  return Promise.resolve();
}

async function removeEventWithAddresses(eventId) {
  await db.transaction(async (tx) => {
    await tx.delete(addresses).where(eq(addresses.eventId, eventId));
    await tx.delete(chatEvents).where(eq(chatEvents.id, eventId));
  });
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
