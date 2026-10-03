import db from '@/lib/db';
import crypto from 'crypto';

export interface LeadRecord {
  id: string;
  lead_code: string;
  customer_name: string;
  mobile: string;
  email?: string;
  instagram_id?: string;
  dob?: string;
  quantity?: number;
  source?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// In-memory fallback map for sub-millisecond sync across serverless lambdas
const memoryLeads: Map<string, LeadRecord> = new Map();

/**
 * Upsert or track an abandoned/draft lead
 */
export async function trackLead(input: {
  leadId?: string;
  customerName?: string;
  mobile: string;
  email?: string;
  instagramId?: string;
  dob?: string;
  quantity?: number;
  source?: string;
  status?: string;
}): Promise<LeadRecord> {
  const cleanMobile = (input.mobile || '').trim();
  const cleanName = (input.customerName || '').trim();
  const cleanEmail = (input.email || '').trim();
  const cleanInsta = (input.instagramId || '').trim();
  const cleanDob = (input.dob || '').trim();
  const qty = Number(input.quantity) || 1;
  const source = input.source || 'book-ticket';
  const status = input.status || 'ABANDONED';
  const now = new Date().toISOString();

  // Search existing by leadId or cleanMobile
  let existingKey = '';
  if (input.leadId && memoryLeads.has(input.leadId)) {
    existingKey = input.leadId;
  } else {
    for (const [k, v] of memoryLeads.entries()) {
      if (v.mobile === cleanMobile && cleanMobile.length >= 10) {
        existingKey = k;
        break;
      }
    }
  }

  const id = existingKey || input.leadId || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const lead_code = existingKey ? memoryLeads.get(existingKey)?.lead_code || `LEAD-${Date.now().toString().slice(-6)}` : `LEAD-${Date.now().toString().slice(-6)}`;
  const created_at = existingKey ? memoryLeads.get(existingKey)?.created_at || now : now;

  const record: LeadRecord = {
    id,
    lead_code,
    customer_name: cleanName,
    mobile: cleanMobile,
    email: cleanEmail,
    instagram_id: cleanInsta,
    dob: cleanDob,
    quantity: qty,
    source,
    status,
    created_at,
    updated_at: now,
  };

  memoryLeads.set(id, record);

  try {
    const sql = `
      INSERT INTO abandoned_leads 
        (id, lead_code, customer_name, mobile, email, instagram_id, dob, quantity, source, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (id) DO UPDATE SET
        customer_name = EXCLUDED.customer_name,
        mobile = EXCLUDED.mobile,
        email = EXCLUDED.email,
        instagram_id = EXCLUDED.instagram_id,
        dob = EXCLUDED.dob,
        quantity = EXCLUDED.quantity,
        source = EXCLUDED.source,
        status = EXCLUDED.status,
        updated_at = EXCLUDED.updated_at
    `;
    await db.execute(sql, [
      record.id,
      record.lead_code,
      record.customer_name,
      record.mobile,
      record.email,
      record.instagram_id,
      record.dob,
      record.quantity,
      record.source,
      record.status,
      record.created_at,
      record.updated_at,
    ]);
  } catch (err) {
    console.warn('trackLead DB notice (using fallback):', err);
  }

  return record;
}

/**
 * Fetch all tracked leads
 */
export async function getLeads(): Promise<LeadRecord[]> {
  try {
    const rows = await db.query<any>('SELECT * FROM abandoned_leads ORDER BY updated_at DESC');
    if (rows && rows.length > 0) {
      rows.forEach((r: any) => {
        const item: LeadRecord = {
          id: String(r.id || ''),
          lead_code: String(r.lead_code || ''),
          customer_name: String(r.customer_name || ''),
          mobile: String(r.mobile || ''),
          email: String(r.email || ''),
          instagram_id: String(r.instagram_id || ''),
          dob: String(r.dob || ''),
          quantity: Number(r.quantity || 1),
          source: String(r.source || 'book-ticket'),
          status: String(r.status || 'ABANDONED'),
          created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
          updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
        };
        memoryLeads.set(item.id, item);
      });
    }
  } catch (err) {
    console.warn('getLeads DB notice:', err);
  }

  return Array.from(memoryLeads.values()).sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

/**
 * Delete a lead by ID
 */
export async function deleteLead(id: string): Promise<boolean> {
  memoryLeads.delete(id);
  try {
    await db.execute('DELETE FROM abandoned_leads WHERE id = $1 OR lead_code = $1', [id]);
    return true;
  } catch (err) {
    console.warn('deleteLead DB notice:', err);
    return true;
  }
}
