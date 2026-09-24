'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  Bot,
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
  Tag,
  Play,
  Pause,
  Download,
  Plus,
  Trash2,
  Clock,
  Check,
  Edit3,
  Sliders,
  AlertOctagon,
  BarChart2,
  Users,
} from 'lucide-react';

// ============================================================
// 7. CONTESTANT LIST (Exact 24 Records)
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
  { id: 8, name: 'Ravi Vishwakarma', category: 'Dance', phone: '6386479690' },
  { id: 9, name: 'Arpita singh', category: 'Dance', phone: '9792844219' },
  { id: 10, name: 'Aftab', category: 'Singing', phone: '7991789469' },
  { id: 11, name: 'Misthi Mishra', category: 'Dance', phone: '8299388799' },
  { id: 12, name: 'Kirti Gupta', category: 'Singing', phone: '9565865240' },
  { id: 13, name: 'Ashik Ansari', category: 'Poetry', phone: '9569639253' },
  { id: 14, name: 'Aradhya', category: 'Singing', phone: '7080718509' },
  { id: 15, name: 'Shraddha Pandey', category: 'Singing', phone: '7307468833' },
  { id: 16, name: 'Nandani Kumari', category: 'Dance', phone: '7052273166' },
  { id: 17, name: 'Himanshu bhatt', category: 'Poetry', phone: '8112585745' },
  { id: 18, name: 'MD Arman', category: 'Mimicry', phone: '+9779817455559' },
  { id: 19, name: 'rustam', category: 'dance', phone: '8545943855' },
  { id: 20, name: 'Kritika singh', category: 'Singing', phone: '8127421810' },
  { id: 21, name: 'Khushee madhyeshiya', category: 'Singing', phone: '9336550642' },
  { id: 22, name: 'kv6304860@gmail.com', category: 'Dance', phone: '9335477452' },
  { id: 23, name: 'Neha', category: 'Couple dance', phone: '7992159035' },
  { id: 24, name: 'Atul sharma', category: 'Dance', phone: '8604057703' },
];

// ============================================================
// 11. INITIAL JUDGES
// ============================================================
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

export interface SavedScoringRecord {
  contestantId: number;
  contestantName: string;
  category: string;
  phone: string;
  judgeScores: Record<string, string>; // judgeId -> score string
  rawAverage: number;
  roundedAverage: number;
  contestantPrediction: string;
  result: 'WIN' | 'LOSE' | null;
  status: 'COMPLETED';
  savedAt: string;
}

/**
 * Rounds a number to the nearest 0.5 mathematically:
 * Math.round(val * 2) / 2
 */
function roundToNearestHalf(val: number): number {
  return Math.round(val * 2) / 2;
}

function formatScore(val: number): string {
  return Number.isInteger(val) ? val.toString() : val.toFixed(1);
}

function isValidContestantScore(val: string): boolean {
  if (!val || val.trim() === '') return false;
  const num = Number(val.trim());
  if (isNaN(num)) return false;
  if (num < 1 || num > 10) return false;
  const doubled = num * 2;
  return Math.abs(Math.round(doubled) - doubled) < 1e-7;
}

const STORAGE_KEY_SCORES = 'ggl_computerji_scores_v2';
const STORAGE_KEY_JUDGES = 'ggl_computerji_judges_v2';

