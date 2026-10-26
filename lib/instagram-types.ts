export interface InstagramPost {
  id: string;
  permalink: string;
  caption: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  thumbnailUrl?: string;
  timestamp?: string;
  children?: Array<{ mediaType: string; thumbnailUrl?: string }>;
}
export interface InstagramFeed {
  mode: 'snapshot' | 'live';
  checkedAt: string;
  posts: InstagramPost[];
  hasMore: boolean;
  featured: { shortcode: string; permalink: string; views: number; checkedAt: string; source: string; live: boolean };
}
