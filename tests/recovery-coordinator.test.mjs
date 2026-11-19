import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {load} from './helpers/load.mjs';
const codec=load('lib/recoveryValues.ts',{});
const {createRecoveryJournal}=load('lib/recoveryJournal.ts',{}, {crypto:{randomUUID}});
const {createRecoveryCoordinator}=load('lib/recoveryCoordinator.ts',{'./recoveryValues':codec});
async function fixture(){
 const files=new Map();let revision=0;
 const clone=v=>JSON.parse(JSON.stringify(v));
 const store={async read(p){return files.has(p)?clone(files.get(p)):null;},async create(p,v){if(files.has(p))throw Object.assign(new Error('conflict'),{code:'CONFLICT'});const etag=String(++revision);files.set(p,{value:clone(v),etag});return etag;},async cas(p,v,e){if(files.get(p)?.etag!==e)throw Object.assign(new Error('conflict'),{code:'CONFLICT'});const etag=String(++revision);files.set(p,{value:clone(v),etag});return etag;}};
 const journal=createRecoveryJournal(store);await journal.initialize();const lease=await journal.acquire();await journal.activate(lease);await journal.release(lease);
 const nodes={};
 for(const name of ['neon','supabase']){
  const state={online:true,position:0,values:[],operations:new Map(),unknownCommit:false,fence:0};
  const check=fence=>{if(!state.online)throw new Error('offline');if(fence<state.fence)throw new Error('fenced');state.fence=fence;};
  nodes[name]={name,state,async position(f){check(f);return state.position;},async read(_s,_p,pos){check(state.fence);assert.equal(state.position,pos);return state.values;},async operation(id,_sql,params,pos,f){check(f);if(state.operations.has(id))return state.operations.get(id);assert.equal(state.position,pos);const payload={sqlHash:'hash',rows:codec.encodeRecoveryValue([{value:params[0]}]),events:[{value:params[0]}]};state.operations.set(id,payload);state.values.push(params[0]);state.position++;if(state.unknownCommit){state.online=false;throw new Error('connection lost after commit');}return payload;},async find(id,f){check(f);return state.operations.get(id)||null;},async published(){},async apply(record,f){check(f);if(state.position>=record.sequence)return;assert.equal(state.position,record.sequence-1);state.values.push(record.payload.events[0].value);state.position=record.sequence;state.operations.set(record.operation,record.payload);},async rebuild(peer,pos,f){check(f);state.values=[...peer.state.values];state.position=pos;state.operations=new Map(peer.state.operations);},decodeRows:p=>codec.decodeRecoveryValue(p.rows)};
 }
 return{store,journal,nodes,manager:createRecoveryCoordinator(journal,nodes,store)};
}
test('Neon outage saves on Supabase, admin reads it, returning Neon catches up',async()=>{
 const f=await fixture();f.nodes.neon.state.online=false;
 const rows=await f.manager.write('INSERT',['new performer']);assert.equal(rows[0].value,'new performer');
 assert.equal((await f.journal.read()).state.active,'supabase');assert.deepEqual(Array.from(await f.manager.read('SELECT')),['new performer']);
 f.nodes.neon.state.online=true;await f.manager.recover();assert.deepEqual(f.nodes.neon.state.values,['new performer']);
});
test('Supabase outage retains committed changes and automatically catches up later',async()=>{
 const f=await fixture();f.nodes.supabase.state.online=false;await f.manager.write('INSERT',['one']);await f.manager.write('INSERT',['two']);
 await f.manager.recover();f.nodes.supabase.state.online=true;await f.manager.recover();assert.deepEqual(f.nodes.supabase.state.values,['one','two']);
});
test('unknown Neon commit is canonicalized on healthy replica and reconciled without duplicate',async()=>{
 const f=await fixture();f.nodes.neon.state.unknownCommit=true;await f.manager.write('INSERT',['unique']);
 assert.equal((await f.journal.read()).state.head,1);assert.equal((await f.journal.read()).state.nodes.neon.dirty,true);
 f.nodes.neon.state.online=true;f.nodes.neon.state.unknownCommit=false;await f.manager.recover();
 assert.deepEqual(f.nodes.neon.state.values,['unique']);assert.deepEqual(f.nodes.supabase.state.values,['unique']);
});
test('independent journal failure cannot return application success',async()=>{
 const f=await fixture();const original=f.store.create;f.store.create=async(p,v)=>{if(p.includes('/entries/'))throw new Error('journal offline');return original(p,v);};
 await assert.rejects(f.manager.write('INSERT',['safe']),/journal offline/);assert.equal((await f.journal.read()).state.head,0);
 f.store.create=original;await f.manager.recover();assert.equal((await f.journal.read()).state.head,1);
});
