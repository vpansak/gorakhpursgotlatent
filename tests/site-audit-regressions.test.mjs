import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { load } from './helpers/load.mjs';
const next={'next/server':{NextResponse:{json:(body,init)=>Response.json(body,init)}}};
function upload(role='ADMIN',failure=false,configured=true){
 const writes=[];
 const route=load('app/api/upload-private/route.ts',{
  ...next,'node:crypto':{randomBytes},'@/lib/auth':{getSession:async()=>role?{role}:null},
  '@vercel/blob':{put:async(...args)=>{writes.push(args);if(failure)throw new Error('provider offline');return{url:'https://private.invalid/document'};}},
 },{process:{env:{BLOB_READ_WRITE_TOKEN:configured?'test-token':undefined}}});
 return{route,writes};
}
function request(){const form=new FormData();form.append('file',new File(['%PDF-1.4 test'],'example.pdf',{type:'text/html'}));return new Request('https://example.test/api/upload-private',{method:'POST',body:form});}
test('private document uploads reject anonymous users before reading or storing a file',async()=>{
 for(const role of [null,'USER']){const f=upload(role);assert.equal((await f.route.POST(request())).status,403);assert.equal(f.writes.length,0);}
});
test('private documents return an authenticated URL and storage failure never falls back to a public or temporary location',async()=>{
 const f=upload();const res=await f.route.POST(request());assert.equal(res.status,200);const body=await res.json();
 assert.match(body.docUrl,/^\/api\/malik\/documents\/doc-/);assert.equal(f.writes[0][2].access,'private');assert.equal(f.writes[0][2].contentType,'application/pdf');
 assert.doesNotMatch(JSON.stringify(body),/private.invalid|data:|storage\/private/);
 for(const f of [upload('ADMIN',true),upload('ADMIN',false,false)]){const response=await f.route.POST(request());assert.equal(response.status,503);assert.equal((await response.json()).success,undefined);}
});
test('retired legacy payment paths cannot issue simulated payments or duplicate tickets',async()=>{
 for(const name of ['create-order','verify']){const route=load(`app/api/payments/${name}/route.ts`,next);const res=await route.POST(new Request('https://example.test',{method:'POST'}));assert.equal(res.status,410);assert.equal((await res.json()).bookingUrl,'/book-ticket');}
});
test('public showcase works with the real minimal schema and exposes approved display fields only',async()=>{
 const db=new PGlite();try{
  await db.exec(`CREATE TABLE performer_applications(app_id text,full_name text,city text,performance_category text,performance_title text,performance_description text,status text,is_featured int,email text);
   INSERT INTO performer_applications VALUES('public','Artist','Gorakhpur','Poetry','Act','Bio','APPROVED',1,'private@example.test'),('hidden','Hidden','Gorakhpur','Poetry','Act','Bio','SUBMITTED',1,'secret@example.test');
   CREATE TABLE guest_applications(app_id text,full_name text,stage_name text,city text,profession text,category text,short_intro text,status text,is_featured int);
   CREATE TABLE sponsor_applications(app_id text,company_name text,industry text,sponsorship_type text,website text,status text,is_featured int);`);
  const route=load('app/api/public/showcase/route.ts',{...next,'@/lib/db':{db:{queryStrict:async(sql)=>(await db.query(sql)).rows}}});
  const response=await route.GET();assert.equal(response.status,200);const body=await response.json();assert.equal(body.performers.length,1);assert.equal(body.performers[0].talent_category,'Poetry');assert.deepEqual(body.settings,{});
  assert.doesNotMatch(JSON.stringify(body),/private@example|secret@example|dbInfo|current_database|budget_est/);
 }finally{await db.close();}
});
test('public media reader cannot cross into private document storage',async()=>{
 let reads=0;const route=load('app/api/media/[file]/route.ts',{'@vercel/blob':{get:async()=>{reads++;throw new Error('Unexpected access');}}});
 for(const file of ['doc-123-private.pdf','../private.pdf','ggl-private-documents/private.pdf']){
  const response=await route.GET(new Request('https://example.test'),{params:Promise.resolve({file})});assert.equal(response.status,404);
 }
 assert.equal(reads,0);
});
test('live spreadsheet CSV treats formula-like applicant text as text',()=>{
 const storage=load('lib/storage.ts',{'@aws-sdk/client-s3':{S3Client:class{},PutObjectCommand:class{}},'./db':{query:async()=>[]}});
 const csv=storage.jsonToCSV([{name:'Artist',answer:' =1+1',phone:'+919999999999'}]);
 assert.ok(csv.includes("' =1+1"));assert.ok(csv.includes("'+919999999999"));
});
