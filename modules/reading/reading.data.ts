import type { ReadingFeedDef } from "./reading.types";

// Curated Chinese long-form feeds. Hand-picked for: (a) real full-ish RSS,
// (b) readable HTML that Readability can extract cleanly, (c) variety of
// difficulty — international news, tech, lifestyle, policy.
export const READING_FEEDS: ReadingFeedDef[] = [
  {
    id: "ftchinese",
    name: "FT中文网",
    description: "Financial Times Chinese — business, economy, policy.",
    tag: "news",
    url: "https://www.ftchinese.com/rss/news",
    homepage: "https://www.ftchinese.com",
  },
  {
    id: "bbc-zh",
    name: "BBC中文",
    description: "BBC Chinese — world news in plain simplified Chinese.",
    tag: "news",
    url: "https://www.bbc.co.uk/zhongwen/simp/index.xml",
    homepage: "https://www.bbc.com/zhongwen/simp",
  },
  {
    id: "dw-zh",
    name: "德国之声 DW中文",
    description: "Deutsche Welle Chinese — European perspective on world news.",
    tag: "news",
    url: "https://rss.dw.com/xml/rss-chi-all",
    homepage: "https://www.dw.com/zh",
  },
  {
    id: "sspai",
    name: "少数派 sspai",
    description: "Tech, apps, productivity, gear — accessible intermediate Chinese.",
    tag: "tech",
    url: "https://sspai.com/feed",
    homepage: "https://sspai.com",
  },
  {
    id: "ifanr",
    name: "爱范儿 ifanr",
    description: "Consumer tech, product launches, digital culture.",
    tag: "tech",
    url: "https://www.ifanr.com/feed",
    homepage: "https://www.ifanr.com",
  },
  {
    id: "36kr",
    name: "36氪",
    description: "Startups, business, venture — higher-difficulty business vocab.",
    tag: "business",
    url: "https://36kr.com/feed",
    homepage: "https://36kr.com",
  },
  {
    id: "cdt-zh",
    name: "中国数字时代 CDT",
    description: "Curated China-watch journalism (politics, censorship, rights).",
    tag: "politics",
    url: "https://chinadigitaltimes.net/chinese/feed/",
    homepage: "https://chinadigitaltimes.net/chinese/",
  },
  {
    id: "initium",
    name: "端传媒 Initium",
    description: "Long-form features (HK/Taiwan/China). Some items are paywalled.",
    tag: "features",
    url: "https://theinitium.com/newsfeed/",
    homepage: "https://theinitium.com",
  },
];

export function findFeedById(id: string): ReadingFeedDef | undefined {
  return READING_FEEDS.find((f) => f.id === id);
}
