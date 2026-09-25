import Image from 'next/image';
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import { db } from '@/lib/db';
import { formatINR } from '@/lib/helpers';
import {
  Ticket, Sparkles, UserCheck, Star, Award, ShieldCheck,
  ChevronRight, Mic2, Music, Video, MapPin, Calendar, Clock, HelpCircle,
  Zap, Flame, Disc, Radio
} from 'lucide-react';

function YouTubeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

async function getHomepageData() {
  try {
    const activeEvent = await db.queryOne<any>("SELECT * FROM events WHERE status = 'PUBLISHED' ORDER BY event_date ASC LIMIT 1");

    let categories: any[] = [];
    if (activeEvent) {
      categories = await db.query("SELECT * FROM ticket_categories WHERE event_id = ? AND status = 'ACTIVE' ORDER BY sort_order ASC", [activeEvent.id]);
    }

    const performers = await db.query("SELECT * FROM performer_applications WHERE status = 'APPROVED' AND is_featured = 1");
    const guests = await db.query("SELECT * FROM guest_applications WHERE status = 'APPROVED' AND is_featured = 1");
    const sponsors = await db.query("SELECT * FROM sponsor_applications WHERE status = 'APPROVED' AND is_featured = 1");

    return { activeEvent, categories, performers, guests, sponsors };
  } catch (err) {
    console.error('getHomepageData error:', err);
    return { activeEvent: null, categories: [], performers: [], guests: [], sponsors: [] };
  }
}

