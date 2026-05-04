import { Request, Response } from "express";

import {
  clearCaches,
  getArticle,
  getFeedItems,
  getFeedItemsByTag,
  listFeeds,
} from "./reading.service";

export function getFeeds(_req: Request, res: Response) {
  return res.status(200).json({ ok: true, feeds: listFeeds() });
}

export async function getFeedItemsController(req: Request, res: Response) {
  const feedId = typeof req.params.feedId === "string" ? req.params.feedId : "";
  const refresh = req.query.refresh === "1" || req.query.refresh === "true";
  if (!feedId) {
    return res.status(400).json({ ok: false, message: "feedId is required." });
  }
  try {
    const result = await getFeedItems(feedId, refresh);
    return res.status(200).json({
      ok: true,
      feedId,
      cached: result.cached,
      stale: result.stale,
      message: result.message,
      fetchedAt: result.fetchedAt,
      total: result.items.length,
      items: result.items,
    });
  } catch (err) {
    return res.status(502).json({
      ok: false,
      feedId,
      message: err instanceof Error ? err.message : "Could not load feed.",
    });
  }
}

export async function getFeedItemsByTagController(req: Request, res: Response) {
  const tag = typeof req.params.tag === "string" ? req.params.tag : "";
  const refresh = req.query.refresh === "1" || req.query.refresh === "true";
  if (!tag) {
    return res.status(400).json({ ok: false, message: "tag is required." });
  }
  try {
    const result = await getFeedItemsByTag(tag, refresh);
    return res.status(200).json({
      ok: true,
      tag: result.tag,
      feeds: result.feeds,
      fetchedAt: result.fetchedAt,
      total: result.total,
      failed: result.failed,
      items: result.items,
    });
  } catch (err) {
    return res.status(502).json({
      ok: false,
      tag,
      message: err instanceof Error ? err.message : "Could not load feeds.",
    });
  }
}

export async function getArticleController(req: Request, res: Response) {
  const url = typeof req.query.url === "string" ? req.query.url : "";
  const refresh = req.query.refresh === "1" || req.query.refresh === "true";
  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ ok: false, message: "Valid http(s) url is required." });
  }
  try {
    const article = await getArticle(url, refresh);
    return res.status(200).json(article);
  } catch (err) {
    return res.status(502).json({
      ok: false,
      url,
      message: err instanceof Error ? err.message : "Could not extract article.",
    });
  }
}

export async function deleteReadingCache(_req: Request, res: Response) {
  try {
    await clearCaches();
    return res.status(200).json({ ok: true, cleared: true });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err instanceof Error ? err.message : "Could not clear cache.",
    });
  }
}
