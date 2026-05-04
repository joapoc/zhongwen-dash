import { Router } from "express";

import {
  deleteReadingCache,
  getArticleController,
  getFeedItemsByTagController,
  getFeedItemsController,
  getFeeds,
} from "./reading.controller";

const router = Router();

router.get("/feeds", getFeeds);
router.get("/feed/by-tag/:tag", getFeedItemsByTagController);
router.get("/feed/:feedId", getFeedItemsController);
router.get("/article", getArticleController);
router.delete("/cache", deleteReadingCache);

export default router;
