import { Request, Response } from "express";

import {
  getCharacterReadings,
  getLanguageResourceStatus,
  searchDictionary,
  searchTatoebaSentences,
  segmentChineseText,
} from "./language.service";

export async function getLanguageStatus(_req: Request, res: Response) {
  const status = await getLanguageResourceStatus();
  return res.status(200).json(status);
}

export async function searchLanguageDictionary(req: Request, res: Response) {
  const query = typeof req.query.query === "string" ? req.query.query : "";
  const limit = typeof req.query.limit === "string" ? Number(req.query.limit) : undefined;

  if (!query.trim()) {
    return res.status(400).json({
      ok: false,
      route: "/api/language/dictionary/search",
      message: "query is required.",
    });
  }

  const results = await searchDictionary(query, limit);

  return res.status(200).json({
    ok: true,
    route: "/api/language/dictionary/search",
    query,
    count: results.length,
    results,
  });
}

export async function getLanguageReadings(req: Request, res: Response) {
  const character = typeof req.params.character === "string" ? req.params.character : "";

  if (!character.trim()) {
    return res.status(400).json({
      ok: false,
      route: "/api/language/readings/:character",
      message: "character is required.",
    });
  }

  const result = await getCharacterReadings(character);

  if (!result) {
    return res.status(404).json({
      ok: false,
      route: "/api/language/readings/:character",
      message: `No readings found for "${character}".`,
    });
  }

  return res.status(200).json({
    ok: true,
    route: "/api/language/readings/:character",
    result,
  });
}

export async function segmentLanguageText(req: Request, res: Response) {
  const text = typeof req.body?.text === "string" ? req.body.text : "";

  if (!text.trim()) {
    return res.status(400).json({
      ok: false,
      route: "/api/language/segment",
      message: "text is required.",
    });
  }

  const result = await segmentChineseText(text);

  return res.status(200).json({
    ok: true,
    route: "/api/language/segment",
    text,
    ...result,
  });
}

export async function searchLanguageSentences(req: Request, res: Response) {
  const query = typeof req.query.query === "string" ? req.query.query : "";
  const limit = typeof req.query.limit === "string" ? Number(req.query.limit) : undefined;

  if (!query.trim()) {
    return res.status(400).json({
      ok: false,
      route: "/api/language/sentences/search",
      message: "query is required.",
    });
  }

  try {
    const results = await searchTatoebaSentences(query, limit);

    return res.status(200).json({
      ok: true,
      route: "/api/language/sentences/search",
      query,
      count: results.length,
      upstream: "Tatoeba API v0",
      results,
    });
  } catch (error) {
    return res.status(502).json({
      ok: false,
      route: "/api/language/sentences/search",
      message:
        error instanceof Error ? error.message : "Could not reach the Tatoeba API.",
    });
  }
}
