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

export async function queryPrimaryDatabase(sql: string, params: any[] = []) {
  const connection = await openDirectDatabase('supabase');
  try {
    await connection.query('BEGIN');
    const [state] = await connection.query('SELECT mode FROM ggl_replica.node WHERE singleton=true FOR SHARE');
    if (state?.mode !== 'SUPABASE_PRIMARY') throw new Error('SUPABASE_CUTOVER_NOT_READY');
    const rows = await connection.query(sql, params);
    await connection.query('COMMIT');
    return rows;
  } catch (error) { await connection.query('ROLLBACK').catch(() => {}); throw error; }
  finally { connection.close(); }
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
      const [currentEpisode] = await connection.query(`SELECT
        (SELECT count(*)::int FROM performer_applications WHERE created_at > $1::timestamptz) AS performers,
        (SELECT count(*)::int FROM tickets WHERE created_at > $1::timestamptz) AS tickets`, ['2026-11-04T04:13:28.000Z']);
      const tables = await connection.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename");
      const fingerprints: {table:string;count:number;fingerprint:string}[] = [];
      for (const { tablename } of tables) {
        const identifier = '"' + tablename.replace(/"/g, '""') + '"';
        const [result] = await connection.query(`SELECT count(*)::int AS count,md5(COALESCE(string_agg(to_jsonb(r)::text,E'\\n' ORDER BY to_jsonb(r)::text COLLATE "C"),'')) AS fingerprint FROM public.${identifier} r`);
        fingerprints.push({ table: tablename, count:Number(result.count),fingerprint:result.fingerprint });
      }
      await connection.query('COMMIT');
      return { provider, state, ...log, ...pending, currentEpisode, tables: fingerprints };
    } catch (error) { await connection.query('ROLLBACK').catch(() => {}); throw error; }
    finally { connection.close(); }
  }));
}

export function verifyCutoverCopies(databases: Awaited<ReturnType<typeof directDatabaseDiagnostic>>) {
  const source = databases.find(database => database.provider === 'neon');
  const target = databases.find(database => database.provider === 'supabase');
  if (!source || !target || source.state?.position !== target.state?.position || source.operations !== target.operations || source.pending || target.pending) throw new Error('CUTOVER_UNSYNCED_CHANGES');
  if (JSON.stringify(source.tables) !== JSON.stringify(target.tables)) throw new Error('CUTOVER_CONTENT_MISMATCH');
  return { verifiedTables: target.tables.length, performers: target.tables.find(table => table.table === 'performer_applications')?.count, tickets: target.tables.find(table => table.table === 'tickets')?.count };
}

export async function activateSupabasePrimary() {
  // This deliberately does not overwrite either database. A mismatch requires
  // reconciliation, never a blind baseline copy over existing records.
  verifyCutoverCopies(await directDatabaseDiagnostic());
  for (const provider of ['neon', 'supabase'] as const) {
    const connection = await openDirectDatabase(provider);
    try {
      await connection.query('BEGIN');
      await connection.query('SELECT pg_advisory_xact_lock(714033921)');
      await connection.query('UPDATE ggl_replica.ledger_state SET fence=fence+1000000 WHERE singleton=true');
      await connection.query("UPDATE ggl_replica.node SET mode='PAUSED',pause_until=NULL WHERE singleton=true");
      await connection.query('COMMIT');
    } catch (error) { await connection.query('ROLLBACK').catch(() => {}); throw error; }
    finally { connection.close(); }
  }
  const verified = verifyCutoverCopies(await directDatabaseDiagnostic());
  const target = await openDirectDatabase('supabase');
  try {
    await target.query("UPDATE ggl_replica.node SET mode='SUPABASE_PRIMARY',active_node='supabase',pause_until=NULL,ready=true WHERE singleton=true AND mode='PAUSED'");
  } finally { target.close(); }
  return { ...verified, activeDatabase: 'supabase', automaticSyncEnabled: false, automaticFailoverEnabled: false, existingRecordsModified: false };
}
