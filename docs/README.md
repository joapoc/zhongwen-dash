# Zhongwen Dash — Documentation

A Chinese language learning dashboard built with Express.js and TypeScript. It bundles dictionary lookup, Chinese text segmentation, translation, example sentences, HSK vocabulary lists, character handwriting data, audio playback, and a bridge to Anki flashcards.

This `docs/` folder describes how the app is put together, how to run it, and how each piece fits. The authoritative short-form guidance for AI tools lives in the repo root [CLAUDE.md](../CLAUDE.md); docs here expand on that.

## Table of contents

- [Getting started](./getting-started.md) — install, run, and verify the app works end-to-end.
- [Architecture](./architecture.md) — module-based MVC layout, request flow, and how server/frontend are wired.
- [API reference](./api-reference.md) — every HTTP endpoint, request shape, and response shape.
- [Configuration](./configuration.md) — environment variables, TypeScript configs, ESLint setup.
- [Data sources](./data-sources.md) — CC-CEDICT, pinyin-db, HSK 3.0 JSON, 2025 handwriting/words/audio, and fallbacks.
- [Caching & storage](./caching-and-storage.md) — MongoDB persistence for saved words + challenges, connection singleton, one-time migration from `cache.json`, in-memory dataset caches.
- [Frontend](./frontend.md) — `frontend/app.ts`, `frontend/dashboard.ts`, the `views/index.html` shell, tabs, Tailwind usage.
- [Development workflow](./development.md) — commands, dev loop, lint rules, manual verification.
- **Modules:**
  - [Language module](./modules/language.md) — dictionary, segmentation, translation, sentences, handwriting, audio, HSK words.
  - [Anki module](./modules/anki.md) — Anki-Connect integration for deck listing and opening decks.

## At a glance

| Layer | Path | Tech |
|---|---|---|
| Server entry | [server/index.ts](../server/index.ts) | Node, Express 5 |
| Express app | [server/app.ts](../server/app.ts) | Express, static assets |
| API routes | [server/routes/api.ts](../server/routes/api.ts) | `/api/health`, `/api/words` |
| Web route | [server/routes/web.ts](../server/routes/web.ts) | serves `views/index.html` |
| Storage | [server/services/storage.ts](../server/services/storage.ts) | MongoDB via mongoose (saved words + challenges) |
| Mongo conn | [server/services/mongo.ts](../server/services/mongo.ts) | Memoized `mongoose.connect` singleton |
| Language module | [modules/language/](../modules/language/) | CC-CEDICT, jieba, DeepL, Tatoeba |
| Anki module | [modules/anki/](../modules/anki/) | Anki-Connect HTTP bridge |
| Frontend shell | [frontend/app.ts](../frontend/app.ts) | API health indicator |
| Legacy dashboard | [frontend/dashboard.ts](../frontend/dashboard.ts) | Tabs, widgets, saved words, flashcards |
| HTML shell | [views/index.html](../views/index.html) | Tailwind via CDN, many tabs |
