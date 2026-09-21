import Image from 'next/image';
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import { db } from '@/lib/db';
import { formatINR } from '@/lib/helpers';
import {
  Ticket, Sparkles, UserCheck, Star, Award, ShieldCheck,
  ChevronRight, Mic2, Music, Video, MapPin, Calendar, Clock, HelpCircle
} from 'lucide-react';

async function getHomepageData() {
  try {
    const activeEvent = db.prepare("SELECT * FROM events WHERE status = 'PUBLISHED' ORDER BY event_date ASC LIMIT 1").get() as any;

    let categories: any[] = [];
    if (activeEvent) {
      categories = db.prepare("SELECT * FROM ticket_categories WHERE event_id = ? AND status = 'ACTIVE' ORDER BY sort_order ASC").all(activeEvent.id);
    }

    const performers = db.prepare("SELECT * FROM performer_applications WHERE status = 'APPROVED' AND is_featured = 1").all();
    const guests = db.prepare("SELECT * FROM guest_applications WHERE status = 'APPROVED' AND is_featured = 1").all();
    const sponsors = db.prepare("SELECT * FROM sponsor_applications WHERE status = 'APPROVED' AND is_featured = 1").all();

    return { activeEvent, categories, performers, guests, sponsors };
  } catch (err) {
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
      a: "Click on 'Apply Now' and select Performer Application. Fill in your talent category, social video links, and upload your performance clip. Shortlisted candidates receive audition slots."
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
      <section className="relative min-h-[90vh] flex items-center justify-center pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-stage-radial">
        {/* Stage Lighting Rays */}
        <div className="spotlight-left" />
        <div className="spotlight-right" />
        
        {/* Animated Particles backdrop grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(255,215,0,0.2)] animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-amber-400" />
            PURVANCHAL'S #1 LIVE TALENT & ENTERTAINMENT SHOW
          </div>

          {/* Official Logo Banner */}
          <div className="relative w-72 sm:w-96 md:w-[540px] h-36 sm:h-48 md:h-64 mx-auto animate-float">
            <Image
              src="/logo.png"
              alt="Gorakhpur's Got Latent Official Title Logo"
              fill
              priority
              className="object-contain mix-blend-screen filter drop-shadow-[0_0_40px_rgba(255,215,0,0.7)]"
            />
          </div>

          {/* Title & Tagline */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase">
              GORAKHPUR’S GOT <span className="gold-gradient-text">LATENT</span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-amber-200/90 italic">
              "Where Talent Meets the Stage"
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Unfiltered performances, raw energy, music fusion, standup comedy roasts, and extraordinary talent judged live in front of thousands!
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/tickets"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:shadow-[0_0_45px_rgba(255,160,0,0.8)] hover:scale-105 transition-all duration-300"
            >
              <Ticket className="w-6 h-6 text-black" />
              BOOK YOUR TICKET
            </Link>

            <Link
              href="/apply"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border-2 border-amber-500/40 text-amber-300 font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:border-amber-400 transition-all duration-300"
            >
              <UserCheck className="w-6 h-6 text-orange-400" />
              APPLY NOW
            </Link>
          </div>
        </div>
      </section>

      {/* 2. EVENT COUNTDOWN */}
      <section className="px-4 sm:px-6 lg:px-8">
        <CountdownTimer
          targetDate={activeEvent?.event_date ? `${activeEvent.event_date}T${activeEvent.start_time}` : "2026-11-28T17:00:00"}
          venue={activeEvent?.venue_name || "Gorakhpur Club Ground"}
          city={activeEvent?.city || "Gorakhpur"}
        />
      </section>

      {/* 3. ABOUT THE SHOW */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Star className="w-4 h-4 text-amber-400" />
              ABOUT THE SHOW
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Purvanchal's Ultimate <span className="gold-gradient-text">Stage Phenomenon</span>
            </h2>
            <p className="text-slate-300 leading-relaxed text-base sm:text-lg">
              Gorakhpur’s Got Latent was created with a clear vision: to unearth, celebrate, and spotlight the rawest, most unique talent hidden across North India. From grassroots acoustic singers and Bhojpuri beatboxers to high-octane dancers and hilarious standup comedians.
            </p>
            <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
              Unlike generic corporate competitions, GGL offers an unfiltered, electrifying live audience atmosphere with celebrity judges, interactive audience scoring, and real stage glory.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-1">
                <span className="text-3xl font-black text-amber-400">100%</span>
                <p className="text-xs text-slate-400 font-semibold uppercase">Live & Unscripted</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-1">
                <span className="text-3xl font-black text-orange-400">1,200+</span>
                <p className="text-xs text-slate-400 font-semibold uppercase">Live Capacity</p>
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
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-bold text-amber-300 bg-black/70 backdrop-blur-md p-3 rounded-xl border border-amber-500/30">
                  <span>STAGE LIGHTING & SOUND</span>
                  <span className="text-emerald-400">STATE OF THE ART</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mic2 className="w-5 h-5 text-amber-400" />
                  What Makes GGL Unique?
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                    Open for Singers, Comedians, Beatboxers, Dancers & Unique Acts
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                    Celebrity Judges & Guest Creator Panel
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-amber-400" />
                    Official E-Tickets with instant QR Gate Pass Verification
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. UPCOMING SHOW & TICKET PREVIEW */}
      {activeEvent && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-950/60 border-y border-amber-500/20">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Upcoming Event & <span className="gold-gradient-text">Ticket Passes</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Secure your pass early before capacity sells out! Choose your preferred category.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat: any) => (
              <div
                key={cat.id}
                className="relative rounded-3xl glass-card p-6 sm:p-8 flex flex-col justify-between space-y-6 group hover:border-amber-400 transition-all duration-300"
              >
                {cat.name.includes('VVIP') && (
                  <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] font-black uppercase tracking-widest shadow-lg">
                    MOST POPULAR
                  </div>
                )}

                <div className="space-y-4">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    TICKET PASS
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{cat.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>
                  <div className="pt-2">
                    <span className="text-3xl sm:text-4xl font-black text-amber-400">
                      {formatINR(cat.price)}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ person</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Remaining Seats:</span>
                    <span className="font-bold text-amber-400">{cat.available_qty} passes left</span>
                  </div>

                  <Link
                    href={`/tickets?category=${cat.id}`}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all"
                  >
                    <Ticket className="w-4 h-4" />
                    SELECT & BOOK
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. FEATURED APPROVED PERFORMERS */}
      {performers.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Music className="w-4 h-4" />
                STAGE SPOTLIGHT
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                Featured Approved <span className="gold-gradient-text">Performers</span>
              </h2>
            </div>
            <Link href="/performers" className="text-sm font-bold text-amber-400 hover:underline flex items-center gap-1">
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
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            APPLICATION WORKFLOW
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
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
              <span className="text-4xl font-black text-amber-500/30 font-mono">{item.step}</span>
              <h4 className="text-lg font-bold text-white">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-10">
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:scale-105 transition-all"
          >
            START APPLICATION NOW <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-3xl font-extrabold text-white">Got Questions? We Have Answers.</h2>
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
