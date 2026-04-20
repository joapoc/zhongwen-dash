# Caching & storage

Two distinct layers: MongoDB for user-facing persistence (saved words, completed challenges) and in-memory dataset caches inside the language data layer.

## MongoDB persistence ([server/services/storage.ts](../server/services/storage.ts))

User-facing durable storage. Backs `GET`/`PUT /api/words` and `GET`/`PUT /api/challenges`.

### Connection ([server/services/mongo.ts](../server/services/mongo.ts))

`connectMongo()` is a memoized singleton — the first caller triggers `mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB })`; subsequent callers reuse the same promise. A failed connection clears the cached promise so retries are possible.

[server/index.ts](../server/index.ts) awaits this on boot before calling `app.listen`. If the URI is missing or the server can't reach MongoDB, the process exits with a clear message rather than starting in a broken state.

### Collections

| Collection | Model | Unique index |
|---|---|---|
| `savedwords` | `SavedWord` | `cn` |
| `challenges` | `Challenge` | `id` |

Both schemas are declared with `strict: false` so extra fields round-trip cleanly — the frontend's word normalizer can evolve without a migration.

### Public API

```ts
getSavedWords(): Promise<unknown[]>
setSavedWords(savedWords: unknown[]): Promise<unknown[]>
getChallenges(): Promise<unknown[]>
setChallenges(challenges: unknown[]): Promise<unknown[]>
```

The `set*` functions implement replace-all semantics (`deleteMany({})` + `insertMany(items, { ordered: false })`). This matches the frontend's "send the whole list" PUT pattern and keeps the controllers unchanged from the old file-cache days.

`getChallenges` sorts by `createdAt` descending — newest first.

### One-time migration ([`migrateFileCacheIfNeeded`](../server/services/storage.ts))

If `data/cache.json` exists on boot AND the target collection is empty, `insertMany` copies the legacy array in. Afterwards the file is renamed to `cache.json.migrated` so the next boot doesn't re-run the migration. Triggered from [server/index.ts](../server/index.ts) after `connectMongo`.

This is one-way and opportunistic — it's only there to smooth the transition from the old file-cache era. You can delete `cache.json.migrated` once you're sure the data made it.

### Frontend write pattern

[frontend/dashboard.ts](../frontend/dashboard.ts) debounces saved-words persistence (`queuePersistSavedWords`, 120 ms) and writes challenges eagerly on each completed session. Both end up as `PUT` requests with the full current list.

### Environment

- `MONGODB_URI` — required. Mongo Atlas connection string or local `mongodb://...`.
- `MONGODB_DB` — optional database name. When set, overrides whatever database is encoded in the URI.

See [configuration.md](./configuration.md).

## Language dataset caches ([modules/language/language.data.ts](../modules/language/language.data.ts))

Ephemeral in-memory caches. Speed up repeated reads of large datasets without re-parsing every request.

### Caching strategy

Every loader uses a module-level cache struct with:

- `filePath` / `directoryPath` — which file(s) were last loaded.
- `mtimeMs` (single-file) or `stamp` (multi-file, joined `filePath:mtime` list) — invalidation key.
- `entries` — parsed dataset.
- `count` / `counts` — derived sizes.

On each call, the loader `stat`'s the candidate files, builds a new stamp, compares against the cached stamp. Match → return cached. Miss → re-read and re-parse, update cache, return.

This means:

- **First request after boot** reads from disk. Subsequent requests are memory-speed.
- **Editing a data file while the server runs** invalidates the cache on the next request (mtime changes). No restart needed.
- **Replacing a file with an older copy** (decreasing mtime) also invalidates the cache, since any mtime change triggers a reparse.

### Per-dataset cache objects

Each has its own top-level `const` in [language.data.ts](../modules/language/language.data.ts):

| Cache var | Dataset |
|---|---|
| `cedictCache` | CC-CEDICT, single file |
| `pinyinCache` | pinyin-db, single file |
| `hsk30Cache` | HSK 3.0 word→level map, multi-file |
| `hsk30WordsDatasetCache` | HSK 3.0 full word records, multi-file |
| `handwriting2025Cache` | Handwriting characters per level, multi-file |
| `handwritingWords2025Cache` | Handwriting example words per level, multi-file |
| `handwritingAudio2025Cache` | Set of available audio terms (MP3 directory listing) |

No eviction policy — these live for the lifetime of the Node process. File sizes are modest (CC-CEDICT is the largest at ~120k entries and fits easily in memory).

### Jieba module cache

Separate from the dataset caches. [`getJiebaModule`](../modules/language/language.service.ts) caches the resolved `JiebaModule` in a `Promise`, not a plain value, so concurrent callers wait on the same import rather than triggering two WASM loads.

## What's **not** cached

- **Tatoeba results.** Every `/api/language/sentences/search` request hits the Tatoeba API. No local dedup or caching.
- **DeepL translations.** Every `/api/language/translate` request hits DeepL. Consider this when thinking about cost — caching would reduce API usage but isn't implemented yet.
- **Anki deck listings.** Every `/api/anki/decks` call hits Anki-Connect.

If you need to cache these, do it at the service layer with a small LRU or time-bounded map — do not shoehorn them into the file-cache service, which is scoped to saved-words storage.
