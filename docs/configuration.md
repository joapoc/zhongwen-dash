# Configuration

## Environment variables

All env vars are optional unless noted. Loaded via `dotenv/config` in [server/index.ts](../server/index.ts). Place a `.env` in the repo root.

| Variable | Default | Used by | Notes |
|---|---|---|---|
| `PORT` | `3000` | [server/index.ts](../server/index.ts) | Coerced with `Number()`, falls back to 3000 on `NaN`. |
| `MONGODB_URI` | — | [server/services/mongo.ts](../server/services/mongo.ts) | **Required.** Connection string (e.g., `mongodb+srv://user:pass@cluster/`). Startup aborts if missing or unreachable. |
| `MONGODB_DB` | — (uses URI default) | [server/services/mongo.ts](../server/services/mongo.ts) | Optional database name. When set, overrides whatever database is encoded in the URI. |
| `DEEPL_AUTH_KEY` | — | [language.service.ts](../modules/language/language.service.ts) | Required for `/api/language/translate`. Without it, that route returns 503. |
| `DEEPL_TARGET_LANG` | `EN-US` | [language.service.ts](../modules/language/language.service.ts) | Upper-cased at load time. Accepted: `EN`, `EN-US`, `EN-GB`. |
| `DEEPL_FREE_API` | — | [language.service.ts](../modules/language/language.service.ts) | Set to `1` to force the DeepL free-tier endpoint (`api-free.deepl.com`). Auto-detected when the key ends with `:fx`. |

**`.env` comment syntax:** use `#`, not `//`. dotenv silently skips `//`-prefixed lines (they don't match the `KEY=VALUE` pattern), so they work as no-ops today — but it's not standard.

## TypeScript configs

Two separate `tsconfig` files, compiled independently.

### [tsconfig.json](../tsconfig.json) — server

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "rootDir": ".",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "sourceMap": true
  },
  "include": ["server/**/*.ts", "modules/**/*.ts"],
  "exclude": ["dist", "node_modules"]
}
```

Notes:

- `module: "Node16"` — ESM-ish resolution with `.js` extensions on relative imports, but the repo uses CommonJS (`"type": "commonjs"` in package.json) so `require()` of `chinese-lexicon` works. TS is lenient enough about this mix.
- `strict: true` — all strictness flags on. New server/module code is expected to type-check cleanly.
- Only `server/` and `modules/` are compiled; frontend is a separate project.

### [tsconfig.frontend.json](../tsconfig.frontend.json) — frontend

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "preserve",
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "rootDir": "frontend",
    "outDir": "public/js",
    "strict": false,
    "noEmitOnError": false,
    "removeComments": false,
    "skipLibCheck": true
  },
  "include": ["frontend/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

Notes:

- `strict: false` and `noEmitOnError: false` — lets the legacy `dashboard.ts` compile despite its `// @ts-nocheck` and loose typing. New frontend modules can still be typed cleanly; only `dashboard.ts` needs the escape hatches.
- `module: "preserve"` — emits whatever the source used, lets `tsc` pass through ES module syntax if present. Both output files today are plain script-style JS.

## ESLint

Config: [eslint.config.mjs](../eslint.config.mjs). Flat config, built on `typescript-eslint` recommended + ESLint recommended.

Ignored paths: `dist/`, `node_modules/`, `archive/`, `public/`, `views/`, `data/`.

Language-specific rule sets:

- `**/*.js` — Node globals, `no-console` off.
- `**/*.ts` — browser + Node globals, `no-console` off.
- `frontend/dashboard.ts` — additional overrides: `@typescript-eslint/ban-ts-comment` off (so `@ts-nocheck` is allowed), `@typescript-eslint/no-unused-vars` off, `no-var` off. These reflect the legacy style of that file and shouldn't be relaxed elsewhere.

Run lint:

```bash
npm run lint      # check
npm run lint:fix  # auto-fix
```

## package.json

[package.json](../package.json). Key fields:

- `"type": "commonjs"` — the server compiles to CommonJS. Keep it this way unless you're ready to migrate all imports to ESM.
- `"main": "dist/server/index.js"` — post-build entry.
- No `engines` constraint declared, but types target `@types/node@^25`, which implies a recent Node (current LTS).

### Scripts

| Script | What it runs |
|---|---|
| `dev` | `concurrently` runs `tsc --project tsconfig.frontend.json --watch` + `tsx watch server/index.ts`. |
| `build` | Sequentially: `build:server` → `build:frontend`. |
| `build:server` | `tsc --project tsconfig.json`. |
| `build:frontend` | `tsc --project tsconfig.frontend.json`. |
| `start` | `node dist/server/index.js`. Does **not** build first. |
| `lint` / `lint:fix` | `eslint .` with/without `--fix`. |
| `test` | Placeholder — echoes a message. No test runner wired up. |

## Git ignore and data

The `data/` tree is committed so the app works out of the box (CC-CEDICT, HSK JSON, handwriting lists, audio). User-writable persistence (saved words, challenges) now lives in MongoDB — see [caching-and-storage.md](./caching-and-storage.md). A legacy `data/cache.json.migrated` may exist after the first Mongo-enabled boot; it's safe to delete once you've verified the data migrated.

## Runtime directory expectations

The language data layer resolves paths from `process.cwd()`:

```ts
const languageDataDir = path.join(process.cwd(), "data", "language");
```

That means the app **must be run from the repo root**. `npm run dev` and `npm start` both satisfy this. If you run `node dist/server/index.js` directly from another directory, the language module will fail to find its datasets.
