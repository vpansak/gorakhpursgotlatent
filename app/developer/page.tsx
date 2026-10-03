import Image from 'next/image';
import { Metadata } from 'next';
import {
  ArrowUpRight,
  Check,
  Code2,
  Database,
  Globe2,
  Layers3,
  MapPin,
  Server,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Alok Singh — Full-Stack Developer & Software Architect',
  description:
    'Official developer profile of Alok Singh, a full-stack web developer focused on modern web applications, real-time systems, cloud deployment and UI/UX engineering.',
  authors: [{ name: 'Alok Singh', url: 'https://gkpgotlatent.in/developer' }],
  creator: 'Alok Singh',
  publisher: 'Alok Singh',
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
    title: 'Alok Singh — Full-Stack Developer & Software Architect',
    description:
      'Full-stack web engineering, real-time systems, cloud deployment and UI/UX engineering.',
    url: 'https://gkpgotlatent.in/developer',
    siteName: 'Alok Singh',
    images: [
      {
        url: '/alok-singh.jpg',
        width: 800,
        height: 800,
        alt: 'Alok Singh — Full-Stack Developer',
      },
    ],
    locale: 'en_IN',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alok Singh — Full-Stack Developer',
    description:
      'Full-stack web engineering, real-time systems, cloud deployment and UI/UX engineering.',
    images: ['/alok-singh.jpg'],
  },
};

const socialLinks = [
  {
    name: 'Instagram',
    handle: '@aloksingh_._',
    url: 'https://www.instagram.com/aloksingh_._/',
  },
  {
    name: 'X',
    handle: '@rajpratapsinghh',
    url: 'https://x.com/rajpratapsinghh',
  },
  {
    name: 'Facebook',
    handle: '@meadorush',
    url: 'https://www.facebook.com/meadorush',
  },
];

const expertise = [
  {
    number: '01',
    icon: Code2,
    title: 'Full-Stack Development',
    description:
      'Modern frontend and backend application development with React, Next.js, TypeScript and Node.js.',
  },
  {
    number: '02',
    icon: Zap,
    title: 'Real-Time Systems',
    description:
      'Interactive applications, live data flows and low-latency experiences designed around real user interactions.',
  },
  {
    number: '03',
    icon: Globe2,
    title: 'Cloud & Deployment',
    description:
      'Production-ready web workflows, serverless architecture, APIs and deployment-focused engineering.',
  },
  {
    number: '04',
    icon: Layers3,
    title: 'UI / UX Engineering',
    description:
      'Responsive interfaces, design systems, micro-interactions and polished dark-mode experiences.',
  },
  {
    number: '05',
    icon: Database,
    title: 'Database & APIs',
    description:
      'Structured data models, PostgreSQL/SQL workflows, API integrations and reliable application data flow.',
  },
  {
    number: '06',
    icon: Server,
    title: 'Product Engineering',
    description:
      'Taking an idea from interface and architecture to a functional, connected digital product.',
  },
];

const technologies = {
  Frontend: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'App Router'],
  Backend: ['Node.js', 'REST APIs', 'WebSockets', 'Serverless Architecture'],
  Database: ['PostgreSQL', 'SQLite', 'SQL'],
  'Cloud & Deployment': ['Vercel', 'Serverless', 'Production Deployments'],
  'Engineering Focus': ['Real-Time Systems', 'API Design', 'Responsive UI', 'Design Systems'],
};

const principles = [
  {
    number: '01',
    title: 'Build with purpose',
    text: 'Every feature should solve a real problem and remain understandable to the people who use it.',
  },
  {
    number: '02',
    title: 'Design for people',
    text: 'Good engineering should feel simple from the user side, even when the system underneath is complex.',
  },
  {
    number: '03',
    title: 'Engineer for growth',
    text: 'Prefer modular structures, predictable data flow and foundations that can evolve with the product.',
  },
];

const developerJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': 'https://gkpgotlatent.in/developer#webpage',
  url: 'https://gkpgotlatent.in/developer',
  name: 'Alok Singh — Full-Stack Developer & Software Architect',
  description:
    'Official developer profile of Alok Singh, a full-stack web developer from Gorakhpur, Uttar Pradesh.',
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://gkpgotlatent.in/developer#person',
    name: 'Alok Singh',
    jobTitle: 'Full-Stack Developer & Software Architect',
    description:
      'Full-stack web developer focused on modern web applications, real-time systems, cloud deployment and UI/UX engineering.',
    url: 'https://gkpgotlatent.in/developer',
    image: 'https://gkpgotlatent.in/alok-singh.jpg',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Gorakhpur',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    sameAs: socialLinks.map((social) => social.url),
  },
};

