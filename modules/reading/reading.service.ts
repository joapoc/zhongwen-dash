import { Readability } from "@mozilla/readability";
import axios from "axios";
import { JSDOM } from "jsdom";
import { promises as fs } from "node:fs";
import path from "node:path";
import Parser from "rss-parser";

import { fetchViaBrowser } from "./reading.browser";
import { READING_FEEDS, findFeedById, findFeedsByTag } from "./reading.data";
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

// Fetches every feed with the given tag in parallel and returns merged
// items sorted newest-first. Per-feed errors are swallowed so a single
// dead feed doesn't kill the topic stream — we just include whatever
// loaded successfully and surface a message naming the failed feeds.
export async function getFeedItemsByTag(
  tag: string,
  refresh: boolean,
): Promise<{
  tag: string;
  feeds: { id: string; name: string; description: string; tag: string; url: string; homepage?: string }[];
  fetchedAt: string;
  total: number;
  failed: { feedId: string; message: string }[];
  items: ReadingFeedItem[];
}> {
  const feeds = findFeedsByTag(tag);
  if (!feeds.length) {
    return { tag, feeds: [], fetchedAt: new Date().toISOString(), total: 0, failed: [], items: [] };
  }
  const results = await Promise.allSettled(
    feeds.map((f) => getFeedItems(f.id, refresh)),
  );
  const merged: ReadingFeedItem[] = [];
  const failed: { feedId: string; message: string }[] = [];
  results.forEach((r, idx) => {
    const feed = feeds[idx];
    if (r.status === "fulfilled") {
      for (const it of r.value.items) merged.push(it);
    } else {
      failed.push({
        feedId: feed.id,
        message: r.reason instanceof Error ? r.reason.message : String(r.reason),
      });
    }
  });
  merged.sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
  return {
    tag,
    feeds,
    fetchedAt: new Date().toISOString(),
    total: merged.length,
    failed,
    items: merged,
  };
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

// Google News RSS items use a redirect URL that encodes the target article
// in a signed protobuf blob decoded only by client-side JS. For these we run
// a headless Chromium (see reading.browser.ts) which lets the redirect settle
// and hands back the final URL + rendered HTML.
function isGoogleNewsUrl(url: string): boolean {
  return /^https?:\/\/news\.google\.com\//i.test(url);
}

async function fetchHtmlViaAxios(url: string): Promise<{ html: string; finalUrl: string }> {
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
  return { html: res.data, finalUrl: url };
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

  // Google News → always go through Playwright. Other URLs use the fast
  // axios path; if Readability can't make sense of the result we retry via
  // the browser as a fallback (covers SPAs and paywall detours).
  const useBrowserFirst = isGoogleNewsUrl(url);
  let html: string;
  let finalUrl: string;
  let usedBrowser = false;

  if (useBrowserFirst) {
    try {
      const result = await fetchViaBrowser(url);
      html = result.html;
      finalUrl = result.finalUrl;
      usedBrowser = true;
    } catch (err) {
      throw new Error(
        `Headless browser could not resolve this page: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  } else {
    const result = await fetchHtmlViaAxios(url);
    html = result.html;
    finalUrl = result.finalUrl;
  }

  let dom = new JSDOM(html, { url: finalUrl });
  let parsed = new Readability(dom.window.document).parse();

  if ((!parsed || !parsed.content) && !usedBrowser) {
    // Fallback: some sites ship a near-empty skeleton that Readability can't
    // handle. Try again through the headless browser so the client-side
    // render has a chance to populate content.
    try {
      const result = await fetchViaBrowser(url);
      html = result.html;
      finalUrl = result.finalUrl;
      usedBrowser = true;
      dom = new JSDOM(html, { url: finalUrl });
      parsed = new Readability(dom.window.document).parse();
    } catch {
      // fall through to the error below
    }
  }

  if (!parsed || !parsed.content) {
    throw new Error(
      usedBrowser
        ? `Readability could not find article content at ${new URL(finalUrl).hostname}. The site may be a list page or require login.`
        : "Could not extract article content — the page may require JS or be paywalled.",
    );
  }

  const wordCount =
    parsed.textContent?.replace(/\s+/g, "").length || parsed.length || 0;

  const article: ReadingArticle = {
    ok: true,
    url: finalUrl || url,
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
