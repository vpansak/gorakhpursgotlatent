'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { SOUND_EFFECTS, stopAllComputerJiSounds } from '@/lib/computerji-sounds';
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
  Square,
  Volume2,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';


// ============================================================
// Episode 2 roster from the nine-artist PDF; separate IDs preserve Episode 1 scores.
// ============================================================
export interface Contestant {
  id: number;
  name: string;
  category: string;
  phone: string;
  note?: string;
}

const EPISODE_2_CONTESTANTS: Contestant[] = [
  {
    "id": 2001,
    "name": "Arpit Kumar",
    "category": "Singer + sketch artist",
    "phone": "",
    "note": "Lyrics bhoolte hain; Spiderman ko guard ne bhagaya."
  },
  {
    "id": 2002,
    "name": "Sahil Babu",
    "category": "Bhojpuri singer / writer",
    "phone": "",
    "note": "Gaane jaldi pakadte hain; khud lyrics bhi likhte hain."
  },
  {
    "id": 2003,
    "name": "Aham Kumar Sharma",
    "category": "Stand-up comedian",
    "phone": "",
    "note": "Principal ki bike se cake lene gaye; self-roast ready."
  },
  {
    "id": 2004,
    "name": "Adarsh Kumar Mishra",
    "category": "Comedy + mimicry",
    "phone": "",
    "note": "Khud ko Episode 2 winner bolte hain; crush ke saamne daant."
  },
  {
    "id": 2005,
    "name": "Divyanshu Dubey",
    "category": "Roaster / content creator",
    "phone": "",
    "note": "Har situation mein comedy; spontaneous roast specialist."
  },
  {
    "id": 2006,
    "name": "Asara Satyarthi",
    "category": "Multi-talented performer",
    "phone": "",
    "note": "Painting, poetry, music, dance; purani mulaqat bhool gayin."
  },
  {
    "id": 2007,
    "name": "Katyayani Tiwari",
    "category": "Folk singer",
    "phone": "",
    "note": "Singing se pyaar; comedy aur roasting mein comfort kam."
  },
  {
    "id": 2008,
    "name": "Abhay Jaiswal",
    "category": "Semi-trained singer",
    "phone": "",
    "note": "280 kg deadlift; mimicry; elevator se darr; title Lamboo."
  },
  {
    "id": 2009,
    "name": "Kajal Chauhan",
    "category": "Singer / songwriter",
    "phone": "",
    "note": "Gaane likhti aur gaati hain; Bollywood singer banne ka dream."
  }
];

export interface Judge {
  id: string;
  name: string;
  role?: string;
  isActive: boolean;
}

const DEFAULT_JUDGES: Judge[] = [];

const CORE_JUDGE_IDS = new Set<string>();

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
  savedAtTimestamp?: number;
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

/**
 * Strict validator for score inputs (Judge & Contestant prediction):
 * - Allowed: strictly 1 to 10.
 * - Typing 11, 12, 13, 20 etc. is strictly blocked (returns null so state does not change).
 * - Cannot start with 0 (no 0, 00, 0.5).
 * - Intermediate dot allowed (e.g. '7.') to enable typing '7.5'.
 * - At most 1 decimal digit allowed.
 */
function filterScoreInput(newVal: string): string | null {
  if (newVal === '') return '';
  const trimmed = newVal.trim();
  if (!/^\d*\.?\d*$/.test(trimmed)) return null;
  if (trimmed.startsWith('0')) return null;
  if (trimmed.endsWith('.')) {
    const num = parseFloat(trimmed.slice(0, -1));
    if (isNaN(num) || num < 1 || num >= 10) return null;
    return trimmed;
  }
  const num = parseFloat(trimmed);
  if (isNaN(num)) return null;
  if (num > 10 || num < 1) return null;
  const parts = trimmed.split('.');
  if (parts.length === 2 && parts[1].length > 1) return null;
  return trimmed;
}

