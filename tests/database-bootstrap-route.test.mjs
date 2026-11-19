import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/load.mjs';

function setup({role = 'ADMIN', failure} = {}) {
  const state = { connected: 0, copied: 0, released: false, closed: false };
  const route = load('app/api/malik/database-bootstrap/route.ts', {
    'next/server': { NextResponse: { json: (data, init) => Response.json(data, init) } },
    '@/lib/auth': { getSession: async () => role ? {role} : null },
    '@/lib/supabaseTls': { SUPABASE_ROOT_CA: 'test CA' },
    '@/lib/databaseBootstrap': { bootstrapReplica: async () => { state.copied++; if (failure) throw failure; return {copiedTables: [], sourceModified:false}; } },
    '@neondatabase/serverless': { neon: () => ({query: async () => []}) },
    pg: { Pool: class {
      async connect() {state.connected++; return {query:async()=>({rows:[]}),release:()=>{state.released=true;}};}
      async end() {state.closed=true;}
    } },
  }, {process:{env:{DATABASE_URL:'postgresql://user:test@neon.example/db', SUPABASE_DATABASE_URL:'postgresql://postgres:test@aws-0-test.pooler.supabase.com:6543/postgres'}}});
  return {route,state};
}
const request = (origin = 'https://www.gkpgotlatent.in') => new Request('https://www.gkpgotlatent.in/api/malik/database-bootstrap', {method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify({action:'copy-baseline-to-empty-supabase'})});

test('bootstrap requires owner/admin and rejects cross-origin before opening database',async()=>{
  for (const role of [null,'STAFF','USER']) {
    const {route,state}=setup({role});assert.equal((await route.POST(request())).status,403);assert.equal(state.connected,0);
  }
  const {route,state}=setup();assert.equal((await route.POST(request('https://other.invalid'))).status,403);assert.equal(state.connected,0);
});
test('successful bootstrap releases connection and returns no credentials',async()=>{
  const {route,state}=setup();const r=await route.POST(request());assert.equal(r.status,200);assert.equal(state.copied,1);assert.ok(state.released&&state.closed);assert.doesNotMatch(await r.text(),/postgresql:|test@/);
});
test('failed bootstrap closes connection and hides raw database errors',async()=>{
  const {route,state}=setup({failure:new Error('password-secret SQL user@example.com')});const r=await route.POST(request());assert.equal(r.status,409);assert.ok(state.released&&state.closed);assert.doesNotMatch(await r.text(),/password-secret|user@example/);
});
