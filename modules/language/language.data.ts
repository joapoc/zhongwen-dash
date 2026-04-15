import { promises as fs } from "node:fs";
import path from "node:path";

import type { CedictEntry, PinyinReadingEntry } from "./language.types";

const languageDataDir = path.join(process.cwd(), "data", "language");

const cedictCandidates = [
  "cedict_ts.u8",
  "cedict_1_0_ts_utf-8_mdbg.txt",
];

const pinyinCandidates = [
  "pinyin_db.txt",
  "pinyin-db.txt",
];

type CacheEntry<T> = {
  filePath: string | null;
  mtimeMs: number;
  entries: T[];
};

const cedictCache: CacheEntry<CedictEntry> = {
  filePath: null,
  mtimeMs: 0,
  entries: [],
};

const pinyinCache: CacheEntry<PinyinReadingEntry> = {
  filePath: null,
  mtimeMs: 0,
  entries: [],
};

async function findExistingFile(candidates: string[]) {
  for (const filename of candidates) {
    const filePath = path.join(languageDataDir, filename);
    try {
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        return {
          filePath,
          mtimeMs: stats.mtimeMs,
        };
      }
    } catch {
      // Ignore missing files and continue checking the candidate list.
    }
  }

  return null;
}

function parseCedict(text: string) {
  const entries: CedictEntry[] = [];

  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) {
      continue;
    }

    const match = line.match(/^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+\/(.+)\/$/);

    if (!match) {
      continue;
    }

    entries.push({
      traditional: match[1],
      simplified: match[2],
      pinyin: match[3],
      english: match[4].split("/").filter(Boolean),
    });
  }

  return entries;
}

function parsePinyinDb(text: string) {
  const entries: PinyinReadingEntry[] = [];

  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) {
      continue;
    }

    const [character, codepoint, readings] = line.split("\t");

    if (!character || !codepoint || !readings) {
      continue;
    }

    entries.push({
      character,
      codepoint,
      readings: readings.split(",").map((reading) => reading.trim()).filter(Boolean),
    });
  }

  return entries;
}

export async function getCedictDataset() {
  const locatedFile = await findExistingFile(cedictCandidates);

  if (!locatedFile) {
    return {
      available: false,
      filePath: path.join(languageDataDir, cedictCandidates[0]),
      entries: [] as CedictEntry[],
    };
  }

  if (
    cedictCache.filePath === locatedFile.filePath &&
    cedictCache.mtimeMs === locatedFile.mtimeMs
  ) {
    return {
      available: true,
      filePath: cedictCache.filePath,
      entries: cedictCache.entries,
    };
  }

  const text = await fs.readFile(locatedFile.filePath, "utf8");

  cedictCache.filePath = locatedFile.filePath;
  cedictCache.mtimeMs = locatedFile.mtimeMs;
  cedictCache.entries = parseCedict(text);

  return {
    available: true,
    filePath: cedictCache.filePath,
    entries: cedictCache.entries,
  };
}

export async function getPinyinDbDataset() {
  const locatedFile = await findExistingFile(pinyinCandidates);

  if (!locatedFile) {
    return {
      available: false,
      filePath: path.join(languageDataDir, pinyinCandidates[0]),
      entries: [] as PinyinReadingEntry[],
    };
  }

  if (
    pinyinCache.filePath === locatedFile.filePath &&
    pinyinCache.mtimeMs === locatedFile.mtimeMs
  ) {
    return {
      available: true,
      filePath: pinyinCache.filePath,
      entries: pinyinCache.entries,
    };
  }

  const text = await fs.readFile(locatedFile.filePath, "utf8");

  pinyinCache.filePath = locatedFile.filePath;
  pinyinCache.mtimeMs = locatedFile.mtimeMs;
  pinyinCache.entries = parsePinyinDb(text);

  return {
    available: true,
    filePath: pinyinCache.filePath,
    entries: pinyinCache.entries,
  };
}

export function getLanguageDataDirectory() {
  return languageDataDir;
}
