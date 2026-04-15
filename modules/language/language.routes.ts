import { Router } from "express";

import {
  getLanguageReadings,
  getLanguageStatus,
  searchLanguageDictionary,
  searchLanguageSentences,
  segmentLanguageText,
} from "./language.controller";

const router = Router();

router.get("/status", getLanguageStatus);
router.get("/dictionary/search", searchLanguageDictionary);
router.get("/readings/:character", getLanguageReadings);
router.post("/segment", segmentLanguageText);
router.get("/sentences/search", searchLanguageSentences);

export default router;
