import { Router } from "express";

import {
  getLanguageCharacter,
  getLanguageReadings,
  getLanguageHandwriting,
  getLanguageStatus,
  getLanguageWords,
  searchLanguageDictionary,
  searchLanguageSentences,
  segmentLanguageText,
  streamLanguageAudio,
  translateLanguageText,
} from "./language.controller";

const router = Router();

router.get("/status", getLanguageStatus);
router.get("/dictionary/search", searchLanguageDictionary);
router.get("/handwriting", getLanguageHandwriting);
router.get("/audio/:term", streamLanguageAudio);
router.get("/readings/:character", getLanguageReadings);
router.get("/character/:character", getLanguageCharacter);
router.get("/words", getLanguageWords);
router.post("/segment", segmentLanguageText);
router.post("/translate", translateLanguageText);
router.get("/sentences/search", searchLanguageSentences);

export default router;
