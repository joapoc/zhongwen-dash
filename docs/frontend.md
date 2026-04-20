# Frontend

The frontend is intentionally simple. There is no bundler, no framework — plain compiled TypeScript + vanilla JS + Tailwind (via CDN) loaded by a single HTML page.

## Files

| File | Role |
|---|---|
| [views/index.html](../views/index.html) | Server-rendered HTML shell. Defines all tabs, widgets, and inline script config. |
| [frontend/app.ts](../frontend/app.ts) | Minimal "is the API alive?" indicator. Compiles to [public/js/app.js](../public/js/app.js). |
| [frontend/dashboard.ts](../frontend/dashboard.ts) | Legacy dashboard logic — saved words, flashcards, charDB, persistence. ~1,400 lines. Compiles to [public/js/dashboard.js](../public/js/dashboard.js). |
| [public/js/text-clipper.js](../public/js/text-clipper.js) | Hand-written JS, loaded directly from HTML. No TS source. |
| [public/js/topic-widgets.js](../public/js/topic-widgets.js) | Hand-written JS, loaded directly from HTML. No TS source. |
| [public/css/app.css](../public/css/app.css) | Modern styling on top of Tailwind. |
| [public/css/legacy.css](../public/css/legacy.css) | Legacy styles carried over from the original monolith. |

## Build pipeline

Two TypeScript projects, independent from the server:

- `tsconfig.frontend.json` → compiles `frontend/**/*.ts` to `public/js/`. Config: ES2020, DOM libs, `strict: false`, `noEmitOnError: false`, source maps. Non-strict because `dashboard.ts` starts with `// @ts-nocheck` — it was lifted verbatim from an earlier single-HTML-file monolith ([archive/legacy-dashboard.html](../archive/)).
- ESLint config ([eslint.config.mjs](../eslint.config.mjs)) has a dedicated rule override for `frontend/dashboard.ts` that disables `@typescript-eslint/ban-ts-comment`, `@typescript-eslint/no-unused-vars`, and `no-var`, reflecting the legacy style of that file.

Run in watch mode (default for `npm run dev`):

```bash
tsc --project tsconfig.frontend.json --watch
```

Changes to `frontend/*.ts` trigger a rebuild into `public/js/`. The server serves those files unchanged via `express.static`.

## HTML shell ([views/index.html](../views/index.html))

Key elements:

- **Tailwind via CDN** (`https://cdn.tailwindcss.com`). Inline `tailwind.config` defines a small theme extension: custom fonts (Inter, JetBrains Mono, Noto Sans SC), brand colors (`ink`, `ember`, `sand`, `mist`), and a custom shadow.
- **Google Fonts** preconnect + single stylesheet link for the three font families.
- **Top bar** with logo, XP/streak/word-list badges, notification button, avatar.
- **Tab bar** — 19 tabs: Overview, Tools, Study, Reference, Practice, Handwriting, Words, Text Reader/Clipper, Games, Immerse, Cybersec, Political, Gen Z, Academia, Tourist, Gossip, Makeup, Food, Dropshipping. Tabs are switched with the `switchTab()` function in [dashboard.ts](../frontend/dashboard.ts).
- **Global search** — wired to `filterWidgets()` in [dashboard.ts](../frontend/dashboard.ts).
- **Dashboard widgets** per tab — progress ring, pomodoro timer, character of the day, heatmap, weekly chart, achievements, component tree canvas, etc.

All scripts are loaded at the bottom of the page (check the full file for the exact order). Notable:

- `/js/app.js` — health-check.
- `/js/dashboard.js` — main dashboard.
- `/js/text-clipper.js` — text clipper tool.
- `/js/topic-widgets.js` — per-topic widgets.

## `frontend/app.ts` — API health indicator

```ts
const statusEl = document.getElementById("api-status");

async function loadStatus() {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    if (statusEl) statusEl.textContent = data.status === "ok" ? "API Ready" : "Degraded";
  } catch {
    if (statusEl) statusEl.textContent = "Offline";
  }
}

function initShell() {
  document.documentElement.classList.add("dark");
  loadStatus();
}
```

That's the full file. It adds a `dark` class to `<html>` unconditionally and pokes `/api/health`.

## `frontend/dashboard.ts` — legacy dashboard

This is the biggest frontend file by far. Highlights:

- **`charDB`** — a large inline object literal mapping characters to `{ py, en, rad, str, hsk }`. Used by the "character of the day" widget, tree view, quick lookups.
- **Saved-words system** — `savedWords` is a module-level array. The normalizer `normalizeSavedWord` shapes each entry as `{ cn, py, en, source, sourceArticle, addedAt, inFlashcards }`.
- **Persistence** — `persistSavedWords()` PUTs `/api/words` with the current list. `queuePersistSavedWords()` debounces writes to 120 ms. `loadSavedWordsCache()` fetches `/api/words` on load.
- **Flashcards system** — `flashcards` array, synced with saved words via `rebuildSavedWordFlashcards()`. Each saved word can be toggled in/out of flashcards independently of being saved (via `inFlashcards`).
- **Toasts** — `showToast(cn, py, en, isRemove)` adds a notification element to `#toastContainer` and auto-removes it after 3s.
- **Tab switching, widget filtering, pomodoro, charts, heatmap** — all live in this file.

Because of `@ts-nocheck` and the lint overrides, type errors in this file don't fail the build. Treat edits with caution — there's no type safety net.

## Frontend ↔ API contracts

| Frontend caller | Endpoint | Used for |
|---|---|---|
| `app.ts` `loadStatus()` | `GET /api/health` | Status badge |
| `dashboard.ts` `loadSavedWordsCache()` | `GET /api/words` | Initial load of saved words |
| `dashboard.ts` `persistSavedWords()` | `PUT /api/words` | Save on every change (debounced 120 ms) |

The dashboard does not yet call any `/api/language/*` or `/api/anki/*` routes directly from TypeScript — that integration lives in the hand-written JS files (`text-clipper.js`, `topic-widgets.js`) or is still being wired up. Check `grep`-ing for `/api/language/` in `public/js/*.js` for the exact call sites.

## Adding a new frontend feature

Two paths:

1. **Type-safe path**: write a new `frontend/<feature>.ts`, then reference `/js/<feature>.js` from [views/index.html](../views/index.html). Add it to the `tsconfig.frontend.json` include via `frontend/**/*.ts` (already a glob match). `strict: false` but TS checks still run — keep code clean.
2. **Legacy path**: drop a `.js` file directly under [public/js/](../public/js/), no TS. Only do this if you're extending `text-clipper.js` / `topic-widgets.js` or prototyping.

For a new dashboard widget, add the markup to [views/index.html](../views/index.html) under the appropriate tab, then wire the interactions in [dashboard.ts](../frontend/dashboard.ts).