export default function DeveloperPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070d] text-white selection:bg-amber-400 selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(developerJsonLd) }}
      />

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-280px] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[150px]" />
        <div className="absolute left-[-220px] top-[35%] h-[500px] w-[500px] rounded-full bg-red-500/5 blur-[140px]" />
        <div className="absolute right-[-220px] top-[65%] h-[520px] w-[520px] rounded-full bg-blue-500/5 blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#05070d]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className="flex items-center gap-2 font-black tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-400/30 bg-amber-400/10 text-amber-300">
              AS
            </span>
            <span className="hidden sm:block">ALOK SINGH</span>
          </a>
          <div className="hidden items-center gap-7 text-xs font-semibold text-slate-400 md:flex">
            <a className="transition hover:text-white" href="#about">About</a>
            <a className="transition hover:text-white" href="#expertise">Expertise</a>
            <a className="transition hover:text-white" href="#stack">Stack</a>
            <a className="transition hover:text-white" href="#principles">Principles</a>
            <a className="transition hover:text-amber-300" href="#contact">Contact</a>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 sm:flex">
              {socialLinks.map((social) => {
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    title={social.name}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-400 transition hover:-translate-y-0.5 hover:border-amber-400/30 hover:bg-amber-400/10 hover:text-amber-300"
                  >
                    {social.name === 'Instagram' && (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="5" />
                        <circle cx="12" cy="12" r="4.2" />
                        <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
                      </svg>
                    )}
                    {social.name === 'Facebook' && (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                        <path d="M13.4 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6h1.8V3.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.7v8h3.2Z" />
                      </svg>
                    )}
                    {social.name === 'X' && (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                        <path d="M18.9 2.5h2.9l-6.3 7.2 7.4 9.8h-5.8l-4.5-5.9-5.2 5.9H4.5l6.8-7.8L4.2 2.5h5.9l4.1 5.4 4.7-5.4Zm-1 15.3h1.6L9.1 4.1H7.4l10.5 13.7Z" />
                      </svg>
                    )}
                  </a>
                );
              })}
            </div>
            <a
              href="#contact"
              className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-300 transition hover:border-amber-300/60 hover:bg-amber-400/15"
            >
              LET&apos;S CONNECT
            </a>
          </div>
        </div>
      </nav>

      <div id="top" className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8 sm:pt-20">
        <section className="relative grid items-center gap-12 lg:grid-cols-[.82fr_1.18fr]">
          <div className="relative mx-auto w-full max-w-[440px] lg:mx-0">
            <div className="absolute -inset-8 rounded-[44px] bg-amber-400/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.035] p-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] border border-amber-300/20 bg-slate-900">
                <Image
                  src="/alok-singh.jpg"
                  alt="Alok Singh — Full-Stack Developer and Product Builder"
                  fill
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070d]/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-black/45 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-amber-200 backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    Developer · Co-Founder · Builder
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 p-2 pt-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <div className="rounded-xl border border-white/5 bg-black/20 px-2 py-3">
                  <span className="block text-white">FULL</span> STACK
                </div>
                <div className="rounded-xl border border-white/5 bg-black/20 px-2 py-3">
                  <span className="block text-white">PRODUCT</span> BUILDING
                </div>
                <div className="rounded-xl border border-white/5 bg-black/20 px-2 py-3">
                  <span className="block text-white">UI / UX</span> ENGINEERING
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.06] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300">
              <Terminal className="h-3.5 w-3.5" />
              Full-Stack Developer · Co-Founder · AI Builder
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.05em] sm:text-7xl lg:text-[6.2rem]">
              ALOK
              <span className="block bg-gradient-to-r from-white via-amber-100 to-amber-400 bg-clip-text text-transparent">
                SINGH
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              I build <span className="font-semibold text-white">web products</span>,
              <span className="font-semibold text-white"> developer tools</span> and
              <span className="font-semibold text-white"> digital experiences</span> from idea to production.
            </p>

            <div className="mt-6 max-w-2xl space-y-4 text-sm leading-7 text-slate-400 sm:text-[15px]">
              <p>
                I&apos;m Alok Singh, a developer and product builder from Gorakhpur, Uttar Pradesh.
                My work sits at the intersection of full-stack engineering, UI/UX, databases,
                APIs, cloud deployment and real-time web systems.
              </p>
              <p>
                I&apos;m also building <span className="font-semibold text-white">ALØK STUDIO</span>, a
                multi-language online coding and development environment focused on making coding
                and experimentation more accessible.
              </p>
              <p>
                I also work on the technology and web experience behind
                <span className="font-semibold text-white"> Gorakhpur&apos;s Got Latent</span>,
                combining product thinking, frontend development, backend systems, databases,
                deployment and practical event technology.
              </p>
              <p>
                I&apos;m currently pursuing BCA with an interest in web development, AI and
                software technology — learning by building real systems instead of only studying theory.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#about"
                className="group inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-amber-300"
              >
                READ MY STORY
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                CONNECT WITH ME
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500">
              <MapPin className="h-4 w-4 text-amber-400" />
              Gorakhpur, Uttar Pradesh, India
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span>Developer · Co-Founder · Student</span>
            </div>
          </div>
        </section>

        <section id="about" className="mt-28 scroll-mt-24">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">01 — Biography</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                From curiosity to real products.
              </h2>
              <p className="mt-5 text-sm leading-7 text-slate-500">
                A young builder&apos;s journey through code, design, products and real-world problem solving.
              </p>
            </div>

            <div className="space-y-5 text-base leading-8 text-slate-400">
              <p>
                Alok Singh is a self-taught Full-Stack Developer and Co-Founder based in
                Gorakhpur, Uttar Pradesh. His journey into technology began around Class 12,
                influenced by seeing engineering and technology closely within his family.
              </p>
              <p>
                Rather than following a purely academic route, he learned by building. Websites,
                software experiments, AI tools and digital products became the way he understood
                how technology works — from frontend interfaces and backend systems to databases,
                APIs and deployment.
              </p>
              <p>
                Today, his work sits across <span className="font-semibold text-white">web development,
                AI and marketing</span>. As Head Developer and Co-Founder, he focuses on turning
                ideas into products that are useful, visually strong and practical to grow.
              </p>
              <p>
                He is especially interested in <span className="font-semibold text-white">AI products,
                modern web development and startup/product building</span>, with a long-term goal
                of creating technology that people actually use.
              </p>

              <div className="grid gap-3 pt-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-4">
                  <span className="block text-xs font-bold uppercase tracking-wider text-amber-300">Role</span>
                  <span className="mt-2 block text-sm font-semibold text-white">Developer · Co-Founder</span>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-4">
                  <span className="block text-xs font-bold uppercase tracking-wider text-amber-300">Focus</span>
                  <span className="mt-2 block text-sm font-semibold text-white">AI · Web · Marketing</span>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-4">
                  <span className="block text-xs font-bold uppercase tracking-wider text-amber-300">Based in</span>
                  <span className="mt-2 block text-sm font-semibold text-white">Gorakhpur, UP</span>
                </div>
              </div>            </div>
          </div>
        </section>

        <section id="expertise" className="mt-28 scroll-mt-24">
          <div className="mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">02 — Expertise</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">What I build.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              A practical engineering toolkit spanning interfaces, application logic, data and deployment.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.number}
                  className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:bg-white/[0.045]"
                >
                  <div className="mb-10 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-600">{item.number}</span>
                    <Icon className="h-5 w-5 text-amber-300/70 transition group-hover:text-amber-300" />
                  </div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{item.description}</p>
                  <div className="mt-6 h-px w-10 bg-amber-400/40 transition-all group-hover:w-20" />
                </article>
              );
            })}
          </div>
        </section>

        <section id="stack" className="mt-28 scroll-mt-24">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">03 — Stack</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Tools behind the work.</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
                Technologies currently represented across the developer profile and engineering work.
              </p>
            </div>

            <div className="space-y-3">
              {Object.entries(technologies).map(([category, items]) => (
                <div
                  key={category}
                  className="rounded-2xl border border-white/8 bg-white/[0.025] p-5 sm:flex sm:items-center sm:gap-6"
                >
                  <div className="mb-3 w-40 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-500 sm:mb-0">
                    {category}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-white/8 bg-black/20 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-amber-400/25 hover:text-amber-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="principles" className="mt-28 scroll-mt-24">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">04 — Principles</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">How I approach software.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {principles.map((item) => (
              <article
                key={item.number}
                className="rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.045] to-white/[0.015] p-6"
              >
                <span className="font-mono text-xs text-amber-300">{item.number}</span>
                <h3 className="mt-8 text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-28 overflow-hidden rounded-3xl border border-amber-400/15 bg-gradient-to-br from-amber-400/[0.08] via-white/[0.025] to-red-400/[0.04] p-7 sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">A note from the builder</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Good software should feel simple.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                I enjoy turning complex ideas into interfaces and systems that people can actually use.
                The goal is not just to make software work — it is to make the experience feel intentional.
              </p>
            </div>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-400/10">
              <Check className="h-9 w-9 text-amber-300" />
            </div>
          </div>
        </section>

        <section id="contact" className="mt-28 scroll-mt-24 pb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">05 — Contact</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
            Let&apos;s build something useful.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500">
            Have an idea, product or technical challenge? Connect through the social profiles below.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-left transition hover:-translate-y-0.5 hover:border-amber-400/30 hover:bg-white/[0.06]"
              >
                <span>
                  <span className="block text-xs font-bold text-white">{social.name}</span>
                  <span className="text-[11px] text-slate-500">{social.handle}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-slate-500 transition group-hover:text-amber-300" />
              </a>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/5 pt-6 text-center text-xs text-slate-600">
          <p>ALOK SINGH · Full-Stack Developer · Gorakhpur, Uttar Pradesh, India</p>
          <p className="mt-2">© 2026 Alok Singh</p>
        </footer>
      </div>
    </main>
  );
}
