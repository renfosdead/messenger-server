const Drizzle = require("drizzle-orm/pg-core");
const { uuid, text, timestamp, json, pgTable } = Drizzle;

const { ChatSchema } = require("./chat.schema");
const { UserSchema } = require("./user.schema");

const EventsSchema = pgTable("chat_events", {
  id: uuid("id").primaryKey(),

  type: text("type"),
  date: timestamp("date"),
  body: json("body"),

  chatId: uuid("chat_id").references(() => ChatSchema.id),
  userId: uuid("user_id").references(() => UserSchema.id),
});

module.exports = { EventsSchema };
