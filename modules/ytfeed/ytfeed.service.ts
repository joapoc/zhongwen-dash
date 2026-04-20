import axios from "axios";
import { promises as fs } from "node:fs";
import path from "node:path";

import type { FeedPayload, FeedResponse, FeedVideo } from "./ytfeed.types";

const CACHE_PATH = path.join(process.cwd(), "data", "yt-feed-cache.json");
const MAX_RESPONSE_ITEMS = 500;
const MAX_CACHE_ITEMS = 5000;
const FETCH_TIMEOUT_MS = 12000;
const RSS_BASE = "https://www.youtube.com/feeds/videos.xml?channel_id=";
const USER_AGENT = "Mozilla/5.0 (compatible; ZhongwenDash/1.0; yt-feed)";
const CHANNEL_ID_RE = /^UC[A-Za-z0-9_-]{10,}$/;
const HANDLE_RE = /^[A-Za-z0-9._-]+$/;

function decodeXml(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'");
}

// YouTube Atom feed item — parse without an XML dep since the shape is stable
// enough and each entry is self-contained.
function parseRssFeed(xml: string): FeedVideo[] {
  const items: FeedVideo[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match: RegExpExecArray | null;
  while ((match = entryRegex.exec(xml)) !== null) {
    const chunk = match[1];
    const videoId = chunk.match(/<yt:videoId>([^<]+)<\/yt:videoId>/i)?.[1] || "";
    const channelId = chunk.match(/<yt:channelId>([^<]+)<\/yt:channelId>/i)?.[1] || "";
    const title = decodeXml(
      chunk.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "",
    );
    const link = chunk.match(/<link[^>]*href="([^"]+)"/i)?.[1] || "";
    const channelName = decodeXml(
      chunk.match(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>/i)?.[1]?.trim() || "",
    );
    const published = chunk.match(/<published>([^<]+)<\/published>/i)?.[1] || "";
    const thumb =
      chunk.match(/<media:thumbnail[^>]*url="([^"]+)"/i)?.[1] ||
      (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "");
    if (!videoId || !channelId || !title) continue;
    items.push({
      channelId,
      channelName,
      videoId,
      title,
      url: link || `https://www.youtube.com/watch?v=${videoId}`,
      thumbnailUrl: thumb,
      publishedAt: published,
    });
  }
  return items;
}

async function readCache(): Promise<FeedPayload | null> {
  try {
    const raw = await fs.readFile(CACHE_PATH, "utf8");
    const parsed = JSON.parse(raw) as FeedPayload;
    if (!parsed || !Array.isArray(parsed.items)) return null;
    return parsed;
  } catch (e: unknown) {
    if ((e as NodeJS.ErrnoException)?.code === "ENOENT") return null;
    throw e;
  }
}

async function writeCache(items: FeedVideo[]): Promise<void> {
  await fs.mkdir(path.dirname(CACHE_PATH), { recursive: true });
  const payload: FeedPayload = {
    updatedAt: new Date().toISOString(),
    items,
  };
  await fs.writeFile(CACHE_PATH, JSON.stringify(payload, null, 2), "utf8");
}

// Merge-and-grow: new items append, existing ones keep their slot. Key is the
// composite (channelId, videoId) so duplicate scrapes don't explode the cache.
function mergeItems(existing: FeedVideo[], fresh: FeedVideo[]): FeedVideo[] {
  const map = new Map<string, FeedVideo>();
  for (const item of existing) map.set(`${item.channelId}::${item.videoId}`, item);
  for (const item of fresh) map.set(`${item.channelId}::${item.videoId}`, item);
  const merged = [...map.values()];
  merged.sort((left, right) =>
    (right.publishedAt || "").localeCompare(left.publishedAt || ""),
  );
  return merged.slice(0, MAX_CACHE_ITEMS);
}

async function fetchRssForChannel(channelId: string): Promise<FeedVideo[]> {
  const url = RSS_BASE + encodeURIComponent(channelId);
  try {
    const res = await axios.get<string>(url, {
      timeout: FETCH_TIMEOUT_MS,
      responseType: "text",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/atom+xml,application/xml,text/xml",
      },
      validateStatus: (status) => status >= 200 && status < 400,
    });
    return parseRssFeed(res.data);
  } catch {
    return [];
  }
}

export function validateChannelIds(raw: string | undefined): string[] {
  if (!raw) return [];
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter((s) => CHANNEL_ID_RE.test(s)),
    ),
  ).slice(0, 20);
}

