const pg = require("pg");
const Vercel = require("@vercel/postgres");
const DrizzleNode = require("drizzle-orm/node-postgres");
const DrizzleVercel = require("drizzle-orm/vercel-postgres");
const schema = require("../schema");

const db =
  process.env.NODE_ENV === "prod"
    ? DrizzleVercel.drizzle(Vercel.sql)
    : DrizzleNode.drizzle(
        new pg.Pool({ connectionString: process.env.POSTGRES_URL }),
        { schema }
      );

exports.db = db;
