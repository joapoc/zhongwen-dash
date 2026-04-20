# API reference

All routes return JSON unless otherwise noted. Successful responses include `ok: true`; error responses include `ok: false` and a `message`. Every response also echoes back the `route` for debugging.

## Generic

### `GET /api/health`

Health check. Wired in [server/routes/api.ts](../server/routes/api.ts).

```json
{
  "status": "ok",
  "service": "zhongwen-dash",
  "timestamp": "2026-04-20T12:34:56.789Z"
}
```

### `GET /api/words`

Returns the user's saved-words list from [data/cache.json](../data/cache.json).

```json
{ "savedWords": [ ... ] }
```

### `PUT /api/words`

Replaces the saved-words list. Accepts `{ "savedWords": [...] }`. Non-array bodies are treated as `[]`.

```json
{ "savedWords": [ ... ], "count": 42 }
```

Persistence uses an atomic write-then-rename and a serialized write queue — see [caching-and-storage.md](./caching-and-storage.md).

## Language (`/api/language/*`)

All routes defined in [modules/language/language.routes.ts](../modules/language/language.routes.ts). Controller behavior in [language.controller.ts](../modules/language/language.controller.ts). See [modules/language.md](./modules/language.md) for semantics.

### `GET /api/language/status`

Reports availability and paths of every local dataset and remote API (CC-CEDICT, pinyin-db, HSK 3.0 JSON, 2025 handwriting/words/audio, jieba-wasm, Tatoeba, Hanzi Writer, DeepL). Useful for diagnosing "why doesn't search return anything".

Response (abbreviated):

```json
{
  "ok": true,
  "route": "/api/language/status",
  "timestamp": "...",
  "dataDirectory": "C:\\...\\data\\language",
  "resources": [
    { "key": "cedict", "label": "CC-CEDICT", "available": true, "source": "local-file", "detail": "...", "path": "...", "count": 123456 },
    { "key": "deepl", "label": "DeepL", "available": false, "source": "npm-package", "detail": "Installed, but DEEPL_AUTH_KEY is not configured yet." }
  ]
}
```

### `GET /api/language/dictionary/search`

Query params:

| Param | Type | Default | Max |
|---|---|---|---|
| `query` | string (required) | — | — |
| `limit` | number | 12 | 50 |

