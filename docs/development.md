# Development workflow

## The dev loop

```bash
npm run dev
```

Runs two watchers concurrently:

- `tsc --project tsconfig.frontend.json --watch` — recompiles `frontend/*.ts` to `public/js/` on every save.
- `tsx watch server/index.ts` — restarts the server on any change in files it imports (so edits under `server/`, `modules/`, or the project's own `.env` trigger a restart).

Both print to the same terminal, prefixed by `concurrently`.

Hit `Ctrl+C` once to stop both.

### What triggers what

| Change | Server restart? | Frontend rebuild? | Reload browser? |
|---|---|---|---|
| `server/**/*.ts` | yes (via tsx) | no | hard-refresh to pick up HTML changes; JSON API responses pick up automatically on next request |
| `modules/**/*.ts` | yes | no | same |
| `frontend/**/*.ts` | no | yes | manual refresh (no HMR) |
| `views/index.html` | no | no | manual refresh |
| `public/css/*`, `public/js/*` (hand-edited) | no | no | manual refresh |
| `data/**` (e.g., updating CC-CEDICT) | no (caches invalidate on mtime change at next request) | no | — |

There is no live-reload / HMR. The workflow is "edit, let the build finish, refresh the browser tab".

## Building for production

```bash
npm run build
npm start
```

- `build` produces `dist/server/**/*.js` and `public/js/**/*.js`.
- `start` runs `node dist/server/index.js`. It does not rebuild. CI or a release script should run `build` before `start`.

## Linting

```bash
npm run lint       # fail on issues
npm run lint:fix   # auto-fix and rewrite files
```

ESLint config is [eslint.config.mjs](../eslint.config.mjs). Notable: `frontend/dashboard.ts` has a dedicated ruleset that turns off `@ts-nocheck` warnings, unused-var checks, and the `no-var` rule — those three are legacy concessions to the original monolith. Don't copy that pattern elsewhere.

## Tests

There is no test runner configured. `npm test` prints "No automated tests configured yet."

Manual verification approach:

1. Start `npm run dev`.
2. Hit `/api/language/status` to confirm datasets are loaded.
3. Hit the endpoint you changed with `curl` or directly in the browser, and confirm the response shape matches [api-reference.md](./api-reference.md).
4. For UI changes, refresh [http://localhost:3000](http://localhost:3000) and exercise the feature. Watch the browser console for errors.

If you add tests, wire them into the `test` script in [package.json](../package.json) so `npm test` does the right thing.

## Adding a new server route

Typical flow (using the language module conventions — see [modules/language.md](./modules/language.md)):

1. Add a type to the module's `<feature>.types.ts` if the response shape is new.
2. Add a loader to `<feature>.data.ts` if it reads from disk, following the mtime-stamped pattern in [language.data.ts](../modules/language/language.data.ts).
3. Add business logic in `<feature>.service.ts`.
4. Add an HTTP handler in `<feature>.controller.ts`. Validate required inputs, convert upstream errors to appropriate status codes (502 for remote proxy failures, 503 for missing config).
5. Register in `<feature>.routes.ts`.
6. If it's a new dataset, add an entry to `getLanguageResourceStatus` so `/api/language/status` reports it.
7. Document in [api-reference.md](./api-reference.md).

## Adding a new module

1. Create `modules/<name>/` with at minimum `index.ts`, `<name>.routes.ts`, `<name>.controller.ts`.
2. Add services/data/types files as the feature grows.
3. Export a Router from `index.ts` as `<name>Routes`.
4. Mount it in [server/app.ts](../server/app.ts): `app.use("/api/<name>", <name>Routes);`.
5. Add a docs page under `docs/modules/<name>.md`.

The `interview/` directory is a placeholder for exactly this kind of expansion.

## Common gotchas

- **Run from repo root.** The data layer uses `process.cwd()`, so running the built binary from another directory will lose all local datasets.
- **Cache invalidates on mtime, not content.** Touching a data file (even without changes) triggers a reparse.
- **Anki-Connect is IPv4/IPv6 sensitive.** The controller tries `127.0.0.1:8765` and `localhost:8765` in that order. If both fail, confirm Anki is running and the add-on is enabled.
- **DeepL free vs pro detection.** If your free key doesn't end in `:fx`, set `DEEPL_FREE_API=1` explicitly or you'll hit the pro endpoint and get 403s.
- **Surname rule is global.** Any new dictionary-returning endpoint should run definitions through `enrichDefinitions` / `formatDefinitionsForDisplay` to stay consistent. See [modules/language.md](./modules/language.md#surname-global-rule).

## Editor setup

The repo plays well with VS Code out of the box:

- TypeScript uses the bundled version unless you point the workspace at `node_modules/typescript`.
- ESLint extension picks up [eslint.config.mjs](../eslint.config.mjs) automatically.
- Source maps are enabled for the server build (`sourceMap: true` in `tsconfig.json`), so stack traces in `dist/` trace back to `.ts` sources.

## Committing

Working-directory status from the repo's snapshot reveals a handful of in-progress files under `frontend/dashboard.ts`, `public/js/dashboard.js`, `views/index.html`, `modules/language/*`, and `.claude/settings.local.json`. Check `git status` before committing — those may or may not be yours.

Commits follow no strict convention yet; recent messages: `surname bug fixed`, `3.0 2025`, `v2`, `zn`. If you're introducing a convention, [CLAUDE.md](../CLAUDE.md) is the right place to document it so future automated tooling follows it.
