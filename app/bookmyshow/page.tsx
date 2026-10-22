import type { Metadata } from 'next';
import { ExternalLink, Ticket, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Gorakhpur's Got Latent Tickets on BookMyShow | Episode 2 & Talent Tour",
  description:
    "Find the official BookMyShow ticket listings for Gorakhpur's Got Latent Episode 2 and the GGL Talent Tour. View event details and continue to the relevant BookMyShow listing.",
  keywords: [
    "Gorakhpur's Got Latent tickets",
    "Gorakhpur Got Latent BookMyShow",
    "GGL Episode 2 tickets",
    "GGL Talent Tour tickets",
    "Gorakhpur live show tickets",
    "Gorakhpur entertainment events",
    "GKP Talent Tower",
  ],
  alternates: {
    canonical: "https://www.gkpgotlatent.in/bookmyshow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    url: "https://www.gkpgotlatent.in/bookmyshow",
    siteName: "Gorakhpur's Got Latent",
    title: "Gorakhpur's Got Latent Tickets on BookMyShow",
    description:
      "Official links to the Gorakhpur's Got Latent Episode 2 and GGL Talent Tour event listings on BookMyShow.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title: "Gorakhpur's Got Latent Tickets | BookMyShow",
    description:
      "Find the official BookMyShow event listings for GGL Episode 2 and the GGL Talent Tour.",
  },
};

const events = [
  {
    label: 'EPISODE 2 TICKET',
    title: "Gorakhpur's Got Latent",
    description: 'Episode 2 has been postponed. The revised date will be announced later; check the listing for current ticket status.',
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

      <section className="border-b border-white/10 bg-[#101014]">
        <div className="mx-auto max-w-6xl px-5 pb-2 pt-8 sm:px-6 sm:pt-10 lg:px-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ff8297]">Official GGL Event Links</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl">
            Gorakhpur&apos;s Got Latent Tickets on BookMyShow
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/70 sm:text-lg">
            Browse the official event listings for Gorakhpur&apos;s Got Latent Episode 2 and the GGL Talent Tour. Select an event below to view the listing, event information and ticket options on BookMyShow.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-8 sm:grid-cols-2 sm:py-10">
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
        Episode 2 date has been postponed. The new date will be announced later through official GGL channels. Check BookMyShow for current listing and ticket status.
      </footer>
    </main>
  );
}
