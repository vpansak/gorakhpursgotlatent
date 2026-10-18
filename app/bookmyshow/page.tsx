import type { Metadata } from 'next';
import { ExternalLink, Ticket, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Book Tickets | Gorakhpur's Got Latent",
  description: "Official event ticket links for Gorakhpur's Got Latent Episode 2 and GGL Talent Tour.",
  robots: { index: false, follow: false },
};

const events = [
  {
    label: 'EPISODE 2 TICKET',
    title: "Gorakhpur's Got Latent",
    description: 'Book your ticket for the Gorakhpur’s Got Latent live show on BookMyShow.',
    href: 'https://in.bookmyshow.com/events/gorakhpurs-got-latent/ET00522955',
    tag: 'LIVE SHOW',
  },
  {
    label: 'GGL TALENT TOUR',
    title: 'GKP Talent Tower',
    description: 'Explore the GGL Talent Tour event listing on BookMyShow.',
    href: 'https://in.bookmyshow.com/events/gkp-talent-tower-gorakhpurs-got-latent/ET00522963',
    tag: 'TALENT TOUR',
  },
];

export default function BookMyShowPage() {
  return (
    <main className="min-h-screen bg-[#101014] text-white">
      <div className="border-b border-white/10 bg-[#1b1b22]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/quick-info" className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Quick Info
          </Link>
          <div className="flex items-center gap-2 font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f84464]"><Ticket className="h-4 w-4" /></span>
            <span>GGL <span className="text-[#f84464]">TICKETS</span></span>
          </div>
        </div>
      </div>

      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#29202a] via-[#17171d] to-[#101014]">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#f84464]/15 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f84464]/40 bg-[#f84464]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#ff8297]">
            <Sparkles className="h-4 w-4" /> Official Event Links
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            Your next experience<br /><span className="text-[#f84464]">starts here.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
            Choose your Gorakhpur’s Got Latent event below. Each button opens the event’s listing on BookMyShow in a new tab.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-10 sm:grid-cols-2 sm:py-14">
        {events.map((event) => (
          <article key={event.href} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1b1b22] transition duration-200 hover:-translate-y-1 hover:border-[#f84464]/60">
            <div className="flex min-h-40 items-end bg-gradient-to-br from-[#f84464]/25 via-[#5a2638]/20 to-[#24242c] p-6">
              <span className="rounded-md bg-[#f84464] px-3 py-1.5 text-xs font-extrabold tracking-widest text-white">{event.tag}</span>
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <p className="text-xs font-extrabold tracking-[0.16em] text-[#ff8297]">{event.label}</p>
              <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">{event.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-white/60">{event.description}</p>
              <a href={event.href} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f84464] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#e63758] focus:outline-none focus:ring-2 focus:ring-[#ff8297] focus:ring-offset-2 focus:ring-offset-[#1b1b22]">
                {event.label === 'EPISODE 2 TICKET' ? 'Episode 2 Ticket' : 'GGL Talent Tour'}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </section>

      <footer className="border-t border-white/10 px-5 py-7 text-center text-xs text-white/40">
        Ticketing and event details are provided on the respective BookMyShow event pages.
      </footer>
    </main>
  );
}
