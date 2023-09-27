const Drizzle = require("drizzle-orm/pg-core");
const { uuid, pgTable } = Drizzle;

const { EventsSchema } = require("./events.schema");
const { UserSchema } = require("./user.schema");

const AddressesSchema = pgTable("addresses", {
  id: uuid("id").primaryKey(),
  eventId: uuid("event_id").references(() => EventsSchema.id),
  userId: uuid("user_id").references(() => UserSchema.id),
});

module.exports = { AddressesSchema };
