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

    // Validate size (max 10MB)
    if (buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    // Validate extension
    const ext = path.extname(file.name).toLowerCase();
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: 'Invalid file format. Allowed: JPG, PNG, WEBP, PDF' }, { status: 400 });
    }

    // Create unique sanitized filename
    const hash = crypto.randomBytes(8).toString('hex');
    const safeName = `${Date.now()}-${hash}${ext}`;

    // 1. Try uploading to S3
    try {
      const s3Key = `uploads/media/${safeName}`;
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
        url: s3Url,
        filename: safeName,
      });
    } catch (s3Err) {
      console.warn('S3 upload fallback to local storage:', s3Err);
    }

    // 2. Fallback to local storage (or /tmp on serverless)
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, safeName);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${safeName}`,
        filename: safeName,
      });
    } catch (fsErr) {
      // 3. Fallback to base64 Data URL so user is never blocked
      const mime = file.type || 'image/jpeg';
      const base64Url = `data:${mime};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        url: base64Url,
        filename: safeName,
      });
    }
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
}
