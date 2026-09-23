import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { syncSheetsToS3, S3_BUCKET } from '@/lib/storage';

const endpoint = (process.env.AWS_ENDPOINT_URL_S3 || 'https://br-shy-meadow-b5n9zrpd.storage.c-7.us-east-2.aws.neon.tech').replace(/\/$/, '');

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const sheets = [
      {
        id: 'performers_paid',
        title: 'Paid Performers (₹199 Paid)',
        category: 'Performers',
        folder: 'sheets/performers/',
        filename: 'paid_performers.csv',
        url: `${endpoint}/${S3_BUCKET}/sheets/performers/paid_performers.csv`,
        desc: 'Verified paid performer registrations with transaction and audition details.',
      },
      {
        id: 'performers_all',
        title: 'All Performers (Master List)',
        category: 'Performers',
        folder: 'sheets/performers/',
        filename: 'all_performers.csv',
        url: `${endpoint}/${S3_BUCKET}/sheets/performers/all_performers.csv`,
        desc: 'Complete list of all performer applicants including pending and verified.',
      },
      {
        id: 'sponsors',
        title: 'Brand Sponsors & Partners',
        category: 'Sponsors',
        folder: 'sheets/sponsors/',
        filename: 'sponsors.csv',
        url: `${endpoint}/${S3_BUCKET}/sheets/sponsors/sponsors.csv`,
        desc: 'Corporate sponsors, title partners, company POCs and budget estimates.',
      },
      {
        id: 'panel_guests',
        title: 'Panel Guests & Celebrity Judges',
        category: 'Panel',
        folder: 'sheets/panel/',
        filename: 'panel_guests.csv',
        url: `${endpoint}/${S3_BUCKET}/sheets/panel/panel_guests.csv`,
        desc: 'Celebrity guest creators, judges, stage names, and social links.',
      },
      {
        id: 'team_applications',
        title: 'Team & Volunteer Crew',
        category: 'Team',
        folder: 'sheets/team/',
        filename: 'team_applications.csv',
        url: `${endpoint}/${S3_BUCKET}/sheets/team/team_applications.csv`,
        desc: 'Core team applicants for event management, media, and backstage operations.',
      },
      {
        id: 'ticket_orders',
        title: 'Audience Ticket Orders',
        category: 'Orders',
        folder: 'sheets/orders/',
        filename: 'ticket_orders.csv',
        url: `${endpoint}/${S3_BUCKET}/sheets/orders/ticket_orders.csv`,
        desc: 'Ticket purchases, customer contact details, order amount, and status.',
      },
    ];

    return NextResponse.json({ success: true, sheets });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const result = await syncSheetsToS3();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
