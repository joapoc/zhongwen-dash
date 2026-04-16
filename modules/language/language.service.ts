import axios from "axios";

import {
  getCedictDataset,
  getHandwriting2025Dataset,
  getHandwritingAudio2025Dataset,
  getHandwritingAudio2025FilePath,
  getHandwritingWords2025Dataset,
  getHsk30Dataset,
  getLanguageDataDirectory,
  getPinyinDbDataset,
} from "./language.data";
import type {
  CedictEntry,
  HandwritingCharacterEntry,
  HandwritingLevel,
  HskLevel,
  PinyinReadingEntry,
  ResourceStatus,
  TatoebaSentence,
} from "./language.types";

const DEFAULT_DICTIONARY_LIMIT = 12;
const DEFAULT_SENTENCE_LIMIT = 8;
const TATOEBA_SEARCH_URL = "https://tatoeba.org/eng/api_v0/search";
const DEEPL_PRO_URL = "https://api.deepl.com/v2/translate";
const DEEPL_FREE_URL = "https://api-free.deepl.com/v2/translate";
const DEEPL_TARGET_LANG = ((process.env.DEEPL_TARGET_LANG || "EN-US").toUpperCase() as
  | "EN"
  | "EN-US"
  | "EN-GB");
type LexiconEntry = {
  simp?: string;
  trad?: string;
  pinyin?: string;
  statistics?: {
    hskLevel?: number;
  };
};

const chineseLexicon = require("chinese-lexicon") as {
  getEntries: (word: string) => LexiconEntry[];
};

const hardcodedHskFallback: Record<string, HskLevel> = {
  "人": 1,
  "大": 1,
  "小": 1,
  "中": 1,
  "我": 1,
  "你": 1,
  "他": 1,
  "是": 1,
  "有": 1,
  "学": 1,
  "好": 1,
  "看": 1,
  "说": 1,
  "天": 1,
  "水": 1,
  "火": 1,
  "月": 1,
  "日": 1,
  "山": 1,
  "口": 1,
  "我们": 1,
  "我的": 1,
  "你好": 1,
  "你们": 1,
  "他们": 1,
  "中国": 1,
  "中文": 1,
  "中国人": 1,
  "学生": 1,
  "学校": 1,
  "学习": 1,
  "天气": 1,
  "火车": 1,
  "水果": 1,
  "走": 2,
  "跑": 2,
  "快": 2,
  "慢": 2,
  "新": 2,
  "长": 2,
  "高": 2,
  "远": 2,
  "近": 2,
  "早": 2,
  "晚": 2,
  "花": 2,
  "鸟": 2,
  "鱼": 2,
  "马": 2,
  "黑": 2,
  "白": 2,
  "红": 2,
  "笑": 2,
  "哭": 2,
  "快乐": 2,
  "新年": 2,
  "新闻": 2,
  "早上": 2,
  "晚上": 2,
  "花钱": 2,
  "明白": 2,
  "关": 3,
  "决": 3,
  "重": 3,
  "特": 3,
  "变": 3,
  "发": 3,
  "经": 3,
  "世": 3,
  "界": 3,
  "历": 3,
  "城": 3,
  "风": 3,
  "雨": 3,
  "雪": 3,
  "河": 3,
  "海": 3,
  "树": 3,
  "草": 3,
  "春": 3,
  "秋": 3,
  "世界": 3,
  "历史": 3,
  "城市": 3,
  "春天": 3,
  "秋天": 3,
  "重要": 3,
  "特别": 3,
  "变化": 3,
  "发展": 3,
  "发现": 3,
  "已经": 3,
  "观": 4,
  "察": 4,
  "推": 4,
  "严": 4,
  "格": 4,
  "温": 4,
  "度": 4,
  "顺": 4,
  "感": 4,
  "觉": 4,
  "缺": 4,
  "尊": 4,
  "敬": 4,
  "鼓": 4,
  "励": 4,
  "降": 4,
  "观察": 4,
  "观点": 4,
  "严格": 4,
  "温度": 4,
  "顺利": 4,
  "顺序": 4,
  "感觉": 4,
  "觉得": 4,
  "尊重": 4,
  "尊敬": 4,
  "鼓励": 4,
  "降低": 4,
  "概": 5,
  "念": 5,
  "策": 5,
  "略": 5,
  "贡": 5,
  "献": 5,
  "维": 5,
  "护": 5,
  "促": 5,
  "效": 5,
  "率": 5,
  "创": 5,
  "造": 5,
  "承": 5,
  "担": 5,
  "协": 5,
  "调": 5,
  "象": 5,
  "征": 5,
  "幸": 5,
  "概念": 5,
  "政策": 5,
  "策略": 5,
  "贡献": 5,
  "维护": 5,
  "促进": 5,
  "效果": 5,
  "效率": 5,
  "创造": 5,
  "承担": 5,
  "协调": 5,
  "调查": 5,
  "象征": 5,
  "幸福": 5,
  "幸运": 5,
  "践": 6,
  "摧": 6,
  "毁": 6,
  "颠": 6,
  "覆": 6,
  "凝": 6,
  "聚": 6,
  "释": 6,
  "奠": 6,
  "遏": 6,
  "蕴": 6,
  "诚": 6,
  "挚": 6,
  "渊": 6,
  "博": 6,
  "谨": 6,
  "慎": 6,
  "坦": 6,
  "恳": 6,
  "瞻": 6,
  "实践": 6,
  "摧毁": 6,
  "颠覆": 6,
  "凝聚": 6,
  "解释": 6,
  "奠定": 6,
  "遏制": 6,
  "蕴含": 6,
  "真诚": 6,
  "真挚": 6,
  "渊博": 6,
  "谨慎": 6,
  "坦率": 6,
  "诚恳": 6,
};

