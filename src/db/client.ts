import { Pool } from "pg";
import type { DbClient } from "./types";

const connectionString = process.env.DATABASE_URL;
const pool = connectionString ? new Pool({ connectionString }) : null;

export const dbClient: DbClient = {
  async query<T = Record<string, unknown>>(sql: string, params?: unknown[]) {
    if (!pool) {
      // Fallback for demo mode without database connection.
      return { rows: [] as T[] };
    }

    const result = await pool.query(sql, params);
    return { rows: result.rows as T[] };
  },
};

export async function closeDbPool(): Promise<void> {
  if (pool) {
    await pool.end();
  }
}
