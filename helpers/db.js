const pg = require("pg");
const Vercel = require("@vercel/postgres");
const DrizzleNode = require("drizzle-orm/node-postgres");
const DrizzleVercel = require("drizzle-orm/vercel-postgres");

const DrizzleNodeMigrator = require("drizzle-orm/postgres-js/migrator");
const DrizzleVercelMigrator = require("drizzle-orm/vercel-postgres/migrator");
const { getNewId } = require("./data");
const { ChatSchema } = require("../schemas/chat.schema");

const db =
  process.env.NODE_ENV === "prod"
    ? DrizzleVercel.drizzle(Vercel.sql)
    : DrizzleNode.drizzle(
        new pg.Pool({ connectionString: process.env.POSTGRES_URL })
      );

async function connectDB() {
  try {
    const { rows, fields } = await db.select();
    console.log("DB connection success:", rows, fields);
    return Promise.resolve();
  } catch (err) {
    console.log("Error DB connection:", err);
    return Promise.resolve();
  }
}

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
    createChat();
  } catch (err) {
    console.log("migration failed: ", err);
  }
}

async function createChat() {
  const chatExisted = await db.select().from(ChatSchema);
  if (chatExisted.length) {
    console.log("Chat already exists");
  } else {
    await db.insert(ChatSchema).values({ id: getNewId() });
    console.log("chat created success");
  }
}

module.exports = {
  connectDB,
  dbMigrate,
};
