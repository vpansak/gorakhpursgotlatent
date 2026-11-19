import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { load } from './helpers/load.mjs';
const {bootstrapReplica}=load('lib/databaseBootstrap.ts',{});
const {installReplicaJournal,syncReplicaJournal,refreshReplicaContents}=load('lib/replicaJournal.ts',{});
async function fixture(){
  const a=new PGlite(),b=new PGlite();
  const source=async(s,p)=>(await a.query(s,p)).rows,target=async(s,p)=>(await b.query(s,p)).rows;
  await a.exec(`CREATE TABLE users(id text PRIMARY KEY,name text);
    CREATE TABLE performer_applications(id text PRIMARY KEY,user_id text REFERENCES users(id),details jsonb, created_at timestamptz DEFAULT CURRENT_TIMESTAMP);
    INSERT INTO users VALUES('u1','Original');`);
  await b.exec('CREATE ROLE anon;CREATE ROLE authenticated');
  await bootstrapReplica(source,target);
  await installReplicaJournal(source,'neon');await installReplicaJournal(target,'supabase');
  return{a,b,source,target,close:()=>Promise.all([a.close(),b.close()])};
}
test('committed application writes have durable journal and reach destination with full details',async()=>{
  const f=await fixture();try{
    await f.a.exec(`INSERT INTO performer_applications(id,user_id,details) VALUES('app1','u1','{"name":"नया कलाकार","reference":9007199254740993,"amount":799.00}')`);
    assert.equal((await f.source('SELECT count(*) AS count FROM ggl_replica.outbox WHERE delivered_at IS NULL'))[0].count,1);
    await syncReplicaJournal(f.source,f.target);
    assert.deepEqual(await f.target('SELECT id,user_id,details::text,created_at::text FROM performer_applications'),await f.source('SELECT id,user_id,details::text,created_at::text FROM performer_applications'));
    assert.equal((await f.target('SELECT count(*) AS count FROM ggl_replica.outbox'))[0].count,0);
  }finally{await f.close();}
});
test('source rollback does not leave phantom changes in journal or destination',async()=>{
  const f=await fixture();try{
    await f.a.exec("BEGIN;INSERT INTO performer_applications(id)VALUES('rollback');ROLLBACK");
    assert.equal((await f.source('SELECT count(*) AS count FROM ggl_replica.outbox'))[0].count,0);
    await syncReplicaJournal(f.source,f.target);
    assert.equal((await f.target('SELECT count(*) AS count FROM performer_applications'))[0].count,0);
  }finally{await f.close();}
});
test('failed destination retains pending journal for retry; failed ack is idempotent',async()=>{
  const f=await fixture();try{
    await f.a.exec("INSERT INTO performer_applications(id) VALUES('app1')");
    await assert.rejects(syncReplicaJournal(f.source,async()=>{throw new Error('offline')}));
    assert.equal((await f.source('SELECT count(*) AS count FROM ggl_replica.outbox WHERE delivered_at IS NULL'))[0].count,1);
    const noAck=async(s,p)=>{if(s.startsWith('UPDATE ggl_replica.outbox'))throw new Error('ack offline');return f.source(s,p);};
    await assert.rejects(syncReplicaJournal(noAck,f.target),/ack offline/);
    await syncReplicaJournal(f.source,f.target);
    assert.equal((await f.target('SELECT count(*) AS count FROM performer_applications'))[0].count,1);
    assert.equal((await f.target('SELECT count(*) AS count FROM ggl_replica.applied'))[0].count,1);
  }finally{await f.close();}
});
test('update, primary-key change and delete replicate without echo or dropped child rows',async()=>{
  const f=await fixture();try{
    await f.a.exec("INSERT INTO performer_applications(id,user_id) VALUES('app1','u1');UPDATE users SET name='Updated' WHERE id='u1'");
    await syncReplicaJournal(f.source,f.target);
    assert.equal((await f.target('SELECT count(*) AS count FROM performer_applications'))[0].count,1);
    await f.a.exec("UPDATE performer_applications SET id='new-id' WHERE id='app1'");
    await syncReplicaJournal(f.source,f.target);
    assert.equal((await f.target('SELECT id FROM performer_applications'))[0].id,'new-id');
    await f.a.exec("DELETE FROM performer_applications WHERE id='new-id'");await syncReplicaJournal(f.source,f.target);
    assert.equal((await f.target('SELECT count(*) AS count FROM performer_applications'))[0].count,0);
  }finally{await f.close();}
});
test('refresh closes the copy-to-journal gap and retains writes committed during the snapshot',async()=>{
  const f=await fixture();try{
    await f.a.exec("UPDATE users SET name='Before snapshot' WHERE id='u1';INSERT INTO performer_applications(id,user_id)VALUES('existing','u1')");
    let changed=false;
    const concurrentSource=async(s,p)=>{
      const rows=await f.source(s,p);
      if(s.includes('SELECT jsonb_build_object(')&&!changed){changed=true;await f.a.exec("INSERT INTO performer_applications(id,user_id)VALUES('during-copy','u1')");}
      return rows;
    };
    await refreshReplicaContents(concurrentSource,f.target);
    await syncReplicaJournal(f.source,f.target);
    assert.deepEqual(await f.target('SELECT id,user_id FROM performer_applications ORDER BY id'),await f.source('SELECT id,user_id FROM performer_applications ORDER BY id'));
    assert.equal((await f.target('SELECT count(*) AS count FROM ggl_replica.outbox'))[0].count,0);
  }finally{await f.close();}
});
test('refresh refuses a destination that has its own unsynced writes',async()=>{
  const f=await fixture();try{
    await f.b.exec("INSERT INTO users VALUES('keep-me','Destination write')");
    await assert.rejects(refreshReplicaContents(f.source,f.target),/DESTINATION_HAS_UNSYNCED_WRITES/);
    assert.equal((await f.target("SELECT name FROM users WHERE id='keep-me'"))[0].name,'Destination write');
  }finally{await f.close();}
});