function buildChannelSummary(items: FeedVideo[]): FeedResponse["channels"] {
  const map = new Map<string, { name: string; count: number }>();
  for (const item of items) {
    const current = map.get(item.channelId) || {
      name: item.channelName || item.channelId,
      count: 0,
    };
    current.count += 1;
    if (!current.name && item.channelName) current.name = item.channelName;
    map.set(item.channelId, current);
  }
  return [...map.entries()].map(([id, { name, count }]) => ({ id, name, count }));
}

function buildResponse(
  allItems: FeedVideo[],
  channelIds: string[],
  updatedAt: string,
  flags: { cached: boolean; stale?: boolean; message?: string },
): FeedResponse {
  const filtered = channelIds.length
    ? allItems.filter((item) => channelIds.includes(item.channelId))
    : allItems;
  return {
    ok: true,
    cached: flags.cached,
    stale: flags.stale,
    message: flags.message,
    updatedAt,
    total: filtered.length,
    items: filtered.slice(0, MAX_RESPONSE_ITEMS),
    channels: buildChannelSummary(filtered),
  };
}

export async function getFeed({
  channelIds,
  refresh,
}: {
  channelIds: string[];
  refresh: boolean;
}): Promise<FeedResponse> {
  const cached = await readCache();

  if (!channelIds.length) {
    if (cached) {
      return buildResponse(cached.items, channelIds, cached.updatedAt, {
        cached: true,
      });
    }
    return {
      ok: true,
      cached: false,
      updatedAt: "",
      total: 0,
      items: [],
      channels: [],
      message: "No channel IDs provided.",
    };
  }

  // Figure out which requested channels are already represented in the cache.
  // If any aren't, we need a partial live fetch even on the cached path —
  // otherwise a request for a never-seen-before channel just returns 0.
  const cachedChannelIds = new Set(
    (cached?.items || []).map((item) => item.channelId),
  );
  const missingIds = channelIds.filter((id) => !cachedChannelIds.has(id));

  if (cached && !refresh && !missingIds.length) {
    return buildResponse(cached.items, channelIds, cached.updatedAt, {
      cached: true,
    });
  }

  // Either a full refresh was asked for, or some requested channels aren't in
  // cache yet. Full refresh → fetch all; partial → fetch only the missing ones.
  const idsToFetch = refresh ? channelIds : missingIds;

  try {
    const results = await Promise.all(idsToFetch.map(fetchRssForChannel));
    const fresh = results.flat();
    if (!fresh.length) {
      if (cached) {
        return buildResponse(cached.items, channelIds, cached.updatedAt, {
          cached: true,
          stale: true,
          message: refresh
            ? "Live refresh returned nothing — showing cached entries."
            : "Could not fetch new channels — none of them returned entries.",
        });
      }
      return {
        ok: true,
        cached: false,
        updatedAt: "",
        total: 0,
        items: [],
        channels: [],
        message: "Live fetch returned nothing.",
      };
    }
    const merged = mergeItems(cached?.items || [], fresh);
    await writeCache(merged);
    return buildResponse(merged, channelIds, new Date().toISOString(), {
      cached: false,
      message:
        !refresh && missingIds.length
          ? `Fetched ${idsToFetch.length} new channel(s) on demand.`
          : undefined,
    });
  } catch (err) {
    if (cached) {
      return buildResponse(cached.items, channelIds, cached.updatedAt, {
        cached: true,
        stale: true,
        message: err instanceof Error ? err.message : "Fetch failed.",
      });
    }
    throw err;
  }
}

export async function clearFeedCache(): Promise<void> {
  try {
    await fs.rm(CACHE_PATH, { force: true });
  } catch {
    // Swallow — cache may not exist.
  }
}

// Resolve @handle (or bare handle) → UC channelId by scraping the channel page
// once. YouTube embeds the channelId in the page HTML in several places; we
// look for the most reliable JSON field first, then fall back to the URL form.
export async function resolveHandleToChannelId(handle: string): Promise<string | null> {
  const cleaned = handle.trim().replace(/^@/, "");
  if (!cleaned || !HANDLE_RE.test(cleaned)) return null;
  try {
    const res = await axios.get<string>(`https://www.youtube.com/@${cleaned}`, {
      timeout: FETCH_TIMEOUT_MS,
      responseType: "text",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      validateStatus: (status) => status >= 200 && status < 400,
    });
    const body = res.data;
    const primary = body.match(/"channelId":"(UC[A-Za-z0-9_-]{10,})"/);
    if (primary) return primary[1];
    const canonical = body.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[A-Za-z0-9_-]{10,})"/);
    if (canonical) return canonical[1];
    const pathMatch = body.match(/\/channel\/(UC[A-Za-z0-9_-]{10,})/);
    return pathMatch ? pathMatch[1] : null;
  } catch {
    return null;
  }
}
