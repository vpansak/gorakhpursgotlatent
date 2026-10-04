import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Sparkles, 
  Trophy, 
  Mic2, 
  Star, 
  Users, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Globe, 
  ExternalLink, 
  Zap, 
  Flame, 
  Tv, 
  Code2,
  Heart,
  Award,
  CheckCircle2,
  Share2,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Naveen Varma | Founder & Show Creator - Gorakhpur's Got Latent",
  description: "Official profile, vision, and creator spotlight of Naveen Varma — Founder, Show Creator & Host of Gorakhpur's Got Latent digital entertainment ecosystem.",
  authors: [{ name: "Naveen Varma", url: "https://gkpgotlatent.in/founder" }],
  creator: "Naveen Varma",
  publisher: "Gorakhpur's Got Latent",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Naveen Varma | Founder & Creator - Gorakhpur's Got Latent",
    description: "Discover the vision, origins, and story behind Gorakhpur's Got Latent by Founder & Show Creator Naveen Varma (@nvn_unfiltered).",
    url: 'https://gkpgotlatent.in/founder',
    siteName: "Gorakhpur's Got Latent",
    images: [
      {
        url: '/naveen-varma.jpg',
        width: 800,
        height: 800,
        alt: 'Naveen Varma - Founder & Show Creator',
      },
    ],
    locale: 'en_IN',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Naveen Varma | Founder - Gorakhpur's Got Latent",
    description: "Founder & Show Creator of Gorakhpur's Got Latent. Kuch Bhi Ho Sakta Hai!",
    images: ['/naveen-varma.jpg'],
  },
};

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

