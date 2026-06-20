import express from "express";
import type { DbClient } from "./db/types";
import { createApiRouter } from "./routes/api";

export function createApp(db: DbClient) {
  const app = express();

  app.use(express.json());

  app.use("/api", createApiRouter(db));

  return app;
}
