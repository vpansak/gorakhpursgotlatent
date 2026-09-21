import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'performer'; // performer, guest, sponsor, event
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    let items: any[] = [];

    if (type === 'performer') {
      let query = 'SELECT * FROM performer_applications WHERE 1=1';
      const params: any[] = [];
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      if (search) {
        query += ' AND (full_name LIKE ? OR email LIKE ? OR app_id LIKE ? OR city LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term, term);
      }
      query += ' ORDER BY created_at DESC';
      items = db.prepare(query).all(...params);
    } else if (type === 'guest') {
      let query = 'SELECT * FROM guest_applications WHERE 1=1';
      const params: any[] = [];
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      if (search) {
        query += ' AND (full_name LIKE ? OR stage_name LIKE ? OR email LIKE ? OR app_id LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term, term);
      }
      query += ' ORDER BY created_at DESC';
      items = db.prepare(query).all(...params);
    } else if (type === 'sponsor') {
      let query = 'SELECT * FROM sponsor_applications WHERE 1=1';
      const params: any[] = [];
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      if (search) {
        query += ' AND (company_name LIKE ? OR contact_person LIKE ? OR biz_email LIKE ? OR app_id LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term, term);
      }
      query += ' ORDER BY created_at DESC';
      items = db.prepare(query).all(...params);
    } else if (type === 'event') {
      let query = 'SELECT * FROM event_booking_applications WHERE 1=1';
      const params: any[] = [];
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      if (search) {
        query += ' AND (org_name LIKE ? OR contact_person LIKE ? OR email LIKE ? OR app_id LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term, term);
      }
      query += ' ORDER BY created_at DESC';
      items = db.prepare(query).all(...params);
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
    else if (type === 'event') tableName = 'event_booking_applications';

    if (!tableName) return NextResponse.json({ error: 'Invalid application type' }, { status: 400 });

    const currentRecord = db.prepare(`SELECT status FROM ${tableName} WHERE app_id = ?`).get(appId) as any;
    if (!currentRecord) return NextResponse.json({ error: 'Application not found' }, { status: 404 });

    // Update status if changed
    if (status && status !== currentRecord.status) {
      db.prepare(`UPDATE ${tableName} SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE app_id = ?`).run(status, appId);

      db.prepare(`
        INSERT INTO application_status_history (id, app_type, app_id, old_status, new_status, changed_by, reason)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(`his-${Date.now()}`, type.toUpperCase(), appId, currentRecord.status, status, session.full_name, note || 'Status update by admin');
    }

    // Update tags if provided
    if (tags !== undefined) {
      db.prepare(`UPDATE ${tableName} SET tags = ?, updated_at = CURRENT_TIMESTAMP WHERE app_id = ?`).run(tags, appId);
    }

    // Update featured state if provided
    if (isFeatured !== undefined && ['performer_applications', 'guest_applications', 'sponsor_applications'].includes(tableName)) {
      db.prepare(`UPDATE ${tableName} SET is_featured = ? WHERE app_id = ?`).run(isFeatured ? 1 : 0, appId);
    }

    // Add internal note if provided
    if (note) {
      db.prepare(`
        INSERT INTO application_notes (id, app_type, app_id, author_id, author_name, note)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(`note-${Date.now()}`, type.toUpperCase(), appId, session.id, session.full_name, note);
    }

    return NextResponse.json({ success: true, message: 'Application updated successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}
