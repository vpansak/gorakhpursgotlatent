'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Loader2, CheckCircle2, Clock3, XCircle } from 'lucide-react';

type TrackResult = {
  success: boolean;
  type: string;
  application: Record<string, any>;
  history?: Array<{ old_status?: string; new_status?: string; reason?: string; created_at?: string }>;
  error?: string;
};

export default function TrackPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<TrackResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = query.trim();
    if (!value) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/track?query=${encodeURIComponent(value)}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, type: '', application: {}, error: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  const application = result?.application;
  const status = String(application?.status || application?.application_status || 'SUBMITTED');

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-amber-300">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <section className="rounded-3xl border border-amber-400/15 bg-white/[0.03] p-5 shadow-2xl sm:p-8">
          <div className="mb-7 text-center">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Application Tracking</p>
            <h1 className="mt-2 text-3xl font-black sm:text-5xl">Track Your Application</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
              Enter your Application ID or the email address used during application.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="GGL-2026-299093 or email"
                className="w-full rounded-2xl border border-white/10 bg-black/30 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition focus:border-amber-400/60"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-3.5 text-sm font-black text-black disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? 'SEARCHING' : 'TRACK'}
            </button>
          </form>

          {result && !result.success && (
            <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm font-semibold text-red-300">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 shrink-0" />
                {result.error || 'No application found with the provided details.'}
              </div>
            </div>
          )}

          {result?.success && application && (
            <div className="mt-7 space-y-4">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Application Type</p>
                    <p className="mt-1 font-bold text-white">{result.type}</p>
                  </div>
                  <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-black uppercase text-amber-300">
                    {status}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div><span className="text-slate-500">Application ID</span><p className="mt-1 font-mono font-bold text-amber-300">{application.app_id || '—'}</p></div>
                  <div><span className="text-slate-500">Name</span><p className="mt-1 font-semibold">{application.full_name || application.company_name || application.contact_person || '—'}</p></div>
                  <div><span className="text-slate-500">Email</span><p className="mt-1 break-all text-slate-200">{application.email || '—'}</p></div>
                  <div><span className="text-slate-500">Submitted</span><p className="mt-1 text-slate-200">{application.created_at ? new Date(application.created_at).toLocaleString('en-IN') : '—'}</p></div>
                </div>
              </div>

              {result.history && result.history.length > 0 && (
                <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-amber-300" />
                    <h2 className="font-bold">Status Timeline</h2>
                  </div>
                  <div className="space-y-3">
                    {result.history.map((item, index) => (
                      <div key={`${item.created_at || 'status'}-${index}`} className="flex gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        <div>
                          <p className="text-sm font-bold text-white">{item.new_status || 'Updated'}</p>
                          <p className="text-xs text-slate-500">
                            {item.created_at ? new Date(item.created_at).toLocaleString('en-IN') : ''}
                            {item.reason ? ` · ${item.reason}` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-center text-xs text-slate-500">
                If your status needs clarification, please contact GGL support.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
