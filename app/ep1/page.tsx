'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Trophy, Star, Award, Sparkles, CheckCircle2, Mic2, Music, User,
  Flame, Search, ArrowRight, ShieldCheck, ChevronDown, ChevronUp
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ContestantData {
  sNo: number;
  name: string;
  category: string;
  brijesh: number;
  somya: number;
  naveen: number;
  jahanvi: number;
  vivek: number;
  rawAverage: number;
  roundedAverage: number;
  contestantGuess: number;
  result: 'WIN' | 'LOSE';
  instagramUrl?: string;
}

const EPISODE_1_DATA: ContestantData[] = [
  { sNo: 10, name: 'Misthi Mishra', category: 'Dance', brijesh: 10, somya: 10, naveen: 10, jahanvi: 10, vivek: 10, rawAverage: 10.00, roundedAverage: 10, contestantGuess: 10, result: 'WIN', instagramUrl: 'https://www.instagram.com/misthi_mishra_23/' },
  { sNo: 22, name: 'Neha', category: 'Couple Dance', brijesh: 9, somya: 9.5, naveen: 10, jahanvi: 9, vivek: 8, rawAverage: 9.10, roundedAverage: 9, contestantGuess: 9, result: 'WIN', instagramUrl: 'https://www.instagram.com/neha237913yadav/' },
  { sNo: 11, name: 'Kirti Gupta', category: 'Singing', brijesh: 7, somya: 9.5, naveen: 10, jahanvi: 6, vivek: 7, rawAverage: 7.90, roundedAverage: 8, contestantGuess: 8, result: 'WIN', instagramUrl: 'https://www.instagram.com/risingstar_kg/' },
  { sNo: 20, name: 'Khushee Madhyeshiya', category: 'Singing', brijesh: 8, somya: 7, naveen: 8, jahanvi: 8, vivek: 8, rawAverage: 7.80, roundedAverage: 8, contestantGuess: 8, result: 'WIN' },
  { sNo: 4, name: 'Kuldeep Kumar', category: 'Singing', brijesh: 6, somya: 7, naveen: 6, jahanvi: 5, vivek: 6, rawAverage: 6.00, roundedAverage: 6, contestantGuess: 6, result: 'WIN', instagramUrl: 'https://www.instagram.com/kd_star_singer' },
  { sNo: 1, name: 'Abhay Mishra', category: 'Stand Up Comedy', brijesh: 7, somya: 6.5, naveen: 10, jahanvi: 5, vivek: 7, rawAverage: 7.10, roundedAverage: 7, contestantGuess: 8, result: 'LOSE' },
  { sNo: 2, name: 'Love Maurya', category: 'Poetry', brijesh: 8, somya: 7, naveen: 8, jahanvi: 7, vivek: 7, rawAverage: 7.40, roundedAverage: 7.5, contestantGuess: 8, result: 'LOSE' },
  { sNo: 3, name: 'Vedant Tripathi', category: 'Dance', brijesh: 9, somya: 10, naveen: 10, jahanvi: 9, vivek: 8, rawAverage: 9.20, roundedAverage: 9, contestantGuess: 10, result: 'LOSE' },
  { sNo: 5, name: 'Ayush Jaiswal', category: 'Singing', brijesh: 6, somya: 7, naveen: 6.5, jahanvi: 9, vivek: 7, rawAverage: 7.10, roundedAverage: 7, contestantGuess: 9, result: 'LOSE' },
  { sNo: 6, name: 'Aryan Kushwaha', category: 'Shayari', brijesh: 8, somya: 7, naveen: 10, jahanvi: 8, vivek: 8, rawAverage: 8.20, roundedAverage: 8, contestantGuess: 8.5, result: 'LOSE' },
  { sNo: 9, name: 'Aftab', category: 'Singing', brijesh: 8, somya: 9.5, naveen: 10, jahanvi: 10, vivek: 9, rawAverage: 9.30, roundedAverage: 9.5, contestantGuess: 9, result: 'LOSE' },
  { sNo: 12, name: 'Ashik Ansari', category: 'Poetry', brijesh: 9, somya: 9, naveen: 9, jahanvi: 10, vivek: 10, rawAverage: 9.40, roundedAverage: 9.5, contestantGuess: 8, result: 'LOSE' },
  { sNo: 13, name: 'Aradhya', category: 'Singing', brijesh: 6, somya: 8, naveen: 9, jahanvi: 6, vivek: 6, rawAverage: 7.00, roundedAverage: 7, contestantGuess: 8, result: 'LOSE' },
  { sNo: 14, name: 'Shraddha Pandey', category: 'Singing', brijesh: 9, somya: 10, naveen: 10, jahanvi: 10, vivek: 9, rawAverage: 9.60, roundedAverage: 9.5, contestantGuess: 9, result: 'LOSE' },
  { sNo: 15, name: 'Nandani Kumari', category: 'Dance', brijesh: 9, somya: 10, naveen: 10, jahanvi: 9.5, vivek: 9, rawAverage: 9.50, roundedAverage: 9.5, contestantGuess: 9, result: 'LOSE' },
  { sNo: 16, name: 'Himanshu Bhatt', category: 'Poetry', brijesh: 8, somya: 9.5, naveen: 9.5, jahanvi: 9, vivek: 10, rawAverage: 9.20, roundedAverage: 9, contestantGuess: 8, result: 'LOSE' },
  { sNo: 17, name: 'MD Arman', category: 'Mimicry', brijesh: 9, somya: 10, naveen: 9, jahanvi: 10, vivek: 10, rawAverage: 9.60, roundedAverage: 9.5, contestantGuess: 10, result: 'LOSE' },
  { sNo: 18, name: 'Rustam', category: 'Dance', brijesh: 9, somya: 10, naveen: 9, jahanvi: 10, vivek: 9, rawAverage: 9.40, roundedAverage: 9.5, contestantGuess: 9, result: 'LOSE' },
  { sNo: 19, name: 'Kritika Singh', category: 'Singing', brijesh: 8, somya: 9, naveen: 9, jahanvi: 8, vivek: 8, rawAverage: 8.40, roundedAverage: 8.5, contestantGuess: 8, result: 'LOSE' },
  { sNo: 21, name: 'Kamya Verma', category: 'Dance', brijesh: 9, somya: 7, naveen: 9, jahanvi: 9, vivek: 9, rawAverage: 8.60, roundedAverage: 8.5, contestantGuess: 8, result: 'LOSE' },
  { sNo: 23, name: 'Atul Sharma', category: 'Dance', brijesh: 10, somya: 10, naveen: 10, jahanvi: 9, vivek: 9, rawAverage: 9.60, roundedAverage: 9.5, contestantGuess: 10, result: 'LOSE' },
];

