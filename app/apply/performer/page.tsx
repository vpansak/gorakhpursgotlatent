'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mic2, Clock, ArrowRight, Home, Search,
  Bell, ShieldCheck, Mail, MessageSquare, ExternalLink, Sparkles
} from 'lucide-react';

export default function PerformerApplyPage() {
  const [trackAppId, setTrackAppId] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackAppId.trim()) {
      window.location.href = `/track?appId=${encodeURIComponent(trackAppId.trim())}`;
    }
  };

  const whatsappInquiryUrl = `https://wa.me/918423858424?text=${encodeURIComponent(
    "Hello Gorakhpur's Got Latent Team! 👋\n\nI want to inquire about Performer Registration for Episode 2. Please let me know when registration opens! Thank you."
  )}`;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-300">
      {/* 1. HEADER NOTICE */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <Clock className="w-4 h-4 text-amber-400 animate-pulse" /> PERFORMER REGISTRATION NOTICE
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Registration for Episode 2 <span className="gold-gradient-text">Starting Soon</span>
        </h1>

        <p className="text-base sm:text-lg text-amber-200/90 font-medium max-w-2xl mx-auto leading-relaxed">
          Registration for <strong className="text-amber-400 underline decoration-amber-400/50">Episode 2 auditions will open soon</strong>!
        </p>
      </div>

      {/* 2. MAIN NOTICE CARD */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border-2 border-amber-500/30 shadow-[0_0_50px_rgba(255,215,0,0.15)] space-y-8 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Status Callout */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-orange-950/60 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <Mic2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider">
                  EPISODE 2 ANNOUNCEMENT
                </span>
                <span className="text-xs text-amber-300 font-bold">Registration Opening Soon</span>
              </div>
              <h3 className="text-lg font-black text-white">No Online Payment Required Currently</h3>
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-extrabold whitespace-nowrap">
            Status: Starting Soon
          </div>
        </div>

        {/* Key Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Starting Soon</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Episode 2 audition registration dates will be announced shortly.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Bell className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Get Notified</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Follow our official Instagram channel to get instant registration alerts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Already Registered?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Track your submitted application status using your Application ID.
            </p>
          </div>
        </div>

        {/* DIRECT WHATSAPP INQUIRY BUTTON */}
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
            <MessageSquare className="w-5 h-5" />
            <span>Have Questions About Episode 2 Auditions?</span>
          </div>
          <p className="text-xs text-slate-300">
            Contact our organizing team directly on WhatsApp (<strong>8423858424</strong>) for registration updates.
          </p>
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all"
          >
            <span>INQUIRE ON WHATSAPP (+91 84238 58424)</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* TRACK EXISTING APPLICATION FORM */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/20 space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white">Track Submitted Application</h3>
          </div>
          <p className="text-xs text-slate-300">
            If you have already submitted your performer application, enter your Application ID below to check your status.
          </p>
          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={trackAppId}
              onChange={(e) => setTrackAppId(e.target.value)}
              placeholder="e.g. GGL-PER-109283"
              className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none uppercase font-mono tracking-wider"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>TRACK STATUS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link
            href="/track"
            className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all"
          >
            <Search className="w-4 h-4" /> TRACK AUDITION STATUS
          </Link>

          <Link
            href="/"
            className="px-8 py-4 rounded-2xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" /> RETURN TO HOMEPAGE
          </Link>
        </div>
      </div>

      {/* 3. CONTACT SUPPORT FOOTER */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
          Have Questions About Performers & Auditions?
        </h4>
        <p className="text-xs text-slate-300">
          Reach out to our organizing team directly for assistance or updates.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs pt-1">
          <Link href="/contact" className="text-amber-400 hover:underline font-bold flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" /> Contact Support Page
          </Link>
          <a href="https://www.instagram.com/gkp_got_latent/" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline font-bold">
            Official Instagram (@gkp_got_latent) ↗
          </a>
        </div>
      </div>
    </div>
  );
}
