'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Heart, Sparkles, CheckCircle2, Mic2, AlertCircle } from 'lucide-react';

export default function AudienceVotePage() {
  const [data, setData] = useState<any>(null);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchVoteState = async () => {
    try {
      const res = await fetch('/api/live/vote', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchVoteState();
    const interval = setInterval(fetchVoteState, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCastVote = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/live/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType: 'UPVOTE' })
      });
      const json = await res.json();
      if (json.success) {
        setVoted(true);
        setMessage('Your vote has been counted live!');
        await fetchVoteState();
      } else {
        setMessage(json.error || 'Voting closed');
      }
    } catch (err: any) {
      setMessage('Error casting vote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080e] text-white flex flex-col justify-between p-4 sm:p-6 font-sans">
      <header className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-black text-xs">
            GGL
          </div>
          <span className="font-black text-sm text-white tracking-wider">
            GORAKHPUR’S GOT LATENT
          </span>
        </div>
        <div className="px-2.5 py-1 rounded bg-red-600 text-white text-[10px] font-black uppercase">
          LIVE AUDIENCE POLL
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center my-6 max-w-md w-full mx-auto text-center space-y-6">
        <div className="w-full bg-[#0f1222] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
              AUDIENCE VOTE
            </span>
            <h1 className="text-3xl font-black text-white pt-1">
              Vote for This Act!
            </h1>
            <p className="text-xs text-slate-400">
              Tap below to support the performer currently on stage.
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-xs font-bold ${
              voted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {message}
            </div>
          )}

          <div className="p-6 rounded-2xl bg-black/50 border border-white/10 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              TOTAL AUDIENCE VOTES
            </span>
            <div className="text-5xl font-black font-mono text-amber-400">
              {data?.votes?.toLocaleString() || 0}
            </div>
            <span className="text-[10px] text-slate-500 block">
              Live Real-Time Event Tally
            </span>
          </div>

          <button
            onClick={handleCastVote}
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-base uppercase tracking-wider shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 ${
              voted
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white shadow-amber-500/30 animate-pulse'
            }`}
          >
            <Heart className={`w-6 h-6 ${voted ? 'fill-white' : 'fill-amber-300 text-amber-300'}`} />
            <span>{voted ? 'VOTE AGAIN ❤️' : 'CAST YOUR VOTE NOW!'}</span>
          </button>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Note: Audience votes represent the popular fan choice and are tallied separately from the official 5-judge average.
          </p>
        </div>
      </main>

      <footer className="text-center text-[10px] text-slate-600 pb-2">
        Gorakhpur’s Got Latent • Live Fan Experience
      </footer>
    </div>
  );
}
