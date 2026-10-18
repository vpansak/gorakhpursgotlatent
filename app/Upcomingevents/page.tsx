'use client';

import Link from 'next/link';
import { CalendarDays, MapPin, Sparkles, Ticket, Compass } from 'lucide-react';

export default function UpcomingEventsPage() {
  return (
    <main className="min-h-[70vh] overflow-hidden bg-[#050506] text-white">
      <section className="relative border-b border-amber-400/15 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.14),transparent_55%),radial-gradient(ellipse_at_30%_50%,rgba(185,28,28,0.10),transparent_50%)] px-4 py-14 sm:px-6 sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/[0.07] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300"><Sparkles className="h-4 w-4" /> GGL Special Experience</div>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.05] sm:text-6xl">GGL Talent <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-400 bg-clip-text text-transparent">Tour</span></h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">A creative journey for artists and creators to connect, collaborate, make reels, enjoy music jamming and mashups, and work together on a short film.</p>
          <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-white/75">
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"><MapPin className="h-4 w-4 text-amber-300" /> Gorakhpur, Uttar Pradesh</span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"><CalendarDays className="h-4 w-4 text-amber-300" /> Tentatively late December 2026</span>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-3xl border border-amber-300/20 bg-gradient-to-br from-[#171014] via-[#0c0c10] to-[#11100b] p-7 text-center shadow-[0_25px_80px_rgba(0,0,0,.35)] sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-300/25 bg-amber-300/10 text-amber-300"><Compass className="h-8 w-8" /></div>
          <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-amber-300">GGL Special Experience</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">GGL Talent Tour</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">A creative journey for artists and creators to connect, collaborate, make reels, enjoy music jamming and mashups, and work together on a short film.</p>
          <div className="mx-auto mt-6 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><CalendarDays className="mb-2 h-5 w-5 text-amber-300" /><p className="text-xs text-white/50">Tentative schedule</p><p className="mt-1 font-bold">Late December 2026</p></div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><Compass className="mb-2 h-5 w-5 text-amber-300" /><p className="text-xs text-white/50">Planned duration</p><p className="mt-1 font-bold">7 days</p></div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><Ticket className="mb-2 h-5 w-5 text-amber-300" /><p className="text-xs text-white/50">Registration fee</p><p className="mt-1 font-bold">₹999</p></div>
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-xs leading-6 text-white/45">Dates, venue, itinerary, selection and other contribution details are tentative and will be shared with applicants through official communication.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/qwer" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-extrabold text-black transition hover:bg-amber-300"><Compass className="h-4 w-4" /> Register for Talent Tour</Link>
            <Link href="/apply/performer" className="inline-flex items-center gap-2 rounded-xl border border-amber-300/40 px-5 py-3 font-extrabold text-amber-200 transition hover:bg-amber-300/10"><Sparkles className="h-4 w-4" /> Apply as Performer</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
