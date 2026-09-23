'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Shield, CheckCircle2, Lock, ArrowRight, Mic2, AlertCircle, RefreshCw,
  LogOut, Star, Sparkles
} from 'lucide-react';

function JudgePortalInner() {
  const searchParams = useSearchParams();
  const initialPin = searchParams?.get('pin') || '';

  const [pin, setPin] = useState(initialPin);
  const [judge, setJudge] = useState<any>(null);
  const [currentAct, setCurrentAct] = useState<any>(null);
  const [existingScore, setExistingScore] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [scoreInput, setScoreInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Check saved session in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ggl_judge_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setJudge(parsed);
      } catch (e) {}
    } else if (initialPin) {
      handleLogin(initialPin);
    }
  }, [initialPin]);

  // Poll current act details for this judge
  const fetchJudgeAct = async (judgeId: string) => {
    try {
      const res = await fetch('/api/live/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'GET_ACT', judgeId })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentAct(data.currentPerformer);
        setExistingScore(data.existingScore);
        setIsLocked(data.isLocked);
        if (data.existingScore !== null && scoreInput === '') {
          setScoreInput(String(data.existingScore));
        }
      }
    } catch (err) {
      console.error('Judge poll error:', err);
    }
  };

  useEffect(() => {
    if (!judge?.id) return;
    fetchJudgeAct(judge.id);
    const interval = setInterval(() => fetchJudgeAct(judge.id), 2000);
    return () => clearInterval(interval);
  }, [judge?.id]);

  const handleLogin = async (pinToTry = pin) => {
    if (!pinToTry.trim()) {
      setMsg({ text: 'Please enter your 4-digit PIN', type: 'error' });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/live/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'LOGIN', pin: pinToTry.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setJudge(data.judge);
        localStorage.setItem('ggl_judge_session', JSON.stringify(data.judge));
        await fetchJudgeAct(data.judge.id);
      } else {
        setMsg({ text: data.error || 'Invalid PIN', type: 'error' });
      }
    } catch (err: any) {
      setMsg({ text: err.message || 'Network error', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitScore = async () => {
    if (!judge?.id || !currentAct?.id) return;

    const num = parseFloat(scoreInput);
    if (isNaN(num) || num < 0 || num > 10) {
      setMsg({ text: 'Score must be between 0.00 and 10.00', type: 'error' });
      return;
    }

    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/live/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SUBMIT_SCORE',
          judgeId: judge.id,
          performerId: currentAct.id,
          score: num
        })
      });
      const data = await res.json();
      if (data.success) {
        setExistingScore(data.score);
        setMsg({ text: `Score of ${data.score.toFixed(2)} submitted successfully!`, type: 'success' });
      } else {
        setMsg({ text: data.error || 'Could not submit score', type: 'error' });
      }
    } catch (err: any) {
      setMsg({ text: err.message || 'Submission error', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ggl_judge_session');
    setJudge(null);
    setCurrentAct(null);
    setExistingScore(null);
    setScoreInput('');
  };

  // 1. PIN LOGIN SCREEN
  if (!judge) {
    return (
      <div className="min-h-screen bg-[#07080e] text-white flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-[#0f1222] border border-amber-500/30 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500 flex items-center justify-center font-black text-black text-2xl shadow-[0_0_30px_rgba(245,158,11,0.5)]">
              GGL
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">
              Judge Scorepad Login
            </h1>
            <p className="text-xs text-slate-400">
              Enter your assigned 4-digit private PIN to access your scoring seat.
            </p>
          </div>

          {msg && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
              msg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{msg.text}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                4-Digit Private PIN
              </label>
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="••••"
                className="w-full bg-black/60 border border-amber-500/40 rounded-2xl px-4 py-4 text-center font-mono font-black text-3xl tracking-widest text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              onClick={() => handleLogin()}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>{loading ? 'Verifying PIN...' : 'Access Judge Seat'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center">
            <span className="text-[11px] text-slate-500">
              Gorakhpur’s Got Latent • Official Live Judging Panel
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. JUDGE SCORING INTERFACE
  return (
    <div className="min-h-screen bg-[#07080e] text-white flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-black text-black text-sm shadow-md">
            J{judge.slot_number}
          </div>
          <div>
            <h2 className="text-base font-black text-white">{judge.name}</h2>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              OFFICIAL JUDGE • SEAT #{judge.slot_number}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      {/* Main Scoring Box */}
      <main className="flex-1 flex flex-col items-center justify-center my-6 max-w-lg w-full mx-auto">
        <div className="w-full bg-[#0f1222] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Current Act Info */}
          <div className="text-center space-y-1 border-b border-white/10 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
              ACT #{currentAct?.running_order || 1} ON STAGE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white pt-2 uppercase">
              {currentAct?.name || 'Waiting for Act...'}
            </h1>
            <p className="text-xs text-amber-300 font-bold">
              Category: {currentAct?.act || 'N/A'}
            </p>
          </div>

          {msg && (
            <div className={`p-3 rounded-xl text-xs font-bold text-center ${
              msg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {msg.text}
            </div>
          )}

          {/* Submission Status */}
          {existingScore !== null && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> SCORE RECORDED
              </span>
              <div className="text-3xl font-black font-mono text-white">
                {Number(existingScore).toFixed(2)} <span className="text-base text-slate-400">/ 10</span>
              </div>
              <p className="text-[10px] text-slate-400">
                {isLocked ? 'Scores are locked by the Operator.' : 'You can update your score below until locked.'}
              </p>
            </div>
          )}

          {/* Score Input Keypad / Stepper */}
          {!isLocked ? (
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
                YOUR SCORE (0.00 – 10.00)
              </label>

              <div className="flex items-center justify-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={scoreInput}
                  onChange={e => setScoreInput(e.target.value)}
                  placeholder="0.0"
                  className="w-36 bg-black/70 border-2 border-amber-500/60 rounded-2xl p-4 text-center font-mono font-black text-4xl text-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/30"
                />
                <span className="text-xl font-black text-slate-500">/ 10</span>
              </div>

              {/* Quick score pills */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {[6, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setScoreInput(String(s))}
                    className="p-2 rounded-xl bg-white/5 hover:bg-amber-500/20 hover:text-amber-400 text-xs font-mono font-bold border border-white/10 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSubmitScore}
                disabled={loading || !currentAct?.id}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                <Star className="w-4 h-4 fill-black" />
                <span>{loading ? 'Submitting...' : existingScore !== null ? 'UPDATE SCORE' : 'SUBMIT SCORE'}</span>
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 text-center space-y-2">
              <Lock className="w-6 h-6 text-amber-400 mx-auto" />
              <div className="text-sm font-black text-white uppercase">SCORING LOCKED</div>
              <p className="text-xs text-slate-400">
                The operator has locked judge scores for this act.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-slate-500 pb-2">
        Secret contestant predictions and other judges’ scores are confidential.
      </footer>
    </div>
  );
}

export default function JudgePortalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07080e] text-white flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black mx-auto animate-pulse">
            GGL
          </div>
          <span className="text-xs text-slate-400 uppercase tracking-widest font-mono">Loading Judge Portal...</span>
        </div>
      </div>
    }>
      <JudgePortalInner />
    </Suspense>
  );
}
