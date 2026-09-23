import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const VALID_SOUND_IDS = ['THEME', 'ENTRY', 'LAUGH', 'APPLAUSE', 'SUSPENSE', 'WINNER'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const soundId = formData.get('soundId') as string;
    const file = formData.get('file') as File;

    if (!soundId || !VALID_SOUND_IDS.includes(soundId)) {
      return NextResponse.json({ success: false, error: 'Invalid sound ID' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ success: false, error: 'No audio file provided' }, { status: 400 });
    }

    const audioDir = path.join(process.cwd(), 'public/audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const filename = `ggl_${soundId.toLowerCase()}.wav`;
    const targetPath = path.join(audioDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(targetPath, buffer);

    return NextResponse.json({
      success: true,
      message: `Audio file for ${soundId} uploaded and replaced successfully!`,
      path: `/audio/${filename}`,
      size: buffer.length
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
