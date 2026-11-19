import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/load.mjs';

function setup({ role = 'ADMIN', password = 'test', fail, source = [], destination = [] } = {}) {
  const calls = [];
  let closed = false;
  const route = load('app/api/malik/database-health/route.ts', {
    'next/server': { NextResponse: { json: (body, init) => Response.json(body, init) } },
    '@/lib/auth': { getSession: async () => role ? { role } : null },
    '@/lib/supabaseTls': load('lib/supabaseTls.ts', {}),
    '@neondatabase/serverless': { neon: () => ({ query: async sql => { calls.push(sql); return source; } }) },
    pg: { Pool: class {
      constructor(config) { assert.equal(config.ssl.rejectUnauthorized, true); assert.match(config.ssl.ca, /BEGIN CERTIFICATE/); }
      async query(sql) { calls.push(sql); if (fail) throw fail; return { rows: destination }; }
      async end() { closed = true; }
    } },
  }, { process: { env: { DATABASE_URL: 'postgresql://user:test@neon.example/db', SUPABASE_DATABASE_URL: `postgresql://postgres:${password}@aws-0-test.pooler.supabase.com:6543/postgres` } } });
  return { route, calls, isClosed: () => closed };
}

test('database health rejects anonymous and staff without connecting', async () => {
  for (const role of [null, 'STAFF', 'USER']) {
    const { route, calls } = setup({ role });
    assert.equal((await route.GET()).status, 403);
    assert.equal(calls.length, 0);
  }
});
test('reports missing schema using read-only queries and closes pool', async () => {
  const { route, calls, isClosed } = setup({ source: [{ table_name: 'performer_applications', column_name: 'id', data_type: 'text', is_nullable: 'NO' }] });
  const r = await route.GET();
  const data = await r.json();
  assert.deepEqual(data.schema.missingTables, ['performer_applications']);
  assert.equal(data.automaticFailoverEnabled, false);
  assert.equal(data.dataCopyVerified, false);
  assert.ok(calls.every(sql => /^SELECT\b/.test(sql)));
  assert.ok(isClosed());
  assert.equal(r.headers.get('Cache-Control'), 'private, no-store');
});
test('never leaks credentials or underlying error messages', async () => {
  const { route } = setup({ fail: Object.assign(new Error('SECRET postgres://user:password@private.host'), { code: '28P01' }) });
  const data = await (await route.GET()).text();
  assert.match(data, /AUTHENTICATION_FAILED/);
  assert.doesNotMatch(data, /SECRET|password@|private.host/);
  const result = JSON.parse(data);
  assert.equal(result.schema.compared, false);
  assert.deepEqual(result.schema.missingTables, []);
  assert.deepEqual(result.schema.differingColumns, []);
});
test('rejects leftover password placeholder', async () => {
  const { route, calls } = setup({ password: '[YOUR-PASSWORD]' });
  const data = await (await route.GET()).json();
  assert.equal(data.databases[1].status, 'INVALID_CONNECTION_STRING');
  assert.equal(calls.length, 1);
});
