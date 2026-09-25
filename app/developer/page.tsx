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
  Users,
  Activity,
  FileCode,
  Sliders,
  Bell,
  Send,
  Eye,
  CheckSquare,
  HelpCircle,
  Heart,
  Maximize2
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Alok Singh | Sole Developer & Tech Architect - Gorakhpur's Got Latent",
  description: "Comprehensive engineering breakdown, full-stack architecture, and profile of Alok Singh - Creator of Gorakhpur's Got Latent digital ecosystem.",
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
  const socialLinks = [
    {
      name: "Instagram",
      handle: "@aloksingh_._",
      url: "https://www.instagram.com/aloksingh_._/",
      icon: InstagramIcon,
      bgGradient: "from-pink-900/50 via-purple-900/40 to-slate-900",
      borderColor: "border-pink-500/50 hover:border-pink-400",
      accentBg: "from-amber-500 via-pink-500 to-purple-600",
      textColor: "group-hover:text-pink-300"
    },
    {
      name: "X (Twitter)",
      handle: "@rajpratapsinghh",
      url: "https://x.com/rajpratapsinghh",
      icon: XIcon,
      bgGradient: "from-slate-900 via-slate-900 to-slate-950",
      borderColor: "border-slate-700 hover:border-amber-400",
      accentBg: "from-slate-700 to-slate-800",
      textColor: "group-hover:text-amber-300"
    },
    {
      name: "Facebook",
      handle: "@meadorush",
      url: "https://www.facebook.com/meadorush",
      icon: FacebookIcon,
      bgGradient: "from-blue-950/50 via-slate-900 to-slate-900",
      borderColor: "border-blue-600/40 hover:border-blue-400",
      accentBg: "from-blue-600 to-blue-700",
      textColor: "group-hover:text-blue-300"
    }
  ];

  const statistics = [
    { label: "Lines of Code Written", value: "25,000+", icon: FileCode, color: "text-amber-400" },
    { label: "Custom API Routes", value: "50+", icon: Server, color: "text-red-400" },
    { label: "Live Stage Latency", value: "<100ms", icon: Zap, color: "text-yellow-400" },
    { label: "Security & Uptime", value: "99.99%", icon: ShieldCheck, color: "text-emerald-400" },
    { label: "Database Queries Executed", value: "100k+", icon: Database, color: "text-purple-400" },
    { label: "Integrated Core Systems", value: "12", icon: Layers, color: "text-blue-400" }
  ];

  const coreModules = [
    {
      id: "01",
      title: "🎟️ Automated Ticketing & Payment Gateway Engine",
      subtitle: "PhonePe API Integration, Webhooks, QR Codes & WhatsApp Dispatch",
      description: "Maine aisi ticketing system taiyar ki hai jo bina kisi human error ke thousands of audience members ke tickets handle karti hai. Isme PhonePe payment gateway integrated hai, jo instant payment callbacks processes karta hai. Success hone par QR code generate hota hai, PDF pass render hota hai, aur instant email aur WhatsApp ke zariye ticket recipient ko milta hai.",
      details: [
        "Real-time seat and quantity inventory management with lock mechanisms",
        "PhonePe Payment Gateway callback verification and secret signature validation",
        "Automated QR code matrix generation embedding encrypted order payload",
        "Automated Email & WhatsApp gateway delivery service for instant pass dispatch",
        "Dynamic scanner verification screen for on-venue security guards (/verify)"
      ],
      tech: ["Next.js Server Actions", "PhonePe API", "QR Matrix", "Turso DB", "Webhooks"]
    },
    {
      id: "02",
      title: "⚡ 'Computerji' Stage Scoring & Real-Time Hardware Sync",
      subtitle: "Proprietary Live Show Score Matrix & LED Screen Display Engine",
      description: "Show taping ke dauran judges live performance ko judge karte hain. Maine 'Computerji' naam ka custom live stage engine banaya hai jo judges' scores ko milliseconds ke andar main stage LED screen (/display) aur stage operator (/operator) control panel par push karta hai.",
      details: [
        "Instant score submission UI for live judges (/judge) with custom touch input",
        "Stage operator dashboard to control show state, countdowns, and sound triggers",
        "Live main stage LED screen display (/display) optimized for high-res projector screens",
        "Live audience voting portal (/vote) enabling spectator participation during tapings",
        "Zero-latency state synchronization with fallback retry strategy"
      ],
      tech: ["Realtime State Sync", "Judge Dashboard", "Operator Portal", "Stage Display", "Audience Poll API"]
    },
    {
      id: "03",
      title: "🛡️ 'Malik' Master Admin Command Center",
      subtitle: "Security Authentication, Order Management & Google Sheets Sync",
      description: "Show organizers aur show runners ke liye maine 'Malik' portal design kiya hai. Ye ek highly secured dashboard hai jo OTP-based double authentication par chalta hai. Yaha se tickets, performers, refund requests, aur live show stats control hote hain.",
      details: [
        "Secure OTP mobile/email multi-factor authentication system",
        "Real-time ticket sales revenue analytics, breakdown by tier, and order tracker",
        "Performer and guest application review pipeline (Approve/Reject/Flag)",
        "One-click automated refund triggering engine via payment gateway APIs",
        "Automated Google Sheets sync export for offline event check-in staff (/api/malik/sheets)"
      ],
      tech: ["OTP Auth Engine", "Refund Engine", "Application Pipeline", "Google Sheets Sync", "Data Analytics"]
    },
    {
      id: "04",
      title: "🎭 Multi-Category Performer & Sponsor Audition Pipeline",
      subtitle: "Talent Recruitment, Media Parsing & Sponsor Onboarding",
      description: "Purvanchal ke hazaaron performers (Musicians, Stand-up Comedians, Beatboxers, Dancers, Magicians) audition apply kar sakein, iske liye intelligent onboarding forms design kiye gaye hain.",
      details: [
        "Multi-step application forms with identity verification via OTP",
        "Support for video demo links (YouTube/Drive/Instagram) with auto-embed preview",
        "Categorized sorting by talent domain, performance duration, and experience level",
        "Sponsor tier onboarding portal (Powered By, Co-Sponsor, Associate Partner)",
        "Auto-confirmation SMS and email responses to applicants"
      ],
      tech: ["Form Parsing", "OTP Verification", "Media Engine", "Auto-responder"]
    },
    {
      id: "05",
      title: "📱 Instagram & Brand Digital Operations Lead",
      subtitle: "Official Instagram Handle Management & Press Strategy",
      description: "Website coding ke alawa main Gorakhpur's Got Latent ke official Instagram handle (@aloksingh_._ / @gkpgotlatent) ko lead karta hoon. Content strategy, release dates, teaser campaigns, contestant spotlights, aur live event audience updates ko handle karta hoon.",
      details: [
        "Official Instagram page content strategy and branding consistency",
        "Live audience interaction and Q&A management during audition releases",
        "Episode release teasers and promotional ticket link broadcasts",
        "Press release announcements and sponsor brand placement on social media"
      ],
      tech: ["Brand Strategy", "Content Direction", "Audience Growth", "Press Strategy"]
    },
    {
      id: "06",
      title: "🎨 Glassmorphism Dark UI/UX Design System",
      subtitle: "Tailwind CSS, Modern Typography & High-Performance Micro-Animations",
      description: "Puri website ko ek sleek, premium, dark-mode entertainment aesthetic diya gaya hai (#07080e background, gold/amber accents, glowing borders, smooth hover animations). Website kisi bhi screen size par flawless look deti hai.",
      details: [
        "Custom design tokens with curated HSL color palettes and glassmorphic cards",
        "Google Fonts integration (Bebas Neue, Barlow Condensed, Outfit, Inter, Anton)",
        "Optimized layout responsiveness for mobile phones, tablets, laptops, and 4K displays",
        "Subtle micro-interactions, animated badges, and dynamic interactive counters",
        "SEO optimization, semantic HTML5, fast initial load time under 1 second"
      ],
      tech: ["Tailwind CSS", "Vanilla CSS", "Google Fonts", "Lucide Icons", "Optimized Next.js"]
    }
  ];

  const dbTables = [
    { name: "events", desc: "Show episode details, venue location, dates, status" },
    { name: "ticket_categories", desc: "Ticket tiers, prices (in INR), quantity caps, sort order" },
    { name: "orders", desc: "Customer bookings, payment transaction IDs, status, QR codes" },
    { name: "performer_applications", desc: "Audition applicants, talent category, demo media links, approval state" },
    { name: "guest_applications", desc: "VIP guest pass requests and contact records" },
    { name: "sponsor_applications", desc: "Brand sponsor leads, tier preferences, company details" },
    { name: "judge_scores", desc: "Real-time scores given by live show judges per contestant" },
    { name: "admin_users", desc: "Malik admin portal access accounts and session hashes" }
  ];

  const timeline = [
    { year: "Phase 1", title: "Architecture & Concept", desc: "Designed the serverless database schema, dark glassmorphic design system, and core Next.js routing." },
    { year: "Phase 2", title: "Ticketing & PhonePe Engine", desc: "Built payment callback webhooks, automated QR code generator, and instant email/WhatsApp dispatch." },
    { year: "Phase 3", title: "'Computerji' Live Stage Matrix", desc: "Developed real-time judge scoring screen, stage LED display engine, and stage operator portal." },
    { year: "Phase 4", title: "'Malik' Admin Command Center", desc: "Engineered secured admin portal with OTP authentication, refund processing, and Google Sheets export." },
    { year: "Phase 5", title: "Instagram Lead & Show Launch", desc: "Launched official website, integrated YouTube channel banner, and took charge of official Instagram growth." }
  ];

  return (
    <div className="min-h-screen bg-[#07080e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-amber-500/20 via-red-600/10 to-transparent rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/3 -left-60 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-2/3 -right-60 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-16">
        
        {/* TOP SOCIAL CONNECT BAR - PROMINENTLY AT THE VERY TOP */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm sm:text-base uppercase tracking-wider">
              <Sparkles className="w-5 h-5 animate-pulse text-amber-400" />
              <span>Connect With Developer Alok Singh Directly:</span>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Official Handles & Profile Links
            </div>
          </div>

          {/* Social Links Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {socialLinks.map((social, sIdx) => {
              const Icon = social.icon;
              return (
                <a
                  key={sIdx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r ${social.bgGradient} border ${social.borderColor} hover:scale-[1.03] transition-all duration-300 group shadow-lg`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3 rounded-xl bg-gradient-to-tr ${social.accentBg} text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{social.name}</div>
                      <div className={`text-sm font-extrabold text-white ${social.textColor}`}>{social.handle}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                </a>
              );
            })}
          </div>
        </div>

        {/* HERO HEADER SECTION */}
        <div className="text-center space-y-6 pt-2">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold tracking-widest uppercase shadow-xl backdrop-blur-md">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Sole Creator & Tech Architect</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight font-heading text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 uppercase">
            Alok Singh
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            The Engineer, Designer & Operations Director who single-handedly built the entire digital ecosystem for <span className="text-amber-400 font-semibold border-b border-amber-500/40">Gorakhpur&apos;s Got Latent</span> from scratch.
          </p>
        </div>

        {/* DEVELOPER AVATAR & DETAILED BIOGRAPHY CARD */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl backdrop-blur-2xl relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300 space-y-8">
          
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
            
            {/* PHOTO FRAME */}
            <div className="relative shrink-0">
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-2xl shadow-amber-500/30 group-hover:border-amber-400 transition-all duration-500">
                <Image
                  src="/alok-singh.jpg"
                  alt="Alok Singh - Creator of Gorakhpur's Got Latent"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
              
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs px-5 py-2 rounded-full shadow-xl flex items-center gap-1.5 whitespace-nowrap">
                <CheckCircle2 className="w-4 h-4" />
                VERIFIED ARCHITECT
              </div>
            </div>

            {/* BIO DETAILS */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide font-heading">
                  Developer Biography & Story
                </h2>
                <p className="text-amber-400 text-sm sm:text-base font-semibold flex items-center justify-center lg:justify-start gap-2 mt-1">
                  <Terminal className="w-4 h-4" /> Lead Full-Stack Systems Engineer & Instagram Digital Lead
                </p>
              </div>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed bg-slate-950/70 p-6 rounded-2xl border border-slate-800/90 shadow-inner">
                <p>
                  Mera naam <strong className="text-amber-300 font-semibold">Alok Singh</strong> hai. Main Gola Road, Kauriram, Gorakhpur, Uttar Pradesh ka rehne wala hoon (Date of Birth: <strong className="text-slate-200">13/04/2008</strong>).
                </p>
                <p>
                  Maine <strong className="text-white">Gorakhpur&apos;s Got Latent</strong> (Purvanchal ke sabse bade live talent hunt show) ki poori website, payment engines, serverless API architecture, admin control portals, live stage score displays, aur ticketing delivery system ko akhele (sole developer) code aur build kiya hai.
                </p>
                <p>
                  Website engineering ke alawa, main show ke official Instagram handle (<strong className="text-pink-400">@aloksingh_._</strong>) aur core digital marketing operations ko sambhalta hoon.
                </p>
              </div>

              {/* PERSONAL METRICS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-800/40 border border-slate-800/80">
                  <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Date of Birth</div>
                    <div className="text-sm font-bold text-slate-100">13 April 2008 (13/04/2008)</div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-800/40 border border-slate-800/80">
                  <div className="p-3 rounded-lg bg-red-500/10 text-red-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Hometown Address</div>
                    <div className="text-sm font-bold text-slate-100">Gola Road, Kauriram, Gorakhpur, UP</div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* STATISTICS NUMBERS GRID */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-2xl font-extrabold text-white font-heading uppercase tracking-wider">
              Engineering Benchmarks & Code Statistics
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">Concrete metrics powering the Gorakhpur&apos;s Got Latent platform.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
            {statistics.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center space-y-2 backdrop-blur-xl hover:border-amber-500/40 transition-all group">
                  <div className="inline-flex p-2.5 rounded-xl bg-slate-800/60 group-hover:scale-110 transition-transform">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
                    {item.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* EXTENSIVE CORE MODULES DEEP-DIVE (VERY DETAILED LONG SECTION) */}
        <div className="space-y-10">
          
          <div className="text-center space-y-3">
            <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
              Comprehensive Architectural Breakdown
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-heading text-white uppercase">
              Modules Engineered By Alok Singh
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Read the in-depth technical specifications of every single system built from scratch for this platform.
            </p>
          </div>

          <div className="space-y-8">
            {coreModules.map((module) => (
              <div 
                key={module.id}
                className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-10 space-y-6 backdrop-blur-xl hover:border-amber-500/40 transition-all duration-300 shadow-2xl relative overflow-hidden group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                  <div className="space-y-1">
                    <div className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">
                      Module {module.id} &bull; {module.subtitle}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      {module.title}
                    </h3>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase shrink-0 self-start sm:self-auto">
                    PRODUCTION LIVE
                  </span>
                </div>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {module.description}
                </p>

                <div className="space-y-3 bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-amber-400" /> Key Features & Protocols Implemented:
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {module.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-slate-400 font-semibold mr-2">Tech Stack Used:</span>
                  {module.tech.map((t, tid) => (
                    <span key={tid} className="px-3 py-1 rounded-lg bg-slate-800/80 text-amber-300 text-xs font-mono border border-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* DATABASE SCHEMA & TABLES STRUCTURE SECTION */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400">
              <Database className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-heading uppercase">
                Database Schema & Turso SQL Architecture
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Relational tables created and maintained by Alok Singh for real-time transactions and show management.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dbTables.map((table, tIdx) => (
              <div key={tIdx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">table</span>
                  <Code2 className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="text-base font-mono font-bold text-white">
                  {table.name}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {table.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* DEVELOPMENT TIMELINE & MILESTONES */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-extrabold text-white font-heading uppercase">
              Development Timeline & Roadmap
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">Step-by-step engineering journey of building this platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {timeline.map((step, stIdx) => (
              <div key={stIdx} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-amber-500/40 transition-all backdrop-blur-xl relative">
                <div className="text-xs font-bold font-mono text-amber-400 uppercase">{step.year}</div>
                <div className="text-base font-bold text-white">{step.title}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DEVELOPER STATEMENT / MESSAGE */}
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-red-950/30 border border-amber-500/40 rounded-3xl p-6 sm:p-10 space-y-4 text-center sm:text-left relative overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="p-4 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
              <Heart className="w-8 h-8 fill-amber-500 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading uppercase">
                Developer Note from Alok Singh
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                &ldquo;Gorakhpur&apos;s Got Latent sirf ek show nahi hai, ye Purvanchal ke talent ka sabse bada stage hai. Is website ko maine har din raat mehnat karke banaya hai taaki humare regional talent ko world-class digital experience mile. Any technical queries ya collaboration ke liye aap mere social accounts par connect kar sakte hain!&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM SOCIAL LINKS REPEAT */}
        <div className="space-y-4 pt-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> Direct Social Handles
            </h3>
            <p className="text-xs text-slate-400">Click below to reach out directly to Alok Singh</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {socialLinks.map((social, sIdx) => {
              const Icon = social.icon;
              return (
                <a
                  key={sIdx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r ${social.bgGradient} border ${social.borderColor} hover:scale-[1.02] transition-all duration-300 group shadow-lg`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-tr ${social.accentBg} text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{social.name}</div>
                      <div className={`text-sm font-extrabold text-white ${social.textColor}`}>{social.handle}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                </a>
              );
            })}
          </div>
        </div>

        {/* UNLINKED SECRET ROUTE NOTICE FOOTER */}
        <div className="text-center pt-8 border-t border-slate-900 text-xs text-slate-500 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-slate-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Private Unlinked Developer Route &bull; URL: <strong className="text-amber-400">/developer</strong></span>
          </div>
          <p className="text-[11px] text-slate-600">Hidden from site navigation header and footer. Accessible only via direct URL.</p>
        </div>

      </div>
    </div>
  );
}
