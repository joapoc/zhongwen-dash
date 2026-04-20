export type TrendingItem = {
  rank: number;
  title: string;
  url: string;
  itemId: string | null;
};

export type TrendingSource = {
  sourceId: string;
  name: string;
  subtitle: string;
  icon: string | null;
  items: TrendingItem[];
};

export type TrendingSnapshot = {
  fetchedAt: string;
  sources: TrendingSource[];
};
