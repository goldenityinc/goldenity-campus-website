import "dotenv/config";
import fs from "fs";
import path from "path";
import { Pool } from "pg";

async function runMigration(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const schemaPath = path.resolve(__dirname, "../../db/schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf8");

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    await pool.query(schemaSql);
    console.log("Migration successful");
  } catch (error) {
    console.error("Migration failed", error);
    throw error;
  } finally {
    await pool.end();
  }
}

void runMigration();
