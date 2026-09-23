import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { query } from './db';

const endpoint = process.env.AWS_ENDPOINT_URL_S3 || 'https://br-shy-meadow-b5n9zrpd.storage.c-7.us-east-2.aws.neon.tech';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || 'nak_live_524326177daf4840a2d1a157186dd525';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || 'nsk_live_13183df1f56b2a50df9e2a15effb1463d06b874eb15be66707db310d45ca6728';
const region = process.env.AWS_REGION || 'us-east-2';
export const S3_BUCKET = process.env.S3_BUCKET_NAME || 'gorakhpur-got-latent';

export const s3 = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true,
});

export const STORAGE_FOLDERS = {
  performers: 'uploads/performers',
  performersPaid: 'uploads/performers/paid',
  sponsors: 'uploads/sponsors',
  panel: 'uploads/panel',
  eventBookings: 'uploads/event-bookings',
  sheets: 'sheets',
} as const;

export type StorageCategory = keyof typeof STORAGE_FOLDERS;

/**
 * Upload a binary buffer or string directly to Neon S3 storage
 */
export async function uploadToS3(params: {
  buffer: Buffer;
  key: string;
  contentType: string;
}): Promise<{ success: boolean; key: string; url: string }> {
  const { buffer, key, contentType } = params;

  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  // Return formatted public access / direct URL through endpoint or api proxy
  const cleanEndpoint = endpoint.replace(/\/$/, '');
  const url = `${cleanEndpoint}/${S3_BUCKET}/${key}`;

  return {
    success: true,
    key,
    url,
  };
}

/**
 * Convert an array of objects to RFC-4180 compliant CSV string
 */
export function jsonToCSV(items: any[]): string {
  if (!items || items.length === 0) return '';
  const headers = Object.keys(items[0]);
  const headerLine = headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(',');

  const rows = items.map(item => {
    return headers
      .map(h => {
        let val = item[h];
        if (val === null || val === undefined) val = '';
        if (typeof val === 'object') val = JSON.stringify(val);
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      })
      .join(',');
  });

  return [headerLine, ...rows].join('\r\n');
}

/**
 * Upload live CSV Sheet to Neon S3 storage
 */
export async function uploadSheetToS3(sheetName: string, csvContent: string): Promise<string> {
  const key = `${STORAGE_FOLDERS.sheets}/${sheetName}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: Buffer.from(csvContent, 'utf-8'),
      ContentType: 'text/csv; charset=utf-8',
    })
  );

  const cleanEndpoint = endpoint.replace(/\/$/, '');
  return `${cleanEndpoint}/${S3_BUCKET}/${key}`;
}

/**
 * Automatically synchronize live CSV Sheets for:
 * 1. Paid Performers (only ₹199 paid applicants)
 * 2. All Performers
 * 3. Sponsors
 * 4. Panel Guests / Judges
 * 5. Event Bookings
 */
export async function syncSheetsToS3() {
  try {
    // 1. Paid Performers Sheet
    const paidPerformers = await query(`
      SELECT 
        app_id, full_name, email, mobile_number, whatsapp_number, city, age,
        performance_category, performance_title, performance_type, performer_count,
        performance_duration, performance_language, instagram_url, youtube_url,
        payment_status, payment_id, order_id, payment_amount, payment_verified_at,
        application_status, created_at
      FROM performer_applications 
      WHERE payment_status = 'PAID'
      ORDER BY payment_verified_at DESC NULLS LAST, created_at DESC
    `);
    const paidCsv = jsonToCSV(paidPerformers);
    const paidUrl = await uploadSheetToS3('performers_paid.csv', paidCsv);

    // 2. All Performers Sheet
    const allPerformers = await query(`
      SELECT 
        app_id, full_name, email, mobile_number, whatsapp_number, city, age,
        performance_category, performance_title, performance_type, performer_count,
        performance_duration, performance_language, instagram_url, youtube_url,
        payment_status, payment_id, order_id, payment_amount,
        application_status, created_at
      FROM performer_applications 
      ORDER BY created_at DESC
    `);
    const allPerfCsv = jsonToCSV(allPerformers);
    const allPerfUrl = await uploadSheetToS3('performers_all.csv', allPerfCsv);

    // 3. Sponsors Sheet
    const sponsors = await query(`
      SELECT 
        app_id, company_name, contact_person, designation, biz_email, whatsapp, phone,
        website, instagram_url, industry, location, sponsorship_type, preferred_package,
        budget_est, status, logo_url, brand_deck_url, created_at
      FROM sponsor_applications
      ORDER BY created_at DESC
    `);
    const sponsorsCsv = jsonToCSV(sponsors);
    const sponsorsUrl = await uploadSheetToS3('sponsors.csv', sponsorsCsv);

    // 4. Panel / Guests Sheet
    const panelGuests = await query(`
      SELECT 
        app_id, full_name, stage_name, email, whatsapp, phone, city, profession,
        category, short_intro, why_ggl, instagram_url, youtube_url, status,
        profile_photo_url, press_kit_url, created_at
      FROM guest_applications
      ORDER BY created_at DESC
    `);
    const panelCsv = jsonToCSV(panelGuests);
    const panelUrl = await uploadSheetToS3('panel_guests.csv', panelCsv);

    // 5. Event Bookings Sheet
    const eventBookings = await query(`
      SELECT 
        app_id, org_name, contact_person, email, whatsapp, phone, city, venue,
        event_date, expected_audience, event_type, budget_range, status, created_at
      FROM event_booking_applications
      ORDER BY created_at DESC
    `);
    const eventCsv = jsonToCSV(eventBookings);
    const eventUrl = await uploadSheetToS3('event_bookings.csv', eventCsv);

    return {
      success: true,
      sheets: {
        performersPaid: paidUrl,
        performersAll: allPerfUrl,
        sponsors: sponsorsUrl,
        panelGuests: panelUrl,
        eventBookings: eventUrl,
      },
    };
  } catch (err: any) {
    console.error('Error syncing sheets to S3:', err);
    return {
      success: false,
      error: err.message,
    };
  }
}
