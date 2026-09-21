import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 15MB limit' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    const allowed = ['.jpg', '.jpeg', '.png', '.pdf', '.docx'];
    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: 'Invalid document format. Allowed: JPG, PNG, PDF, DOCX' }, { status: 400 });
    }

    const hash = crypto.randomBytes(12).toString('hex');
    const safeName = `doc-${Date.now()}-${hash}${ext}`;

    const storageDir = path.join(process.cwd(), 'storage', 'private');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const filePath = path.join(storageDir, safeName);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      fileKey: safeName,
      docUrl: `/api/malik/documents/${safeName}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Private upload failed' }, { status: 500 });
  }
}
