import { ensurePerformerDetailsTable } from '@/lib/performerDetails';
import { NextResponse } from 'next/server';
import { performerSelect, performerOrder, guestSelect, guestOrder } from '@/lib/adminApplicationQueries';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await ensurePerformerDetailsTable();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'performer'; // performer, guest, sponsor, team, all
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    // If master export requested, fetch all 4 categories at once
    if (type === 'all') {
      const performers = await db.queryStrict(performerSelect + performerOrder);
      const sponsors = await db.queryStrict('SELECT * FROM sponsor_applications ORDER BY COALESCE(is_read, 0) ASC, created_at DESC');
      const team = await db.queryStrict('SELECT * FROM team_applications ORDER BY COALESCE(is_read, 0) ASC, created_at DESC');
      const guests = await db.queryStrict(guestSelect + guestOrder);

      return NextResponse.json({
        success: true,
        data: {
          performers,
          sponsors,
          team,
          guests,
        },
        counts: {
          performers: performers.length,
          sponsors: sponsors.length,
          team: team.length,
          guests: guests.length,
        }
      });
    }

    let items: any[] = [];

    if (type === 'performer') {
      let q = performerSelect + ' WHERE 1=1';
      const params: any[] = [];
      if (status) {
        q += ' AND (p.status = ? OR p.application_status = ? OR p.payment_status = ?)';
        params.push(status, status, status);
      }
      if (search) {
        q += ' AND (p.full_name ILIKE ? OR p.email ILIKE ? OR p.app_id ILIKE ? OR p.city ILIKE ? OR p.mobile_number ILIKE ? OR p.whatsapp_number ILIKE ? OR p.performance_category ILIKE ? OR p.payment_id ILIKE ? OR p.order_id ILIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term, term, term, term, term, term, term);
      }
      q += ' ORDER BY COALESCE(p.is_read, 0) ASC, p.created_at DESC';
      items = await db.queryStrict(q, params);
    } else if (type === 'guest') {
      let q = guestSelect + ' WHERE 1=1';
      const params: any[] = [];
      if (status) {
        q += ' AND g.status = ?';
        params.push(status);
      }
      if (search) {
        q += ' AND (g.full_name ILIKE ? OR g.stage_name ILIKE ? OR g.email ILIKE ? OR g.app_id ILIKE ? OR g.phone ILIKE ? OR g.whatsapp ILIKE ? OR g.city ILIKE ? OR g.category ILIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term, term, term, term, term, term);
      }
      q += ' ORDER BY COALESCE(g.is_read, 0) ASC, g.created_at DESC';
      items = await db.queryStrict(q, params);
    } else if (type === 'sponsor') {
      let q = 'SELECT * FROM sponsor_applications WHERE 1=1';
      const params: any[] = [];
      if (status) {
        q += ' AND status = ?';
        params.push(status);
      }
      if (search) {
        q += ' AND (company_name ILIKE ? OR contact_person ILIKE ? OR biz_email ILIKE ? OR app_id ILIKE ? OR phone ILIKE ? OR whatsapp ILIKE ? OR industry ILIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term, term, term, term, term);
      }
      q += ' ORDER BY COALESCE(is_read, 0) ASC, created_at DESC';
      items = await db.queryStrict(q, params);
    } else if (type === 'team') {
      let q = 'SELECT * FROM team_applications WHERE 1=1';
      const params: any[] = [];
      if (status) {
        q += ' AND status = ?';
        params.push(status);
      }
      if (search) {
        q += ' AND (full_name ILIKE ? OR email ILIKE ? OR mobile_number ILIKE ? OR app_id ILIKE ? OR address ILIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term, term, term);
      }
      q += ' ORDER BY COALESCE(is_read, 0) ASC, created_at DESC';
      items = await db.queryStrict(q, params);
    }

    return NextResponse.json({ success: true, items });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching applications' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { type, appId, status, tags, isFeatured, note } = await req.json();

    if (!type || !appId) {
      return NextResponse.json({ error: 'Type and appId required' }, { status: 400 });
    }

    let tableName = '';
    if (type === 'performer') tableName = 'performer_applications';
    else if (type === 'guest') tableName = 'guest_applications';
    else if (type === 'sponsor') tableName = 'sponsor_applications';
    else if (type === 'team') tableName = 'team_applications';

    if (!tableName) return NextResponse.json({ error: 'Invalid application type' }, { status: 400 });

    const currentRecord = await db.queryOne(`SELECT status FROM ${tableName} WHERE app_id = ? OR id = ?`, [appId, appId]);
    if (!currentRecord) return NextResponse.json({ error: 'Application not found' }, { status: 404 });

    // Update status if changed
    if (status && status !== currentRecord.status) {
      if (tableName === 'performer_applications') {
        await db.execute(`UPDATE ${tableName} SET status = ?, application_status = ?, updated_at = CURRENT_TIMESTAMP WHERE app_id = ? OR id = ?`, [status, status, appId, appId]);
      } else {
        await db.execute(`UPDATE ${tableName} SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE app_id = ? OR id = ?`, [status, appId, appId]);
      }

      await db.execute(`
        INSERT INTO application_status_history (id, app_type, app_id, old_status, new_status, changed_by, reason)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [`his-${Date.now()}`, type.toUpperCase(), appId, currentRecord.status, status, session.full_name, note || 'Status update by admin']);
    }

    // Update tags if provided
    if (tags !== undefined) {
      await db.execute(`UPDATE ${tableName} SET tags = ?, updated_at = CURRENT_TIMESTAMP WHERE app_id = ? OR id = ?`, [tags, appId, appId]);
    }

    // Update featured state if provided
    if (isFeatured !== undefined && ['performer_applications', 'guest_applications', 'sponsor_applications'].includes(tableName)) {
      await db.execute(`UPDATE ${tableName} SET is_featured = ? WHERE app_id = ? OR id = ?`, [isFeatured ? 1 : 0, appId, appId]);
    }

    // Add internal note if provided
    if (note) {
      await db.execute(`
        INSERT INTO application_notes (id, app_type, app_id, author_id, author_name, note)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [`note-${Date.now()}`, type.toUpperCase(), appId, session.id, session.full_name, note]);
    }

    return NextResponse.json({ success: true, message: 'Application updated successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const appId = searchParams.get('appId');

    if (!type || !appId) {
      return NextResponse.json({ error: 'Type and appId required' }, { status: 400 });
    }

    let tableName = '';
    if (type === 'performer') tableName = 'performer_applications';
    else if (type === 'guest') tableName = 'guest_applications';
    else if (type === 'sponsor') tableName = 'sponsor_applications';
    else if (type === 'team') tableName = 'team_applications';

    if (!tableName) {
      return NextResponse.json({ error: 'Invalid application type' }, { status: 400 });
    }

    await db.execute(`DELETE FROM ${tableName} WHERE app_id = ? OR id = ?`, [appId, appId]);

    return NextResponse.json({ success: true, message: 'Application deleted permanently' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Delete failed' }, { status: 500 });
  }
}
