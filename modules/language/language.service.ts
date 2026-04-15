import axios from "axios";

import { getCedictDataset, getLanguageDataDirectory, getPinyinDbDataset } from "./language.data";
import type { CedictEntry, ResourceStatus, TatoebaSentence } from "./language.types";

const DEFAULT_DICTIONARY_LIMIT = 12;
const DEFAULT_SENTENCE_LIMIT = 8;
const TATOEBA_SEARCH_URL = "https://tatoeba.org/eng/api_v0/search";

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
  const [cedict, pinyinDb] = await Promise.all([
    getCedictDataset(),
    getPinyinDbDataset(),
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
  ];

  return {
    ok: true,
    route: "/api/language/status",
    timestamp: new Date().toISOString(),
    dataDirectory: getLanguageDataDirectory(),
    resources,
  };
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

  return dataset.entries
    .map((entry) => ({
      entry,
      score: scoreDictionaryEntry(entry, trimmedQuery),
    }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, cappedLimit)
    .map((item) => item.entry);
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