type JiebaModule = {
  cut: (text: string, hmm?: boolean) => string[];
  tokenize?: (
    text: string,
    mode?: "default" | "search",
    hmm?: boolean,
  ) => Array<{ word: string; start: number; end: number }>;
};

let jiebaModulePromise: Promise<JiebaModule> | null = null;

function clampLimit(value: number | undefined, fallback: number, max: number) {
  if (!value || Number.isNaN(value)) {
    return fallback;
  }

  return Math.max(1, Math.min(max, Math.floor(value)));
}

function normalizeQuery(query: string) {
  return query.trim().toLowerCase();
}

function getHandwritingLevelWeight(level: HandwritingLevel) {
  if (level === "1-2") {
    return 1;
  }

  return level === "7-9" ? 7 : level;
}

function formatHandwritingLevel(level: HandwritingLevel) {
  return `HSK ${level}`;
}

function normalizeHandwritingLevel(
  value: string | undefined,
  levels: HandwritingLevel[],
): HandwritingLevel | null {
  if (!levels.length) {
    return null;
  }

  if (!value?.trim()) {
    return levels[0];
  }

  const trimmed = value.trim();

  return levels.find((level) => String(level) === trimmed) ?? levels[0];
}

function scoreDictionaryEntry(entry: CedictEntry, rawQuery: string) {
  const query = normalizeQuery(rawQuery);
  const english = entry.english.join(" ").toLowerCase();
  const pinyin = entry.pinyin.toLowerCase();

  if (entry.simplified === rawQuery || entry.traditional === rawQuery) {
    return 400;
  }

  if (pinyin === query) {
    return 250;
  }

  if (entry.simplified.startsWith(rawQuery) || entry.traditional.startsWith(rawQuery)) {
    return 220;
  }

  if (pinyin.startsWith(query)) {
    return 180;
  }

  if (english.includes(query)) {
    return 120;
  }

  if (entry.simplified.includes(rawQuery) || entry.traditional.includes(rawQuery)) {
    return 90;
  }

  if (pinyin.includes(query)) {
    return 70;
  }

  return 0;
}

async function resolveHskLevelForWord(word: string): Promise<HskLevel | null> {
  const trimmedWord = word.trim();

  if (!trimmedWord) {
    return null;
  }

  const hsk30 = await getHsk30Dataset();
  const fromHsk30 = hsk30.entries.get(trimmedWord) ?? null;

  if (fromHsk30) {
    return fromHsk30;
  }

  try {
    const entries = chineseLexicon.getEntries(trimmedWord);
    if (!entries.length) {
      return null;
    }

    const exactEntry =
      entries.find((entry) => entry.simp === trimmedWord || entry.trad === trimmedWord) ??
      entries[0];
    const hskLevel = exactEntry?.statistics?.hskLevel;

    if (hskLevel && hskLevel >= 1 && hskLevel <= 6) {
      return hskLevel as 1 | 2 | 3 | 4 | 5 | 6;
    }
  } catch {
    // Fall through to the final local fallback.
  }

  return hardcodedHskFallback[trimmedWord] ?? null;
}

