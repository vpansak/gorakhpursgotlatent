import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { Pool, type PoolClient } from 'pg';
import { getSession } from '@/lib/auth';
import { SUPABASE_ROOT_CA } from '@/lib/supabaseTls';
import { bootstrapReplica } from '@/lib/databaseBootstrap';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;
const headers = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' };

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.role)) return NextResponse.json({ error: 'Admin login required.' }, { status: 403, headers });
  if (request.headers.get('origin') !== new URL(request.url).origin) return NextResponse.json({ error: 'Same-origin request required.' }, { status: 403, headers });
  const body = await request.json().catch(() => null);
  if (body?.action !== 'copy-baseline-to-empty-supabase') return NextResponse.json({ error: 'Invalid action.' }, { status: 400, headers });
  const sourceUrl = process.env.DATABASE_URL;
  const targetUrl = process.env.SUPABASE_DATABASE_URL;
  if (!sourceUrl || !targetUrl) return NextResponse.json({ error: 'Database configuration is incomplete.' }, { status: 503, headers });
  let pool: Pool | undefined;
  let client: PoolClient | undefined;
  try {
    const url = new URL(targetUrl);
    if (!['postgres:', 'postgresql:'].includes(url.protocol) || !url.hostname.endsWith('.supabase.com') && !url.hostname.endsWith('.supabase.co')) throw new Error('INVALID_DESTINATION');
    ['sslmode', 'sslcert', 'sslkey', 'sslrootcert'].forEach(key => url.searchParams.delete(key));
    pool = new Pool({ connectionString: url.toString(), ssl: { ca: process.env.SUPABASE_CA_CERT?.replace(/\\n/g, '\n') || SUPABASE_ROOT_CA, rejectUnauthorized: true }, max: 1, connectionTimeoutMillis: 10000, query_timeout: 50000, statement_timeout: 45000 });
    client = await pool.connect();
    const source = neon(sourceUrl);
    const result = await bootstrapReplica(
      async (sql, params = []) => await source.query(sql, params),
      async (sql, params = []) => (await client!.query(sql, params)).rows,
    );
    return NextResponse.json({ success: true, ...result }, { headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const known = new Set(['SOURCE_SCHEMA_NOT_READY', 'UNSUPPORTED_TABLE_STRUCTURE', 'CUSTOM_DATABASE_LOGIC_REQUIRES_MIGRATION', 'SOURCE_TOO_LARGE_FOR_ONLINE_COPY', 'SOURCE_SNAPSHOT_FAILED', 'DESTINATION_NOT_EMPTY', 'INVALID_SEQUENCE', 'INVALID_SEQUENCE_TYPE', 'UNSUPPORTED_GENERATED_COLUMN', 'SOURCE_SNAPSHOT_INCOMPLETE', 'VIEW_MIGRATION_FAILED', 'COPY_VERIFICATION_FAILED', 'INVALID_DESTINATION']);
    const detail = (error as { verification?: { table: string; expectedRows: number; actualRows: number; mismatch: string; differingColumns?: string[] } })?.verification;
    const verification = message === 'COPY_VERIFICATION_FAILED' && detail ? { table: detail.table, expectedRows: detail.expectedRows, actualRows: detail.actualRows, mismatch: detail.mismatch, differingColumns: detail.differingColumns } : undefined;
    return NextResponse.json({ success: false, code: known.has(message) ? message : 'COPY_FAILED', verification, error: 'Baseline copy did not complete. Neon was not modified; automatic switching remains off.' }, { status: 409, headers });
  } finally {
    client?.release();
    if (pool) await pool.end().catch(() => {});
  }
}
