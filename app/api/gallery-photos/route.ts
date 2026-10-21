import { NextResponse } from 'next/server';

export const revalidate = 300;
const FOLDER_ID = '1TKvwPKNaS5C9s5bI_EKhIGBV_1LzqWVF';

export async function GET() {
  try {
    const response = await fetch(`https://drive.google.com/embeddedfolderview?id=${FOLDER_ID}#grid`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GGLGallery/1.0)' },
      next: { revalidate: 300 },
    });
    if (!response.ok) {
      return NextResponse.json({ photos: [], error: 'Drive folder could not be read' }, { status: 200 });
    }
    const html = await response.text();
    const ids = new Set<string>();
    const patterns = [
      /data-id=["']([a-zA-Z0-9_-]{20,})["']/g,
      /\/file\/d\/([a-zA-Z0-9_-]{20,})/g,
      /[?&]id=([a-zA-Z0-9_-]{20,})/g,
      /lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]{20,})/g,
    ];
    for (const pattern of patterns) {
      for (const match of html.matchAll(pattern)) {
        const id = match[1];
        if (id && id !== FOLDER_ID) ids.add(id);
      }
    }
    const photos = [...ids].slice(0, 100).map((id) => ({
      id,
      src: `https://drive.google.com/thumbnail?id=${id}&sz=w1200`,
    }));
    return NextResponse.json({ photos }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } });
  } catch {
    return NextResponse.json({ photos: [], error: 'Unable to load Drive photos' }, { status: 200 });
  }
}
