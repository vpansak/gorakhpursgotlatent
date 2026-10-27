import type { Metadata } from 'next';
import Link from 'next/link';

const pageUrl = 'https://www.gkpgotlatent.in/allevent';
const eventUrl = 'https://allevents.in/gorakhpur/gorakhpur-talent-tour/80001980672102';

export const metadata: Metadata = {
  title: "Gorakhpur Talent Tour | GGL Talent & Entertainment Experience",
  description:
    "Discover Gorakhpur Talent Tour by Gorakhpur's Got Latent (GGL), a local talent and entertainment initiative. Explore event information and visit the official AllEvents listing for updates.",
  keywords: [
    'Gorakhpur Talent Tour',
    'Gorakhpur events',
    'events in Gorakhpur',
    'Gorakhpur entertainment',
    'Gorakhpur talent',
    "Gorakhpur's Got Latent",
    'GGL Gorakhpur',
    'talent show in Gorakhpur',
    'local artists Gorakhpur',
    'AllEvents Gorakhpur Talent Tour',
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    type: 'article',
    url: pageUrl,
    title: 'Gorakhpur Talent Tour | Gorakhpur’s Got Latent',
    description:
      'Learn about Gorakhpur Talent Tour and discover the event listing for GGL on AllEvents.in.',
    siteName: "Gorakhpur's Got Latent",
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gorakhpur Talent Tour | GGL',
    description:
      'Explore Gorakhpur Talent Tour by Gorakhpur’s Got Latent and open the event listing on AllEvents.in.',
  },
  robots: { index: true, follow: true },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Gorakhpur Talent Tour: Discover Local Talent and Entertainment with GGL',
  description:
    "An informational guide to Gorakhpur Talent Tour and Gorakhpur's Got Latent, with a link to the event listing on AllEvents.in.",
  mainEntityOfPage: pageUrl,
  author: { '@type': 'Organization', name: "Gorakhpur's Got Latent", url: 'https://www.gkpgotlatent.in' },
  publisher: { '@type': 'Organization', name: "Gorakhpur's Got Latent", url: 'https://www.gkpgotlatent.in' },
  inLanguage: 'en-IN',
  about: [
    { '@type': 'Thing', name: 'Gorakhpur Talent Tour' },
    { '@type': 'Thing', name: 'Local talent and entertainment in Gorakhpur' },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gkpgotlatent.in/' },
    { '@type': 'ListItem', position: 2, name: 'Gorakhpur Talent Tour', item: pageUrl },
  ],
};

export default function AllEventLandingPage() {
  return (
    <main className="min-h-screen bg-[#07070a] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="relative overflow-hidden border-b border-amber-400/20 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(185,28,28,0.16),transparent_45%)] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
            Gorakhpur • Talent • Entertainment
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            Gorakhpur Talent Tour
            <span className="mt-2 block bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Discover the city’s creative spirit
            </span>
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
            Looking for information about Gorakhpur Talent Tour? This page connects visitors with the event listing associated with Gorakhpur’s Got Latent (GGL), a Gorakhpur-focused talent and entertainment initiative that celebrates creativity, performance and local artists.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={eventUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 font-extrabold text-black shadow-lg shadow-amber-500/20 transition hover:brightness-110">
              View Gorakhpur Talent Tour on AllEvents.in ↗
            </a>
            <Link href="/ggl_talent_trip" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-bold text-white transition hover:border-amber-300/50 hover:bg-white/10">
              Explore GGL Talent Trip
            </Link>
          </div>
          <p className="mt-4 text-xs leading-5 text-white/40">
            Event dates, venue, availability and participation details can change. Check the event organiser’s listing for the latest confirmed information.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">About the event</p>
          <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">What is Gorakhpur Talent Tour?</h2>
          <p className="mt-5 leading-8 text-white/70">
            Gorakhpur Talent Tour is an event name people can use to find local entertainment and talent-related activities in Gorakhpur, Uttar Pradesh. If you are searching for a Gorakhpur event, a creative community, or a place to discover local performers, start with the linked event page and review the latest information published by the organiser.
          </p>
          <p className="mt-4 leading-8 text-white/70">
            Gorakhpur’s Got Latent, also known as GGL, is a local talent and entertainment platform focused on giving performers and creators opportunities to share their skills. Performance and creative formats associated with the GGL initiative may include comedy, mimicry, magic, unusual talent, Music (Unique / Original), acting, poetry and spoken-word performances. Specific activities depend on each event and should be confirmed on its own listing.
          </p>
        </section>

        <section className="mt-12 rounded-2xl border border-amber-300/20 bg-gradient-to-br from-amber-300/[0.08] to-red-500/[0.05] p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold">Where can I find event details?</h2>
          <p className="mt-4 leading-7 text-white/70">
            The AllEvents.in page is the external listing for Gorakhpur Talent Tour. Visit it to check the event description, date, venue, organiser updates and any participation or ticket information currently provided there. Do not rely on older screenshots or reposts if the listing has been updated.
          </p>
          <a href={eventUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-400 px-5 py-3 font-extrabold text-black transition hover:bg-amber-300">
            Open the AllEvents event listing ↗
          </a>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Discover GGL in Gorakhpur</h2>
          <p className="mt-4 leading-8 text-white/70">
            GGL aims to connect local audiences, performers and creative people through entertainment-led experiences. If you want to learn more about the platform, explore the official website and its dedicated pages below.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            <li><Link className="block rounded-xl border border-white/10 bg-white/[0.03] p-4 font-semibold text-amber-200 transition hover:border-amber-300/40" href="/">GGL Official Website ↗</Link></li>
            <li><Link className="block rounded-xl border border-white/10 bg-white/[0.03] p-4 font-semibold text-amber-200 transition hover:border-amber-300/40" href="/apply/performer">Apply as a Performer ↗</Link></li>
            <li><Link className="block rounded-xl border border-white/10 bg-white/[0.03] p-4 font-semibold text-amber-200 transition hover:border-amber-300/40" href="/episodes">Explore GGL Episodes ↗</Link></li>
            <li><Link className="block rounded-xl border border-white/10 bg-white/[0.03] p-4 font-semibold text-amber-200 transition hover:border-amber-300/40" href="/Upcomingevents">Upcoming Events in Gorakhpur ↗</Link></li>
            <li><Link className="block rounded-xl border border-white/10 bg-white/[0.03] p-4 font-semibold text-amber-200 transition hover:border-amber-300/40" href="/ggl_talent_trip">GGL Talent Trip ↗</Link></li>
            <li><Link className="block rounded-xl border border-white/10 bg-white/[0.03] p-4 font-semibold text-amber-200 transition hover:border-amber-300/40" href="/contact">Contact GGL ↗</Link></li>
          </ul>
        </section>

        <section className="mt-12 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-extrabold">Frequently asked questions</h2>
          <div className="mt-5 space-y-6">
            <div>
              <h3 className="font-bold text-white">How do I find the Gorakhpur Talent Tour event page?</h3>
              <p className="mt-2 leading-7 text-white/65">Use the “View Gorakhpur Talent Tour on AllEvents.in” link on this page to open the event listing directly.</p>
            </div>
            <div>
              <h3 className="font-bold text-white">Where can I confirm the event date and venue?</h3>
              <p className="mt-2 leading-7 text-white/65">Check the AllEvents.in listing for the latest organiser-provided date, venue and event updates. Details may change.</p>
            </div>
            <div>
              <h3 className="font-bold text-white">Is this page the ticket provider?</h3>
              <p className="mt-2 leading-7 text-white/65">No. This is an informational page. Any ticketing, registration or attendance terms should be checked on the external event listing or with the event organiser.</p>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
