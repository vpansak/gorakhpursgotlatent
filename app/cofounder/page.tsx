import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alok Singh — Co-Founder | Gorakhpur’s Got Latent',
  description:
    'The story of Alok Singh, Co-Founder of Gorakhpur’s Got Latent — from Kaudiram, Gorakhpur to building a new entertainment platform with technology, creativity and Naveen.',
  keywords: [
    'Alok Singh',
    'Alok Singh Co-Founder',
    'Gorakhpur Got Latent Co-Founder',
    'GGL Co-Founder Alok Singh',
    'Alok Singh Gorakhpur',
    'Alok Singh Kaudiram',
    'Gorakhpur entertainment',
    'Gorakhpur creators',
    'Gorakhpur talent platform',
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
    title: 'Alok Singh — Co-Founder | Gorakhpur’s Got Latent',
    description:
      'From Kaudiram to building Gorakhpur’s Got Latent with Naveen — the journey of Co-Founder Alok Singh.',
    url: 'https://gkpgotlatent.in/cofounder',
    siteName: "Gorakhpur's Got Latent",
    images: [
      {
        url: '/developer-photo-1.jpg',
        width: 800,
        height: 800,
        alt: 'Alok Singh — Co-Founder of Gorakhpur’s Got Latent',
      },
    ],
    locale: 'en_IN',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alok Singh — Co-Founder | Gorakhpur’s Got Latent',
    description:
      'From Kaudiram to building GGL with Naveen — the story behind the Co-Founder.',
    images: ['/developer-photo-1.jpg'],
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': 'https://gkpgotlatent.in/cofounder#webpage',
  url: 'https://gkpgotlatent.in/cofounder',
  name: 'Alok Singh — Co-Founder of Gorakhpur’s Got Latent',
  description:
    'Official profile and journey of Alok Singh, Co-Founder of Gorakhpur’s Got Latent.',
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://gkpgotlatent.in/cofounder#person',
    name: 'Alok Singh',
    jobTitle: 'Co-Founder',
    image: 'https://gkpgotlatent.in/developer-photo-1.jpg',
    sameAs: [
      'https://www.instagram.com/aloksingh_._/',
      'https://x.com/rajpratapsinghh',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kaudiram, Gorakhpur',
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

const milestones = [
  {
    year: 'EARLY YEARS',
    title: 'LKG → Class 2',
    place: 'Purvanchal Public School',
    text: 'The journey began at Purvanchal Public School, where Alok completed his early schooling from LKG through Class 2.',
  },
  {
    year: 'CLASS 3',
    title: 'A New School, A New Chapter',
    place: 'KMR, Janipur — Gola Road',
    text: 'Class 3 brought a change of environment and another chapter of school life at KMR, Janipur, Gola Road.',
  },
  {
    year: 'CLASS 4 → 10',
    title: 'Growing Up & Finding His Direction',
    place: 'Holy Angel International School, Pali — Bansgaon',
    text: 'From Class 4 to Class 10, Alok studied at Holy Angel International School in Pali, Bansgaon — years that shaped his personality, curiosity and ambition.',
  },
  {
    year: 'CLASS 11 → 12',
    title: 'Back to Purvanchal',
    place: 'Purvanchal Public School',
    text: 'For Classes 11 and 12, Alok returned to Purvanchal Public School, completing his senior-school journey with a growing interest in technology and building things of his own.',
  },
  {
    year: 'COLLEGE',
    title: 'BCA — The Technology Chapter',
    place: 'KIPM College',
    text: 'Alok continued into BCA at KIPM College, where his interest in web development, software and technology became a more serious part of his journey.',
  },
  {
    year: 'GGL',
    title: 'An Idea Became a Stage',
    place: 'With Naveen · Gorakhpur’s Got Latent',
    text: 'Alongside Naveen, Alok helped build Gorakhpur’s Got Latent — turning an idea into a real platform for performers, creators, audiences and the city’s entertainment community.',
  },
];

export default function CofounderPage() {
  return (
    <main className="min-h-screen bg-[#05070d] px-5 py-16 text-white sm:px-8 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <div className="mx-auto max-w-6xl">
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-300">
              Gorakhpur&apos;s Got Latent · Co-Founder
            </p>

            <h1 className="mt-5 text-5xl font-black tracking-[-0.04em] sm:text-7xl lg:text-8xl">
              ALOK
              <span className="block text-amber-300">SINGH</span>
            </h1>

            <p className="mt-5 max-w-2xl text-xl font-bold leading-8 text-slate-200 sm:text-2xl">
              Co-Founder · Builder · Creator · A boy from Kaudiram with a bigger
              idea for his city.
            </p>

            <div className="mt-7 inline-flex items-center rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-200">
              📍 Kaudiram, Gorakhpur, Uttar Pradesh, India
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-3 rounded-[2rem] bg-amber-400/10 blur-2xl" />
            <img
              src="/developer-photo-1.jpg"
              alt="Alok Singh — Co-Founder of Gorakhpur’s Got Latent"
              width={800}
              height={800}
              className="relative aspect-square w-full rounded-[2rem] border border-amber-300/20 object-cover shadow-2xl shadow-black/50"
            />
          </div>
        </section>

        <section className="mt-20 max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
            THE STORY
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            It didn&apos;t start with a stage.
            <span className="block text-slate-400">It started with a journey.</span>
          </h2>

          <div className="mt-8 space-y-6 text-base font-semibold leading-8 text-slate-300 sm:text-lg">
            <p>
              Alok Singh&apos;s story starts in <strong className="text-white">Kaudiram, Gorakhpur</strong>.
              Long before Gorakhpur&apos;s Got Latent had a name, there was a simple
              habit at the centre of his journey: learn, experiment and try to build
              something better.
            </p>
            <p>
              His education took him through different schools and different chapters,
              but the direction kept becoming clearer. From early schooling at
              Purvanchal Public School, to Class 3 at KMR, Janipur, and then years at
              Holy Angel International School in Pali, Bansgaon, every move became a
              new chapter rather than a full stop.
            </p>
            <p>
              After returning to Purvanchal for Classes 11 and 12, technology became
              more than an interest. With BCA at KIPM College, Alok started leaning
              deeper into web development, software and the idea of creating things
              instead of only consuming them.
            </p>
            <p>
              Then came <strong className="text-amber-300">Naveen</strong> — and an idea
              that could become something much bigger than the two of them.
              Together, they built <strong className="text-white">Gorakhpur&apos;s Got Latent</strong>:
              a platform created around performers, creators, entertainment and the
              energy of their own city.
            </p>
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
              THE ROAD SO FAR
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-5xl">
              From classroom to co-founder.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {milestones.map((item, index) => (
              <article
                key={item.year}
                className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-amber-300/30 hover:bg-white/[0.055]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-black tracking-[0.2em] text-amber-300">
                    {item.year}
                  </span>
                  <span className="text-xs font-black text-white/25">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-black text-white">{item.title}</h3>
                <p className="mt-1 font-bold text-amber-200">{item.place}</p>
                <p className="mt-4 text-sm font-semibold leading-7 text-slate-400">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 overflow-hidden rounded-[2rem] border border-amber-300/20 bg-gradient-to-br from-amber-300/[0.10] via-white/[0.03] to-red-500/[0.08] p-7 sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
            THE GGL CHAPTER
          </p>
          <h2 className="mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-5xl">
            Two people. One city. One idea that deserved a stage.
          </h2>
          <p className="mt-6 max-w-4xl text-base font-semibold leading-8 text-slate-300 sm:text-lg">
            Gorakhpur&apos;s Got Latent was built with a belief that great talent does
            not always need to leave its city to be seen. Alok and Naveen set out to
            create something that feels local in its roots but ambitious in its vision —
            a place where performers can be discovered, audiences can be part of the
            experience and Gorakhpur can have a stage of its own.
          </p>
          <p className="mt-5 max-w-4xl text-base font-bold leading-8 text-white sm:text-lg">
            For Alok, GGL is not just another website or event. It is one of the
            biggest chapters of a journey that started in Kaudiram and is still being
            written.
          </p>
        </section>

        <section className="mt-16 flex flex-wrap gap-3">
          <a
            href="https://www.instagram.com/aloksingh_._/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-pink-500/30 bg-pink-500/10 px-5 py-3 text-sm font-black text-pink-300 transition hover:-translate-y-0.5 hover:border-pink-400 hover:bg-pink-500/20"
          >
            INSTAGRAM ↗
          </a>
          <a
            href="https://x.com/rajpratapsinghh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
          >
            X / TWITTER ↗
          </a>
          <a
            href="/developer"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-amber-300"
          >
            DEVELOPER PROFILE
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/[0.06]"
          >
            BACK TO GGL
          </a>
        </section>
      </div>
    </main>
  );
}
