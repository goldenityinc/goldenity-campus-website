import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { createApp } from "./app";
import { closeDbPool, dbClient } from "./db/client";

const PORT = Number(process.env.PORT || 3000);
const app = createApp(dbClient);

const frontendFromDistRuntime = path.join(__dirname, "../src/frontend");
const frontendFromTsRuntime = path.join(__dirname, "frontend");
const frontendDir = fs.existsSync(frontendFromDistRuntime)
  ? frontendFromDistRuntime
  : frontendFromTsRuntime;

app.use(express.static(frontendDir));
app.get("/", (_req, res) => {
  res.sendFile(path.join(frontendDir, "dosen-wali-dashboard.html"));
});

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});

async function shutdown(signal: string): Promise<void> {
  // eslint-disable-next-line no-console
  console.log(`Received ${signal}, shutting down...`);

  server.close(async () => {
    await closeDbPool();
    process.exit(0);
  });
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
