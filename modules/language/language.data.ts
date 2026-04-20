import { promises as fs } from "node:fs";
import path from "node:path";

import type {
  CedictEntry,
  HandwritingLevel,
  HskLevel,
  PinyinReadingEntry,
} from "./language.types";

const languageDataDir = path.join(process.cwd(), "data", "language");
const hsk30DataDir = path.join(process.cwd(), "data", "hsk3.0-json");
const handwriting2025DataDir = path.join(process.cwd(), "data", "HSK 3.0 Handwritten 2025");
const handwritingWords2025DataDir = path.join(process.cwd(), "data", "HSK 3.0 Words 2025");
const handwritingAudio2025DataDir = path.join(process.cwd(), "data", "HSK 3.0 Audio 2025");

const cedictCandidates = [
  "cedict_ts.u8",
  "cedict_1_0_ts_utf-8_mdbg.txt",
];

const pinyinCandidates = [
  "pinyin_db.txt",
  "pinyin-db.txt",
];

const hsk30Candidates: Array<{ filename: string; level: HskLevel }> = [
  { filename: "hsk1.json", level: 1 },
  { filename: "hsk2.json", level: 2 },
  { filename: "hsk3.json", level: 3 },
  { filename: "hsk4.json", level: 4 },
  { filename: "hsk5.json", level: 5 },
  { filename: "hsk6.json", level: 6 },
  { filename: "hsk7-9.json", level: "7-9" },
];

const handwriting2025Candidates: Array<{ filename: string; level: HandwritingLevel }> = [
  { filename: "HSK_Level_1-2_handwritten.txt", level: "1-2" },
  { filename: "HSK_Level_3_handwritten.txt", level: 3 },
  { filename: "HSK_Level_4_handwritten.txt", level: 4 },
  { filename: "HSK_Level_5_handwritten.txt", level: 5 },
  { filename: "HSK_Level_6_handwritten.txt", level: 6 },
  { filename: "HSK_Level_7-9_handwritten.txt", level: "7-9" },
];

