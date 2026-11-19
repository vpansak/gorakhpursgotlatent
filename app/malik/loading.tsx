export default function AdminLoading() {
  return <main role="status" aria-live="polite" aria-busy="true" className="mx-auto max-w-7xl space-y-6 px-5 py-12">
    <p className="text-lg font-bold text-amber-200">Loading your admin dashboard…</p>
    <p className="text-sm text-slate-300">Preparing applications, tickets and leads.</p>
    <div aria-hidden="true" className="grid grid-cols-2 gap-4 sm:grid-cols-4">{Array.from({length:8},(_,index)=><div key={index} className="h-24 rounded-xl border border-slate-700 bg-slate-900" />)}</div>
  </main>;
}
