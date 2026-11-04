import { WEBSITE_ARCHIVE_BEFORE } from '@/lib/episodeVisibility';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF', 'TICKET_STAFF'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Applications breakdown
    const perfCountRow = await db.queryOne<any>('SELECT COUNT(*) as count FROM performer_applications WHERE created_at > ?', [WEBSITE_ARCHIVE_BEFORE]);
    const perfPaidRow = await db.queryOne<any>("SELECT COUNT(*) as count FROM performer_applications WHERE created_at > ? AND (payment_status = 'PAID' OR payment_status = 'PAYMENT_VERIFIED')", [WEBSITE_ARCHIVE_BEFORE]);
    const guestCountRow = await db.queryOne<any>('SELECT COUNT(*) as count FROM guest_applications WHERE created_at > ?', [WEBSITE_ARCHIVE_BEFORE]);
    const sponsorCountRow = await db.queryOne<any>('SELECT COUNT(*) as count FROM sponsor_applications WHERE created_at > ?', [WEBSITE_ARCHIVE_BEFORE]);
    const teamCountRow = await db.queryOne<any>('SELECT COUNT(*) as count FROM team_applications');

    const perfCount = Number(perfCountRow?.count) || 0;
    const perfPaidCount = Number(perfPaidRow?.count) || 0;
    const guestCount = Number(guestCountRow?.count) || 0;
    const sponsorCount = Number(sponsorCountRow?.count) || 0;
    const teamCount = Number(teamCountRow?.count) || 0;

    return NextResponse.json({
      success: true,
      stats: {
        applications: {
          performers: perfCount,
          performersPaid: perfPaidCount,
          guests: guestCount,
          sponsors: sponsorCount,
          team: teamCount,
          total: perfCount + guestCount + sponsorCount + teamCount,
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch stats' }, { status: 500 });
  }
}

