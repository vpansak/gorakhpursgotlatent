'use client';

import { Calendar, Clock, MapPin } from 'lucide-react';

interface CountdownTimerProps {
  targetDate?: string;
  venue?: string;
  city?: string;
}

const MAPS_URL = "https://maps.app.goo.gl/QWm9P4nPyzKHDAiX9?g_st=ac";

export default function CountdownTimer({
  venue = "Marsorbit Entertainment",
  city = "Gorakhpur"
}: CountdownTimerProps) {
  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border border-amber-500/30 backdrop-blur-2xl shadow-[0_10px_40px_rgba(255,215,0,0.12)]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            EPISODE 2 • OFFICIAL DATE
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white gold-gradient-text">
            EPISODE 2 • 31 OCTOBER 2026
          </h3>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Calendar className="w-4 h-4 text-amber-400" />
              Saturday, 31 October 2026
            </span>
            <a href={MAPS_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-200 underline decoration-amber-400/60 underline-offset-4 hover:text-amber-300">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>{venue}, {city} • Get Directions ↗</span>
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center p-4 sm:p-5 rounded-2xl bg-[#07080e]/90 border-2 border-amber-500/40 shadow-inner text-center min-w-[200px] sm:min-w-[240px]">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider inline-block">
              SAVE THE DATE
            </span>
            <div className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase pt-1">
              31 OCT 2026
            </div>
            <p className="text-[11px] font-bold text-amber-300">
              Episode 2 • Gorakhpur
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
