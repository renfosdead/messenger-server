const { db } = require("../data/db.js");
const { user } = require("../schema");
const { eq } = require("drizzle-orm");

async function addUser(chatId, userId) {
  const userExisted = await getUser(userId);
  if (!userExisted) {
    await db.insert(user).values({ id: userId, chatId });
  } else {
    await db.update(user).set({ chatId }).where(eq(user.id, userId));
  }
  return Promise.resolve();
}

const getUser = async (userId) => {
  const userResult = await db.query.user.findFirst({
    where: eq(user.id, userId),
    with: {
      chat: true,
    },
  });
  if (userResult) {
    return Promise.resolve(userId);
  }
  return Promise.resolve(null);
};

const getChatUsers = async (chatId) => {
  const usersResult = await db.query.user.findMany({
    where: eq(user.chatId, chatId),
  });
  return Promise.resolve(usersResult);
};

module.exports = {
  addUser,
  getUser,
  getChatUsers,
};
