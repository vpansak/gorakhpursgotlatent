"use client";

import { Ticket } from 'lucide-react';

export default function Loading() {
  return (
    <main className="min-h-[70vh] bg-[#07080e] text-white px-4 py-8">
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="h-8 w-56 rounded-lg bg-slate-800/80 mb-4" />
        <div className="h-4 w-80 max-w-full rounded bg-slate-800/60 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-amber-500/10 bg-slate-900/50 p-5 min-h-44">
              <div className="h-6 w-2/3 rounded bg-slate-800/80 mb-4" />
              <div className="h-4 w-full rounded bg-slate-800/60 mb-2" />
              <div className="h-4 w-5/6 rounded bg-slate-800/60 mb-6" />
              <div className="h-10 w-32 rounded-xl bg-amber-500/20" />
            </div>
          ))}
        </div>
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 rounded-full border border-amber-500/30 bg-[#07080e]/95 px-4 py-2 text-xs text-amber-300 shadow-xl backdrop-blur-xl">
          <Ticket className="w-4 h-4" />
          Loading page…
        </div>
      </div>
    </main>
  );
}
