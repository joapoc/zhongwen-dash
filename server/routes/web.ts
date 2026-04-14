import { Router } from "express";
import path from "node:path";

const router = Router();
const viewPath = path.join(__dirname, "..", "..", "views", "index.html");

router.get("/", (_request, response) => {
  response.sendFile(viewPath);
});

export default router;
