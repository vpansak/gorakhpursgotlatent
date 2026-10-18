'use client';

import Link from 'next/link';
import { CalendarDays, MapPin, Sparkles, Ticket } from 'lucide-react';

export default function UpcomingEventsPage() {
  return (
    <main className="min-h-[70vh] overflow-hidden bg-[#050506] text-white">
      <section className="relative border-b border-amber-400/15 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.14),transparent_55%),radial-gradient(ellipse_at_30%_50%,rgba(185,28,28,0.10),transparent_50%)] px-4 py-14 sm:px-6 sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/[0.07] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300"><Sparkles className="h-4 w-4" /> Discover what&apos;s happening</div>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.05] sm:text-6xl">Upcoming Events <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-400 bg-clip-text text-transparent">in Gorakhpur</span></h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">Discover upcoming Gorakhpur&apos;s Got Latent shows, auditions, and community activities. Official announcements will be shared here.</p>
          <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-white/75">
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"><MapPin className="h-4 w-4 text-amber-300" /> Gorakhpur, Uttar Pradesh</span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"><CalendarDays className="h-4 w-4 text-amber-300" /> Official GGL updates</span>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-3xl border border-amber-300/20 bg-gradient-to-br from-[#171014] via-[#0c0c10] to-[#11100b] p-7 text-center shadow-[0_25px_80px_rgba(0,0,0,.35)] sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-300/25 bg-amber-300/10 text-amber-300"><CalendarDays className="h-8 w-8" /></div>
          <h2 className="mt-6 text-2xl font-black sm:text-3xl">New events will be announced soon</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">We&apos;re preparing upcoming GGL experiences. Check our official channels for confirmed dates, venues, auditions, and ticket announcements. We&apos;ll update this page when details are officially available.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/apply/performer" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-extrabold text-black transition hover:bg-amber-300"><Sparkles className="h-4 w-4" /> Apply as Performer</Link>
            <Link href="/bookticket" className="inline-flex items-center gap-2 rounded-xl border border-amber-300/40 px-5 py-3 font-extrabold text-amber-200 transition hover:bg-amber-300/10"><Ticket className="h-4 w-4" /> Book Ticket</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
