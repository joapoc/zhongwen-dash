import "dotenv/config";
import app from "./app";
import { closeBrowser } from "../modules/reading/reading.browser";
import { connectMongo } from "./services/mongo";
import { migrateFileCacheIfNeeded } from "./services/storage";

const port = Number(process.env.PORT) || 3000;

async function start() {
  await connectMongo();
  console.log("MongoDB connected.");
  await migrateFileCacheIfNeeded();

  app.listen(port, () => {
    console.log(`Zhongwen Dash server running at http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error("Startup failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});

async function shutdown(signal: string) {
  // Release the Playwright-managed Chromium so `tsx watch` doesn't leak a
  // browser process on every code reload.
  try {
    await closeBrowser();
  } catch (err) {
    console.error("Failed to close browser on shutdown:", err);
  }
  process.exit(signal === "SIGINT" ? 130 : 0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
