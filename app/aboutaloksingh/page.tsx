import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alok Singh — Biography, Story, Developer & Co-Founder in Gorakhpur',
  description:
    'Official Alok Singh profile: biography, life story, education journey from Kaudiram and Gorakhpur, BCA at KIPM College, technology work, and Co-Founder journey with Gorakhpur’s Got Latent.',
  keywords: [
    'Alok Singh',
    'Alok Singh Gorakhpur',
    'Alok Singh Kaudiram',
    'Alok Singh Kauriram',
    'Alok Singh Uttar Pradesh',
    'Alok Singh biography',
    'Alok Singh story',
    'Alok Singh life story',
    'Alok Singh education',
    'Alok Singh developer',
    'Alok Singh full stack developer',
    'Alok Singh software developer',
    'Alok Singh web developer',
    'Alok Singh technology builder',
    'Alok Singh Co-Founder',
    'Alok Singh Gorakhpur Got Latent',
    'Alok Singh GGL',
    'Gorakhpur Got Latent Alok Singh',
    'GGL Alok Singh',
    'Alok Singh KIPM College',
    'Alok Singh Purvanchal Public School',
    'Alok Singh Holy Angel International School',
    'Alok Singh KMR Janipur',
    'Alok Singh Instagram',
    'Alok Singh X Twitter',
    'Alok Singh Facebook',
  ],
  alternates: {
    canonical: 'https://gkpgotlatent.in/aboutaloksingh',
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
    title: 'Alok Singh — Biography, Story, Developer & Co-Founder',
    description:
      'The official story and profile of Alok Singh from Kaudiram, Gorakhpur — developer, technology builder and Co-Founder of Gorakhpur’s Got Latent.',
    url: 'https://gkpgotlatent.in/aboutaloksingh',
    siteName: "Gorakhpur's Got Latent",
    images: [
      {
        url: '/developer-photo-1.jpg',
        width: 800,
        height: 800,
        alt: 'Alok Singh — Developer and Co-Founder',
      },
    ],
    locale: 'en_IN',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alok Singh — Biography, Developer & Co-Founder',
    description:
      'The story of Alok Singh from Kaudiram, Gorakhpur to technology and Gorakhpur’s Got Latent.',
    images: ['/developer-photo-1.jpg'],
  },
};

const profileJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': 'https://gkpgotlatent.in/aboutaloksingh#profile',
  url: 'https://gkpgotlatent.in/aboutaloksingh',
  name: 'Alok Singh — Official Biography and Profile',
  description:
    'Official biography and profile of Alok Singh, a full-stack developer, technology builder and Co-Founder of Gorakhpur’s Got Latent.',
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://gkpgotlatent.in/aboutaloksingh#person',
    name: 'Alok Singh',
    alternateName: ['Alok Singh Gorakhpur', 'Alok Singh Kaudiram'],
    description:
      'Full-stack developer, technology builder and Co-Founder of Gorakhpur’s Got Latent from Kaudiram, Gorakhpur, Uttar Pradesh, India.',
    image: 'https://gkpgotlatent.in/developer-photo-1.jpg',
    jobTitle: ['Full-Stack Developer', 'Technology Builder', 'Co-Founder'],
    sameAs: [
      'https://www.instagram.com/aloksingh_._/',
      'https://x.com/rajpratapsinghh',
      'https://www.facebook.com/meadorush',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kaudiram, Gorakhpur',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    alumniOf: [
      { '@type': 'EducationalOrganization', name: 'Purvanchal Public School' },
      { '@type': 'EducationalOrganization', name: 'KMR, Janipur, Gola Road' },
      { '@type': 'EducationalOrganization', name: 'Holy Angel International School, Pali, Bansgaon' },
      { '@type': 'EducationalOrganization', name: 'KIPM College' },
    ],
    worksFor: {
      '@type': 'Organization',
      name: "Gorakhpur's Got Latent",
      url: 'https://gkpgotlatent.in',
    },
  },
};

const education = [
  ['LKG → Class 2', 'Purvanchal Public School', 'The first chapter of Alok’s school journey.'],
  ['Class 3', 'KMR, Janipur — Gola Road', 'A new school and a new chapter in the journey.'],
  ['Class 4 → 10', 'Holy Angel International School, Pali — Bansgaon', 'A long formative chapter of school life, learning and growing up.'],
  ['Class 11 → 12', 'Purvanchal Public School', 'Returning to Purvanchal for senior school and moving closer to a technology-focused future.'],
  ['College', 'KIPM College — BCA', 'The technology chapter: web development, software, UI/UX, databases, APIs and building digital products.'],
];

const searchTopics = [
  'Alok Singh biography',
  'Who is Alok Singh from Gorakhpur?',
  'Alok Singh Kaudiram Gorakhpur',
  'Alok Singh full-stack developer',
  'Alok Singh Co-Founder of Gorakhpur’s Got Latent',
  'Alok Singh GGL',
  'Alok Singh KIPM College',
  'Alok Singh education',
  'Alok Singh Instagram',
  'Alok Singh X Twitter',
  'Alok Singh Facebook',
];

