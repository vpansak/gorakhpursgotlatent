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

        <div className="mt-12 flex flex-wrap gap-3">
          <a
            href="/developer"
            className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black hover:bg-amber-300"
          >
            VIEW DEVELOPER PROFILE
          </a>
          <a
            href="/"
            className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-white hover:bg-white/[0.06]"
          >
            BACK TO GGL
          </a>
        </div>
      </div>
    </main>
  );
}
