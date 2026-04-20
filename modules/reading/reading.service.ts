import { Readability } from "@mozilla/readability";
import axios from "axios";
import { JSDOM } from "jsdom";
import { promises as fs } from "node:fs";
import path from "node:path";
import Parser from "rss-parser";

import { READING_FEEDS, findFeedById } from "./reading.data";
import type {
  ReadingArticle,
  ReadingFeedCache,
  ReadingFeedCacheEntry,
  ReadingFeedItem,
} from "./reading.types";

const FEED_CACHE_PATH = path.join(process.cwd(), "data", "reading-feed-cache.json");
const ARTICLE_CACHE_PATH = path.join(process.cwd(), "data", "reading-article-cache.json");

const FEED_TTL_MS = 30 * 60 * 1000;
const ARTICLE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_ITEMS_PER_FEED = 100;
const MAX_ARTICLE_ENTRIES = 500;
const FETCH_TIMEOUT_MS = 15000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36";

const rss = new Parser({
  timeout: FETCH_TIMEOUT_MS,
  headers: { "User-Agent": USER_AGENT },
});

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function readFeedCache(): Promise<ReadingFeedCache> {
  try {
    const raw = await fs.readFile(FEED_CACHE_PATH, "utf8");
    const parsed = JSON.parse(raw) as ReadingFeedCache;
    if (!parsed || typeof parsed !== "object" || !parsed.feeds) {
      return { updatedAt: "", feeds: {} };
    }
    return parsed;
  } catch (e) {
    if ((e as NodeJS.ErrnoException)?.code === "ENOENT") {
      return { updatedAt: "", feeds: {} };
    }
    throw e;
  }
}

async function writeFeedCache(cache: ReadingFeedCache): Promise<void> {
  await fs.mkdir(path.dirname(FEED_CACHE_PATH), { recursive: true });
  cache.updatedAt = new Date().toISOString();
  await fs.writeFile(FEED_CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
}

async function readArticleCache(): Promise<Record<string, ReadingArticle & { cachedAt: string }>> {
  try {
    const raw = await fs.readFile(ARTICLE_CACHE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch (e) {
    if ((e as NodeJS.ErrnoException)?.code === "ENOENT") return {};
    throw e;
  }
}

async function writeArticleCache(
  cache: Record<string, ReadingArticle & { cachedAt: string }>,
): Promise<void> {
  // Trim oldest entries if over cap.
  const entries = Object.entries(cache);
  if (entries.length > MAX_ARTICLE_ENTRIES) {
    entries.sort((a, b) => (a[1].cachedAt || "").localeCompare(b[1].cachedAt || ""));
    const trimmed = Object.fromEntries(entries.slice(-MAX_ARTICLE_ENTRIES));
    cache = trimmed;
  }
  await fs.mkdir(path.dirname(ARTICLE_CACHE_PATH), { recursive: true });
  await fs.writeFile(ARTICLE_CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
}

async function fetchFeedItems(feedId: string): Promise<ReadingFeedItem[]> {
  const def = findFeedById(feedId);
  if (!def) return [];
  // Fetch via axios for control over UA + timeout, then hand raw XML to rss-parser.
  const res = await axios.get<string>(def.url, {
    timeout: FETCH_TIMEOUT_MS,
    responseType: "text",
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/rss+xml,application/atom+xml,application/xml,text/xml,*/*",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    },
    validateStatus: (s) => s >= 200 && s < 400,
  });
  const parsed = await rss.parseString(res.data);
  const items: ReadingFeedItem[] = [];
  for (const item of parsed.items || []) {
    const link = (item.link || "").trim();
    const title = (item.title || "").trim();
    if (!link || !title) continue;
    const rawSnippet =
      item.contentSnippet ||
      (item as { summary?: string }).summary ||
      stripTags(item.content || "") ||
      "";
    const snippet = rawSnippet.slice(0, 280).trim();
    items.push({
      feedId: def.id,
      feedName: def.name,
      title,
      link,
      snippet,
      publishedAt: item.isoDate || item.pubDate || "",
      author: item.creator || (item as { author?: string }).author || "",
    });
  }
  items.sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
  return items.slice(0, MAX_ITEMS_PER_FEED);
}

export function listFeeds() {
  return READING_FEEDS;
}

export async function getFeedItems(
  feedId: string,
  refresh: boolean,
): Promise<{
  cached: boolean;
  stale?: boolean;
  message?: string;
  fetchedAt: string;
  items: ReadingFeedItem[];
}> {
  const def = findFeedById(feedId);
  if (!def) throw new Error(`Unknown feed: ${feedId}`);
  const cache = await readFeedCache();
  const entry: ReadingFeedCacheEntry | undefined = cache.feeds[feedId];
  const fresh =
    entry && Date.now() - new Date(entry.fetchedAt).getTime() < FEED_TTL_MS;

  if (entry && fresh && !refresh) {
    return { cached: true, fetchedAt: entry.fetchedAt, items: entry.items };
  }

  try {
    const items = await fetchFeedItems(feedId);
    const now = new Date().toISOString();
    if (!items.length && entry) {
      return {
        cached: true,
        stale: true,
        message: "Live fetch returned nothing — showing cached entries.",
        fetchedAt: entry.fetchedAt,
        items: entry.items,
      };
    }
    cache.feeds[feedId] = { feedId, fetchedAt: now, items };
    await writeFeedCache(cache);
    return { cached: false, fetchedAt: now, items };
  } catch (err) {
    if (entry) {
      return {
        cached: true,
        stale: true,
        message: err instanceof Error ? err.message : "Fetch failed.",
        fetchedAt: entry.fetchedAt,
        items: entry.items,
      };
    }
    throw err;
  }
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    return u.toString();
  } catch {
    return url;
  }
}

export async function getArticle(
  rawUrl: string,
  refresh: boolean,
): Promise<ReadingArticle> {
  const url = normalizeUrl(rawUrl);
  const cache = await readArticleCache();
  const cached = cache[url];
  const fresh =
    cached && Date.now() - new Date(cached.cachedAt).getTime() < ARTICLE_TTL_MS;

  if (cached && fresh && !refresh) {
    return { ...cached, cached: true };
  }

  const res = await axios.get<string>(url, {
    timeout: FETCH_TIMEOUT_MS,
    responseType: "text",
    headers: {
      "User-Agent": USER_AGENT,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    },
    validateStatus: (s) => s >= 200 && s < 400,
    maxRedirects: 5,
  });

  const dom = new JSDOM(res.data, { url });
  const reader = new Readability(dom.window.document);
  const parsed = reader.parse();

  if (!parsed || !parsed.content) {
    throw new Error("Could not extract article content — the page may require JS or be paywalled.");
  }

  const wordCount =
    parsed.textContent?.replace(/\s+/g, "").length || parsed.length || 0;

  const article: ReadingArticle = {
    ok: true,
    url,
    title: parsed.title || "",
    byline: parsed.byline || undefined,
    siteName: parsed.siteName || undefined,
    publishedAt: (parsed as { publishedTime?: string }).publishedTime,
    lang: parsed.lang || undefined,
    wordCount,
    contentHtml: parsed.content,
    textContent: parsed.textContent || "",
    cached: false,
  };

  cache[url] = { ...article, cachedAt: new Date().toISOString() };
  await writeArticleCache(cache);

  return article;
}

export async function clearCaches(): Promise<void> {
  try {
    await fs.rm(FEED_CACHE_PATH, { force: true });
  } catch {
    // ignore
  }
  try {
    await fs.rm(ARTICLE_CACHE_PATH, { force: true });
  } catch {
    // ignore
  }
}
