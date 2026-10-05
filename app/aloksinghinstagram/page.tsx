import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alok Singh Instagram ID | Official Instagram Username & Profile',
  description:
    'Looking for Alok Singh Instagram ID, Instagram username or official Instagram profile? Find Alok Singh Instagram, photos, reels and social updates here.',
  keywords: [
    'Alok Singh Instagram',
    'Alok Singh Instagram ID',
    'Alok Singh Instagram id',
    'Alok Singh Instagram username',
    'Alok Singh official Instagram',
    'Alok Singh Instagram profile',
    'Alok Singh Instagram account',
    'Alok Singh photos Instagram',
    'Alok Singh Instagram reels',
    'Alok Singh social media',
    'Alok Singh Gorakhpur Instagram',
    'Alok Singh Insta ID',
    'Alok Singh Insta username',
  ],
  alternates: { canonical: 'https://www.gkpgotlatent.in/aloksinghinstagram' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    title: 'Alok Singh Instagram ID | Official Instagram Profile',
    description: 'Find Alok Singh Instagram ID, username, profile, photos and reels.',
    url: 'https://www.gkpgotlatent.in/aloksinghinstagram',
    siteName: 'Alok Singh',
    images: [{ url: '/developer-photo-1.jpg', width: 800, height: 800, alt: 'Alok Singh Instagram' }],
    locale: 'en_IN',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alok Singh Instagram ID | Official Instagram Profile',
    description: 'Find Alok Singh Instagram ID and official Instagram username.',
    images: ['/developer-photo-1.jpg'],
  },
};

const instagramUrl = 'https://www.instagram.com/aloksingh_._/';

const faqs = [
  ['What is Alok Singh Instagram ID?', 'The Alok Singh Instagram ID shown on this page is @aloksingh_._. Use the official Instagram button to open the profile.'],
  ['What is Alok Singh Instagram username?', 'Alok Singh Instagram username is @aloksingh_._.'],
  ['What is Alok Singh official Instagram?', 'This page provides the Instagram profile currently listed for Alok Singh and a direct link to the profile.'],
  ['Where can I find Alok Singh Instagram profile?', 'You can find the Alok Singh Instagram profile through the direct Instagram link on this page.'],
  ['How can I follow Alok Singh on Instagram?', 'Open the Alok Singh Instagram profile and use Instagram’s Follow option.'],
  ['Where can I see Alok Singh photos and reels?', 'Alok Singh photos, reels and Instagram updates can be viewed directly on the Instagram profile.'],
  ['Does Alok Singh have an Instagram account?', 'Yes. This page provides the Instagram account currently listed for Alok Singh.'],
  ['How can I contact Alok Singh on Instagram?', 'Open the Instagram profile and use Instagram direct messages to contact Alok Singh.'],
];

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': 'https://www.gkpgotlatent.in/aloksinghinstagram#webpage',
  url: 'https://www.gkpgotlatent.in/aloksinghinstagram',
  name: 'Alok Singh Instagram ID — Official Profile',
  description: 'Page for finding Alok Singh Instagram ID, username and official Instagram profile.',
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
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function AlokSinghInstagramPage() {
  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300">Official Social Profile</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Alok Singh Instagram ID</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Looking for Alok Singh Instagram, Alok Singh Instagram ID, Instagram username or official profile?
            Find the profile, photos, reels and social updates from one page.
          </p>
        </header>

        <section className="mx-auto mt-10 max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-7 text-center sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-400/20 bg-amber-400/10 text-3xl font-black text-amber-300">IG</div>
          <h2 className="mt-6 text-2xl font-black sm:text-3xl">@aloksingh_._</h2>
          <p className="mt-2 text-sm text-slate-500">Alok Singh · Instagram ID · Instagram Username</p>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-amber-400 px-6 py-4 text-sm font-black text-black transition hover:bg-amber-300 sm:w-auto">
            Open Alok Singh Instagram →
          </a>
          <p className="mt-4 text-xs text-slate-600">Follow for Alok Singh photos, reels, updates and social posts.</p>
        </section>

        <section className="mt-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Alok Singh Instagram Search</p>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">Looking for Alok Singh Instagram ID?</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
            If you searched for Alok Singh Instagram ID, Alok Singh Insta ID, Alok Singh Instagram username,
            Alok Singh official Instagram or Alok Singh Instagram profile, this page gives you the direct profile link.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              'Alok Singh Instagram ID',
              'Alok Singh Instagram username',
              'Alok Singh official Instagram',
              'Alok Singh Instagram profile',
              'Alok Singh Instagram account',
              'Alok Singh photos on Instagram',
              'Alok Singh Instagram reels',
              'Alok Singh Gorakhpur Instagram',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm font-semibold text-slate-300">{item}</div>
            ))}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="instagram-faq">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">FAQ</p>
          <h2 id="instagram-faq" className="mt-3 text-2xl font-black sm:text-3xl">Questions about Alok Singh Instagram ID</h2>
          <div className="mt-6 space-y-3">
            {faqs.map(([q, a]) => (
              <details key={q} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <summary className="cursor-pointer text-sm font-bold text-white">{q}</summary>
                <p className="mt-3 text-sm leading-7 text-slate-400">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-amber-400/15 bg-amber-400/[0.04] p-7 sm:p-10">
          <h2 className="text-2xl font-black sm:text-3xl">More about Alok Singh</h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Explore the Alok Singh photo album and developer profile for additional public information and social links.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/aloksinghalbum" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold hover:border-amber-400/40">Alok Singh Photo Album</a>
            <a href="/developer" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold hover:border-amber-400/40">Developer Profile</a>
          </div>
        </section>

        <footer className="mt-16 border-t border-white/5 pt-7 text-center">
          <a href="/" className="text-sm font-semibold text-slate-400 hover:text-white">← Back to Gorakhpur&apos;s Got Latent</a>
        </footer>
      </div>
    </main>
  );
}
