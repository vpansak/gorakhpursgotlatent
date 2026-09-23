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
 * Save an individual application/payment record into its dedicated category folder in S3
 */
export async function saveIndividualEntryToS3(
  category: 'performers/paid' | 'performers/all' | 'sponsors' | 'panel' | 'team' | 'orders',
  id: string,
  data: any
): Promise<string | null> {
  try {
    const safeName = (data.full_name || data.company_name || data.customer_name || 'entry').replace(/[^a-zA-Z0-9_-]/g, '_');
    const key = `${category}/${id}_${safeName}.json`;
    const jsonContent = JSON.stringify({
      ...data,
      synced_at: new Date().toISOString(),
      s3_folder: category
    }, null, 2);

    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: Buffer.from(jsonContent, 'utf-8'),
        ContentType: 'application/json; charset=utf-8',
      })
    );

    const cleanEndpoint = endpoint.replace(/\/$/, '');
    return `${cleanEndpoint}/${S3_BUCKET}/${key}`;
  } catch (err) {
    console.error(`Error saving individual entry to S3 for ${category}/${id}:`, err);
    return null;
  }
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
    // 1. Paid Performers Sheet (In folder sheets/performers/paid_performers.csv)
    const paidPerformers = await query(`
      SELECT 
        app_id, full_name, email, mobile_number, whatsapp_number, city, age,
        performance_category, performance_title, performance_type, performer_count,
        performance_duration, performance_language, instagram_url, youtube_url,
        payment_status, payment_id, order_id, payment_amount, payment_verified_at,
        application_status, created_at
      FROM performer_applications 
      WHERE payment_status = 'PAID' OR payment_status = 'PAYMENT_VERIFIED'
      ORDER BY created_at DESC
    `);
    const paidCsv = jsonToCSV(paidPerformers);
    const paidUrl = await uploadSheetToS3('performers/paid_performers.csv', paidCsv);

    // 2. All Performers Sheet (In folder sheets/performers/all_performers.csv)
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
    const allPerfUrl = await uploadSheetToS3('performers/all_performers.csv', allPerfCsv);

    // 3. Sponsors Sheet (In folder sheets/sponsors/sponsors.csv)
    const sponsors = await query(`
      SELECT 
        app_id, company_name, contact_person, designation, biz_email, whatsapp, phone,
        website, instagram_url, industry, location, sponsorship_type, preferred_package,
        budget_est, status, logo_url, brand_deck_url, created_at
      FROM sponsor_applications
      ORDER BY created_at DESC
    `);
    const sponsorsCsv = jsonToCSV(sponsors);
    const sponsorsUrl = await uploadSheetToS3('sponsors/sponsors.csv', sponsorsCsv);

    // 4. Panel / Guests Sheet (In folder sheets/panel/panel_guests.csv)
    const panelGuests = await query(`
      SELECT 
        app_id, full_name, stage_name, email, whatsapp, phone, city, profession,
        category, short_intro, why_ggl, instagram_url, youtube_url, status,
        profile_photo_url, press_kit_url, created_at
      FROM guest_applications
      ORDER BY created_at DESC
    `);
    const panelCsv = jsonToCSV(panelGuests);
    const panelUrl = await uploadSheetToS3('panel/panel_guests.csv', panelCsv);

    // 5. Team / Crew Applications Sheet (In folder sheets/team/team_applications.csv)
    const teamApps = await query(`
      SELECT 
        app_id, full_name, mobile_number, email, dob, address, instagram_url, about, status, created_at
      FROM team_applications
      ORDER BY created_at DESC
    `);
    const teamCsv = jsonToCSV(teamApps);
    const teamUrl = await uploadSheetToS3('team/team_applications.csv', teamCsv);

    // 6. Ticket Orders Sheet (In folder sheets/orders/ticket_orders.csv)
    const orders = await query(`
      SELECT 
        order_number, customer_name, customer_email, customer_phone, total_amount, payment_status, razorpay_payment_id, created_at
      FROM ticket_orders
      ORDER BY created_at DESC
    `);
    const ordersCsv = jsonToCSV(orders);
    const ordersUrl = await uploadSheetToS3('orders/ticket_orders.csv', ordersCsv);

    return {
      success: true,
      sheets: {
        performersPaid: paidUrl,
        performersAll: allPerfUrl,
        sponsors: sponsorsUrl,
        panelGuests: panelUrl,
        teamApps: teamUrl,
        ticketOrders: ordersUrl,
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
