import { Pool } from 'pg';
import { SUPABASE_ROOT_CA } from './supabaseTls';

type Provider = 'neon' | 'supabase';
const pools: Partial<Record<Provider, Pool>> = {};
export async function openDirectDatabase(provider: Provider) {
  if (!pools[provider]) {
    const raw = process.env[provider === 'supabase' ? 'SUPABASE_DATABASE_URL' : 'DATABASE_URL'];
    if (!raw) throw new Error('DATABASE_NOT_CONFIGURED');
    const url = new URL(raw);
    const allowed = provider === 'neon' ? url.hostname.endsWith('.neon.tech') : url.hostname.endsWith('.supabase.com') || url.hostname.endsWith('.supabase.co');
    if (!allowed) throw new Error('INVALID_DATABASE_HOST');
    ['sslmode', 'sslcert', 'sslkey', 'sslrootcert'].forEach(key => url.searchParams.delete(key));
    pools[provider] = new Pool({ connectionString: url.toString(), ssl: provider === 'supabase' ? { ca: SUPABASE_ROOT_CA, rejectUnauthorized: true } : { rejectUnauthorized: true }, max: 4, connectionTimeoutMillis: 10000, statement_timeout: 45000, query_timeout: 50000, idleTimeoutMillis: 5000, allowExitOnIdle: true });
  }
  const client = await pools[provider]!.connect();
  return { query: async (sql: string, params: any[] = []) => (await client.query(sql, params)).rows, close: () => client.release() };
}

export async function directDatabaseDiagnostic() {
  return Promise.all((['neon', 'supabase'] as const).map(async provider => {
    const connection = await openDirectDatabase(provider);
    try {
      await connection.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
      await connection.query("SET LOCAL TIME ZONE 'UTC'");
      const [state] = await connection.query('SELECT n.name,n.mode,n.active_node,l.position::text,l.fence::text FROM ggl_replica.node n CROSS JOIN ggl_replica.ledger_state l WHERE n.singleton AND l.singleton');
      const [log] = await connection.query('SELECT count(*)::int AS operations FROM ggl_replica.operations');
      const [pending] = await connection.query('SELECT count(*)::int AS pending FROM ggl_replica.outbox WHERE delivered_at IS NULL');
      const tables = await connection.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename");
      const fingerprints = [];
      for (const { tablename } of tables) {
        const identifier = '"' + tablename.replace(/"/g, '""') + '"';
        const [result] = await connection.query(`SELECT count(*)::int AS count,md5(COALESCE(string_agg(to_jsonb(r)::text,E'\\n' ORDER BY to_jsonb(r)::text COLLATE "C"),'')) AS fingerprint FROM public.${identifier} r`);
        fingerprints.push({ table: tablename, ...result });
      }
      await connection.query('COMMIT');
      return { provider, state, ...log, ...pending, tables: fingerprints };
    } catch (error) { await connection.query('ROLLBACK').catch(() => {}); throw error; }
    finally { connection.close(); }
  }));
}
