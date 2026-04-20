# Getting started

## Prerequisites

- Node.js (tested with current LTS — the repo uses `@types/node@^25` and targets ES2022)
- npm
- Optional: a local Anki install with the [Anki-Connect](https://ankiweb.net/shared/info/2055492159) add-on, listening on `http://127.0.0.1:8765`, if you want the `/api/anki/*` routes to return real data.
- Optional: a DeepL API key (Free or Pro), if you want the `/api/language/translate` route to work.

## Install

```bash
npm install
```

## Running in development

```bash
npm run dev
```

What this does (see [package.json](../package.json)):

- Starts `tsc --project tsconfig.frontend.json --watch` — recompiles `frontend/*.ts` to `public/js/` on every change.
- Starts `tsx watch server/index.ts` — runs the server in watch mode with hot reload on TS changes.

Both run concurrently via the `concurrently` dependency.

Open [http://localhost:3000](http://localhost:3000) once the server logs `Zhongwen Dash server running at http://localhost:3000`.

## One-off build

```bash
npm run build         # builds server + frontend
npm run build:server  # only server → dist/
npm run build:frontend # only frontend → public/js/
```

## Running the production build

```bash
npm start             # node dist/server/index.js
```

`npm start` does **not** rebuild. Run `npm run build` first.

## Environment variables

Create a `.env` in the repo root. Only variables you need:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/      # required
MONGODB_DB=ZhongwenDB                                         # optional database name override
DEEPL_AUTH_KEY=your-deepl-key-here
DEEPL_TARGET_LANG=EN-US      # default, also accepts EN or EN-GB
DEEPL_FREE_API=1             # optional, forces the free-tier DeepL endpoint
PORT=3000                    # default
```

**`MONGODB_URI` is required.** The server refuses to start without a working Mongo connection — saved words and challenges persistence is backed by Mongo (see [caching-and-storage.md](./caching-and-storage.md)). Atlas or local `mongod` both work. Use `#` for comments in `.env` (not `//`).

Notes:

- If `DEEPL_AUTH_KEY` ends in `:fx` it's auto-detected as a free-tier key, so you don't need `DEEPL_FREE_API=1` in that case (see [modules/language/language.service.ts](../modules/language/language.service.ts) around the `freeApi` detection).
- Without `DEEPL_AUTH_KEY`, `/api/language/translate` returns HTTP 503 with a message explaining the key isn't configured. The rest of the app works fine.

See [configuration.md](./configuration.md) for the full list.

## Verifying it works

Once `npm run dev` is running, you can hit the endpoints directly:

```bash
curl http://localhost:3000/api/health
curl "http://localhost:3000/api/language/status"
curl "http://localhost:3000/api/language/dictionary/search?query=%E5%AD%A6%E4%B9%A0"
```

`/api/language/status` is the best starting point — it reports which datasets were detected on disk and which are missing. See [data-sources.md](./data-sources.md) for what each resource means.

## Optional: populating local datasets

The repo ships with:

- [data/language/cedict_ts.u8](../data/language/cedict_ts.u8) — CC-CEDICT dictionary (already present)
- [data/hsk3.0-json/](../data/hsk3.0-json/) — HSK 3.0 vocabulary JSON (already present)
- [data/HSK 3.0 Handwritten 2025/](../data/HSK%203.0%20Handwritten%202025/) — handwriting character lists per level
- [data/HSK 3.0 Words 2025/](../data/HSK%203.0%20Words%202025/) — word lists per level
- [data/HSK 3.0 Audio 2025/](../data/HSK%203.0%20Audio%202025/) — MP3 pronunciations

Missing by default:

- `pinyin_db.txt` in [data/language/](../data/language/) — drop a pinyin-db export there to enable `/api/language/readings/:character`.

See [data-sources.md](./data-sources.md) for expected filenames and layout.
