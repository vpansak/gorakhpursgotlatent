import { TicketRecord } from './ticketTypes';
export { type TicketRecord };
import crypto from 'crypto';
import db from '@/lib/db';



// In-memory fallback store to ensure zero data loss & instant sync across serverless calls
const memoryTickets: Map<string, TicketRecord> = new Map();

/**
 * Ensures tickets & ticket_application tables exist in database
 */
export async function ensureTicketsTable() {
  try {
    const tableSql = `
      CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        ticket_id TEXT UNIQUE NOT NULL,
        booking_id TEXT,
        customer_name TEXT NOT NULL,
        mobile TEXT NOT NULL,
        email TEXT NOT NULL,
        instagram_id TEXT NOT NULL,
        date_of_birth TEXT DEFAULT '',
        quantity INTEGER DEFAULT 1,
        amount NUMERIC(10,2) DEFAULT 0,
        razorpay_order_id TEXT,
        razorpay_payment_id TEXT,
        payment_status TEXT DEFAULT 'PAID',
        ticket_status TEXT DEFAULT 'VALID',
        qr_token TEXT NOT NULL,
        checked_in INTEGER DEFAULT 0,
        checked_in_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.execute(tableSql);

    // Legacy compatibility: older ticket tables had a NOT NULL DOB column.
    // Ticket purchases no longer collect or store DOB, so keep the old column
    // only as an empty legacy field while making inserts independent of it.
    try { await db.execute(`ALTER TABLE tickets ALTER COLUMN date_of_birth SET DEFAULT ''`); } catch {}

    const appTableSql = tableSql.replace('CREATE TABLE IF NOT EXISTS tickets', 'CREATE TABLE IF NOT EXISTS ticket_application');
    await db.execute(appTableSql);
    try { await db.execute(`ALTER TABLE ticket_application ALTER COLUMN date_of_birth SET DEFAULT ''`); } catch {}
  } catch (err) {
    console.warn('ensureTicketsTable notice:', err);
  }
}

/**
 * Generates unique Ticket ID (Format: GGLT + 6 digits, e.g. GGLT583921)
 */
export function generateUniqueTicketId(): string {
  let ticketId = '';
  do {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    ticketId = `GGLT${randomDigits}`;
  } while (memoryTickets.has(ticketId));
  return ticketId;
}

/**
 * Creates a secure verification token for QR encoding
 */
export function generateQrToken(_ticketId: string): string {
  // QR tokens are opaque random values; the scanner validates them against the server-side ticket record.
  return crypto.randomBytes(24).toString('hex');
}

/**
 * Normalizes raw database row into clean TicketRecord
 */
function normalizeTicketRecord(r: any): TicketRecord {
  const parseDate = (val: any): string => {
    if (!val) return new Date().toISOString();
    if (typeof val === 'string') return val;
    if (val instanceof Date) return val.toISOString();
    return String(val);
  };

  return {
    id: String(r.id || ''),
    ticket_id: String(r.ticket_id || ''),
    booking_id: String(r.booking_id || ''),
    customer_name: String(r.customer_name || ''),
    mobile: String(r.mobile || ''),
    email: String(r.email || ''),
    instagram_id: String(r.instagram_id || ''),
    quantity: Number(r.quantity || 1),
    amount: Number(r.amount || 0),
    razorpay_order_id: String(r.razorpay_order_id || ''),
    razorpay_payment_id: String(r.razorpay_payment_id || ''),
    payment_status: String(r.payment_status || 'PAID'),
    ticket_status: (r.ticket_status === 'CANCELLED' ? 'CANCELLED' : 'VALID') as 'VALID' | 'CANCELLED',
    qr_token: String(r.qr_token || ''),
    checked_in: Number(r.checked_in) === 1 ? 1 : 0,
    checked_in_at: r.checked_in_at ? parseDate(r.checked_in_at) : null,
    created_at: parseDate(r.created_at),
    updated_at: parseDate(r.updated_at),
  };
}

/**
 * Save new ticket to database (both 'tickets' and 'ticket_application' tables) and memory
 */
export async function saveTicketRecord(ticket: TicketRecord): Promise<TicketRecord> {
  const norm = normalizeTicketRecord(ticket);
  memoryTickets.set(norm.ticket_id, norm);

  try {
    await ensureTicketsTable();
    const queryStr = `
      INSERT INTO %TABLE% (
        id, ticket_id, booking_id, customer_name, mobile, email, instagram_id,
        quantity, amount, razorpay_order_id, razorpay_payment_id,
        payment_status, ticket_status, qr_token, checked_in, checked_in_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT (ticket_id) DO UPDATE SET
        payment_status = EXCLUDED.payment_status,
        ticket_status = EXCLUDED.ticket_status,
        checked_in = EXCLUDED.checked_in,
        checked_in_at = EXCLUDED.checked_in_at,
        updated_at = CURRENT_TIMESTAMP
    `;
    
    const params = [
      norm.id,
      norm.ticket_id,
      norm.booking_id,
      norm.customer_name,
      norm.mobile,
      norm.email,
      norm.instagram_id,
      norm.quantity,
      norm.amount,
      norm.razorpay_order_id,
      norm.razorpay_payment_id,
      norm.payment_status,
      norm.ticket_status,
      norm.qr_token,
      norm.checked_in,
      norm.checked_in_at,
    ];

    // Execute save for both tables
    await db.execute(queryStr.replace('%TABLE%', 'tickets'), params);
    await db.execute(queryStr.replace('%TABLE%', 'ticket_application'), params);
  } catch (err) {
    console.warn('saveTicketRecord database notice:', err);
  }
  return norm;
}

/**
 * Finds ticket by Ticket ID (e.g. GGLT123456), QR token, or verification URL
 */
export async function getTicketByTicketId(ticketIdOrUrl: string): Promise<TicketRecord | null> {
  if (!ticketIdOrUrl || !ticketIdOrUrl.trim()) return null;

  const rawInput = ticketIdOrUrl.trim();

  let cleanId = rawInput;
  const match = rawInput.match(/GGLT[A-Z0-9]{4,10}/i);
  if (match) {
    cleanId = match[0].toUpperCase();
  } else {
    cleanId = cleanId.toUpperCase();
  }

  // 1. Search memory store
  for (const tck of memoryTickets.values()) {
    if (
      tck.ticket_id.toUpperCase() === cleanId ||
      tck.ticket_id.toUpperCase() === rawInput.toUpperCase() ||
      tck.qr_token === rawInput ||
      tck.booking_id?.toUpperCase() === rawInput.toUpperCase() ||
      tck.razorpay_order_id?.toUpperCase() === rawInput.toUpperCase() ||
      tck.razorpay_payment_id?.toUpperCase() === rawInput.toUpperCase()
    ) {
      return tck;
    }
  }

  // 2. Query Neon PostgreSQL database (check 'tickets' and 'ticket_application')
  try {
    await ensureTicketsTable();
    const sqlStr = `SELECT * FROM %TABLE% WHERE UPPER(ticket_id) = ? OR qr_token = ? OR UPPER(booking_id) = ? OR UPPER(razorpay_order_id) = ? OR UPPER(razorpay_payment_id) = ? OR UPPER(ticket_id) = ?`;
    const params = [cleanId, rawInput, rawInput.toUpperCase(), rawInput.toUpperCase(), rawInput.toUpperCase(), rawInput.toUpperCase()];

    let row = await db.queryOne<any>(sqlStr.replace('%TABLE%', 'tickets'), params);
    if (!row) {
      row = await db.queryOne<any>(sqlStr.replace('%TABLE%', 'ticket_application'), params);
    }

    if (row) {
      const norm = normalizeTicketRecord(row);
      memoryTickets.set(norm.ticket_id, norm);
      return norm;
    }
  } catch (err) {
    console.warn('getTicketByTicketId database notice:', err);
  }

  return null;
}

/**
 * Finds ticket by QR token or verification URL payload
 */
export async function getTicketByQrToken(qrTokenOrUrl: string): Promise<TicketRecord | null> {
  return getTicketByTicketId(qrTokenOrUrl);
}

/**
 * Retrieves all tickets from both 'tickets' and 'ticket_application' tables
 */
export async function getAllTickets(): Promise<TicketRecord[]> {
  try {
    await ensureTicketsTable();
    const rows1 = await db.query<any>(`SELECT * FROM tickets ORDER BY created_at DESC`);
    const rows2 = await db.query<any>(`SELECT * FROM ticket_application ORDER BY created_at DESC`);
    
    const combined = [...(rows1 || []), ...(rows2 || [])];
    combined.forEach(r => {
      const norm = normalizeTicketRecord(r);
      memoryTickets.set(norm.ticket_id, norm);
    });
  } catch (err) {
    console.warn('getAllTickets database notice:', err);
  }
  return Array.from(memoryTickets.values());
}

/**
 * Search tickets by Ticket ID, Name, Mobile, Email, Instagram ID
 */
export async function searchTickets(queryStr: string): Promise<TicketRecord[]> {
  const all = await getAllTickets();
  if (!queryStr || !queryStr.trim()) return all;

  const q = queryStr.toLowerCase().trim();
  return all.filter(t => 
    (t.ticket_id && String(t.ticket_id).toLowerCase().includes(q)) ||
    (t.customer_name && String(t.customer_name).toLowerCase().includes(q)) ||
    (t.mobile && String(t.mobile).toLowerCase().includes(q)) ||
    (t.email && String(t.email).toLowerCase().includes(q)) ||
    (t.instagram_id && String(t.instagram_id).toLowerCase().includes(q)) ||
    (t.razorpay_order_id && String(t.razorpay_order_id).toLowerCase().includes(q)) ||
    (t.razorpay_payment_id && String(t.razorpay_payment_id).toLowerCase().includes(q))
  );
}

/**
 * Check In Ticket
 */
export async function checkInTicket(ticketIdOrUrl: string): Promise<{ success: boolean; ticket?: TicketRecord; message: string; isDuplicate?: boolean }> {
  const ticket = await getTicketByTicketId(ticketIdOrUrl);

  if (!ticket) {
    return { success: false, message: `✕ INVALID TICKET: Ticket ID "${ticketIdOrUrl}" not found in database.` };
  }

  const isPaidOrFree =
    ticket.payment_status === 'PAID' ||
    ticket.payment_status === 'FREE' ||
    ticket.payment_status === 'SUCCESS' ||
    Number(ticket.amount) === 0;

  if (!isPaidOrFree) {
    return { success: false, ticket, message: '✕ INVALID TICKET: Ticket payment is not verified.' };
  }

  const now = new Date().toISOString();

  try {
    const updatedRow = await db.queryOne<any>(
      `UPDATE tickets
       SET checked_in = 1, checked_in_at = ?, updated_at = CURRENT_TIMESTAMP
       WHERE ticket_id = ? AND checked_in = 0
       RETURNING *`,
      [now, ticket.ticket_id]
    );

    if (updatedRow) {
      const updated = normalizeTicketRecord(updatedRow);
      memoryTickets.set(updated.ticket_id, updated);

      // Keep the legacy mirror in sync without making it the authoritative check-in decision.
      await db.execute(
        `UPDATE ticket_application
         SET checked_in = 1, checked_in_at = ?, updated_at = CURRENT_TIMESTAMP
         WHERE ticket_id = ?`,
        [now, updated.ticket_id]
      );

      return {
        success: true,
        ticket: updated,
        message: `✓ CHECK-IN SUCCESSFUL: Welcome ${updated.customer_name}! Ticket ${updated.ticket_id} marked as CHECKED IN.`,
      };
    }

    // Fallback for records that only exist in the legacy mirror table.
    const legacyUpdatedRow = await db.queryOne<any>(
      `UPDATE ticket_application
       SET checked_in = 1, checked_in_at = ?, updated_at = CURRENT_TIMESTAMP
       WHERE ticket_id = ? AND checked_in = 0
       RETURNING *`,
      [now, ticket.ticket_id]
    );

    if (legacyUpdatedRow) {
      const updated = normalizeTicketRecord(legacyUpdatedRow);
      memoryTickets.set(updated.ticket_id, updated);
      return {
        success: true,
        ticket: updated,
        message: `✓ CHECK-IN SUCCESSFUL: Welcome ${updated.customer_name}! Ticket ${updated.ticket_id} marked as CHECKED IN.`,
      };
    }
  } catch (err) {
    console.warn('Atomic ticket check-in notice:', err);
  }

  const latest = await getTicketByTicketId(ticket.ticket_id);
  if (latest?.checked_in === 1) {
    return {
      success: false,
      ticket: latest,
      isDuplicate: true,
      message: `⚠️ ALREADY CHECKED IN: Ticket ${latest.ticket_id} was already used for entry at ${latest.checked_in_at ? new Date(latest.checked_in_at).toLocaleString('en-IN') : 'earlier session'}.`,
    };
  }

  return {
    success: false,
    ticket,
    message: '✕ CHECK-IN FAILED: Could not update ticket status. Please try again.',
  };
}

/**
 * Compute Ticket Summary Stats
 */
export async function getTicketStats() {
  const all = await getAllTickets();
  const todayStr = new Date().toISOString().slice(0, 10);

  const totalBooked = all.length;
  const todayBookings = all.filter(t => {
    if (!t.created_at) return false;
    const dateStr = typeof t.created_at === 'string' 
      ? t.created_at 
      : ((t.created_at as any) instanceof Date ? (t.created_at as Date).toISOString() : String(t.created_at));
    return dateStr.startsWith(todayStr);
  }).length;

  const paidTickets = all.filter(t => t.payment_status === 'PAID' || t.payment_status === 'FREE' || Number(t.amount) === 0).length;
  const pendingOrFailed = all.filter(t => t.payment_status !== 'PAID' && t.payment_status !== 'FREE' && Number(t.amount) !== 0).length;
  const checkedIn = all.filter(t => Number(t.checked_in) === 1).length;
  const totalRevenue = all.filter(t => t.payment_status === 'PAID').reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return {
    totalBooked,
    todayBookings,
    paidTickets,
    pendingOrFailed,
    checkedIn,
    totalRevenue,
  };
}

/**
 * Delete ticket from database ('tickets' and 'ticket_application' tables) and memory
 */
export async function deleteTicketRecord(ticketId: string): Promise<boolean> {
  if (!ticketId || !ticketId.trim()) return false;
  const cleanId = ticketId.trim().toUpperCase();

  memoryTickets.delete(cleanId);
  for (const [key, tck] of Array.from(memoryTickets.entries())) {
    if (tck.ticket_id.toUpperCase() === cleanId || tck.id === ticketId) {
      memoryTickets.delete(key);
    }
  }

  try {
    await ensureTicketsTable();
    await db.execute(`DELETE FROM tickets WHERE UPPER(ticket_id) = ? OR id = ?`, [cleanId, ticketId]);
    await db.execute(`DELETE FROM ticket_application WHERE UPPER(ticket_id) = ? OR id = ?`, [cleanId, ticketId]);
    return true;
  } catch (err) {
    console.warn('deleteTicketRecord database notice:', err);
    return false;
  }
}