const WINNERS = EPISODE_1_DATA.filter(d => d.result === 'WIN');

export default function Episode1WinnersPage() {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [showAllTable, setShowAllTable] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      const end = Date.now() + 3 * 1000;
      const colors = ['#FFD700', '#FFA500', '#FF4500', '#10B981', '#6366F1'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch (e) {}
  }, []);

  const filteredContestants = EPISODE_1_DATA.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || c.category.toLowerCase().includes(filterCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* HEADER BANNER */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg">
          <Trophy className="w-4 h-4 text-amber-400 animate-bounce" /> EPISODE 1 OFFICIAL WINNERS ANNOUNCEMENT
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          Gorakhpur’s Got Latent <br />
          <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Episode 1 Winners & Scorecard
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Congratulations to the 5 official champions of Episode 1 who accurately matched the Judges’ Average Score on Computer Ji!
        </p>

        {/* Quick Winners Ticker */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {WINNERS.map(w => (
            <span key={w.sNo} className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {w.name} ({w.category}) • ₹1,400 Prize
            </span>
          ))}
        </div>
      </div>

      {/* 5 WINNERS SHOWCASE CARDS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" /> Episode 1 Official Winners (5 Champions)
          </h2>
          <span className="text-xs text-amber-400 font-bold uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            ₹1,400 Cash Prize Each
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WINNERS.map((winner, idx) => (
            <div
              key={winner.sNo}
              className={`relative rounded-3xl p-6 space-y-5 border transition-all duration-300 ${
                idx === 0
                  ? 'bg-gradient-to-b from-amber-950/80 via-slate-900 to-black border-amber-500/60 shadow-[0_0_35px_rgba(255,215,0,0.25)] scale-[1.02]'
                  : 'bg-slate-900/90 border-amber-500/30 hover:border-amber-400 shadow-xl'
              }`}
            >
              {/* Winner Badge */}
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Trophy className="w-3.5 h-3.5" /> WINNER #{idx + 1}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-black font-mono">
                  ₹1,400 WON
                </span>
              </div>

              {/* Winner Details */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white">{winner.name}</h3>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-amber-300 text-xs font-bold uppercase">
                    {winner.category}
                  </span>
                  {winner.instagramUrl ? (
                    <a
                      href={winner.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-black text-[11px] flex items-center gap-1 shadow-md hover:scale-105 transition-all"
                    >
                      Instagram ↗
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-500 italic">Instagram Not Provided</span>
                  )}
                </div>
              </div>

              {/* Main Score Highlights */}
              <div className="grid grid-cols-2 gap-3 bg-black/50 p-4 rounded-2xl border border-white/10 text-center">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Judges Average</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">{winner.roundedAverage.toFixed(1)}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Contestant Guess</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">{winner.contestantGuess.toFixed(1)}</span>
                  <span className="text-[10px] text-emerald-400 block font-bold">✓ EXACT MATCH</span>
                </div>
              </div>

              {/* Breakdown by 5 Judges */}
              <div className="space-y-2 text-xs border-t border-slate-800 pt-4">
                <span className="font-extrabold text-slate-400 uppercase tracking-wider block text-[11px]">
                  5 Judges Score Breakdown:
                </span>
                <div className="grid grid-cols-5 gap-1.5 text-center font-mono">
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-400 block">BRIJESH</span>
                    <strong className="text-white text-xs">{winner.brijesh}</strong>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-400 block">SOMYA</span>
                    <strong className="text-white text-xs">{winner.somya}</strong>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-400 block">NAVEEN</span>
                    <strong className="text-white text-xs">{winner.naveen}</strong>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-400 block">JAHANVI</span>
                    <strong className="text-white text-xs">{winner.jahanvi}</strong>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-400 block">VIVEK</span>
                    <strong className="text-white text-xs">{winner.vivek}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRIZE POOL DISTRIBUTION BOX - PLACED UNDER WINNERS */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-amber-500/50 bg-gradient-to-r from-amber-950/70 via-slate-900 to-black shadow-[0_0_35px_rgba(255,215,0,0.25)] max-w-4xl mx-auto space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/40 shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-400" /> OFFICIAL PRIZE POOL BREAKDOWN
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-white">
          Total Collection: <span className="text-amber-400 font-mono">₹7,000 (7K)</span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          As per official GGL rules, the total contestant entry collection of <strong className="text-amber-300 font-bold">₹7,000</strong> was divided equally among all 5 accurate score guess winners:
        </p>

        <div className="p-4 rounded-2xl bg-black/80 border border-amber-500/30 inline-flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base font-black text-white">
          <div className="flex items-center gap-2 font-mono text-amber-300">
            <span>₹7,000 Collection</span>
            <span className="text-slate-400">÷</span>
            <span>5 Winners</span>
          </div>
          <span className="text-amber-400 hidden sm:inline">=</span>
          <div className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black text-base sm:text-lg font-black tracking-wide shadow-lg">
            ₹1,400 PRIZE PER WINNER 🏆
          </div>
        </div>
      </div>

      {/* FULL EPISODE 1 CONTESTANT SCOREBOARD TABLE */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" /> Episode 1 Full Contestants Leaderboard (21 Acts)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Complete rounded average scores, contestant guesses, and judge scorecards from Episode 1.
            </p>
          </div>

          <button
            onClick={() => setShowAllTable(!showAllTable)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 transition-all shrink-0"
          >
            {showAllTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showAllTable ? 'Collapse Full Table' : 'View All 21 Contestant Scores'}
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by contestant name or talent category..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
            />
          </div>

          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-semibold focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Singing">Singing</option>
            <option value="Dance">Dance</option>
            <option value="Comedy">Stand Up Comedy</option>
            <option value="Poetry">Poetry / Shayari</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0b0e18] text-slate-400 font-black uppercase tracking-wider border-b border-white/10 text-[11px]">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Contestant Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Judges Average</th>
                <th className="py-3.5 px-4 text-center">Contestant Guess</th>
                <th className="py-3.5 px-4 text-center">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {(showAllTable ? filteredContestants : filteredContestants.slice(0, 7)).map(c => (
                <tr
                  key={c.sNo}
                  className={`hover:bg-white/5 transition-colors ${
                    c.result === 'WIN' ? 'bg-amber-500/10 font-bold' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-center text-slate-400 font-bold">{c.sNo}</td>
                  <td className="py-3 px-4 font-sans font-black text-white flex items-center gap-2">
                    {c.result === 'WIN' && <Trophy className="w-4 h-4 text-amber-400 shrink-0" />}
                    <span>{c.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{c.category}</td>
                  <td className="py-3 px-4 text-center font-bold text-amber-300">{c.roundedAverage.toFixed(1)}</td>
                  <td className="py-3 px-4 text-center font-bold text-white">{c.contestantGuess.toFixed(1)}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        c.result === 'WIN'
                          ? 'bg-amber-500 text-black shadow-md'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {c.result === 'WIN' ? '🏆 WINNER' : 'LOSE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!showAllTable && filteredContestants.length > 7 && (
          <div className="text-center pt-2">
            <button
              onClick={() => setShowAllTable(true)}
              className="text-xs text-amber-400 font-bold hover:underline"
            >
              Show remaining {filteredContestants.length - 7} contestants...
            </button>
          </div>
        )}
      </div>

      {/* FOOTER CTA BANNER */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-center text-white space-y-4 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/30 border border-white/20 text-white text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-yellow-300" /> 🎉 EPISODE 2 REGISTRATION IS LIVE
        </div>
        <h2 className="text-3xl sm:text-4xl font-black">Want To Perform On Gorakhpur’s Got Latent Stage?</h2>
        <p className="text-xs sm:text-sm text-amber-100 max-w-2xl mx-auto leading-relaxed">
          Performer registrations for Episode 2 auditions are now <strong className="text-white underline underline-offset-4 font-black">LIVE</strong>! Submit your audition details and performance clip now. Audition form submit kerna FREE hai. Select hone ke baad aage ka process communicate kiya jayega.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/apply/performer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-black hover:bg-slate-900 text-amber-400 font-black text-sm shadow-xl transition-all"
          >
            APPLY FOR EPISODE 2 AUDITION <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
