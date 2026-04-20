import { Request, Response } from "express";

import {
  getCharacterDetails,
  getCharacterReadings,
  getHandwritingAudioPath,
  getHandwritingCharacters,
  getLanguageResourceStatus,
  getWordsByLevel,
  searchDictionary,
  searchTatoebaSentences,
  segmentChineseText,
  translateChineseSentences,
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

export async function getLanguageCharacter(req: Request, res: Response) {
  const character = typeof req.params.character === "string" ? req.params.character : "";

  if (!character.trim()) {
    return res.status(400).json({
      ok: false,
      route: "/api/language/character/:character",
      message: "character is required.",
    });
  }

  const result = await getCharacterDetails(character);

  if (!result) {
    return res.status(404).json({
      ok: false,
      route: "/api/language/character/:character",
      message: `No details found for "${character}".`,
    });
  }

  return res.status(200).json({
    ok: true,
    route: "/api/language/character/:character",
    result,
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

export async function getLanguageHandwriting(req: Request, res: Response) {
  const level = typeof req.query.level === "string" ? req.query.level : undefined;
  const result = await getHandwritingCharacters(level);

  return res.status(200).json({
    ok: true,
    route: "/api/language/handwriting",
    ...result,
  });
}

export async function streamLanguageAudio(req: Request, res: Response) {
  const term = typeof req.params.term === "string" ? req.params.term : "";

  if (!term.trim()) {
    return res.status(400).json({
      ok: false,
      route: "/api/language/audio/:term",
      message: "term is required.",
    });
  }

  const filePath = await getHandwritingAudioPath(term);

  if (!filePath) {
    return res.status(404).json({
      ok: false,
      route: "/api/language/audio/:term",
      message: `No audio file found for "${term}".`,
    });
  }

  res.setHeader("Cache-Control", "public, max-age=86400");
  return res.sendFile(filePath);
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

export async function translateLanguageText(req: Request, res: Response) {
  const text = typeof req.body?.text === "string" ? req.body.text : "";
  const texts = Array.isArray(req.body?.texts)
    ? req.body.texts.filter((item: unknown): item is string => typeof item === "string")
    : [];
  const inputs = texts.length ? texts : text.trim() ? [text] : [];

  if (!inputs.length) {
    return res.status(400).json({
      ok: false,
      route: "/api/language/translate",
      message: "text or texts is required.",
    });
  }

  try {
    const translations = await translateChineseSentences(inputs);

    return res.status(200).json({
      ok: true,
      route: "/api/language/translate",
      count: translations.length,
      translations,
      provider: "DeepL",
    });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      route: "/api/language/translate",
      message: error instanceof Error ? error.message : "DeepL translation failed.",
    });
  }
}

export async function getLanguageWords(req: Request, res: Response) {
  const level = typeof req.query.level === "string" ? req.query.level : undefined;
  const count = typeof req.query.count === "string" ? Number(req.query.count) : undefined;
  const random = req.query.random === "true" || req.query.random === "1";

  const result = await getWordsByLevel(level, count, random);

  return res.status(200).json({
    ok: true,
    route: "/api/language/words",
    ...result,
  });
}