const STORAGE_KEY_SCORES = 'ggl_computerji_ep3_scores_v1';
const STORAGE_KEY_JUDGES = 'ggl_computerji_ep2_judges_v1';
const STORAGE_KEY_CONTESTANTS = 'ggl_computerji_ep2_contestants_v1';
const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000;

export default function ComputerJiControlPanel() {
  // Single-PIN operator unlock; never render the access code in the login UI.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState<boolean>(false);

  // Judges & Contestants state
  const [contestants, setContestants] = useState<Contestant[]>(EPISODE_2_CONTESTANTS);
  const [showAddContestantModal, setShowAddContestantModal] = useState(false);
  const [newContestantName, setNewContestantName] = useState('');
  const [newContestantCategory, setNewContestantCategory] = useState('');
  const [newContestantPhone, setNewContestantPhone] = useState('');
  const [judges, setJudges] = useState<Judge[]>(DEFAULT_JUDGES);
  const [selectedContestantId, setSelectedContestantId] = useState<number>(2001);
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

  // Live Soundboard State
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [soundVolume, setSoundVolume] = useState<number>(0.8);
  const soundTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlaySound = (sound: typeof SOUND_EFFECTS[0]) => {
    stopAllComputerJiSounds();
    if (soundTimeoutRef.current) clearTimeout(soundTimeoutRef.current);
    setActiveSoundId(sound.id);
    sound.play(soundVolume);

    soundTimeoutRef.current = setTimeout(() => {
      setActiveSoundId(null);
    }, 3800);
  };

  const handleStopAllSounds = () => {
    stopAllComputerJiSounds();
    if (soundTimeoutRef.current) clearTimeout(soundTimeoutRef.current);
    setActiveSoundId(null);
  };

  // Check operator authentication session on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('ggl_computerji_auth_v1');
      if (stored === 'verified') {
        setIsAuthenticated(true);
      }
    } catch (e) { }
    setAuthChecking(false);
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmittingAuth(true);

    const cleanPass = loginPassword.trim();

    if (cleanPass === '1100') {
      try {
        sessionStorage.setItem('ggl_computerji_auth_v1', 'verified');
      } catch (err) { }
      setIsAuthenticated(true);
      setIsSubmittingAuth(false);
    } else {
      setAuthError('गलत PIN। कृपया दोबारा कोशिश करें।');
      setIsSubmittingAuth(false);
    }
  };

  const handleLockConsole = () => {
    try {
      sessionStorage.removeItem('ggl_computerji_auth_v1');
    } catch (err) { }
    setIsAuthenticated(false);
    setLoginPassword('');
    setAuthError(null);
  };

  // Background sync to Neon DB / Admin Console
  const syncRecordToBackend = async (rec: SavedScoringRecord) => {
    try {
      await fetch('/api/computerji/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rec),
      });
    } catch (err) {
      console.error('Failed to sync score to backend:', err);
    }
  };

  // Load from localStorage & Server on mount with 10-day TTL auto-cleanup
  useEffect(() => {
    const now = Date.now();
    try {
      const storedContestants = localStorage.getItem(STORAGE_KEY_CONTESTANTS);
      if (storedContestants) {
        const parsed = JSON.parse(storedContestants);
        if (Array.isArray(parsed)) {
          const additions = parsed.filter((c) => Number.isInteger(c.id) && c.id > 2009 && c.id < 3000 && typeof c.name === 'string' && c.name.trim() && typeof c.category === 'string' && typeof c.phone === 'string');
          setContestants([...EPISODE_2_CONTESTANTS, ...additions]);
        }
      }
      const storedJudges = localStorage.getItem(STORAGE_KEY_JUDGES);
      if (storedJudges) {
        const parsed = JSON.parse(storedJudges);
        if (Array.isArray(parsed) && parsed.every((j) => typeof j.id === 'string' && typeof j.name === 'string')) setJudges(parsed);
      }

      const storedRecords = localStorage.getItem(STORAGE_KEY_SCORES);
      if (storedRecords) {
        const parsed = JSON.parse(storedRecords);
        if (parsed && typeof parsed === 'object') {
          const validMap: Record<number, SavedScoringRecord> = {};
          for (const [k, v] of Object.entries(parsed as Record<string, SavedScoringRecord>)) {
            // 10-day auto delete
            if (!v.savedAtTimestamp || now - v.savedAtTimestamp < TEN_DAYS_MS) {
              validMap[Number(k)] = v;
            }
          }
          setSavedRecords(validMap);
          const keys = Object.keys(validMap);
          if (keys.length > 0) {
            const last = validMap[Number(keys[keys.length - 1])];
            if (last?.savedAt) setLastSavedTime(last.savedAt);
          }
          localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(validMap));
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Also fetch from server / database (which runs 10-day auto-purge on query)
    fetch('/api/computerji/scores')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          const backendMap: Record<number, SavedScoringRecord> = {};
          json.data.forEach((row: any) => {
            if (row.contestant_id < 2001 || row.contestant_id >= 3000) return;
            backendMap[row.contestant_id] = {
              contestantId: row.contestant_id,
              contestantName: row.contestant_name,
              category: row.category,
              phone: row.phone,
              judgeScores: row.judge_scores || {},
              rawAverage: row.raw_average,
              roundedAverage: row.rounded_average,
              contestantScore: row.contestant_score,
              result: row.result,
              status: 'COMPLETED',
              savedAt: row.saved_at,
              savedAtTimestamp: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
            };
          });
          setSavedRecords((prev) => {
            const merged = { ...backendMap, ...prev };
            try {
              localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(merged));
            } catch (err) { }
            return merged;
          });
        }
      })
      .catch((err) => console.error('Failed to sync scores from server:', err));
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
    return contestants.find((c) => c.id === selectedContestantId) || contestants[0];
  }, [selectedContestantId, contestants]);

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
    if (!q) return contestants;
    return contestants.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }, [searchQuery, contestants]);

  const handleJudgeScoreChange = (judgeId: string, val: string) => {
    setPanelError(null);
    const sanitized = filterScoreInput(val);
    if (sanitized === null) {
      // Strictly block values > 10 like 11, 12, 13, 20 etc.
      return;
    }
    setJudgeScores((prev) => ({ ...prev, [judgeId]: sanitized }));
    if (computerJiAverage !== null || isRevealed) {
      setComputerJiAverage(null);
      setRawAverage(null);
      setIsRevealed(false);
    }
  };

  const handleJudgeScoreBlur = (judgeId: string) => {
    const cur = judgeScores[judgeId];
    if (cur && cur.endsWith('.')) {
      setJudgeScores((prev) => ({ ...prev, [judgeId]: cur.slice(0, -1) }));
    }
  };

  const handleContestantScoreChange = (val: string) => {
    setPanelError(null);
    const sanitized = filterScoreInput(val);
    if (sanitized === null) {
      // Strictly block values > 10 like 11, 12, 13, 20 etc.
      return;
    }
    setContestantScoreInput(sanitized);
    setIsRevealed(false);
  };

  const handleContestantScoreBlur = () => {
    if (contestantScoreInput.endsWith('.')) {
      setContestantScoreInput(contestantScoreInput.slice(0, -1));
    }
  };

  const activeJudges = useMemo(() => judges.filter((j) => j.isActive), [judges]);

  // Calculate Average
  const handleCalculateAverage = () => {
    setPanelError(null);
    if (activeJudges.length === 0) {
      setPanelError('Add a judge name before scoring.');
      return;
    }
    const missing = activeJudges.filter((j) => {
      const val = judgeScores[j.id]?.trim();
      return val === undefined || val === '' || isNaN(Number(val));
    });

    if (missing.length > 0) {
      setPanelError('Please enter scores (1-10) for all active judges.');
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

  // Reveal Report & AUTOMATICALLY SAVE! (No need to click save button)
  const handleReveal = () => {
    setPanelError(null);
    if (activeJudges.length === 0) {
      setPanelError('Add a judge name before scoring.');
      return;
    }

    const missing = activeJudges.filter((j) => {
      const val = judgeScores[j.id]?.trim();
      return val === undefined || val === '' || isNaN(Number(val));
    });

    if (missing.length > 0) {
      setPanelError('Please enter scores (1-10) for all active judges.');
      return;
    }

    if (!contestantScoreInput || !isValidScore(contestantScoreInput)) {
      setPanelError('Please enter a valid contestant score (1-10 in 0.5 steps).');
      return;
    }

    const parsed = activeJudges.map((j) => Number(judgeScores[j.id].trim()));
    const sum = parsed.reduce((acc, curr) => acc + curr, 0);
    const calculatedRaw = sum / parsed.length;
    const calculatedRounded = roundToNearestHalf(calculatedRaw);

    setRawAverage(calculatedRaw);
    setComputerJiAverage(calculatedRounded);
    setIsRevealed(true);

    const contNum = Number(contestantScoreInput.trim());
    const result: 'WIN' | 'LOSE' = contNum === calculatedRounded ? 'WIN' : 'LOSE';

    if (result === 'WIN') {
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFC107', '#FFA000', '#FFFFFF', '#EF4444'],
          disableForReducedMotion: true,
        });
      } catch (err) { }
    }

    // AUTOMATICALLY SAVE: User does not need to click Save button!
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
      rawAverage: Number(calculatedRaw.toFixed(2)),
      roundedAverage: calculatedRounded,
      contestantScore: contestantScoreInput.trim(),
      result,
      status: 'COMPLETED',
      savedAt: nowTime,
      savedAtTimestamp: Date.now(),
    };

    const updated = {
      ...savedRecords,
      [currentContestant.id]: newRecord,
    };

    setSavedRecords(updated);
    saveRecordsToStorage(updated);
    setLastSavedTime(nowTime);
    setSaveSuccessMsg(true);

    // Sync to backend / Neon DB automatically (retained for 10 days)
    syncRecordToBackend(newRecord);

    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  // Save Score & Proceed to Next Contestant
  const handleSaveAndNext = (advanceToNext: boolean = false) => {
    setPanelError(null);
    if (activeJudges.length === 0) {
      setPanelError('Add a judge name before scoring.');
      return;
    }

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
      savedAtTimestamp: Date.now(),
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

    // Sync to backend / Neon DB
    syncRecordToBackend(newRecord);

    setTimeout(() => setSaveSuccessMsg(false), 2500);

    if (advanceToNext) {
      // Find next pending contestant or next ID
      const nextPending = contestants.find(
        (c) => c.id > currentContestant.id && !updated[c.id]
      ) || contestants.find((c) => !updated[c.id]);

      if (nextPending) {
        setSelectedContestantId(nextPending.id);
      } else if (currentContestant.id < Math.max(...contestants.map((c) => c.id))) {
        setSelectedContestantId(currentContestant.id + 1);
      }
    }
  };

  const handleAddContestant = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newContestantName.trim();
    if (!name) return;
    const id = Math.max(...contestants.map((c) => c.id)) + 1;
    if (id >= 3000) return;
    const updated = [...contestants, { id, name, category: newContestantCategory.trim() || 'To be confirmed', phone: newContestantPhone.trim() }];
    try {
      localStorage.setItem(STORAGE_KEY_CONTESTANTS, JSON.stringify(updated));
    } catch {
      setPanelError('Could not save contestant. Please allow browser storage and try again.');
      return;
    }
    setContestants(updated);
    setSelectedContestantId(id);
    setSearchQuery('');
    setShowAddContestantModal(false);
    setIsDropdownOpen(false);
    setNewContestantName('');
    setNewContestantCategory('');
    setNewContestantPhone('');
  };

  // Add Judge
  const handleAddJudge = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newJudgeName.trim().toUpperCase();
    if (!trimmed) return;
    const newId = `j_${Date.now()}`;
    const newJudge: Judge = { id: newId, name: trimmed, isActive: true };
    setJudges([...judges, newJudge]);
    setComputerJiAverage(null);
    setRawAverage(null);
    setIsRevealed(false);
    setJudgeScores((prev) => ({ ...prev, [newId]: '' }));
    setNewJudgeName('');
    setShowAddJudgeModal(false);
  };

  // Delete Additional Judge
  const handleDeleteJudge = (judgeId: string) => {
    if (CORE_JUDGE_IDS.has(judgeId)) return;
    const updated = judges.filter((j) => j.id !== judgeId);
    setJudges(updated);
    setComputerJiAverage(null);
    setRawAverage(null);
    setIsRevealed(false);
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
        rec.contestantId - 2000,
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
    link.setAttribute('download', 'GGL-Episode2-ComputerJi-Scoring.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const completedCount = Object.keys(savedRecords).length;
  const totalCount = contestants.length;
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWin =
    isRevealed &&
    computerJiAverage !== null &&
    Number(contestantScoreInput.trim()) === computerJiAverage;

  if (authChecking) {
    return (
      <div className="h-screen bg-[#07080e] flex items-center justify-center text-amber-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
            Verifying Operator Credentials...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07080e] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden selection:bg-amber-500 selection:text-black">
        {/* Glow ambient background lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md rounded-3xl bg-[#0b0e1b]/95 border border-amber-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.5)] mb-3">
              <Lock className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-widest">
              🔒 RESTRICTED OPERATOR CONSOLE
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-barlow">
              COMPUTER JI LOGIN
            </h1>
            <p className="text-xs text-slate-400">
              Gorakhpur's Got Latent · अधिकृत ऑपरेटर कंसोल
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Access PIN / पिन
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="PIN डालें"
                  inputMode="numeric"
                  autoComplete="off"
                  autoFocus
                  maxLength={4}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-amber-400 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmittingAuth || loginPassword.length !== 4}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 active:scale-98 text-black font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4 stroke-[2.5]" />
              <span>UNLOCK COMPUTER JI · कंसोल खोलें</span>
            </button>
          </form>

          {/* Quick info footer */}
          <div className="pt-2 border-t border-white/10 text-center">
            <span className="text-[10px] text-slate-500 font-mono">
              Live scoring & auto-backup to Malik admin console active (10-day retention)
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-[#07080e] text-slate-100 flex flex-col justify-between overflow-y-auto lg:overflow-hidden p-2 sm:p-3 selection:bg-amber-500 selection:text-black">
      {/* ============================================================
          TOP SOUNDBOARD STRIP (Replaces old navbar in exact same space)
          ============================================================ */}
      <header className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 rounded-2xl bg-[#0b0e1b] border border-amber-500/30 shrink-0 gap-2 shadow-2xl">
        {/* Left: Brand Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-sm flex items-center justify-center shadow-[0_0_12px_rgba(255,215,0,0.5)]">
            🎙️
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-black tracking-wider text-amber-400 uppercase block font-barlow leading-none">
              GGL SOUNDBOARD
            </span>
            <span className="text-[9px] text-slate-400 font-mono">
              Live Sound Effects
            </span>
          </div>
        </div>

        {/* Center: 9 Sound Effect Buttons (Sad, Crowd, Laugh, Funny Effects) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 px-1 scrollbar-none flex-1 justify-start md:justify-center">
          {SOUND_EFFECTS.map((s) => {
            const isPlaying = activeSoundId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handlePlaySound(s)}
                className={`px-2.5 py-1.5 rounded-xl font-black text-[11px] sm:text-xs transition-all flex items-center gap-1.5 border whitespace-nowrap cursor-pointer active:scale-95 shadow-sm ${isPlaying
                    ? `${s.color} ring-2 ring-white scale-105 animate-pulse shadow-lg`
                    : 'bg-white/5 hover:bg-white/15 text-slate-200 border-white/10 hover:border-amber-400/40'
                  }`}
                title={`Play ${s.label} (${s.desc})`}
              >
                <span>{s.label}</span>
                {isPlaying && (
                  <span className="flex items-center gap-0.5 ml-0.5">
                    <span className="w-1 h-2 bg-current animate-bounce rounded-full" />
                    <span className="w-1 h-3 bg-current animate-bounce delay-75 rounded-full" />
                    <span className="w-1 h-1.5 bg-current animate-bounce delay-150 rounded-full" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Stop SFX, Status, Lock & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleStopAllSounds}
            className="px-2.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-[10px] sm:text-[11px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer active:scale-95"
            title="Stop all currently playing sounds"
          >
            <Square className="w-3 h-3 fill-current" />
            <span className="hidden lg:inline">STOP SFX</span>
          </button>

          <div className="h-5 w-px bg-white/10 hidden xl:block" />

          <div className="text-[11px] font-mono text-slate-300 hidden xl:block">
            Saved: <strong className="text-emerald-400 font-bold">{completedCount}/{totalCount}</strong>
          </div>

          <button
            type="button"
            onClick={handleLockConsole}
            className="px-2 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer active:scale-95"
            title="Lock Operator Console"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">LOCK</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetAllModal(true)}
            className="text-[10px] text-slate-500 hover:text-red-400 font-bold uppercase transition-colors px-1 cursor-pointer"
            title="Reset All Scores"
          >
            Reset
          </button>
        </div>
      </header>


      {/* ============================================================
          MAIN BODY GRID (FITS IN SINGLE SCREEN WITHOUT SCROLLING)
          Layout:
          TOP ROW: [ JUDGE SCORES (Left) ] | [ SELECT CONTESTANT (Right) ]
          BOTTOM ROW: [ SAVED DATA (Left) ] | [ TIMER 2 MIN ] | [ REPORT & NEXT (Right) ]
          ============================================================ */}
      <main className="flex-none lg:flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2.5 my-2 min-h-0 overflow-visible lg:overflow-hidden">
        {/* ==========================================================
            CARD 1: JUDGE SCORES (Left Top, 6 cols)
            ========================================================== */}
        <section
          aria-labelledby="judge-scores-heading"
          className="lg:col-span-6 rounded-2xl bg-[#0e111d]/95 border border-amber-500/30 p-3 flex flex-col justify-between shadow-xl min-h-[250px] lg:min-h-0 overflow-visible lg:overflow-hidden"
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
              Add Judge
            </button>
          </div>

          {/* Judges List (Scrollable internally if many judges, won't scroll page) */}
          <div className="flex-1 overflow-y-auto space-y-1.5 py-1.5 pr-1 min-h-0">
            {judges.length === 0 && (
              <div className="p-4 text-sm text-slate-300">
                Judge names to be confirmed. Use <strong className="text-amber-400">Add Judge</strong> when ready.
              </div>
            )}
            {judges.map((judge, idx) => (
              <div
                key={judge.id}
                className={`flex items-center justify-between px-2.5 py-1 rounded-xl border transition-all ${judge.isActive
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
                      type="text"
                      inputMode="decimal"
                      placeholder="1-10"
                      value={judgeScores[judge.id] || ''}
                      onChange={(e) => handleJudgeScoreChange(judge.id, e.target.value)}
                      onBlur={() => handleJudgeScoreBlur(judge.id)}
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
          className="lg:col-span-6 rounded-2xl bg-[#0e111d]/95 border border-amber-500/30 p-3 flex flex-col justify-between shadow-xl min-h-[250px] lg:min-h-0 overflow-visible lg:overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 shrink-0">
            <h2
              id="contestant-heading"
              className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              EPISODE 2 · SELECT CONTESTANT ({currentContestant.id - 2000}/{totalCount})
            </h2>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${isCurrentCompleted
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
                  {currentContestant.id - 2000}
                </span>
                <span className="font-bold text-sm text-white truncate">
                  {currentContestant.name}
                </span>
                <span className="text-xs text-amber-300/80 truncate">
                  ({currentContestant.category})
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-amber-400 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''
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
                        className={`w-full flex items-center justify-between p-2 text-left text-xs transition-colors cursor-pointer ${isSel ? 'bg-amber-500/15 text-amber-300' : 'hover:bg-white/5 text-slate-200'
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
                          #{c.id - 2000}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 my-1 shrink-0">
            <button type="button" onClick={() => setShowAddContestantModal(true)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/10">
              <Plus className="w-3.5 h-3.5" /> Add contestant
            </button>
            <a href="/documents/GGL_Episode_2_Nine_Artists.pdf" target="_blank" rel="noopener noreferrer" className="text-xs text-amber-300 underline">Episode 2 · Artist PDF</a>
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
                {currentContestant.phone || 'Not provided'}
              </span>
            </div>
          </div>

          {currentContestant.note && <p className="my-1 text-[11px] text-slate-300">{currentContestant.note}</p>}

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
                type="text"
                inputMode="decimal"
                placeholder="1-10"
                value={contestantScoreInput}
                onChange={(e) => handleContestantScoreChange(e.target.value)}
                onBlur={handleContestantScoreBlur}
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
          className="lg:col-span-5 rounded-2xl bg-[#0e111d]/95 border border-amber-500/30 p-3 flex flex-col justify-between shadow-xl min-h-[250px] lg:min-h-0 overflow-visible lg:overflow-hidden"
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
                      className={`hover:bg-amber-500/10 cursor-pointer transition-colors ${rec.contestantId === selectedContestantId ? 'bg-amber-500/15' : ''
                        }`}
                    >
                      <td className="p-1.5 font-bold text-amber-400">{rec.contestantId - 2000}</td>
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
          className="lg:col-span-3 rounded-2xl bg-[#0e111d]/95 border border-amber-500/30 p-3 flex flex-col justify-between text-center shadow-xl min-h-[250px] lg:min-h-0 overflow-visible lg:overflow-hidden"
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
              className={`inline-block px-4 py-1.5 rounded-2xl bg-black/60 border ${timerSeconds === 0
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
          className="lg:col-span-4 rounded-2xl bg-[#0e111d]/95 border border-amber-500/30 p-3 flex flex-col justify-between shadow-xl min-h-[250px] lg:min-h-0 overflow-visible lg:overflow-hidden"
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
                className={`text-[9px] font-black px-1.5 py-0.5 rounded ${isWin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
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
                className={`p-2.5 rounded-xl border text-center space-y-1 ${isWin
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

      {showAddContestantModal && (
        <div role="dialog" aria-modal="true" aria-label="Add contestant" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <form onSubmit={handleAddContestant} className="max-w-sm w-full rounded-2xl bg-[#0e111d] border border-amber-500/40 p-5 space-y-3 shadow-2xl">
            <h3 className="text-lg font-bold text-amber-400">Add contestant · Episode 2</h3>
            <label className="block text-xs text-slate-300">Full name
              <input autoFocus required maxLength={150} value={newContestantName} onChange={(e) => setNewContestantName(e.target.value)} className="mt-1 w-full p-2 rounded-lg bg-black/60 border border-white/20 text-white" />
            </label>
            <label className="block text-xs text-slate-300">Category
              <input maxLength={150} value={newContestantCategory} onChange={(e) => setNewContestantCategory(e.target.value)} className="mt-1 w-full p-2 rounded-lg bg-black/60 border border-white/20 text-white" />
            </label>
            <label className="block text-xs text-slate-300">Phone (optional)
              <input type="tel" maxLength={30} value={newContestantPhone} onChange={(e) => setNewContestantPhone(e.target.value)} className="mt-1 w-full p-2 rounded-lg bg-black/60 border border-white/20 text-white" />
            </label>
            <p className="text-xs text-slate-400">Added contestants stay saved in this browser.</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddContestantModal(false)} className="px-3 py-2 text-slate-300">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold">Add contestant</button>
            </div>
          </form>
        </div>
      )}

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