Searches CC-CEDICT entries scored by [`scoreDictionaryEntry`](../modules/language/language.service.ts). Exact simplified/traditional match → 400, exact pinyin → 250, prefix match → 220/180, English contains → 120, etc. Surname-leading entries get a −50 penalty (see [surname rule](./modules/language.md#surname-global-rule)).

Response:

```json
{
  "ok": true,
  "route": "/api/language/dictionary/search",
  "query": "学习",
  "count": 12,
  "results": [
    {
      "traditional": "學習",
      "simplified": "学习",
      "pinyin": "xue2 xi2",
      "english": ["to learn", "to study", "..."],
      "hsk": 1
    }
  ]
}
```

HSK level is resolved via HSK 3.0 JSON → `chinese-lexicon` → hardcoded fallback in that order. `english` is post-processed by the surname-reordering rule (`enrichDefinitions`).

400 if `query` is empty.

### `GET /api/language/readings/:character`

Returns pinyin readings from the local `pinyin_db.txt`. 404 if the character isn't found or no dataset file is present.

```json
{
  "ok": true,
  "route": "/api/language/readings/:character",
  "result": {
    "character": "学",
    "codepoint": "5B66",
    "readings": ["xue2"]
  }
}
```

### `POST /api/language/segment`

Body: `{ "text": "我爱学习中文" }`.

Uses `jieba-wasm` (lazy-loaded singleton) to tokenize. Returns both `words` (string[]) and `tokens` (with start/end offsets) when `jieba.tokenize` is available.

```json
{
  "ok": true,
  "route": "/api/language/segment",
  "text": "我爱学习中文",
  "words": ["我", "爱", "学习", "中文"],
  "tokens": [{ "word": "我", "start": 0, "end": 1 }, ...]
}
```

### `POST /api/language/translate`

Body accepts either a single string (`{ "text": "..." }`) or an array (`{ "texts": ["...", "..."] }`). Array takes precedence when both are provided.

Calls DeepL directly (not the `deepl` npm package — a URL-encoded `POST` via axios). Picks between `api.deepl.com` (Pro) and `api-free.deepl.com` (Free) based on:

1. `DEEPL_FREE_API=1` env → force free endpoint.
2. Auth key ending in `:fx` → free endpoint.
3. Otherwise → Pro endpoint.

Source language is hard-coded to `ZH`. Target language from `DEEPL_TARGET_LANG` (default `EN-US`).

```json
{
  "ok": true,
  "route": "/api/language/translate",
  "count": 1,
  "translations": ["I love studying Chinese"],
  "provider": "DeepL"
}
```

- 400 if neither `text` nor `texts` is provided.
- 503 on any DeepL failure (missing key, upstream error). `message` includes the HTTP status and DeepL's error text.

### `GET /api/language/sentences/search`

Query params: `query` (required), `limit` (default 8, max 20).

Proxies to Tatoeba's v0 API (`https://tatoeba.org/eng/api_v0/search`), filtering to Mandarin → English pairs. Each result normalizes to `{ id, text, translations[] }`.

- 400 if `query` is empty.
- 502 if Tatoeba is unreachable.

Axios timeout: 8s.

### `GET /api/language/handwriting`

Returns the character list for a given HSK handwriting level, enriched with dictionary meaning, pinyin, up to 4 example words, and audio URLs when the audio file exists.

Query: `level` (one of `1-2`, `3`, `4`, `5`, `6`, `7-9`). Defaults to the first available level.

```json
{
  "ok": true,
  "route": "/api/language/handwriting",
  "available": true,
  "levels": [
    { "id": "1-2", "label": "HSK 1-2", "count": 300 },
    ...
  ],
  "currentLevel": "1-2",
  "items": [
    {
      "ch": "学",
      "py": "xue2",
      "en": "to study; to learn",
      "rad": null,
      "sk": null,
      "ex": [{ "text": "学习", "audioUrl": "/api/language/audio/%E5%AD%A6%E4%B9%A0" }],
      "audioUrl": "/api/language/audio/%E5%AD%A6",
      "sourceLevel": "1-2",
      "sourceLevelLabel": "HSK 1-2"
    }
  ],
  "source": { "handwritten": "...", "words": "...", "audio": "..." }
}
```

### `GET /api/language/audio/:term`

Streams an MP3 from [data/HSK 3.0 Audio 2025/](../data/HSK%203.0%20Audio%202025/). File naming convention: `cmn-<term>.mp3`. The term in the URL must match the portion after `cmn-` (e.g., `/api/language/audio/%E5%AD%A6%E4%B9%A0` for `学习`).

Response headers: `Cache-Control: public, max-age=86400`.

404 if the file doesn't exist.

### `GET /api/language/hsk-words`

HSK 3.0 vocabulary browse endpoint. Query params: `level`, `count`, `random` (`true`/`1`).

```json
{
  "ok": true,
  "route": "/api/language/words",
  "available": true,
  "levels": [ ... ],
  "currentLevel": "1",
  "words": [
    {
      "simplified": "学习",
      "traditional": "學習",
      "pinyin": "xuéxí",
      "english": "to study; to learn",
      "pinyinNumbered": "xue2xi2",
      "level": 1
    }
  ],
  "totalCount": 300
}
```

When `random=true`, the list is Fisher-Yates shuffled before `count` slicing.

> **Note:** the route path in [language.routes.ts](../modules/language/language.routes.ts) is `/hsk-words`, but the controller writes `route: "/api/language/words"` in the response payload. That's a cosmetic discrepancy in the response, not the URL.

## Anki (`/api/anki/*`)

Defined in [modules/anki/anki.routes.ts](../modules/anki/anki.routes.ts). Proxies to Anki-Connect on `http://127.0.0.1:8765` (falls back to `http://localhost:8765`). See [modules/anki.md](./modules/anki.md).

### `GET /api/anki/decks`

Lists all decks with total card count and due card count per deck. Uses Anki-Connect's `deckNames` and a batched `multi` action for `findCards` queries.

```json
{
  "ok": true,
  "route": "/api/anki/decks",
  "timestamp": "...",
  "count": 3,
  "totals": { "cards": 1234, "due": 42 },
  "decks": [
    { "name": "Default", "totalCards": 500, "dueCards": 10 }
  ]
}
```

502 if Anki-Connect is unreachable. Both URLs in the fallback list are returned in `debug.hostsTried`.

### `POST /api/anki/decks/open`

Body: `{ "deckName": "..." }`. Calls Anki-Connect's `guiDeckOverview` action to open that deck in the Anki desktop UI.

- 400 if `deckName` is missing or empty.
- 502 if Anki-Connect is unreachable, or if `guiDeckOverview` returns anything other than `true`.

## HTML route

### `GET /`

Serves [views/index.html](../views/index.html) — the dashboard shell.
