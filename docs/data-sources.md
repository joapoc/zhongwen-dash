# Data sources

Every dataset used by the language module, where it lives, and how to get it.

All filesystem paths are resolved from `process.cwd()` in [modules/language/language.data.ts](../modules/language/language.data.ts), so the app must be run from the repo root (both `npm run dev` and `npm start` do this).

## CC-CEDICT

**Used for:** dictionary search, English definitions, pinyin for handwriting characters.

| Property | Value |
|---|---|
| Directory | [data/language/](../data/language/) |
| Accepted filenames | `cedict_ts.u8` (preferred), `cedict_1_0_ts_utf-8_mdbg.txt` |
| Format | Plain text, one entry per line: `<traditional> <simplified> [pinyin] /def1/def2/.../` |
| Licence | CC BY-SA 4.0 |
| Source | [MDBG CC-CEDICT download](https://www.mdbg.net/chinese/dictionary?page=cc-cedict) |

The repo ships with `cedict_ts.u8` already in place. Drop a newer version with the same filename to update. Parsing is done by the regex in [`parseCedict`](../modules/language/language.data.ts).

## pinyin-db

**Used for:** per-character pinyin readings via `/api/language/readings/:character`.

| Property | Value |
|---|---|
| Directory | [data/language/](../data/language/) |
| Accepted filenames | `pinyin_db.txt`, `pinyin-db.txt` |
| Format | Tab-separated `<character>\t<codepoint>\t<reading1,reading2,...>` |
| Source | Various pinyin-db exports; see [data/language/README.md](../data/language/README.md) |

**Not shipped with the repo.** Without this file, `/api/language/readings/:character` returns 404 for every character, and handwriting responses fall back to CC-CEDICT pinyin.

## HSK 3.0 JSON

**Used for:** HSK level tagging on dictionary entries, and the `/api/language/hsk-words` browse endpoint.

| Property | Value |
|---|---|
| Directory | [data/hsk3.0-json/](../data/hsk3.0-json/) |
| Files | `hsk1.json`, `hsk2.json`, `hsk3.json`, `hsk4.json`, `hsk5.json`, `hsk6.json`, `hsk7-9.json` |
| Format | `{ "words": [{ "simplified", "traditional", "pinyin", "english", "pinyinNumbered" }] }` |

When a word appears in multiple files, the **lower** level wins (see `getHsk30Dataset` in [language.data.ts](../modules/language/language.data.ts)). This is the primary source for HSK level resolution; `chinese-lexicon` and the hardcoded fallback only fire when a word isn't present here.

## HSK 3.0 Handwritten 2025

**Used for:** the list of characters per HSK handwriting level in `/api/language/handwriting`.

| Property | Value |
|---|---|
| Directory | [data/HSK 3.0 Handwritten 2025/](../data/HSK%203.0%20Handwritten%202025/) |
| Files | `HSK_Level_1-2_handwritten.txt`, `HSK_Level_3_handwritten.txt`, ..., `HSK_Level_7-9_handwritten.txt` |
| Format | One character per line |

Parsing: BOM stripped, `Array.from(line)` takes the first code point so combining marks don't break the extraction. Duplicates within a file are deduped.

Note that levels 1 and 2 are merged into a single file (`1-2`) — this is reflected in the `HandwritingLevel` type.

## HSK 3.0 Words 2025

**Used for:** example words shown alongside each handwriting character.

| Property | Value |
|---|---|
| Directory | [data/HSK 3.0 Words 2025/](../data/HSK%203.0%20Words%202025/) |
| Files | `HSK_Level_1_words.txt`, ..., `HSK_Level_6_words.txt`, `HSK_Level_7-9_words.txt` |
| Format | One word per line, optional trailing digits and parenthesized annotations |

The handwriting level `1-2` merges HSK_Level_1_words.txt + HSK_Level_2_words.txt. Normalization strips BOM, trailing digits, full-width and half-width parentheses (keeping their contents), and whitespace.

## HSK 3.0 Audio 2025

**Used for:** MP3 pronunciation playback for characters and example words.

| Property | Value |
|---|---|
| Directory | [data/HSK 3.0 Audio 2025/](../data/HSK%203.0%20Audio%202025/) |
| Filenames | `cmn-<term>.mp3` (e.g., `cmn-学.mp3`, `cmn-学习.mp3`) |
| Format | MP3 |

The data layer builds a `Set<string>` of available terms (everything between `cmn-` and `.mp3`). When the handwriting endpoint builds examples, it checks this set before adding an `audioUrl`. Streaming is done by [`streamLanguageAudio`](../modules/language/language.controller.ts) via `res.sendFile` with `Cache-Control: public, max-age=86400`.

## Tatoeba (remote)

**Used for:** example sentences in `/api/language/sentences/search`.

| Property | Value |
|---|---|
| Endpoint | `https://tatoeba.org/eng/api_v0/search` |
| Parameters | `from=cmn`, `to=eng`, `query=<...>`, `trans_filter=limit`, `trans_to=eng` |
| Timeout | 8000 ms |
| Rate limit | No explicit client-side throttling — rely on Tatoeba's fair-use |

No local file, no cache. Every request goes upstream. If Tatoeba is slow or down, the controller returns 502.

## DeepL (remote)

**Used for:** translation in `/api/language/translate`.

| Property | Value |
|---|---|
| Pro endpoint | `https://api.deepl.com/v2/translate` |
| Free endpoint | `https://api-free.deepl.com/v2/translate` |
| Auth | Header `Authorization: DeepL-Auth-Key <key>` |
| Source | `ZH` (hard-coded) |
| Target | `DEEPL_TARGET_LANG` env, default `EN-US` |
| Timeout | 15000 ms per sentence |

Free vs Pro is picked by the presence of `DEEPL_FREE_API=1` or a key ending in `:fx`. Each input sentence becomes its own HTTP request (in parallel via `Promise.all`), not a single batched request.

## `chinese-lexicon` (npm)

**Used for:** HSK level fallback only — when HSK 3.0 JSON doesn't contain a word.

Loaded via `require("chinese-lexicon")` in [language.service.ts](../modules/language/language.service.ts). Accessed through `chineseLexicon.getEntries(word)`, reading `entry.statistics.hskLevel` (only values 1–6 are accepted).

## `jieba-wasm` (npm)

**Used for:** Chinese text segmentation in `/api/language/segment`.

Lazy-imported via `import("jieba-wasm")` and cached in a module-level `Promise<JiebaModule>` so the WASM payload is only decoded once. The import shape handling covers both named-exports and default-exports depending on the jieba-wasm build. See [`getJiebaModule`](../modules/language/language.service.ts).

## Hardcoded HSK fallback

**Used for:** final-tier fallback when both HSK 3.0 JSON and `chinese-lexicon` miss a word.

A literal `Record<string, HskLevel>` inside [language.service.ts](../modules/language/language.service.ts) (~200 entries). It's manually curated for common single characters and short words. Edit it directly to add more fallbacks.

## Saved-words cache

**Used for:** persisting the user's saved vocabulary list across sessions.

| Property | Value |
|---|---|
| File | [data/cache.json](../data/cache.json) |
| Shape | `{ "savedWords": [...] }` |
| Writer | [server/services/file-cache.ts](../server/services/file-cache.ts) |

See [caching-and-storage.md](./caching-and-storage.md) for the full write model.

## Health check

Call `GET /api/language/status` to confirm all datasets are detected. Each resource in the response has an `available` boolean and a human-readable `detail` explaining where to put missing files.
