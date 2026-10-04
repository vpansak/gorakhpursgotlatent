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
              Co-Founder · Full-Stack Developer · Technology Builder · A journey from Kaudiram to building a stage for Gorakhpur.
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
            THE BIOGRAPHY
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            The boy from Kaudiram who kept moving forward.
            <span className="block text-slate-400">No shortcut. Just one chapter at a time.</span>
          </h2>

          <div className="mt-8 space-y-6 text-base font-semibold leading-8 text-slate-300 sm:text-lg">
            <p>
              Every story that looks big from the outside usually begins somewhere
              ordinary. For <strong className="text-white">Alok Singh</strong>, it began
              in <strong className="text-amber-300">Kaudiram, Gorakhpur</strong> — with
              school, family, changing environments and a curiosity that slowly turned
              into a desire to build something of his own.
            </p>
            <p>
              His childhood was not one straight road. From LKG to Class 2 he studied
              at Purvanchal Public School. Class 3 took him to KMR, Janipur, Gola Road.
              From Class 4 to 10, he continued his journey at Holy Angel International
              School, Pali, Bansgaon. Then, for Classes 11 and 12, he returned to
              Purvanchal Public School.
            </p>
            <p>
              Looking back, those changes became part of the story. Different schools,
              different people and different phases taught him something simple:
              <strong className="text-white"> you do not need to have everything figured
              out at the beginning.</strong> You just have to keep learning and keep
              moving.
            </p>
            <p>
              After school came <strong className="text-amber-300">BCA at KIPM College</strong>.
              This was where his interest in technology became a direction. Web
              development, software, UI/UX, databases, APIs and deployment were no
              longer just technical words — they became tools through which Alok could
              turn an idea into something people could actually use.
            </p>
            <p>
              The real challenge was never only learning technology. It was learning
              how to take an idea from a thought to a working product — figuring things
              out, fixing what breaks, trying again, and refusing to stop at the first
              version. That builder mindset became one of the strongest parts of Alok's
              journey.
            </p>
            <p>
              And then came <strong className="text-amber-300">Naveen</strong>. Two people
              from the same city looked at the same place and saw a possibility:
              <strong className="text-white"> Gorakhpur has talent, creators and an
              audience — it deserves its own stage.</strong>
            </p>
            <p>
              That thought became <strong className="text-white">Gorakhpur's Got Latent</strong>.
              Alok and Naveen started building GGL not simply as a website, but as an
              experience — combining entertainment, technology, performers, audiences
              and the energy of their own city.
            </p>
            <p>
              Today, Alok's role sits at the intersection of <strong className="text-white">
              technology and vision</strong>. As Co-Founder and Full-Stack Developer, he
              works on the digital side of the platform while helping shape the bigger
              idea behind it.
            </p>
            <p>
              The journey is still unfinished. And perhaps that is the most interesting
              part of the story. From a student moving through different classrooms in
              and around Gorakhpur to becoming a BCA student, developer and Co-Founder,
              the next chapter is still being written — one idea, one problem and one
              build at a time.
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
            Two people. One city. A belief that Gorakhpur could build its own spotlight.
          </h2>
          <p className="mt-6 max-w-4xl text-base font-semibold leading-8 text-slate-300 sm:text-lg">
            Gorakhpur&apos;s Got Latent was built with a belief that great talent does
            not always need to leave its city to be seen. Alok and Naveen set out to
            create something that feels local in its roots but ambitious in its vision —
            a place where performers can be discovered, audiences can be part of the
            experience and Gorakhpur can have a stage of its own.
          </p>
          <p className="mt-5 max-w-4xl text-base font-bold leading-8 text-white sm:text-lg">
            For Alok, GGL is not just another website or event. It is a chapter in a much
            bigger journey — from learning in classrooms to building with code, and from
            having ideas to putting those ideas in front of a real audience.
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
