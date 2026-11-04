import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect,notFound } from 'next/navigation';
export const dynamic='force-dynamic';
export default async function PerformerRecord({params}:{params:Promise<{appId:string}>}) {
  const session=await getSession();if(!session||!['ADMIN','SUPER_ADMIN','STAFF'].includes(session.role))redirect('/malik');
  const {appId}=await params;
  const record=await db.queryOneStrict('SELECT * FROM performer_applications WHERE app_id=?',[appId]);if(!record)notFound();
  const details=await db.queryOne('SELECT answers FROM performer_details WHERE app_id=?',[appId]);
  return <main className="mx-auto max-w-4xl px-5 py-12 text-white"><a href="/malik" className="text-amber-300">← Admin dashboard</a><h1 className="my-6 text-3xl font-bold">{record.full_name} · {appId}</h1><dl className="space-y-3">{Object.entries({...record,...(details?.answers||{})}).map(([key,value])=><div key={key} className="rounded-xl border border-slate-700 bg-slate-900 p-4"><dt className="text-sm text-amber-300">{key.replaceAll('_',' ')}</dt><dd className="mt-2 whitespace-pre-wrap break-words">{typeof value==='object'?JSON.stringify(value,null,2):String(value??'—')}</dd></div>)}</dl></main>;
}
