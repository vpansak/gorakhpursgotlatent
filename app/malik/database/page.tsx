'use client';

import { useCallback,useEffect,useState } from 'react';
import Link from 'next/link';

type Health={
  databases:{provider:string;status:string;publicTableCount:number}[];
  automaticFailoverEnabled:boolean|null;
  automaticSyncEnabled:boolean;
  activeDatabase:string|null;
  recoveryStatus?:string;
  recovery:{head:number;nodes:Record<string,{applied:number;dirty:boolean}>;pendingOperation:boolean}|null;
};
export default function DatabaseSetupPage() {
  const [busy,setBusy]=useState(true);
  const [health,setHealth]=useState<Health|null>(null);
  const [error,setError]=useState('');
  const refresh=useCallback(async(signal?:AbortSignal)=>{
    setBusy(true);setError('');
    try {
      const response=await fetch('/api/malik/database-health',{cache:'no-store',signal});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||'Could not load current database status.');
      if(!signal?.aborted)setHealth(data);
    }catch(cause){
      if(!signal?.aborted)setError(cause instanceof Error?cause.message:'Could not load current database status.');
    }finally{if(!signal?.aborted)setBusy(false);}
  },[]);
  useEffect(()=>{const controller=new AbortController();void refresh(controller.signal);return()=>controller.abort();},[refresh]);
  const enabled=health?.automaticFailoverEnabled===true;
  const unknown=!health||health.recoveryStatus==='UNAVAILABLE';
  const pending=health?.recovery?Math.max(0,...Object.values(health.recovery.nodes).map(node=>health.recovery!.head-node.applied)):null;
  return <main className="mx-auto max-w-4xl space-y-6 px-5 py-12 text-slate-100">
    <Link href="/malik" className="text-amber-300">← Admin dashboard / login</Link>
    <h1 className="text-3xl font-bold">Database sync status</h1>
    <p className="text-slate-300">Current Neon and Supabase recovery status. This page checks status without copying or changing application records.</p>
    <div className={`rounded-xl border p-5 ${enabled?'border-emerald-400/30 bg-emerald-400/10':'border-amber-400/30 bg-amber-400/10'}`}>
      <p className="font-bold">{unknown?(busy?'Checking the current recovery status…':'Recovery status has not been verified.'):enabled?'Automatic sync and failover are enabled.':health.automaticSyncEnabled?'Automatic synchronization is configured; automatic switching is not enabled.':'Automatic synchronization is not enabled.'}</p>
      {health?.recoveryStatus==='UNAVAILABLE'&&<p className="mt-2 text-amber-200">Recovery status could not be verified. Refresh to check again; this does not mean switching has been disabled.</p>}
      {enabled&&<p className="mt-2 text-sm">Applications and admin reads use the same active database: <strong>{health.activeDatabase}</strong>. Committed changes are retained in the private recovery journal.</p>}
    </div>
    <button disabled={busy} onClick={()=>void refresh()} className="rounded-xl border border-slate-500 px-5 py-3 font-bold disabled:opacity-50">{busy?'Checking…':'Refresh status'}</button>
    {error&&<p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-200">{error}</p>}
    {health&&<>
      <div className="grid gap-4 sm:grid-cols-2">{health.databases.map(database=>{
        const node=health.recovery?.nodes[database.provider];
        const caughtUp=!!node&&!node.dirty&&node.applied===health.recovery!.head;
        return <section key={database.provider} className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h2 className="text-xl font-bold capitalize">{database.provider}{health.activeDatabase===database.provider?' · Active':''}</h2>
          <p className={database.status==='CONNECTED'?'mt-2 text-emerald-300':'mt-2 text-amber-300'}>{database.status}</p>
          {node&&<p className="mt-2">{caughtUp?'Caught up':'Recovery pending'} · Sequence {node.applied} / {health.recovery!.head}</p>}
        </section>;
      })}</div>
      {pending!==null&&<p role="status">Pending journal positions: <strong>{pending}</strong>{health.recovery?.pendingOperation?' · A save is being recovered.':''}</p>}
      <details className="rounded-xl border border-slate-700 p-4"><summary className="cursor-pointer">Technical status</summary><pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap break-words text-sm">{JSON.stringify(health,null,2)}</pre></details>
    </>}
  </main>;
}
