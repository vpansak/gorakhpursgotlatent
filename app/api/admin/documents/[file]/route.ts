import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import path from 'path';
import fs from 'fs';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.role)) {
      return new NextResponse('Unauthorized access to confidential documents', { status: 403 });
    }

    const resolvedParams = await params;
    const fileName = resolvedParams.file;
    const sanitized = path.basename(fileName);

    const filePath = path.join(process.cwd(), 'storage', 'private', sanitized);
    if (!fs.existsSync(filePath)) {
      return new NextResponse('Document not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(sanitized).toLowerCase();

    let contentType = 'application/octet-stream';
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.png') contentType = 'image/png';
    else if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, no-cache, no-store',
      },
    });
  } catch (err: any) {
    return new NextResponse('Server Error', { status: 500 });
  }
}
