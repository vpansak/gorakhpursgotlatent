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
  Heart,
  Laptop,
  Rocket
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Alok Singh | Full-Stack Software Engineer & Tech Architect",
  description: "Official developer profile and biography of Alok Singh — Full-Stack Software Engineer & Tech Architect from Gorakhpur, Uttar Pradesh.",
  authors: [{ name: "Alok Singh", url: "https://gkpgotlatent.in/developer" }],
  creator: "Alok Singh",
  publisher: "Alok Singh",
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
    title: "Alok Singh | Full-Stack Software Engineer & Tech Architect",
    description: "Personal developer profile, skills, engineering philosophy, and biography of Alok Singh.",
    url: 'https://gkpgotlatent.in/developer',
    siteName: "Alok Singh Portfolio",
    images: [
      {
        url: '/alok-singh.jpg',
        width: 800,
        height: 800,
        alt: 'Alok Singh - Full-Stack Software Engineer',
      },
    ],
    locale: 'en_IN',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Alok Singh | Full-Stack Software Engineer",
    description: "Full-Stack Web Engineering, Real-Time Architecture, and Software Engineering.",
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
      bgGradient: "from-pink-600 via-purple-600 to-amber-500",
      borderColor: "border-pink-500/50 hover:border-pink-300",
      hoverBg: "hover:scale-105"
    },
    {
      name: "X (Twitter)",
      handle: "@rajpratapsinghh",
      url: "https://x.com/rajpratapsinghh",
      icon: XIcon,
      bgGradient: "from-slate-800 to-slate-900",
      borderColor: "border-slate-600 hover:border-amber-400",
      hoverBg: "hover:scale-105"
    },
    {
      name: "Facebook",
      handle: "@meadorush",
      url: "https://www.facebook.com/meadorush",
      icon: FacebookIcon,
      bgGradient: "from-blue-700 to-blue-900",
      borderColor: "border-blue-500/50 hover:border-blue-300",
      hoverBg: "hover:scale-105"
    }
  ];

  const coreSkills = [
    { name: "Frontend Development", level: "Expert", desc: "Next.js 14, React, App Router, SSR, TypeScript, Tailwind CSS" },
    { name: "Backend & Systems", level: "Advanced", desc: "Node.js, REST APIs, WebSockets, Serverless Edge Architecture" },
    { name: "Database Engineering", level: "Advanced", desc: "Relational SQL Schemas, SQLite, PostgreSQL, Query Optimization" },
    { name: "UI/UX & Design Systems", level: "Expert", desc: "Glassmorphism Aesthetics, Micro-Animations, Responsive Layouts" },
    { name: "API & Payment Integrations", level: "Advanced", desc: "Third-Party APIs, Cryptographic Signatures, Webhooks" },
    { name: "Digital Operations & Strategy", level: "Lead", desc: "Social Media Execution, Content Strategy, Audience Growth" }
  ];

  const engineeringPillars = [
    {
      num: "01",
      title: "💻 Clean & Scalable System Architecture",
      subtitle: "Modular, Type-Safe & Maintainable Software",
      description: "Main clean code principles, modular components, aur type-safe architectures par focus karta hoon. Code base ko simple, predictable, aur long-term maintainable rakhna mera primary goal hota hai.",
      points: [
        "Strict TypeScript interfaces and predictable state flow",
        "Serverless API design with fast response times",
        "Modular folder structures adhering to modern software patterns",
        "Comprehensive code organization and clean documentation"
      ]
    },
    {
      num: "02",
      title: "⚡ Real-Time Web & Low-Latency Performance",
      subtitle: "Sub-Second Response Times & Real-Time Sync",
      description: "Fast-loading web applications aur real-time data sync engines develop karta hoon jo minimum network overhead ke saath interactive user experiences render karte hain.",
      points: [
        "Optimized asset loading and server-side rendering (SSR)",
        "WebSocket integration for real-time live data streaming",
        "Lightweight payload structures for fast mobile execution",
        "Sub-second initial page load speeds"
      ]
    },
    {
      num: "03",
      title: "🎨 Glassmorphic UI/UX & Responsive Design",
      subtitle: "Modern Dark Mode Aesthetics & Fluid Layouts",
      description: "Custom dark-mode glassmorphic design systems (#07080e background, gold/amber glowing accents, smooth hover animations) build karta hoon jo mobile se lekar 4K screens tak stunning look dete hain.",
      points: [
        "Curated HSL color palettes and glassmorphic card designs",
        "Google Fonts typography integration (Bebas Neue, Barlow, Outfit, Inter)",
        "Fully responsive layouts across all device viewports",
        "Smooth micro-interactions and animated UI elements"
      ]
    },
    {
      num: "04",
      title: "📱 Digital Strategy & Social Media Execution",
      subtitle: "Brand Leadership & Content Direction",
      description: "Software engineering ke alawa, main digital media operations, social media growth (@aloksingh_._), aur brand strategy ko direction aur execution deta hoon.",
      points: [
        "Brand identity management and social handle strategy",
        "Audience engagement campaigns and content direction",
        "Digital link distribution and organic growth"
      ]
    }
  ];

  const developerJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': 'https://gkpgotlatent.in/developer#webpage',
        'url': 'https://gkpgotlatent.in/developer',
        'name': "Alok Singh - Full-Stack Software Engineer & Tech Architect",
        'description': "Official portfolio and personal biography of Alok Singh — Full-Stack Software Engineer & Tech Architect from Gorakhpur, Uttar Pradesh.",
        'mainEntity': {
          '@type': 'Person',
          '@id': 'https://gkpgotlatent.in/developer#aloksingh',
          'name': 'Alok Singh',
          'jobTitle': 'Full-Stack Software Engineer & Tech Architect',
          'roleName': 'Full-Stack Software Engineer',
          'description': "Full-Stack Software Engineer specializing in Next.js, React, TypeScript, Node.js, and real-time systems architecture.",
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
    <div className="min-h-screen bg-[#07080e] text-slate-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(developerJsonLd) }}
      />
      
      {/* Ambient Lighting Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-amber-500/20 via-red-600/10 to-transparent rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/3 -left-60 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-2/3 -right-60 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        
        {/* 1. TOP HERO PROFILE CARD - PROMINENTLY AT THE ABSOLUTE TOP OF THE PAGE */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden group hover:border-amber-500/50 transition-all duration-300 space-y-8">
          
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 sm:gap-10">
            
            {/* PROFILE PHOTO FRAME */}
            <div className="relative shrink-0 flex flex-col items-center">
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_35px_rgba(255,215,0,0.3)] group-hover:border-amber-400 transition-all duration-500">
                <Image
                  src="/alok-singh.jpg"
                  alt="Alok Singh - Full-Stack Software Engineer & Tech Architect"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
              
              <div className="absolute -bottom-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs px-5 py-2 rounded-full shadow-xl flex items-center gap-1.5 whitespace-nowrap">
                <CheckCircle2 className="w-4 h-4" />
                VERIFIED ARCHITECT
              </div>
            </div>

            {/* PROFILE TITLE, BIO & SOCIAL CONNECT INLINE RIGHT */}
            <div className="flex-1 space-y-5 text-center lg:text-left">
              
              {/* BADGE */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wider uppercase">
                <Laptop className="w-4 h-4 text-amber-400" />
                <span>Tech Architect & Lead Full-Stack Engineer</span>
              </div>

              {/* NAME */}
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-heading text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 uppercase">
                ALOK SINGH
              </h1>

              {/* BIO STATEMENT */}
              <div className="space-y-3 text-slate-300 text-sm sm:text-base leading-relaxed bg-slate-950/70 p-5 rounded-2xl border border-slate-800/90 shadow-inner">
                <p>
                  Mera naam <strong className="text-amber-300 font-semibold">Alok Singh</strong> hai. Main Gola Road, Kauriram, Gorakhpur, Uttar Pradesh ka rehne wala hoon (Date of Birth: <strong className="text-slate-200">13/04/2008</strong>).
                </p>
                <p>
                  Main full-stack web engineering, real-time system architecture, cloud deployment, aur custom UI/UX design systems me specialize karta hoon. Fast, scalable aur secure web software build karna mera core passion hai.
                </p>
              </div>

              {/* PERSONAL METRICS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800/80">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="text-xs font-bold text-slate-200">DOB: 13 April 2008 (13/04/2008)</div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800/80">
                  <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                  <div className="text-xs font-bold text-slate-200">Gola Road, Kauriram, Gorakhpur, UP</div>
                </div>
              </div>

              {/* SOCIAL MEDIA CONNECT BUTTONS — INLINE RIGHT IN THE HERO CARD AT THE VERY TOP */}
              <div className="pt-2 space-y-2">
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center justify-center lg:justify-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Connect With Alok Singh Directly:</span>
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  {socialLinks.map((social, sIdx) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={sIdx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-4 py-2.5 rounded-xl bg-gradient-to-r ${social.bgGradient} border ${social.borderColor} text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all duration-300 ${social.hoverBg}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{social.name}: {social.handle} ↗</span>
                      </a>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* 2. TECHNICAL STACK & SKILLS */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading uppercase tracking-wide">
              Technical Stack & Skills
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Technologies, frameworks, and engineering paradigms mastered by Alok Singh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* 3. ENGINEERING PILLARS & PHILOSOPHY */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading uppercase tracking-wide">
              Software Engineering Philosophy
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Core architectural approaches and engineering principles followed by Alok Singh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {engineeringPillars.map((pillar) => (
              <div 
                key={pillar.num}
                className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-xl hover:border-amber-500/40 transition-all duration-300 shadow-2xl relative overflow-hidden group"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                    Pillar {pillar.num} &bull; {pillar.subtitle}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {pillar.description}
                </p>

                <div className="space-y-2 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
                  <ul className="space-y-2">
                    {pillar.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. PERSONAL STATEMENT */}
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-red-950/30 border border-amber-500/40 rounded-3xl p-6 sm:p-10 space-y-4 text-center sm:text-left relative overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="p-4 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
              <Heart className="w-8 h-8 fill-amber-500 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading uppercase">
                Personal Statement
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                &ldquo;Building scalable, clean, and high-performance software is what drives me every day. Whether it&apos;s real-time system architecture, API design, or modern glassmorphic UIs, I focus on delivering world-class execution. Feel free to connect with me on Instagram, X, or Facebook!&rdquo;
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
