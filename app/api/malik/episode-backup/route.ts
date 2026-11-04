import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getSession } from '@/lib/auth';
import { BACKUP_GROUPS, BACKUP_RELATED_TABLES, backupCsv, backupZip, fileHash } from '@/lib/episodeBackup';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  const session = await getSession();
  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.role)) return NextResponse.json({ error: 'Admin login required to download the full backup.' }, { status: 403 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'Database unavailable; no data was changed.' }, { status: 503 });
  try {
    // Deliberately bypass schema/TTL helpers: a backup must never modify or purge records.
    const sql = neon(process.env.DATABASE_URL);
    const available = await sql.query("SELECT table_name, column_name FROM information_schema.columns WHERE table_schema='public' ORDER BY table_name, ordinal_position");
    const columns = new Map<string, string[]>();
    for (const row of available) columns.set(row.table_name, [...(columns.get(row.table_name) || []), row.column_name]);
    for (const group of BACKUP_GROUPS) if (group.table !== 'tickets' && !columns.has(group.table)) throw new Error(`Required category table missing: ${group.table}. Backup cancelled.`);
    if (!columns.has('tickets') && !columns.has('ticket_application')) throw new Error('Ticket tables missing. Backup cancelled.');
    const tables = [...new Set([...BACKUP_GROUPS.map(g => g.table), ...BACKUP_RELATED_TABLES])].filter(t => columns.has(t));
    // All exported records share one PostgreSQL statement snapshot.
    const values = tables.map(t => `'${t}', COALESCE((SELECT jsonb_agg(to_jsonb(r)) FROM "${t}" r), '[]'::jsonb)`);
    const [snapshot] = await sql.query(`SELECT CURRENT_TIMESTAMP AS exported_at, jsonb_build_object(${values.join(',')}) AS records`);
    const data = snapshot.records as Record<string, Record<string, unknown>[]>;
    const files: { name: string; data: Buffer }[] = [];
    const add = (name: string, text: string) => files.push({ name, data: Buffer.from(text, 'utf8') });
    const summary: Record<string, unknown>[] = [];
    for (const group of BACKUP_GROUPS) {
      let rows = data[group.table] || [];
      if (group.table === 'tickets') {
        const combined = [...rows, ...(data.ticket_application || [])];
        const unique = new Map<string, Record<string, unknown>>();
        combined.forEach((r, i) => unique.set(String(r.ticket_id || r.id || `unknown-${i}`), r)); rows = [...unique.values()];
      }
      add(`${group.folder}/records.json`, JSON.stringify(rows, null, 2));
      add(`${group.folder}/records.csv`, backupCsv(rows, rows.length ? undefined : columns.get(group.table)));
      summary.push({ category: group.folder, actual_records: rows.length, expected_from_user: group.expected, count_matches: group.expected === null ? 'NOT_SPECIFIED' : rows.length === group.expected, keep_on_website: group.keepOnWebsite });
    }
    // Raw source tables preserve duplicate ticket mirrors, payment references and detailed answers.
    for (const table of tables) add(`Raw-Tables/${table}.json`, JSON.stringify(data[table], null, 2));
    add('SUMMARY.csv', backupCsv(summary));
    add('MANIFEST.json', JSON.stringify({ exported_at: snapshot.exported_at, categories: summary, source_tables: tables, missing_optional_tables: BACKUP_RELATED_TABLES.filter(t => !columns.has(t)), files: files.map(f => ({ path: f.name, bytes: f.data.length, sha256: fileHash(f.data) })), database_modified: false, website_cleared: false }, null, 2));
    add('READ-ME.txt', 'GGL EPISODE 2 FULL BACKUP\n\nEach category contains every stored column in CSV and original JSON. SUMMARY.csv compares actual counts with the counts supplied by the owner. MANIFEST.json records the snapshot time and SHA-256 checksums. Raw-Tables preserves the original database tables including payment links and detailed answers when available.\n\nJoin Team and GGL Talent Trip must remain active. This download does not change, archive or delete any database or website records. Keep this ZIP private: it contains personal contact details.\n');
    const zip = backupZip(files);
    return new Response(new Uint8Array(zip), { headers: { 'Content-Type': 'application/zip', 'Content-Disposition': 'attachment; filename="GGL-Episode-2-Complete-Backup.zip"', 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' } });
  } catch (error) {
    console.error('Episode backup failed:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Complete backup could not be generated. No data was changed. Please retry or contact support.' }, { status: 500 });
  }
}
