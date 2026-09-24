'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Calculator,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Search,
  ChevronDown,
  User,
  Phone,
  Play,
  Pause,
  Download,
  Plus,
  Trash2,
  Clock,
  Check,
  Sliders,
  AlertOctagon,
  ArrowRight,
  Database,
} from 'lucide-react';

// ============================================================
// CONTESTANT LIST (Exact 23 Records)
// ============================================================
export interface Contestant {
  id: number;
  name: string;
  category: string;
  phone: string;
}

const CONTESTANTS_LIST: Contestant[] = [
  { id: 1, name: 'Abhay mishra', category: 'Stand up comedy', phone: '9026968581' },
  { id: 2, name: 'Love Maurya', category: 'Poetry', phone: '8173870600' },
  { id: 3, name: 'Vedant Triparhi', category: 'Dance', phone: '9648994400' },
  { id: 4, name: 'Kuldeep Kumar', category: 'Singing', phone: '8173040852' },
  { id: 5, name: 'Ayush jaiswal', category: 'Singing', phone: '7317438659' },
  { id: 6, name: 'Aryan kushwaha', category: 'Shayri', phone: '9670730687' },
  { id: 7, name: 'Alka patel', category: 'Dance', phone: '919026839256' },
  { id: 8, name: 'Arpita singh', category: 'Dance', phone: '9792844219' },
  { id: 9, name: 'Aftab', category: 'Singing', phone: '7991789469' },
  { id: 10, name: 'Misthi Mishra', category: 'Dance', phone: '8299388799' },
  { id: 11, name: 'Kirti Gupta', category: 'Singing', phone: '9565865240' },
  { id: 12, name: 'Ashik Ansari', category: 'Poetry', phone: '9569639253' },
  { id: 13, name: 'Aradhya', category: 'Singing', phone: '7080718509' },
  { id: 14, name: 'Shraddha Pandey', category: 'Singing', phone: '7307468833' },
  { id: 15, name: 'Nandani Kumari', category: 'Dance', phone: '7052273166' },
  { id: 16, name: 'Himanshu bhatt', category: 'Poetry', phone: '8112585745' },
  { id: 17, name: 'MD Arman', category: 'Mimicry', phone: '+9779817455559' },
  { id: 18, name: 'rustam', category: 'dance', phone: '8545943855' },
  { id: 19, name: 'Kritika singh', category: 'Singing', phone: '8127421810' },
  { id: 20, name: 'Khushee madhyeshiya', category: 'Singing', phone: '9336550642' },
  { id: 21, name: 'Kamya verma', category: 'Dance', phone: '9335477452' },
  { id: 22, name: 'Neha', category: 'Couple dance', phone: '7992159035' },
  { id: 23, name: 'Atul sharma', category: 'Dance', phone: '8604057703' },
];

export interface Judge {
  id: string;
  name: string;
  role?: string;
  isActive: boolean;
}

const DEFAULT_JUDGES: Judge[] = [
  { id: 'j_brijesh', name: 'BRIJESH BIRJU', role: 'Panel Judge', isActive: true },
  { id: 'j_somya', name: 'SOMYA', role: 'Panel Judge', isActive: true },
  { id: 'j_naveen', name: 'NAVEEN VARMA', role: 'Panel Judge', isActive: true },
  { id: 'j_ananya', name: 'ANANYA GUPTA', role: 'Panel Judge', isActive: true },
  { id: 'j_vivek', name: 'VIVEK GUPTA', role: 'Panel Judge', isActive: true },
];

const CORE_JUDGE_IDS = new Set(['j_brijesh', 'j_somya', 'j_naveen', 'j_ananya', 'j_vivek']);

export interface SavedScoringRecord {
  contestantId: number;
  contestantName: string;
  category: string;
  phone: string;
  judgeScores: Record<string, string>;
  rawAverage: number;
  roundedAverage: number;
  contestantScore: string;
  result: 'WIN' | 'LOSE' | null;
  status: 'COMPLETED';
  savedAt: string;
}

