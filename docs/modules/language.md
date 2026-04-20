# Language module

Path: [modules/language/](../../modules/language/).

This is the biggest module in the app. It owns dictionary lookup, Chinese text segmentation, translation via DeepL, example sentences via Tatoeba, character handwriting metadata, audio streaming, and HSK vocabulary browsing.

## Files

| File | Role |
|---|---|
| [index.ts](../../modules/language/index.ts) | Re-exports the `Router` as `languageRoutes` |
| [language.routes.ts](../../modules/language/language.routes.ts) | Maps HTTP paths to controller handlers |
| [language.controller.ts](../../modules/language/language.controller.ts) | Parses/validates requests, shapes responses, HTTP status codes |
| [language.service.ts](../../modules/language/language.service.ts) | Business logic: scoring, enrichment, jieba, DeepL, Tatoeba |
| [language.data.ts](../../modules/language/language.data.ts) | Filesystem I/O, parsers, in-memory caches |
| [language.types.ts](../../modules/language/language.types.ts) | Shared TypeScript types |

## Types overview

From [language.types.ts](../../modules/language/language.types.ts):

- `HskLevel` — `1 | 2 | 3 | 4 | 5 | 6 | "7-9"`
- `HandwritingLevel` — `"1-2" | 3 | 4 | 5 | 6 | "7-9"` (note: 1 and 2 are merged)
- `CedictEntry` — `{ traditional, simplified, pinyin, english[], hsk? }`
- `PinyinReadingEntry` — `{ character, codepoint, readings[] }`
- `HandwritingCharacterEntry` — enriched handwriting character with examples, audio URL, source level
- `HskWord` — full HSK 3.0 word record with simplified/traditional/pinyin/english/numbered pinyin
- `ResourceStatus` — shape returned by `/api/language/status`
- `TatoebaSentence` — `{ id, text, translations[] }`

## Data layer ([language.data.ts](../../modules/language/language.data.ts))

Each dataset has:

1. A fixed path under `data/` (paths are resolved from `process.cwd()`).
2. A filename candidate list — the first match wins (for CC-CEDICT/pinyin-db) or all files are loaded and merged (for HSK).
3. An in-memory cache keyed by file path + `mtimeMs` (or a concatenated stamp for multi-file datasets).
4. A lazy loader (`getCedictDataset`, `getPinyinDbDataset`, `getHsk30Dataset`, etc.) that returns either the cached copy or re-parses on mtime change.

| Loader | Path | Caching key |
|---|---|---|
| `getCedictDataset` | `data/language/{cedict_ts.u8,cedict_1_0_ts_utf-8_mdbg.txt}` | filePath + mtimeMs |
| `getPinyinDbDataset` | `data/language/{pinyin_db.txt,pinyin-db.txt}` | filePath + mtimeMs |
| `getHsk30Dataset` | `data/hsk3.0-json/hsk{1..6,7-9}.json` | concat of all files + mtimeMs |
| `getHsk30WordsDataset` | same as above (full word records) | same |
| `getHandwriting2025Dataset` | `data/HSK 3.0 Handwritten 2025/*.txt` | same |
| `getHandwritingWords2025Dataset` | `data/HSK 3.0 Words 2025/*.txt` | same |
| `getHandwritingAudio2025Dataset` | `data/HSK 3.0 Audio 2025/*.mp3` | file list stamp |

### Parsers

- **CC-CEDICT** ([`parseCedict`](../../modules/language/language.data.ts)): regex `^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+\/(.+)\/$`. Splits the English on `/`.
- **pinyin-db** ([`parsePinyinDb`](../../modules/language/language.data.ts)): tab-separated `character\tcodepoint\treadings`. Readings are comma-split.
- **HSK 3.0 JSON** (`parseHsk30Words`): reads `{ words: [{ simplified, traditional }] }`, builds a `Map<string, HskLevel>`. When the same word appears at multiple levels, the **lower** level wins.
- **Handwritten character lists**: one character per line; strips BOM; takes the first code point via `Array.from(value)` so combining marks don't break.
- **Handwriting word lists**: strips BOM, trailing digits, full-width and half-width parentheses, whitespace. Deduped across files for the same level (level `1-2` merges HSK_Level_1 + HSK_Level_2).
- **Audio**: filenames match `cmn-<term>.mp3`. The term set is used to check availability; [`getHandwritingAudio2025FilePath`](../../modules/language/language.data.ts) rebuilds the path for streaming.

## Service layer ([language.service.ts](../../modules/language/language.service.ts))

### `searchDictionary(query, limit?)`

1. Trim query. Early-return `[]` if empty or CC-CEDICT isn't loaded.
2. `clampLimit(limit, 12, 50)` — bounds the result count.
3. Score each entry with `scoreDictionaryEntry`, filter `score > 0`, sort descending, slice.
4. `annotateCedictEntry` adds HSK level and applies the surname enrichment rule.

Scoring breakpoints:

| Match type | Score |
|---|---|
| Exact simplified/traditional | 400 |
| Exact pinyin | 250 |
| Prefix simplified/traditional | 220 |
| Prefix pinyin | 180 |
| English contains query | 120 |
| Substring simplified/traditional | 90 |
| Substring pinyin | 70 |
| — | 0 |

