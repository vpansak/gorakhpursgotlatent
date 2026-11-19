import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/load.mjs';
const {createRecoveryJournal}=load('lib/recoveryJournal.ts',{});
function fixture(){
  const files=new Map();let revision=0,clock=1000,ids=0;
  const clone=v=>JSON.parse(JSON.stringify(v));
  const store={
    async read(p){return files.has(p)?clone(files.get(p)):null;},
    async create(p,value){if(files.has(p))throw Object.assign(new Error('conflict'),{code:'CONFLICT'});const etag=String(++revision);files.set(p,{value:clone(value),etag});return etag;},
    async cas(p,value,expected){if(files.get(p)?.etag!==expected)throw Object.assign(new Error('conflict'),{code:'CONFLICT'});const etag=String(++revision);files.set(p,{value:clone(value),etag});return etag;},
  };
  const journal=createRecoveryJournal(store,{now:()=>clock,id:()=>`id-${++ids}`,leaseMs:100});
  return{journal,store,files,advance:n=>clock+=n};
}
test('only one concurrent writer can acquire the durable lease',async()=>{
  const f=fixture();await f.journal.initialize();
  const results=await Promise.allSettled([f.journal.acquire(),f.journal.acquire()]);
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
});
test('intent and dirty-node marker exist before database writes; commit is durably published',async()=>{
  const f=fixture();await f.journal.initialize();const lease=await f.journal.acquire();await f.journal.activate(lease);
  await f.journal.begin(lease,{sql:'INSERT application',params:['Hindi नाम']});await f.journal.touch(lease,'neon');
  let state=(await f.journal.read()).state;assert.ok(state.pending);assert.equal(state.nodes.neon.dirty,true);assert.equal(state.head,0);
  await f.journal.commit(lease,'neon',{events:[{table:'performer_applications',newRow:'{"id":"application"}'}]});
  state=(await f.journal.read()).state;assert.equal(state.head,1);assert.equal(state.pending,null);assert.equal(state.nodes.neon.applied,1);
  const entries=await f.journal.entriesAfter(0);assert.equal(entries.length,1);assert.ok((await f.store.read(entries[0].path)).value.payload.events.length);
});
test('expired writer cannot publish or overwrite a later lease',async()=>{
  const f=fixture();await f.journal.initialize();const old=await f.journal.acquire();await f.journal.activate(old);await f.journal.begin(old,{sql:'write'});await f.journal.touch(old,'neon');
  f.advance(101);const current=await f.journal.acquire();
  await assert.rejects(f.journal.commit(old,'neon',{}),/LEASE_LOST/);
  assert.equal((await f.journal.read()).state.head,0);assert.equal((await f.journal.read()).state.lease.owner,current.owner);
  assert.equal(await f.journal.release(old),false);
});
test('journal storage failure cannot publish a successful application',async()=>{
  const f=fixture();await f.journal.initialize();const lease=await f.journal.acquire();await f.journal.activate(lease);await f.journal.begin(lease,{sql:'write'});await f.journal.touch(lease,'neon');
  const original=f.store.create;f.store.create=async(p,v)=>{if(p.includes('/entries/'))throw new Error('offline');return original(p,v);};
  await assert.rejects(f.journal.commit(lease,'neon',{}),/offline/);
  const state=(await f.journal.read()).state;assert.equal(state.head,0);assert.ok(state.pending);assert.equal(state.nodes.neon.dirty,true);
});
test('unresolved write cannot be silently marked synchronized',async()=>{
  const f=fixture();await f.journal.initialize();const lease=await f.journal.acquire();await f.journal.activate(lease);await f.journal.begin(lease,{});await f.journal.touch(lease,'neon');
  await assert.rejects(f.journal.markSynced(lease,'neon',0),/UNRESOLVED_WRITE/);
});
test('journal indexes retain continuous history across block boundaries',async()=>{
  const f=fixture();await f.journal.initialize();const lease=await f.journal.acquire();await f.journal.activate(lease);
  for(let i=0;i<140;i++){await f.journal.begin(lease,{i});await f.journal.touch(lease,'neon');await f.journal.commit(lease,'neon',{i});}
  const entries=await f.journal.entriesAfter(120);assert.equal(entries.length,20);assert.equal(entries[0].sequence,121);assert.equal(entries.at(-1).sequence,140);
});
test('promotion requires a fully synchronized clean node and no pending write',async()=>{
  const f=fixture();await f.journal.initialize();const lease=await f.journal.acquire();await f.journal.activate(lease);
  await f.journal.begin(lease,{});await f.journal.touch(lease,'neon');await f.journal.commit(lease,'neon',{});
  await assert.rejects(f.journal.switchActive(lease,'supabase'),/NOT_READY/);
  await f.journal.markSynced(lease,'supabase',1);await f.journal.switchActive(lease,'supabase');
  assert.equal((await f.journal.read()).state.active,'supabase');
});
