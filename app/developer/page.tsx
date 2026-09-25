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
  CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: "Developer Profile | Alok Singh - Gorakhpur's Got Latent",
  description: "Creator & Lead Developer of Gorakhpur's Got Latent official website & core tech infrastructure.",
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
  return (
    <div className="min-h-screen bg-[#07080e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-10">
        
        {/* Header Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold tracking-wider uppercase backdrop-blur-md shadow-lg shadow-amber-500/5">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Sole Creator & Tech Lead</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-heading text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 uppercase">
            Developer Profile
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            The mind and engineering behind <span className="text-amber-400 font-semibold">Gorakhpur's Got Latent</span> official platform.
          </p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            
            {/* Developer Avatar */}
            <div className="relative shrink-0">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl shadow-amber-500/20 group-hover:border-amber-400 transition-all">
                <Image
                  src="/alok-singh.jpg"
                  alt="Alok Singh - Developer of Gorakhpur's Got Latent"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs px-3 py-1 rounded-lg shadow-lg flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                VERIFIED DEV
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-wide">
                  Alok Singh
                </h2>
                <p className="text-amber-400 text-sm sm:text-base font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Code2 className="w-4 h-4" /> Full-Stack Website Creator & Core Tech Lead
                </p>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
                &ldquo;Maine <strong className="text-amber-300">Gorakhpur&apos;s Got Latent</strong> ki poori website design aur develop ki hai. Platform ki backend system, ticketing infrastructure, live scoring system aur Insta handle core main sambhalta hoon.&rdquo;
              </p>

              {/* Grid Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                
                {/* DOB */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800/60">
                  <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-semibold">Date of Birth</div>
                    <div className="text-sm font-medium text-slate-200">13 April 2008 (13/04/2008)</div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800/60">
                  <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-semibold">Hometown</div>
                    <div className="text-sm font-medium text-slate-200">Gola Road, Kauriram, Gorakhpur, UP</div>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Core Roles & Achievements Section */}
          <div className="mt-8 pt-8 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                <Terminal className="w-4 h-4" /> Full Website Architecture
              </div>
              <p className="text-xs text-slate-400">
                Built the entire website from scratch using modern serverless tech, custom styling, and optimized databases.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                <Cpu className="w-4 h-4" /> Core System & Insta Management
              </div>
              <p className="text-xs text-slate-400">
                Handles official GGL Instagram management, live event operations, and core technical backend systems.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                <ShieldCheck className="w-4 h-4" /> Ticketing & Applications
              </div>
              <p className="text-xs text-slate-400">
                Designed secure performer application forms, sponsor onboarding portals, and live ticket checkout flows.
              </p>
            </div>

          </div>

        </div>

        {/* Social Connect Links */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center text-slate-200 flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" /> Connect With Alok
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Instagram */}
            <a
              href="https://www.instagram.com/aloksingh_._/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-pink-900/30 to-purple-900/30 border border-pink-500/30 hover:border-pink-500/70 hover:scale-[1.02] transition-all duration-200 group shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white shadow-md">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Instagram</div>
                  <div className="text-sm font-bold text-white group-hover:text-pink-300">@aloksingh_._</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-pink-400" />
            </a>

            {/* X / Twitter */}
            <a
              href="https://x.com/rajpratapsinghh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-slate-500 hover:scale-[1.02] transition-all duration-200 group shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-800 text-white shadow-md border border-slate-700">
                  <XIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">X (Twitter)</div>
                  <div className="text-sm font-bold text-white group-hover:text-amber-300">@rajpratapsinghh</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/meadorush"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-600/30 hover:border-blue-500/70 hover:scale-[1.02] transition-all duration-200 group shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-600 text-white shadow-md">
                  <FacebookIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Facebook</div>
                  <div className="text-sm font-bold text-white group-hover:text-blue-300">@meadorush</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
            </a>

          </div>
        </div>

        {/* Unlinked Notice Footer */}
        <div className="text-center pt-6 border-t border-slate-900 text-xs text-slate-500">
          🔒 Private Developer Route &bull; Accessible via direct URL only (<span className="text-slate-400">/developer</span>)
        </div>

      </div>
    </div>
  );
}
