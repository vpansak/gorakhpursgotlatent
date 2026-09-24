'use client';

import React, { useState, useId } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Bot,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  ChevronRight,
  Calculator,
} from 'lucide-react';

interface PanelMember {
  id: string;
  name: string;
}

const PANEL_MEMBERS: PanelMember[] = [
  { id: 'brijesh_birju', name: 'BRIJESH BIRJU' },
  { id: 'somya', name: 'SOMYA' },
  { id: 'naveen_varma', name: 'NAVEEN VARMA' },
  { id: 'ananya_gupta', name: 'ANANYA GUPTA' },
  { id: 'vivek_gupta', name: 'VIVEK GUPTA' },
];

/**
 * Rounds a number to the nearest 0.5 mathematically.
 * Examples:
 * 6.24 -> 6
 * 6.25 -> 6.5
 * 6.74 -> 6.5
 * 6.75 -> 7
 * 7.8  -> 8
 */
function roundToNearestHalf(val: number): number {
  return Math.round(val * 2) / 2;
}

/**
 * Formats a score cleanly without floating-point artifacts.
 * e.g., 8 -> "8", 7.5 -> "7.5"
 */
function formatScore(val: number): string {
  // Check if it's an integer or has decimal
  return Number.isInteger(val) ? val.toString() : val.toFixed(1);
}

/**
 * Validates whether a string value is a valid contestant score (1 to 10 in 0.5 increments).
 */
function isValidContestantScore(val: string): boolean {
  if (!val || val.trim() === '') return false;
  const num = Number(val.trim());
  if (isNaN(num)) return false;
  if (num < 1 || num > 10) return false;
  // Check 0.5 increments: num * 2 should be an integer within floating point tolerance
  const doubled = num * 2;
  return Math.abs(Math.round(doubled) - doubled) < 1e-7;
}

