export type ReadingFeedDef = {
  id: string;
  name: string;
  description: string;
  tag: string;
  url: string;
  homepage?: string;
};

export type ReadingFeedItem = {
  feedId: string;
  feedName: string;
  title: string;
  link: string;
  snippet: string;
  publishedAt: string;
  author?: string;
};

export type ReadingFeedCacheEntry = {
  feedId: string;
  fetchedAt: string;
  items: ReadingFeedItem[];
};

export type ReadingFeedCache = {
  updatedAt: string;
  feeds: Record<string, ReadingFeedCacheEntry>;
};

export type ReadingFeedsResponse = {
  ok: true;
  feeds: ReadingFeedDef[];
};

export type ReadingItemsResponse = {
  ok: true;
  feedId: string;
  cached: boolean;
  stale?: boolean;
  message?: string;
  fetchedAt: string;
  total: number;
  items: ReadingFeedItem[];
};

export type ReadingArticle = {
  ok: true;
  url: string;
  title: string;
  byline?: string;
  siteName?: string;
  publishedAt?: string;
  lang?: string;
  wordCount: number;
  contentHtml: string;
  textContent: string;
  cached: boolean;
};
