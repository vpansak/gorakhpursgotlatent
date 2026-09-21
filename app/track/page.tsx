'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Clock, CheckCircle2, AlertCircle, Calendar, MapPin, Tag, Loader2, ArrowLeft } from 'lucide-react';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialAppId = searchParams.get('appId') || '';

  const [appIdInput, setAppIdInput] = useState(initialAppId);
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackData, setTrackData] = useState<any>(null);

  const handleTrack = async (idToTrack?: string, emailToTrack?: string) => {
    const queryId = (idToTrack || appIdInput).trim();
    const queryEmail = (emailToTrack || emailInput).trim();

    if (!queryId || !queryEmail) {
      setError('Please enter both your Application ID and your Registered Email Address.');
      return;
    }

    setError('');
    setLoading(true);
    setTrackData(null);

    try {
      const res = await fetch(`/api/track?appId=${encodeURIComponent(queryId)}&email=${encodeURIComponent(queryEmail)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch application status');

      setTrackData(data);
    } catch (err: any) {
      setError(err.message || 'Error tracking application');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAYMENT_VERIFIED':
      case 'APPROVED':
      case 'CONFIRMED':
      case 'ACTIVE':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'SHORTLISTED':
      case 'INTERVIEW / AUDITION':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'UNDER_REVIEW':
      case 'UNDER REVIEW':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'REFUNDED':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/40';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Input Box */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-5">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-amber-400 uppercase tracking-wide">PERFORMER SECURITY VERIFICATION</h3>
          <p className="text-xs text-slate-300">Enter your unique Application ID and the email address you registered with.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Application ID *</label>
            <div className="relative">
              <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={appIdInput}
                onChange={(e) => setAppIdInput(e.target.value)}
                placeholder="e.g. GGL-2026-483921"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono uppercase text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Registered Email Address *</label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="rahul@gmail.com"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            />
          </div>
        </div>

        <button
          onClick={() => handleTrack()}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 hover:scale-[1.01] transition-all"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'VERIFY CREDENTIALS & TRACK STATUS'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Display */}
      {trackData && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">{trackData.type}</span>
              <h2 className="text-2xl font-black text-white font-mono mt-1">{trackData.application.app_id}</h2>
              <p className="text-sm text-slate-300 font-semibold mt-1">
                Applicant / Name: <span className="text-white">{trackData.application.full_name || trackData.application.company_name || trackData.application.org_name}</span>
              </p>
            </div>

            <div className={`px-4 py-2 rounded-2xl border text-sm font-black uppercase tracking-wider ${getStatusBadge(trackData.application.status)}`}>
              {trackData.application.status}
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 space-y-1">
              <span className="text-slate-400 block font-semibold">Category / Talent</span>
              <span className="text-white font-bold">{trackData.application.talent_category || trackData.application.category || trackData.application.sponsorship_type || 'N/A'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 space-y-1">
              <span className="text-slate-400 block font-semibold">City / Location</span>
              <span className="text-white font-bold">{trackData.application.city || 'N/A'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 space-y-1">
              <span className="text-slate-400 block font-semibold">Submission Date</span>
              <span className="text-white font-bold">{new Date(trackData.application.created_at).toLocaleString('en-IN')}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 space-y-1">
              <span className="text-slate-400 block font-semibold">Last Updated</span>
              <span className="text-white font-bold">{new Date(trackData.application.updated_at).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* History Timeline */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Application History Timeline
            </h4>

            <div className="space-y-3">
              {trackData.history && trackData.history.length > 0 ? (
                trackData.history.map((h: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
                    <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between text-slate-300 font-bold">
                        <span>Status: <strong className="text-amber-300">{h.new_status}</strong></span>
                        <span className="text-[10px] text-slate-400">{new Date(h.created_at).toLocaleString('en-IN')}</span>
                      </div>
                      {h.reason && <p className="text-slate-400">{h.reason}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No historical status updates recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <Link href="/apply" className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Apply Hub
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Application Status Tracker</h1>
        <p className="text-xs sm:text-sm text-slate-300">Input your Application ID to inspect live progress and status logs.</p>
      </div>

      <Suspense fallback={<div className="py-12 text-center text-slate-400">Loading tracker...</div>}>
        <TrackContent />
      </Suspense>
    </div>
  );
}
