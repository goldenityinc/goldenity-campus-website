import express from "express";
import type { DbClient } from "./db/types";
import { createApiRouter } from "./routes/api";

// Replace this with a real pg client implementation.
const db: DbClient = {
  async query() {
    throw new Error("Implement pg client and inject it here");
  },
};

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use("/api", createApiRouter(db));

  return app;
}
