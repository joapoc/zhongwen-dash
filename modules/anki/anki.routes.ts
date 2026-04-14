import { Router } from "express";
import { getAnkiDecks, openAnkiDeck } from "./anki.controller";

const router = Router();

router.get("/decks", getAnkiDecks);
router.post("/decks/open", openAnkiDeck);

export default router;
