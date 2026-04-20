import express from "express";
import path from "node:path";

import { ankiRoutes } from "../modules/anki";
import { languageRoutes } from "../modules/language";
import { trendingRoutes } from "../modules/trending";
import apiRoutes from "./routes/api";
import webRoutes from "./routes/web";

const app = express();
const publicDir = path.join(__dirname, "..", "public");

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

app.use("/api", apiRoutes);
app.use("/api/anki", ankiRoutes);
app.use("/api/language", languageRoutes);
app.use("/api/trending", trendingRoutes);
app.use("/", webRoutes);

export default app;
