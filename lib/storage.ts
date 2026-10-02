import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { query } from './db';

const region = process.env.AWS_REGION || 'us-east-2';
export const S3_BUCKET = process.env.S3_BUCKET_NAME;

let s3ClientInstance: S3Client | null = null;

export function getS3Client(): S3Client | null {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey || !endpoint) {
    return null;
  }
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      endpoint,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });
  }
  return s3ClientInstance;
}

// Exported client proxy for direct calls (with safe null fallback handling)
export const s3 = new Proxy({} as S3Client, {
  get(_target, prop) {
    const client = getS3Client();
    if (!client) {
      return () => Promise.reject(new Error('S3 client not configured (missing AWS credentials environment variables).'));
    }
    const val = (client as any)[prop];
    return typeof val === 'function' ? val.bind(client) : val;
  }
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
  const client = getS3Client();
  if (!client || !process.env.AWS_ENDPOINT_URL_S3 || !S3_BUCKET) {
    console.warn(`[Storage] Skipping S3 upload for ${category}/${id}: S3 environment variables not configured.`);
    return null;
  }

  try {
    const safeName = (data.full_name || data.company_name || data.customer_name || 'entry').replace(/[^a-zA-Z0-9_-]/g, '_');
    const key = `${category}/${id}_${safeName}.json`;
    const jsonContent = JSON.stringify({
      ...data,
      synced_at: new Date().toISOString(),
      s3_folder: category
    }, null, 2);

    await client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: Buffer.from(jsonContent, 'utf-8'),
        ContentType: 'application/json; charset=utf-8',
      })
    );

    const cleanEndpoint = process.env.AWS_ENDPOINT_URL_S3!.replace(/\/$/, '');
    return `${cleanEndpoint}/${S3_BUCKET}/${key}`;
  } catch (err: any) {
    console.warn(`[Storage] S3 notice for ${category}/${id}:`, err?.message || err);
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
export async function uploadSheetToS3(sheetName: string, csvContent: string): Promise<string | null> {
  const client = getS3Client();
  if (!client || !process.env.AWS_ENDPOINT_URL_S3 || !S3_BUCKET) {
    console.warn(`[Storage] Skipping sheet upload ${sheetName}: S3 environment variables not configured.`);
    return null;
  }

  try {
    const key = `${STORAGE_FOLDERS.sheets}/${sheetName}`;
    await client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: Buffer.from(csvContent, 'utf-8'),
        ContentType: 'text/csv; charset=utf-8',
      })
    );

    const cleanEndpoint = endpoint.replace(/\/$/, '');
    return `${cleanEndpoint}/${S3_BUCKET}/${key}`;
  } catch (err: any) {
    console.warn(`[Storage] Sheet upload notice (${sheetName}):`, err?.message || err);
    return null;
  }
}

/**
 * Automatically synchronize live CSV Sheets
 */
export async function syncSheetsToS3() {
  const client = getS3Client();
  if (!client) {
    console.warn('[Storage] Skipping S3 sheet sync: AWS S3 credentials not configured in environment.');
    return {
      success: false,
      message: 'S3 credentials not configured in Vercel environment variables.',
    };
  }

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
      WHERE payment_status = 'PAID' OR payment_status = 'PAYMENT_VERIFIED'
      ORDER BY created_at DESC
    `);
    const paidCsv = jsonToCSV(paidPerformers);
    const paidUrl = await uploadSheetToS3('performers/paid_performers.csv', paidCsv);

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
    const allPerfUrl = await uploadSheetToS3('performers/all_performers.csv', allPerfCsv);

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
    const sponsorsUrl = await uploadSheetToS3('sponsors/sponsors.csv', sponsorsCsv);

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
    const panelUrl = await uploadSheetToS3('panel/panel_guests.csv', panelCsv);

    // 5. Team / Crew Applications Sheet
    const teamApps = await query(`
      SELECT 
        app_id, full_name, mobile_number, email, dob, address, instagram_url, about, status, created_at
      FROM team_applications
      ORDER BY created_at DESC
    `);
    const teamCsv = jsonToCSV(teamApps);
    const teamUrl = await uploadSheetToS3('team/team_applications.csv', teamCsv);

    // 6. Ticket Orders Sheet
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
    console.warn('[Storage] S3 sheet sync notice:', err?.message || err);
    return {
      success: false,
      error: err?.message || 'S3 sync error',
    };
  }
}