function roundToNearestHalf(val: number): number {
  return Math.round(val * 2) / 2;
}

function formatScore(val: number): string {
  return Number.isInteger(val) ? val.toString() : val.toFixed(1);
}

function isValidScore(val: string): boolean {
  if (!val || val.trim() === '') return false;
  const num = Number(val.trim());
  if (isNaN(num)) return false;
  if (num < 1 || num > 10) return false;
  const doubled = num * 2;
  return Math.abs(Math.round(doubled) - doubled) < 1e-7;
}

const STORAGE_KEY_SCORES = 'ggl_computerji_scores_v3';
const STORAGE_KEY_JUDGES = 'ggl_computerji_judges_v3';

export default function ComputerJiControlPanel() {
  // Judges & Contestants state
  const [judges, setJudges] = useState<Judge[]>(DEFAULT_JUDGES);
  const [selectedContestantId, setSelectedContestantId] = useState<number>(1);
  const [savedRecords, setSavedRecords] = useState<Record<number, SavedScoringRecord>>({});
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Active inputs for currently selected contestant
  const [judgeScores, setJudgeScores] = useState<Record<string, string>>({});
  const [computerJiAverage, setComputerJiAverage] = useState<number | null>(null);
  const [rawAverage, setRawAverage] = useState<number | null>(null);
  const [contestantScoreInput, setContestantScoreInput] = useState<string>('');
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [panelError, setPanelError] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<boolean>(false);

  // Modals
  const [showAddJudgeModal, setShowAddJudgeModal] = useState<boolean>(false);
  const [newJudgeName, setNewJudgeName] = useState<string>('');
  const [showResetAllModal, setShowResetAllModal] = useState<boolean>(false);

  // Contestant Dropdown Search
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 2-Minute Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(120);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedJudges = localStorage.getItem(STORAGE_KEY_JUDGES);
      if (storedJudges) {
        const parsed = JSON.parse(storedJudges);
        if (Array.isArray(parsed) && parsed.length >= 5) setJudges(parsed);
      }
      const storedRecords = localStorage.getItem(STORAGE_KEY_SCORES);
      if (storedRecords) {
        const parsed = JSON.parse(storedRecords);
        if (parsed && typeof parsed === 'object') {
          setSavedRecords(parsed);
          const keys = Object.keys(parsed);
          if (keys.length > 0) {
            const last = parsed[Number(keys[keys.length - 1])];
            if (last?.savedAt) setLastSavedTime(last.savedAt);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save judges to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_JUDGES, JSON.stringify(judges));
    } catch (e) {
      console.error(e);
    }
  }, [judges]);

  const saveRecordsToStorage = (records: Record<number, SavedScoringRecord>) => {
    try {
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(records));
    } catch (e) {
      console.error(e);
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentContestant = useMemo(() => {
    return CONTESTANTS_LIST.find((c) => c.id === selectedContestantId) || CONTESTANTS_LIST[0];
  }, [selectedContestantId]);

  const currentSavedRecord = savedRecords[selectedContestantId];
  const isCurrentCompleted = Boolean(currentSavedRecord);

  // Load contestant form
  const loadContestantForm = (contestantId: number) => {
    const existing = savedRecords[contestantId];
    if (existing) {
      setJudgeScores({ ...existing.judgeScores });
      setRawAverage(existing.rawAverage);
      setComputerJiAverage(existing.roundedAverage);
      setContestantScoreInput(existing.contestantScore || '');
      setIsRevealed(true);
    } else {
      const emptyScores: Record<string, string> = {};
      judges.forEach((j) => {
        emptyScores[j.id] = '';
      });
      setJudgeScores(emptyScores);
      setRawAverage(null);
      setComputerJiAverage(null);
      setContestantScoreInput('');
      setIsRevealed(false);
    }
    setPanelError(null);
    setSaveSuccessMsg(false);
    setTimerSeconds(120);
    setIsTimerRunning(false);
  };

  useEffect(() => {
    loadContestantForm(selectedContestantId);
  }, [selectedContestantId]);

  const filteredContestants = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return CONTESTANTS_LIST;
    return CONTESTANTS_LIST.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }, [searchQuery]);

  const handleJudgeScoreChange = (judgeId: string, val: string) => {
    setPanelError(null);
    setJudgeScores((prev) => ({ ...prev, [judgeId]: val }));
    if (computerJiAverage !== null || isRevealed) {
      setComputerJiAverage(null);
      setRawAverage(null);
      setIsRevealed(false);
    }
  };

  const activeJudges = useMemo(() => judges.filter((j) => j.isActive), [judges]);

  // Calculate Average
  const handleCalculateAverage = () => {
    setPanelError(null);
    const missing = activeJudges.filter((j) => {
      const val = judgeScores[j.id]?.trim();
      return val === undefined || val === '' || isNaN(Number(val));
    });

    if (missing.length > 0) {
      setPanelError('Please enter scores for all active judges.');
      return;
    }

    const parsed: number[] = [];
    for (const j of activeJudges) {
      const val = Number(judgeScores[j.id]?.trim());
      if (val < 1 || val > 10) {
        setPanelError('Scores must be between 1 and 10.');
        return;
      }
      parsed.push(val);
    }

    const sum = parsed.reduce((acc, curr) => acc + curr, 0);
    const mean = sum / parsed.length;
    const rounded = roundToNearestHalf(mean);

    setRawAverage(mean);
    setComputerJiAverage(rounded);
    setIsRevealed(false);
  };

  // Reveal Report
  const handleReveal = () => {
    setPanelError(null);
    if (computerJiAverage === null) {
      handleCalculateAverage();
    }
    if (!contestantScoreInput || !isValidScore(contestantScoreInput)) {
      setPanelError('Please enter a valid contestant score (1-10 in 0.5 steps).');
      return;
    }
    setIsRevealed(true);

    const contNum = Number(contestantScoreInput.trim());
    if (computerJiAverage !== null && contNum === computerJiAverage) {
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFC107', '#FFA000', '#FFFFFF', '#EF4444'],
          disableForReducedMotion: true,
        });
      } catch (err) {}
    }
  };

  // Save Score & Proceed to Next Contestant
  const handleSaveAndNext = (advanceToNext: boolean = false) => {
    setPanelError(null);

    const missing = activeJudges.filter((j) => {
      const val = judgeScores[j.id]?.trim();
      return val === undefined || val === '' || isNaN(Number(val));
    });

    if (missing.length > 0) {
      setPanelError('Please enter scores for all active judges.');
      return;
    }

    let calculatedRaw = rawAverage;
    let calculatedRounded = computerJiAverage;
    if (calculatedRounded === null) {
      const parsed = activeJudges.map((j) => Number(judgeScores[j.id].trim()));
      const sum = parsed.reduce((acc, curr) => acc + curr, 0);
      calculatedRaw = sum / parsed.length;
      calculatedRounded = roundToNearestHalf(calculatedRaw);
      setRawAverage(calculatedRaw);
      setComputerJiAverage(calculatedRounded);
    }

    let result: 'WIN' | 'LOSE' | null = null;
    if (contestantScoreInput && isValidScore(contestantScoreInput)) {
      const pred = Number(contestantScoreInput.trim());
      result = pred === calculatedRounded ? 'WIN' : 'LOSE';
    }

    const nowTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const newRecord: SavedScoringRecord = {
      contestantId: currentContestant.id,
      contestantName: currentContestant.name,
      category: currentContestant.category,
      phone: currentContestant.phone,
      judgeScores: { ...judgeScores },
      rawAverage: Number(calculatedRaw?.toFixed(2) || 0),
      roundedAverage: calculatedRounded || 0,
      contestantScore: contestantScoreInput.trim(),
      result,
      status: 'COMPLETED',
      savedAt: nowTime,
    };

    const updated = {
      ...savedRecords,
      [currentContestant.id]: newRecord,
    };

    setSavedRecords(updated);
    saveRecordsToStorage(updated);
    setLastSavedTime(nowTime);
    setIsRevealed(true);
    setSaveSuccessMsg(true);

    setTimeout(() => setSaveSuccessMsg(false), 2500);

    if (advanceToNext) {
      // Find next pending contestant or next ID
      const nextPending = CONTESTANTS_LIST.find(
        (c) => c.id > currentContestant.id && !updated[c.id]
      ) || CONTESTANTS_LIST.find((c) => !updated[c.id]);

      if (nextPending) {
        setSelectedContestantId(nextPending.id);
      } else if (currentContestant.id < CONTESTANTS_LIST.length) {
        setSelectedContestantId(currentContestant.id + 1);
      }
    }
  };

  // Add Judge
  const handleAddJudge = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newJudgeName.trim().toUpperCase();
    if (!trimmed) return;
    const newId = `j_${Date.now()}`;
    const newJudge: Judge = { id: newId, name: trimmed, isActive: true };
    setJudges([...judges, newJudge]);
    setJudgeScores((prev) => ({ ...prev, [newId]: '' }));
    setNewJudgeName('');
    setShowAddJudgeModal(false);
  };

  // Delete Additional Judge
  const handleDeleteJudge = (judgeId: string) => {
    if (CORE_JUDGE_IDS.has(judgeId)) return;
    const updated = judges.filter((j) => j.id !== judgeId);
    setJudges(updated);
    setJudgeScores((prev) => {
      const copy = { ...prev };
      delete copy[judgeId];
      return copy;
    });
  };

  // Export CSV/Excel
  const handleExportExcel = () => {
    const list = Object.values(savedRecords);
    if (list.length === 0) {
      alert('No saved scoring data to export yet.');
      return;
    }
    const judgeHeaders = judges.map((j) => `"${j.name} Score"`);
    const headers = [
      'Serial Number',
      'Contestant Name',
      'Category',
      'Phone',
      ...judgeHeaders,
      'Raw Average',
      'Rounded Average',
      'Contestant Score',
      'Result',
      'Status',
      'Saved At',
    ];
    const rows = list.map((rec) => {
      const jScores = judges.map((j) => {
        const sc = rec.judgeScores[j.id];
        return sc !== undefined && sc !== '' ? sc : 'N/A';
      });
      return [
        rec.contestantId,
        `"${rec.contestantName.replace(/"/g, '""')}"`,
        `"${rec.category.replace(/"/g, '""')}"`,
        `"${rec.phone}"`,
        ...jScores,
        rec.rawAverage.toFixed(2),
        rec.roundedAverage,
        rec.contestantScore || 'N/A',
        rec.result || 'N/A',
        rec.status,
        `"${rec.savedAt}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'GGL-ComputerJi-Scoring.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const completedCount = Object.keys(savedRecords).length;
  const totalCount = CONTESTANTS_LIST.length;
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWin =
    isRevealed &&
    computerJiAverage !== null &&
    Number(contestantScoreInput.trim()) === computerJiAverage;

  return (
    <div className="h-screen max-h-screen bg-[#07080e] text-slate-100 flex flex-col justify-between overflow-hidden p-2 sm:p-3 selection:bg-amber-500 selection:text-black">
      {/* ============================================================
          COMPACT TOP HEADER STRIP (Takes ~40px)
          ============================================================ */}
      <header className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#0e111d] border border-amber-500/20 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-black font-black text-sm flex items-center justify-center shadow-[0_0_10px_rgba(255,215,0,0.5)]">
            GGL
          </div>
          <span className="text-sm font-bebas tracking-widest text-white uppercase">
            COMPUTER JI <span className="text-amber-400">— CONTROL PANEL</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-[10px] font-black text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="text-[11px] font-mono text-slate-300">
            Completed:{' '}
            <strong className="text-emerald-400 font-black">
              {completedCount} / {totalCount}
            </strong>
          </div>
          {lastSavedTime && (
            <span className="hidden md:inline text-[10px] font-mono text-slate-400">
              Saved: {lastSavedTime}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowResetAllModal(true)}
            className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase transition-colors"
          >
            Reset All
          </button>
        </div>
      </header>

      {/* ============================================================
          MAIN BODY GRID (FITS IN SINGLE SCREEN WITHOUT SCROLLING)
          Layout:
          TOP ROW: [ JUDGE SCORES (Left) ] | [ SELECT CONTESTANT (Right) ]
          BOTTOM ROW: [ SAVED DATA (Left) ] | [ TIMER 2 MIN ] | [ REPORT & NEXT (Right) ]
          ============================================================ */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2.5 my-2 min-h-0 overflow-hidden">
        {/* ==========================================================
            CARD 1: JUDGE SCORES (Left Top, 6 cols)
            ========================================================== */}
        <section
          aria-labelledby="judge-scores-heading"
          className="lg:col-span-6 rounded-2xl bg-[#0e111d]/95 border border-amber-500/30 p-3 flex flex-col justify-between shadow-xl min-h-0 overflow-hidden"
        >
          {/* Header & Add Button */}
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <h2
                id="judge-scores-heading"
                className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                JUDGE SCORES ({activeJudges.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowAddJudgeModal(true)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              ADD
            </button>
          </div>

          {/* Judges List (Scrollable internally if many judges, won't scroll page) */}
          <div className="flex-1 overflow-y-auto space-y-1.5 py-1.5 pr-1 min-h-0">
            {judges.map((judge, idx) => (
              <div
                key={judge.id}
                className={`flex items-center justify-between px-2.5 py-1 rounded-xl border transition-all ${
                  judge.isActive
                    ? 'bg-black/50 border-white/10 focus-within:border-amber-400'
                    : 'bg-black/20 border-white/5 opacity-40'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-5 h-5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-[10px] font-black font-mono shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-100 uppercase tracking-wide truncate">
                    {judge.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {judge.isActive ? (
                    <input
                      type="number"
                      step="any"
                      min="1"
                      max="10"
                      placeholder="1-10"
                      value={judgeScores[judge.id] || ''}
                      onChange={(e) => handleJudgeScoreChange(judge.id, e.target.value)}
                      className="w-16 px-2 py-1 rounded-lg bg-[#07080e] border border-amber-500/30 text-amber-300 font-mono text-center font-bold text-sm focus:outline-none focus:border-amber-400 transition-all placeholder:text-slate-600 placeholder:text-[10px]"
                    />
                  ) : (
                    <span className="text-[10px] text-slate-500 italic px-2">OFF</span>
                  )}

                  {!CORE_JUDGE_IDS.has(judge.id) && (
                    <button
                      type="button"
                      title="Delete Additional Judge"
                      onClick={() => handleDeleteJudge(judge.id)}
                      className="p-1 rounded bg-red-950/60 hover:bg-red-800 border border-red-500/40 text-red-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Error notice if any */}
          {panelError && (
            <div className="text-[10px] text-red-400 bg-red-950/60 border border-red-500/40 px-2 py-1 rounded mb-1">
              {panelError}
            </div>
          )}

          {/* Average Judge Score footer box */}
          <div className="pt-1.5 border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCalculateAverage}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-md flex items-center gap-1"
            >
              <Calculator className="w-3.5 h-3.5" />
              CALCULATE
            </button>

            <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-xl border border-amber-500/30">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                AVERAGE JUDGE SCORE:
              </span>
              <span className="text-xl font-mono font-black text-amber-400">
                {computerJiAverage !== null ? formatScore(computerJiAverage) : '—'}
                <span className="text-xs text-slate-500 font-sans ml-1">/ 10</span>
              </span>
            </div>
          </div>
        </section>

        {/* ==========================================================
            CARD 2: SELECT CONTESTANT (Right Top, 6 cols)
            Dropdown + Details + Contestant Score input right inside it
            ========================================================== */}
        <section
          aria-labelledby="contestant-heading"
          className="lg:col-span-6 rounded-2xl bg-[#0e111d]/95 border border-amber-500/30 p-3 flex flex-col justify-between shadow-xl min-h-0 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 shrink-0">
            <h2
              id="contestant-heading"
              className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              SELECT CONTESTANT ({currentContestant.id}/{totalCount})
            </h2>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${
                isCurrentCompleted
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/40'
              }`}
            >
              {isCurrentCompleted ? '✓ COMPLETED' : '○ PENDING'}
            </span>
          </div>

          {/* Searchable Dropdown */}
          <div className="relative my-1 shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-black/60 border border-amber-500/40 text-left hover:border-amber-400 transition-all cursor-pointer shadow-inner"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs font-mono shrink-0">
                  {currentContestant.id}
                </span>
                <span className="font-bold text-sm text-white truncate">
                  {currentContestant.name}
                </span>
                <span className="text-xs text-amber-300/80 truncate">
                  ({currentContestant.category})
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-amber-400 shrink-0 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl bg-[#0a0d16] border border-amber-500/40 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="p-2 border-b border-white/10 bg-black/50">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search contestant..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-[#121626] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto divide-y divide-white/5">
                  {filteredContestants.map((c) => {
                    const isDone = Boolean(savedRecords[c.id]);
                    const isSel = c.id === selectedContestantId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedContestantId(c.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 text-left text-xs transition-colors cursor-pointer ${
                          isSel ? 'bg-amber-500/15 text-amber-300' : 'hover:bg-white/5 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-4 h-4 flex items-center justify-center shrink-0">
                            {isDone ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <span className="w-2 h-2 rounded-full border border-slate-500" />
                            )}
                          </span>
                          <span className="font-bold truncate">{c.name}</span>
                          <span className="text-[10px] text-slate-400">({c.category})</span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 shrink-0">
                          #{c.id}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Contestant Details Strip */}
          <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-black/40 border border-white/10 text-xs">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block">NAME</span>
              <span className="font-bold text-white truncate block">{currentContestant.name}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block">CATEGORY</span>
              <span className="font-bold text-amber-300 truncate block">
                {currentContestant.category}
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 block">CONTACT</span>
              <span className="font-mono text-slate-300 truncate block">
                {currentContestant.phone}
              </span>
            </div>
          </div>

          {/* CONTESTANT SCORE INPUT (Inside the Contestant card as requested) */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
            <div>
              <label
                htmlFor="cont-score-field"
                className="text-xs font-black uppercase text-amber-400 tracking-wider block"
              >
                CONTESTANT SCORE:
              </label>
              <span className="text-[10px] text-slate-400 block">
                Supported: 1, 1.5, 2 ... 9.5, 10
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="cont-score-field"
                type="number"
                step="0.5"
                min="1"
                max="10"
                placeholder="?"
                value={contestantScoreInput}
                onChange={(e) => {
                  setContestantScoreInput(e.target.value);
                  setIsRevealed(false);
                }}
                className="w-20 px-3 py-1.5 rounded-xl bg-[#07080e] border border-amber-500/40 text-amber-400 font-mono text-center font-black text-xl focus:outline-none focus:border-amber-400 transition-all placeholder:text-slate-600"
              />

              <button
                type="button"
                id="btn-reveal-bottom"
                onClick={handleReveal}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
              >
                REVEAL
              </button>
            </div>
          </div>
        </section>

        {/* ==========================================================
            CARD 3: SAVED DATA (Left Bottom, 5 cols)
            With Excel Export Button
            ========================================================== */}
        <section
          aria-labelledby="saved-data-heading"
          className="lg:col-span-5 rounded-2xl bg-[#0e111d]/95 border border-amber-500/30 p-3 flex flex-col justify-between shadow-xl min-h-0 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 shrink-0">
            <h2
              id="saved-data-heading"
              className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              SAVED DATA ({completedCount})
            </h2>

            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3 h-3" />
              EXCEL
            </button>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-x-auto overflow-y-auto rounded-xl border border-white/10 bg-black/40 my-1 min-h-0">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-[#121626] text-slate-400 text-[9px] uppercase font-bold sticky top-0 border-b border-white/10">
                <tr>
                  <th className="p-1.5">#</th>
                  <th className="p-1.5">Contestant</th>
                  <th className="p-1.5 text-center">Avg</th>
                  <th className="p-1.5 text-center">Score</th>
                  <th className="p-1.5 text-center">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {Object.values(savedRecords).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500 italic font-sans text-xs">
                      No saved data yet.
                    </td>
                  </tr>
                ) : (
                  Object.values(savedRecords).map((rec) => (
                    <tr
                      key={rec.contestantId}
                      onClick={() => setSelectedContestantId(rec.contestantId)}
                      className={`hover:bg-amber-500/10 cursor-pointer transition-colors ${
                        rec.contestantId === selectedContestantId ? 'bg-amber-500/15' : ''
                      }`}
                    >
                      <td className="p-1.5 font-bold text-amber-400">{rec.contestantId}</td>
                      <td className="p-1.5 font-sans font-bold text-white truncate max-w-[100px]">
                        {rec.contestantName}
                      </td>
                      <td className="p-1.5 text-center font-bold text-amber-300">
                        {rec.roundedAverage}
                      </td>
                      <td className="p-1.5 text-center text-slate-300">
                        {rec.contestantScore || '—'}
                      </td>
                      <td className="p-1.5 text-center">
                        {rec.result === 'WIN' ? (
                          <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded">
                            WIN
                          </span>
                        ) : rec.result === 'LOSE' ? (
                          <span className="text-[9px] font-black text-red-400 bg-red-500/10 px-1 py-0.5 rounded">
                            LOSE
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="text-[10px] text-slate-400 font-mono text-right shrink-0">
            Click any row to reload contestant
          </div>
        </section>

        {/* ==========================================================
            CARD 4: TIMER 2 MIN (Center Bottom, 3 cols)
            ========================================================== */}
        <section
          aria-labelledby="timer-heading"
          className="lg:col-span-3 rounded-2xl bg-[#0e111d]/95 border border-amber-500/30 p-3 flex flex-col justify-between text-center shadow-xl min-h-0 overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 shrink-0">
            <h2
              id="timer-heading"
              className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              TIMER 2 MIN
            </h2>
            <span className="text-[9px] font-mono text-slate-400">120s</span>
          </div>

          {/* Clock Display */}
          <div className="my-auto py-2">
            <div
              className={`inline-block px-4 py-1.5 rounded-2xl bg-black/60 border ${
                timerSeconds === 0
                  ? 'border-red-500 text-red-500 animate-pulse'
                  : timerSeconds <= 30
                  ? 'border-amber-500 text-amber-400'
                  : 'border-white/20 text-white'
              }`}
            >
              <span className="text-4xl font-mono font-black tracking-tight">
                {formatTimer(timerSeconds)}
              </span>
            </div>
            {timerSeconds === 0 && (
              <span className="block text-[10px] text-red-400 font-black uppercase tracking-wider mt-1">
                ⚠️ TIME UP!
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-1.5 pt-1 border-t border-white/10 shrink-0">
            {!isTimerRunning ? (
              <button
                type="button"
                onClick={() => setIsTimerRunning(true)}
                disabled={timerSeconds === 0}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center gap-1 shadow cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3 h-3" />
                START
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsTimerRunning(false)}
                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase flex items-center gap-1 shadow cursor-pointer"
              >
                <Pause className="w-3 h-3" />
                PAUSE
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(120);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase flex items-center gap-1 border border-white/10 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              RESET
            </button>
          </div>
        </section>

        {/* ==========================================================
            CARD 5: REPORT & NEXT (Right Bottom, 4 cols)
            ========================================================== */}
        <section
          aria-labelledby="report-heading"
          className="lg:col-span-4 rounded-2xl bg-[#0e111d]/95 border border-amber-500/30 p-3 flex flex-col justify-between shadow-xl min-h-0 overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 shrink-0">
            <h2
              id="report-heading"
              className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              REPORT / VERDICT
            </h2>
            {isRevealed && (
              <span
                className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                  isWin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}
              >
                {isWin ? 'MATCH' : 'MISMATCH'}
              </span>
            )}
          </div>

          {/* Verdict Box */}
          <div className="my-auto py-1">
            {isRevealed && computerJiAverage !== null ? (
              <div
                className={`p-2.5 rounded-xl border text-center space-y-1 ${
                  isWin
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-red-950/40 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                }`}
              >
                <div className="text-xl sm:text-2xl font-bebas tracking-widest text-white">
                  {isWin ? (
                    <span className="text-emerald-400">🎉 YOU WIN!</span>
                  ) : (
                    <span className="text-red-400">❌ BETTER LUCK NEXT TIME!</span>
                  )}
                </div>
                <div className="flex items-center justify-center gap-4 text-xs font-mono">
                  <span>
                    Avg: <strong className="text-amber-400">{formatScore(computerJiAverage)}</strong>
                  </span>
                  <span>vs</span>
                  <span>
                    Contestant: <strong className="text-white">{contestantScoreInput}</strong>
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center text-xs text-slate-500 italic">
                Awaiting calculation and reveal...
              </div>
            )}
          </div>

          {/* NEXT / SAVE BUTTONS */}
          <div className="flex items-center gap-2 pt-1 border-t border-white/10 shrink-0">
            <button
              type="button"
              id="btn-save-score"
              onClick={() => handleSaveAndNext(false)}
              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bebas text-base tracking-wider uppercase transition-all active:scale-95 shadow-md flex items-center justify-center gap-1 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              SAVE
            </button>

            <button
              type="button"
              id="btn-save-and-next"
              onClick={() => handleSaveAndNext(true)}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bebas text-base tracking-wider uppercase transition-all active:scale-95 shadow-md flex items-center justify-center gap-1 cursor-pointer"
            >
              NEXT <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* ============================================================
          MODAL: ADD JUDGE
          ============================================================ */}
      {showAddJudgeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in"
        >
          <form
            onSubmit={handleAddJudge}
            className="max-w-xs w-full rounded-2xl bg-[#0e111d] border border-amber-500/40 p-4 space-y-3 shadow-2xl"
          >
            <div className="flex items-center gap-2 text-amber-400">
              <Plus className="w-4 h-4" />
              <h3 className="text-sm font-bebas tracking-wider text-white">ADD JUDGE</h3>
            </div>
            <input
              type="text"
              required
              placeholder="JUDGE FULL NAME"
              value={newJudgeName}
              onChange={(e) => setNewJudgeName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white uppercase font-bold focus:border-amber-400 focus:outline-none"
              autoFocus
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddJudgeModal(false)}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-xs"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-bold uppercase"
              >
                ADD
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================
          MODAL: RESET ALL DATA
          ============================================================ */}
      {showResetAllModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in"
        >
          <div className="max-w-xs w-full rounded-2xl bg-[#0e111d] border border-red-500/50 p-4 space-y-3 shadow-2xl">
            <h3 className="text-sm font-bebas tracking-wider text-red-400">RESET ALL SCORING DATA?</h3>
            <p className="text-xs text-slate-300">
              This will permanently clear all saved contestant records in this session.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowResetAllModal(false)}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-xs"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY_SCORES);
                  setSavedRecords({});
                  setLastSavedTime(null);
                  loadContestantForm(selectedContestantId);
                  setShowResetAllModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold uppercase"
              >
                RESET ALL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
