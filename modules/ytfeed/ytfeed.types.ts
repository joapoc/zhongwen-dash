export type FeedVideo = {
  channelId: string;
  channelName: string;
  videoId: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  publishedAt: string;
};

export type FeedPayload = {
  updatedAt: string;
  items: FeedVideo[];
};

export type FeedResponseChannel = {
  id: string;
  name: string;
  count: number;
};

export type FeedResponse = {
  ok: true;
  cached: boolean;
  stale?: boolean;
  message?: string;
  updatedAt: string;
  total: number;
  items: FeedVideo[];
  channels: FeedResponseChannel[];
};
