type Row = Record<string, any>;
type Query = (sql: string, params?: any[]) => Promise<Row[]>;
const quote = (name: string) => '"' + name.replace(/"/g, '""') + '"';

export async function replicaTables(query: Query) {
  const tables = await query(`SELECT c.relname AS name,
    (SELECT jsonb_agg(jsonb_build_object('name',a.attname,'generated',a.attgenerated,'type',format_type(a.atttypid,a.atttypmod),'notNull',a.attnotnull) ORDER BY a.attnum)
      FROM pg_attribute a WHERE a.attrelid=c.oid AND a.attnum>0 AND NOT a.attisdropped) AS columns,
    (SELECT jsonb_agg(a.attname ORDER BY k.ordinality) FROM pg_index i
      CROSS JOIN LATERAL unnest(i.indkey) WITH ORDINALITY k(attnum,ordinality)
      JOIN pg_attribute a ON a.attrelid=c.oid AND a.attnum=k.attnum
      WHERE i.indrelid=c.oid AND i.indisprimary) AS primary_key
    FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' AND c.relkind='r' ORDER BY c.relname`);
  if (!tables.length || tables.some(t => !t.primary_key?.length)) throw new Error('REPLICA_PRIMARY_KEY_REQUIRED');
  return tables;
}

export async function installReplicaJournal(query: Query, node: 'neon' | 'supabase') {
  const tables = await replicaTables(query);
  await query('CREATE SCHEMA IF NOT EXISTS ggl_replica');
  await query('REVOKE ALL ON SCHEMA ggl_replica FROM PUBLIC');
  await query(`CREATE TABLE IF NOT EXISTS ggl_replica.node (
    singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton), name text NOT NULL,
    active_node text NOT NULL DEFAULT 'neon', ready boolean NOT NULL DEFAULT false)`);
  await query('INSERT INTO ggl_replica.node(singleton,name) VALUES(true,$1) ON CONFLICT(singleton) DO NOTHING',[node]);
  const [local] = await query('SELECT name FROM ggl_replica.node WHERE singleton=true');
  if (local.name !== node) throw new Error('REPLICA_NODE_ID_MISMATCH');
  await query(`CREATE TABLE IF NOT EXISTS ggl_replica.outbox (
    sequence bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    transaction_id bigint NOT NULL DEFAULT txid_current(), table_name text NOT NULL, operation text NOT NULL,
    old_row jsonb, new_row jsonb, created_at timestamptz NOT NULL DEFAULT clock_timestamp(), delivered_at timestamptz)`);
  await query('CREATE INDEX IF NOT EXISTS outbox_pending ON ggl_replica.outbox(sequence) WHERE delivered_at IS NULL');
  await query(`CREATE TABLE IF NOT EXISTS ggl_replica.applied (id uuid PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT clock_timestamp())`);
  await query(`CREATE OR REPLACE FUNCTION ggl_replica.capture() RETURNS trigger LANGUAGE plpgsql
    SECURITY DEFINER SET search_path=pg_catalog SET TimeZone='UTC' AS $capture$
    BEGIN
      IF current_setting('ggl_replica.apply',true)='on' THEN
        IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
      END IF;
      INSERT INTO ggl_replica.outbox(table_name,operation,old_row,new_row)
      VALUES(TG_TABLE_NAME,TG_OP,
        CASE WHEN TG_OP IN ('DELETE','UPDATE') THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) ELSE NULL END);
      IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
    END $capture$`);
  await query('REVOKE ALL ON FUNCTION ggl_replica.capture() FROM PUBLIC');
  for (const table of tables) {
    // The trigger and the application mutation commit or roll back together.
    await query(`DROP TRIGGER IF EXISTS ggl_replica_capture ON public.${quote(table.name)}`);
    await query(`CREATE TRIGGER ggl_replica_capture AFTER INSERT OR UPDATE OR DELETE ON public.${quote(table.name)}
      FOR EACH ROW EXECUTE FUNCTION ggl_replica.capture()`);
    await query(`DROP TRIGGER IF EXISTS ggl_replica_truncate ON public.${quote(table.name)}`);
    await query(`CREATE TRIGGER ggl_replica_truncate AFTER TRUNCATE ON public.${quote(table.name)}
      FOR EACH STATEMENT EXECUTE FUNCTION ggl_replica.capture()`);
  }
  const foreignKeys = await query(`SELECT r.relname AS table_name,c.conname AS name FROM pg_constraint c
    JOIN pg_class r ON r.oid=c.conrelid JOIN pg_namespace n ON n.oid=r.relnamespace
    WHERE n.nspname='public' AND c.contype='f' AND NOT c.condeferrable`);
  for (const constraint of foreignKeys) await query(`ALTER TABLE public.${quote(constraint.table_name)} ALTER CONSTRAINT ${quote(constraint.name)} DEFERRABLE INITIALLY IMMEDIATE`);
  return { node, capturedTables: tables.length };
}

function keyMatch(keys: string[], left: string, right: string) {
  return keys.map(key => `${left}.${quote(key)} IS NOT DISTINCT FROM ${right}.${quote(key)}`).join(' AND ');
}

export async function refreshReplicaContents(source: Query, target: Query) {
  const tables = await replicaTables(source);
  const secondary = await replicaTables(target);
  if (JSON.stringify(tables) !== JSON.stringify(secondary)) throw new Error('REPLICA_SCHEMA_MISMATCH');
  const [state] = await target('SELECT name,active_node FROM ggl_replica.node WHERE singleton=true');
  if (!state || state.name === state.active_node) throw new Error('REPLICA_DESTINATION_IS_ACTIVE');
  const [pending] = await target('SELECT count(*)::int AS count FROM ggl_replica.outbox WHERE delivered_at IS NULL');
  if (pending.count) throw new Error('REPLICA_DESTINATION_HAS_UNSYNCED_WRITES');
  const label = (name:string) => "'"+name.replace(/'/g,"''")+"'";
  // One source statement snapshot; JSON text never passes through JS number parsing.
  const [snapshot] = await source(`WITH timezone AS MATERIALIZED(SELECT set_config('TimeZone','UTC',true))
    SELECT jsonb_build_object(${tables.map(t=>`${label(t.name)},(SELECT COALESCE(jsonb_agg(to_jsonb(r)),'[]'::jsonb)::text
      FROM public.${quote(t.name)} r CROSS JOIN timezone)`).join(',')}) AS data FROM timezone`);
  await target('BEGIN');
  try {
    await target('SELECT pg_advisory_xact_lock(714033921)');
    await target("SELECT set_config('ggl_replica.apply','on',true)");
    await target("SET LOCAL TIME ZONE 'UTC'");
    await target('SET CONSTRAINTS ALL DEFERRED');
    for (const table of tables) {
      const name=`public.${quote(table.name)}`, data=snapshot.data[table.name];
      if(typeof data!=='string') throw new Error('REPLICA_SNAPSHOT_INCOMPLETE');
      const columns=table.columns.filter((c:Row)=>!c.generated).map((c:Row)=>quote(c.name));
      const updates=table.columns.filter((c:Row)=>!c.generated&&!table.primary_key.includes(c.name)).map((c:Row)=>`${quote(c.name)}=EXCLUDED.${quote(c.name)}`);
      await target(`INSERT INTO ${name} (${columns.join(',')}) OVERRIDING SYSTEM VALUE
        SELECT ${columns.join(',')} FROM jsonb_populate_recordset(NULL::${name},$1::jsonb)
        ON CONFLICT (${table.primary_key.map(quote).join(',')}) DO ${updates.length?`UPDATE SET ${updates.join(',')}`:'NOTHING'}`,[data]);
      await target(`DELETE FROM ${name} r WHERE NOT EXISTS(SELECT 1 FROM jsonb_populate_recordset(NULL::${name},$1::jsonb) expected
        WHERE ${keyMatch(table.primary_key,'r','expected')})`,[data]);
    }
    for (const table of tables) {
      const [comparison]=await target(`WITH expected AS(SELECT value AS row FROM jsonb_array_elements($1::jsonb)),
        actual AS(SELECT to_jsonb(r) AS row FROM public.${quote(table.name)} r)
        SELECT NOT EXISTS(SELECT 1 FROM((SELECT row FROM expected EXCEPT ALL SELECT row FROM actual)
          UNION ALL(SELECT row FROM actual EXCEPT ALL SELECT row FROM expected)) differences) AS matches`,[snapshot.data[table.name]]);
      if(comparison.matches!==true) throw new Error('REPLICA_REFRESH_VERIFICATION_FAILED');
    }
    await target('COMMIT');
    return { refreshedTables:tables.length };
  } catch(error) { await target('ROLLBACK'); throw error; }
}

export async function syncReplicaJournal(source: Query, target: Query) {
  const events = await source(`WITH transactions AS (
    SELECT transaction_id,min(sequence) AS first_sequence FROM ggl_replica.outbox
    WHERE delivered_at IS NULL GROUP BY transaction_id ORDER BY min(sequence) LIMIT 20)
    SELECT o.id::text,o.table_name,o.operation,o.old_row::text,o.new_row::text
    FROM ggl_replica.outbox o JOIN transactions t USING(transaction_id)
    WHERE o.delivered_at IS NULL ORDER BY o.sequence`);
  if (!events.length) return { delivered: 0 };
  const tables = new Map((await replicaTables(target)).map(t => [t.name,t]));
  await target('BEGIN');
  try {
    await target('SELECT pg_advisory_xact_lock(714033921)');
    await target("SELECT set_config('ggl_replica.apply','on',true)");
    await target("SET LOCAL TIME ZONE 'UTC'");
    await target('SET CONSTRAINTS ALL DEFERRED');
    for (const event of events) {
      const table = tables.get(event.table_name);
      if (!table) throw new Error('REPLICA_SCHEMA_MISMATCH');
      const inserted = await target('INSERT INTO ggl_replica.applied(id) VALUES($1::uuid) ON CONFLICT(id) DO NOTHING RETURNING id',[event.id]);
      if (!inserted.length) continue;
      const name = `public.${quote(table.name)}`;
      if (event.operation === 'TRUNCATE') { await target(`DELETE FROM ${name}`); continue; }
      if (event.old_row && ['DELETE','UPDATE'].includes(event.operation)) {
        const changed = event.operation === 'UPDATE' ? ` AND NOT (${keyMatch(table.primary_key,'old','fresh')})` : '';
        await target(`DELETE FROM ${name} r USING jsonb_populate_record(NULL::${name},$1::jsonb) old
          ${event.operation === 'UPDATE' ? `CROSS JOIN jsonb_populate_record(NULL::${name},$2::jsonb) fresh` : ''}
          WHERE ${keyMatch(table.primary_key,'r','old')}${changed}`,event.operation === 'UPDATE' ? [event.old_row,event.new_row] : [event.old_row]);
      }
      if (event.new_row && ['INSERT','UPDATE'].includes(event.operation)) {
        // Read keys only; never reserialize the numeric/timestamp payload in JavaScript.
        const fields = Object.keys(JSON.parse(event.new_row)).sort();
        if (fields.join('\0') !== table.columns.map((c:Row)=>c.name).sort().join('\0')) throw new Error('REPLICA_SCHEMA_MISMATCH');
        const columns = table.columns.filter((c:Row)=>!c.generated).map((c:Row)=>quote(c.name));
        const updates = table.columns.filter((c:Row)=>!c.generated&&!table.primary_key.includes(c.name)).map((c:Row)=>`${quote(c.name)}=EXCLUDED.${quote(c.name)}`);
        await target(`INSERT INTO ${name} (${columns.join(',')}) OVERRIDING SYSTEM VALUE
          SELECT ${columns.join(',')} FROM jsonb_populate_record(NULL::${name},$1::jsonb)
          ON CONFLICT (${table.primary_key.map(quote).join(',')}) DO ${updates.length ? `UPDATE SET ${updates.join(',')}` : 'NOTHING'}`,[event.new_row]);
        const [verified] = await target(`SELECT count(*)=1 AND bool_and(to_jsonb(r)=$1::jsonb) AS matches FROM ${name} r
          CROSS JOIN jsonb_populate_record(NULL::${name},$1::jsonb) expected WHERE ${keyMatch(table.primary_key,'r','expected')}`,[event.new_row]);
        if (verified?.matches !== true) throw new Error('REPLICA_EVENT_VERIFICATION_FAILED');
      } else if (event.operation !== 'DELETE') throw new Error('REPLICA_UNKNOWN_OPERATION');
    }
    await target('COMMIT');
  } catch(error) { await target('ROLLBACK'); throw error; }
  // Acknowledgement follows the destination commit. A failed acknowledgement merely
  // replays the batch; the unique applied-event IDs prevent duplicate application.
  await source('UPDATE ggl_replica.outbox SET delivered_at=clock_timestamp() WHERE id=ANY($1::uuid[])',[events.map(e=>e.id)]);
  return { delivered: events.length };
}
