const Drizzle = require("drizzle-orm/pg-core");
const { uuid, text, timestamp, json, pgTable } = Drizzle;
const { relations } = require("drizzle-orm");

// ADDRESSES //

const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey(),

  eventId: uuid("event_id").references(() => chatEvents.id),
  userId: text("user_id"),
});

const addressesRelations = relations(addresses, ({ one }) => ({
  event: one(chatEvents, {
    fields: [addresses.eventId],
    references: [chatEvents.id],
  }),
}));

// end of Addresses //

//  CHAT  //

const chat = pgTable("chat", {
  id: uuid("id").primaryKey(),
});

const chatRelations = relations(chat, ({ many }) => ({
  events: many(chatEvents),
  users: many(user),
}));

// end of Chat //

//  CHAT EVENTS  //

const chatEvents = pgTable("chat_events", {
  id: uuid("id").primaryKey(),

  type: text("type"),
  date: timestamp("date", { withTimezone: true }),
  body: json("body"),

  chatId: uuid("chat_id").references(() => chat.id),
  userId: uuid("user_id").references(() => user.id),
});

const chatEventsRelations = relations(chatEvents, ({ one, many }) => ({
  chat: one(chat, {
    fields: [chatEvents.chatId],
    references: [chat.id],
  }),
  user: one(user, {
    fields: [chatEvents.userId],
    references: [user.id],
  }),
  addresses: many(addresses),
}));

// end of Chat Events //

//  USER  //

const user = pgTable("user", {
  id: uuid("id").primaryKey(),
  chatId: uuid("chat_id").references(() => chat.id),
});

const userRelations = relations(user, ({ one, many }) => ({
  chat: one(chat, {
    fields: [user.chatId],
    references: [chat.id],
  }),
  events: many(chatEvents),
}));

// end of User //

module.exports = {
  addresses,
  addressesRelations,
  chat,
  chatRelations,
  chatEvents,
  chatEventsRelations,
  user,
  userRelations,
};