async function annotateCedictEntry(entry: CedictEntry): Promise<CedictEntry> {
  return {
    ...entry,
    hsk:
      (await resolveHskLevelForWord(entry.simplified)) ??
      (await resolveHskLevelForWord(entry.traditional)),
  };
}

async function getJiebaModule() {
  if (!jiebaModulePromise) {
    jiebaModulePromise = import("jieba-wasm").then((module) => {
      if ("cut" in module && typeof module.cut === "function") {
        return module as JiebaModule;
      }

      if (
        "default" in module &&
        module.default &&
        typeof (module.default as JiebaModule).cut === "function"
      ) {
        return module.default as JiebaModule;
      }

      throw new Error("jieba-wasm did not expose the expected API.");
    });
  }

  return jiebaModulePromise;
}

export async function getLanguageResourceStatus() {
  const [cedict, pinyinDb, hsk30] = await Promise.all([
    getCedictDataset(),
    getPinyinDbDataset(),
    getHsk30Dataset(),
  ]);
  const [handwriting2025, handwritingWords2025, handwritingAudio2025] = await Promise.all([
    getHandwriting2025Dataset(),
    getHandwritingWords2025Dataset(),
    getHandwritingAudio2025Dataset(),
  ]);

  const resources: ResourceStatus[] = [
    {
      key: "cedict",
      label: "CC-CEDICT",
      available: cedict.available,
      source: "local-file",
      detail: cedict.available
        ? "Dictionary dataset loaded from the local data directory."
        : "Dataset file not found yet. Drop the file into data/language to enable search.",
      path: cedict.filePath,
      count: cedict.entries.length,
    },
    {
      key: "pinyinDb",
      label: "pinyin-db",
      available: pinyinDb.available,
      source: "local-file",
      detail: pinyinDb.available
        ? "Character readings loaded from the local data directory."
        : "Dataset file not found yet. Drop the export into data/language to enable readings.",
      path: pinyinDb.filePath,
      count: pinyinDb.entries.length,
    },
    {
      key: "hsk30",
      label: "HSK 3.0 JSON",
      available: hsk30.available,
      source: "local-file",
      detail: hsk30.available
        ? "Latest HSK 3.0 vocabulary lists loaded and used as the primary HSK-level source."
        : "HSK 3.0 JSON files not found yet. Drop them into data/hsk3.0-json to enable latest-level tagging.",
      path: hsk30.directoryPath,
      count: hsk30.count,
    },
    {
      key: "hsk30Handwritten2025",
      label: "HSK 3.0 Handwritten 2025",
      available: handwriting2025.available,
      source: "local-file",
      detail: handwriting2025.available
        ? "Definitive handwriting-character level source loaded from the 2025 HSK 3.0 handwritten lists."
        : "HSK 3.0 Handwritten 2025 files not found yet.",
      path: handwriting2025.directoryPath,
      count: handwriting2025.count,
    },
    {
      key: "hsk30Words2025",
      label: "HSK 3.0 Words 2025",
      available: handwritingWords2025.available,
      source: "local-file",
      detail: handwritingWords2025.available
        ? "2025 HSK 3.0 word lists loaded for handwriting examples and level-aware practice support."
        : "HSK 3.0 Words 2025 files not found yet.",
      path: handwritingWords2025.directoryPath,
      count: handwritingWords2025.count,
    },
    {
      key: "hsk30Audio2025",
      label: "HSK 3.0 Audio 2025",
      available: handwritingAudio2025.available,
      source: "local-file",
      detail: handwritingAudio2025.available
        ? "2025 HSK 3.0 audio files loaded and available for handwriting playback."
        : "HSK 3.0 Audio 2025 files not found yet.",
      path: handwritingAudio2025.directoryPath,
      count: handwritingAudio2025.count,
    },
    {
      key: "jieba",
      label: "jieba-wasm",
      available: true,
      source: "npm-package",
      detail: "Installed and ready for server-side segmentation.",
    },
    {
      key: "tatoeba",
      label: "Tatoeba",
      available: true,
      source: "remote-api",
      detail: "Live example sentences fetched on demand via the Tatoeba API.",
    },
    {
      key: "hanziWriter",
      label: "Hanzi Writer",
      available: true,
      source: "npm-package",
      detail: "Installed for later frontend stroke-order work.",
    },
    {
      key: "deepl",
      label: "DeepL",
      available: !!process.env.DEEPL_AUTH_KEY,
      source: "npm-package",
      detail: process.env.DEEPL_AUTH_KEY
        ? "Installed and configured for higher-quality text translation."
        : "Installed, but DEEPL_AUTH_KEY is not configured yet.",
    },
  ];

  return {
    ok: true,
    route: "/api/language/status",
    timestamp: new Date().toISOString(),
    dataDirectory: getLanguageDataDirectory(),
    resources,
  };
}

