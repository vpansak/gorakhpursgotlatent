import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trophy, Ticket, Sparkles, Mic2, Star, Users, Building2, 
  MapPin, Mail, Phone, ShieldCheck, ArrowRight, CheckCircle2,
  FileText, HelpCircle, Heart, Zap
} from 'lucide-react';

export const metadata = {
  title: "Quick Info & Site Index | Gorakhpur's Got Latent",
  description: "Official Quick Info guide for Gorakhpur's Got Latent. Explore Episode 1 winners, digital ticket booking, auditions, performer spotlights, policies, and contact help.",
};

export default function QuickInfoPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-barlow uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-400" /> OFFICIAL SHOW INDEX
        </div>
        <h1 className="font-bebas text-4xl sm:text-6xl text-white uppercase tracking-tight">
          QUICK <span className="gold-gradient-text">INFO & GUIDE</span>
        </h1>
        <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
          Welcome to the official Quick Info hub for Gorakhpur’s Got Latent. Find instant access to Episode 1 results, tickets, audition registrations, spotlights, and official policies below.
        </p>
      </div>

      {/* Quick Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Episode 1 Winners */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-amber-500/30 space-y-4 hover:border-amber-400/60 transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-bebas text-2xl text-white uppercase tracking-wide">
              Episode 1 Winners 🏆
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              View complete contestant scores, judge ratings (Brijesh, Somya, Naveen, Jahanvi, Vivek), raw averages, and official winner standings from Episode 1.
            </p>
          </div>
          <Link
            href="/ep1"
            className="w-full py-3 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-4"
          >
            <span>View Ep 1 Standings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2. Show Entry Tickets */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-orange-500/30 space-y-4 hover:border-orange-400/60 transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
              <Ticket className="w-6 h-6" />
            </div>
            <h3 className="font-bebas text-2xl text-white uppercase tracking-wide">
              Book Show Tickets 🎟️
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Official entry passes for live audience arena, front-row stage seating, live performance roasts, and voting experience.
            </p>
          </div>
          <Link
            href="/book-ticket"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-md mt-4"
          >
            <span>Book Official Ticket — ₹149</span>
          </Link>
        </div>

        {/* 3. Auditions & Applications */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-emerald-500/30 space-y-4 hover:border-emerald-400/60 transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Mic2 className="w-6 h-6" />
            </div>
            <h3 className="font-bebas text-2xl text-white uppercase tracking-wide">
              Episode 2 Auditions 🎤
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Audition registrations for Episode 2 are FREE! Submit your talent profile (singing, comedy, dance, magic, shayari, unique acts).
            </p>
          </div>
          <Link
            href="/apply/performer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-4"
          >
            <span>Apply For Episode 2</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4. Performers & Guest Panel */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-purple-500/30 space-y-4 hover:border-purple-400/60 transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-bebas text-2xl text-white uppercase tracking-wide">
              Performers & Guests 🌟
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Discover approved talent spotlights, celebrity guest judges, influencer panel, and brand partner decks for Purvanchal's biggest stage show.
            </p>
          </div>
          <div className="flex gap-2 mt-4">
            <Link
              href="/performers"
              className="flex-1 py-2.5 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-[11px] font-black uppercase text-center transition-all"
            >
              Performers
            </Link>
            <Link
              href="/guests"
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-black uppercase text-center transition-all"
            >
              Guests
            </Link>
          </div>
        </div>

        {/* 5. Venue & Help Desk */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-blue-500/30 space-y-4 hover:border-blue-400/60 transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bebas text-2xl text-white uppercase tracking-wide">
              Venue & Support 📍
            </h3>
            <div className="space-y-1 text-xs text-slate-300">
              <p className="font-semibold text-white">Location: Announce Soon, Gorakhpur, UP</p>
              <p>Email: <a href="mailto:help.gglatemt@gmail.com" className="text-amber-400 underline">help.gglatemt@gmail.com</a></p>
              <p>WhatsApp: <a href="https://wa.me/918423858424" target="_blank" rel="noreferrer" className="text-emerald-400 underline">+91 84238 58424</a></p>
            </div>
          </div>
          <Link
            href="/contact"
            className="w-full py-3 px-4 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-4"
          >
            <span>Contact Helpdesk</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6. Legal & Policies */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-700 space-y-4 hover:border-slate-500 transition-all flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bebas text-2xl text-white uppercase tracking-wide">
              Show Policies 📜
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Read our official Terms & Conditions, Privacy Policy, and Ticket & Refund Guidelines for all live show attendees and performers.
            </p>
          </div>
          <div className="flex flex-col gap-1.5 pt-2 text-xs font-semibold text-amber-400">
            <Link href="/terms" className="hover:underline">→ Terms & Conditions</Link>
            <Link href="/privacy" className="hover:underline">→ Privacy Policy</Link>
            <Link href="/refund-policy" className="hover:underline">→ Refund & Cancellation Policy</Link>
          </div>
        </div>
      </div>

      {/* Footer Return Button */}
      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 hover:border-amber-400 text-amber-400 font-black text-xs uppercase tracking-wider transition-all"
        >
          <span>Return To Homepage</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
