import test from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {load} from './helpers/load.mjs';
const visibility=load('lib/episodeVisibility.ts',{});
test('dashboard initial snapshot has real leads, scores and deduplicated current-episode tickets',async()=>{
 const pg=new PGlite();
 try {
 await pg.exec(`CREATE TABLE tickets(ticket_id text,payment_status text,amount numeric,created_at timestamptz);
 CREATE TABLE ticket_application(LIKE tickets);
 CREATE TABLE abandoned_leads(id text,created_at timestamptz,updated_at timestamptz);
 CREATE TABLE computerji_scores(contestant_id int,created_at timestamptz,updated_at timestamptz);
 INSERT INTO tickets VALUES('old','PAID',149,'2026-11-01'),('current','PAID',149,'2026-11-15');
 INSERT INTO ticket_application VALUES('current','PAID',149,'2026-11-15');
 INSERT INTO abandoned_leads VALUES('lead','2026-11-15','2026-11-15');
 INSERT INTO computerji_scores VALUES(1,'2026-11-01','2026-11-15');`);
 let calls=0;
 const {getAdminDashboardExtras}=load('lib/adminDashboardExtras.ts',{'./db':{db:{}},'./episodeVisibility':visibility});
 const result=await getAdminDashboardExtras(async(sql,params)=>{calls++;return(await pg.query(sql,params)).rows;});
 assert.equal(calls,1);assert.equal(result.leads.length,1);assert.equal(result.computerJiScores.length,1);assert.equal(result.ticketStats.totalBooked,1);assert.equal(result.ticketStats.paidTickets,1);
 await assert.rejects(getAdminDashboardExtras(async()=>{throw new Error('offline')}),/offline/);
 }finally{await pg.close();}
});
