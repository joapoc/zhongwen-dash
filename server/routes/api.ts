import { Router } from "express";

import {
  getAllLayouts,
  getChallenges,
  getMastery,
  getSavedWords,
  resetLayout,
  setAllLayouts,
  setChallenges,
  setMastery,
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

router.get("/layout", async (_request, response) => {
  const layouts = await getAllLayouts();
  response.json({ ok: true, layouts });
});

router.put("/layout", async (request, response) => {
  const payload =
    request.body && typeof request.body.layouts === "object" && request.body.layouts !== null
      ? (request.body.layouts as Record<string, unknown>)
      : {};
  const next = await setAllLayouts(payload);
  response.json({ ok: true, layouts: next, tabCount: Object.keys(next).length });
});

router.delete("/layout/:tabId", async (request, response) => {
  const tabId = typeof request.params.tabId === "string" ? request.params.tabId : "";
  if (!tabId) {
    response.status(400).json({ ok: false, message: "tabId is required." });
    return;
  }
  await resetLayout(tabId);
  response.json({ ok: true, tabId, reset: true });
});

router.get("/mastery", async (_request, response) => {
  const mastery = await getMastery();
  response.json({ mastery });
});

router.put("/mastery", async (request, response) => {
  const payload =
    request.body && typeof request.body.mastery === "object" && request.body.mastery !== null
      ? (request.body.mastery as Record<string, unknown>)
      : {};
  const nextMastery = await setMastery(payload);
  response.json({
    ok: true,
    mastery: nextMastery,
    levelCount: Object.keys(nextMastery).length,
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
