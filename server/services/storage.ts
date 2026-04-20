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

const MasterySchema = new mongoose.Schema(
  {
    level: { type: String, required: true, unique: true, index: true },
    words: [String],
    updatedAt: String,
  },
  { strict: false, versionKey: false },
);

const LayoutSchema = new mongoose.Schema(
  {
    tabId: { type: String, required: true, unique: true, index: true },
    hidden: [String],
    order: [String],
    updatedAt: String,
  },
  { strict: false, versionKey: false },
);

export const SavedWord = mongoose.model("SavedWord", SavedWordSchema);
export const Challenge = mongoose.model("Challenge", ChallengeSchema);
export const Mastery = mongoose.model("Mastery", MasterySchema);
export const Layout = mongoose.model("Layout", LayoutSchema);

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

export async function getMastery(): Promise<Record<string, string[]>> {
  const rows = await Mastery.find({}, PROJECTION).lean();
  const out: Record<string, string[]> = {};
  for (const row of rows as Array<{ level?: string; words?: unknown }>) {
    if (!row || typeof row.level !== "string") continue;
    out[row.level] = Array.isArray(row.words) ? (row.words as string[]) : [];
  }
  return out;
}

// Upsert-per-level. Intentionally does NOT delete levels that are missing from
// the payload — mastery is additive and this makes a buggy client incapable of
// wiping the store.
export async function setMastery(
  mastery: Record<string, unknown>,
): Promise<Record<string, string[]>> {
  const entries = Object.entries(mastery || {});
  if (!entries.length) return getMastery();
  const ops = entries
    .filter(([level]) => typeof level === "string" && level.length > 0)
    .map(([level, words]) => {
      const cleanWords = Array.isArray(words)
        ? (words as unknown[]).filter((w): w is string => typeof w === "string" && w.length > 0)
        : [];
      return {
        updateOne: {
          filter: { level },
          update: {
            $set: { level, words: cleanWords, updatedAt: new Date().toISOString() },
          },
          upsert: true,
        },
      };
    });
  if (ops.length) {
    await Mastery.bulkWrite(ops, { ordered: false });
  }
  return getMastery();
}

type LayoutEntry = { hidden: string[]; order: string[] };

export async function getAllLayouts(): Promise<Record<string, LayoutEntry>> {
  const rows = await Layout.find({}, PROJECTION).lean();
  const out: Record<string, LayoutEntry> = {};
  for (const row of rows as Array<{ tabId?: string; hidden?: unknown; order?: unknown }>) {
    if (!row || typeof row.tabId !== "string") continue;
    out[row.tabId] = {
      hidden: Array.isArray(row.hidden) ? (row.hidden as string[]).filter((s) => typeof s === "string") : [],
      order: Array.isArray(row.order) ? (row.order as string[]).filter((s) => typeof s === "string") : [],
    };
  }
  return out;
}

// Upsert-per-tabId — a buggy client that sends an empty object can never wipe
// everything. Missing tabIds are untouched; only the tabIds in the payload are
// written.
export async function setAllLayouts(
  layouts: Record<string, unknown>,
): Promise<Record<string, LayoutEntry>> {
  const entries = Object.entries(layouts || {});
  if (!entries.length) return getAllLayouts();
  const ops = entries
    .filter(([tabId]) => typeof tabId === "string" && tabId.length > 0)
    .map(([tabId, raw]) => {
      const data = (raw && typeof raw === "object" ? raw : {}) as {
        hidden?: unknown;
        order?: unknown;
      };
      const hidden = Array.isArray(data.hidden)
        ? (data.hidden as unknown[]).filter((v): v is string => typeof v === "string")
        : [];
      const order = Array.isArray(data.order)
        ? (data.order as unknown[]).filter((v): v is string => typeof v === "string")
        : [];
      return {
        updateOne: {
          filter: { tabId },
          update: {
            $set: { tabId, hidden, order, updatedAt: new Date().toISOString() },
          },
          upsert: true,
        },
      };
    });
  if (ops.length) {
    await Layout.bulkWrite(ops, { ordered: false });
  }
  return getAllLayouts();
}

export async function resetLayout(tabId: string): Promise<void> {
  if (!tabId) return;
  await Layout.deleteOne({ tabId });
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