const handwritingWord2025Candidates: Array<{ filenames: string[]; level: HandwritingLevel }> = [
  { filenames: ["HSK_Level_1_words.txt", "HSK_Level_2_words.txt"], level: "1-2" },
  { filenames: ["HSK_Level_3_words.txt"], level: 3 },
  { filenames: ["HSK_Level_4_words.txt"], level: 4 },
  { filenames: ["HSK_Level_5_words.txt"], level: 5 },
  { filenames: ["HSK_Level_6_words.txt"], level: 6 },
  { filenames: ["HSK_Level_7-9_words.txt"], level: "7-9" },
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

type HskWordMapCacheEntry = {
  directoryPath: string | null;
  stamp: string;
  entries: Map<string, HskLevel>;
  count: number;
};

const hsk30Cache: HskWordMapCacheEntry = {
  directoryPath: null,
  stamp: "",
  entries: new Map<string, HskLevel>(),
  count: 0,
};

type HandwritingCacheEntry = {
  directoryPath: string | null;
  stamp: string;
  entries: Map<HandwritingLevel, string[]>;
  count: number;
};

type HandwritingAudioCacheEntry = {
  directoryPath: string | null;
  stamp: string;
  entries: Set<string>;
  count: number;
};

const handwriting2025Cache: HandwritingCacheEntry = {
  directoryPath: null,
  stamp: "",
  entries: new Map<HandwritingLevel, string[]>(),
  count: 0,
};

const handwritingWords2025Cache: HandwritingCacheEntry = {
  directoryPath: null,
  stamp: "",
  entries: new Map<HandwritingLevel, string[]>(),
  count: 0,
};

const handwritingAudio2025Cache: HandwritingAudioCacheEntry = {
  directoryPath: null,
  stamp: "",
  entries: new Set<string>(),
  count: 0,
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

function getHskLevelWeight(level: HskLevel) {
  return level === "7-9" ? 7 : level;
}

function parseHsk30Words(text: string, level: HskLevel) {
  const parsed = JSON.parse(text) as {
    words?: Array<{ simplified?: string; traditional?: string }>;
  };
  const entries = new Map<string, HskLevel>();

  for (const word of parsed.words ?? []) {
    if (word.simplified?.trim()) {
      entries.set(word.simplified.trim(), level);
    }
    if (word.traditional?.trim()) {
      entries.set(word.traditional.trim(), level);
    }
  }

  return entries;
}

function normalizeHandwrittenCharacter(line: string) {
  const value = line.replace(/^\uFEFF/, "").trim();

  if (!value) {
    return null;
  }

  const [character] = Array.from(value);

  return character || null;
}

function normalizeHandwritingWord(line: string) {
  const value = line
    .replace(/^\uFEFF/, "")
    .trim()
    .replace(/\d+$/g, "")
    .replace(/（([^）]+)）/g, "$1")
    .replace(/\(([^)]+)\)/g, "$1")
    .replace(/\s+/g, "");

  return value || null;
}

async function readUniqueTextList(filePath: string, normalizer: (line: string) => string | null) {
  const text = await fs.readFile(filePath, "utf8");
  const items: string[] = [];
  const seen = new Set<string>();

  for (const line of text.split(/\r?\n/)) {
    const normalized = normalizer(line);

    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    items.push(normalized);
  }

  return items;
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

export async function getHsk30Dataset() {
  const stats = await Promise.all(
    hsk30Candidates.map(async ({ filename, level }) => {
      const filePath = path.join(hsk30DataDir, filename);
      try {
        const fileStats = await fs.stat(filePath);
        if (!fileStats.isFile()) {
          return null;
        }

        return {
          filePath,
          level,
          mtimeMs: fileStats.mtimeMs,
        };
      } catch {
        return null;
      }
    }),
  );

  const availableFiles: Array<{ filePath: string; level: HskLevel; mtimeMs: number }> = [];

  for (const item of stats) {
    if (item) {
      availableFiles.push(item);
    }
  }

  if (!availableFiles.length) {
    return {
      available: false,
      directoryPath: hsk30DataDir,
      entries: new Map<string, HskLevel>(),
      count: 0,
    };
  }

  const stamp = availableFiles
    .map((item) => `${item.filePath}:${item.mtimeMs}`)
    .sort()
    .join("|");

  if (hsk30Cache.directoryPath === hsk30DataDir && hsk30Cache.stamp === stamp) {
    return {
      available: true,
      directoryPath: hsk30Cache.directoryPath,
      entries: hsk30Cache.entries,
      count: hsk30Cache.count,
    };
  }

  const merged = new Map<string, HskLevel>();

  for (const file of availableFiles) {
    const text = await fs.readFile(file.filePath, "utf8");
    const words = parseHsk30Words(text, file.level);

    for (const [word, level] of words.entries()) {
      const current = merged.get(word);
      if (!current || getHskLevelWeight(level) < getHskLevelWeight(current)) {
        merged.set(word, level);
      }
    }
  }

  hsk30Cache.directoryPath = hsk30DataDir;
  hsk30Cache.stamp = stamp;
  hsk30Cache.entries = merged;
  hsk30Cache.count = merged.size;

  return {
    available: true,
    directoryPath: hsk30Cache.directoryPath,
    entries: hsk30Cache.entries,
    count: hsk30Cache.count,
  };
}

export async function getHandwriting2025Dataset() {
  const stats = await Promise.all(
    handwriting2025Candidates.map(async ({ filename, level }) => {
      const filePath = path.join(handwriting2025DataDir, filename);
      try {
        const fileStats = await fs.stat(filePath);
        if (!fileStats.isFile()) {
          return null;
        }

        return {
          filePath,
          level,
          mtimeMs: fileStats.mtimeMs,
        };
      } catch {
        return null;
      }
    }),
  );

  const availableFiles = stats.filter(Boolean) as Array<{
    filePath: string;
    level: HandwritingLevel;
    mtimeMs: number;
  }>;

  if (!availableFiles.length) {
    return {
      available: false,
      directoryPath: handwriting2025DataDir,
      entries: new Map<HandwritingLevel, string[]>(),
      count: 0,
    };
  }

  const stamp = availableFiles
    .map((item) => `${item.filePath}:${item.mtimeMs}`)
    .sort()
    .join("|");

  if (
    handwriting2025Cache.directoryPath === handwriting2025DataDir &&
    handwriting2025Cache.stamp === stamp
  ) {
    return {
      available: true,
      directoryPath: handwriting2025Cache.directoryPath,
      entries: handwriting2025Cache.entries,
      count: handwriting2025Cache.count,
    };
  }

  const merged = new Map<HandwritingLevel, string[]>();
  let count = 0;

  for (const file of availableFiles) {
    const entries = await readUniqueTextList(file.filePath, normalizeHandwrittenCharacter);
    merged.set(file.level, entries);
    count += entries.length;
  }

  handwriting2025Cache.directoryPath = handwriting2025DataDir;
  handwriting2025Cache.stamp = stamp;
  handwriting2025Cache.entries = merged;
  handwriting2025Cache.count = count;

  return {
    available: true,
    directoryPath: handwriting2025Cache.directoryPath,
    entries: handwriting2025Cache.entries,
    count: handwriting2025Cache.count,
  };
}

export async function getHandwritingWords2025Dataset() {
  const stats = await Promise.all(
    handwritingWord2025Candidates.map(async ({ filenames, level }) => {
      const files = await Promise.all(
        filenames.map(async (filename) => {
          const filePath = path.join(handwritingWords2025DataDir, filename);
          try {
            const fileStats = await fs.stat(filePath);
            if (!fileStats.isFile()) {
              return null;
            }

            return {
              filePath,
              mtimeMs: fileStats.mtimeMs,
            };
          } catch {
            return null;
          }
        }),
      );

      const availableFiles = files.filter(Boolean) as Array<{ filePath: string; mtimeMs: number }>;

      if (!availableFiles.length) {
        return null;
      }

      return {
        level,
        files: availableFiles,
      };
    }),
  );

  const availableGroups = stats.filter(Boolean) as Array<{
    level: HandwritingLevel;
    files: Array<{ filePath: string; mtimeMs: number }>;
  }>;

  if (!availableGroups.length) {
    return {
      available: false,
      directoryPath: handwritingWords2025DataDir,
      entries: new Map<HandwritingLevel, string[]>(),
      count: 0,
    };
  }

  const stamp = availableGroups
    .flatMap((group) => group.files.map((file) => `${group.level}:${file.filePath}:${file.mtimeMs}`))
    .sort()
    .join("|");

  if (
    handwritingWords2025Cache.directoryPath === handwritingWords2025DataDir &&
    handwritingWords2025Cache.stamp === stamp
  ) {
    return {
      available: true,
      directoryPath: handwritingWords2025Cache.directoryPath,
      entries: handwritingWords2025Cache.entries,
      count: handwritingWords2025Cache.count,
    };
  }

  const merged = new Map<HandwritingLevel, string[]>();
  let count = 0;

  for (const group of availableGroups) {
    const levelItems: string[] = [];
    const seen = new Set<string>();

    for (const file of group.files) {
      const words = await readUniqueTextList(file.filePath, normalizeHandwritingWord);
      for (const word of words) {
        if (seen.has(word)) {
          continue;
        }
        seen.add(word);
        levelItems.push(word);
      }
    }

    merged.set(group.level, levelItems);
    count += levelItems.length;
  }

  handwritingWords2025Cache.directoryPath = handwritingWords2025DataDir;
  handwritingWords2025Cache.stamp = stamp;
  handwritingWords2025Cache.entries = merged;
  handwritingWords2025Cache.count = count;

  return {
    available: true,
    directoryPath: handwritingWords2025Cache.directoryPath,
    entries: handwritingWords2025Cache.entries,
    count: handwritingWords2025Cache.count,
  };
}

export async function getHandwritingAudio2025Dataset() {
  try {
    const directoryEntries = await fs.readdir(handwritingAudio2025DataDir, { withFileTypes: true });
    const files = directoryEntries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".mp3"))
      .map((entry) => entry.name)
      .sort();

    if (!files.length) {
      return {
        available: false,
        directoryPath: handwritingAudio2025DataDir,
        entries: new Set<string>(),
        count: 0,
      };
    }

    const stamp = files.join("|");

    if (
      handwritingAudio2025Cache.directoryPath === handwritingAudio2025DataDir &&
      handwritingAudio2025Cache.stamp === stamp
    ) {
      return {
        available: true,
        directoryPath: handwritingAudio2025Cache.directoryPath,
        entries: handwritingAudio2025Cache.entries,
        count: handwritingAudio2025Cache.count,
      };
    }

    const terms = new Set<string>();

    for (const filename of files) {
      terms.add(filename.replace(/^cmn-/, "").replace(/\.mp3$/i, ""));
    }

    handwritingAudio2025Cache.directoryPath = handwritingAudio2025DataDir;
    handwritingAudio2025Cache.stamp = stamp;
    handwritingAudio2025Cache.entries = terms;
    handwritingAudio2025Cache.count = terms.size;

    return {
      available: true,
      directoryPath: handwritingAudio2025Cache.directoryPath,
      entries: handwritingAudio2025Cache.entries,
      count: handwritingAudio2025Cache.count,
    };
  } catch {
    return {
      available: false,
      directoryPath: handwritingAudio2025DataDir,
      entries: new Set<string>(),
      count: 0,
    };
  }
}

