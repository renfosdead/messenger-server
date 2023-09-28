const DrizzleNodeMigrator = require("drizzle-orm/postgres-js/migrator");
const DrizzleVercelMigrator = require("drizzle-orm/vercel-postgres/migrator");
const { db } = require("./db");

const { createChat } = require("../models/chat.model");

const migrationsFolder = __dirname + "/../migrations";
async function dbMigrate() {
  try {
    console.log("migration running...");
    if (process.env.NODE_ENV === "prod") {
      await DrizzleVercelMigrator.migrate(db, { migrationsFolder });
    } else {
      await DrizzleNodeMigrator.migrate(db, { migrationsFolder });
    }
    console.log("migration success");
    await createChat();
  } catch (err) {
    console.log("migration failed: ", err);
  }
}

exports.dbMigrate = dbMigrate;
