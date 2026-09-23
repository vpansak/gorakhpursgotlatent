import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { s3, S3_BUCKET } from '@/lib/storage';
import { PutObjectCommand } from '@aws-sdk/client-s3';

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

    // 1. Try uploading private doc to S3
    try {
      const s3Key = `documents/${safeName}`;
      await s3.send(
        new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: s3Key,
          Body: buffer,
          ContentType: file.type || 'application/octet-stream',
        })
      );
      const endpoint = process.env.AWS_ENDPOINT_URL_S3 || 'https://br-shy-meadow-b5n9zrpd.storage.c-7.us-east-2.aws.neon.tech';
      const cleanEndpoint = endpoint.replace(/\/$/, '');
      const s3Url = `${cleanEndpoint}/${S3_BUCKET}/${s3Key}`;

      return NextResponse.json({
        success: true,
        fileKey: safeName,
        docUrl: s3Url,
      });
    } catch (s3Err) {
      console.warn('Private S3 upload fallback:', s3Err);
    }

    // 2. Fallback to local storage
    try {
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
    } catch (fsErr) {
      // 3. Fallback to base64 Data URL
      const mime = file.type || 'application/pdf';
      const base64Url = `data:${mime};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        fileKey: safeName,
        docUrl: base64Url,
      });
    }
  } catch (error: any) {
    console.error('Private upload error:', error);
    return NextResponse.json({ error: error.message || 'Private upload failed' }, { status: 500 });
  }
}
