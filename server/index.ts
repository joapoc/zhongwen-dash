import "dotenv/config";
import app from "./app";
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