export async function getHandwritingCharacters(level?: string) {
  const [handwriting2025, handwritingWords2025, handwritingAudio2025, cedict, pinyinDb] =
    await Promise.all([
      getHandwriting2025Dataset(),
      getHandwritingWords2025Dataset(),
      getHandwritingAudio2025Dataset(),
      getCedictDataset(),
      getPinyinDbDataset(),
    ]);

  const availableLevels = Array.from(handwriting2025.entries.keys()).sort(
    (left, right) => getHandwritingLevelWeight(left) - getHandwritingLevelWeight(right),
  );

  const currentLevel = normalizeHandwritingLevel(level, availableLevels);

  if (!currentLevel) {
    return {
      available: false,
      levels: [] as Array<{ id: string; label: string; count: number }>,
      currentLevel: null,
      items: [] as HandwritingCharacterEntry[],
      source: {
        handwritten: handwriting2025.directoryPath,
        words: handwritingWords2025.directoryPath,
        audio: handwritingAudio2025.directoryPath,
      },
    };
  }

  const dictionaryMap = new Map<string, CedictEntry>();
  const readingMap = new Map<string, PinyinReadingEntry>();

  if (cedict.available) {
    for (const entry of cedict.entries) {
      if (!dictionaryMap.has(entry.simplified)) {
        dictionaryMap.set(entry.simplified, entry);
      }
      if (!dictionaryMap.has(entry.traditional)) {
        dictionaryMap.set(entry.traditional, entry);
      }
    }
  }

  if (pinyinDb.available) {
    for (const entry of pinyinDb.entries) {
      if (!readingMap.has(entry.character)) {
        readingMap.set(entry.character, entry);
      }
    }
  }

  const wordsByLevel = handwritingWords2025.entries.get(currentLevel) ?? [];
  const audioTerms = handwritingAudio2025.entries;

  const items = (handwriting2025.entries.get(currentLevel) ?? []).map((character) => {
    const dictionaryEntry = dictionaryMap.get(character);
    const readingEntry = readingMap.get(character);
    const examples = wordsByLevel
      .filter((word) => word.includes(character))
      .slice(0, 4)
      .map((word) => ({
        text: word,
        audioUrl: audioTerms.has(word)
          ? `/api/language/audio/${encodeURIComponent(word)}`
          : null,
      }));

    return {
      ch: character,
      py: dictionaryEntry?.pinyin ?? readingEntry?.readings?.[0] ?? "",
      en: dictionaryEntry?.english?.slice(0, 3).join("; ") ?? "No definition found yet",
      rad: null,
      sk: null,
      ex: examples,
      audioUrl: audioTerms.has(character)
        ? `/api/language/audio/${encodeURIComponent(character)}`
        : null,
      sourceLevel: currentLevel,
      sourceLevelLabel: formatHandwritingLevel(currentLevel),
    } as HandwritingCharacterEntry;
  });

  return {
    available: true,
    levels: availableLevels.map((entryLevel) => ({
      id: String(entryLevel),
      label: formatHandwritingLevel(entryLevel),
      count: (handwriting2025.entries.get(entryLevel) ?? []).length,
    })),
    currentLevel: String(currentLevel),
    items,
    source: {
      handwritten: handwriting2025.directoryPath,
      words: handwritingWords2025.directoryPath,
      audio: handwritingAudio2025.directoryPath,
    },
  };
}

export async function getHandwritingAudioPath(term: string) {
  return getHandwritingAudio2025FilePath(term);
}

export async function searchDictionary(query: string, limit?: number) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const dataset = await getCedictDataset();

  if (!dataset.available) {
    return [];
  }

  const cappedLimit = clampLimit(limit, DEFAULT_DICTIONARY_LIMIT, 50);

  const topEntries = dataset.entries
    .map((entry) => ({
      entry,
      score: scoreDictionaryEntry(entry, trimmedQuery),
    }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, cappedLimit)
    .map((item) => item.entry);

  return Promise.all(topEntries.map((entry) => annotateCedictEntry(entry)));
}

