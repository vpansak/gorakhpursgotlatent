import type { InstagramPost } from './instagram-types';

// Only the server imports this adapter. Credentials never enter the feed response.
type Config = { token: string; userId: string; version: string };
type Fetcher = typeof fetch;
const HOST = 'https://graph.instagram.com';
const FEATURED = 'De6SIoRAY2S';
const mediaFields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{id,media_type,media_url,thumbnail_url}';
function safeImage(value: unknown) {
  if (typeof value !== 'string') return undefined;
  try { const u = new URL(value); return u.protocol === 'https:' && /(^|\.)(cdninstagram\.com|fbcdn\.net)$/.test(u.hostname) ? u.href : undefined; } catch { return undefined; }
}
function normalize(item: any): InstagramPost | null {
  let url: URL;
  try { url = new URL(item.permalink); } catch { return null; }
  if (url.hostname !== 'www.instagram.com' && url.hostname !== 'instagram.com') return null;
  if (url.protocol !== 'https:' || !/^\/(p|reel)\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)) return null;
  const mediaType = ['IMAGE','VIDEO','CAROUSEL_ALBUM'].includes(item.media_type) ? item.media_type : 'IMAGE';
  return { id: String(item.id), permalink: url.origin + url.pathname, caption: String(item.caption || 'GGL moments from Instagram').slice(0,500), mediaType,
    thumbnailUrl: safeImage(item.thumbnail_url || (mediaType === 'IMAGE' ? item.media_url : item.children?.data?.[0]?.media_url)),
    timestamp: typeof item.timestamp === 'string' ? item.timestamp : undefined,
    children: item.children?.data?.map((child: any) => ({ mediaType: String(child.media_type), thumbnailUrl: safeImage(child.thumbnail_url || child.media_url) })) };
}
export async function fetchInstagramAccount(config: Config, request: Fetcher = fetch) {
  if (!config.token || !/^\d+$/.test(config.userId) || !/^v\d+\.\d+$/.test(config.version)) throw new Error('Instagram connection incomplete');
  async function get(path: string, params: Record<string,string>) {
    const url = new URL(`${HOST}/${config.version}/${path}`);
    for (const [key,value] of Object.entries(params)) url.searchParams.set(key,value);
    const response = await request(url, { headers: { Authorization: `Bearer ${config.token}` }, next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('Instagram request unavailable');
    const json = await response.json(); if (json.error) throw new Error('Instagram request unavailable'); return json;
  }
  const account = await get(config.userId, { fields:'id,username' });
  if (account.username !== 'gkp_got_latent') throw new Error('Instagram account mismatch');
  const posts: InstagramPost[] = []; let after = ''; let hasMore = false;
  for (let page=0;page<20;page++) {
    const result = await get(`${config.userId}/media`, { fields:mediaFields, limit:'100', ...(after ? { after } : {}) });
    for (const item of result.data || []) { const post = normalize(item); if (post && !posts.some(p=>p.id===post.id)) posts.push(post); }
    const cursor = result.paging?.cursors?.after;
    hasMore = !!result.paging?.next;
    if (!hasMore || typeof cursor !== 'string' || cursor === after) break;
    after = cursor;
  }
  let views: number | undefined;
  const featured = posts.find(p=>p.permalink.includes(`/${FEATURED}/`));
  if (featured) {
    try {
      const insight = await get(`${featured.id}/insights`, { metric:'views' });
      const metric = insight.data?.find((d: any)=>d.name==='views');
      const value = metric?.values?.[0]?.value ?? metric?.total_value?.value;
      if (Number.isSafeInteger(value) && value>=0) views=value;
    } catch { /* Media may be readable before the separate insights permission is granted. */ }
  }
  if (!posts.length) throw new Error('Instagram returned no public media');
  return { posts, views, hasMore };
}
