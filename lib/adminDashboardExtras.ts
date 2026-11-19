import { db } from './db';
import { WEBSITE_ARCHIVE_BEFORE } from './episodeVisibility';

// One read-only statement supplies every supplemental card from one snapshot.
// Database failure propagates instead of becoming a misleading zero count.
export async function getAdminDashboardExtras(query = db.queryStrict) {
  const [row] = await query(`WITH ticket_rows AS (
    SELECT ticket_id,payment_status,amount,created_at,0 AS priority FROM tickets
    UNION ALL
    SELECT ticket_id,payment_status,amount,created_at,1 AS priority FROM ticket_application
  ), current_tickets AS (
    SELECT DISTINCT ON (ticket_id) ticket_id,payment_status,amount
    FROM ticket_rows WHERE created_at > $1::timestamptz ORDER BY ticket_id,priority DESC
  ) SELECT
    COALESCE((SELECT jsonb_agg(to_jsonb(l) ORDER BY updated_at DESC) FROM abandoned_leads l WHERE created_at > $1::timestamptz),'[]'::jsonb) AS leads,
    COALESCE((SELECT jsonb_agg(to_jsonb(c) ORDER BY contestant_id) FROM computerji_scores c WHERE COALESCE(updated_at,created_at) > $1::timestamptz),'[]'::jsonb) AS scores,
    (SELECT count(*)::int FROM current_tickets) AS total_booked,
    (SELECT count(*)::int FROM current_tickets WHERE payment_status IN ('PAID','FREE') OR amount=0) AS paid_tickets
  `, [WEBSITE_ARCHIVE_BEFORE]);
  if (!row || !Array.isArray(row.leads) || !Array.isArray(row.scores)) throw new Error('Dashboard data could not be loaded. Please retry.');
  return { leads: row.leads, computerJiScores: row.scores, ticketStats: { totalBooked: Number(row.total_booked), paidTickets: Number(row.paid_tickets) } };
}
