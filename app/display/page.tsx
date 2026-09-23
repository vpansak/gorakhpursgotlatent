'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Mic2, Shield, Sparkles, Award, Users, AlertTriangle, CheckCircle2,
  Flame, QrCode, Timer as TimerIcon
} from 'lucide-react';
import { playSound } from '@/lib/soundboard';

export default function PublicDisplayPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [displaySeconds, setDisplaySeconds] = useState(180);
  const [prevSound, setPrevSound] = useState<string | null>(null);

  // Poll state every 1 second
  const fetchDisplayState = async () => {
    try {
      const res = await fetch('/api/live/state', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setData(json);

        // Auto sound trigger if received from operator
        if (json.state?.sound_trigger && json.state.sound_trigger !== prevSound) {
          setPrevSound(json.state.sound_trigger);
          playSound(json.state.sound_trigger);
        }
      }
    } catch (err) {
      console.error('Display poll error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisplayState();
    const interval = setInterval(fetchDisplayState, 1000);
    return () => clearInterval(interval);
  }, [prevSound]);

  // Local Timer countdown
  useEffect(() => {
    if (!data?.state) return;
    setDisplaySeconds(data.state.timer_seconds ?? 180);

    let timerInterval: any = null;
    if (data.state.timer_running === 1) {
      timerInterval = setInterval(() => {
        setDisplaySeconds(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [data?.state?.timer_running, data?.state?.timer_seconds]);

  const state = data?.state || {};
  const currentPerf = data?.currentPerformer;
  const scoredCount = data?.scoredJudgesCount || 0;
  const totalJudges = data?.totalJudgesCount || 5;
  const sponsors = data?.sponsors || [];
  const revealData = data?.revealData;
  const isEmergencyBlank = state.emergency_blank === 1;

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 1. STATE 5 — EMERGENCY BLANK SCREEN
  if (isEmergencyBlank) {
    return (
      <div className="fixed inset-0 bg-[#05060a] z-50 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
        <div className="space-y-6 max-w-2xl animate-pulse">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 font-black text-3xl shadow-[0_0_50px_rgba(245,158,11,0.3)]">
            GGL
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-widest uppercase">
            GORAKHPUR’S GOT LATENT
          </h1>
          <p className="text-lg text-amber-400 font-bold uppercase tracking-wider">
            Live Show Will Resume Shortly
          </p>
          <div className="h-1 w-32 bg-amber-500/40 mx-auto rounded-full"></div>
        </div>
      </div>
    );
  }

  // Determine current display state:
  // STATE 1: BEFORE_SCORING / READY / ON_STAGE
  // STATE 2: JUDGING / SCORES_LOCKED
  // STATE 3: AVERAGE_CALCULATED (Calculation done, prediction HIDDEN)
  // STATE 4: RESULT_REVEALED (Dramatic reveal)
  const isResultRevealed = state.reveal_status === 'REVEALED' && state.status === 'RESULT_REVEALED';
  const isAverageCalculated = !isResultRevealed && state.calculated_average !== null && state.calculated_average !== undefined;
  const isJudging = !isResultRevealed && !isAverageCalculated && (state.status === 'JUDGING' || state.status === 'SCORES_LOCKED');

  return (
    <div className="fixed inset-0 bg-radial from-[#121528] via-[#090b14] to-[#040508] text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden font-sans">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* TOP HEADER: Branding & Show Status */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center font-black text-black text-xl shadow-[0_0_25px_rgba(245,158,11,0.6)]">
            GGL
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider">
              GORAKHPUR’S GOT LATENT
            </h2>
            <span className="text-xs text-amber-400 font-extrabold uppercase tracking-widest">
              PURVANCHAL’S BIGGEST LIVE TALENT SHOW
            </span>
          </div>
        </div>

        {/* Center: Live Timer if running or active */}
        {state.timer_running === 1 && (
          <div className="flex items-center gap-3 bg-black/60 px-6 py-2 rounded-2xl border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <TimerIcon className="w-5 h-5 text-amber-400 animate-spin" />
            <span className={`text-3xl font-mono font-black ${
              displaySeconds <= 30 && displaySeconds > 0 ? 'text-red-500 animate-ping' : 'text-white'
            }`}>
              {formatTimer(displaySeconds)}
            </span>
          </div>
        )}

        {/* Right: Live Badge & Audience Vote QR Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-slate-300">
              Audience Votes: <strong className="text-white font-mono">{data?.audienceVoteCount?.toLocaleString() || 0}</strong>
            </span>
          </div>
          <div className="px-4 py-1.5 rounded-xl bg-red-600 text-white font-black text-xs uppercase flex items-center gap-2 shadow-lg shadow-red-600/30">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            LIVE STAGE
          </div>
        </div>
      </header>

      {/* MAIN STAGE CONTENT (Dynamic State Switcher) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center my-6">
        {/* ==========================================================
            STATE 4 — DRAMATIC RESULT REVEAL
            ========================================================== */}
        {isResultRevealed && revealData ? (
          <div className="w-full max-w-4xl bg-black/80 border-2 border-amber-500 rounded-3xl p-8 sm:p-12 shadow-[0_0_80px_rgba(245,158,11,0.35)] text-center space-y-8 animate-zoom-in backdrop-blur-xl">
            {/* Act Header */}
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                OFFICIAL SCORING REVEAL
              </span>
              <h1 className="text-4xl sm:text-6xl font-black text-white mt-3 uppercase tracking-tight">
                {currentPerf?.name || 'CONTESTANT'}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-bold mt-1">
                Category: <strong className="text-amber-300">{currentPerf?.act}</strong>
              </p>
            </div>

            {/* Score Grid: 3 Big Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Judge Average */}
              <div className="p-6 rounded-2xl bg-[#0e1222] border border-amber-500/40 shadow-inner space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  FINAL JUDGE AVERAGE
                </span>
                <div className="text-4xl sm:text-6xl font-black font-mono text-amber-400">
                  {Number(revealData.judgeAverage).toFixed(2)}
                </div>
                <span className="text-xs text-slate-400 font-bold block">OUT OF 10.00</span>
              </div>

              {/* Contestant Prediction */}
              <div className="p-6 rounded-2xl bg-[#0e1222] border border-amber-500/40 shadow-inner space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  SECRET PREDICTION
                </span>
                <div className="text-4xl sm:text-6xl font-black font-mono text-white">
                  {Number(revealData.contestantPrediction).toFixed(2)}
                </div>
                <span className="text-xs text-slate-400 font-bold block">CONTESTANT GUESS</span>
              </div>

              {/* Difference */}
              <div className="p-6 rounded-2xl bg-[#0e1222] border border-amber-500/40 shadow-inner space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  DIFFERENCE
                </span>
                <div className="text-4xl sm:text-6xl font-black font-mono text-amber-300">
                  {Number(revealData.difference).toFixed(2)}
                </div>
                <span className="text-xs text-slate-400 font-bold block">MATH GAP</span>
              </div>
            </div>

            {/* FINAL RESULT BANNER */}
            <div className="pt-2">
              {revealData.result === 'WINNER' ? (
                <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600 text-black shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-pulse">
                  <div className="text-4xl sm:text-6xl font-black uppercase tracking-wider flex items-center justify-center gap-3">
                    <Award className="w-12 h-12" /> WINNER!
                  </div>
                  <p className="text-sm font-black uppercase tracking-widest mt-1 text-black/80">
                    EXACT MATCH! PREDICTION PERFECTLY MATCHED THE 5-JUDGE AVERAGE!
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-red-950/70 border-2 border-red-500/60 text-white shadow-[0_0_40px_rgba(239,68,68,0.3)]">
                  <div className="text-3xl sm:text-5xl font-black uppercase tracking-wider text-red-400">
                    NOT A MATCH
                  </div>
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 mt-1">
                    Off by {Number(revealData.difference).toFixed(2)} points • Thank you for performing!
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : isAverageCalculated ? (
          /* ==========================================================
             STATE 3 — AVERAGE CALCULATED (PREDICTION & RESULT HIDDEN)
             ========================================================== */
          <div className="w-full max-w-3xl bg-black/70 border border-amber-500/50 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-md">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
              5 JUDGES SCORES LOCKED
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              {currentPerf?.name || 'CONTESTANT'}
            </h1>

            <div className="p-8 rounded-2xl bg-[#0f1222] border-2 border-amber-500 shadow-xl space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                JUDGE AVERAGE CALCULATED
              </span>
              <div className="text-6xl sm:text-8xl font-black font-mono text-amber-400 tracking-tight">
                {Number(state.calculated_average).toFixed(2)}
                <span className="text-2xl sm:text-3xl text-slate-500 font-sans ml-2">/ 10</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs text-amber-300 font-bold uppercase tracking-wider flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> CONTESTANT’S PREDICTION IS SEALED • AWAITING OPERATOR REVEAL
            </div>
          </div>
        ) : isJudging ? (
          /* ==========================================================
             STATE 2 — JUDGING IN PROGRESS
             ========================================================== */
          <div className="w-full max-w-2xl bg-black/70 border border-amber-500/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-md">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase border border-amber-500/30">
              <Shield className="w-4 h-4 animate-spin" /> JUDGE SCORING IN PROGRESS
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
              {currentPerf?.name || 'PERFORMER'}
            </h1>
            <p className="text-base text-amber-400 font-bold">{currentPerf?.act}</p>

            <div className="p-6 rounded-2xl bg-[#0f1222] border border-white/10 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                SCORES RECEIVED
              </span>
              <div className="text-5xl sm:text-6xl font-black font-mono text-white">
                {scoredCount} <span className="text-slate-600">/</span> {totalJudges}
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(scoredCount / totalJudges) * 100}%` }}
                ></div>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Judges are entering their scores on their private scorepads.
            </p>
          </div>
        ) : (
          /* ==========================================================
             STATE 1 — BEFORE SCORING / ON STAGE
             ========================================================== */
          <div className="w-full max-w-3xl bg-black/60 border border-amber-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-md">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
              ON STAGE NOW • ACT #{currentPerf?.running_order || 1}
            </span>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-7xl font-black text-white uppercase tracking-tight">
                {currentPerf?.name || 'WELCOME TO GGL'}
              </h1>
              <p className="text-xl sm:text-2xl text-amber-400 font-extrabold">
                {currentPerf?.act || 'LIVE PERFORMANCE'}
              </p>
            </div>

            {/* Voting QR for Audience */}
            <div className="p-4 rounded-2xl bg-[#0f1222] border border-white/10 max-w-sm mx-auto flex items-center justify-center gap-4">
              <div className="p-2 bg-white rounded-xl">
                <QrCode className="w-16 h-16 text-black" />
              </div>
              <div className="text-left">
                <span className="text-xs font-black text-amber-400 uppercase block">AUDIENCE VOTE</span>
                <span className="text-[11px] text-slate-300 block">Scan QR with phone camera</span>
                <span className="text-[10px] text-slate-500 font-mono block">or visit /vote</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM FOOTER: Sponsor Strip Marquee */}
      <footer className="relative z-10 border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
            OFFICIAL PARTNERS
          </span>
          <div className="flex items-center gap-6 overflow-x-auto py-1">
            {sponsors.map((s: any) => (
              <span key={s.id} className="text-xs font-black text-slate-300 uppercase tracking-wider whitespace-nowrap">
                {s.name}
              </span>
            ))}
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-mono">
          GORAKHPUR’S GOT LATENT • LIVE SCORING ENGINE
        </div>
      </footer>
    </div>
  );
}