export async function getCharacterReadings(character: string) {
  const trimmedCharacter = character.trim();

  if (!trimmedCharacter) {
    return null;
  }

  const dataset = await getPinyinDbDataset();

  if (!dataset.available) {
    return null;
  }

  return (
    dataset.entries.find((entry) => entry.character === trimmedCharacter) ?? null
  );
}

export async function segmentChineseText(text: string) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return {
      words: [] as string[],
      tokens: [] as Array<{ word: string; start: number; end: number }>,
    };
  }

  const jieba = await getJiebaModule();

  return {
    words: jieba.cut(trimmedText, true),
    tokens: jieba.tokenize ? jieba.tokenize(trimmedText, "default", true) : [],
  };
}

function parseTatoebaTranslations(rawTranslations: unknown) {
  if (!Array.isArray(rawTranslations)) {
    return [];
  }

  const translations: string[] = [];

  for (const translationGroup of rawTranslations) {
    if (!Array.isArray(translationGroup)) {
      continue;
    }

    for (const translation of translationGroup) {
      if (
        translation &&
        typeof translation === "object" &&
        "text" in translation &&
        typeof translation.text === "string"
      ) {
        translations.push(translation.text);
      }
    }
  }

  return translations;
}

export async function searchTatoebaSentences(query: string, limit?: number) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [] as TatoebaSentence[];
  }

  const cappedLimit = clampLimit(limit, DEFAULT_SENTENCE_LIMIT, 20);
  const { data } = await axios.get(TATOEBA_SEARCH_URL, {
    params: {
      from: "cmn",
      to: "eng",
      query: trimmedQuery,
      trans_filter: "limit",
      trans_to: "eng",
    },
    timeout: 8000,
  });

  const results = Array.isArray(data?.results) ? data.results : [];

  return results.slice(0, cappedLimit).map((sentence: unknown): TatoebaSentence => {
    const sentenceId =
      sentence &&
      typeof sentence === "object" &&
      "id" in sentence &&
      typeof sentence.id === "number"
        ? sentence.id
        : null;

    const sentenceText =
      sentence &&
      typeof sentence === "object" &&
      "text" in sentence &&
      typeof sentence.text === "string"
        ? sentence.text
        : "";

    const translations =
      sentence && typeof sentence === "object" && "translations" in sentence
        ? parseTatoebaTranslations(sentence.translations)
        : [];

    return {
      id: sentenceId,
      text: sentenceText,
      translations,
    };
  });
}

export async function translateChineseSentences(sentences: string[]) {
  const authKey = (process.env.DEEPL_AUTH_KEY || "").trim();

  if (!authKey) {
    throw new Error("DEEPL_AUTH_KEY is not configured.");
  }

  const items = sentences.map((sentence) => sentence.trim()).filter(Boolean);

  if (!items.length) {
    return [] as string[];
  }

  const freeApi =
    String(process.env.DEEPL_FREE_API || "").trim() === "1" ||
    /:fx$/i.test(authKey);

  let results: string[];

  try {
    results = await Promise.all(
      items.map(async (text) => {
        const body = new URLSearchParams();
        body.append("text", text);
        body.append("source_lang", "ZH");
        body.append("target_lang", DEEPL_TARGET_LANG);
        body.append("split_sentences", "1");
        body.append("preserve_formatting", "1");
        const response = await axios.post(
          freeApi ? DEEPL_FREE_URL : DEEPL_PRO_URL,
          body.toString(),
          {
            headers: {
              Authorization: `DeepL-Auth-Key ${authKey}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            timeout: 15000,
          },
        );

        const translated = response?.data?.translations?.[0]?.text?.trim();
        return translated || "";
      }),
    );
  } catch (error) {
    const maybeError = error as {
      message?: string;
      response?: {
        status?: number;
        data?: unknown;
      };
    };
    const status = maybeError.response?.status;
    const data = maybeError.response?.data;
    const detail =
      typeof data === "string"
        ? data
        : data && typeof data === "object" && "message" in data && typeof data.message === "string"
          ? data.message
          : maybeError.message || "Unknown DeepL error.";

    throw new Error(
      status ? `DeepL request failed (${status}): ${detail}` : `DeepL request failed: ${detail}`,
    );
  }

  return results;
}
