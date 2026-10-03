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
    <div className="min-h-screen bg-[#07080e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(founderJsonLd) }}
      />

      {/* Ambient Radial Lighting Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-amber-500/20 via-orange-600/10 to-transparent rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-16">

        {/* 1. HERO FOUNDER CARD */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-amber-500/30 bg-slate-900/80 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Founder Avatar Image */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-2 border-amber-400/60 shadow-[0_0_40px_rgba(255,215,0,0.35)] group transition-all hover:scale-105">
                <Image
                  src="/naveen-varma.jpg"
                  alt="Naveen Varma - Founder & Show Creator"
                  fill
                  className="object-cover object-top filter contrast-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 text-center">
                  <span className="px-3 py-1 rounded-full bg-amber-500/90 text-black text-[10px] font-black uppercase tracking-widest inline-block shadow-md">
                    FOUNDER & SHOW CREATOR
                  </span>
                </div>
              </div>

              {/* Instagram Handle Direct Badge */}
              <a
                href="https://www.instagram.com/nvn_unfiltered/"
                target="_blank"
                rel="noreferrer"
                className="mt-5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition-all border border-pink-400/40"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>@nvn_unfiltered on Instagram ↗</span>
              </a>
            </div>

            {/* Founder Info & Bio */}
            <div className="md:col-span-7 space-y-5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" /> CREATOR SPOTLIGHT
              </div>

              <h1 className="font-bebas text-4xl sm:text-6xl text-white uppercase tracking-tight leading-none">
                NAVEEN <span className="gold-gradient-text">VARMA</span>
              </h1>

              <div className="text-sm sm:text-base font-bold text-amber-300 font-barlow tracking-wide uppercase">
                Founder, Show Creator & Host | Gorakhpur’s Got Latent
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                "Gorakhpur’s Got Latent ko shuru karne ka maksad simple tha — Purvanchal ke performers ko ek aisa platform dena jaha unka talent pure, unfiltered aur transparent tareeqe se duniya ke samne aaye. Kuch Bhi Ho Sakta Hai!"
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <a
                  href="https://www.instagram.com/nvn_unfiltered/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Connect with Naveen ↗</span>
                </a>

                <Link
                  href="/ep1"
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-amber-500/30 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>View Episode 1 Results</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2. FOUNDER HIGHLIGHTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((item, idx) => (
            <div 
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-amber-500/40 bg-slate-900/60 transition-all text-center space-y-3 group"
            >
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="font-bebas text-2xl sm:text-3xl text-white tracking-wide">
                {item.value}
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* 3. VISION & PHILOSOPHY PILLARS */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-bebas text-3xl sm:text-5xl text-white uppercase tracking-tight">
              THE <span className="gold-gradient-text">SHOW VISION & PILLARS</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              How Naveen Varma conceptualized Gorakhpur’s Got Latent to blend live stage roasts, authentic regional talent, and cutting-edge tech.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => (
              <div 
                key={idx}
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 bg-slate-900/70 hover:border-amber-500/50 transition-all space-y-4 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-amber-400 tracking-widest uppercase px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                    {pillar.tag}
                  </span>
                  <pillar.icon className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform" />
                </div>

                <h3 className="font-bebas text-2xl text-white uppercase tracking-wide">
                  {pillar.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>



        {/* 5. CALL TO ACTION & SOCIAL CONNECT */}
        <div className="text-center bg-slate-900/90 border border-amber-500/30 rounded-3xl p-8 sm:p-12 space-y-6 relative overflow-hidden">
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="font-bebas text-3xl sm:text-5xl text-white uppercase">
              FOLLOW <span className="gold-gradient-text">NAVEEN VARMA</span> ON INSTAGRAM
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Stay updated with behind-the-scenes tapings, audition drops, Episode 2 announcements, and live roasts directly from Founder Naveen Varma.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://www.instagram.com/nvn_unfiltered/"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-3 shadow-2xl hover:scale-105 transition-all cursor-pointer"
            >
              <InstagramIcon className="w-5 h-5" />
              <span>@nvn_unfiltered (Official Instagram) ↗</span>
            </a>

            <Link
              href="/apply/performer"
              className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
            >
              <Mic2 className="w-4 h-4" />
              <span>Apply for Episode 2 Auditions</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