export async function getHandwritingAudio2025FilePath(term: string) {
  const trimmedTerm = term.trim();

  if (!trimmedTerm) {
    return null;
  }

  const dataset = await getHandwritingAudio2025Dataset();

  if (!dataset.available || !dataset.entries.has(trimmedTerm)) {
    return null;
  }

  return path.join(handwritingAudio2025DataDir, `cmn-${trimmedTerm}.mp3`);
}

export function getLanguageDataDirectory() {
  return languageDataDir;
}

type Hsk30WordEntry = {
  simplified: string;
  traditional: string;
  pinyin: string;
  english: string;
  pinyinNumbered: string;
};

type Hsk30WordsDatasetCacheEntry = {
  directoryPath: string | null;
  stamp: string;
  entries: Map<HskLevel, Hsk30WordEntry[]>;
  counts: Map<HskLevel, number>;
};

const hsk30WordsDatasetCache: Hsk30WordsDatasetCacheEntry = {
  directoryPath: null,
  stamp: "",
  entries: new Map<HskLevel, Hsk30WordEntry[]>(),
  counts: new Map<HskLevel, number>(),
};

export async function getHsk30WordsDataset() {
  const stats = await Promise.all(
    hsk30Candidates.map(async ({ filename, level }) => {
      const filePath = path.join(hsk30DataDir, filename);
      try {
        const fileStats = await fs.stat(filePath);
        if (!fileStats.isFile()) {
          return null;
        }

        return {
          filePath,
          level,
          mtimeMs: fileStats.mtimeMs,
        };
      } catch {
        return null;
      }
    }),
  );

  const availableFiles: Array<{ filePath: string; level: HskLevel; mtimeMs: number }> = [];

  for (const item of stats) {
    if (item) {
      availableFiles.push(item);
    }
  }

  if (!availableFiles.length) {
    return {
      available: false,
      directoryPath: hsk30DataDir,
      entries: new Map<HskLevel, Hsk30WordEntry[]>(),
      counts: new Map<HskLevel, number>(),
    };
  }

  const stamp = availableFiles
    .map((item) => `${item.filePath}:${item.mtimeMs}`)
    .sort()
    .join("|");

  if (hsk30WordsDatasetCache.directoryPath === hsk30DataDir && hsk30WordsDatasetCache.stamp === stamp) {
    return {
      available: true,
      directoryPath: hsk30WordsDatasetCache.directoryPath,
      entries: hsk30WordsDatasetCache.entries,
      counts: hsk30WordsDatasetCache.counts,
    };
  }

  const entries = new Map<HskLevel, Hsk30WordEntry[]>();
  const counts = new Map<HskLevel, number>();

  for (const file of availableFiles) {
    const text = await fs.readFile(file.filePath, "utf8");
    const parsed = JSON.parse(text) as {
      words?: Array<{
        simplified?: string;
        traditional?: string;
        pinyin?: string;
        english?: string;
        pinyinNumbered?: string;
      }>;
    };

    const words: Hsk30WordEntry[] = [];
    for (const word of parsed.words ?? []) {
      if (word.simplified?.trim()) {
        words.push({
          simplified: word.simplified.trim(),
          traditional: word.traditional?.trim() ?? word.simplified.trim(),
          pinyin: word.pinyin?.trim() ?? "",
          english: word.english?.trim() ?? "",
          pinyinNumbered: word.pinyinNumbered?.trim() ?? "",
        });
      }
    }

    entries.set(file.level, words);
    counts.set(file.level, words.length);
  }

  hsk30WordsDatasetCache.directoryPath = hsk30DataDir;
  hsk30WordsDatasetCache.stamp = stamp;
  hsk30WordsDatasetCache.entries = entries;
  hsk30WordsDatasetCache.counts = counts;

  return {
    available: true,
    directoryPath: hsk30WordsDatasetCache.directoryPath,
    entries: hsk30WordsDatasetCache.entries,
    counts: hsk30WordsDatasetCache.counts,
  };
}
