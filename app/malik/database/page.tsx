'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DatabaseSetupPage() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState('');
  async function run(copy: boolean) {
    if (busy) return;
    setBusy(true); setError(''); setResult(null);
    try {
      const response = await fetch(copy ? '/api/malik/database-bootstrap' : '/api/malik/database-health', copy ? {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'copy-baseline-to-empty-supabase' }),
      } : { cache: 'no-store' });
      const data = await response.json();
      setResult(data);
      if (!response.ok) setError(data.error || 'This step could not complete.');
    } catch {
      setError('Connection interrupted. Check connections before retrying the copy; do not clear either database.');
    } finally { setBusy(false); }
  }
  return <main className="mx-auto max-w-4xl space-y-6 px-5 py-12 text-slate-100">
    <Link href="/malik" className="text-amber-300">← Admin dashboard / login</Link>
    <h1 className="text-3xl font-bold">Database recovery setup</h1>
    <p className="text-slate-300">Both connections are configured. First copy the existing Neon records into the empty Supabase database and verify their contents.</p>
    <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-5">
      <p className="font-bold text-amber-200">Automatic failover and ongoing sync are not enabled yet.</p>
      <p className="mt-2 text-sm">This step creates only the initial copy. New applications continue to use Neon. The copy refuses a non-empty destination and rolls back if verification fails.</p>
    </div>
    <div className="flex flex-wrap gap-4">
      <button disabled={busy} onClick={() => run(false)} className="rounded-xl border border-slate-500 px-5 py-3 font-bold disabled:opacity-50">Check connections</button>
      <button disabled={busy} onClick={() => run(true)} className="rounded-xl bg-amber-400 px-5 py-3 font-bold text-black disabled:opacity-50">Copy and verify initial data</button>
    </div>
    {busy && <p role="status">Working… Keep this page open. A complete copy can take several minutes.</p>}
    {error && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-200">{error}</p>}
    {result?.success && <p role="status" className="text-emerald-300">Initial copy verified. Ongoing sync and automatic failover still require setup.</p>}
    {result && <pre className="max-h-[34rem] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-900 p-5 text-sm">{JSON.stringify(result, null, 2)}</pre>}
  </main>;
}
