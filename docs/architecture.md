# Architecture

## High-level shape

Zhongwen Dash is a single-process Express server that serves:

1. Server-rendered HTML shell ([views/index.html](../views/index.html)) at `/`
2. Compiled frontend TypeScript as static JS under `/js/` (from [public/js/](../public/js/))
3. JSON APIs under `/api/...`, split across:
   - Generic app API ([server/routes/api.ts](../server/routes/api.ts)) — `/api/health`, `/api/words`
   - Language module ([modules/language/language.routes.ts](../modules/language/language.routes.ts)) — `/api/language/*`
   - Anki module ([modules/anki/anki.routes.ts](../modules/anki/anki.routes.ts)) — `/api/anki/*`

Two TypeScript projects compile independently — server (`tsconfig.json` → `dist/`) and frontend (`tsconfig.frontend.json` → `public/js/`). See [configuration.md](./configuration.md).

## Request flow

```
HTTP request
  │
  ▼
server/index.ts         (boots, loads dotenv, listens on PORT)
  │
  ▼
server/app.ts           (Express app, JSON body parsing, static files)
  │
  ├── GET /                       → server/routes/web.ts      → sends views/index.html
  ├── GET|PUT /api/health|/words  → server/routes/api.ts      → server/services/file-cache.ts
  ├── /api/language/*             → modules/language/language.routes.ts
  │        │
  │        └── controller → service → data (local files) + external APIs
  └── /api/anki/*                 → modules/anki/anki.routes.ts
           │
           └── controller → Anki-Connect at http://127.0.0.1:8765
```

Static assets (`/css/*`, `/js/*`) are served straight from [public/](../public/) by `express.static`.

## Module-based MVC pattern

Each feature is a self-contained folder inside [modules/](../modules/). The convention is:

```
modules/<feature>/
├── index.ts                 # re-exports router + anything callers need
├── <feature>.routes.ts      # express.Router() wiring path → controller
├── <feature>.controller.ts  # HTTP concerns: parse req, shape res, status codes
├── <feature>.service.ts     # business logic, pure-ish functions
├── <feature>.data.ts        # file I/O, dataset loading, caching
└── <feature>.types.ts       # shared TypeScript types for the module
```

Not every module needs all five files. The `anki` module only has `routes` + `controller` because it proxies straight to Anki-Connect and has no local datasets. The `language` module has all five (and is where most of the logic lives).

Active modules:

| Module | Purpose | Docs |
|---|---|---|
| [`language/`](../modules/language/) | Dictionary, segmentation, translation, sentences, audio, HSK words | [modules/language.md](./modules/language.md) |
| [`anki/`](../modules/anki/) | Bridge to local Anki via Anki-Connect | [modules/anki.md](./modules/anki.md) |
| [`interview/`](../modules/interview/) | Empty placeholder for a future module | — |

## Wiring order

[server/app.ts](../server/app.ts) mounts routers in this order:

1. `/api` → `apiRoutes` (generic)
2. `/api/anki` → `ankiRoutes`
3. `/api/language` → `languageRoutes`
4. `/` → `webRoutes`

Static middleware (`express.static(publicDir)`) runs before any of the above, so files under [public/](../public/) short-circuit routing. `ensureCacheFile()` is fired on startup but its result is intentionally ignored — the server still serves the UI even if the cache file can't be created; the failure surfaces later via `/api/words`.

## Separation of concerns

- **Controllers** never touch the filesystem or external APIs directly. They call into services.
- **Services** orchestrate business logic and compose data-layer calls with external HTTP (axios to DeepL, Tatoeba, Anki-Connect).
- **Data layer** ([modules/language/language.data.ts](../modules/language/language.data.ts)) owns filesystem reads, parsing (CC-CEDICT, pinyin-db, HSK JSON, HSK 2025 text lists), and the in-memory dataset caches keyed by file mtime.

## External dependencies

| Dependency | Where it's used |
|---|---|
| `jieba-wasm` | [modules/language/language.service.ts](../modules/language/language.service.ts) — Chinese text segmentation, lazy-loaded singleton |
| `chinese-lexicon` | [modules/language/language.service.ts](../modules/language/language.service.ts) — HSK level fallback when HSK 3.0 JSON misses a word |
| `axios` | DeepL, Tatoeba, Anki-Connect calls |
| `express` | HTTP framework |
| `dotenv` | `.env` loading in [server/index.ts](../server/index.ts) |
| `hanzi-writer` / `hanzi-writer-data` | Installed for frontend stroke-order rendering (wiring exists in [frontend/dashboard.ts](../frontend/dashboard.ts)) |
| `mongoose` | Declared but not used yet — placeholder for when MongoDB replaces the file cache |

## Global rules baked into the service layer

The language service enforces two global rules around surname-leading dictionary entries. See [modules/language.md](./modules/language.md#surname-global-rule) for the full description.

## Frontend entry points

Two separate TypeScript files compile into [public/js/](../public/js/):

- [frontend/app.ts](../frontend/app.ts) → `public/js/app.js`. Minimal shell that calls `/api/health` and sets an on-screen status. Runs on every page load.
- [frontend/dashboard.ts](../frontend/dashboard.ts) → `public/js/dashboard.js`. ~1,400 lines of legacy dashboard logic (tabs, flashcards, saved-word list, topic widgets, etc.). Non-strict TS (`@ts-nocheck` at top) because it's imported verbatim from an earlier monolith.

Two hand-written JS files also live in [public/js/](../public/js/) without a TS source: `text-clipper.js` and `topic-widgets.js` — these are loaded from the HTML shell directly.

See [frontend.md](./frontend.md) for more detail.
