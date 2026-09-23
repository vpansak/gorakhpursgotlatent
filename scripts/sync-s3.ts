import { syncSheetsToS3, saveIndividualEntryToS3 } from '../lib/storage';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_N3PsaDziloM4@ep-cold-paper-b5liftd3-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

async function syncAllToS3Folders() {
  console.log('Fetching records from Neon PostgreSQL...');
  // Sync performers to performers/paid/ and performers/all/
  const pRes = await pool.query('SELECT * FROM performer_applications');
  for (const p of pRes.rows) {
    if (p.payment_status === 'PAID' || p.payment_status === 'PAYMENT_VERIFIED') {
      const url = await saveIndividualEntryToS3('performers/paid', p.app_id, p);
      console.log('Saved to performers/paid:', url);
    }
    const allUrl = await saveIndividualEntryToS3('performers/all', p.app_id, p);
    console.log('Saved to performers/all:', allUrl);
  }

  // Sync sponsors to sponsors/
  const sRes = await pool.query('SELECT * FROM sponsor_applications');
  for (const s of sRes.rows) {
    const url = await saveIndividualEntryToS3('sponsors', s.app_id, s);
    console.log('Saved to sponsors:', url);
  }

  // Sync panel to panel/
  const gRes = await pool.query('SELECT * FROM guest_applications');
  for (const g of gRes.rows) {
    const url = await saveIndividualEntryToS3('panel', g.app_id, g);
    console.log('Saved to panel:', url);
  }

  // Sync orders to orders/
  const oRes = await pool.query('SELECT * FROM ticket_orders');
  for (const o of oRes.rows) {
    const url = await saveIndividualEntryToS3('orders', o.order_number, o);
    console.log('Saved to orders:', url);
  }

  const sheetsResult = await syncSheetsToS3();
  console.log('Master CSV sheets synced to S3 successfully:', sheetsResult);

  await pool.end();
}

syncAllToS3Folders().catch(console.error);
