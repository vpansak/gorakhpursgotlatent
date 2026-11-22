import test from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {load} from './helpers/load.mjs';
const next={'next/server':{NextResponse:{json:(body,init)=>Response.json(body,init)}}};
test('active event API skips historical and draft shows and selects the earliest upcoming show',async()=>{
 const pg=new PGlite();
 try {
  await pg.exec(`CREATE TABLE events(id text PRIMARY KEY,event_date text,status text);
   CREATE TABLE ticket_categories(id text,event_id text,status text,sort_order int);
   INSERT INTO events VALUES('expired','1999-01-01','PUBLISHED'),('unscheduled','Announce soon','PUBLISHED');
   INSERT INTO events VALUES
   ('later',to_char((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')+interval '3 days','YYYY-MM-DD'),'PUBLISHED'),
   ('next',to_char((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')+interval '1 day','YYYY-MM-DD'),'PUBLISHED'),
   ('draft',to_char(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata','YYYY-MM-DD'),'DRAFT');
   INSERT INTO ticket_categories VALUES('next-category','next','ACTIVE',1),('expired-category','expired','ACTIVE',1);`);
  const route=load('app/api/events/active/route.ts',{...next,'@/lib/db':{db:{
   queryOneStrict:async(sql)=>(await pg.query(sql)).rows[0]??null,
   queryStrict:async(sql,params)=>(await pg.query(sql.replace('?','$1'),params)).rows
  }}});
  const response=await route.GET();const body=await response.json();
  assert.equal(body.event.id,'next');assert.equal(body.categories.length,1);assert.equal(body.categories[0].id,'next-category');
  await pg.exec("DELETE FROM events WHERE id IN ('next','later')");
  const empty=await(await route.GET()).json();assert.equal(empty.success,false);assert.equal(empty.event,null);assert.equal(empty.categories.length,0);
 }finally{await pg.close();}
});
test('database failure is an unavailable response, never an empty successful event or a leaked connection string',async()=>{
 const route=load('app/api/events/active/route.ts',{...next,'@/lib/db':{db:{queryOneStrict:async()=>{throw new Error('postgres://user:SECRET@private-host')}}}});
 const response=await route.GET();assert.equal(response.status,503);assert.doesNotMatch(await response.text(),/SECRET|private-host|postgres:/);
});
