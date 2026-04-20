import { Request, Response } from "express";

import {
  clearFeedCache,
  getFeed,
  resolveHandleToChannelId,
  validateChannelIds,
} from "./ytfeed.service";

export async function getYtFeed(req: Request, res: Response) {
  const rawIds = typeof req.query.ids === "string" ? req.query.ids : "";
  const ids = validateChannelIds(rawIds);
  const refresh = req.query.refresh === "1" || req.query.refresh === "true";
  try {
    const result = await getFeed({ channelIds: ids, refresh });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(502).json({
      ok: false,
      route: "/api/yt-feed",
      message:
        error instanceof Error ? error.message : "Could not load YouTube feed.",
    });
  }
}

export async function deleteYtFeedCache(_req: Request, res: Response) {
  try {
    await clearFeedCache();
    return res.status(200).json({ ok: true, cleared: true });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : "Could not clear cache.",
    });
  }
}

export async function resolveYtHandle(req: Request, res: Response) {
  const handle = typeof req.query.handle === "string" ? req.query.handle : "";
  if (!handle.trim()) {
    return res.status(400).json({ ok: false, message: "handle is required." });
  }
  const channelId = await resolveHandleToChannelId(handle);
  if (!channelId) {
    return res.status(404).json({
      ok: false,
      handle,
      message: "Could not resolve handle to a channel ID.",
    });
  }
  return res.status(200).json({ ok: true, handle, channelId });
}
