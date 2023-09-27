const Drizzle = require("drizzle-orm/pg-core");
const { uuid, pgTable } = Drizzle;

const { ChatSchema } = require("./chat.schema");

const UserSchema = pgTable("user", {
  id: uuid("id").primaryKey(),
  chatId: uuid("chat_id").references(() => ChatSchema.id),
});

module.exports = { UserSchema };
