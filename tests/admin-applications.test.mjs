import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';

function load(file, dependencies) {
  const source = fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');
  const names = [...source.matchAll(/export (?:async )?(?:function|const) (\w+)/g)].map(match => match[1]);
  const compiled = stripTypeScriptTypes(source, { mode: 'strip' })
    .replace(/import \{([^}]+)\} from ['"]([^'"]+)['"];?/g, (_, members, name) => `const {${members}} = require(${JSON.stringify(name)});`)
    .replace(/export default [^;]+;/g, '')
    .replace(/export (?=(async )?(function|const))/g, '') + '\n' + names.map(name => `exports.${name} = ${name};`).join('\n');
  const exports = {};
  vm.runInNewContext(compiled, { exports, require: (name) => {
    if (!(name in dependencies)) throw new Error('Unexpected import: ' + name);
    return dependencies[name];
  }, global: {}, URL, Request, Response, console, setTimeout, clearTimeout, process: { env: {} } });
  return exports;
}
const queries = load('lib/adminApplicationQueries.ts', {});
const fixture = Array.from({ length: 91 }, (_, id) => ({ app_id: String(id), payment_status: 'FREE', created_at: '2026-10-27' }));
function api(queryStrict) {
  return load('app/api/malik/applications/route.ts', {
    'next/server': { NextResponse: { json: (body, init) => Response.json(body, init) } },
    '@/lib/auth': { getSession: async () => ({ role: 'ADMIN' }) },
    '@/lib/db': { db: { queryStrict, execute: () => { throw new Error('GET must not mutate data'); } } },
    '@/lib/adminApplicationQueries': queries,
  });
}
test('polling and master export retain all 91 free applications, including new submissions', async () => {
  const calls = [];
  const route = api(async (sql) => {
    calls.push(sql);
    assert.doesNotMatch(sql, /TIMESTAMPTZ|DELETE FROM/);
    if (sql.includes('FROM performer_applications p')) return fixture;
    return [];
  });
  const poll = await (await route.GET(new Request('https://example.test/api?type=performer'))).json();
  const master = await (await route.GET(new Request('https://example.test/api?type=all'))).json();
  assert.equal(poll.items.length, 91);
  assert.deepEqual(master.data.performers, poll.items);
  assert.equal(master.counts.performers, 91);
});
test('guest filtering has one outer WHERE and parameterized search/status', async () => {
  const route = api(async (sql, params) => {
    assert.ok(sql.startsWith(queries.guestSelect + ' WHERE 1=1'));
    assert.equal((sql.match(/WHERE/g) || []).length, 1);
    assert.deepEqual(Array.from(params), ['SUBMITTED', ...Array(8).fill('%Test%')]);
    return [{ app_id: 'guest-free' }];
  });
  const result = await (await route.GET(new Request('https://example.test/api?type=guest&status=SUBMITTED&search=Test'))).json();
  assert.equal(result.items[0].app_id, 'guest-free');
});
test('database outage returns an error instead of a successful empty list', async () => {
  const route = api(async () => { throw new Error('Database unavailable'); });
  const response = await route.GET(new Request('https://example.test/api?type=performer'));
  assert.equal(response.status, 500);
  assert.equal((await response.json()).success, undefined);
});
test('strict database access rejects missing configuration', async () => {
  const database = load('lib/db.ts', { '@neondatabase/serverless': { neon: () => { throw new Error('Unexpected connection'); } } });
  await assert.rejects(database.queryStrict('SELECT 1'), /not configured/);
});
