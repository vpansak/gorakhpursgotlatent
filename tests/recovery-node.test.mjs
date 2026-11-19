import test from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {randomUUID,createHash} from 'node:crypto';
import {load} from './helpers/load.mjs';
const replica=load('lib/replicaJournal.ts',{});
const codec=load('lib/recoveryValues.ts',{});
const {createRecoveryNode}=load('lib/recoveryNode.ts',{'node:crypto':{createHash},'./replicaJournal':replica,'./recoveryValues':codec},{crypto:{randomUUID}});
const {createRecoveryJournal}=load('lib/recoveryJournal.ts',{}, {crypto:{randomUUID}});
const {createRecoveryCoordinator}=load('lib/recoveryCoordinator.ts',{'./recoveryValues':codec});
async function fixture(){
 const files=new Map();let revision=0;
 const clone=v=>JSON.parse(JSON.stringify(v));
 const store={async read(p){return files.has(p)?clone(files.get(p)):null;},async create(p,v){if(files.has(p))throw Object.assign(new Error('conflict'),{code:'CONFLICT'});const etag=String(++revision);files.set(p,{value:clone(v),etag});return etag;},async cas(p,v,e){if(files.get(p)?.etag!==e)throw Object.assign(new Error('conflict'),{code:'CONFLICT'});const etag=String(++revision);files.set(p,{value:clone(v),etag});return etag;}};
 const databases={neon:new PGlite(),supabase:new PGlite()},online={neon:true,supabase:true},nodes={};
 for(const name of ['neon','supabase']){
  const db=databases[name];const query=async(s,p)=>(await db.query(s,p)).rows;
  await db.exec('CREATE TABLE performer_applications(id text PRIMARY KEY,details jsonb,created_at timestamptz DEFAULT CURRENT_TIMESTAMP)');
  await replica.installReplicaJournal(query,name);
  await query("UPDATE ggl_replica.node SET mode='MANAGED',ready=true WHERE singleton=true");
  nodes[name]=createRecoveryNode(name,async()=>{if(!online[name])throw new Error('offline');return{query,close:async()=>{}};},store);
 }
 const journal=createRecoveryJournal(store);await journal.initialize();const lease=await journal.acquire();await journal.activate(lease);await journal.release(lease);
 return {databases,online,nodes,journal,manager:createRecoveryCoordinator(journal,nodes,store),close:()=>Promise.all(Object.values(databases).map(db=>db.close()))};
}
test('real SQL failover retains complete JSON and admin sees Supabase application before Neon returns',async()=>{
 const f=await fixture();try {
  f.online.neon=false;
  await f.manager.write('INSERT INTO performer_applications(id,details) VALUES($1,$2::jsonb) RETURNING id',['new','{"name":"कलाकार","reference":9007199254740993,"amount":799.00}']);
  const rows=await f.manager.read('SELECT id,details::text FROM performer_applications');assert.equal(rows[0].id,'new');assert.match(rows[0].details,/9007199254740993/);
  f.online.neon=true;await f.manager.recover();
  const a=await f.databases.neon.query('SELECT id,details::text,created_at::text FROM performer_applications');
  const b=await f.databases.supabase.query('SELECT id,details::text,created_at::text FROM performer_applications');assert.deepEqual(a.rows,b.rows);
 }finally{await f.close();}
});
test('real SQL rollback does not publish constraint failures, lower fencing token cannot write',async()=>{
 const f=await fixture();try {
  await f.manager.write('INSERT INTO performer_applications(id) VALUES($1)',['same']);
  await assert.rejects(f.manager.write('INSERT INTO performer_applications(id) VALUES($1)',['same']));
  assert.equal((await f.journal.read()).state.head,1);assert.equal((await f.journal.read()).state.pending,null);
  await assert.rejects(f.nodes.neon.operation(randomUUID(),'DELETE FROM performer_applications',[],1,0),/FENCED/);
  assert.equal((await f.databases.neon.query('SELECT count(*) FROM performer_applications')).rows[0].count,1);
 }finally{await f.close();}
});
test('replicated serial IDs advance standby sequence before it accepts new writes',async()=>{
 const f=await fixture();try {
  for(const db of Object.values(f.databases))await db.exec('CREATE TABLE serial_items(id bigserial PRIMARY KEY,value text)');
  for(const name of ['neon','supabase'])await replica.installReplicaJournal(async(s,p)=>(await f.databases[name].query(s,p)).rows,name);
  await f.manager.write('INSERT INTO serial_items(value) VALUES($1) RETURNING id',['first']);
  await f.manager.recover();f.online.neon=false;
  const rows=await f.manager.write('INSERT INTO serial_items(value) VALUES($1) RETURNING id',['second']);assert.equal(rows[0].id,2);
  f.online.neon=true;await f.manager.recover();assert.equal((await f.databases.neon.query('SELECT count(*) FROM serial_items')).rows[0].count,2);
 }finally{await f.close();}
});
