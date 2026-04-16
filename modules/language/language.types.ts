export type HskLevel = 1 | 2 | 3 | 4 | 5 | 6 | "7-9";
export type HandwritingLevel = "1-2" | 3 | 4 | 5 | 6 | "7-9";

export type CedictEntry = {
  traditional: string;
  simplified: string;
  pinyin: string;
  english: string[];
  hsk?: HskLevel | null;
};

export type PinyinReadingEntry = {
  character: string;
  codepoint: string;
  readings: string[];
};

export type ResourceStatus = {
  key: string;
  label: string;
  available: boolean;
  source: string;
  detail: string;
  path?: string;
  count?: number;
};

export type TatoebaSentence = {
  id: number | null;
  text: string;
  translations: string[];
};

export type HandwritingExample = {
  text: string;
  audioUrl?: string | null;
};

export type HandwritingCharacterEntry = {
  ch: string;
  py: string;
  en: string;
  rad?: string | null;
  sk?: number | null;
  ex: HandwritingExample[];
  audioUrl?: string | null;
  sourceLevel: HandwritingLevel;
  sourceLevelLabel: string;
};
