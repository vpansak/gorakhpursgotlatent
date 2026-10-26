 'use client';
import { useEffect, useState } from 'react';
import { EPISODE_2, getRecordingCountdown } from '@/lib/episode2';
interface CountdownTimerProps { targetDate?: string; venue?: string; city?: string }
export default function CountdownTimer({ targetDate = EPISODE_2.startDate, venue = EPISODE_2.venue, city = 'Gorakhpur' }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState<ReturnType<typeof getRecordingCountdown> | null>(null);
  useEffect(() => {
    const tick = () => setRemaining(getRecordingCountdown(targetDate, Date.now()));
    tick(); const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [targetDate]);
  return <section aria-label="Episode 2 recording countdown" className="mx-auto my-6 w-full max-w-3xl rounded-2xl border border-amber-400/30 bg-black/60 p-5 text-center sm:p-6">
    <p className="text-xs font-black uppercase tracking-widest text-amber-300">Episode 2 · Recording starts</p>
    <p className="mt-2 text-lg font-black text-white sm:text-xl"><time dateTime={targetDate}>Tuesday, 3 November 2026 · 1:00 PM IST</time></p>
    <p className="mt-1 text-sm text-slate-300">{venue}, {city}</p>
    {remaining?.started ? <p className="mt-4 font-bold text-amber-300">The scheduled recording time has arrived.</p> :
      <div role="timer" aria-label="Time until Episode 2 recording" className="mx-auto mt-4 grid max-w-md grid-cols-4 gap-2">
        {(['days', 'hours', 'minutes', 'seconds'] as const).map(unit => <div key={unit} className="min-w-0 rounded-xl border border-amber-400/20 bg-white/[.04] px-1 py-3">
          <span data-countdown-unit={unit} className="block font-mono text-2xl font-black tabular-nums text-amber-200 sm:text-3xl">{remaining ? String(remaining[unit]).padStart(2, '0') : '—'}</span>
          <span className="block text-[9px] font-bold uppercase text-slate-400 sm:text-xs">{unit}</span>
        </div>)}
      </div>}
  </section>;
}
