// Copies an initial, consistent public-schema snapshot. It never writes to the source.
// This is a baseline only: routing stays on Neon until change capture and recovery pass.
type Row = Record<string, any>;
type Query = (sql: string, params?: any[]) => Promise<Row[]>;
const ident = (name: string) => '"' + name.replace(/"/g, '""') + '"';
const literal = (value: string) => "'" + value.replace(/'/g, "''") + "'";

export async function bootstrapReplica(source: Query, target: Query) {
  const tables = await source(`SELECT c.relname AS name, c.relkind AS kind,
    (SELECT jsonb_agg(jsonb_build_object('name', a.attname, 'type', format_type(a.atttypid,a.atttypmod),
      'notNull', a.attnotnull, 'identity', a.attidentity, 'generated', a.attgenerated,
      'expression', pg_get_expr(d.adbin,d.adrelid)) ORDER BY a.attnum)
      FROM pg_attribute a LEFT JOIN pg_attrdef d ON d.adrelid=a.attrelid AND d.adnum=a.attnum
      WHERE a.attrelid=c.oid AND a.attnum>0 AND NOT a.attisdropped) AS columns
    FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relkind IN ('r','p') ORDER BY c.relname`);
  if (!tables.length || !tables.some(t => t.name === 'performer_applications')) throw new Error('SOURCE_SCHEMA_NOT_READY');
  if (tables.some(t => t.kind === 'p' || !t.columns?.length)) throw new Error('UNSUPPORTED_TABLE_STRUCTURE');
  const enums = await source(`SELECT t.typname AS name, jsonb_agg(e.enumlabel ORDER BY e.enumsortorder) AS labels
    FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace JOIN pg_enum e ON e.enumtypid=t.oid
    WHERE n.nspname='public' GROUP BY t.typname`);
  const sequences = await source(`SELECT sequencename AS name, data_type, start_value, min_value, max_value,
    increment_by, cycle, cache_size, last_value FROM pg_sequences WHERE schemaname='public' ORDER BY sequencename`);
  const constraints = await source(`SELECT c.conname AS name, r.relname AS table_name, c.contype AS kind,
    pg_get_constraintdef(c.oid,true) AS definition
    FROM pg_constraint c JOIN pg_class r ON r.oid=c.conrelid JOIN pg_namespace n ON n.oid=r.relnamespace
    WHERE n.nspname='public' AND c.contype IN ('p','u','f','c','x')
    ORDER BY CASE WHEN c.contype='f' THEN 1 ELSE 0 END, r.relname, c.conname`);
  const indexes = await source(`SELECT i.indexdef AS definition FROM pg_indexes i
    WHERE i.schemaname='public' AND NOT EXISTS (SELECT 1 FROM pg_constraint c JOIN pg_class r ON r.oid=c.conindid
      JOIN pg_namespace n ON n.oid=r.relnamespace WHERE n.nspname='public' AND r.relname=i.indexname)
    ORDER BY i.indexname`);
  const views = await source(`SELECT c.relname AS name, pg_get_viewdef(c.oid,true) AS definition
    FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relkind='v' ORDER BY c.relname`);
  const functions = await source(`SELECT p.proname AS name FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
    WHERE n.nspname='public' AND NOT EXISTS (SELECT 1 FROM pg_depend d WHERE d.classid='pg_proc'::regclass
      AND d.objid=p.oid AND d.deptype='e')`);
  const triggers = await source(`SELECT t.tgname AS name FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid
    JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND NOT t.tgisinternal`);
  // Stop rather than silently lose custom business logic. Those objects need a reviewed migration.
  if (functions.length || triggers.length) throw new Error('CUSTOM_DATABASE_LOGIC_REQUIRES_MIGRATION');
  const counts = await source('SELECT ' + tables.map(t => `(SELECT count(*) FROM public.${ident(t.name)}) AS ${ident(t.name)}`).join(','));
  if (Object.values(counts[0] || {}).some(count => Number(count) > 20000)) throw new Error('SOURCE_TOO_LARGE_FOR_ONLINE_COPY');
  const snapshot = await source(`WITH timezone AS MATERIALIZED (SELECT set_config('TimeZone','UTC',true))
    SELECT jsonb_build_object(${tables.map(t => `${literal(t.name)},(SELECT jsonb_build_object(
      'rowsText',COALESCE(jsonb_agg(to_jsonb(r) ORDER BY to_jsonb(r)::text COLLATE "C"),'[]'::jsonb)::text,
      'count',count(*),'digest',md5(COALESCE(jsonb_agg(to_jsonb(r) ORDER BY to_jsonb(r)::text COLLATE "C"),'[]'::jsonb)::text))
      FROM public.${ident(t.name)} r CROSS JOIN timezone)`).join(',')}) AS data FROM timezone`);
  const data = snapshot[0]?.data;
  if (!data) throw new Error('SOURCE_SNAPSHOT_FAILED');
  await target('BEGIN');
  try {
    await target("SET LOCAL statement_timeout = '45000'");
    await target("SET LOCAL lock_timeout = '5000'");
    await target("SET LOCAL TIME ZONE 'UTC'");
    await target('SELECT pg_advisory_xact_lock(714033921)');
    const existing = await target(`SELECT tablename FROM pg_tables WHERE schemaname='public'`);
    if (existing.length) throw new Error('DESTINATION_NOT_EMPTY');
    for (const e of enums) await target(`CREATE TYPE public.${ident(e.name)} AS ENUM (${e.labels.map(literal).join(',')})`);
    const identitySequences = new Set(tables.flatMap(t => t.columns.filter((c: Row) => c.identity).map((c: Row) => `${t.name}_${c.name}_seq`)));
    for (const s of sequences) {
      if (identitySequences.has(s.name)) continue;
      const integer = (v: unknown) => { if (!/^-?\d+$/.test(String(v))) throw new Error('INVALID_SEQUENCE'); return String(v); };
      if (!['smallint','integer','bigint'].includes(s.data_type)) throw new Error('INVALID_SEQUENCE_TYPE');
      await target(`CREATE SEQUENCE public.${ident(s.name)} AS ${s.data_type} START ${integer(s.start_value)}
        INCREMENT ${integer(s.increment_by)} MINVALUE ${integer(s.min_value)} MAXVALUE ${integer(s.max_value)}
        CACHE ${integer(s.cache_size)} ${s.cycle ? 'CYCLE' : 'NO CYCLE'}`);
    }
    for (const table of tables) {
      const fields = table.columns.map((c: Row) => {
        if (c.generated && c.generated !== 's') throw new Error('UNSUPPORTED_GENERATED_COLUMN');
        const generation = c.generated ? ` GENERATED ALWAYS AS (${c.expression}) STORED`
          : c.identity ? ` GENERATED ${c.identity === 'a' ? 'ALWAYS' : 'BY DEFAULT'} AS IDENTITY`
          : c.expression ? ` DEFAULT ${c.expression}` : '';
        return `${ident(c.name)} ${c.type}${generation}${c.notNull ? ' NOT NULL' : ''}`;
      });
      await target(`CREATE TABLE public.${ident(table.name)} (${fields.join(',')})`);
      // Supabase grants public-schema privileges to API roles by default. Keep all copied data server-only.
      await target(`REVOKE ALL ON TABLE public.${ident(table.name)} FROM anon, authenticated`);
      await target(`ALTER TABLE public.${ident(table.name)} ENABLE ROW LEVEL SECURITY`);
      const columns = table.columns.filter((c: Row) => !c.generated).map((c: Row) => ident(c.name)).join(',');
      const rowsText = data[table.name]?.rowsText;
      const count = Number(data[table.name]?.count);
      if (typeof rowsText !== 'string' || !Number.isInteger(count) || count < 0) throw new Error('SOURCE_SNAPSHOT_INCOMPLETE');
      if (count > 20000) throw new Error('SOURCE_TOO_LARGE_FOR_ONLINE_COPY');
      if (count) {
        // Preserve PostgreSQL's JSON text verbatim: parsing/stringifying in JS rounds
        // bigint values and changes JSON numeric scales (e.g. 799.00 becomes 799).
        await target(`INSERT INTO public.${ident(table.name)} (${columns}) OVERRIDING SYSTEM VALUE
          SELECT ${columns} FROM jsonb_populate_recordset(NULL::public.${ident(table.name)},$1::jsonb)`, [rowsText]);
      }
    }
    for (const c of constraints) await target(`ALTER TABLE public.${ident(c.table_name)} ADD CONSTRAINT ${ident(c.name)} ${c.definition}`);
    for (const index of indexes) await target(index.definition);
    for (const s of sequences) {
      if (s.last_value !== null) await target('SELECT setval($1::regclass,$2::bigint,true)', [`public.${ident(s.name)}`, s.last_value]);
      await target(`REVOKE ALL ON SEQUENCE public.${ident(s.name)} FROM anon, authenticated`);
    }
    // View dependencies may refer to another view: retry remaining views in successive savepoints.
    let pending = [...views];
    while (pending.length) {
      const remaining: Row[] = [];
      for (const view of pending) {
        await target('SAVEPOINT replica_view');
        try {
          await target(`CREATE VIEW public.${ident(view.name)} WITH (security_invoker=true) AS ${view.definition}`);
          await target(`REVOKE ALL ON TABLE public.${ident(view.name)} FROM anon, authenticated`);
          await target('RELEASE SAVEPOINT replica_view');
        } catch {
          await target('ROLLBACK TO SAVEPOINT replica_view');
          await target('RELEASE SAVEPOINT replica_view');
          remaining.push(view);
        }
      }
      if (remaining.length === pending.length) throw new Error('VIEW_MIGRATION_FAILED');
      pending = remaining;
    }
    const verified: { table: string; count: number }[] = [];
    for (const table of tables) {
      const [actual] = await target(`SELECT count(*) AS count,
        md5(COALESCE(jsonb_agg(to_jsonb(r) ORDER BY to_jsonb(r)::text COLLATE "C"),'[]'::jsonb)::text) AS digest
        FROM public.${ident(table.name)} r`);
      const expected = data[table.name];
      let matches = Number(actual.count) === Number(expected.count) && actual.digest === expected.digest;
      if (!matches && Number(actual.count) === Number(expected.count)) {
        // A textual digest can differ across PostgreSQL locales/JSON renderers.
        // EXCEPT ALL verifies the complete row multiset, including duplicates, in both directions.
        const [comparison] = await target(`WITH expected AS (SELECT value AS row FROM jsonb_array_elements($1::jsonb)),
          actual AS (SELECT to_jsonb(r) AS row FROM public.${ident(table.name)} r)
          SELECT NOT EXISTS (SELECT 1 FROM (
            (SELECT row FROM expected EXCEPT ALL SELECT row FROM actual)
            UNION ALL (SELECT row FROM actual EXCEPT ALL SELECT row FROM expected)
          ) differences) AS matches`, [expected.rowsText]);
        matches = comparison?.matches === true;
      }
      if (!matches) {
        const differingColumns: string[] = [];
        if (Number(actual.count) === Number(expected.count)) {
          for (const column of table.columns) {
            const [comparison] = await target(`WITH expected AS (SELECT value->${literal(column.name)} AS value FROM jsonb_array_elements($1::jsonb)),
              actual AS (SELECT to_jsonb(r)->${literal(column.name)} AS value FROM public.${ident(table.name)} r)
              SELECT EXISTS (SELECT 1 FROM (
                (SELECT value FROM expected EXCEPT ALL SELECT value FROM actual)
                UNION ALL (SELECT value FROM actual EXCEPT ALL SELECT value FROM expected)
              ) differences) AS differs`, [expected.rowsText]);
            if (comparison?.differs === true) differingColumns.push(column.name);
          }
        }
        throw Object.assign(new Error('COPY_VERIFICATION_FAILED'), { verification: {
          table: table.name, expectedRows: Number(expected.count), actualRows: Number(actual.count),
          mismatch: Number(actual.count) !== Number(expected.count) ? 'ROW_COUNT' : 'CONTENT',
          differingColumns,
        } });
      }
      verified.push({ table: table.name, count: Number(actual.count) });
    }
    await target('COMMIT');
    return { copiedTables: verified, copiedViews: views.length, sourceModified: false, automaticFailoverEnabled: false, automaticSyncEnabled: false };
  } catch (error) {
    await target('ROLLBACK');
    throw error;
  }
}
