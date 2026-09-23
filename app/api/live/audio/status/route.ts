import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const AUDIO_FILES = [
  { id: 'THEME', name: 'Show Theme', filename: 'ggl_theme.wav' },
  { id: 'ENTRY', name: 'Entrance Fanfare', filename: 'ggl_entry.wav' },
  { id: 'LAUGH', name: 'Comedy Rimshot', filename: 'ggl_laugh.wav' },
  { id: 'APPLAUSE', name: 'Crowd Applause', filename: 'ggl_applause.wav' },
  { id: 'SUSPENSE', name: 'Suspense Drum', filename: 'ggl_suspense.wav' },
  { id: 'WINNER', name: 'Winner Celebration', filename: 'ggl_winner.wav' }
];

export async function GET(req: NextRequest) {
  try {
    const audioDir = path.join(process.cwd(), 'public/audio');
    const statusList = AUDIO_FILES.map(item => {
      const fullPath = path.join(audioDir, item.filename);
      const exists = fs.existsSync(fullPath);
      let sizeBytes = 0;
      if (exists) {
        try {
          const stat = fs.statSync(fullPath);
          sizeBytes = stat.size;
        } catch (e) {}
      }

      return {
        id: item.id,
        name: item.name,
        filename: item.filename,
        path: `/audio/${item.filename}`,
        status: exists && sizeBytes > 1000 ? 'READY' : exists ? 'ERROR' : 'MISSING',
        sizeFormatted: sizeBytes > 0 ? (sizeBytes / (1024 * 1024)).toFixed(2) + ' MB' : '0 MB',
        exists
      };
    });

    return NextResponse.json({ success: true, audioFiles: statusList });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
