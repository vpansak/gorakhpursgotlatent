'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, AlertCircle } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
}

export default function Episode2CountdownTimer({ title = "EPISODE 2 AUDITIONS LIVE COUNTDOWN" }: { title?: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: false });

  useEffect(() => {
    // Target: October 2, 2026 at 10:00 AM IST
    const targetDate = new Date('2026-10-02T10:00:00+05:30').getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isLive: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-950/60 via-slate-900 to-black shadow-[0_0_35px_rgba(245,158,11,0.2)] text-center space-y-5 max-w-3xl mx-auto my-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/40 shadow-sm animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-400" /> {title}
        </div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/40">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" /> 02 OCTOBER 2026 @ 10:00 AM IST
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
          Performer Registration Goes Live In:
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          02 October 2026 ko subah 10:00 AM se registration live ho jayegi. Aap sabhi apna video clip & details ready rakhein!
        </p>
      </div>

      {timeLeft.isLive ? (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-black text-lg sm:text-2xl animate-bounce">
          🎉 EPISODE 2 REGISTRATION IS NOW LIVE! APPLY BELOW 🎉
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto font-mono">
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-center space-y-1">
            <span className="text-2xl sm:text-4xl font-black text-amber-300 block">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-sans font-bold uppercase block">DAYS</span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-center space-y-1">
            <span className="text-2xl sm:text-4xl font-black text-amber-300 block">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-sans font-bold uppercase block">HOURS</span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-center space-y-1">
            <span className="text-2xl sm:text-4xl font-black text-amber-300 block">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-sans font-bold uppercase block">MINUTES</span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-center space-y-1">
            <span className="text-2xl sm:text-4xl font-black text-emerald-400 block">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-sans font-bold uppercase block">SECONDS</span>
          </div>
        </div>
      )}

      <div className="p-3 rounded-2xl bg-black/60 border border-white/10 text-[11px] sm:text-xs text-amber-200/90 flex items-center justify-center gap-2 max-w-xl mx-auto">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>Auditions are FREE to submit. Selection & shortlisting hone ke baad payment details communicate kiya jayega.</span>
      </div>
    </div>
  );
}
