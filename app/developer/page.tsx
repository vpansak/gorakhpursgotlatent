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
  Layers,
  Database,
  Lock,
  Workflow,
  Share2,
  Smartphone,
  Check,
  TrendingUp,
  Server,
  Star,
  Users,
  Activity,
  FileCode,
  Sliders,
  Send,
  Heart
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Alok Singh | Tech Architect & Lead Full-Stack Engineer",
  description: "Official profile, biography, technical expertise, and engineering portfolio of Alok Singh — Lead Full-Stack Engineer & Tech Architect from Gorakhpur, Uttar Pradesh.",
  authors: [{ name: "Alok Singh", url: "https://gkpgotlatent.in/developer" }],
  creator: "Alok Singh",
  publisher: "Alok Singh Portfolio",
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
    title: "Alok Singh | Tech Architect & Lead Full-Stack Engineer",
    description: "Personal engineering profile, technical stack, and career highlights of Alok Singh.",
    url: 'https://gkpgotlatent.in/developer',
    siteName: "Alok Singh Portfolio",
    images: [
      {
        url: '/alok-singh.jpg',
        width: 800,
        height: 800,
        alt: 'Alok Singh - Tech Architect & Lead Engineer',
      },
    ],
    locale: 'en_IN',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Alok Singh | Tech Architect & Lead Full-Stack Engineer",
    description: "Full-Stack System Architecture, Real-Time Low Latency Engines, and Web Engineering.",
    images: ['/alok-singh.jpg'],
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

  const coreSkills = [
    { name: "Next.js 14 / React", level: "Expert", desc: "App Router, Server Actions, SSR, Dynamic Routing" },
    { name: "TypeScript & JavaScript", level: "Advanced", desc: "Type Safety, Async Pipelines, Modern ESNext" },
    { name: "Tailwind CSS & Glassmorphism", level: "Expert", desc: "Custom UI/UX Systems, Micro-Animations, HSL Palettes" },
    { name: "Real-Time System Architecture", level: "Expert", desc: "Sub-100ms Latency, Hardware Sync, WebSockets" },
    { name: "Node.js & Edge Serverless APIs", level: "Advanced", desc: "High-Throughput Endpoints, Webhooks, Reconciliations" },
    { name: "Database Engineering & SQL", level: "Advanced", desc: "Turso DB, libSQL, Schema Optimization, Indexing" },
    { name: "Payment & Security Infrastructure", level: "Expert", desc: "Payment Gateway APIs, Signature Verification, Encrypted QR Codes" },
    { name: "Digital Operations & Strategy", level: "Lead", desc: "Social Media Growth, Instagram Strategy (@aloksingh_._)" }
  ];

  const engineeringHighlights = [
    {
      id: "01",
      title: "⚡ Real-Time Hardware & Live Latency Matrix Architecture",
      subtitle: "Sub-100ms Real-Time Synchronized State Engine",
      description: "Live stage events aur live hardware interaction ke liye main real-time low-latency synchronization engines design karta hoon. Minimum network payload aur instant DOM updates ke zariye real-time scoring aur visual projector display synchronizations accomplish hoti hain.",
      details: [
        "Sub-100ms real-time state synchronization across multiple client displays",
        "Optimized touch-friendly control interfaces for stage operators and judges",
        "Hardware-accelerated rendering optimized for high-resolution auditorium screens",
        "Zero-latency state persistence with fallback retry strategies"
      ],
      tech: ["WebSockets", "Optimistic Mutation", "Next.js", "State Sync"]
    },
    {
      id: "02",
      title: "🎟️ Automated Payment, QR Matrix & Dispatch Infrastructure",
      subtitle: "Scalable Event Ticketing & Instant Verification Pipeline",
      description: "High-volume user bookings ke liye fully automated transactional system design karta hoon, jo instant payment gateway callbacks process karta hai, encrypted QR passes generate karta hai, aur email & WhatsApp gateway se passes dispatch karta hai.",
      details: [
        "Payment gateway callback verification and signature validation",
        "Automated QR code matrix generation embedding encrypted order data",
        "Automated WhatsApp & Email gateway dispatch pipelines",
        "Instant webcam/mobile QR scanner verification UI for event venue security staff"
      ],
      tech: ["Payment APIs", "QR Matrix", "Webhooks", "Automated Dispatch"]
    },
    {
      id: "03",
      title: "🎨 Glassmorphic Dark Mode UI/UX System Design",
      subtitle: "High-Performance Modern Web Aesthetic",
      description: "Modern web applications ke liye custom dark-mode design systems (#07080e background, gold/amber accents, glowing ambient borders, micro-interactions) create karta hoon jo har device (Mobile, Laptop, 4K Displays) par fast aur responsive perform karte hain.",
      details: [
        "Custom design tokens with curated HSL color palettes and glassmorphic cards",
        "Google Fonts typography integration (Bebas Neue, Barlow, Outfit, Inter)",
        "Fully responsive layout architecture for all device viewports",
        "Subtle micro-animations, badges, and fast initial load optimization"
      ],
      tech: ["Tailwind CSS", "Vanilla CSS", "Google Fonts", "Lucide Icons"]
    },
    {
      id: "04",
      title: "📱 Digital Strategy & Social Media Management",
      subtitle: "Brand Execution & Content Direction",
      description: "Core full-stack development ke saath, main digital operations, branding strategy, and social media outreach (@aloksingh_._) ko direction aur execution deta hoon.",
      details: [
        "Brand identity alignment and official social media page strategy",
        "Content direction, release trailers, and audience interaction campaigns",
        "Promotional link distribution architecture and digital growth"
      ],
      tech: ["Brand Strategy", "Content Direction", "Audience Growth"]
    }
  ];

  const developerJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': 'https://gkpgotlatent.in/developer#webpage',
        'url': 'https://gkpgotlatent.in/developer',
        'name': "Alok Singh - Tech Architect & Lead Full-Stack Engineer",
        'description': "Official portfolio and engineering profile of Alok Singh — Lead Full-Stack Engineer & Tech Architect from Gorakhpur, Uttar Pradesh.",
        'mainEntity': {
          '@type': 'Person',
          '@id': 'https://gkpgotlatent.in/developer#aloksingh',
          'name': 'Alok Singh',
          'jobTitle': 'Tech Architect & Lead Full-Stack Engineer',
          'roleName': 'Full-Stack Software Engineer',
          'description': "Lead Full-Stack Engineer & Tech Architect specializing in Next.js 14, real-time low-latency systems, payment infrastructure, and digital operations.",
          'url': 'https://gkpgotlatent.in/developer',
          'image': 'https://gkpgotlatent.in/alok-singh.jpg',
          'sameAs': [
            'https://www.instagram.com/aloksingh_._/',
            'https://x.com/rajpratapsinghh',
            'https://www.facebook.com/meadorush'
          ]
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#07080e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(developerJsonLd) }}
      />
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-amber-500/20 via-red-600/10 to-transparent rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/3 -left-60 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-2/3 -right-60 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-14">
        
        {/* TOP SOCIAL CONNECT BAR */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm sm:text-base uppercase tracking-wider">
              <Sparkles className="w-5 h-5 animate-pulse text-amber-400" />
              <span>Connect With Alok Singh Directly:</span>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Official Social Handles & Connect Links
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

        {/* HERO PROFILE HEADER */}
        <div className="text-center space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold tracking-widest uppercase shadow-xl backdrop-blur-md">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Tech Architect & Lead Full-Stack Engineer</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight font-heading text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 uppercase">
            ALOK SINGH
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Full-Stack Software Engineer, System Architect & Digital Operations Specialist based in Gorakhpur, Uttar Pradesh.
          </p>
        </div>

        {/* DEVELOPER AVATAR & BIOGRAPHY CARD */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300 space-y-8">
          
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
            
            {/* PHOTO FRAME */}
            <div className="relative shrink-0">
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-2xl shadow-amber-500/30 group-hover:border-amber-400 transition-all duration-500">
                <Image
                  src="/alok-singh.jpg"
                  alt="Alok Singh - Tech Architect & Lead Engineer"
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
                  About Alok Singh
                </h2>
                <p className="text-amber-400 text-sm sm:text-base font-semibold flex items-center justify-center lg:justify-start gap-2 mt-1">
                  <Terminal className="w-4 h-4" /> Lead Full-Stack Software Engineer & Digital Architect
                </p>
              </div>

              <div className="space-y-3.5 text-slate-300 text-sm sm:text-base leading-relaxed bg-slate-950/70 p-6 rounded-2xl border border-slate-800/90 shadow-inner">
                <p>
                  Mera naam <strong className="text-amber-300 font-semibold">Alok Singh</strong> hai. Main Gola Road, Kauriram, Gorakhpur, Uttar Pradesh ka rehne wala hoon (Date of Birth: <strong className="text-slate-200">13/04/2008</strong>).
                </p>
                <p>
                  Main full-stack web engineering, real-time system architecture, cloud deployment, aur custom UI/UX design systems me specialize karta hoon. Fast, scalable aur secure web software build karna mera core passion hai.
                </p>
                <p>
                  Software engineering ke alawa, main official Instagram handles (<strong className="text-pink-400">@aloksingh_._</strong>) aur digital marketing strategy & operations ko lead karta hoon.
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

        {/* CORE TECHNICAL SKILLS GRID */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading uppercase tracking-wide">
              Technical Stack & Skills
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Technologies, frameworks, and architecture paradigms mastered by Alok Singh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreSkills.map((skill, skIdx) => (
              <div 
                key={skIdx}
                className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 space-y-2 hover:border-amber-500/40 transition-all backdrop-blur-xl group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">{skill.level}</span>
                  <Code2 className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {skill.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {skill.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ENGINEERING HIGHLIGHTS & ARCHITECTURE CAPABILITIES */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading uppercase tracking-wide">
              Engineering Capabilities & Highlights
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Key architectural solutions designed and built by Alok Singh.
            </p>
          </div>

          <div className="space-y-6">
            {engineeringHighlights.map((module) => (
              <div 
                key={module.id}
                className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-5 backdrop-blur-xl hover:border-amber-500/40 transition-all duration-300 shadow-2xl relative overflow-hidden group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">
                      Capability {module.id} &bull; {module.subtitle}
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      {module.title}
                    </h3>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {module.description}
                </p>

                <div className="space-y-2 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {module.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-slate-400 font-semibold mr-2">Skills / Stack:</span>
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

        {/* PERSONAL STATEMENT FROM ALOK SINGH */}
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-red-950/30 border border-amber-500/40 rounded-3xl p-6 sm:p-10 space-y-4 text-center sm:text-left relative overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="p-4 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
              <Heart className="w-8 h-8 fill-amber-500 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading uppercase">
                Message from Alok Singh
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                &ldquo;Building scalable, clean, and high-performance software is what drives me every day. Whether it&apos;s real-time low-latency synchronization or modern UI/UX design, I focus on delivering world-class execution. Feel free to connect with me on Instagram or X!&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM SOCIAL HANDLES */}
        <div className="space-y-4 pt-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> Connect Directly With Alok Singh
            </h3>
            <p className="text-xs text-slate-400">Click below to reach out on social platforms</p>
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

      </div>
    </div>
  );
}
