import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alok Singh — Co-Founder & Full-Stack Developer | Gorakhpur’s Got Latent',
  description:
    'Official Co-Founder profile of Alok Singh, who also serves as a Full-Stack Developer and technology builder behind Gorakhpur’s Got Latent.',
  keywords: [
    'Alok Singh',
    'Alok Singh Co-Founder',
    'Alok Singh Developer',
    'Gorakhpur Got Latent Co-Founder',
    'Gorakhpur Got Latent Developer',
    'GGL Co-Founder',
    'GGL Developer',
  ],
  alternates: {
    canonical: 'https://gkpgotlatent.in/cofounder',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Alok Singh — Co-Founder & Full-Stack Developer | Gorakhpur’s Got Latent',
    description:
      'Alok Singh is a Co-Founder and Full-Stack Developer associated with Gorakhpur’s Got Latent.',
    url: 'https://gkpgotlatent.in/cofounder',
    siteName: "Gorakhpur's Got Latent",
    images: [
      {
        url: '/developer-photo-1.jpg',
        width: 800,
        height: 800,
        alt: 'Alok Singh — Co-Founder and Full-Stack Developer',
      },
    ],
    locale: 'en_IN',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alok Singh — Co-Founder & Full-Stack Developer',
    description:
      'Official Co-Founder and Developer profile for Gorakhpur’s Got Latent.',
    images: ['/developer-photo-1.jpg'],
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': 'https://gkpgotlatent.in/cofounder#webpage',
  url: 'https://gkpgotlatent.in/cofounder',
  name: 'Alok Singh — Co-Founder & Full-Stack Developer',
  description:
    'Official profile of Alok Singh as Co-Founder and Full-Stack Developer associated with Gorakhpur’s Got Latent.',
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://gkpgotlatent.in/developer#person',
    name: 'Alok Singh',
    jobTitle: 'Co-Founder & Full-Stack Developer',
    url: 'https://gkpgotlatent.in/developer',
    image: 'https://gkpgotlatent.in/developer-photo-1.jpg',
    sameAs: [
      'https://gkpgotlatent.in/developer',
      'https://www.instagram.com/aloksingh_._/',
      'https://x.com/rajpratapsinghh',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Gorakhpur',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    worksFor: {
      '@type': 'Organization',
      name: "Gorakhpur's Got Latent",
      url: 'https://gkpgotlatent.in',
    },
  },
};

export default function CofounderPage() {
  return (
    <main className="min-h-screen bg-[#05070d] px-5 py-16 text-white sm:px-8 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
          Gorakhpur&apos;s Got Latent · Co-Founder
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-7xl">
          ALOK SINGH
        </h1>

        <p className="mt-5 text-xl font-semibold text-amber-300 sm:text-2xl">
          Co-Founder · Full-Stack Developer · Technology Builder
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr] lg:items-start">
          <img
            src="/developer-photo-1.jpg"
            alt="Alok Singh — Co-Founder and Full-Stack Developer"
            width={800}
            height={800}
            className="w-full rounded-2xl border border-white/10 object-cover grayscale"
          />

          <div className="space-y-5 text-base leading-8 text-slate-300">
            <p>
              <strong className="text-white">Alok Singh is the same person represented
              across the Developer and Co-Founder profiles.</strong> He works as a
              Co-Founder while also leading full-stack development and technology work
              for Gorakhpur&apos;s Got Latent.
            </p>
            <p>
              His work covers web development, UI/UX, backend systems, databases, APIs,
              cloud deployment and practical event technology. He focuses on turning ideas
              into functional digital products and experiences.
            </p>
            <p>
              For the detailed technical profile, projects, expertise and technology stack,
              visit the official{' '}
              <a
                href="/developer"
                className="font-bold text-amber-300 underline decoration-amber-300/30 underline-offset-4 hover:text-amber-200"
              >
                Developer Profile
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <a
            href="https://www.instagram.com/aloksingh_._/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-pink-500/30 bg-pink-500/10 px-5 py-3 text-sm font-bold text-pink-300 transition hover:-translate-y-0.5 hover:border-pink-400 hover:bg-pink-500/20"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            INSTAGRAM (@aloksingh_._) ↗
          </a>
          <a
            href="https://x.com/rajpratapsinghh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-bold text-slate-200 transition hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-800"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M18.9 2.5h2.9l-6.3 7.2 7.4 9.8h-5.8l-4.5-5.9-5.2 5.9H4.5l6.8-7.8L4.2 2.5h5.9l4.1 5.4 4.7-5.4Zm-1 15.3h1.6L9.1 4.1H7.4l10.5 13.7Z" />
            </svg>
            X / TWITTER (@rajpratapsinghh) ↗
          </a>
          <a
            href="/developer"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-amber-300"
          >
            VIEW DEVELOPER PROFILE
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.06]"
          >
            BACK TO GGL
          </a>
        </div>
      </div>
    </main>
  );
}