export default function ComputerJiPage() {
  // Panel scores: 5 independent inputs initialized to empty strings
  const [panelScores, setPanelScores] = useState<Record<string, string>>({
    brijesh_birju: '',
    somya: '',
    naveen_varma: '',
    ananya_gupta: '',
    vivek_gupta: '',
  });

  // Computer Ji calculated average (rounded to nearest 0.5)
  const [computerJiAverage, setComputerJiAverage] = useState<number | null>(null);

  // Contestant score input
  const [contestantInput, setContestantInput] = useState<string>('');

  // Reveal state
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  // Validation messages
  const [panelError, setPanelError] = useState<string | null>(null);
  const [contestantError, setContestantError] = useState<string | null>(null);

  // Reset confirmation modal state
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  // Handle panel score change
  const handlePanelScoreChange = (id: string, value: string) => {
    // Clear previous error
    setPanelError(null);

    // If result was already calculated/revealed, changing a panel score resets downstream calculations
    if (computerJiAverage !== null || isRevealed) {
      setComputerJiAverage(null);
      setIsRevealed(false);
    }

    setPanelScores((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Check if all 5 panel scores are filled & valid numbers
  const areAllPanelScoresFilled = PANEL_MEMBERS.every((m) => {
    const val = panelScores[m.id]?.trim();
    return val !== '' && !isNaN(Number(val));
  });

  // Calculate Average
  const handleCalculateAverage = () => {
    setPanelError(null);

    // 1. Check if any score is missing
    const missing = PANEL_MEMBERS.some((m) => panelScores[m.id]?.trim() === '');
    if (missing) {
      setPanelError('Please enter all 5 panel scores.');
      return;
    }

    // 2. Validate range (1 to 10) and valid numbers
    const parsedValues: number[] = [];
    for (const m of PANEL_MEMBERS) {
      const raw = panelScores[m.id]?.trim();
      const num = Number(raw);
      if (isNaN(num) || num < 1 || num > 10) {
        setPanelError('Panel scores must be between 1 and 10.');
        return;
      }
      parsedValues.push(num);
    }

    // 3. Compute arithmetic mean
    const sum = parsedValues.reduce((acc, curr) => acc + curr, 0);
    const mean = sum / parsedValues.length;

    // 4. Round to nearest 0.5
    const rounded = roundToNearestHalf(mean);

    setComputerJiAverage(rounded);
    setIsRevealed(false); // Reset reveal if recalculating
  };

  // Handle Contestant Score Change
  const handleContestantChange = (val: string) => {
    setContestantError(null);
    setContestantInput(val);
    if (isRevealed) {
      setIsRevealed(false);
    }
  };

  // Reveal Result
  const handleRevealResult = () => {
    setContestantError(null);

    if (computerJiAverage === null) {
      return;
    }

    if (!contestantInput || contestantInput.trim() === '') {
      setContestantError('Please enter the contestant mark.');
      return;
    }

    if (!isValidContestantScore(contestantInput)) {
      setContestantError('Please enter a valid mark between 1 and 10 in 0.5 increments.');
      return;
    }

    const contestantNum = Number(contestantInput.trim());
    setIsRevealed(true);

    // Trigger subtle celebration if win
    if (contestantNum === computerJiAverage) {
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#FFD700', '#FFC107', '#FFA000', '#FFFFFF', '#EF4444'],
          disableForReducedMotion: true,
        });
      } catch (err) {
        // Fallback gracefully
      }
    }
  };

  // Reset Game
  const handleConfirmReset = () => {
    setPanelScores({
      brijesh_birju: '',
      somya: '',
      naveen_varma: '',
      ananya_gupta: '',
      vivek_gupta: '',
    });
    setComputerJiAverage(null);
    setContestantInput('');
    setIsRevealed(false);
    setPanelError(null);
    setContestantError(null);
    setShowResetModal(false);
  };

  const parsedContestant = Number(contestantInput.trim());
  const isContestantValid = isValidContestantScore(contestantInput);
  const isWin = isRevealed && computerJiAverage !== null && parsedContestant === computerJiAverage;

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-[#07080e] text-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 selection:bg-amber-500 selection:text-black">
      {/* Background Stage Atmosphere */}
      <div className="absolute inset-0 bg-radial from-amber-500/10 via-red-500/5 to-transparent pointer-events-none blur-3xl -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-stage-radial pointer-events-none opacity-40 -z-10" />

      {/* Main Container */}
      <div className="max-w-2xl w-full mx-auto space-y-8">
        {/* ==========================================================
            3. PAGE HEADER
            ========================================================== */}
        <header className="text-center space-y-3">
          {/* Subtle GGL Top Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-extrabold tracking-widest uppercase shadow-[0_0_15px_rgba(255,215,0,0.15)]">
            <Bot className="w-4 h-4 text-amber-400" />
            GORAKHPUR’S GOT LATENT
          </div>

          {/* Large Page Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bebas tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-amber-500 drop-shadow-[0_4px_25px_rgba(255,215,0,0.4)]">
            COMPUTER JI
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl font-medium text-amber-300/90 italic tracking-wide">
            “Let’s see what the numbers say…”
          </p>

          {/* Optional Small Supporting Text */}
          <p className="text-xs sm:text-sm text-slate-400 font-sans tracking-wide">
            Five panel scores. One final prediction.
          </p>
        </header>

        {/* ==========================================================
            4. PANEL MEMBER SECTION
            ========================================================== */}
        <section
          aria-labelledby="panel-scores-heading"
          className="rounded-3xl bg-[#0e111d]/90 border border-amber-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,215,0,0.15)] space-y-6"
        >
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
            <h2
              id="panel-scores-heading"
              className="text-xl sm:text-2xl font-bebas tracking-widest text-amber-400 flex items-center gap-2"
            >
              <Calculator className="w-5 h-5 text-amber-400" />
              PANEL SCORES
            </h2>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
              RANGE: 1 – 10
            </span>
          </div>

          {/* Exactly Five Rows */}
          <div className="space-y-3.5">
            {PANEL_MEMBERS.map((member, idx) => (
              <div
                key={member.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:p-3.5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-500/40 transition-all duration-200 focus-within:border-amber-500 focus-within:shadow-[0_0_15px_rgba(255,215,0,0.2)]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-xs font-black font-mono">
                    {idx + 1}
                  </span>
                  <label
                    htmlFor={`panel-${member.id}`}
                    className="text-sm sm:text-base font-bold tracking-wider text-slate-100 uppercase"
                  >
                    {member.name}
                  </label>
                </div>

                <div className="flex items-center justify-end">
                  <input
                    id={`panel-${member.id}`}
                    type="number"
                    step="any"
                    min="1"
                    max="10"
                    placeholder="SCORE"
                    value={panelScores[member.id]}
                    onChange={(e) => handlePanelScoreChange(member.id, e.target.value)}
                    className="w-full sm:w-32 px-4 py-2.5 rounded-xl bg-[#07080e] border border-amber-500/30 text-amber-300 font-mono text-center font-bold text-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-slate-600 placeholder:font-sans placeholder:text-xs"
                    aria-label={`Score for ${member.name}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Validation Error Message for Panel */}
          {panelError && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/60 text-red-300 text-sm font-semibold flex items-center gap-2.5 animate-in fade-in duration-200"
            >
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{panelError}</span>
            </div>
          )}

          {/* 6. CALCULATE AVERAGE BUTTON */}
          <div className="pt-2">
            <button
              type="button"
              id="btn-calculate-average"
              onClick={handleCalculateAverage}
              disabled={!areAllPanelScoresFilled}
              className={`w-full py-4 rounded-2xl font-bebas text-2xl tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                areAllPanelScoresFilled
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black font-black hover:brightness-110 active:scale-[0.99] shadow-[0_0_25px_rgba(255,215,0,0.35)] cursor-pointer'
                  : 'bg-slate-800/60 text-slate-500 border border-white/5 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              CALCULATE AVERAGE
            </button>
          </div>
        </section>

        {/* ==========================================================
            9. COMPUTER JI RESULT DISPLAY
            ========================================================== */}
        {computerJiAverage !== null && (
          <section
            aria-live="polite"
            className="rounded-3xl bg-gradient-to-b from-[#141829] to-[#0a0d16] border-2 border-amber-500/60 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(255,215,0,0.25)] text-center space-y-4 animate-in fade-in zoom-in-95 duration-300"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-widest">
              <Bot className="w-3.5 h-3.5" />
              OFFICIAL VERDICT
            </div>

            <h2 className="text-xl sm:text-2xl font-bebas tracking-widest text-slate-300 uppercase">
              COMPUTER JI AVERAGE
            </h2>

            <div className="py-2">
              <div className="inline-block px-8 py-4 rounded-2xl bg-black/60 border border-amber-500/40 shadow-inner">
                <span className="text-6xl sm:text-7xl font-mono font-black text-amber-400 tracking-tight drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                  {formatScore(computerJiAverage)}
                </span>
                <span className="text-2xl sm:text-3xl font-sans font-bold text-slate-500 ml-2">
                  / 10
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Arithmetic mean rounded to nearest 0.5
            </p>
          </section>
        )}

        {/* ==========================================================
            10. CONTESTANT INPUT SECTION
            ========================================================== */}
        {computerJiAverage !== null && (
          <section
            aria-labelledby="contestant-section-heading"
            className="rounded-3xl bg-[#0e111d]/90 border border-amber-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] space-y-6 animate-in fade-in duration-300"
          >
            <div className="border-b border-amber-500/20 pb-3 flex items-center justify-between">
              <h2
                id="contestant-section-heading"
                className="text-lg sm:text-xl font-bebas tracking-widest text-amber-400 uppercase flex items-center gap-2"
              >
                CONTESTANT PREDICTION
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10">
                0.5 INCREMENTS
              </span>
            </div>

            {/* Simple Contestant Row: CONTESTANT [ ? ] */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-black/50 border border-amber-500/30 focus-within:border-amber-400 focus-within:shadow-[0_0_20px_rgba(255,215,0,0.2)] transition-all">
              <div className="text-center sm:text-left">
                <label
                  htmlFor="contestant-mark-input"
                  className="text-lg sm:text-xl font-bebas tracking-widest text-white uppercase block"
                >
                  CONTESTANT
                </label>
                <span className="text-xs text-slate-400">
                  Enter prediction (1, 1.5, 2 ... 10)
                </span>
              </div>

              <div className="w-full sm:w-44 flex items-center justify-center">
                <input
                  id="contestant-mark-input"
                  type="number"
                  step="0.5"
                  min="1"
                  max="10"
                  placeholder="?"
                  value={contestantInput}
                  onChange={(e) => handleContestantChange(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-[#07080e] border border-amber-500/40 text-amber-400 font-mono text-center font-black text-2xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-slate-600 placeholder:text-2xl"
                  aria-label="Contestant score prediction"
                />
              </div>
            </div>

            {/* Validation Error Message for Contestant */}
            {contestantError && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/60 text-red-300 text-sm font-semibold flex items-center gap-2.5 animate-in fade-in duration-200"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{contestantError}</span>
              </div>
            )}

            {/* 12. REVEAL RESULT BUTTON */}
            <button
              type="button"
              id="btn-reveal-result"
              onClick={handleRevealResult}
              disabled={!isContestantValid}
              className={`w-full py-4 rounded-2xl font-bebas text-2xl tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                isContestantValid
                  ? 'bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-black font-black hover:brightness-110 active:scale-[0.99] shadow-[0_0_30px_rgba(239,68,68,0.4)] cursor-pointer'
                  : 'bg-slate-800/60 text-slate-500 border border-white/5 cursor-not-allowed'
              }`}
            >
              <Award className="w-5 h-5" />
              REVEAL RESULT
            </button>
          </section>
        )}

        {/* ==========================================================
            13 & 14. RESULT DISPLAY (WIN / LOSE)
            ========================================================== */}
        {isRevealed && computerJiAverage !== null && (
          <section
            aria-live="assertive"
            className={`rounded-3xl border-2 p-6 sm:p-8 text-center space-y-6 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-300 ${
              isWin
                ? 'bg-gradient-to-b from-[#0c1f17] to-[#06120e] border-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.35)]'
                : 'bg-gradient-to-b from-[#220d0f] to-[#120507] border-red-500 shadow-[0_0_60px_rgba(239,68,68,0.35)]'
            }`}
          >
            {/* Verdict Title */}
            {isWin ? (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-black uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  PERFECT PREDICTION
                </div>
                <h2 className="text-4xl sm:text-6xl font-bebas tracking-widest text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]">
                  🎉 YOU WIN!
                </h2>
                <p className="text-sm sm:text-base font-semibold text-emerald-200">
                  Your mark matches Computer Ji.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-black uppercase tracking-widest">
                  <XCircle className="w-4 h-4 text-red-400" />
                  MISMATCH
                </div>
                <h2 className="text-4xl sm:text-6xl font-bebas tracking-widest text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]">
                  ❌ BETTER LUCK NEXT TIME!
                </h2>
                <p className="text-sm sm:text-base font-semibold text-red-200">
                  Your prediction did not match Computer Ji.
                </p>
              </div>
            )}

            {/* Score Comparison Display */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
              {/* Computer Ji Score */}
              <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/40 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  COMPUTER JI
                </span>
                <div className="text-3xl sm:text-4xl font-mono font-black text-amber-400">
                  {formatScore(computerJiAverage)}
                  <span className="text-base font-sans text-slate-500 ml-1">/ 10</span>
                </div>
              </div>

              {/* Contestant Score */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/20 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  CONTESTANT
                </span>
                <div className="text-3xl sm:text-4xl font-mono font-black text-white">
                  {formatScore(parsedContestant)}
                  <span className="text-base font-sans text-slate-500 ml-1">/ 10</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==========================================================
            19. RESET GAME BUTTON & MODAL
            ========================================================== */}
        <div className="text-center pt-4">
          <button
            type="button"
            id="btn-reset-game"
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/40 hover:bg-amber-500/10 text-slate-400 hover:text-amber-400 font-semibold text-sm transition-all duration-200 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            RESET GAME
          </button>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-modal-title"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          >
            <div className="max-w-md w-full rounded-3xl bg-[#0e111d] border border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 text-amber-400">
                <RotateCcw className="w-6 h-6" />
                <h3 id="reset-modal-title" className="text-2xl font-bebas tracking-wider text-white">
                  RESET GAME
                </h3>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                Are you sure you want to reset this round? All panel scores and contestant predictions will be cleared.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-semibold text-sm transition-all"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  id="btn-confirm-reset"
                  onClick={handleConfirmReset}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                >
                  RESET
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Page Footer Note */}
      <footer className="mt-12 text-center text-xs text-slate-500 font-mono tracking-wider">
        GORAKHPUR’S GOT LATENT • COMPUTER JI SCORING CONSOLE
      </footer>
    </div>
  );
}