Surname penalty: **−50** if the first definition matches `/^surname\s+\w+$/i`.

### `resolveHskLevelForWord(word)`

Three-tier fallback:

1. HSK 3.0 JSON dataset (`getHsk30Dataset`) — authoritative.
2. `chinese-lexicon` npm package — `entry.statistics.hskLevel` (1–6 only).
3. Hardcoded fallback map in [language.service.ts](../../modules/language/language.service.ts) — ~200 curated single-character and short-word entries.

Returns `null` if no tier matches.

### Surname global rule

Two halves of the same rule, both applied transparently:

1. **Scoring penalty** (`isSurnameLeadingEntry`): dictionary entries whose first definition is "surname X" get a −50 point penalty, so entries with common meanings rank above surname entries. Example: when searching `都`, the entry with definitions `["all", "both"]` beats the entry starting with `"surname Du"`.
2. **Reordering** (`enrichDefinitions`): when the first definition is "surname X" but other meanings exist, it reorders to show meaningful definitions first with surname info pushed to the end. Example: `["surname Li", "plum"]` becomes `["plum", "surname Li"]`. Applied in both `annotateCedictEntry` (search results) and `formatDefinitionsForDisplay` (handwriting panel renderings).

Kept as one rule, two implementations: scoring affects which entries are returned, reordering affects how each returned entry's definitions are ordered.

### `segmentChineseText(text)`

Wraps `jieba-wasm`. The module is lazy-imported via [`getJiebaModule`](../../modules/language/language.service.ts), which handles both the named-export and default-export shapes that different jieba-wasm versions ship. The resolved module is cached in a module-level `Promise`.

Returns `{ words, tokens }`. `tokens` only includes start/end offsets when `jieba.tokenize` exists on the loaded module.

### `translateChineseSentences(sentences)`

Direct HTTP to DeepL — the `deepl` npm package is installed but not used here. Implementation notes:

- Trims and filters each input. Empty array → returns `[]`.
- Detects free vs pro endpoint: `DEEPL_FREE_API=1` or auth key ending in `:fx` → free; otherwise pro.
- Payload is `application/x-www-form-urlencoded` with `text`, `source_lang=ZH`, `target_lang=DEEPL_TARGET_LANG`, `split_sentences=1`, `preserve_formatting=1`.
- Each sentence is sent as its own request (parallel via `Promise.all`), 15s timeout each.
- Throws a rich `Error` containing DeepL's HTTP status + message. The controller catches this and turns it into a 503 response.

### `searchTatoebaSentences(query, limit?)`

Single GET to `https://tatoeba.org/eng/api_v0/search` with `from=cmn`, `to=eng`. Parses the nested translations array (groups of groups of objects with `.text`). Timeout 8s. Errors bubble up to the controller as 502.

### `getHandwritingCharacters(level?)`

The heaviest aggregation function. For a given level:

1. Loads all five relevant datasets in parallel (handwriting chars, handwriting words, handwriting audio, CC-CEDICT, pinyin-db).
2. Builds lookup maps: `simplified+traditional → CedictEntry`, `character → PinyinReadingEntry`.
3. For each character in the level:
   - Takes pinyin from CC-CEDICT if available, else pinyin-db's first reading.
   - Formats the English via `formatDefinitionsForDisplay` (applies surname reorder, joins with `; `, caps at 3 definitions).
   - Finds up to 4 words from the same level that contain that character as examples.
   - Attaches audio URLs for the character and for each example word if an MP3 file exists.

`levels[]` always includes all handwriting levels with counts, regardless of which level is currently selected. `currentLevel` is normalized against the available levels.

### `getWordsByLevel(level?, count?, random?)`

Reads HSK 3.0 vocabulary for a single level, optionally Fisher-Yates shuffles, optionally slices to `count`. Returns per-level counts in `levels[]` so the frontend can render level tabs.

## Controller notes

Each controller validates minimally (empty string → 400) and delegates to the service. Controllers don't own error wrapping — they catch and convert upstream failures to 502 (Tatoeba) / 503 (DeepL).

`getLanguageWords` is the handler for `/api/language/words`. See [api-reference.md](../api-reference.md#get-apilanguagewords).

## How to add a new language feature

1. Add a type to [language.types.ts](../../modules/language/language.types.ts) if you need a new shape.
2. If it reads from disk, add a loader + cache entry in [language.data.ts](../../modules/language/language.data.ts) following the mtime-stamped pattern.
3. Add the business logic in [language.service.ts](../../modules/language/language.service.ts). Keep it I/O-free beyond calling data-layer loaders and external HTTP.
4. Add a handler in [language.controller.ts](../../modules/language/language.controller.ts). Validate required params, map upstream errors to 502/503.
5. Register the route in [language.routes.ts](../../modules/language/language.routes.ts).
6. Add a resource entry to `/api/language/status` if it's a new dataset, so operators can see it's detected.
7. Document it in [api-reference.md](../api-reference.md).
