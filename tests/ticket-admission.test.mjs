import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transform, loadBindings } from 'next/dist/build/swc/index.js';
import { load } from './helpers/load.mjs';

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, '..');
await loadBindings();
async function component(file, overrides = {}, cache = new Map()) {
  if (cache.has(file)) return cache.get(file);
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const { code } = await transform(source, {
    filename: file,
    jsc: { parser: { syntax: 'typescript', tsx: file.endsWith('.tsx') }, transform: { react: { runtime: 'automatic' } } },
    module: { type: 'commonjs' },
  });
  const dependencies = {};
  for (const [, name] of code.matchAll(/require\("([^"]+)"\)/g)) {
    if (name in overrides) dependencies[name] = overrides[name];
    else if (name.startsWith('@/')) {
      const relative = name.slice(2);
      const target = ['.tsx', '.ts'].map(ext => relative + ext).find(candidate => fs.existsSync(path.join(root, candidate)));
      dependencies[name] = await component(target, overrides, cache);
    } else dependencies[name] = require(name);
  }
  const exports = {};
  vm.runInNewContext(code, { exports, require: name => dependencies[name], console });
  cache.set(file, exports);
  return exports;
}
const quantity = load('lib/ticketQuantity.ts', {});
const ticket = { ticket_id: 'GGLT123456', customer_name: 'Test Guest', mobile: '0000000000', email: '', amount: 447, quantity: 3, checked_in: 0, payment_status: 'PAID', created_at: '2026-10-30T00:00:00Z' };

test('old tickets default to one; stored group quantities are preserved without price inference', () => {
  for (const value of [undefined, null, 0, -1, NaN, Infinity, 1.5, 'bad']) assert.equal(quantity.getTicketQuantity(value), 1);
  for (const count of [1, 2, 3, 10]) assert.equal(quantity.getTicketQuantity(count), count);
  assert.equal(quantity.getTicketQuantity('3'), 3);
});

test('downloadable ticket markup identifies one, two and three admissions, including legacy and free tickets', async () => {
  const { default: Card } = await component('components/TicketCard.tsx');
  for (const count of [undefined, 1, 2, 3]) {
    const expected = count ?? 1;
    const html = renderToStaticMarkup(React.createElement(Card, { ticket: { ...ticket, quantity: count }, showActions: false }));
    assert.ok(html.includes(`TICKETS × ${expected}`));
    assert.ok(html.includes(`ADMIT ${expected} ${expected === 1 ? 'PERSON' : 'PEOPLE'}`));
    assert.ok(html.includes('GGLT123456'));
    assert.ok(!html.includes('ADMIT ONE'));
  }
  const free = renderToStaticMarkup(React.createElement(Card, { ticket: { ...ticket, amount: 0, quantity: 3 }, showActions: false }));
  assert.ok(free.includes('TICKETS × 3'));
});

test('scanner shows the stored party size before entry, after confirmation and on repeat scans', async () => {
  for (const status of ['LOOKUP_VALID', 'SUCCESS_EXPIRED', 'ALREADY_USED']) {
    let state = 0;
    const hooks = { ...React,
      useState: initial => {
        state++;
        const value = initial?.status === 'IDLE' ? { status, ticket, message: '', checkedInAt: '2026-10-30T00:00:00Z' } : state === 4 ? true : initial;
        return [value, () => {}];
      },
      useEffect: () => {}, useRef: () => ({ current: null }),
    };
    const { default: Scanner } = await component('app/verifyticket/page.tsx', { react: hooks });
    const html = renderToStaticMarkup(React.createElement(Scanner));
    assert.ok(html.includes('TICKETS × 3'), status);
    assert.ok(html.includes('3 लोगों का टिकट'), status);
    if (status === 'LOOKUP_VALID') {
      assert.ok(html.includes('CONFIRM ENTRY — 3 PEOPLE'));
      assert.ok(html.includes('on this ticket together.'));
    }
  }
});

test('existing QR lookup returns the original ticket ID and quantity without changing the record', async () => {
  const before = structuredClone(ticket);
  const route = load('app/api/tickets/lookup/route.ts', {
    'next/server': { NextResponse: { json: (body, init) => Response.json(body, init) } },
    '@/lib/ticketsStore': { getTicketByTicketId: async id => { assert.equal(id, ticket.ticket_id); return ticket; } },
    '@/lib/verifyAuth': { isVerifyAuthenticated: async () => true },
  });
  const response = await route.POST(new Request('https://test.invalid/api/tickets/lookup', { method: 'POST', body: JSON.stringify({ ticketId: ticket.ticket_id }) }));
  const result = await response.json();
  assert.equal(result.status, 'VALID');
  assert.equal(result.ticket.quantity, 3);
  assert.equal(result.ticket.ticket_id, before.ticket_id);
  assert.deepEqual(ticket, before);
});
