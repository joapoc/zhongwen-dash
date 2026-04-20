import { Router } from "express";

import {
  deleteYtFeedCache,
  getYtFeed,
  resolveYtHandle,
} from "./ytfeed.controller";

const router = Router();

router.get("/", getYtFeed);
router.get("/resolve", resolveYtHandle);
router.delete("/cache", deleteYtFeedCache);

export default router;
