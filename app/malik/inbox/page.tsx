'use client';
import { useEffect,useState } from 'react';
import Link from 'next/link';
type Message={id:string;channel:string;account:string;sender:string;text:string;draft:string|null;state:string;reason:string|null;direction:string;paused:boolean;message_at:string};
export default function CloudInbox(){
 const [data,setData]=useState<any>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 async function refresh(){setBusy(true);try{const r=await fetch('/api/malik/inbox',{cache:'no-store'});const d=await r.json();setData(d);setError(r.ok?'':d.error||'Inbox unavailable');}catch{setError('Could not load inbox. Try again.');}finally{setBusy(false);}}
 useEffect(()=>{void refresh();},[]);
 async function pause(m:Message){setBusy(true);try{const r=await fetch('/api/malik/inbox',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'pause',channel:m.channel,account:m.account,sender:m.sender})});if(!r.ok)throw Error();await refresh();}catch{setError('Could not pause this conversation.');}finally{setBusy(false);}}
 return <main className="min-h-screen bg-black text-white p-6 max-w-5xl mx-auto">
  <Link href="/malik" className="text-amber-400">← Admin Portal</Link>
  <h1 className="text-3xl font-bold mt-6">WhatsApp & Instagram cloud inbox</h1>
  <p className="mt-3">{data?.activated?'Cloud sending enabled; per-channel and pilot controls still apply.':'Draft mode. Cloud replies are not activated.'}</p>
  <p className="text-slate-300 mt-2">Review full conversation history before answering through the official Meta inbox. Paused conversations require human attention. Imported browser chat history is not available here.</p>
  <button disabled={busy} onClick={()=>void refresh()} className="mt-5 p-3 border rounded disabled:opacity-50">Refresh inbox</button>
  {error&&<p role="alert" className="text-red-300 mt-4">{error}</p>}
  {data?.channels?.map((c:any)=><p key={c.channel} className="mt-2">{c.channel}: {c.accountConfigured&&c.tokenConfigured&&c.secretConfigured&&c.verificationConfigured&&c.versionConfigured?'Channel credentials present (permissions still need verification).':'Account connection incomplete.'}</p>)}
  <section aria-label="Reply usage" className="mt-4"><h2 className="font-bold">Meta send attempts (last 7 days)</h2>
   <p className="text-slate-300">Default cap: 20 attempts per channel per UTC day; at most 5 replies per conversation in 24 hours. Provider/hosting bills are separate.</p>
   {(data?.usage||[]).map((u:any)=><p key={u.day+u.channel+u.account}>{String(u.day).slice(0,10)} · {u.channel}: {u.attempts} attempts</p>)}
  </section>
  <section aria-label="Conversation messages" className="space-y-4 mt-6">
   {(data?.messages||[]).map((m:Message)=><article key={m.id} className="border border-slate-700 p-4 rounded">
    <h2 className="font-bold">{m.channel} · {m.sender} · {m.direction}</h2>
    <p className="text-sm text-slate-300">{new Date(m.message_at).toLocaleString()} · {m.state}{m.paused?' · Human review / paused':''}</p>
    <p className="whitespace-pre-wrap mt-3">{m.text}</p>
    {m.draft&&<div className="mt-3 bg-slate-900 p-3"><strong>Draft / proposed reply</strong><p className="whitespace-pre-wrap">{m.draft}</p></div>}
    {m.reason&&<p className="text-amber-300 mt-2">{m.reason}</p>}
    {!m.paused&&<button disabled={busy} onClick={()=>void pause(m)} className="mt-3 border p-2 rounded">Pause for human handling</button>}
   </article>)}
   {data?.messages?.length===0&&<p>No cloud messages captured yet.</p>}
  </section>
 </main>;
}
