import type { Metadata } from 'next';
import Link from 'next/link';

const pageUrl = 'https://www.gkpgotlatent.in/printerest';
const pinterestUrl = 'https://pin.it/1KeUGi1bI';

export const metadata: Metadata = {
  title: "Pinterest Inspiration | Gorakhpur's Got Latent",
  description:
    "Visit the Pinterest reference shared for Gorakhpur's Got Latent and explore official GGL information, performer applications, episodes and ticket booking in Gorakhpur, Uttar Pradesh.",
  keywords: [
    "Gorakhpur's Got Latent Pinterest",
    'GGL Pinterest reference',
    'Gorakhpur talent show',
    'Gorakhpur entertainment show',
    'Gorakhpur live talent platform',
    'Purvanchal talent show',
    'GGL performer auditions',
    'Gorakhpur events and performances',
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: 'article',
    url: pageUrl,
    siteName: "Gorakhpur's Got Latent",
    title: "Pinterest Inspiration | Gorakhpur's Got Latent",
    description:
      "Open the shared Pinterest reference and discover official Gorakhpur's Got Latent show information, performer applications and episodes.",
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary',
    title: "Pinterest Inspiration | Gorakhpur's Got Latent",
    description:
      "Explore the shared Pinterest reference and official GGL talent-show information.",
  },
};

const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': pageUrl + '#webpage',
  url: pageUrl,
  name: "Pinterest Inspiration | Gorakhpur's Got Latent",
  description:
    "A Pinterest reference page connecting a shared creative pin with official information about Gorakhpur's Got Latent.",
  isPartOf: {
    '@type': 'WebSite',
    name: "Gorakhpur's Got Latent",
    url: 'https://www.gkpgotlatent.in/',
  },
  about: [
    { '@type': 'Thing', name: "Gorakhpur's Got Latent" },
    { '@type': 'Thing', name: 'Pinterest inspiration' },
    { '@type': 'Thing', name: 'Gorakhpur talent and entertainment' },
  ],
  inLanguage: 'en-IN',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gkpgotlatent.in/' },
    { '@type': 'ListItem', position: 2, name: 'Pinterest Inspiration', item: pageUrl },
  ],
};

