const { db } = require("../data/db.js");
const { chat, user, chatEvents, addresses } = require("../schema");
const { getNewId } = require("../helpers/data");
const { eq } = require("drizzle-orm");

async function getFullChat() {
  const chat = await db.query.chat.findMany({
    with: {
      users: true,
      events: true,
    },
  });
  return Promise.resolve(chat);
}

async function clearFullChat() {
  await db.delete(addresses);
  await db.delete(chatEvents);
  await db.delete(user);
  const chat = await getFullChat();
  return Promise.resolve(chat);
}

const getChat = async (chatId) => {
  const tab = await db.query.chat.findFirst({
    where: eq(chat.id, chatId),
    with: {
      users: true,
      events: true,
    },
  });
  if (tab) {
    return Promise.resolve(tab);
  }
  return Promise.resolve(null);
};

const getChatId = async () => {
  const chat = await db.query.chat.findFirst();
  return Promise.resolve(chat.id);
};

async function createChat() {
  const chatExisted = await db.select().from(chat);
  if (chatExisted.length) {
    console.log("Chat already exists");
    await clearFullChat();
  } else {
    await db.insert(chat).values({ id: getNewId() });
    console.log("Chat created success");
  }
}

exports.getChat = getChat;
exports.getFullChat = getFullChat;
exports.clearFullChat = clearFullChat;
exports.getChatId = getChatId;
exports.createChat = createChat;
