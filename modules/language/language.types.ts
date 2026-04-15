export type CedictEntry = {
  traditional: string;
  simplified: string;
  pinyin: string;
  english: string[];
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