export default function PinterestReferencePage() {
  return (
    <article className="min-h-screen bg-[#07080e] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <header className="relative overflow-hidden border-b border-amber-400/20 bg-gradient-to-br from-[#160b0b] via-[#07080e] to-[#171007]">
        <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
          <div className="absolute -left-16 top-8 h-64 w-64 rounded-full bg-red-700/30 blur-3xl" />
          <div className="absolute -right-12 top-10 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-400">
            <Link href="/" className="transition hover:text-amber-300">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-amber-300">Pinterest Inspiration</span>
          </nav>
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.24em] text-amber-300 sm:text-sm">
            Creative Inspiration · Official GGL Website
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
            Pinterest Inspiration for <span className="text-amber-300">Gorakhpur&apos;s Got Latent</span>
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Explore the Pinterest reference shared for this page and discover Gorakhpur&apos;s
            Got Latent (GGL), a talent and entertainment platform associated with Gorakhpur,
            Uttar Pradesh. The original pin is linked directly so you can view its media and
            publisher-provided details on Pinterest.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={pinterestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#bd081c] px-6 py-3 font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#a30718]"
            >
              View Pinterest Pin ↗
            </a>
            <Link
              href="/apply/performer"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-amber-400/40 bg-amber-400/10 px-6 py-3 font-extrabold text-amber-200 transition hover:bg-amber-400/15"
            >
              Performer Applications
            </Link>
          </div>
          <p className="mt-4 break-all text-xs text-slate-500">Pinterest reference: {pinterestUrl}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14 lg:px-8 lg:py-16">
        <div className="space-y-12 text-[15px] leading-8 sm:text-base">
          <section>
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              Creative Inspiration and Visual Discovery
            </h2>
            <p className="mt-4">
              Pinterest is a visual discovery platform where people collect and share ideas,
              images, designs and creative references. The link above is the specific reference
              supplied for this page. Open it on Pinterest to see the original pin and any
              caption or context provided by its publisher.
            </p>
            <p className="mt-4">
              This page connects that reference with official GGL information, making it easier
              for visitors interested in local entertainment, stage performance and creative
              projects to continue to relevant pages on the official website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              About Gorakhpur&apos;s Got Latent
            </h2>
            <p className="mt-4">
              Gorakhpur&apos;s Got Latent (GGL) is a talent and entertainment platform associated
              with Gorakhpur, Uttar Pradesh. Its live-show concept brings varied performance
              styles together, with an emphasis on creativity, personality and original stage
              acts. The official website shares public information about performer applications,
              episodes, ticketing and show announcements.
            </p>
            <p className="mt-4">
              People searching for a Gorakhpur talent show, Gorakhpur entertainment, local
              performance opportunities or Purvanchal talent updates can use the official GGL
              pages below to find the information relevant to them. Details such as event dates,
              venues, application conditions and ticket availability should always be checked
              on the current official page, because announcements can change.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              Explore Official GGL Pages
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Link href="/apply/performer" className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-amber-400/40 hover:bg-white/[0.055]">
                <h3 className="text-lg font-extrabold text-amber-200">Performer Auditions</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">Read current instructions for applying to perform on the GGL stage.</p>
                <span className="mt-4 inline-block text-sm font-bold text-amber-300">View performer page →</span>
              </Link>
              <Link href="/episodes" className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-amber-400/40 hover:bg-white/[0.055]">
                <h3 className="text-lg font-extrabold text-amber-200">Episodes &amp; Show Updates</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">Explore published episodes and official show-related updates.</p>
                <span className="mt-4 inline-block text-sm font-bold text-amber-300">Explore episodes →</span>
              </Link>
              <Link href="/book-ticket" className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-amber-400/40 hover:bg-white/[0.055]">
                <h3 className="text-lg font-extrabold text-amber-200">Ticket Booking</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">Visit GGL&apos;s official site for current audience ticket details.</p>
                <span className="mt-4 inline-block text-sm font-bold text-amber-300">Ticket information →</span>
              </Link>
              <Link href="/contact" className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-amber-400/40 hover:bg-white/[0.055]">
                <h3 className="text-lg font-extrabold text-amber-200">Contact GGL</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">Find official public contact and support information.</p>
                <span className="mt-4 inline-block text-sm font-bold text-amber-300">Contact the team →</span>
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white sm:text-3xl">Frequently Asked Questions</h2>
            <div className="mt-5 space-y-5">
              <div>
                <h3 className="font-extrabold text-white">What is Gorakhpur&apos;s Got Latent?</h3>
                <p className="mt-2">GGL is a talent and entertainment platform associated with Gorakhpur, Uttar Pradesh. Its website shares information about applications, episodes and tickets.</p>
              </div>
              <div>
                <h3 className="font-extrabold text-white">How do I open the Pinterest reference?</h3>
                <p className="mt-2">Use the “View Pinterest Pin” link near the top of this page. It opens the shared link in a new browser tab.</p>
              </div>
              <div>
                <h3 className="font-extrabold text-white">Where can I check the latest audition information?</h3>
                <p className="mt-2">Visit the official <Link href="/apply/performer" className="font-bold text-amber-300 underline underline-offset-4">performer application page</Link> and follow the instructions shown there.</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/[0.08] to-red-950/20 p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Pinterest Reference</p>
            <h2 className="mt-3 text-xl font-black text-white">Open the Shared Pin</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">View the original pin, image or video and its publisher-provided description directly on Pinterest.</p>
            <a
              href={pinterestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#bd081c] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#a30718]"
            >
              Open Pinterest ↗
            </a>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
            <h2 className="text-lg font-extrabold text-white">Official GGL Website</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">Use the official website for current show updates and public information.</p>
            <Link href="/" className="mt-4 inline-block text-sm font-bold text-amber-300 hover:text-amber-200">Visit GGL Home →</Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
