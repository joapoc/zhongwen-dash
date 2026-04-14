import { promises as fs } from "node:fs";
import path from "node:path";

type CacheShape = {
  savedWords: unknown[];
};

const dataDir = path.join(__dirname, "..", "..", "data");
const cacheFile = path.join(dataDir, "cache.json");

const defaultCache: CacheShape = {
  savedWords: [],
};

let writeQueue: Promise<void> = Promise.resolve();

export async function ensureCacheFile(): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(cacheFile);
  } catch {
    await fs.writeFile(cacheFile, JSON.stringify(defaultCache, null, 2), "utf8");
  }
}

async function readCache(): Promise<CacheShape> {
  await ensureCacheFile();

  try {
    const raw = await fs.readFile(cacheFile, "utf8");
    const parsed = JSON.parse(raw || "{}") as Partial<CacheShape>;

    return {
      ...defaultCache,
      ...parsed,
      savedWords: Array.isArray(parsed.savedWords) ? parsed.savedWords : [],
    };
  } catch {
    return { ...defaultCache };
  }
}

function writeCache(nextCache: CacheShape): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    await ensureCacheFile();
    const tempFile = `${cacheFile}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(nextCache, null, 2), "utf8");
    await fs.rename(tempFile, cacheFile);
  });

  return writeQueue;
}

export async function getSavedWords(): Promise<unknown[]> {
  const cache = await readCache();
  return cache.savedWords;
}

export async function setSavedWords(savedWords: unknown[]): Promise<unknown[]> {
  const cache = await readCache();
  const nextSavedWords = Array.isArray(savedWords) ? savedWords : [];

  await writeCache({
    ...cache,
    savedWords: nextSavedWords,
  });

  return nextSavedWords;
}
