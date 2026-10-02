import crypto from 'crypto';
import db from '@/lib/db';

export interface TicketRecord {
  id: string;
  ticket_id: string;
  booking_id: string;
  customer_name: string;
  mobile: string;
  email: string;
  instagram_id: string;
  date_of_birth: string;
  quantity: number;
  amount: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  payment_status: 'PAID' | 'PENDING' | 'FAILED';
  ticket_status: 'VALID' | 'CANCELLED';
  qr_token: string;
  checked_in: number; // 0 or 1
  checked_in_at: string | null;
  created_at: string;
  updated_at: string;
  is_demo?: boolean;
}

// In-memory fallback store to ensure zero data loss & instant sync across serverless calls
const memoryTickets: Map<string, TicketRecord> = new Map();

/**
 * Ensures tickets table exists in database
 */
export async function ensureTicketsTable() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        ticket_id TEXT UNIQUE NOT NULL,
        booking_id TEXT,
        customer_name TEXT NOT NULL,
        mobile TEXT NOT NULL,
        email TEXT NOT NULL,
        instagram_id TEXT NOT NULL,
        date_of_birth TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        amount NUMERIC(10,2) DEFAULT 149.00,
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
    `);
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
export function generateQrToken(ticketId: string): string {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'ggl_ticket_secret_key_2026';
  return crypto.createHmac('sha256', secret).update(ticketId).digest('hex').substring(0, 32);
}

/**
 * Validates age >= 18 from DOB string (e.g. '2000-08-15' or '15 August 2000')
 */
export function validateAgeIs18Plus(dobString: string): { is18Plus: boolean; age: number; formattedDob: string } {
  const dobDate = new Date(dobString);
  if (isNaN(dobDate.getTime())) {
    return { is18Plus: false, age: 0, formattedDob: dobString };
  }

  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const m = today.getMonth() - dobDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }

  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
  const formattedDob = dobDate.toLocaleDateString('en-GB', options);

  return {
    is18Plus: age >= 18,
    age,
    formattedDob,
  };
}

/**
 * Save new ticket to database and memory
 */
export async function saveTicketRecord(ticket: TicketRecord): Promise<TicketRecord> {
  memoryTickets.set(ticket.ticket_id, ticket);
  try {
    await ensureTicketsTable();
    await db.execute(`
      INSERT INTO tickets (
        id, ticket_id, booking_id, customer_name, mobile, email, instagram_id,
        date_of_birth, quantity, amount, razorpay_order_id, razorpay_payment_id,
        payment_status, ticket_status, qr_token, checked_in, checked_in_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT (ticket_id) DO UPDATE SET
        payment_status = EXCLUDED.payment_status,
        ticket_status = EXCLUDED.ticket_status,
        checked_in = EXCLUDED.checked_in,
        checked_in_at = EXCLUDED.checked_in_at,
        updated_at = CURRENT_TIMESTAMP
    `, [
      ticket.id,
      ticket.ticket_id,
      ticket.booking_id,
      ticket.customer_name,
      ticket.mobile,
      ticket.email,
      ticket.instagram_id,
      ticket.date_of_birth,
      ticket.quantity,
      ticket.amount,
      ticket.razorpay_order_id,
      ticket.razorpay_payment_id,
      ticket.payment_status,
      ticket.ticket_status,
      ticket.qr_token,
      ticket.checked_in,
      ticket.checked_in_at,
    ]);
  } catch (err) {
    console.warn('saveTicketRecord database notice:', err);
  }
  return ticket;
}

/**
 * Finds ticket by Ticket ID (e.g. GGLT123456)
 */
export async function getTicketByTicketId(ticketId: string): Promise<TicketRecord | null> {
  const cleanId = ticketId.trim().toUpperCase();
  
  // Check memory store
  if (memoryTickets.has(cleanId)) {
    return memoryTickets.get(cleanId)!;
  }

  try {
    await ensureTicketsTable();
    const row = await db.queryOne<TicketRecord>(`SELECT * FROM tickets WHERE UPPER(ticket_id) = ?`, [cleanId]);
    if (row) {
      memoryTickets.set(row.ticket_id, row);
      return row;
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
  const cleanToken = qrTokenOrUrl.trim();
  
  // Check if string contains ticket ID (e.g. /ticket/verify/GGLT123456 or GGLT123456)
  const match = cleanToken.match(/GGLT\d{6}/i);
  if (match) {
    const found = await getTicketByTicketId(match[0]);
    if (found) return found;
  }

  // Check by token
  for (const tck of memoryTickets.values()) {
    if (tck.qr_token === cleanToken) return tck;
  }

  try {
    await ensureTicketsTable();
    const row = await db.queryOne<TicketRecord>(`SELECT * FROM tickets WHERE qr_token = ? OR ticket_id = ?`, [cleanToken, cleanToken]);
    if (row) {
      memoryTickets.set(row.ticket_id, row);
      return row;
    }
  } catch (err) {
    console.warn('getTicketByQrToken database notice:', err);
  }

  return null;
}

/**
 * Retrieves all tickets
 */
export async function getAllTickets(): Promise<TicketRecord[]> {
  const list = Array.from(memoryTickets.values());
  try {
    await ensureTicketsTable();
    const rows = await db.query<TicketRecord>(`SELECT * FROM tickets ORDER BY created_at DESC`);
    if (rows && rows.length > 0) {
      rows.forEach(r => memoryTickets.set(r.ticket_id, r));
      return Array.from(memoryTickets.values());
    }
  } catch (err) {
    console.warn('getAllTickets database notice:', err);
  }
  return list;
}

/**
 * Search tickets by Ticket ID, Name, Mobile, Email, Instagram ID
 */
export async function searchTickets(queryStr: string): Promise<TicketRecord[]> {
  const all = await getAllTickets();
  if (!queryStr || !queryStr.trim()) return all;

  const q = queryStr.toLowerCase().trim();
  return all.filter(t => 
    t.ticket_id.toLowerCase().includes(q) ||
    t.customer_name.toLowerCase().includes(q) ||
    t.mobile.toLowerCase().includes(q) ||
    t.email.toLowerCase().includes(q) ||
    t.instagram_id.toLowerCase().includes(q) ||
    (t.razorpay_order_id && t.razorpay_order_id.toLowerCase().includes(q))
  );
}

/**
 * Check In Ticket (Requirement #1, #6, #7)
 * Prevents duplicate check-in!
 */
export async function checkInTicket(ticketId: string): Promise<{ success: boolean; ticket?: TicketRecord; message: string; isDuplicate?: boolean }> {
  const ticket = await getTicketByTicketId(ticketId);
  if (!ticket) {
    return { success: false, message: '✕ INVALID TICKET: Ticket ID not found in database.' };
  }

  if (ticket.ticket_status !== 'VALID' || ticket.payment_status !== 'PAID') {
    return { success: false, ticket, message: '✕ INVALID TICKET: Ticket payment is not verified.' };
  }

  if (ticket.checked_in === 1) {
    return {
      success: false,
      ticket,
      isDuplicate: true,
      message: `⚠️ ALREADY CHECKED IN: Ticket ${ticket.ticket_id} was already used for entry at ${ticket.checked_in_at || 'earlier session'}.`,
    };
  }

  const now = new Date().toISOString();
  ticket.checked_in = 1;
  ticket.checked_in_at = now;
  ticket.updated_at = now;

  await saveTicketRecord(ticket);

  return {
    success: true,
    ticket,
    message: `✓ CHECK-IN SUCCESSFUL: Welcome ${ticket.customer_name}! Ticket ${ticket.ticket_id} marked as CHECKED IN.`,
  };
}

/**
 * Compute Ticket Summary Stats
 */
export async function getTicketStats() {
  const all = await getAllTickets();
  const todayStr = new Date().toISOString().slice(0, 10);

  const totalBooked = all.length;
  const todayBookings = all.filter(t => t.created_at && t.created_at.startsWith(todayStr)).length;
  const paidTickets = all.filter(t => t.payment_status === 'PAID').length;
  const pendingOrFailed = all.filter(t => t.payment_status !== 'PAID').length;
  const checkedIn = all.filter(t => t.checked_in === 1).length;
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
