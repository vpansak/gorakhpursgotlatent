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
  data?: Record<string, any>;
  is_read: number;
  read_at?: string | null;
  created_at: string;
  updated_at: string;
}

const memoryLeads: Map<string, LeadRecord> = new Map();
let schemaReady: Promise<void> | null = null;

async function ensureLeadsTable() {
  if (schemaReady) return schemaReady;
  schemaReady = (async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS abandoned_leads (
      id TEXT PRIMARY KEY,
      lead_code TEXT UNIQUE NOT NULL,
      customer_name TEXT DEFAULT '',
      mobile TEXT DEFAULT '',
      email TEXT DEFAULT '',
      instagram_id TEXT DEFAULT '',
      dob TEXT DEFAULT '',
      quantity INTEGER DEFAULT 1,
      source TEXT DEFAULT 'unknown',
      status TEXT DEFAULT 'IN_PROGRESS',
      data JSONB DEFAULT '{}'::jsonb,
      is_read INTEGER DEFAULT 0,
      read_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.execute(`ALTER TABLE abandoned_leads ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::jsonb`);
  await db.execute(`ALTER TABLE abandoned_leads ADD COLUMN IF NOT EXISTS is_read INTEGER DEFAULT 0`);
  await db.execute(`ALTER TABLE abandoned_leads ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE`);
  await db.execute(`ALTER TABLE abandoned_leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'unknown'`);
  await db.execute(`ALTER TABLE abandoned_leads ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'IN_PROGRESS'`);
  })().catch((err) => { schemaReady = null; throw err; });
  return schemaReady;
}

export async function trackLead(input: {
  leadId?: string;
  customerName?: string;
  mobile?: string;
  email?: string;
  instagramId?: string;
  dob?: string;
  quantity?: number;
  source?: string;
  status?: string;
  data?: Record<string, any>;
}): Promise<LeadRecord> {
  const cleanMobile = (input.mobile || '').trim();
  const cleanName = (input.customerName || '').trim();
  const cleanEmail = (input.email || '').trim();
  const cleanInsta = (input.instagramId || '').trim();
  const cleanDob = (input.dob || '').trim();
  const qty = Number(input.quantity) || 1;
  const source = (input.source || 'unknown').trim();
  const status = input.status || 'IN_PROGRESS';
  const now = new Date().toISOString();
  const id = input.leadId || `lead_${crypto.randomUUID()}`;

  const existing = memoryLeads.get(id);
  const lead_code = existing?.lead_code || `LEAD-${Date.now().toString().slice(-8)}`;
  const created_at = existing?.created_at || now;

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
    data: input.data || {},
    is_read: existing?.is_read || 0,
    read_at: existing?.read_at || null,
    created_at,
    updated_at: now,
  };

  memoryLeads.set(id, record);

  try {
    await ensureLeadsTable();
    await db.execute(`
      INSERT INTO abandoned_leads
        (id, lead_code, customer_name, mobile, email, instagram_id, dob, quantity, source, status, data, is_read, read_at, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12,$13,$14,$15)
      ON CONFLICT (id) DO UPDATE SET
        customer_name=EXCLUDED.customer_name,
        mobile=EXCLUDED.mobile,
        email=EXCLUDED.email,
        instagram_id=EXCLUDED.instagram_id,
        dob=EXCLUDED.dob,
        quantity=EXCLUDED.quantity,
        source=EXCLUDED.source,
        status=EXCLUDED.status,
        data=EXCLUDED.data,
        updated_at=EXCLUDED.updated_at
    `, [
      record.id, record.lead_code, record.customer_name, record.mobile,
      record.email, record.instagram_id, record.dob, record.quantity,
      record.source, record.status, JSON.stringify(record.data || {}),
      record.is_read, record.read_at, record.created_at, record.updated_at
    ]);
  } catch (err) {
    console.error('Lead DB save failed:', err);
    throw err;
  }

  return record;
}

export async function getLeads(): Promise<LeadRecord[]> {
  try {
    await ensureLeadsTable();
    const rows = await db.query<any>('SELECT * FROM abandoned_leads ORDER BY updated_at DESC');
    const result = (rows || []).map((r: any) => ({
      id: String(r.id || ''),
      lead_code: String(r.lead_code || ''),
      customer_name: String(r.customer_name || ''),
      mobile: String(r.mobile || ''),
      email: String(r.email || ''),
      instagram_id: String(r.instagram_id || ''),
      dob: String(r.dob || ''),
      quantity: Number(r.quantity || 1),
      source: String(r.source || 'unknown'),
      status: String(r.status || 'IN_PROGRESS'),
      data: r.data && typeof r.data === 'object' ? r.data : {},
      is_read: Number(r.is_read || 0),
      read_at: r.read_at ? new Date(r.read_at).toISOString() : null,
      created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    }));
    result.forEach((item: LeadRecord) => memoryLeads.set(item.id, item));
    return result;
  } catch (err) {
    console.error('getLeads DB failed:', err);
    return Array.from(memoryLeads.values()).sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }
}

export async function markLeadRead(id: string, isRead: boolean): Promise<boolean> {
  await ensureLeadsTable();
  const readAt = isRead ? new Date().toISOString() : null;
  await db.execute('UPDATE abandoned_leads SET is_read=$1, read_at=$2 WHERE id=$3 OR lead_code=$3', [isRead ? 1 : 0, readAt, id]);
  const existing = memoryLeads.get(id);
  if (existing) {
    existing.is_read = isRead ? 1 : 0;
    existing.read_at = readAt;
  }
  return true;
}

export async function deleteLead(id: string): Promise<boolean> {
  memoryLeads.delete(id);
  await ensureLeadsTable();
  await db.execute('DELETE FROM abandoned_leads WHERE id=$1 OR lead_code=$1', [id]);
  return true;
}
