# Caching & storage

Two distinct caches live in the app: the user's saved-words persistence file (`data/cache.json`) and the in-memory dataset caches inside the language data layer. They have very different semantics — this doc covers both.

## Saved-words persistence ([server/services/file-cache.ts](../server/services/file-cache.ts))

User-facing durable storage. Backs `GET /api/words` and `PUT /api/words`.

### File layout

- **Path:** `data/cache.json` (relative to the repo root, resolved from `__dirname + "../../data"`).
- **Shape:** `{ "savedWords": [...] }`.
- **Default:** `{ "savedWords": [] }`.

### Boot

`server/app.ts` calls [`ensureCacheFile()`](../server/services/file-cache.ts) at startup. That function:

1. Creates the `data/` directory if missing (`fs.mkdir(..., { recursive: true })`).
2. Checks whether `cache.json` exists; if not, writes the default shape.

The boot call intentionally swallows errors — the server still serves the UI if the cache init fails. Failures surface later when `/api/words` is hit.

### Reads ([`readCache`](../server/services/file-cache.ts))

1. `ensureCacheFile()` (so the file exists).
2. Parse `cache.json`. On any parse error, return the default shape.
3. Coerce `savedWords` to `[]` if the parsed field isn't an array.

The result is merged over `defaultCache`, so unknown future fields are preserved on round-trips (add, serialize, write).

### Writes ([`writeCache`](../server/services/file-cache.ts))

Two safety mechanisms:

**1. Atomic write-then-rename.** Every write goes to `cache.json.tmp` first, then `fs.rename`'s over the real file. Rename is atomic on every POSIX filesystem and on modern NTFS, so readers never see a partially-written JSON file.

**2. Serialized write queue.** A module-level `writeQueue: Promise<void>` chains each write to the previous one:

```ts
let writeQueue: Promise<void> = Promise.resolve();

function writeCache(nextCache) {
  writeQueue = writeQueue.then(async () => { ...atomic write... });
  return writeQueue;
}
```

This means parallel `PUT /api/words` requests execute in order, one after another. Without it, two concurrent writes could race on the tmp file and lose data. Every caller awaits the queue, so each write sees the completion of all prior writes.

### Public API

Two exports, both `async`:

```ts
getSavedWords(): Promise<unknown[]>
setSavedWords(savedWords: unknown[]): Promise<unknown[]>
```

`setSavedWords` coerces non-arrays to `[]`, writes, and returns the saved value. Callers never interact with the raw file.

### Frontend write pattern

[frontend/dashboard.ts](../frontend/dashboard.ts) debounces persistence: `queuePersistSavedWords` sets a 120 ms timeout; rapid edits collapse into one PUT.

### When to replace this

`mongoose` is already declared as a dependency — the intent is to swap the file cache for MongoDB when the user base or data shape outgrows JSON-on-disk. When that happens, keep `getSavedWords`/`setSavedWords` as the public surface and replace only the internals.

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
