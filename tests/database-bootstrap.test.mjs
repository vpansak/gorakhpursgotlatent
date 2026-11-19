import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { load } from './helpers/load.mjs';

const { bootstrapReplica } = load('lib/databaseBootstrap.ts', {});
async function fixtures() {
  const source = new PGlite();
  const target = new PGlite();
  await source.exec(`CREATE TABLE users(id text PRIMARY KEY, name text NOT NULL);
    CREATE TABLE performer_applications(id serial PRIMARY KEY, user_id text REFERENCES users(id), answers jsonb, image bytea, created_at timestamptz DEFAULT CURRENT_TIMESTAMP);
    INSERT INTO users VALUES ('user-1','Hindi नाम');
    INSERT INTO performer_applications(user_id,answers,image,created_at) VALUES ('user-1','{"quote":"line 1\\nline 2"}',decode('00ff10','hex'),'2026-11-19 13:00:00+05:30');
    CREATE INDEX performer_user ON performer_applications(user_id);
    CREATE VIEW view_all_performers AS SELECT * FROM performer_applications;`);
  await target.exec('CREATE ROLE anon; CREATE ROLE authenticated;');
  return { source, target, read: async(sql,p) => (await source.query(sql,p)).rows, write: async(sql,p) => (await target.query(sql,p)).rows };
}
test('baseline copies schema, foreign keys, indexes, bytea, JSON, timestamps and views without modifying source', async () => {
  const f = await fixtures();
  try {
    const result = await bootstrapReplica(f.read, f.write);
    assert.equal(result.automaticFailoverEnabled, false);
    assert.equal(result.sourceModified, false);
    assert.equal(result.copiedViews, 1);
    assert.equal(result.copiedTables.find(t => t.table === 'performer_applications').count, 1);
    const query = "SELECT id,user_id,answers,encode(image,'hex') AS image,created_at::text FROM performer_applications";
    assert.deepEqual(await f.write(query), await f.read(query));
    const rows = await f.write(`SELECT relrowsecurity FROM pg_class WHERE relname='performer_applications'`);
    assert.equal(rows[0].relrowsecurity, true);
    assert.deepEqual(await f.write('SELECT * FROM view_all_performers'), await f.read('SELECT * FROM view_all_performers'));
    const [next] = await f.write("INSERT INTO performer_applications(user_id) VALUES ('user-1') RETURNING id");
    assert.equal(next.id, 2);
    await assert.rejects(f.write("INSERT INTO performer_applications(user_id) VALUES ('missing')"));
    assert.equal((await f.read('SELECT count(*) AS count FROM performer_applications'))[0].count, 1);
  } finally { await Promise.all([f.source.close(), f.target.close()]); }
});
test('refuses existing destination and does not overwrite any data', async () => {
  const f = await fixtures();
  try {
    await f.target.exec("CREATE TABLE existing(id text); INSERT INTO existing VALUES ('keep-me')");
    await assert.rejects(bootstrapReplica(f.read, f.write), /DESTINATION_NOT_EMPTY/);
    assert.equal((await f.write('SELECT id FROM existing'))[0].id, 'keep-me');
    assert.equal((await f.write("SELECT count(*) AS count FROM pg_tables WHERE schemaname='public'"))[0].count, 1);
  } finally { await Promise.all([f.source.close(), f.target.close()]); }
});
test('copy failure rolls the destination back to empty', async () => {
  const f = await fixtures();
  try {
    const failing = async (sql,p) => {
      if (sql.startsWith('INSERT INTO public.')) throw new Error('injected insert failure');
      return f.write(sql,p);
    };
    await assert.rejects(bootstrapReplica(f.read, failing), /injected insert failure/);
    assert.equal((await f.write("SELECT count(*) AS count FROM pg_tables WHERE schemaname='public'"))[0].count, 0);
    assert.equal((await f.read('SELECT count(*) AS count FROM performer_applications'))[0].count, 1);
  } finally { await Promise.all([f.source.close(), f.target.close()]); }
});
test('preserves nested JSON numbers above JavaScript safe range and decimal scale', async () => {
  const f = await fixtures();
  try {
    await f.source.exec(`UPDATE performer_applications SET answers='{"reference":9007199254740993,"fee":799.00,"scores":[8.0,7.50]}'::jsonb`);
    await bootstrapReplica(f.read, f.write);
    assert.deepEqual(await f.write('SELECT answers::text FROM performer_applications'), await f.read('SELECT answers::text FROM performer_applications'));
  } finally { await Promise.all([f.source.close(), f.target.close()]); }
});
test('copy verifies timestamps even when source session uses another timezone', async () => {
  const f = await fixtures();
  try {
    await f.source.exec("SET TIME ZONE 'Asia/Kolkata'");
    await bootstrapReplica(f.read, f.write);
    assert.deepEqual(await f.write('SELECT extract(epoch FROM created_at)::text AS instant FROM performer_applications'), await f.read('SELECT extract(epoch FROM created_at)::text AS instant FROM performer_applications'));
  } finally { await Promise.all([f.source.close(), f.target.close()]); }
});
test('content mismatch still aborts and reports only table/count metadata', async () => {
  const f = await fixtures();
  try {
    const corrupt = async (sql,p) => {
      if (sql.includes('AS digest') && sql.includes('FROM public."performer_applications"')) await f.write('UPDATE performer_applications SET user_id=NULL');
      return f.write(sql,p);
    };
    await assert.rejects(bootstrapReplica(f.read, corrupt), error => {
      assert.equal(error.message,'COPY_VERIFICATION_FAILED');
      assert.equal(error.verification.table,'performer_applications');
      assert.equal(error.verification.mismatch,'CONTENT');
      assert.equal(error.verification.expectedRows,1);
      assert.deepEqual(Array.from(error.verification.differingColumns),['user_id']);
      return true;
    });
    assert.equal((await f.write("SELECT count(*) AS count FROM pg_tables WHERE schemaname='public'"))[0].count,0);
  } finally { await Promise.all([f.source.close(), f.target.close()]); }
});
test('row verification is independent of different source and destination collations', async () => {
  const f = await fixtures();
  try {
    await f.source.exec("INSERT INTO users VALUES ('a','lowercase'),('A','uppercase'),('á','accented'),('B','upper B'),('b','lower B')");
    const differentCollation = (sql,p) => f.write(sql.includes('COLLATE "C"') ? sql : sql.replaceAll('ORDER BY to_jsonb(r)::text', 'ORDER BY to_jsonb(r)::text COLLATE "und-x-icu"'),p);
    await bootstrapReplica(f.read,differentCollation);
  } finally { await Promise.all([f.source.close(), f.target.close()]); }
});
test('digest formatting mismatch must pass exact SQL multiset comparison before committing', async () => {
  const f = await fixtures();
  let comparisons=0;
  try {
    const differentRenderer=async(sql,p)=>{
      const rows=await f.write(sql,p);
      if (sql.includes('AS digest')) rows[0].digest='different textual rendering';
      if (sql.includes('AS matches')) comparisons++;
      return rows;
    };
    await bootstrapReplica(f.read,differentRenderer);
    assert.equal(comparisons,2);
  } finally { await Promise.all([f.source.close(), f.target.close()]); }
});
