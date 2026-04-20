import { Request, Response } from "express";

import { fetchTrending } from "./trending.service";

export async function getTrending(req: Request, res: Response) {
  const force = req.query.force === "1" || req.query.force === "true";
  try {
    const snapshot = await fetchTrending(force);
    return res.status(200).json({
      ok: true,
      route: "/api/trending",
      fetchedAt: snapshot.fetchedAt,
      sourceCount: snapshot.sources.length,
      itemCount: snapshot.sources.reduce((n, s) => n + s.items.length, 0),
      sources: snapshot.sources,
    });
  } catch (error) {
    return res.status(502).json({
      ok: false,
      route: "/api/trending",
      message:
        error instanceof Error
          ? error.message
          : "Could not fetch trending topics.",
    });
  }
}
