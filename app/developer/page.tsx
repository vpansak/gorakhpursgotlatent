import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Code2, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Globe, 
  ExternalLink,
  Award,
  Zap,
  CheckCircle2,
  Ticket,
  Tv,
  Layers,
  Database,
  QrCode,
  Lock,
  Workflow,
  Share2,
  Smartphone,
  Radio,
  Flame,
  Check,
  TrendingUp,
  Server,
  Star,
  Users
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Alok Singh | Sole Developer & Tech Architect - Gorakhpur's Got Latent",
  description: "Comprehensive engineering breakdown and profile of Alok Singh - Creator of Gorakhpur's Got Latent digital ecosystem.",
  robots: {
    index: false,
    follow: false,
  },
};

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function XIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function FacebookIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export default function DeveloperPage() {
  const achievements = [
    { label: "Custom Endpoints", value: "50+", icon: Server, color: "text-amber-400" },
    { label: "Core Systems Built", value: "10+", icon: Layers, color: "text-red-400" },
    { label: "Live Stage Latency", value: "<100ms", icon: Zap, color: "text-yellow-400" },
    { label: "Security & Uptime", value: "99.9%", icon: ShieldCheck, color: "text-emerald-400" },
  ];

  const systemsBuilt = [
    {
      title: "🎟️ Automated Ticketing & Payment Gateway Engine",
      badge: "CORE PAYMENT ARCHITECTURE",
      description: "Designed and engineered an end-to-end ticketing platform. Integrated PhonePe payment gateway with real-time webhooks, auto-expiry locks, automatic QR code generation, instant email receipts, and WhatsApp ticket delivery.",
      tech: ["Next.js API", "PhonePe Gateway API", "QR Matrix Engine", "Turso/MySQL DB", "Webhooks"]
    },
    {
      title: "⚡ 'Computerji' Live Stage & Judge Scoring System",
      badge: "REAL-TIME STAGE HARDWARE SYNC",
      description: "Created the proprietary 'Computerji' engine used live during show tapings. Allows real-time score input by live judges, instant state synchronization on stage LED screens, stage operator control dashboard, and live audience voting.",
      tech: ["Realtime State Sync", "Judge Dashboard", "Stage Operator Portal", "LED Screen Display", "Audience Poll API"]
    },
    {
      title: "🛡️ 'Malik' Master Admin Command Center",
      badge: "SECURITY & DATA OPERATIONS",
      description: "Built a locked administrative portal with OTP authentication for the show management team. Includes ticket sales analytics, application review pipelines, automated refund processing, and one-click Google Sheets export sync.",
      tech: ["OTP Auth System", "Refund Engine", "Application Pipeline", "Google Sheets Sync", "Data Analytics"]
    },
    {
      title: "🎭 Performer, Guest & Sponsor Onboarding Portals",
      badge: "TALENT RECRUITMENT PIPELINE",
      description: "Developed multi-tiered application portals for auditioning performers, guest VIP requests, and brand sponsorship packages. Features OTP identity verification, demo video submission parsing, and auto-sorting.",
      tech: ["Form Parsing", "OTP Verification", "Media Storage Engine", "Automated Auto-responder"]
    },
    {
      title: "📱 Instagram Handle & Brand Growth Strategy",
      badge: "COMMUNITY & DIGITAL LEAD",
      description: "Directly leads the official Gorakhpur's Got Latent Instagram page and brand communications. Manages contestant announcements, promotional teasers, audience engagement campaigns, and digital press releases.",
      tech: ["Brand Strategy", "Content Direction", "Audience Growth", "Press Strategy"]
    },
    {
      title: "🎨 Sleek Glassmorphic UI/UX Design System",
      badge: "FRONTEND DESIGN SYSTEM",
      description: "Crafted a high-contrast dark aesthetic tailored specifically for Purvanchal's premier entertainment brand. Includes custom typography, micro-interactions, responsive mobile optimizations, and zero-lag hydration.",
      tech: ["Tailwind CSS", "Vanilla CSS Tokens", "Google Fonts", "Lucide Icons", "Optimized Next.js"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#07080e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-b from-amber-500/15 via-red-600/10 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-16">
        
        {/* TOP HERO HEADER */}
        <div className="text-center space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold tracking-widest uppercase shadow-xl backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Sole Creator & Tech Lead</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight font-heading text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 uppercase">
            Alok Singh
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            The Engineer & Architect who designed, built, and operates the complete digital ecosystem for <span className="text-amber-400 font-semibold border-b border-amber-500/40">Gorakhpur&apos;s Got Latent</span> from scratch.
          </p>
        </div>

        {/* PROFILE CARD & BIOGRAPHY */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl backdrop-blur-2xl relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
          
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
            
            {/* AVATAR WITH GLOW RING */}
            <div className="relative shrink-0">
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-2xl shadow-amber-500/30 group-hover:border-amber-400 transition-all duration-300">
                <Image
                  src="/alok-singh.jpg"
                  alt="Alok Singh - Creator of Gorakhpur's Got Latent"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
              
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs px-4 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 whitespace-nowrap">
                <Award className="w-4 h-4" />
                SOLE DEVELOPER & CORE LEAD
              </div>
            </div>

            {/* BIO DETAILS */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide font-heading">
                  About Alok Singh
                </h2>
                <p className="text-amber-400 text-sm sm:text-base font-semibold flex items-center justify-center lg:justify-start gap-2 mt-1">
                  <Terminal className="w-4 h-4" /> Full-Stack Systems Engineer & Digital Operations Director
                </p>
              </div>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed bg-slate-950/70 p-5 sm:p-6 rounded-2xl border border-slate-800/90 shadow-inner">
                <p>
                  Mera naam <strong className="text-amber-300 font-semibold">Alok Singh</strong> hai. Maine <strong className="text-white">Gorakhpur&apos;s Got Latent</strong> ki poori website, payment engines, admin portals, live scoring systems, aur digital infrastructure ko akhele (sole developer) zero se design aur develop kiya hai.
                </p>
                <p>
                  Sath hi main show ka official Instagram page, audience communication, core tech operations, aur live stage software execution handle karta hoon.
                </p>
              </div>

              {/* PERSONAL INFO GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-800/80">
                  <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Date of Birth</div>
                    <div className="text-sm font-semibold text-slate-100">13 April 2008 (13/04/2008)</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-800/80">
                  <div className="p-3 rounded-lg bg-red-500/10 text-red-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Hometown</div>
                    <div className="text-sm font-semibold text-slate-100">Gola Road, Kauriram, Gorakhpur, UP</div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ACHIEVEMENTS STATS COUNTER GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center space-y-2 backdrop-blur-xl hover:border-amber-500/40 transition-all group">
                <div className="inline-flex p-3 rounded-xl bg-slate-800/60 group-hover:scale-110 transition-transform">
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
                  {item.value}
                </div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* COMPREHENSIVE ENGINEERING WORK BREAKDOWN */}
        <div className="space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-heading text-white uppercase">
              What I Built For Gorakhpur&apos;s Got Latent
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Every system on this website was custom-coded to deliver an ultra-fast, secure, and world-class live show experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systemsBuilt.map((system, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-amber-500/40 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="inline-block px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    {system.badge}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {system.title}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {system.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {system.tech.map((t, tid) => (
                    <span key={tid} className="px-2.5 py-1 rounded-md bg-slate-950 text-slate-400 text-[11px] font-mono border border-slate-800">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* TECHNICAL STACK & ARCHITECTURE MATRIX */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Full-Stack Tech Stack</h3>
              <p className="text-slate-400 text-xs sm:text-sm">Technologies engineered to run Purvanchal&apos;s premier talent hunt website.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <div className="text-amber-400 text-xs font-bold uppercase">Framework</div>
              <div className="text-sm font-semibold text-white">Next.js 16 (Turbopack)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <div className="text-amber-400 text-xs font-bold uppercase">Language</div>
              <div className="text-sm font-semibold text-white">TypeScript (Strict)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <div className="text-amber-400 text-xs font-bold uppercase">Styling</div>
              <div className="text-sm font-semibold text-white">Tailwind CSS & Vanilla Tokens</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <div className="text-amber-400 text-xs font-bold uppercase">Database</div>
              <div className="text-sm font-semibold text-white">Turso Serverless SQL DB</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <div className="text-amber-400 text-xs font-bold uppercase">Payments</div>
              <div className="text-sm font-semibold text-white">PhonePe API & Webhooks</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <div className="text-amber-400 text-xs font-bold uppercase">Auth & Security</div>
              <div className="text-sm font-semibold text-white">OTP Verification Engine</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <div className="text-amber-400 text-xs font-bold uppercase">Integrations</div>
              <div className="text-sm font-semibold text-white">Google Sheets & WhatsApp</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
              <div className="text-amber-400 text-xs font-bold uppercase">Live Hardware</div>
              <div className="text-sm font-semibold text-white">Computerji Stage Engine</div>
            </div>
          </div>
        </div>

        {/* SOCIAL CONNECT LINKS */}
        <div className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
              <Zap className="w-6 h-6 text-amber-400" /> Official Developer Handles
            </h3>
            <p className="text-slate-400 text-sm">Directly connect with Alok Singh on social platforms.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Instagram */}
            <a
              href="https://www.instagram.com/aloksingh_._/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-slate-900 border border-pink-500/30 hover:border-pink-500/80 hover:scale-[1.02] transition-all duration-300 group shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white shadow-lg">
                  <InstagramIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Instagram</div>
                  <div className="text-base font-extrabold text-white group-hover:text-pink-300">@aloksingh_._</div>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-pink-400 transition-colors" />
            </a>

            {/* X / Twitter */}
            <a
              href="https://x.com/rajpratapsinghh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/90 border border-slate-700 hover:border-amber-400 hover:scale-[1.02] transition-all duration-300 group shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-800 text-white shadow-lg border border-slate-700">
                  <XIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">X (Twitter)</div>
                  <div className="text-base font-extrabold text-white group-hover:text-amber-300">@rajpratapsinghh</div>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/meadorush"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-600/30 hover:border-blue-500/80 hover:scale-[1.02] transition-all duration-300 group shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-blue-600 text-white shadow-lg">
                  <FacebookIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Facebook</div>
                  <div className="text-base font-extrabold text-white group-hover:text-blue-300">@meadorush</div>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
            </a>

          </div>
        </div>

        {/* UNLINKED PRIVATE FOOTER NOTE */}
        <div className="text-center pt-8 border-t border-slate-900 text-xs text-slate-500 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Private Hidden Profile &bull; URL: <strong className="text-amber-400">/developer</strong></span>
          </div>
          <p className="text-[11px] text-slate-600">Unlinked from main navigation. Accessible via direct link search only.</p>
        </div>

      </div>
    </div>
  );
}
