import Link from 'next/link';
import type { Metadata } from 'next';

const description = "Gorakhpur's Got Latent Episode 3 registrations are open. Book audience tickets or apply as a performer. Episode 3 schedule will be announced officially.";

export const metadata: Metadata = {
  title: "GGL Episode 3 | Tickets & Performer Registration",
  description,
  alternates: { canonical: "https://www.gkpgotlatent.in/ep3" },
  openGraph: { title: "Gorakhpur's Got Latent — Episode 3", description, url: "https://www.gkpgotlatent.in/ep3", type: "website" },
};

export default function Episode3Page() {
  return <main className="min-h-screen bg-[#08090d] px-4 py-12 text-slate-200 sm:px-6 sm:py-16">
    <article className="mx-auto max-w-4xl">
      <p className="text-xs font-black uppercase tracking-[.22em] text-amber-300">Gorakhpur's Got Latent · Official Announcement</p>
      <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-6xl">EPISODE <span className="text-amber-400">3</span></h1>
      <p className="mt-5 text-lg leading-8 text-slate-300">Episode 2 is complete. The journey continues — audience ticket bookings and performer applications are now open for GGL Episode 3.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-amber-400/30 bg-amber-400/[.06] p-6">
          <h2 className="text-xl font-black text-white">Watch the show live</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Book your audience ticket through the official GGL website. Your digital ticket is issued after successful payment verification.</p>
          <Link href="/book-ticket" className="mt-5 inline-flex rounded-xl bg-amber-400 px-5 py-3 font-black text-black">BOOK EPISODE 3 TICKET →</Link>
        </section>
        <section className="rounded-2xl border border-red-400/30 bg-red-950/20 p-6">
          <h2 className="text-xl font-black text-white">Perform at GGL</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Have a unique talent, comedy act, mimicry, magic or an unusual performance? Apply online and share your performance clip with the team.</p>
          <Link href="/apply/performer" className="mt-5 inline-flex rounded-xl border border-amber-400/50 px-5 py-3 font-black text-amber-200">APPLY FOR EPISODE 3 →</Link>
          <p className="mt-4 text-[11px] leading-5 text-slate-400">Application is free. Shortlisted performers must pay ₹799 to confirm their participation.</p>
        </section>
      </div>
      <p className="mt-8 rounded-xl border border-white/10 bg-white/[.03] p-4 text-sm leading-6 text-slate-400">Episode 3 date, time and venue will be announced through GGL's official website and social channels. Please rely only on official announcements for schedule updates.</p>
      <p className="mt-5 text-sm text-slate-400">Questions? <a className="text-amber-300 underline" href="https://wa.me/918423858424">WhatsApp GGL: +91 84238 58424</a></p>
    </article>
  </main>;
}
