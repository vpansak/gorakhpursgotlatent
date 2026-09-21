'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface CountdownTimerProps {
  targetDate?: string; // e.g. "2026-11-28T17:00:00"
  venue?: string;
  city?: string;
}

export default function CountdownTimer({ targetDate = "2026-09-26T13:00:00", venue = "Gorakhpur Club Ground", city = "Gorakhpur" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    function calculateTime() {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border border-amber-500/30 backdrop-blur-2xl shadow-[0_10px_40px_rgba(255,215,0,0.12)]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Venue Info */}
        <div className="text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            NEXT SHOW COUNTDOWN
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white gold-gradient-text">
            1ST SHOW • LIVE SHOWCASE
          </h3>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <Calendar className="w-4 h-4 text-amber-400" />
              Sep 26, 2026 • 1:00 PM
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-4 h-4 text-orange-400" />
              {venue}, {city}
            </span>
          </div>
        </div>

        {/* Right Countdown Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HOURS', value: timeLeft.hours },
            { label: 'MINS', value: timeLeft.minutes },
            { label: 'SECS', value: timeLeft.seconds },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#07080e]/90 border border-amber-500/30 shadow-inner min-w-[65px] sm:min-w-[85px]"
            >
              <span className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