export default function AboutAlokSinghPage() {
  return (
    <main className="min-h-screen bg-[#05070d] px-5 py-14 text-white sm:px-8 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />

      <div className="mx-auto max-w-6xl">
        <section className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-300">
              OFFICIAL PROFILE · ALOK SINGH
            </p>
            <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] sm:text-7xl lg:text-8xl">
              ALOK
              <span className="block text-amber-300">SINGH</span>
            </h1>
            <p className="mt-5 max-w-3xl text-xl font-bold leading-8 text-slate-200 sm:text-2xl">
              Full-Stack Developer · Technology Builder · Co-Founder · A story from
              Kaudiram, Gorakhpur to building digital experiences for Gorakhpur.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-200">
                📍 Kaudiram, Gorakhpur, Uttar Pradesh, India
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-slate-200">
                BCA · KIPM College
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] bg-amber-400/10 blur-3xl" />
            <img
              src="/developer-photo-1.jpg"
              alt="Alok Singh — Full-Stack Developer and Co-Founder from Gorakhpur"
              width={800}
              height={800}
              className="relative aspect-square w-full rounded-[2rem] border border-amber-300/20 object-cover shadow-2xl shadow-black/50"
            />
          </div>
        </section>

        <section className="mt-20 max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
            THE STORY
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            From Kaudiram to code, from classrooms to a stage.
          </h2>

          <div className="mt-8 space-y-6 text-base font-semibold leading-8 text-slate-300 sm:text-lg">
            <p>
              <strong className="text-white">Alok Singh</strong> is a young technology
              builder and Co-Founder from <strong className="text-amber-300">Kaudiram,
              Gorakhpur, Uttar Pradesh</strong>. His story is not a story of one sudden
              breakthrough. It is a story of changing schools, learning new things,
              finding technology, building through problems and slowly turning ideas
              into things that people can actually use.
            </p>
            <p>
              His journey started at <strong className="text-white">Purvanchal Public
              School</strong>, where he studied from LKG to Class 2. Class 3 brought a
              new chapter at <strong className="text-white">KMR, Janipur, Gola Road</strong>.
              From Class 4 to Class 10, he studied at <strong className="text-white">
              Holy Angel International School, Pali, Bansgaon</strong>. For Classes 11
              and 12, he returned to Purvanchal Public School.
            </p>
            <p>
              Looking back, the changes in school were more than changes of address.
              Each chapter meant new surroundings, new people and another opportunity
              to adapt. That became an important part of Alok’s mindset: learn, adjust,
              keep moving and keep building. The journey did not come with a perfect
              roadmap; the direction became clearer step by step.
            </p>
            <p>
              After school, Alok chose <strong className="text-amber-300">BCA at KIPM
              College</strong>. Technology became more than an interest. Web development,
              software engineering, UI/UX, databases, APIs, cloud deployment and digital
              products became practical tools for turning ideas into working experiences.
            </p>
            <p>
              The struggle in a builder’s journey is often invisible. It is the time
              spent understanding something that did not work, fixing bugs, rebuilding
              an idea, learning a new tool and trying again. For Alok, that process is
              part of the story. He prefers building and learning by doing rather than
              waiting for everything to be perfect before starting.
            </p>
            <p>
              One of the biggest chapters came with <strong className="text-amber-300">
              Naveen</strong>. Together, they built <strong className="text-white">
              Gorakhpur’s Got Latent</strong> with a simple belief: Gorakhpur and
              Purvanchal have talent, creators, performers and audiences that deserve
              their own spotlight.
            </p>
            <p>
              Today, Alok’s identity sits at the intersection of <strong className="text-white">
              technology, creativity and entertainment</strong>. He works as a
              Full-Stack Developer and Technology Builder while contributing as
              Co-Founder of Gorakhpur’s Got Latent. From the digital platform to the
              systems behind an entertainment experience, his work is about turning
              ideas into something real.
            </p>
            <p>
              This is still an unfinished story. The next chapter is being written
              through every project, every new problem, every line of code and every
              idea that gets a chance to become real. The journey from Kaudiram to
              Gorakhpur, from school classrooms to BCA, and from learning technology
              to building a platform with Naveen is only one part of what comes next.
            </p>
          </div>
        </section>

        <section className="mt-20">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
            EDUCATION JOURNEY
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">
            Alok Singh — School to BCA
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {education.map(([stage, school, text], index) => (
              <article
                key={stage}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-black tracking-[0.2em] text-amber-300">
                    {stage}
                  </span>
                  <span className="text-xs font-black text-white/25">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black">{school}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-400">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 overflow-hidden rounded-[2rem] border border-amber-300/20 bg-gradient-to-br from-amber-300/[0.10] via-white/[0.03] to-red-500/[0.08] p-7 sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
            ALOK SINGH × NAVEEN
          </p>
          <h2 className="mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-5xl">
            Two people. One city. One belief: Gorakhpur deserves its own spotlight.
          </h2>
          <p className="mt-6 max-w-4xl text-base font-semibold leading-8 text-slate-300 sm:text-lg">
            Gorakhpur’s Got Latent became the chapter where technology and entertainment
            came together. Alok and Naveen built around the idea of giving performers
            and creators a local platform with an ambitious vision. For Alok, GGL is
            not just a website. It is a real-world example of what can happen when an
            idea is backed by technology, persistence and a willingness to build.
          </p>
        </section>

        <section className="mt-20">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
            WHAT ALOK DOES
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">
            Technology, products and digital experiences.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['FULL-STACK DEVELOPMENT', 'Modern web applications, frontend interfaces, backend systems and APIs.'],
              ['UI / UX', 'Responsive interfaces and polished digital experiences designed around real users.'],
              ['DATABASES & SYSTEMS', 'Data models, application logic, integrations and practical system architecture.'],
              ['CLOUD & DEPLOYMENT', 'Turning projects into accessible, production-ready web experiences.'],
              ['DIGITAL PRODUCTS', 'Taking an idea from concept to a working website, tool or platform.'],
              ['GGL TECHNOLOGY', 'Building technology around Gorakhpur’s Got Latent and its entertainment experience.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                <h3 className="text-sm font-black tracking-wide text-amber-200">{title}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
            SEARCH AROUND THE STORY
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">
            Find Alok Singh across the web.
          </h2>
          <p className="mt-5 max-w-4xl text-base font-semibold leading-8 text-slate-400">
            This page brings together the public identity, biography, education journey,
            technology profile and GGL story of Alok Singh so that people searching for
            Alok Singh Gorakhpur, Alok Singh Kaudiram, Alok Singh developer, Alok Singh
            Co-Founder, Alok Singh GGL, or Alok Singh social profiles can find the
            relevant official information in one place.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {searchTopics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-bold text-slate-300"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
            SOCIAL PROFILES
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">
            Connect with Alok Singh
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://www.instagram.com/aloksingh_._/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-pink-500/30 bg-pink-500/10 px-5 py-3 text-sm font-black text-pink-300 hover:bg-pink-500/20"
            >
              INSTAGRAM · @aloksingh_._ ↗
            </a>
            <a
              href="https://x.com/rajpratapsinghh"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black text-white hover:bg-white/[0.08]"
            >
              X / TWITTER · @rajpratapsinghh ↗
            </a>
            <a
              href="https://www.facebook.com/meadorush"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm font-black text-blue-200 hover:bg-blue-500/20"
            >
              FACEBOOK · @meadorush ↗
            </a>
            <a
              href="/developer"
              className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black hover:bg-amber-300"
            >
              FULL DEVELOPER PROFILE
            </a>
          </div>
        </section>

        <section className="mt-20 border-t border-white/10 pt-14">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
            FREQUENTLY SEARCHED QUESTIONS
          </p>
          <div className="mt-7 space-y-5">
            {[
              ['Who is Alok Singh?', 'Alok Singh is a Full-Stack Developer, Technology Builder and Co-Founder associated with Gorakhpur’s Got Latent, based in Kaudiram, Gorakhpur, Uttar Pradesh.'],
              ['Where is Alok Singh from?', 'Alok Singh is from Kaudiram, Gorakhpur, Uttar Pradesh, India.'],
              ['What does Alok Singh do?', 'Alok Singh works in full-stack web development, technology building, digital products and the technology side of Gorakhpur’s Got Latent.'],
              ['Who is the Co-Founder of Gorakhpur’s Got Latent?', 'Alok Singh is a Co-Founder of Gorakhpur’s Got Latent alongside Naveen, with Alok contributing technology and digital product work.'],
              ['Where did Alok Singh study?', 'His education journey includes Purvanchal Public School, KMR in Janipur on Gola Road, Holy Angel International School in Pali, Bansgaon, and BCA at KIPM College.'],
              ['Where can I find Alok Singh on social media?', 'Public profile links on this page include Instagram, X/Twitter and Facebook, along with his full developer profile on the official GGL website.'],
            ].map(([question, answer]) => (
              <article key={question} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                <h3 className="text-lg font-black text-white">{question}</h3>
                <p className="mt-2 text-sm font-semibold leading-7 text-slate-400">{answer}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="mt-20 border-t border-white/10 pt-8 text-sm font-semibold text-slate-500">
          Official Alok Singh profile · Gorakhpur, Uttar Pradesh, India ·
          <a href="/cofounder" className="ml-1 text-amber-300 hover:text-amber-200">
            Co-Founder profile
          </a>
          {' · '}
          <a href="/developer" className="text-amber-300 hover:text-amber-200">
            Developer profile
          </a>
        </footer>
      </div>
    </main>
  );
}
