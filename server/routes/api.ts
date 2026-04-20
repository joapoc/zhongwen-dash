import { Router } from "express";

import {
  getChallenges,
  getSavedWords,
  setChallenges,
  setSavedWords,
} from "../services/storage";

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

router.get("/challenges", async (_request, response) => {
  const challenges = await getChallenges();
  response.json({ challenges });
});

router.put("/challenges", async (request, response) => {
  const challenges = Array.isArray(request.body.challenges) ? request.body.challenges : [];
  const nextChallenges = await setChallenges(challenges);

  response.json({
    challenges: nextChallenges,
    count: nextChallenges.length,
  });
});

export default router;
