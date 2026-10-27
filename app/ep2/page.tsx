import type { Metadata } from 'next';
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import { EPISODE_2 } from '@/lib/episode2';
const description = "Gorakhpur's Got Latent Episode 2 recording: Tuesday, 3 November 2026, from 1:00 PM IST at Mars Orbit Entertainment, Gorakhpur. Official date, venue, tickets and performer applications.";
export const metadata: Metadata = {
  title: "GGL Episode 2 | 3 November 2026, 1 PM | Mars Orbit Entertainment", description,
  alternates: { canonical: EPISODE_2.url }, robots: { index: true, follow: true },
  openGraph: { title: EPISODE_2.name, description, url: EPISODE_2.url, type: 'website', locale: 'en_IN', images: [{ url: 'https://www.gkpgotlatent.in/logo.png', alt: EPISODE_2.name }] },
  twitter: { card: 'summary_large_image', title: EPISODE_2.name, description, images: ['https://www.gkpgotlatent.in/logo.png'] },
};
const event = {
  '@context': 'https://schema.org', '@type': 'Event', '@id': `${EPISODE_2.url}#event`,
  name: EPISODE_2.name, description, url: EPISODE_2.url, startDate: EPISODE_2.startDate,
  eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  image: ['https://www.gkpgotlatent.in/logo.png'],
  location: { '@type': 'Place', name: EPISODE_2.venue, address: { '@type': 'PostalAddress', addressLocality: 'Gorakhpur', addressRegion: 'Uttar Pradesh', addressCountry: 'IN' } },
  organizer: { '@type': 'Organization', name: "Gorakhpur's Got Latent", url: 'https://www.gkpgotlatent.in/' },
};
export default function Episode2Page() {
 return <main className="min-h-screen bg-[#08090d] px-4 py-10 text-slate-200 sm:px-6 sm:py-16">
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(event).replace(/</g, '\\u003c') }} />
  <article className="mx-auto max-w-4xl">
   <p className="text-xs font-black uppercase tracking-widest text-amber-300">Official Episode 2 · Date confirmed</p>
   <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-6xl">Gorakhpur&apos;s Got Latent Episode 2</h1>
   <p className="mt-5 text-lg leading-8">Show recording begins on <strong>Tuesday, 3 November 2026, at 1:00 PM IST</strong> at <strong>Mars Orbit Entertainment, Gorakhpur</strong>.</p>
   <p className="mt-3 text-base leading-7 text-amber-200">मंगलवार, 3 नवंबर 2026 · दोपहर 1 बजे से शो की रिकॉर्डिंग · Mars Orbit Entertainment, गोरखपुर।</p>
   <p className="mt-3 text-sm text-slate-400">Updated: 27 October 2026. This is the confirmed recording schedule, replacing the earlier postponed-date notice.</p>
   <CountdownTimer />
   <section className="mt-8 space-y-4">
    <h2 className="text-2xl font-black text-white">Date, time and venue</h2>
    <dl className="grid gap-4 sm:grid-cols-3">{[['Date', `${EPISODE_2.weekday}, ${EPISODE_2.date}`], ['Recording begins', EPISODE_2.time], ['Venue', `${EPISODE_2.venue}, Gorakhpur`]].map(([label, value]) => <div key={label} className="rounded-xl border border-amber-400/20 bg-white/[.03] p-5"><dt className="text-sm text-slate-400">{label}</dt><dd className="mt-2 font-bold text-amber-200">{value}</dd></div>)}</dl>
    <p className="leading-7">GGL brings comedy, mimicry, magic, unusual talent, Music (Unique / Original), poetry and beatboxing to a live stage. Performer selection and individual reporting instructions are communicated separately by the GGL team.</p>
   </section>
   <section className="mt-8 space-y-4">
    <h2 className="text-2xl font-black text-white">Tickets and performer applications</h2>
    <div className="flex flex-wrap gap-3">
     <Link href="/book-ticket" className="rounded-xl bg-amber-400 px-5 py-3 font-black text-black">Book tickets</Link>
     <Link href="/apply/performer" className="rounded-xl border border-amber-400/40 px-5 py-3 font-bold text-amber-200">Apply as a performer</Link>
     <Link href="/contact" className="rounded-xl border border-white/20 px-5 py-3 font-bold">Venue directions & contact</Link>
    </div>
    <p className="text-sm leading-7 text-slate-400">For application status, existing-ticket questions or arrival instructions, contact <a className="text-amber-300 underline" href="https://wa.me/918423858424">WhatsApp: +91 84238 58424</a> or <a className="text-amber-300 underline" href="mailto:help.gglatent@gmail.com">help.gglatent@gmail.com</a>.</p>
   </section>
  </article>
 </main>;
}
