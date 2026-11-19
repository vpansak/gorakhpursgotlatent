import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { Pool } from 'pg';
import { getSession } from '@/lib/auth';
import { SUPABASE_ROOT_CA } from '@/lib/supabaseTls';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const catalog = `SELECT table_name, column_name, data_type, is_nullable
  FROM information_schema.columns WHERE table_schema = 'public'
  ORDER BY table_name, ordinal_position`;

function failure(error: unknown) {
  const code = String((error as { code?: string })?.code || '');
  if (code === '28P01' || code === '28000') return 'AUTHENTICATION_FAILED';
  if (code === '53000') return 'RESOURCE_LIMIT';
  if (['ENOTFOUND', 'EAI_AGAIN'].includes(code)) return 'HOST_LOOKUP_FAILED';
  if (['SELF_SIGNED_CERT_IN_CHAIN', 'DEPTH_ZERO_SELF_SIGNED_CERT', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'CERT_HAS_EXPIRED'].includes(code)) return 'TLS_CERTIFICATE_FAILED';
  return 'CONNECTION_FAILED';
}

async function inspect(provider: 'neon' | 'supabase') {
  const raw = process.env[provider === 'neon' ? 'DATABASE_URL' : 'SUPABASE_DATABASE_URL'];
  if (!raw) return { provider, status: 'NOT_CONFIGURED', columns: [] as Record<string, string>[] };
  let url: URL;
  try {
    url = new URL(raw);
    if (!['postgres:', 'postgresql:'].includes(url.protocol) || !url.hostname || !url.password || /\[YOUR[^\]]*\]/i.test(decodeURIComponent(url.password))) throw new Error();
    if (provider === 'supabase' && !url.hostname.endsWith('.supabase.com') && !url.hostname.endsWith('.supabase.co')) throw new Error();
  } catch {
    return { provider, status: 'INVALID_CONNECTION_STRING', columns: [] as Record<string, string>[] };
  }
  let pool: Pool | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    let query: Promise<Record<string, string>[]>;
    if (provider === 'neon') {
      query = neon(raw).query(catalog) as Promise<Record<string, string>[]>;
    } else {
      // Enforce certificate verification rather than silently disabling TLS checks.
      ['sslmode', 'sslcert', 'sslkey', 'sslrootcert'].forEach(key => url.searchParams.delete(key));
      const ca = process.env.SUPABASE_CA_CERT?.replace(/\\n/g, '\n') || SUPABASE_ROOT_CA;
      pool = new Pool({ connectionString: url.toString(), ssl: { ca, rejectUnauthorized: true }, max: 1, connectionTimeoutMillis: 8000, query_timeout: 10000, statement_timeout: 8000, idleTimeoutMillis: 1000 });
      query = pool.query(catalog).then(result => result.rows);
    }
    const columns = await Promise.race([query, new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Connection check timeout')), 12000); })]);
    return { provider, status: 'CONNECTED', columns };
  } catch (error) {
    // Never return database error messages: they may contain hostnames or credentials.
    return { provider, status: failure(error), columns: [] as Record<string, string>[] };
  } finally {
    if (timer) clearTimeout(timer);
    if (pool) await pool.end().catch(() => {});
  }
}

export async function GET() {
  const session = await getSession();
  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
    return NextResponse.json({ error: 'Admin login required.' }, { status: 403, headers: { 'Cache-Control': 'private, no-store' } });
  }
  const [primary, secondary] = await Promise.all([inspect('neon'), inspect('supabase')]);
  const compared = primary.status === 'CONNECTED' && secondary.status === 'CONNECTED';
  const tables = (columns: Record<string, string>[]) => [...new Set(columns.map(c => c.table_name))];
  const sourceTables = tables(primary.columns);
  const destinationTables = tables(secondary.columns);
  const destination = new Map(secondary.columns.map(c => [`${c.table_name}.${c.column_name}`, c]));
  const missingTables = sourceTables.filter(table => !destinationTables.includes(table));
  const differingColumns = primary.columns.filter(c => {
    const other = destination.get(`${c.table_name}.${c.column_name}`);
    return !other || other.data_type !== c.data_type || other.is_nullable !== c.is_nullable;
  }).map(c => `${c.table_name}.${c.column_name}`);
  return NextResponse.json({
    databases: [primary, secondary].map(({ provider, status, columns }) => ({ provider, status, publicTableCount: tables(columns).length })),
    schema: { compared, missingTables: compared ? missingTables : [], differingColumns: compared ? differingColumns : [] },
    dataCopyVerified: false,
    automaticFailoverEnabled: false,
    automaticSyncEnabled: process.env.GGL_REPLICA_SYNC_ENABLED === '1',
    syncDirection: process.env.GGL_REPLICA_SYNC_ENABLED === '1' ? 'neon_to_supabase' : null,
    databaseModified: false,
  }, { headers: { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' } });
}
