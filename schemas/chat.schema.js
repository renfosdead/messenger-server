const Drizzle = require("drizzle-orm/pg-core");

const { uuid, pgTable } = Drizzle;

const ChatSchema = pgTable("chat", {
  id: uuid("id").primaryKey(),
});

module.exports = { ChatSchema };
