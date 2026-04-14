import { Router } from "express";

import { getSavedWords, setSavedWords } from "../services/file-cache";

const router = Router();

router.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "zhongwen-dash",
    timestamp: new Date().toISOString(),
  });
});

router.get("/words", async (_request, response) => {
  const savedWords = await getSavedWords();
  response.json({ savedWords });
});

router.put("/words", async (request, response) => {
  const savedWords = Array.isArray(request.body.savedWords) ? request.body.savedWords : [];
  const nextSavedWords = await setSavedWords(savedWords);

  response.json({
    savedWords: nextSavedWords,
    count: nextSavedWords.length,
  });
});

export default router;
