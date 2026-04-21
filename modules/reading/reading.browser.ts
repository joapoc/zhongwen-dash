import type { Browser } from "playwright";
import { chromium } from "playwright";

// Lazy-singleton headless Chromium for resolving JS-driven redirect pages
// (Google News is the motivating case — the article URL is only decoded by
// client-side JS). One browser lives for the server's lifetime; per-request
// isolation comes from a fresh context each time.

const NAV_TIMEOUT_MS = 20000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36";

let browser: Browser | null = null;
let launching: Promise<Browser> | null = null;

async function getBrowser(): Promise<Browser> {
  if (browser && browser.isConnected()) return browser;
  if (launching) return launching;
  launching = chromium
    .launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled",
      ],
    })
    .then((b) => {
      browser = b;
      b.on("disconnected", () => {
        if (browser === b) browser = null;
      });
      return b;
    })
    .finally(() => {
      launching = null;
    });
  return launching;
}

export type BrowserFetchResult = {
  finalUrl: string;
  html: string;
};

export async function fetchViaBrowser(url: string): Promise<BrowserFetchResult> {
  const b = await getBrowser();
  const context = await b.newContext({
    userAgent: USER_AGENT,
    locale: "zh-CN",
    viewport: { width: 1280, height: 900 },
    extraHTTPHeaders: { "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8" },
  });
  // Pre-consent cookie so Google News skips consent.google.com interstitial.
  // Without this we land on the cookie-choice page instead of the article.
  await context.addCookies([
    {
      name: "CONSENT",
      value: "YES+cb.20250101-00-p0.en+FX+123",
      domain: ".google.com",
      path: "/",
      secure: true,
      httpOnly: false,
      sameSite: "Lax",
    },
    {
      name: "SOCS",
      value: "CAISNQgREitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjUwMTAxLjA4X3AwGgJlbiACGgYIgMWrvQY",
      domain: ".google.com",
      path: "/",
      secure: true,
      httpOnly: false,
      sameSite: "Lax",
    },
  ]);
  const page = await context.newPage();
  try {
    // `domcontentloaded` is usually enough for JS-redirect pages — they fire
    // location changes early. Fall back to networkidle if the first settle
    // still leaves us on the redirect stub.
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: NAV_TIMEOUT_MS,
    });
    // Give client-side redirects a chance to run.
    try {
      await page.waitForLoadState("networkidle", { timeout: 8000 });
    } catch {
      // networkidle can time out on pages with long-poll / analytics loops —
      // whatever we have at this point is good enough.
    }
    const finalUrl = page.url();
    const html = await page.content();
    return { finalUrl, html };
  } finally {
    await context.close().catch(() => undefined);
  }
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    const b = browser;
    browser = null;
    await b.close().catch(() => undefined);
  }
}

export function isBrowserReady(): boolean {
  return !!browser && browser.isConnected();
}
