import { promises as fs } from "node:fs";
import path from "node:path";

import mongoose from "mongoose";

const SavedWordSchema = new mongoose.Schema(
  {
    cn: { type: String, required: true, unique: true, index: true },
    py: String,
    en: String,
    source: String,
    sourceArticle: String,
    addedAt: String,
    inFlashcards: Boolean,
  },
  { strict: false, versionKey: false },
);

const ChallengeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    createdAt: String,
    level: String,
    words: [Object],
    quizScore: Number,
    quizTotal: Number,
  },
  { strict: false, versionKey: false },
);

export const SavedWord = mongoose.model("SavedWord", SavedWordSchema);
export const Challenge = mongoose.model("Challenge", ChallengeSchema);

const PROJECTION = { _id: 0 };

export async function getSavedWords(): Promise<unknown[]> {
  return SavedWord.find({}, PROJECTION).lean();
}

export async function setSavedWords(savedWords: unknown[]): Promise<unknown[]> {
  const items = Array.isArray(savedWords) ? savedWords : [];
  await SavedWord.deleteMany({});
  if (items.length) {
    await SavedWord.insertMany(items, { ordered: false });
  }
  return getSavedWords();
}

export async function getChallenges(): Promise<unknown[]> {
  return Challenge.find({}, PROJECTION).sort({ createdAt: -1 }).lean();
}

export async function setChallenges(challenges: unknown[]): Promise<unknown[]> {
  const items = Array.isArray(challenges) ? challenges : [];
  await Challenge.deleteMany({});
  if (items.length) {
    await Challenge.insertMany(items, { ordered: false });
  }
  return getChallenges();
}

export async function migrateFileCacheIfNeeded(): Promise<void> {
  const cacheFile = path.join(process.cwd(), "data", "cache.json");

  let raw: string;
  try {
    raw = await fs.readFile(cacheFile, "utf8");
  } catch {
    return;
  }

  let parsed: { savedWords?: unknown[]; challenges?: unknown[] };
  try {
    parsed = JSON.parse(raw || "{}");
  } catch {
    console.warn("[migrate] cache.json is not valid JSON — skipping migration.");
    return;
  }

  const legacyWords = Array.isArray(parsed.savedWords) ? parsed.savedWords : [];
  const legacyChallenges = Array.isArray(parsed.challenges) ? parsed.challenges : [];

  const [wordsCount, challengesCount] = await Promise.all([
    SavedWord.countDocuments(),
    Challenge.countDocuments(),
  ]);

  if (wordsCount === 0 && legacyWords.length) {
    await SavedWord.insertMany(legacyWords, { ordered: false });
    console.log(`[migrate] Imported ${legacyWords.length} saved words from cache.json.`);
  }
  if (challengesCount === 0 && legacyChallenges.length) {
    await Challenge.insertMany(legacyChallenges, { ordered: false });
    console.log(`[migrate] Imported ${legacyChallenges.length} challenges from cache.json.`);
  }

  try {
    await fs.rename(cacheFile, `${cacheFile}.migrated`);
    console.log("[migrate] Renamed cache.json to cache.json.migrated.");
  } catch {
    // Non-fatal; the guard above already prevents double-imports.
  }
}
