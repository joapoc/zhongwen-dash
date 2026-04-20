import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

import type { TrendingItem, TrendingSnapshot, TrendingSource } from "./trending.types";

const TOPHUB_URL = "https://tophub.today/";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes — default cache window
const MIN_FETCH_INTERVAL_MS = 60 * 1000; // 1 minute hard floor on upstream requests
const ERROR_BACKOFF_MS = 10 * 60 * 1000; // 10 minutes after upstream error
const USER_AGENT =
  "Mozilla/5.0 (compatible; ZhongwenDash/1.0; language-learning client)";

// Local asset dir for pre-downloaded source icons. Tophub's CDN blocks browser
// hotlinks via Referer check, so we mirror icons into /public and rewrite.
const LOCAL_ICON_DIR = path.join(process.cwd(), "public", "assets", "trending-icons");
const LOCAL_ICON_URL_PREFIX = "/assets/trending-icons/";
let localIconIndex: Set<string> | null = null;

function getLocalIconIndex(): Set<string> {
  if (localIconIndex) return localIconIndex;
  try {
    localIconIndex = new Set(fs.readdirSync(LOCAL_ICON_DIR));
  } catch {
    localIconIndex = new Set();
  }
  return localIconIndex;
}

export function iconFilenameFromUrl(remoteUrl: string): string | null {
  try {
    const url = new URL(remoteUrl);
    const last = url.pathname.split("/").filter(Boolean).pop();
    return last || null;
  } catch {
    return null;
  }
}

function rewriteIconUrl(remoteUrl: string | null): string | null {
  if (!remoteUrl) return null;
  const filename = iconFilenameFromUrl(remoteUrl);
  if (!filename) return remoteUrl;
  if (getLocalIconIndex().has(filename)) {
    return LOCAL_ICON_URL_PREFIX + filename;
  }
  // Fall back to the remote URL — the browser likely won't load it, but we
  // preserve the pointer so downstream code sees a value.
  return remoteUrl;
}

export function refreshLocalIconIndex(): void {
  localIconIndex = null;
}

let cache: { data: TrendingSnapshot; expires: number } | null = null;
let lastFetchAttempt = 0;
let lastErrorAt = 0;
let inflight: Promise<TrendingSnapshot> | null = null;

function unwrapTophubLink(href: string): string {
  // Tophub wraps outbound links: /link?domain=X&url=ENCODED_URL
  try {
    const url = new URL(href, TOPHUB_URL);
    if (url.pathname === "/link") {
      const target = url.searchParams.get("url");
      if (target) return decodeURIComponent(target);
    }
    return url.toString();
  } catch {
    return href;
  }
}

function slugify(name: string, fallback: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

export async function fetchTrending(force = false): Promise<TrendingSnapshot> {
  const now = Date.now();

  // Fresh cache always wins.
  if (!force && cache && cache.expires > now) {
    return cache.data;
  }

  // Share an in-flight request rather than firing a duplicate.
  if (inflight) return inflight;

  // Hard floor: never hit tophub more than once per MIN_FETCH_INTERVAL_MS,
  // even when the caller passes force=true. Serve stale cache if available;
  // otherwise surface a friendly error so the frontend can hold off.
  if (now - lastFetchAttempt < MIN_FETCH_INTERVAL_MS) {
    if (cache) return cache.data;
    throw new Error("Trending feed is rate-limited — try again in a minute.");
  }

  // Error backoff: if upstream just failed, cool down before retrying.
  if (lastErrorAt && now - lastErrorAt < ERROR_BACKOFF_MS) {
    if (cache) return cache.data;
    throw new Error("Upstream trending feed is unavailable — cooling down.");
  }

  inflight = (async () => {
    lastFetchAttempt = Date.now();
    const { data: html } = await axios.get<string>(TOPHUB_URL, {
      timeout: 15000,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      },
      responseType: "text",
    });

    const $ = cheerio.load(html);
    const sources: TrendingSource[] = [];

    $(".cc-cd").each((_, el) => {
      const card = $(el);
      const nodeId = card.attr("id") || "";
      const name = card.find(".cc-cd-lb span").first().text().trim();
      const subtitle = card.find(".cc-cd-sb-st").first().text().trim();
      const icon = card.find(".cc-cd-lb img").attr("src") || null;
      if (!name) return;

      const items: TrendingItem[] = [];
      card.find(".cc-cd-cb-l a").each((_i, a) => {
        const $a = $(a);
        const rankText = $a.find(".cc-cd-cb-ll .s").first().text().trim();
        const title = $a.find(".cc-cd-cb-ll .t").first().text().trim();
        const rawHref = $a.attr("href") || "";
        const itemId = $a.attr("itemid") || null;
        if (!title) return;
        items.push({
          rank: Number(rankText) || items.length + 1,
          title,
          url: rawHref ? unwrapTophubLink(rawHref) : "",
          itemId,
        });
      });

      if (!items.length) return;

      sources.push({
        sourceId: `${slugify(name, nodeId || String(sources.length))}${subtitle ? "-" + slugify(subtitle, "") : ""}`,
        name,
        subtitle,
        icon: rewriteIconUrl(icon),
        items,
      });
    });

    const snapshot: TrendingSnapshot = {
      fetchedAt: new Date().toISOString(),
      sources,
    };

    cache = { data: snapshot, expires: Date.now() + CACHE_TTL_MS };
    lastErrorAt = 0;
    return snapshot;
  })().catch((error) => {
    lastErrorAt = Date.now();
    // If we still have stale data, prefer it over throwing — smoother UX
    // and avoids the frontend hammering us on every retry.
    if (cache) return cache.data;
    throw error;
  });

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}