export default function ComputerJiControlPanel() {
  // ------------------------------------------------------------
  // State: Judges & Contestants
  // ------------------------------------------------------------
  const [judges, setJudges] = useState<Judge[]>(DEFAULT_JUDGES);
  const [selectedContestantId, setSelectedContestantId] = useState<number>(1);
  const [savedRecords, setSavedRecords] = useState<Record<number, SavedScoringRecord>>({});
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Active form state for the currently selected contestant
  const [judgeScores, setJudgeScores] = useState<Record<string, string>>({});
  const [computerJiAverage, setComputerJiAverage] = useState<number | null>(null);
  const [rawAverage, setRawAverage] = useState<number | null>(null);
  const [contestantPrediction, setContestantPrediction] = useState<string>('');
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Validation & alerts
  const [panelError, setPanelError] = useState<string | null>(null);
  const [contestantError, setContestantError] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<boolean>(false);

  // Modals & Drawers
  const [showAddJudgeModal, setShowAddJudgeModal] = useState<boolean>(false);
  const [newJudgeName, setNewJudgeName] = useState<string>('');
  const [newJudgeRole, setNewJudgeRole] = useState<string>('');

  const [showResetAllModal, setShowResetAllModal] = useState<boolean>(false);
  const [pendingContestantSwitch, setPendingContestantSwitch] = useState<number | null>(null);
  const [showUnsavedWarningModal, setShowUnsavedWarningModal] = useState<boolean>(false);

  // Contestant Dropdown Search
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ------------------------------------------------------------
  // 23. Two-Minute Live Timer State
  // ------------------------------------------------------------
  const [timerSeconds, setTimerSeconds] = useState<number>(120);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // ------------------------------------------------------------
  // Load persisted data on mount
  // ------------------------------------------------------------
  useEffect(() => {
    try {
      const storedJudges = localStorage.getItem(STORAGE_KEY_JUDGES);
      if (storedJudges) {
        const parsed = JSON.parse(storedJudges);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          setJudges(parsed);
        }
      }

      const storedRecords = localStorage.getItem(STORAGE_KEY_SCORES);
      if (storedRecords) {
        const parsed = JSON.parse(storedRecords);
        if (parsed && typeof parsed === 'object') {
          setSavedRecords(parsed);
          const keys = Object.keys(parsed);
          if (keys.length > 0) {
            const lastRecord = parsed[Number(keys[keys.length - 1])];
            if (lastRecord?.savedAt) setLastSavedTime(lastRecord.savedAt);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    }
  }, []);

  // Sync judges to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_JUDGES, JSON.stringify(judges));
    } catch (e) {
      console.error('Failed to save judges to local storage:', e);
    }
  }, [judges]);

  // Sync records to localStorage
  const saveRecordsToStorage = (records: Record<number, SavedScoringRecord>) => {
    try {
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save scores to local storage:', e);
    }
  };

  // ------------------------------------------------------------
  // Timer Countdown Effect
  // ------------------------------------------------------------
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ------------------------------------------------------------
  // Active Contestant & Scores Synchronization
  // ------------------------------------------------------------
  const currentContestant = useMemo(() => {
    return CONTESTANTS_LIST.find((c) => c.id === selectedContestantId) || CONTESTANTS_LIST[0];
  }, [selectedContestantId]);

  const currentSavedRecord = savedRecords[selectedContestantId];
  const isCurrentCompleted = Boolean(currentSavedRecord);

  // Load contestant data when selection changes
  const loadContestantForm = (contestantId: number) => {
    const existing = savedRecords[contestantId];
    if (existing) {
      setJudgeScores({ ...existing.judgeScores });
      setRawAverage(existing.rawAverage);
      setComputerJiAverage(existing.roundedAverage);
      setContestantPrediction(existing.contestantPrediction || '');
      setIsRevealed(true);
      setHasUnsavedChanges(false);
    } else {
      // Fresh empty form
      const emptyScores: Record<string, string> = {};
      judges.forEach((j) => {
        emptyScores[j.id] = '';
      });
      setJudgeScores(emptyScores);
      setRawAverage(null);
      setComputerJiAverage(null);
      setContestantPrediction('');
      setIsRevealed(false);
      setHasUnsavedChanges(false);
    }
    setPanelError(null);
    setContestantError(null);
    setSaveSuccessMsg(false);

    // Reset 2-minute timer for new contestant
    setTimerSeconds(120);
    setIsTimerRunning(false);
  };

  // Initial load
  useEffect(() => {
    loadContestantForm(selectedContestantId);
  }, [selectedContestantId]);

  // Filtered contestants for dropdown search
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

  // ------------------------------------------------------------
  // Contestant Switch Guard
  // ------------------------------------------------------------
  const handleSelectContestant = (targetId: number) => {
    if (targetId === selectedContestantId) {
      setIsDropdownOpen(false);
      return;
    }

    if (hasUnsavedChanges && !isCurrentCompleted) {
      setPendingContestantSwitch(targetId);
      setShowUnsavedWarningModal(true);
      setIsDropdownOpen(false);
      return;
    }

    setSelectedContestantId(targetId);
    setIsDropdownOpen(false);
  };

  const handleConfirmContestantSwitch = () => {
    if (pendingContestantSwitch !== null) {
      setSelectedContestantId(pendingContestantSwitch);
      setPendingContestantSwitch(null);
    }
    setShowUnsavedWarningModal(false);
  };

  // ------------------------------------------------------------
  // Judge Score Change
  // ------------------------------------------------------------
  const handleJudgeScoreChange = (judgeId: string, val: string) => {
    setPanelError(null);
    setHasUnsavedChanges(true);
    setJudgeScores((prev) => ({
      ...prev,
      [judgeId]: val,
    }));

    // Reset calculation if scores change
    if (computerJiAverage !== null || isRevealed) {
      setComputerJiAverage(null);
      setRawAverage(null);
      setIsRevealed(false);
    }
  };

  // ------------------------------------------------------------
  // 15. Average Calculation
  // ------------------------------------------------------------
  const activeJudges = useMemo(() => judges.filter((j) => j.isActive), [judges]);

  const handleCalculateAverage = () => {
    setPanelError(null);

    // Verify all active judges have valid scores
    const missingJudges = activeJudges.filter((j) => {
      const val = judgeScores[j.id]?.trim();
      return val === undefined || val === '' || isNaN(Number(val));
    });

    if (missingJudges.length > 0) {
      setPanelError('Please enter scores for all active judges.');
      return;
    }

    const parsedScores: number[] = [];
    for (const j of activeJudges) {
      const val = Number(judgeScores[j.id]?.trim());
      if (val < 1 || val > 10) {
        setPanelError('Judge scores must be between 1 and 10.');
        return;
      }
      parsedScores.push(val);
    }

    const sum = parsedScores.reduce((acc, curr) => acc + curr, 0);
    const mean = sum / parsedScores.length;
    const rounded = roundToNearestHalf(mean);

    setRawAverage(mean);
    setComputerJiAverage(rounded);
    setIsRevealed(false);
  };

  // ------------------------------------------------------------
  // 21 & 22. Contestant Prediction & Reveal
  // ------------------------------------------------------------
  const handleContestantPredictionChange = (val: string) => {
    setContestantError(null);
    setHasUnsavedChanges(true);
    setContestantPrediction(val);
    if (isRevealed) {
      setIsRevealed(false);
    }
  };

  const handleRevealResult = () => {
    setContestantError(null);

    if (computerJiAverage === null) {
      setPanelError('Please calculate the average first.');
      return;
    }

    if (!contestantPrediction || contestantPrediction.trim() === '') {
      setContestantError('Please enter the contestant prediction mark.');
      return;
    }

    if (!isValidContestantScore(contestantPrediction)) {
      setContestantError('Please enter a valid mark between 1 and 10 in 0.5 increments.');
      return;
    }

    const predictionNum = Number(contestantPrediction.trim());
    setIsRevealed(true);

    if (predictionNum === computerJiAverage) {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.65 },
          colors: ['#FFD700', '#FFC107', '#FFA000', '#FFFFFF', '#EF4444'],
          disableForReducedMotion: true,
        });
      } catch (err) {
        // Fallback gracefully
      }
    }
  };

  // ------------------------------------------------------------
  // 18. Save Score Action
  // ------------------------------------------------------------
  const handleSaveScore = () => {
    setPanelError(null);
    setContestantError(null);

    // Verify all active judges have scores
    const missingJudges = activeJudges.filter((j) => {
      const val = judgeScores[j.id]?.trim();
      return val === undefined || val === '' || isNaN(Number(val));
    });

    if (missingJudges.length > 0) {
      setPanelError('Please enter scores for all active judges.');
      return;
    }

    // If average not yet calculated, calculate it now
    let calculatedRaw = rawAverage;
    let calculatedRounded = computerJiAverage;
    if (calculatedRounded === null) {
      const parsedScores = activeJudges.map((j) => Number(judgeScores[j.id].trim()));
      const sum = parsedScores.reduce((acc, curr) => acc + curr, 0);
      calculatedRaw = sum / parsedScores.length;
      calculatedRounded = roundToNearestHalf(calculatedRaw);
      setRawAverage(calculatedRaw);
      setComputerJiAverage(calculatedRounded);
    }

    // Determine result if prediction provided
    let calculatedResult: 'WIN' | 'LOSE' | null = null;
    if (contestantPrediction && isValidContestantScore(contestantPrediction)) {
      const predNum = Number(contestantPrediction.trim());
      calculatedResult = predNum === calculatedRounded ? 'WIN' : 'LOSE';
    }

    const nowTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
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
      contestantPrediction: contestantPrediction.trim(),
      result: calculatedResult,
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
    setHasUnsavedChanges(false);
    setSaveSuccessMsg(true);

    setTimeout(() => {
      setSaveSuccessMsg(false);
    }, 3000);
  };

  // ------------------------------------------------------------
  // 13. Add Judge
  // ------------------------------------------------------------
  const handleAddJudge = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newJudgeName.trim().toUpperCase();
    if (!trimmed) return;

    const newId = `j_${Date.now()}`;
    const newJudgeObj: Judge = {
      id: newId,
      name: trimmed,
      role: newJudgeRole.trim() || 'Panel Judge',
      isActive: true,
    };

    const updatedJudges = [...judges, newJudgeObj];
    setJudges(updatedJudges);

    // Add empty score for current form
    setJudgeScores((prev) => ({
      ...prev,
      [newId]: '',
    }));

    setNewJudgeName('');
    setNewJudgeRole('');
    setShowAddJudgeModal(false);
  };

  const handleToggleJudgeActive = (judgeId: string) => {
    // Keep at least 1 judge active
    const activeCount = judges.filter((j) => j.isActive).length;
    const target = judges.find((j) => j.id === judgeId);
    if (target?.isActive && activeCount <= 1) {
      alert('At least one active judge is required.');
      return;
    }

    setJudges((prev) =>
      prev.map((j) => (j.id === judgeId ? { ...j, isActive: !j.isActive } : j))
    );
  };

  // ------------------------------------------------------------
  // 27. Excel / CSV Export
  // ------------------------------------------------------------
  const handleExportExcel = () => {
    const recordsList = Object.values(savedRecords);
    if (recordsList.length === 0) {
      alert('No saved scoring data to export yet. Complete and save at least one contestant score.');
      return;
    }

    // Dynamic headers based on current judges list
    const judgeHeaders: string[] = [];
    judges.forEach((j) => {
      judgeHeaders.push(`"${j.name} Score"`);
    });

    const headers = [
      'Serial Number',
      'Contestant Name',
      'Category',
      'Phone',
      ...judgeHeaders,
      'Raw Average',
      'Rounded Average',
      'Contestant Prediction',
      'Result',
      'Status',
      'Saved At',
    ];

    const rows = recordsList.map((rec) => {
      const judgeScoresRow = judges.map((j) => {
        const sc = rec.judgeScores[j.id];
        return sc !== undefined && sc !== '' ? sc : 'N/A';
      });

      return [
        rec.contestantId,
        `"${rec.contestantName.replace(/"/g, '""')}"`,
        `"${rec.category.replace(/"/g, '""')}"`,
        `"${rec.phone}"`,
        ...judgeScoresRow,
        rec.rawAverage.toFixed(2),
        rec.roundedAverage,
        rec.contestantPrediction || 'N/A',
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

  // ------------------------------------------------------------
  // 30. Reset All Data
  // ------------------------------------------------------------
  const handleConfirmResetAll = () => {
    localStorage.removeItem(STORAGE_KEY_SCORES);
    setSavedRecords({});
    setLastSavedTime(null);
    loadContestantForm(selectedContestantId);
    setShowResetAllModal(false);
  };

  // ------------------------------------------------------------
  // Progress & Summary Calculations
  // ------------------------------------------------------------
  const completedCount = Object.keys(savedRecords).length;
  const totalCount = CONTESTANTS_LIST.length;
  const pendingCount = totalCount - completedCount;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Timer formatting
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWin =
    isRevealed &&
    computerJiAverage !== null &&
    Number(contestantPrediction.trim()) === computerJiAverage;

  return (
    <div className="min-h-screen bg-[#06070d] text-slate-100 font-sans antialiased flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* ============================================================
          1. COMPACT CONTROL PANEL TOP BAR
          ============================================================ */}
      <header className="sticky top-0 z-40 bg-[#0a0d16]/95 backdrop-blur-xl border-b border-amber-500/20 px-4 sm:px-6 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Branding & Status */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-lg shadow-[0_0_20px_rgba(255,215,0,0.5)]">
              GGL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bebas tracking-widest text-white uppercase">
                  COMPUTER JI <span className="text-amber-400">— CONTROL PANEL</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[10px] font-black text-emerald-400 tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE SCORING SYSTEM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Gorakhpur’s Got Latent • Operator Command Station
              </p>
            </div>
          </div>

          {/* Right: System Status & Last Saved */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-xs font-black tracking-wider text-emerald-400">
                  SYSTEM ONLINE
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {lastSavedTime ? `Last saved: ${lastSavedTime}` : 'Session Ready'}
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportExcel}
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              EXPORT EXCEL
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================
          MAIN WORKSPACE (2-COLUMN DESKTOP / STACKED MOBILE)
          ============================================================ */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ==========================================================
            LEFT COLUMN (7 cols): CONTESTANT SELECTION & SCORING
            ========================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Contestant Selector & Info */}
          <section
            aria-labelledby="contestant-card-title"
            className="rounded-3xl bg-[#0e111d]/90 border border-amber-500/30 p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2
                id="contestant-card-title"
                className="text-sm font-black text-amber-400 uppercase tracking-widest flex items-center gap-2"
              >
                <User className="w-4 h-4 text-amber-400" />
                SELECT CONTESTANT
              </h2>
              <span className="text-xs font-mono text-slate-400">
                #{currentContestant.id} of {CONTESTANTS_LIST.length}
              </span>
            </div>

            {/* Custom Searchable Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl bg-black/60 border border-amber-500/40 text-left hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all cursor-pointer shadow-inner"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {isCurrentCompleted ? (
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 border border-white/10 flex items-center justify-center shrink-0 text-xs font-mono">
                      ○
                    </span>
                  )}
                  <div className="truncate">
                    <span className="text-base sm:text-lg font-bold text-white block truncate">
                      {currentContestant.name}
                    </span>
                    <span className="text-xs text-amber-300/80 font-medium">
                      {currentContestant.category} • {currentContestant.phone}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-[#0a0d16] border border-amber-500/40 shadow-[0_15px_50px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {/* Search Input Box */}
                  <div className="p-3 border-b border-white/10 bg-black/40">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search contestant..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#121626] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* List of 24 Contestants */}
                  <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                    {filteredContestants.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No contestant found matching &quot;{searchQuery}&quot;
                      </div>
                    ) : (
                      filteredContestants.map((c) => {
                        const isDone = Boolean(savedRecords[c.id]);
                        const isSelected = c.id === selectedContestantId;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleSelectContestant(c.id)}
                            className={`w-full flex items-center justify-between p-3 text-left transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/15 text-amber-300'
                                : 'hover:bg-white/5 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <span className="w-5 h-5 flex items-center justify-center shrink-0">
                                {isDone ? (
                                  <Check className="w-4 h-4 text-emerald-400 font-bold" />
                                ) : (
                                  <span className="w-2.5 h-2.5 rounded-full border border-slate-500" />
                                )}
                              </span>
                              <div className="truncate">
                                <span className="font-bold text-sm block truncate">{c.name}</span>
                                <span className="text-[11px] text-slate-400 block">
                                  {c.category}
                                </span>
                              </div>
                            </div>
                            <div className="shrink-0 text-right pl-2">
                              {isDone ? (
                                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                                  COMPLETED
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                                  PENDING
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 33. Contestant Information Card */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  CONTESTANT
                </span>
                <span className="text-sm font-black text-white truncate block">
                  {currentContestant.name}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  CATEGORY
                </span>
                <span className="text-sm font-bold text-amber-300 truncate block">
                  {currentContestant.category}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  CONTACT
                </span>
                <span className="text-xs font-mono font-bold text-slate-200 truncate block">
                  {currentContestant.phone}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  STATUS
                </span>
                {isCurrentCompleted ? (
                  <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    COMPLETED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    PENDING
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Card: Judge Scores & Calculation */}
          <section
            aria-labelledby="judge-scores-title"
            className="rounded-3xl bg-[#0e111d]/90 border border-amber-500/30 p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2
                id="judge-scores-title"
                className="text-sm font-black text-amber-400 uppercase tracking-widest flex items-center gap-2"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                JUDGE SCORES ({activeJudges.length} ACTIVE)
              </h2>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                SCORE RANGE: 1 – 10
              </span>
            </div>

            {/* List of Judges */}
            <div className="space-y-3">
              {judges.map((judge, idx) => (
                <div
                  key={judge.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border transition-all duration-200 ${
                    judge.isActive
                      ? 'bg-black/40 border-white/10 focus-within:border-amber-400 focus-within:shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                      : 'bg-black/20 border-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-xs font-black font-mono">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-sm font-bold text-white uppercase tracking-wider block">
                        {judge.name}
                      </span>
                      {judge.role && (
                        <span className="text-[10px] text-slate-400 uppercase block">
                          {judge.role}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {judge.isActive ? (
                      <input
                        type="number"
                        step="any"
                        min="1"
                        max="10"
                        placeholder="SCORE"
                        value={judgeScores[judge.id] || ''}
                        onChange={(e) => handleJudgeScoreChange(judge.id, e.target.value)}
                        className="w-full sm:w-28 px-3 py-2 rounded-xl bg-[#07080e] border border-amber-500/30 text-amber-300 font-mono text-center font-bold text-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-slate-600 placeholder:text-xs"
                        aria-label={`Score for ${judge.name}`}
                      />
                    ) : (
                      <span className="text-xs text-slate-500 italic px-3 py-2">
                        [DISABLED]
                      </span>
                    )}

                    <button
                      type="button"
                      title={judge.isActive ? 'Disable Judge' : 'Enable Judge'}
                      onClick={() => handleToggleJudgeActive(judge.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-xs"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* + ADD JUDGE BUTTON */}
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowAddJudgeModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-slate-300 hover:text-amber-400 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                ADD JUDGE
              </button>

              <button
                type="button"
                id="btn-calc-avg"
                onClick={handleCalculateAverage}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Calculator className="w-4 h-4" />
                CALCULATE AVERAGE
              </button>
            </div>

            {/* Error Message for Panel */}
            {panelError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-950/60 border border-red-500/60 text-red-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{panelError}</span>
              </div>
            )}

            {/* 15. Calculated Average Score Display */}
            {computerJiAverage !== null && (
              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#141829] to-[#0a0d16] border-2 border-amber-500/60 text-center space-y-1 animate-in zoom-in-95 duration-200">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 block">
                  CALCULATED COMPUTER JI AVERAGE
                </span>
                <div className="text-4xl sm:text-5xl font-mono font-black text-amber-400 tracking-tight drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                  {formatScore(computerJiAverage)}
                  <span className="text-xl sm:text-2xl font-sans text-slate-500 ml-2">/ 10</span>
                </div>
                {rawAverage !== null && (
                  <span className="text-[11px] font-mono text-slate-400 block">
                    (Raw Mean: {rawAverage.toFixed(2)} → Rounded to nearest 0.5)
                  </span>
                )}
              </div>
            )}
          </section>

          {/* Card: Contestant Prediction & Reveal */}
          <section
            aria-labelledby="prediction-title"
            className="rounded-3xl bg-[#0e111d]/90 border border-amber-500/30 p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2
                id="prediction-title"
                className="text-sm font-black text-amber-400 uppercase tracking-widest flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                CONTESTANT PREDICTION
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                0.5 INCREMENTS
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 rounded-2xl bg-black/40 border border-amber-500/20">
              <div>
                <label
                  htmlFor="contestant-pred-input"
                  className="text-sm font-bold text-white uppercase block"
                >
                  CONTESTANT PREDICTION MARK
                </label>
                <span className="text-xs text-slate-400">
                  Supported: 1, 1.5, 2 ... 9.5, 10
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <input
                  id="contestant-pred-input"
                  type="number"
                  step="0.5"
                  min="1"
                  max="10"
                  placeholder="?"
                  value={contestantPrediction}
                  onChange={(e) => handleContestantPredictionChange(e.target.value)}
                  className="w-24 px-3 py-2.5 rounded-xl bg-[#07080e] border border-amber-500/40 text-amber-400 font-mono text-center font-black text-2xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-slate-600"
                />

                <button
                  type="button"
                  id="btn-reveal-result"
                  onClick={handleRevealResult}
                  disabled={!isValidContestantScore(contestantPrediction)}
                  className={`px-4 py-2.5 rounded-xl font-bebas text-lg tracking-wider uppercase transition-all shadow-md ${
                    isValidContestantScore(contestantPrediction)
                      ? 'bg-gradient-to-r from-red-600 to-amber-500 text-black font-black hover:brightness-110 active:scale-95 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                  }`}
                >
                  REVEAL RESULT
                </button>
              </div>
            </div>

            {contestantError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-950/60 border border-red-500/60 text-red-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{contestantError}</span>
              </div>
            )}

            {/* Revealed Verdict Banner */}
            {isRevealed && computerJiAverage !== null && (
              <div
                className={`p-5 rounded-2xl border-2 text-center space-y-3 animate-in zoom-in-95 duration-200 ${
                  isWin
                    ? 'bg-gradient-to-b from-[#0c2419] to-[#05140e] border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)]'
                    : 'bg-gradient-to-b from-[#250d11] to-[#120507] border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]'
                }`}
              >
                {isWin ? (
                  <div className="space-y-1">
                    <h3 className="text-3xl sm:text-4xl font-bebas tracking-widest text-emerald-400">
                      🎉 YOU WIN!
                    </h3>
                    <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
                      PERFECT PREDICTION • PREDICTION MATCHED COMPUTER JI
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <h3 className="text-3xl sm:text-4xl font-bebas tracking-widest text-red-400">
                      ❌ BETTER LUCK NEXT TIME!
                    </h3>
                    <p className="text-xs font-bold text-red-300 uppercase tracking-widest">
                      Your prediction did not match Computer Ji.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto pt-1">
                  <div className="p-2.5 rounded-xl bg-black/60 border border-amber-500/30">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      COMPUTER JI
                    </span>
                    <span className="text-2xl font-mono font-black text-amber-400">
                      {formatScore(computerJiAverage)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/20">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      CONTESTANT
                    </span>
                    <span className="text-2xl font-mono font-black text-white">
                      {contestantPrediction}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 18. SAVE SCORE BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                id="btn-save-score"
                onClick={handleSaveScore}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-black font-bebas text-2xl tracking-widest uppercase shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-6 h-6 text-black" />
                {isCurrentCompleted ? 'UPDATE & SAVE SCORE' : '✓ SAVE SCORE'}
              </button>
            </div>

            {saveSuccessMsg && (
              <div
                role="status"
                className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-sm font-bold text-center flex items-center justify-center gap-2 animate-in fade-in"
              >
                <Check className="w-5 h-5 text-emerald-400" />
                SAVED ✓ • CONTESTANT SCORES LOCKED & PERSISTED
              </div>
            )}
          </section>
        </div>

        {/* ==========================================================
            RIGHT COLUMN (5 cols): LIVE TIMER, PROGRESS, SUMMARY & TABLE
            ========================================================== */}
        <div className="lg:col-span-5 space-y-6">
          {/* 23. LIVE TWO-MINUTE TIMER */}
          <section
            aria-labelledby="timer-title"
            className="rounded-3xl bg-[#0e111d]/90 border border-amber-500/30 p-5 sm:p-6 backdrop-blur-xl shadow-2xl text-center space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2
                id="timer-title"
                className="text-sm font-black text-amber-400 uppercase tracking-widest flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-amber-400" />
                LIVE TIMER (2 MIN)
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                PER CONTESTANT
              </span>
            </div>

            {/* Big Countdown Display */}
            <div className="py-2">
              <div
                className={`inline-block px-8 py-4 rounded-2xl bg-black/60 border ${
                  timerSeconds === 0
                    ? 'border-red-500 text-red-500 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.5)]'
                    : timerSeconds <= 30
                    ? 'border-amber-500 text-amber-400'
                    : 'border-white/20 text-white'
                } transition-all`}
              >
                <span className="text-5xl sm:text-6xl font-mono font-black tracking-tight">
                  {formatTimer(timerSeconds)}
                </span>
              </div>
            </div>

            {timerSeconds === 0 && (
              <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/80 text-red-400 font-black text-xs uppercase tracking-widest animate-bounce">
                ⚠️ TIME UP! 2 MINUTES COMPLETED
              </div>
            )}

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {!isTimerRunning ? (
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(true)}
                  disabled={timerSeconds === 0}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  START
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(false)}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5" />
                  PAUSE
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(120);
                }}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                RESET
              </button>
            </div>
          </section>

          {/* 25. SCORE SUMMARY & 31. PROGRESS BAR */}
          <section
            aria-labelledby="summary-title"
            className="rounded-3xl bg-[#0e111d]/90 border border-amber-500/30 p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2
                id="summary-title"
                className="text-sm font-black text-amber-400 uppercase tracking-widest flex items-center gap-2"
              >
                <BarChart2 className="w-4 h-4 text-amber-400" />
                SCORE SUMMARY
              </h2>
              <span className="text-xs font-mono font-bold text-amber-400">
                {completedCount} / {totalCount}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  TOTAL CONTESTANTS
                </span>
                <span className="text-2xl font-mono font-black text-white">{totalCount}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/30">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  COMPLETED
                </span>
                <span className="text-2xl font-mono font-black text-emerald-400">
                  {completedCount}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  PENDING
                </span>
                <span className="text-2xl font-mono font-black text-amber-300">
                  {pendingCount}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  ACTIVE JUDGES
                </span>
                <span className="text-2xl font-mono font-black text-white">
                  {activeJudges.length}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-slate-400">SCORING PROGRESS</span>
                <span className="text-amber-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500 shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {completedCount === totalCount && (
                <p className="text-[11px] font-black text-emerald-400 tracking-wider uppercase text-center pt-1">
                  🎉 ALL 24 CONTESTANTS COMPLETED • READY FOR FINAL AWARDS
                </p>
              )}
            </div>
          </section>

          {/* 26. SAVED DATA TABLE */}
          <section
            aria-labelledby="saved-data-title"
            className="rounded-3xl bg-[#0e111d]/90 border border-amber-500/30 p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2
                id="saved-data-title"
                className="text-sm font-black text-amber-400 uppercase tracking-widest flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-amber-400" />
                SAVED DATA ({completedCount})
              </h2>

              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                EXCEL
              </button>
            </div>

            {/* Scrollable Compact Table */}
            <div className="max-h-64 overflow-x-auto overflow-y-auto rounded-xl border border-white/10 bg-black/40">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121626] text-slate-400 text-[10px] uppercase font-bold sticky top-0 border-b border-white/10">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Contestant</th>
                    <th className="p-2.5">Cat</th>
                    <th className="p-2.5 text-center">Avg</th>
                    <th className="p-2.5 text-center">Pred</th>
                    <th className="p-2.5 text-center">Result</th>
                    <th className="p-2.5 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {Object.values(savedRecords).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-500 italic font-sans">
                        No contestant scores saved yet.
                      </td>
                    </tr>
                  ) : (
                    Object.values(savedRecords).map((rec) => (
                      <tr
                        key={rec.contestantId}
                        onClick={() => handleSelectContestant(rec.contestantId)}
                        className={`hover:bg-amber-500/10 cursor-pointer transition-colors ${
                          rec.contestantId === selectedContestantId ? 'bg-amber-500/15' : ''
                        }`}
                      >
                        <td className="p-2.5 font-bold text-amber-400">{rec.contestantId}</td>
                        <td className="p-2.5 font-sans font-bold text-white truncate max-w-[120px]">
                          {rec.contestantName}
                        </td>
                        <td className="p-2.5 font-sans text-slate-400 truncate max-w-[80px]">
                          {rec.category}
                        </td>
                        <td className="p-2.5 text-center font-bold text-amber-300">
                          {rec.roundedAverage}
                        </td>
                        <td className="p-2.5 text-center text-slate-300">
                          {rec.contestantPrediction || '—'}
                        </td>
                        <td className="p-2.5 text-center">
                          {rec.result === 'WIN' ? (
                            <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              WIN
                            </span>
                          ) : rec.result === 'LOSE' ? (
                            <span className="text-[10px] font-black text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                              LOSE
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="p-2.5 text-right text-[10px] text-slate-400">
                          {rec.savedAt}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 30. Danger Zone: Reset All Data */}
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowResetAllModal(true)}
                className="text-xs text-red-400 hover:text-red-300 font-semibold tracking-wider hover:underline transition-all cursor-pointer"
              >
                RESET ALL SCORING DATA
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* ============================================================
          MODALS & DIALOGS
          ============================================================ */}

      {/* 13. Add Judge Modal */}
      {showAddJudgeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <form
            onSubmit={handleAddJudge}
            className="max-w-md w-full rounded-3xl bg-[#0e111d] border border-amber-500/40 p-6 sm:p-8 space-y-5 shadow-[0_0_60px_rgba(0,0,0,0.9)]"
          >
            <div className="flex items-center gap-2.5 text-amber-400">
              <Plus className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-bebas tracking-wider text-white">ADD NEW JUDGE</h3>
            </div>

            <p className="text-xs text-slate-300">
              Add an additional panel member. They will be included in the arithmetic mean calculation for future scores.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Judge Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ROHIT SHARMA"
                  value={newJudgeName}
                  onChange={(e) => setNewJudgeName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 uppercase font-bold"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Role / Designation (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Celebrity Guest Judge"
                  value={newJudgeRole}
                  onChange={(e) => setNewJudgeRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddJudgeModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider shadow-md"
              >
                ADD JUDGE
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 19. Unsaved Changes Warning Modal */}
      {showUnsavedWarningModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="max-w-md w-full rounded-3xl bg-[#0e111d] border border-amber-500/50 p-6 sm:p-8 space-y-5 shadow-[0_0_60px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-bebas tracking-wider text-white">
                UNSAVED SCORE CHANGES
              </h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Unsaved score changes for <strong>{currentContestant.name}</strong> will be lost if you switch without clicking <strong>SAVE SCORE</strong>.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPendingContestantSwitch(null);
                  setShowUnsavedWarningModal(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmContestantSwitch}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider shadow-lg"
              >
                DISCARD & CONTINUE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 30. Reset All Data Confirmation Modal */}
      {showResetAllModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="max-w-md w-full rounded-3xl bg-[#0e111d] border border-red-500/50 p-6 sm:p-8 space-y-5 shadow-[0_0_60px_rgba(239,68,68,0.5)]">
            <div className="flex items-center gap-3 text-red-400">
              <AlertOctagon className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-bebas tracking-wider text-white">
                RESET ALL SCORING DATA
              </h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Are you sure? This will permanently clear the current Computer Ji scoring session and wipe all saved records for all 24 contestants.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetAllModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmResetAll}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider shadow-lg"
              >
                RESET ALL DATA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer System Strip */}
      <footer className="border-t border-white/5 bg-[#04050a] px-4 py-3 text-center text-[10px] text-slate-500 font-mono tracking-wider">
        GORAKHPUR’S GOT LATENT • COMPUTER JI LIVE OPERATOR SYSTEM • VERSION 2.0
      </footer>
    </div>
  );
}
