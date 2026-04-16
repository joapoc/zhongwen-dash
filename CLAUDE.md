# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zhongwen Dash is a Chinese language learning dashboard built with Express.js and TypeScript. It provides dictionary lookup, text segmentation, translation (via DeepL), example sentences (via Tatoeba), character handwriting data, and HSK audio resources.

## Commands

```bash
npm run dev           # Development with watch mode (frontend + server concurrently)
npm run build         # Build both server and frontend TypeScript
npm run build:server  # Build server only (to dist/)
npm run build:frontend # Build frontend only (to public/js/)
npm start             # Run compiled server from dist/
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix ESLint issues
```

## Architecture

**Module-Based MVC Pattern** - Each feature is a self-contained module in `modules/`:

```
modules/<feature>/
├── index.ts           # Module exports
├── <feature>.routes.ts     # Express router definitions
├── <feature>.controller.ts # Request/response handling
├── <feature>.service.ts    # Business logic
├── <feature>.data.ts       # Data access layer
└── <feature>.types.ts      # TypeScript types
```

**Active Modules:**
- `language/` - Core language processing (dictionary, segmentation, translation, sentences, audio)
- `anki/` - Anki flashcard integration

**Key Directories:**
- `server/` - Express app entry point, core routes, middleware setup
- `frontend/` - Client-side TypeScript (compiles to `public/js/`)
- `views/` - Server-rendered HTML templates
- `data/` - Local cache, HSK audio files, handwriting data, vocabulary lists

## API Routes

- `/api/health` - Health check
- `/api/words` - Saved words cache (GET/PUT)
- `/api/language/dictionary/search` - Dictionary lookup
- `/api/language/readings/:character` - Pinyin readings
- `/api/language/segment` (POST) - Chinese text segmentation (jieba-wasm)
- `/api/language/translate` (POST) - Translation via DeepL
- `/api/language/sentences/search` - Example sentences from Tatoeba
- `/api/language/handwriting` - Character stroke data
- `/api/language/audio/:term` - HSK audio files
- `/api/anki/decks` - List Anki decks

## TypeScript Configuration

Two separate configs:
- `tsconfig.json` - Server/modules (ES2022, Node16, strict mode)
- `tsconfig.frontend.json` - Frontend (ES2020, DOM libs, non-strict for legacy dashboard.ts)

## Environment Variables

```
DEEPL_AUTH_KEY      # DeepL API key (required for translation)
DEEPL_TARGET_LANG   # Target language (default: EN-US)
PORT                # Server port (default: 3000)
```

## Key Libraries

- `jieba-wasm` - Chinese text segmentation
- `chinese-lexicon` - Dictionary/vocabulary data
- `hanzi-writer` + `hanzi-writer-data` - Character stroke animation
- `deepl` - Translation API client

## Data & Caching

Local file-based cache (`data/cache.json`) via `server/services/file-cache.ts` with atomic writes and write queue. Language data falls back from local files (`data/language/`) to `chinese-lexicon` package.

## Global Rules

**Surname Definition Handling**: Two-part global rule in `language.service.ts`:
1. **Scoring** (`isSurnameLeadingEntry`): Dictionary entries where the first definition is "surname X" get a 50-point penalty, so entries with common meanings (e.g., 都="all") rank above surname entries (都="surname Du")
2. **Reordering** (`enrichDefinitions`): When an entry has "surname X" as its first definition but also has other meanings, reorder to show meaningful definitions first (e.g., ["surname Li", "plum"] becomes ["plum", "surname Li"])
