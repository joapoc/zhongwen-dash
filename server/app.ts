import express from "express";
import path from "node:path";

import { ankiRoutes } from "../modules/anki";
import apiRoutes from "./routes/api";
import webRoutes from "./routes/web";
import { ensureCacheFile } from "./services/file-cache";

const app = express();
const publicDir = path.join(__dirname, "..", "public");

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

ensureCacheFile().catch(() => {
  // The cache file is lazy-created on boot; ignore startup failures here
  // so the app can still serve the UI while surfacing errors via the API.
});

app.use("/api", apiRoutes);
app.use("/api/anki", ankiRoutes);
app.use("/", webRoutes);

export default app;
