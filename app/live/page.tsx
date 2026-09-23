'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Play, Pause, RotateCcw, AlertTriangle, Shield, CheckCircle2, Lock, Unlock,
  Volume2, VolumeX, Eye, EyeOff, Award, Users, Mic2, Tv, ExternalLink,
  ChevronRight, Sparkles, RefreshCw, Radio, Settings, Copy, Check, Flame
} from 'lucide-react';
import { playSound, stopAllSounds } from '@/lib/soundboard';

export default function OperatorControlRoomPage() {
  const [activeTab, setActiveTab] = useState<'run' | 'performers' | 'judges' | 'soundboard' | 'sponsors' | 'history'>('run');
  const [liveData, setLiveData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [secretPredInput, setSecretPredInput] = useState('');
  const [localScores, setLocalScores] = useState<Record<string, string>>({});
  const [copiedPin, setCopiedPin] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New Performer Form
  const [newPerfName, setNewPerfName] = useState('');
  const [newPerfAct, setNewPerfAct] = useState('');
  const [newPerfPred, setNewPerfPred] = useState('');

  // Local Timer countdown state
  const [displaySeconds, setDisplaySeconds] = useState(180);

  // Poll state every 1.5 seconds for real-time synchronization
  const fetchLiveState = async () => {
    try {
      const res = await fetch('/api/live/state', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setLiveData(data);
        if (data.currentPerformer?.secret_prediction !== undefined && data.currentPerformer?.secret_prediction !== null) {
          setSecretPredInput(String(data.currentPerformer.secret_prediction));
        }
        // Update local score map from server scores
        const scoreMap: Record<string, string> = {};
        if (data.scores) {
          data.scores.forEach((s: any) => {
            scoreMap[s.judge_id] = String(s.score);
          });
        }
        setLocalScores(prev => ({ ...scoreMap, ...prev }));
      }
    } catch (err) {
      console.error('Failed to poll live state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveState();
    const interval = setInterval(fetchLiveState, 1500);
    return () => clearInterval(interval);
  }, []);

  // Timer countdown local ticker
  useEffect(() => {
    if (!liveData?.state) return;
    setDisplaySeconds(liveData.state.timer_seconds ?? 180);

    let timerInterval: any = null;
    if (liveData.state.timer_running === 1) {
      timerInterval = setInterval(() => {
        setDisplaySeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [liveData?.state?.timer_running, liveData?.state?.timer_seconds]);

  // Execute Operator Action API
  const handleOperatorAction = async (action: string, payload: any = {}) => {
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/live/operator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload })
      });
      const result = await res.json();
      if (!result.success) {
        setErrorMsg(result.error || 'Operation failed');
      } else {
        setSuccessMsg(`Action '${action}' executed successfully`);
        // If sound trigger exists
        if (action === 'REVEAL_RESULT' && result.result) {
          playSound(result.result === 'WINNER' ? 'WINNER' : 'SUSPENSE');
        }
        await fetchLiveState();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setActionLoading(false);
    }
  };

  // Save Secret Prediction
  const handleSavePrediction = () => {
    if (!liveData?.currentPerformer?.id) return;
    const val = parseFloat(secretPredInput);
    if (isNaN(val) || val < 0 || val > 10) {
      setErrorMsg('Prediction must be between 0.00 and 10.00');
      return;
    }
    handleOperatorAction('SET_PREDICTION', {
      performerId: liveData.currentPerformer.id,
      prediction: val
    });
  };

  // Submit direct judge score from operator
  const handleSetJudgeScore = (judgeId: string, val: string) => {
    setLocalScores(prev => ({ ...prev, [judgeId]: val }));
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 10 && liveData?.currentPerformer?.id) {
      handleOperatorAction('SET_JUDGE_SCORE', {
        performerId: liveData.currentPerformer.id,
        judgeId,
        score: num
      });
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyPin = (pin: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedPin(pin);
    setTimeout(() => setCopiedPin(null), 2000);
  };

  const state = liveData?.state || {};
  const currentPerf = liveData?.currentPerformer;
  const judges = liveData?.judges || [];
  const scores = liveData?.scores || [];
  const history = liveData?.history || [];
  const sponsors = liveData?.sponsors || [];
  const scoredCount = liveData?.scoredJudgesCount || 0;
  const totalJudges = liveData?.totalJudgesCount || 5;
  const isEmergencyBlank = state.emergency_blank === 1;
  const isJudgesOpen = state.judges_open === 1;
  const isAudienceOpen = state.audience_open === 1;
  const isScoresLocked = state.status === 'SCORES_LOCKED' || state.status === 'AVERAGE_CALCULATED' || state.status === 'RESULT_REVEALED';
  const isAverageCalculated = state.calculated_average !== null && state.calculated_average !== undefined;
  const isRevealed = state.reveal_status === 'REVEALED' && state.status === 'RESULT_REVEALED';

  // Calculate live diff & result preview for operator
  const currentAvg = isAverageCalculated ? Number(state.calculated_average) : null;
  const currentPred = currentPerf?.secret_prediction !== null && currentPerf?.secret_prediction !== undefined ? Number(currentPerf.secret_prediction) : null;
  const normalizedAvg = currentAvg !== null ? Math.round(currentAvg * 100) / 100 : null;
  const normalizedPred = currentPred !== null ? Math.round(currentPred * 100) / 100 : null;
  const liveDiff = normalizedAvg !== null && normalizedPred !== null ? Math.round(Math.abs(normalizedAvg - normalizedPred) * 100) / 100 : null;
  const isWinner = liveDiff !== null && liveDiff === 0;

  return (
    <div className="min-h-screen bg-[#07080e] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black font-sans">
      {/* 1. TOP LIVE STATUS BAR */}
      <header className="bg-[#0c0e17] border-b border-amber-500/20 sticky top-0 z-50 shadow-2xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* GGL Branding & Live Pulse */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-black text-sm shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                GGL
              </div>
              <div>
                <span className="font-black text-sm text-white tracking-wider group-hover:text-amber-400 transition-colors">
                  GORAKHPUR’S GOT LATENT
                </span>
                <span className="block text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                  LIVE CONTROL ROOM
                </span>
              </div>
            </Link>

            {/* LIVE Badge */}
            <div className={`px-2.5 py-1 rounded-md text-xs font-black uppercase flex items-center gap-1.5 shadow-md ${
              isEmergencyBlank ? 'bg-red-600/20 text-red-400 border border-red-500/40 animate-pulse' : 'bg-red-600 text-white'
            }`}>
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              {isEmergencyBlank ? 'BLANK SCREEN ACTIVE' : 'ON AIR LIVE'}
            </div>
          </div>

          {/* Top Quick Links */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('run')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'run' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Radio className="w-3.5 h-3.5" /> Run Show
            </button>
            <button
              onClick={() => setActiveTab('performers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'performers' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Mic2 className="w-3.5 h-3.5" /> Performers ({liveData?.performers?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('judges')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'judges' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Judges ({judges.length})
            </button>
            <button
              onClick={() => setActiveTab('soundboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'soundboard' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" /> Soundboard
            </button>
            <button
              onClick={() => setActiveTab('sponsors')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'sponsors' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Award className="w-3.5 h-3.5" /> Sponsors
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'history' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> History ({history.length})
            </button>

            {/* External Links */}
            <div className="h-4 w-px bg-white/10 mx-1"></div>
            <Link
              href="/display"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Tv className="w-3.5 h-3.5" /> Open Display <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/judge"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" /> Judge Pad <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/malik"
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center gap-1 transition-all"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </header>

      {/* 2. LIVE SHOW OPERATOR TOOLBAR (Timer, Emergency Blank, Judges Toggle) */}
      <div className="bg-[#101322] border-b border-amber-500/15 py-3 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Live Timer Display & Controls */}
          <div className="flex items-center gap-3">
            <div className="bg-black/60 border border-amber-500/40 rounded-xl px-4 py-2 flex items-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <span className="text-[11px] font-black uppercase text-amber-400 tracking-widest">ACT TIMER</span>
              <span className={`text-2xl font-mono font-black ${displaySeconds <= 30 && displaySeconds > 0 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                {formatTimer(displaySeconds)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {state.timer_running === 1 ? (
                <button
                  onClick={() => handleOperatorAction('PAUSE_TIMER', { remainingSeconds: displaySeconds })}
                  className="px-3 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs flex items-center gap-1.5 hover:bg-amber-400 shadow-md"
                  title="Pause Timer"
                >
                  <Pause className="w-4 h-4" /> Pause
                </button>
              ) : (
                <button
                  onClick={() => handleOperatorAction('START_TIMER')}
                  className="px-3 py-2 rounded-xl bg-emerald-500 text-black font-extrabold text-xs flex items-center gap-1.5 hover:bg-emerald-400 shadow-md"
                  title="Start Timer"
                >
                  <Play className="w-4 h-4" /> Start
                </button>
              )}
              <button
                onClick={() => handleOperatorAction('RESET_TIMER', { seconds: 180 })}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs flex items-center gap-1 border border-white/5"
                title="Reset to 3:00"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="hidden sm:flex items-center gap-1">
                {[60, 120, 180, 300].map(s => (
                  <button
                    key={s}
                    onClick={() => handleOperatorAction('RESET_TIMER', { seconds: s })}
                    className="px-2 py-1 rounded bg-black/40 text-[10px] text-slate-400 hover:text-amber-400 border border-white/5"
                  >
                    {s / 60}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Judges & Audience Access Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOperatorAction('TOGGLE_JUDGES_OPEN')}
              className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all border ${
                isJudgesOpen
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'bg-red-500/20 text-red-300 border-red-500/40'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>JUDGES: {isJudgesOpen ? 'OPEN' : 'LOCKED'}</span>
            </button>

            <button
              onClick={() => handleOperatorAction('TOGGLE_AUDIENCE_OPEN')}
              className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all border ${
                isAudienceOpen
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                  : 'bg-slate-800 text-slate-400 border-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>AUDIENCE: {isAudienceOpen ? 'VOTING OPEN' : 'CLOSED'}</span>
            </button>
          </div>

          {/* EMERGENCY BLANK - High-contrast, large button */}
          <button
            onClick={() => handleOperatorAction('TOGGLE_EMERGENCY_BLANK')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xl transition-all border ${
              isEmergencyBlank
                ? 'bg-red-600 text-white border-red-400 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.7)]'
                : 'bg-red-950/80 hover:bg-red-900 text-red-300 border-red-700/60'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{isEmergencyBlank ? 'DISABLE EMERGENCY BLANK' : 'EMERGENCY BLANK'}</span>
          </button>
        </div>
      </div>

      {/* Global Alerts / Messages */}
      {errorMsg && (
        <div className="bg-red-500/20 border-b border-red-500/40 text-red-300 text-xs px-4 py-2 text-center font-bold flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" /> {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 text-xs px-4 py-2 text-center font-bold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {successMsg}
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {activeTab === 'run' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: CURRENT ACT & SECRET PREDICTION (4 COLS) */}
            <div className="lg:col-span-4 space-y-6">
              {/* CURRENT ACT CARD */}
              <div className="bg-[#0f111c] border border-amber-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-500/20 border-b border-l border-amber-500/30 rounded-bl-2xl text-[10px] font-black uppercase text-amber-300 tracking-wider">
                  CURRENT ACT ON STAGE
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                      {currentPerf?.photo_url ? (
                        <img src={currentPerf.photo_url} alt={currentPerf.name} className="w-full h-full object-cover" />
                      ) : (
                        <Mic2 className="w-8 h-8 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                        ACT #{currentPerf?.running_order || 1}
                      </span>
                      <h2 className="text-2xl font-black text-white leading-tight">
                        {currentPerf?.name || 'No Act Selected'}
                      </h2>
                      <p className="text-xs text-slate-300 font-semibold mt-0.5">
                        Category: <strong className="text-amber-300">{currentPerf?.act || 'N/A'}</strong>
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-slate-300 uppercase">
                        Status: <span className="text-amber-400">{state.status || 'READY'}</span>
                      </div>
                    </div>
                  </div>

                  {/* CONTESTANT'S SECRET PREDICTION SECTION */}
                  <div className="bg-black/60 rounded-2xl p-4 border border-amber-500/40 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                          CONTESTANT’S SECRET PREDICTION
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-extrabold uppercase border border-red-500/30">
                        {isRevealed ? 'REVEALED' : 'HIDDEN FROM PUBLIC'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="10"
                          value={secretPredInput}
                          onChange={e => setSecretPredInput(e.target.value)}
                          placeholder="e.g. 7.60"
                          className="w-full bg-[#151828] border border-amber-500/50 rounded-xl px-3 py-2.5 text-lg font-mono font-black text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-600"
                        />
                        <span className="absolute right-3 top-3 text-xs text-slate-400 font-bold">/ 10</span>
                      </div>
                      <button
                        onClick={handleSavePrediction}
                        disabled={actionLoading}
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-md transition-all shrink-0"
                      >
                        SAVE
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      ⚠️ Stored secretly in DB. Strictly masked from Public Display and Judge devices until official reveal.
                    </p>
                  </div>

                  {/* Act Controls */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleOperatorAction('RESET_ACT', { performerId: currentPerf?.id })}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10 transition-colors"
                    >
                      Reset Act Scores
                    </button>
                    <button
                      onClick={() => handleOperatorAction('NEXT_ACT', { currentPerformerId: currentPerf?.id })}
                      className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/30 transition-colors flex items-center justify-center gap-1"
                    >
                      Next Act <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* AUDIENCE VOTE MONITOR (Separate from judge average) */}
              <div className="bg-[#0f111c] border border-white/10 rounded-3xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                      LIVE AUDIENCE VOTES
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-400">SEPARATE TALLY</span>
                </div>
                <div className="flex items-baseline justify-between bg-black/40 p-4 rounded-2xl border border-white/5">
                  <span className="text-3xl font-black text-white font-mono">
                    {liveData?.audienceVoteCount?.toLocaleString() || 0}
                  </span>
                  <span className="text-xs text-slate-400">Total verified audience votes</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Voting Link: <strong className="text-amber-400">/vote</strong></span>
                  <Link href="/vote" target="_blank" className="text-blue-400 hover:underline flex items-center gap-1">
                    Open Vote Page <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* CENTER COLUMN: 5-JUDGE SCORING & CALCULATION ENGINE (5 COLS) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0f111c] border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-400" /> JUDGE SCORES
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      5 Judges • Individual private PIN input • Scale: 0.00 – 10.00
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
                    scoredCount === totalJudges
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {scoredCount} / {totalJudges} JUDGES SCORED
                  </span>
                </div>

                {/* 5 Judges Scoring Inputs */}
                <div className="space-y-3">
                  {judges.map((judge: any, idx: number) => {
                    const currentScore = localScores[judge.id] || '';
                    const isSubmitted = currentScore !== '' && currentScore !== undefined;

                    return (
                      <div
                        key={judge.id}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                          isSubmitted
                            ? 'bg-[#141829] border-amber-500/40 shadow-sm'
                            : 'bg-black/30 border-white/5 opacity-80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/30">
                            J{judge.slot_number || idx + 1}
                          </div>
                          <div>
                            <div className="font-extrabold text-sm text-white flex items-center gap-2">
                              {judge.name}
                              {isSubmitted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">PIN: {judge.pin || '••••'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            disabled={isScoresLocked}
                            value={currentScore}
                            onChange={e => handleSetJudgeScore(judge.id, e.target.value)}
                            placeholder="0-10"
                            className="w-20 bg-black/60 border border-amber-500/40 rounded-xl px-3 py-2 text-center text-base font-mono font-black text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
                          />
                          <span className="text-xs text-slate-400 font-bold">/10</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Lock / Unlock Judge Scores Action */}
                <div className="pt-1">
                  {isScoresLocked ? (
                    <button
                      onClick={() => handleOperatorAction('UNLOCK_SCORES', { performerId: currentPerf?.id })}
                      className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-colors"
                    >
                      <Unlock className="w-4 h-4 text-amber-400" /> SCORES LOCKED (CLICK TO RE-OPEN EDITING)
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOperatorAction('LOCK_SCORES', { performerId: currentPerf?.id })}
                      className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-600 transition-colors"
                    >
                      <Lock className="w-4 h-4 text-slate-400" /> LOCK JUDGE SCORES
                    </button>
                  )}
                </div>

                {/* ==================================================
                    CALCULATE AVERAGE & DRAMATIC REVEAL ENGINE
                    ================================================== */}
                <div className="p-5 rounded-2xl bg-black/60 border border-amber-500/40 space-y-4 shadow-inner">
                  {/* Step 1: CALCULATE AVERAGE BUTTON */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleOperatorAction('CALCULATE_AVERAGE', { performerId: currentPerf?.id, force: true })}
                      disabled={actionLoading || scoredCount < 1}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" /> CALCULATE AVERAGE
                    </button>

                    {scoredCount < totalJudges && (
                      <p className="text-[11px] text-amber-400/80 text-center font-semibold">
                        Notice: {scoredCount}/{totalJudges} judges have scored. All 5 recommended before calculating.
                      </p>
                    )}
                  </div>

                  {/* DISPLAY CALCULATED AVERAGE & PREDICTION STATUS */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-[#121524] border border-amber-500/30 text-center space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                        JUDGE AVERAGE
                      </span>
                      <div className="text-2xl font-black font-mono text-amber-400">
                        {isAverageCalculated ? `${Number(state.calculated_average).toFixed(2)} / 10` : '— —'}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#121524] border border-amber-500/30 text-center space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                        CONTESTANT PREDICTION
                      </span>
                      <div className="text-2xl font-black font-mono text-white">
                        {isRevealed
                          ? Number(currentPerf?.secret_prediction ?? 0).toFixed(2)
                          : isAverageCalculated
                          ? 'HIDDEN'
                          : '— —'}
                      </div>
                    </div>
                  </div>

                  {/* Step 2: REVEAL RESULT BUTTON */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleOperatorAction('REVEAL_RESULT', { performerId: currentPerf?.id })}
                      disabled={actionLoading || !isAverageCalculated}
                      className={`w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-2 ${
                        isRevealed
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/30'
                          : isAverageCalculated
                          ? 'bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white animate-pulse shadow-amber-500/30'
                          : 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
                      }`}
                    >
                      <Flame className="w-5 h-5 text-amber-300" />
                      <span>{isRevealed ? 'RESULT REVEALED (RE-TRIGGER)' : 'REVEAL RESULT'}</span>
                    </button>
                  </div>

                  {/* REVEAL BREAKDOWN (Average, Prediction, Difference, Winner/Not a match) */}
                  {isRevealed && (
                    <div className="p-4 rounded-2xl bg-[#0c1322] border-2 border-amber-500 space-y-3 animate-fade-in shadow-2xl">
                      <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                        <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                          OFFICIAL LIVE RESULT
                        </span>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                          isWinner ? 'bg-emerald-500 text-black' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {isWinner ? 'WINNER 🎉' : 'NOT A MATCH'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-slate-400 block font-bold">AVERAGE</span>
                          <span className="text-lg font-black font-mono text-amber-400">
                            {normalizedAvg !== null ? normalizedAvg.toFixed(2) : '0.00'}
                          </span>
                        </div>
                        <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-slate-400 block font-bold">PREDICTION</span>
                          <span className="text-lg font-black font-mono text-white">
                            {normalizedPred !== null ? normalizedPred.toFixed(2) : '0.00'}
                          </span>
                        </div>
                        <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] text-slate-400 block font-bold">DIFFERENCE</span>
                          <span className="text-lg font-black font-mono text-amber-300">
                            {liveDiff !== null ? liveDiff.toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>

                      <div className={`p-3 rounded-xl text-center font-black text-sm uppercase tracking-wider ${
                        isWinner ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/10 text-red-300 border border-red-500/30'
                      }`}>
                        {isWinner
                          ? 'EXACT MATCH! CONTESTANT WINS GGL AWARD!'
                          : `DIFFERENCE ${liveDiff?.toFixed(2)} — NOT A MATCH`}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: LIVE PUBLIC DISPLAY PREVIEW & CONTROLS (3 COLS) */}
            <div className="lg:col-span-3 space-y-6">
              {/* DISPLAY MONITOR PREVIEW */}
              <div className="bg-[#0f111c] border border-white/10 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Tv className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black uppercase text-white tracking-wider">
                      DISPLAY PREVIEW
                    </span>
                  </div>
                  <Link
                    href="/display"
                    target="_blank"
                    className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    Open Fullscreen <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* Simulated Screen */}
                <div className="w-full aspect-video bg-black rounded-2xl border border-amber-500/40 relative overflow-hidden flex flex-col justify-between p-3 shadow-inner">
                  {isEmergencyBlank ? (
                    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-2 text-center">
                      <span className="text-xs font-black text-red-500 animate-pulse">EMERGENCY BLANK SCREEN</span>
                      <span className="text-[10px] text-slate-500 mt-1">GGL Standby Screen Active</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-black text-amber-400">GGL LIVE</span>
                        <span className="font-mono text-white font-bold">{formatTimer(displaySeconds)}</span>
                      </div>

                      <div className="text-center space-y-1">
                        <div className="text-xs font-black text-white truncate">{currentPerf?.name || 'Act'}</div>
                        <div className="text-[9px] text-amber-300 font-semibold">{currentPerf?.act || 'Comedy'}</div>

                        {/* Display State Preview */}
                        {isRevealed ? (
                          <div className={`mt-1 px-2 py-0.5 rounded text-[10px] font-black ${
                            isWinner ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'
                          }`}>
                            {isWinner ? 'WINNER: 7.60' : `DIFF: ${liveDiff?.toFixed(2)}`}
                          </div>
                        ) : isAverageCalculated ? (
                          <div className="mt-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                            AVG: {Number(state.calculated_average).toFixed(2)} / 10
                          </div>
                        ) : (
                          <div className="text-[9px] text-slate-400">
                            {state.status === 'JUDGING' ? `${scoredCount}/5 Scored` : 'On Stage'}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[8px] text-slate-500 border-t border-white/10 pt-1">
                        <span>Sponsors Active</span>
                        <span>QR Vote Ready</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 leading-relaxed">
                  Projector / LED feed automatically switches between Before Scoring, Judging, Average, Dramatic Reveal, and Emergency Blank.
                </div>
              </div>

              {/* QUICK SOUNDBOARD MINI STRIP */}
              <div className="bg-[#0f111c] border border-white/10 rounded-3xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase text-white tracking-wider">
                      QUICK SOUNDS
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      stopAllSounds();
                      handleOperatorAction('TRIGGER_SOUND', { sound: 'STOP' });
                    }}
                    className="text-[10px] font-extrabold text-red-400 hover:text-red-300 uppercase px-2 py-0.5 bg-red-500/10 rounded"
                  >
                    STOP ALL
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Theme', sound: 'THEME', color: 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' },
                    { label: 'Fanfare', sound: 'ENTRY', color: 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' },
                    { label: 'Applause', sound: 'APPLAUSE', color: 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' },
                    { label: 'Suspense', sound: 'SUSPENSE', color: 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' },
                    { label: 'Laugh', sound: 'LAUGH', color: 'bg-pink-500/20 text-pink-300 hover:bg-pink-500/30' },
                    { label: 'Winner!', sound: 'WINNER', color: 'bg-emerald-600 text-white hover:bg-emerald-500' }
                  ].map(s => (
                    <button
                      key={s.sound}
                      onClick={() => {
                        playSound(s.sound as any);
                        handleOperatorAction('TRIGGER_SOUND', { sound: s.sound });
                      }}
                      className={`p-2.5 rounded-xl font-bold text-xs transition-all text-center ${s.color}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PERFORMERS & RUNNING ORDER */}
        {activeTab === 'performers' && (
          <div className="space-y-6">
            <div className="bg-[#0f111c] border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Mic2 className="w-5 h-5 text-amber-400" /> Running Order & Contestants
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Order of acts for the live show. Move act to stage, set secret prediction, manage statuses.
                  </p>
                </div>
              </div>

              {/* Performers Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Performer</th>
                      <th className="py-3 px-4">Act Category</th>
                      <th className="py-3 px-4">Secret Prediction</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(liveData?.performers || []).map((p: any) => {
                      const isCurrent = p.id === currentPerf?.id;
                      return (
                        <tr
                          key={p.id}
                          className={`hover:bg-white/5 transition-colors ${
                            isCurrent ? 'bg-amber-500/10 font-bold' : ''
                          }`}
                        >
                          <td className="py-3 px-4 font-mono text-amber-400">#{p.running_order}</td>
                          <td className="py-3 px-4">
                            <div className="font-extrabold text-white text-sm">{p.name}</div>
                            {isCurrent && (
                              <span className="inline-block mt-0.5 text-[9px] px-2 py-0.5 bg-amber-500 text-black rounded font-black">
                                ON STAGE NOW
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-300">{p.act}</td>
                          <td className="py-3 px-4 font-mono font-bold text-amber-400">
                            {p.secret_prediction !== null && p.secret_prediction !== undefined
                              ? `${Number(p.secret_prediction).toFixed(2)} / 10`
                              : 'Not Set'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-white/10 text-slate-300">
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            {!isCurrent && (
                              <button
                                onClick={() => handleOperatorAction('SET_PERFORMER', { performerId: p.id })}
                                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-sm transition-all"
                              >
                                Set on Stage
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Add New Performer Form */}
              <div className="bg-black/40 p-5 rounded-2xl border border-white/10 space-y-4">
                <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider">
                  Add Performer to Live Queue
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="Performer Full Name"
                    value={newPerfName}
                    onChange={e => setNewPerfName(e.target.value)}
                    className="bg-[#151828] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Act Category (e.g. Comedy, Beatboxing)"
                    value={newPerfAct}
                    onChange={e => setNewPerfAct(e.target.value)}
                    className="bg-[#151828] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Secret Prediction (0-10)"
                    value={newPerfPred}
                    onChange={e => setNewPerfPred(e.target.value)}
                    className="bg-[#151828] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                  <button
                    onClick={() => {
                      if (!newPerfName || !newPerfAct) return;
                      handleOperatorAction('ADD_PERFORMER', {
                        name: newPerfName,
                        act: newPerfAct,
                        secretPrediction: newPerfPred
                      });
                      setNewPerfName('');
                      setNewPerfAct('');
                      setNewPerfPred('');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-md"
                  >
                    Add Contestant
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: JUDGES CREDENTIALS & PIN MANAGEMENT */}
        {activeTab === 'judges' && (
          <div className="space-y-6">
            <div className="bg-[#0f111c] border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-400" /> Judge Access & Private PINs
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Share individual PINs with judges. Each judge uses their private PIN at <strong className="text-amber-400">/judge</strong> to submit scores from their phone/tablet.
                  </p>
                </div>
                <Link
                  href="/judge"
                  target="_blank"
                  className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 font-extrabold text-xs flex items-center gap-2 hover:bg-purple-500/30"
                >
                  <ExternalLink className="w-4 h-4" /> Open Judge Pad
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {judges.map((judge: any, idx: number) => (
                  <div
                    key={judge.id}
                    className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 relative group hover:border-amber-500/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded border border-amber-500/30">
                        JUDGE SEAT #{judge.slot_number || idx + 1}
                      </span>
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-white">{judge.name}</h4>

                    <div className="p-3 rounded-xl bg-[#121524] border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">PRIVATE PIN</span>
                        <span className="text-xl font-mono font-black text-amber-400 tracking-wider">
                          {judge.pin}
                        </span>
                      </div>
                      <button
                        onClick={() => copyPin(judge.pin)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        {copiedPin === judge.pin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedPin === judge.pin ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-500">
                      Login URL: <code className="text-slate-400">/judge?pin={judge.pin}</code>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FULL SOUNDBOARD */}
        {activeTab === 'soundboard' && (
          <div className="space-y-6">
            <div className="bg-[#0f111c] border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-amber-400" /> GGL Live Soundboard
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live entertainment sound cues, fanfare, suspense rolls, laughter, applause, and winner cues.
                  </p>
                </div>
                <button
                  onClick={() => {
                    stopAllSounds();
                    handleOperatorAction('TRIGGER_SOUND', { sound: 'STOP' });
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  <VolumeX className="w-4 h-4" /> STOP ALL SOUNDS
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { name: 'THEME', label: 'Show Theme', icon: Sparkles, color: 'from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600' },
                  { name: 'ENTRY', label: 'Entry Fanfare', icon: Play, color: 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600' },
                  { name: 'APPLAUSE', label: 'Crowd Applause', icon: Users, color: 'from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600' },
                  { name: 'SUSPENSE', label: 'Suspense Drum', icon: Flame, color: 'from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600' },
                  { name: 'LAUGH', label: 'Comedy Rimshot', icon: Mic2, color: 'from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600' },
                  { name: 'WINNER', label: 'Winner Celebration', icon: Award, color: 'from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black' }
                ].map(item => (
                  <button
                    key={item.name}
                    onClick={() => {
                      playSound(item.name as any);
                      handleOperatorAction('TRIGGER_SOUND', { sound: item.name });
                    }}
                    className={`p-6 rounded-2xl bg-gradient-to-br ${item.color} flex flex-col items-center justify-center gap-3 shadow-xl transition-all transform active:scale-95 group`}
                  >
                    <item.icon className="w-8 h-8 opacity-90 group-hover:scale-110 transition-transform" />
                    <span className="font-black text-sm tracking-wider uppercase">{item.name}</span>
                    <span className="text-[10px] opacity-75">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SPONSORS & PRIZES */}
        {activeTab === 'sponsors' && (
          <div className="space-y-6">
            <div className="bg-[#0f111c] border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" /> Sponsors & Stage Branding
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Brands appearing on the live projector / LED sponsor strip during performances.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {sponsors.map((s: any) => (
                  <div key={s.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <span className="text-[9px] px-2 py-0.5 rounded font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {s.tier} PARTNER
                    </span>
                    <h4 className="text-base font-black text-white">{s.name}</h4>
                    <p className="text-xs text-slate-400">{s.tagline}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SHOW HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-[#0f111c] border border-amber-500/30 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" /> Completed Acts & Historical Scores
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Permanent record of judge scores, contestant predictions, mathematical differences, and official outcomes.
                </p>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No completed acts recorded yet. Reveal results for an act to log it here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Performer</th>
                        <th className="py-3 px-4">Act Category</th>
                        <th className="py-3 px-4">Judge Average</th>
                        <th className="py-3 px-4">Secret Prediction</th>
                        <th className="py-3 px-4">Difference</th>
                        <th className="py-3 px-4">Result</th>
                        <th className="py-3 px-4">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {history.map((h: any) => (
                        <tr key={h.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-black text-white">{h.performer_name}</td>
                          <td className="py-3 px-4 text-slate-300">{h.act}</td>
                          <td className="py-3 px-4 font-mono font-black text-amber-400">{Number(h.judge_average).toFixed(2)}</td>
                          <td className="py-3 px-4 font-mono font-black text-white">{Number(h.contestant_prediction).toFixed(2)}</td>
                          <td className="py-3 px-4 font-mono font-bold text-amber-300">{Number(h.difference).toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${
                              h.result === 'WINNER'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                              {h.result}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-mono text-[10px]">
                            {new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