export default function FounderPage() {
  const highlights = [
    { label: "Show Tapings & Live Events", value: "Episode 1 Tapings Live", icon: Trophy, color: "text-amber-400" },
    { label: "Audition Applicants Reviewed", value: "1,000+ Performers", icon: Mic2, color: "text-orange-400" },
    { label: "Purvanchal Reach & Audience", value: "50,000+ Viewers", icon: Users, color: "text-yellow-400" },
    { label: "Official Show Motto", value: "Kuch Bhi Ho Sakta Hai!", icon: Flame, color: "text-red-400" }
  ];

  const pillars = [
    {
      title: "🎤 Unfiltered Entertainment & Stage Comedy",
      description: "Gorakhpur me raw talent, stand-up comedy, roast sessions, aur unique performance art ko ek open, transparent platform dena. Koi fake scripted drama nahi — sab kuch pure, real-time stage energy par chalta hai.",
      icon: Mic2,
      tag: "CORE SHOW PHILOSOPHY"
    },
    {
      title: "💻 State-of-the-Art Tech Architecture",
      description: "Ek powerful, sub-100ms real-time 'Computerji' stage scoring system aur digital ticketing platform.",
      icon: Code2,
      tag: "DIGITAL INNOVATION"
    },
    {
      title: "🏆 Transparent Audience & Judge Scoring",
      description: "Performers ka score bina kisi bias ke transparently screen par display hota hai. Audience voting aur judge panel ratings milkar genuine Purvanchal champions create karte hain.",
      icon: Trophy,
      tag: "STAGE FAIRNESS"
    },
    {
      title: "🚀 Purvanchal to National Spotlight",
      description: "Gorakhpur aur aas-paas ke tier-2/tier-3 cities ke hidden stars ko live audience spotlight, YouTube visibility, aur industry representation dena.",
      icon: TrendingUp,
      tag: "TALENT GROWTH"
    }
  ];

  const founderJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': 'https://gkpgotlatent.in/founder#webpage',
        'url': 'https://gkpgotlatent.in/founder',
        'name': "Naveen Varma - Founder & Show Creator | Gorakhpur's Got Latent",
        'description': "Official profile and vision of Naveen Varma, Founder and Show Creator of Gorakhpur's Got Latent.",
        'mainEntity': {
          '@type': 'Person',
          '@id': 'https://gkpgotlatent.in/#naveenvarma',
          'name': 'Naveen Varma',
          'jobTitle': 'Founder, Show Creator & Producer',
          'description': "Founder, Show Creator, and Lead Host who envisioned and launched Gorakhpur's Got Latent, Purvanchal's flagship live talent hunt and roast show.",
          'url': 'https://gkpgotlatent.in/founder',
          'image': 'https://gkpgotlatent.in/naveen-varma.jpg',
          'sameAs': [
            'https://www.instagram.com/nvn_unfiltered/'
          ],
          'worksFor': {
            '@type': 'Organization',
            '@id': 'https://gkpgotlatent.in/#organization',
            'name': "Gorakhpur's Got Latent",
            'url': 'https://gkpgotlatent.in'
          }
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white relative overflow-hidden selection:bg-red-500 selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(founderJsonLd) }} />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[150px]" />
        <div className="absolute top-[38%] -left-72 h-[620px] w-[620px] rounded-full bg-amber-500/10 blur-[160px]" />
        <div className="absolute top-[65%] -right-72 h-[620px] w-[620px] rounded-full bg-red-500/8 blur-[160px]" />
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto mb-7 flex max-w-6xl items-center justify-between border-b border-white/10 pb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-red-400">GGL • CREATOR SERIES</p>
            <p className="mt-1 text-xs text-slate-500">Behind the stage. Behind the vision.</p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            Official Founder Profile
          </div>
        </div>

        <section className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-red-500/20 bg-[#09090c] shadow-[0_30px_120px_rgba(0,0,0,.7)]">
          <div className="relative grid lg:grid-cols-12">
            <div className="relative flex items-center justify-center p-6 sm:p-10 lg:col-span-5 lg:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,.12),transparent_55%)]" />
              <div className="relative w-full max-w-sm">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-amber-400/35 bg-black shadow-[0_0_80px_rgba(239,68,68,.16)]">
                  <Image src="/naveen-varma.jpg" alt="Naveen Varma - Founder & Show Creator" fill className="object-cover object-top contrast-105 transition duration-700 hover:scale-[1.03]" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  <div className="absolute inset-x-5 bottom-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.28em] text-amber-300">Founder & Show Creator</p>
                    <div className="mt-1 flex items-end justify-between gap-3">
                      <h2 className="font-bebas text-4xl tracking-wide text-white">NAVEEN VARMA</h2>
                      <span className="rounded-full border border-red-400/30 bg-red-500/15 p-3 text-red-300 backdrop-blur-md"><Flame className="h-5 w-5" /></span>
                    </div>
                  </div>
                </div>
                <a href="https://www.instagram.com/nvn_unfiltered/" target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-pink-500/20 bg-gradient-to-r from-pink-600/15 via-purple-600/15 to-amber-500/15 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:border-pink-400/50">
                  <InstagramIcon className="h-4 w-4" /> @nvn_unfiltered
                </a>
              </div>
            </div>

            <div className="relative flex flex-col justify-center border-t border-white/10 p-7 sm:p-10 lg:col-span-7 lg:border-l lg:border-t-0 lg:p-14">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
                <Sparkles className="h-3.5 w-3.5" /> CREATOR SPOTLIGHT
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-slate-500">THE MIND BEHIND THE STAGE</p>
              <h1 className="mt-2 font-bebas text-6xl leading-[.82] tracking-wide sm:text-8xl">
                NAVEEN <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 bg-clip-text text-transparent">VARMA</span>
              </h1>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-black uppercase tracking-wider text-amber-300">
                <span>Founder</span><span className="text-red-500">•</span><span>Show Creator</span><span className="text-red-500">•</span><span>Host</span>
              </div>
              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                “Gorakhpur’s Got Latent ko shuru karne ka maksad simple tha — Purvanchal ke performers ko ek aisa platform dena jaha unka talent pure, unfiltered aur transparent tareeqe se duniya ke samne aaye. Kuch Bhi Ho Sakta Hai!”
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="https://www.instagram.com/nvn_unfiltered/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 text-xs font-black uppercase tracking-wider text-black shadow-[0_10px_35px_rgba(245,158,11,.2)] transition hover:scale-[1.02]">
                  <InstagramIcon className="h-4 w-4" /> Connect with Naveen
                </a>
                <Link href="/ep1" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-200 transition hover:border-amber-400/30">
                  <Trophy className="h-4 w-4 text-amber-400" /> Episode 1 Results
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-5 grid max-w-6xl grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-[#09090c] sm:grid-cols-4">
          {highlights.map((item, idx) => (
            <div key={idx} className="border-b border-white/10 p-5 text-center transition hover:bg-white/[0.025] sm:border-b-0 sm:border-r last:border-r-0">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]"><item.icon className={`h-5 w-5 ${item.color}`} /></div>
              <div className="mt-3 font-bebas text-2xl tracking-wide text-white sm:text-3xl">{item.value}</div>
              <div className="mt-1 text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">{item.label}</div>
            </div>
          ))}
        </section>

        <section className="mx-auto mt-20 max-w-6xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-red-400">THE BLUEPRINT</p>
              <h2 className="mt-2 font-bebas text-5xl leading-none sm:text-7xl">SHOW <span className="bg-gradient-to-r from-amber-200 to-orange-500 bg-clip-text text-transparent">VISION</span></h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">How Naveen Varma conceptualized Gorakhpur’s Got Latent to blend live stage roasts, authentic regional talent, and cutting-edge tech.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {pillars.map((pillar, idx) => (
              <article key={idx} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#09090c] p-6 transition duration-300 hover:-translate-y-1 hover:border-red-500/30 sm:p-8">
                <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-red-500/5 blur-3xl group-hover:bg-red-500/10" />
                <div className="relative flex items-start justify-between gap-4">
                  <span className="rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-amber-300">{pillar.tag}</span>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-amber-400"><pillar.icon className="h-5 w-5" /></div>
                </div>
                <h3 className="relative mt-7 font-bebas text-3xl uppercase leading-tight tracking-wide sm:text-4xl">{pillar.title}</h3>
                <p className="relative mt-4 text-sm leading-7 text-slate-400">{pillar.description}</p>
                <div className="mt-7 h-px bg-gradient-to-r from-red-500/50 via-amber-400/20 to-transparent" />
                <div className="mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">FOUNDER VISION</div>
              </article>
            ))}
          </div>
        </section>

        <section className="relative mx-auto mt-20 max-w-6xl overflow-hidden rounded-[2rem] border border-red-500/20 bg-gradient-to-br from-[#160a0a] via-[#09090c] to-[#141008] p-8 text-center sm:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,.12),transparent_48%)]" />
          <div className="relative">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-red-400">KEEP WATCHING</p>
            <h2 className="mt-3 font-bebas text-4xl sm:text-6xl">THE STORY IS <span className="bg-gradient-to-r from-amber-200 to-orange-500 bg-clip-text text-transparent">JUST BEGINNING.</span></h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">Stay updated with behind-the-scenes tapings, audition drops, Episode 2 announcements, and live roasts directly from Founder Naveen Varma.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="https://www.instagram.com/nvn_unfiltered/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 px-6 py-4 text-xs font-black uppercase tracking-wider text-white shadow-2xl transition hover:scale-[1.02]">
                <InstagramIcon className="h-5 w-5" /> @nvn_unfiltered
              </a>
              <Link href="/apply/performer" className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-6 py-4 text-xs font-black uppercase tracking-wider text-emerald-300">
                <Mic2 className="h-4 w-4" /> Apply for Episode 2 Auditions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
