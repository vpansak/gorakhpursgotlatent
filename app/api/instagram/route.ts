import { NextResponse } from 'next/server';
import snapshot from '@/data/instagram-snapshot.json';
import { fetchInstagramAccount } from '@/lib/instagram-api';

export const revalidate = 300;
export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  const version = process.env.INSTAGRAM_API_VERSION;
  if (token && userId && version) {
    try {
      const data = await fetchInstagramAccount({ token, userId, version });
      const checkedAt = new Date().toISOString();
      return NextResponse.json({ mode:'live', checkedAt, posts:data.posts, hasMore:data.hasMore,
        featured: data.views === undefined ? snapshot.featured : { ...snapshot.featured, views:data.views, checkedAt, source:'Instagram API', live:true } },
        { headers:{ 'Cache-Control':'public, s-maxage=300, stale-while-revalidate=600' } });
    } catch { console.warn('Instagram feed unavailable; serving verified public snapshot.'); }
  }
  return NextResponse.json(snapshot, { headers:{ 'Cache-Control':'public, s-maxage=300, stale-while-revalidate=600' } });
}