export default async function HomePage() {
  const { activeEvent, categories, performers, guests, sponsors } = await getHomepageData();

  const faqs = [
    {
      q: "What is Gorakhpur's Got Latent?",
      a: "Gorakhpur's Got Latent is Purvanchal's flagship live talent hunt show and entertainment phenomenon. It showcases musicians, beatboxers, stand-up comedians, dancers, magicians, and raw unique performers live on stage."
    },
    {
      q: "How can I apply as a performer?",
      a: "Episode 1 performer slots are currently full! The next registration date is coming soon. You can now fill the registration form for Episode 2 by clicking 'Apply Now' -> 'Performer Application'."
    },
    {
      q: "How do I receive my ticket after payment?",
      a: "As soon as your payment is verified via Razorpay, your official Digital E-Ticket with a unique QR code is generated instantly. You can download or print it from the booking confirmation screen."
    },
    {
      q: "Can my brand sponsor the show?",
      a: "Yes! Go to Apply Now -> Brand Sponsor. Submit your company details, budget estimate, and brand deck. Our partnership team will contact you with customizable packages."
    },
    {
      q: "What is the refund policy for tickets?",
      a: "Tickets are non-refundable unless the event is officially cancelled by the organizers. Duplicate payments are automatically reconciled."
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center justify-center pt-0 sm:pt-2 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 bg-stage-radial">
        {/* Stage Lighting Rays */}
        <div className="spotlight-left" />
        <div className="spotlight-right" />
        
        {/* Animated Particles backdrop grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        {/* Floating Cartoon Mics, Musical Notes & Stage Sparks in Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Top Left Floating Mic & Musical Notes */}
          <div className="absolute top-4 left-1 sm:left-8 w-14 h-14 sm:w-20 sm:h-20 opacity-25 text-amber-400 animate-pulse flex items-center justify-center p-2 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
            <Mic2 className="w-8 h-8 sm:w-12 sm:h-12 -rotate-12 text-amber-400" />
          </div>
          <div className="absolute top-24 left-6 sm:left-24 opacity-30 text-amber-300 animate-bounce">
            <Music className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>

          {/* Top Right Floating Mic & Stage Lightning */}
          <div className="absolute top-4 right-1 sm:right-8 w-14 h-14 sm:w-20 sm:h-20 opacity-25 text-orange-400 animate-pulse flex items-center justify-center p-2 rounded-full bg-orange-500/10 border border-orange-500/20 shadow-[0_0_20px_rgba(255,140,0,0.2)]">
            <Mic2 className="w-8 h-8 sm:w-12 sm:h-12 rotate-12 text-orange-400" />
          </div>
          <div className="absolute top-28 right-6 sm:right-24 opacity-30 text-amber-400 animate-bounce delay-300">
            <Zap className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>

          {/* Mid Left Sparkles */}
          <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-12 opacity-25 text-yellow-400 animate-float">
            <Sparkles className="w-7 h-7 sm:w-9 sm:h-9" />
          </div>

          {/* Mid Right Music Note */}
          <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-12 opacity-25 text-amber-300 animate-float delay-500">
            <Music className="w-7 h-7 sm:w-9 sm:h-9" />
          </div>

          {/* Lower Stage Flame & Disc */}
          <div className="absolute bottom-6 left-4 sm:left-16 opacity-25 text-orange-400 animate-pulse">
            <Flame className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div className="absolute bottom-8 right-4 sm:right-16 opacity-25 text-amber-400 animate-pulse delay-700">
            <Disc className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4 sm:space-y-5">
          {/* Official Logo Banner */}
          <div className="relative w-72 sm:w-[420px] md:w-[500px] h-36 sm:h-48 md:h-60 mx-auto animate-float">
            <Image
              src="/logo.png"
              alt="Gorakhpur's Got Latent Official Title Logo"
              fill
              priority
              className="object-contain filter drop-shadow-[0_0_35px_rgba(255,215,0,0.65)]"
            />
          </div>

          {/* Tagline & Description */}
          <div className="space-y-2 max-w-3xl mx-auto -mt-3 sm:-mt-4">
            <h1 className="sr-only">Gorakhpur's Got Latent</h1>
            <p className="font-bebas text-3xl sm:text-5xl md:text-6xl text-amber-300 tracking-wide uppercase drop-shadow-[0_0_12px_rgba(255,215,0,0.35)]">
              "KUCH BHI HO SAKTA HAI"
            </p>
          </div>

          {/* Episode 2 Auditions Status Banner */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-barlow uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Registration Open for Episode 2
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
            <a
              href="https://in.bookmyshow.com/events/gorakhpur-got-latent/ET00518139?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black font-barlow font-bold uppercase tracking-wider text-base sm:text-lg flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:shadow-[0_0_45px_rgba(255,160,0,0.8)] hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <Ticket className="w-6 h-6 text-black" />
              BOOK YOUR TICKET
            </a>

            <Link
              href="/apply/performer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border-2 border-amber-500/40 text-amber-300 font-barlow font-bold uppercase tracking-wider text-base sm:text-lg flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:border-amber-400 transition-all duration-300 cursor-pointer"
            >
              <UserCheck className="w-6 h-6 text-orange-400" />
              APPLY FOR EPISODE 2
            </Link>
          </div>

          {/* Official YouTube Channel Banner */}
          <div className="pt-3 max-w-2xl mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/70 border border-red-500/40 text-center space-y-3 shadow-[0_0_25px_rgba(239,68,68,0.2)] relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/40 shrink-0">
                    <YouTubeIcon className="w-7 h-7 text-red-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="text-[10px] font-black uppercase tracking-wider text-red-400 font-barlow">
                        OFFICIAL YOUTUBE CHANNEL
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                      Gorakhpur's Got Latent Official YouTube Channel
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      All official show episodes, audition clips, and live roast videos will be uploaded exclusively on this channel.
                    </p>
                  </div>
                </div>

                <a
                  href="https://www.youtube.com/@GkpGotLatent"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold font-barlow text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/30 hover:scale-105 transition-all shrink-0 self-stretch sm:self-auto justify-center cursor-pointer"
                >
                  <YouTubeIcon className="w-4 h-4 text-white" />
                  <span>SUBSCRIBE NOW ↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EVENT COUNTDOWN */}
      <section className="px-4 sm:px-6 lg:px-8">
        <CountdownTimer
          targetDate={activeEvent?.event_date ? `${activeEvent.event_date}T${activeEvent.start_time}` : "2026-09-26T13:00:00"}
          venue={activeEvent?.venue_name || "Gorakhpur Club Ground"}
          city={activeEvent?.city || "Gorakhpur"}
        />
      </section>

      {/* 3. PROMOTIONAL SHOWCASE BANNER / VIDEO SPOTLIGHT */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-barlow text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" /> UNFILTERED COMEDY & TALENT HUNT
            </div>
            <h2 className="font-bebas text-4xl sm:text-6xl text-white leading-tight uppercase tracking-tight">
              LIVE ROAST, AUDITIONS & <span className="gold-gradient-text">EPIC PERFORMANCES</span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Gorakhpur’s Got Latent is Purvanchal’s premier raw talent hunt show bringing together singers, beatboxers, dancers, standup comedians, and viral internet sensation panel guests live on stage.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-1">
                <span className="font-bebas text-4xl sm:text-5xl font-bold text-amber-400">10,000+</span>
                <p className="text-xs text-slate-400 font-medium font-barlow uppercase">Live Audience Seats</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-1">
                <span className="font-bebas text-4xl sm:text-5xl font-bold text-orange-400">100+</span>
                <p className="text-xs text-slate-400 font-medium font-barlow uppercase">Shortlisted Performers</p>
              </div>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="relative rounded-3xl p-1 bg-gradient-to-tr from-amber-500/40 via-orange-500/20 to-transparent shadow-[0_0_50px_rgba(255,215,0,0.15)]">
            <div className="relative rounded-[23px] bg-slate-950 p-6 sm:p-8 space-y-6">
              <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-amber-500/30">
                <Image
                  src="/logo.png"
                  alt="Gorakhpur's Got Latent Stage"
                  fill
                  className="object-contain bg-[#07080e] p-6"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-bold text-amber-300 bg-black/70 backdrop-blur-md p-3 rounded-xl border border-amber-500/30 font-barlow uppercase tracking-wider">
                  <span>STAGE LIGHTING & SOUND</span>
                  <span className="text-emerald-400">STATE OF THE ART</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bebas text-2xl sm:text-3xl text-white uppercase tracking-wide">Purvanchal’s Biggest Stage Is Ready</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Book your pass now on BookMyShow to witness raw talent and live roasts directly from front-row seats.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SHOWCASE TICKET PASSES TIERS */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-barlow text-xs font-bold uppercase tracking-wider">
            <Ticket className="w-4 h-4 text-amber-400" /> EXCLUSIVE SHOW PASS
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl text-white uppercase tracking-tight">
            BOOK YOUR <span className="gold-gradient-text">SHOW ENTRY PASS</span>
          </h2>
        </div>

        <div className="max-w-md mx-auto">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 flex flex-col justify-between space-y-6 hover:border-amber-400 transition-all shadow-[0_0_30px_rgba(255,215,0,0.2)] relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-barlow text-xs font-bold text-amber-400 uppercase tracking-widest">OFFICIAL ENTRY PASS</span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-barlow uppercase animate-pulse">SELLING FAST</span>
              </div>
              <div className="font-bebas text-5xl sm:text-6xl text-white flex items-baseline gap-2">
                <span className="gold-gradient-text font-black">₹99</span>
                <span className="text-xs text-slate-400 font-barlow font-normal uppercase">/ Entry Pass</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Access to live audience arena, front stage seating, live performance roasts & voting experience.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-300 font-barlow uppercase font-medium">
                <span>Status:</span>
                <span className="font-bold text-amber-400">BookMyShow Verified</span>
              </div>

              <a
                href="https://in.bookmyshow.com/events/gorakhpur-got-latent/ET00518139?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black font-barlow font-bold uppercase tracking-wider text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_30px_rgba(255,160,0,0.7)] hover:scale-[1.02] transition-all"
              >
                <Ticket className="w-5 h-5 text-black" />
                BOOK ON BOOKMYSHOW ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED APPROVED PERFORMERS */}
      {performers.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-barlow text-xs font-bold uppercase tracking-wider mb-2">
                <Music className="w-4 h-4" />
                STAGE SPOTLIGHT
              </div>
              <h2 className="font-bebas text-4xl sm:text-5xl text-white uppercase tracking-tight">
                Featured Approved <span className="gold-gradient-text">Performers</span>
              </h2>
            </div>
            <Link href="/performers" className="font-barlow text-sm font-bold uppercase tracking-wider text-amber-400 hover:underline flex items-center gap-1">
              View All Performers <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {performers.map((p: any) => (
              <div key={p.app_id} className="rounded-2xl glass-panel p-6 space-y-4 hover:border-amber-500/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-300">
                    {p.full_name[0]}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{p.full_name}</h4>
                    <p className="text-xs text-amber-400 font-medium">{p.talent_category} • {p.city}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{p.short_bio || p.performance_desc}</p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 font-barlow uppercase">
                  <span>Talent: {p.primary_talent}</span>
                  <span className="text-emerald-400 font-semibold uppercase">APPROVED</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. HOW TO APPLY (STEP BY STEP) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-950/40 border-t border-amber-500/10">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-barlow text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            APPLICATION WORKFLOW
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl text-white uppercase tracking-tight">
            How To Get On <span className="gold-gradient-text">The GGL Stage</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Choose Category', desc: 'Performer, Celebrity Guest, Brand Sponsor, or Event Host.' },
            { step: '02', title: 'Fill Details & Work', desc: 'Submit talent profile, video links, press kit or brand deck.' },
            { step: '03', title: 'Get Unique App ID', desc: 'Receive tracking code like GGL-PER-109283 for live status.' },
            { step: '04', title: 'Audition & Stage', desc: 'Shortlisted candidates get audition call & main stage slot.' }
          ].map((item, idx) => (
            <div key={idx} className="relative p-6 rounded-2xl bg-slate-900/60 border border-amber-500/20 space-y-3">
              <span className="font-bebas text-4xl sm:text-5xl text-amber-500/40">{item.step}</span>
              <h4 className="font-bebas text-xl sm:text-2xl text-white uppercase tracking-wide">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-10">
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-barlow font-bold uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:scale-105 transition-all"
          >
            START APPLICATION NOW <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-barlow text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="font-bebas text-4xl sm:text-5xl text-white uppercase tracking-tight">Got Questions? <span className="gold-gradient-text">We Have Answers.</span></h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
              <h4 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <span className="text-amber-500 font-mono">Q.</span> {faq.q}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
