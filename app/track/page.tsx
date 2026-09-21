'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Clock, CheckCircle2, AlertCircle, Calendar, MapPin, Tag, Loader2, ArrowLeft } from 'lucide-react';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialAppId = searchParams.get('appId') || '';

  const [appIdInput, setAppIdInput] = useState(initialAppId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackData, setTrackData] = useState<any>(null);

  useEffect(() => {
    if (initialAppId) {
      handleTrack(initialAppId);
    }
  }, [initialAppId]);

  const handleTrack = async (idToTrack?: string) => {
    const queryId = (idToTrack || appIdInput).trim();
    if (!queryId) {
      setError('Please enter an Application ID (e.g. GGL-PER-109283)');
      return;
    }

    setError('');
    setLoading(true);
    setTrackData(null);

    try {
      const res = await fetch(`/api/track?appId=${encodeURIComponent(queryId)}`);
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
      case 'APPROVED':
      case 'CONFIRMED':
      case 'ACTIVE':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'SHORTLISTED':
      case 'INTERVIEW / AUDITION':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'UNDER REVIEW':
      case 'NEGOTIATION':
      case 'PROPOSAL SENT':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Input Box */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-amber-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={appIdInput}
              onChange={(e) => setAppIdInput(e.target.value)}
              placeholder="e.g. GGL-PER-109283"
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono uppercase text-sm sm:text-base focus:border-amber-400 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            />
          </div>
          <button
            onClick={() => handleTrack()}
            disabled={loading}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'CHECK STATUS'}
          </button>
        </div>

        <div className="text-[11px] text-slate-400 flex flex-wrap gap-2">
          <span className="font-bold text-slate-300">Format Examples:</span>
          <button onClick={() => { setAppIdInput('GGL-PER-109283'); handleTrack('GGL-PER-109283'); }} className="hover:text-amber-400 underline font-mono">GGL-PER-109283</button>
          <span>•</span>
          <button onClick={() => { setAppIdInput('GGL-GST-592019'); handleTrack('GGL-GST-592019'); }} className="hover:text-amber-400 underline font-mono">GGL-GST-592019</button>
          <span>•</span>
          <button onClick={() => { setAppIdInput('GGL-SPN-294012'); handleTrack('GGL-SPN-294012'); }} className="hover:text-amber-400 underline font-mono">GGL-SPN-294012</button>
        </div>
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
