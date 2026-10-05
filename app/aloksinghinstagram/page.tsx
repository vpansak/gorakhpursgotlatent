import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alok Singh Instagram | Official Instagram Profile',
  description:
    'Find Alok Singh on Instagram. Visit the official Instagram profile, follow Alok Singh, view photos, reels, updates and social content.',
  keywords: [
    'Alok Singh Instagram',
    'Alok Singh Instagram profile',
    'Alok Singh official Instagram',
    'Alok Singh Instagram account',
    'Alok Singh Instagram username',
    'Alok Singh Instagram ID',
    'Alok Singh photos Instagram',
    'Alok Singh reels Instagram',
    'Alok Singh social media',
    'Alok Singh Gorakhpur Instagram',
  ],
  alternates: {
    canonical: 'https://www.gkpgotlatent.in/aloksinghinstagram',
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
    title: 'Alok Singh Instagram | Official Instagram Profile',
    description: 'Find and follow Alok Singh on Instagram.',
    url: 'https://www.gkpgotlatent.in/aloksinghinstagram',
    siteName: 'Alok Singh',
    images: [{ url: '/developer-photo-1.jpg', width: 800, height: 800, alt: 'Alok Singh' }],
    locale: 'en_IN',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alok Singh Instagram | Official Instagram Profile',
    description: 'Find Alok Singh on Instagram and follow the official profile.',
    images: ['/developer-photo-1.jpg'],
  },
};

const instagramUrl = 'https://www.instagram.com/aloksingh_._/';

const faqs = [
  {
    q: 'What is Alok Singh Instagram?',
    a: 'This page helps people find Alok Singh on Instagram and reach the Instagram profile directly.',
  },
  {
    q: 'What is Alok Singh Instagram username?',
    a: 'The Instagram username shown on this official profile page is @aloksingh_._.',
  },
  {
    q: 'Where can I follow Alok Singh on Instagram?',
    a: 'Use the official Instagram button on this page to open Alok Singh’s Instagram profile.',
  },
  {
    q: 'Does Alok Singh have an Instagram profile?',
    a: 'Yes. This page provides a direct link to the Instagram profile currently listed for Alok Singh.',
  },
  {
    q: 'Where can I see Alok Singh photos and reels?',
    a: 'Photos, reels and updates are available directly on the Instagram profile.',
  },
  {
    q: 'How can I contact Alok Singh on Instagram?',
    a: 'Open the Instagram profile and use Instagram’s follow or direct-message features.',
  },
];

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': 'https://www.gkpgotlatent.in/aloksinghinstagram#webpage',
  url: 'https://www.gkpgotlatent.in/aloksinghinstagram',
  name: 'Alok Singh Instagram — Official Profile',
  description: 'Official page for finding Alok Singh on Instagram.',
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://www.gkpgotlatent.in/developer#person',
    name: 'Alok Singh',
    jobTitle: 'Full-Stack Developer & Co-Founder',
    url: 'https://www.gkpgotlatent.in/developer',
    image: 'https://www.gkpgotlatent.in/developer-photo-1.jpg',
    sameAs: [instagramUrl],
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export default function AlokSinghInstagramPage() {
  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300">
            Official Social Profile
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
            Alok Singh Instagram
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Looking for Alok Singh on Instagram? You are in the right place. Use the
            official profile button below to visit, follow, view photos, watch reels
            and see the latest updates.
          </p>
        </header>

        <section className="mx-auto mt-10 max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-7 text-center sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-400/20 bg-amber-400/10 text-3xl font-black text-amber-300">
            IG
          </div>
          <h2 className="mt-6 text-2xl font-black sm:text-3xl">
            @aloksingh_._
          </h2>
          <p className="mt-2 text-sm text-slate-500">Alok Singh · Instagram</p>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-amber-400 px-6 py-4 text-sm font-black text-black transition hover:bg-amber-300 sm:w-auto"
          >
            Open Alok Singh Instagram →
          </a>
          <p className="mt-4 text-xs text-slate-600">
            Follow for photos, reels, updates and social posts.
          </p>
        </section>

        <section className="mt-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
            Looking for Alok Singh?
          </p>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">
            Find Alok Singh on Instagram
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              'Alok Singh Instagram profile',
              'Alok Singh official Instagram',
              'Alok Singh Instagram username',
              'Alok Singh Instagram ID',
              'Alok Singh photos on Instagram',
              'Alok Singh reels on Instagram',
            ].map((text) => (
              <div
                key={text}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm font-semibold text-slate-300"
              >
                {text}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="instagram-faq">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
            Questions
          </p>
          <h2 id="instagram-faq" className="mt-3 text-2xl font-black sm:text-3xl">
            Questions people may ask about Alok Singh Instagram
          </h2>
          <div className="mt-6 space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <summary className="cursor-pointer text-sm font-bold text-white">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-amber-400/15 bg-amber-400/[0.04] p-7 sm:p-10">
          <h2 className="text-2xl font-black sm:text-3xl">More about Alok Singh</h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Explore the official Alok Singh photo album and developer profile for
            additional public information and social links.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/aloksinghalbum" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold hover:border-amber-400/40">
              Alok Singh Photo Album
            </a>
            <a href="/developer" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold hover:border-amber-400/40">
              Developer Profile
            </a>
          </div>
        </section>

        <footer className="mt-16 border-t border-white/5 pt-7 text-center">
          <a href="/" className="text-sm font-semibold text-slate-400 hover:text-white">
            ← Back to Gorakhpur&apos;s Got Latent
          </a>
        </footer>
      </div>
    </main>
  );
}
