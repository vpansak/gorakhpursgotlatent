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
    <div className="min-h-screen bg-[#050507] text-white relative overflow-hidden selection:bg-red-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(founderJsonLd) }}
      />

      {/* CINEMATIC BACKDROP */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[140px]" />
        <div className="absolute top-[35%] -left-60 h-[600px] w-[600px] rounded-full bg-amber-500/8 blur-[150px]" />
        <div className="absolute top-[55%] -right-60 h-[650px] w-[650px] rounded-full bg-red-500/8 blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        {/* TOP LABEL */}
        <div className="mx-auto mb-8 flex max-w-6xl items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-red-400">GGL • CREATOR SERIES</p>
            <p className="mt-1 text-xs text-slate-500">Behind the stage. Behind the vision.</p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            Official Founder Profile
          </div>
        </div>

        {/* HERO */}
        <section className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0d]/95 shadow-[0_30px_120px_rgba(0,0,0,.65)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(239,68,68,.14),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(245,158,11,.08),transparent_30%)]" />
          <div className="relative grid grid-cols-1 lg:grid-cols-12">
            <div className="flex items-center justify-center p-6 sm:p-10 lg:col-span-5 lg:p-14">
              <div className="w-full max-w-md">
                <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-amber-400/30 bg-black shadow-[0_0_70px_rgba(239,68,68,.16)]">
                  <Image
                    src="/naveen-varma.jpg"
                    alt="Naveen Varma - Founder & Show Creator"
                    fill
                    className="object-cover object-top contrast-105 transition-transform duration-700 hover:scale-[1.03]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                  <div className="absolute left-5 right-5 bottom-5">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-300">Founder & Show Creator</p>
                        <p className="mt-1 font-bebas text-3xl tracking-wide text-white">NAVEEN VARMA</p>
                      </div>
                      <div className="rounded-full border border-red-400/30 bg-red-500/15 p-3 text-red-300 backdrop-blur-md">
                        <Flame className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href="https://www.instagram.com/nvn_unfiltered/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-pink-500/20 bg-gradient-to-r from-pink-600/15 via-purple-600/15 to-amber-500/15 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:border-pink-400/50 hover:bg-pink-500/10"
                >
                  <InstagramIcon className="h-4 w-4" />
                  @nvn_unfiltered on Instagram ↗
                </a>
              </div>
            </div>

            <div className="flex flex-col justify-center border-t border-white/10 p-7 sm:p-10 lg:col-span-7 lg:border-l lg:border-t-0 lg:p-14">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-red-300">
                <Sparkles className="h-3.5 w-3.5" />
                Creator Spotlight
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">The mind behind the stage</p>
              <h1 className="mt-2 font-bebas text-6xl leading-[.85] tracking-wide text-white sm:text-8xl">
                NAVEEN <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 bg-clip-text text-transparent">VARMA</span>
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-300">
                <span>Founder</span><span className="text-red-500">•</span>
                <span>Show Creator</span><span className="text-red-500">•</span>
                <span>Host</span>
              </div>

              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                “Gorakhpur’s Got Latent ko shuru karne ka maksad simple tha — Purvanchal ke performers ko ek aisa platform dena jaha unka talent pure, unfiltered aur transparent tareeqe se duniya ke samne aaye. Kuch Bhi Ho Sakta Hai!”
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://www.instagram.com/nvn_unfiltered/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 text-xs font-black uppercase tracking-wider text-black shadow-[0_10px_35px_rgba(245,158,11,.18)] transition hover:scale-[1.02]"
                >
                  <InstagramIcon className="h-4 w-4" />
                  Connect with Naveen
                </a>
                <Link
                  href="/ep1"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-200 transition hover:border-amber-400/30 hover:bg-white/[0.07]"
                >
                  <Trophy className="h-4 w-4 text-amber-400" />
                  Episode 1 Results
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* IMPACT STRIP */}
        <section className="mx-auto mt-6 grid max-w-6xl grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0d] sm:grid-cols-4">
          {highlights.map((item, idx) => (
            <div key={idx} className="group relative border-b border-white/10 p-5 text-center transition hover:bg-white/[0.025] sm:border-b-0 sm:border-r last:border-r-0">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div className="mt-3 font-bebas text-2xl tracking-wide text-white sm:text-3xl">{item.value}</div>
              <div className="mt-1 text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">{item.label}</div>
            </div>
          ))}
        </section>

        {/* VISION HEADER */}
        <section className="mx-auto mt-20 max-w-6xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-red-400">THE BLUEPRINT</p>
              <h2 className="mt-2 font-bebas text-5xl leading-none text-white sm:text-7xl">
                SHOW <span className="bg-gradient-to-r from-amber-200 to-orange-500 bg-clip-text text-transparent">VISION</span>
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">
              How Naveen Varma conceptualized Gorakhpur’s Got Latent to blend live stage roasts, authentic regional talent, and cutting-edge tech.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {pillars.map((pillar, idx) => (
              <article key={idx} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0f] p-6 sm:p-8 transition duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:shadow-[0_20px_70px_rgba(239,68,68,.08)]">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-500/5 blur-3xl transition group-hover:bg-red-500/10" />
                <div className="relative flex items-start justify-between gap-4">
                  <span className="rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-amber-300">
                    {pillar.tag}
                  </span>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-amber-400">
                    <pillar.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="relative mt-7 font-bebas text-3xl uppercase leading-tight tracking-wide text-white sm:text-4xl">{pillar.title}</h3>
                <p className="relative mt-4 text-sm leading-7 text-slate-400">{pillar.description}</p>
                <div className="mt-7 h-px bg-gradient-to-r from-red-500/50 via-amber-400/20 to-transparent" />
                <div className="mt-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500/70" />
                  Founder Vision
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className="relative mx-auto mt-20 max-w-6xl overflow-hidden rounded-[2rem] border border-red-500/20 bg-gradient-to-br from-[#130b0b] via-[#0b0b0e] to-[#11100b] p-8 text-center sm:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,.12),transparent_45%)]" />
          <div className="relative">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-red-400">KEEP WATCHING</p>
            <h2 className="mt-3 font-bebas text-4xl text-white sm:text-6xl">
              THE STORY IS <span className="bg-gradient-to-r from-amber-200 to-orange-500 bg-clip-text text-transparent">JUST BEGINNING.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Stay updated with behind-the-scenes tapings, audition drops, Episode 2 announcements, and live roasts directly from Founder Naveen Varma.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://www.instagram.com/nvn_unfiltered/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 px-6 py-4 text-xs font-black uppercase tracking-wider text-white shadow-2xl transition hover:scale-[1.02]"
              >
                <InstagramIcon className="h-5 w-5" />
                @nvn_unfiltered
              </a>
              <Link
                href="/apply/performer"
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-6 py-4 text-xs font-black uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/15"
              >
                <Mic2 className="h-4 w-4" />
                Apply for Episode 2 Auditions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );}
