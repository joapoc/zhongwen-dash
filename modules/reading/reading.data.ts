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

  // --- Cybersecurity ---
  {
    id: "freebuf",
    name: "FreeBuf",
    description: "Chinese infosec portal — vulnerabilities, pentests, breach news.",
    tag: "cyber",
    url: "https://www.freebuf.com/feed",
    homepage: "https://www.freebuf.com",
  },
  {
    id: "gn-cyber",
    name: "Google News · 网络安全",
    description: "Aggregated Chinese-language cybersecurity headlines.",
    tag: "cyber",
    url: "https://news.google.com/rss/search?q=%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },
  {
    id: "gn-hacker",
    name: "Google News · 黑客攻击",
    description: "Hacking incidents, APT groups, data breaches (Chinese sources).",
    tag: "cyber",
    url: "https://news.google.com/rss/search?q=%E9%BB%91%E5%AE%A2%E6%94%BB%E5%87%BB&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },

  // --- Beauty / Makeup ---
  {
    id: "gn-beauty",
    name: "Google News · 美妆护肤",
    description: "Chinese beauty, skincare, and cosmetics coverage.",
    tag: "beauty",
    url: "https://news.google.com/rss/search?q=%E7%BE%8E%E5%A6%86+%E6%8A%A4%E8%82%A4&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },
  {
    id: "gn-cosmetics",
    name: "Google News · 化妆品",
    description: "Product launches, brand news, ingredient trends.",
    tag: "beauty",
    url: "https://news.google.com/rss/search?q=%E5%8C%96%E5%A6%86%E5%93%81&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },

  // --- Gossip / Entertainment ---
  {
    id: "gn-gossip",
    name: "Google News · 娱乐八卦",
    description: "Celebrity drama, C-pop, entertainment industry news.",
    tag: "gossip",
    url: "https://news.google.com/rss/search?q=%E5%A8%B1%E4%B9%90%E5%85%AB%E5%8D%A6&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },
  {
    id: "gn-stars",
    name: "Google News · 明星新闻",
    description: "Celebrity news, scandals, and public moments.",
    tag: "gossip",
    url: "https://news.google.com/rss/search?q=%E6%98%8E%E6%98%9F%E6%96%B0%E9%97%BB&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },

  // --- Travel ---
  {
    id: "gn-travel",
    name: "Google News · 旅游",
    description: "Chinese travel news, destinations, transit updates.",
    tag: "travel",
    url: "https://news.google.com/rss/search?q=%E6%97%85%E6%B8%B8+%E4%B8%AD%E5%9B%BD&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },
  {
    id: "gn-guide",
    name: "Google News · 旅行攻略",
    description: "Travel guides, itineraries, tourist tips.",
    tag: "travel",
    url: "https://news.google.com/rss/search?q=%E6%97%85%E8%A1%8C%E6%94%BB%E7%95%A5&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },

  // --- Food ---
  {
    id: "gn-food",
    name: "Google News · 中国美食",
    description: "Regional cuisine, food culture, restaurant coverage.",
    tag: "food",
    url: "https://news.google.com/rss/search?q=%E4%B8%AD%E5%9B%BD%E7%BE%8E%E9%A3%9F&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },
  {
    id: "gn-restaurants",
    name: "Google News · 餐饮",
    description: "Restaurant industry, dining trends, food business.",
    tag: "food",
    url: "https://news.google.com/rss/search?q=%E9%A4%90%E9%A5%AE&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },

  // --- Gen Z / Youth slang ---
  {
    id: "gn-genz-slang",
    name: "Google News · 网络流行语",
    description: "Internet buzzwords, viral phrases, online youth speak.",
    tag: "genz",
    url: "https://news.google.com/rss/search?q=%E7%BD%91%E7%BB%9C%E6%B5%81%E8%A1%8C%E8%AF%AD&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },
  {
    id: "gn-genz-life",
    name: "Google News · 内卷躺平",
    description: "Burnout, lying-flat, post-95/00 lifestyle and pressure.",
    tag: "genz",
    url: "https://news.google.com/rss/search?q=%E5%86%85%E5%8D%B7+%E8%BA%BA%E5%B9%B3&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },
  {
    id: "gn-genz-cohort",
    name: "Google News · Z世代",
    description: "Gen Z trends, consumption habits, youth culture coverage.",
    tag: "genz",
    url: "https://news.google.com/rss/search?q=Z%E4%B8%96%E4%BB%A3&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },

  // --- University / Academia ---
  {
    id: "gn-study-abroad",
    name: "Google News · 留学",
    description: "Study abroad news, visa updates, scholarships.",
    tag: "academia",
    url: "https://news.google.com/rss/search?q=%E7%95%99%E5%AD%A6&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },
  {
    id: "gn-kaoyan",
    name: "Google News · 考研",
    description: "Postgraduate entrance exam, prep, results, policy.",
    tag: "academia",
    url: "https://news.google.com/rss/search?q=%E8%80%83%E7%A0%94&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },
  {
    id: "gn-uni",
    name: "Google News · 高校",
    description: "University news, admissions, campus life, research.",
    tag: "academia",
    url: "https://news.google.com/rss/search?q=%E9%AB%98%E6%A0%A1+%E5%A4%A7%E5%AD%A6%E7%94%9F&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },

  // --- Dropshipping / Cross-border e-commerce ---
  {
    id: "gn-dropship-cbe",
    name: "Google News · 跨境电商",
    description: "Cross-border e-commerce industry news and policy.",
    tag: "dropship",
    url: "https://news.google.com/rss/search?q=%E8%B7%A8%E5%A2%83%E7%94%B5%E5%95%86&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },
  {
    id: "gn-dropship-d2c",
    name: "Google News · 独立站",
    description: "Independent-site / D2C operations and Shopify-style stores.",
    tag: "dropship",
    url: "https://news.google.com/rss/search?q=%E7%8B%AC%E7%AB%8B%E7%AB%99+%E8%B7%A8%E5%A2%83&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },
  {
    id: "gn-dropship-platforms",
    name: "Google News · Temu/Shein",
    description: "Platform news for Temu, Shein, AliExpress, TikTok Shop.",
    tag: "dropship",
    url: "https://news.google.com/rss/search?q=Temu+Shein+%E9%80%9F%E5%8D%96%E9%80%9A&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    homepage: "https://news.google.com",
  },
];

export function findFeedById(id: string): ReadingFeedDef | undefined {
  return READING_FEEDS.find((f) => f.id === id);
}

export function findFeedsByTag(tag: string): ReadingFeedDef[] {
  return READING_FEEDS.filter((f) => f.tag === tag);
}
