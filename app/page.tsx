import Image from 'next/image';
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import { db } from '@/lib/db';
import { formatINR } from '@/lib/helpers';
import {
  Ticket, Sparkles, UserCheck, Star, Award, ShieldCheck,
  ChevronRight, ArrowRight, ArrowDown, Mic2, Music, Video, MapPin,
  Calendar, Clock, HelpCircle, Users, Handshake, Eye, Radio
} from 'lucide-react';

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
      a: "Click on 'Apply Now' and select Performer Application. Fill in your talent category, social video links, and upload your performance clip. Shortlisted candidates receive audition slots."
    },
    {
      q: "How do I receive my ticket after payment?",
      a: "As soon as your payment is verified via Razorpay or BookMyShow, your official Digital E-Ticket with a unique QR code is generated instantly. You can download or print it from the booking confirmation screen."
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
    <div className="relative overflow-hidden bg-[#07080e] text-slate-100">
      {/* 1. HERO SECTION WITH STAGE BACKGROUND & EXACT LIVE SCORING OVERLAY */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Stage Photo Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-stage.jpg"
            alt="Gorakhpur's Got Latent Live Stage Show"
            fill
            priority
            className="object-cover object-center opacity-65 md:opacity-75 scale-105 transition-transform duration-1000"
          />
          {/* Gradients to blend into dark website */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080e] via-[#07080e]/60 to-[#07080e]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07080e]/80 via-transparent to-[#07080e]/70" />
        </div>

        {/* Stage Lighting Rays */}
        <div className="spotlight-left" />
        <div className="spotlight-right" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end pt-10 sm:pt-16">
          {/* Left Column: Eyebrow + Huge Title + Description + CTAs */}
          <div className="lg:col-span-8 space-y-6 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 text-amber-400 font-barlow font-bold uppercase tracking-[0.25em] text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
              GORAKHPUR'S LIVE ENTERTAINMENT SHOW
            </div>

            {/* Headline in Bebas Neue */}
            <h1 className="font-bebas text-6xl sm:text-7xl md:text-8xl lg:text-[105px] xl:text-[115px] leading-[0.88] tracking-tight uppercase select-none">
              <span className="text-white block drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                KUCHH BHI
              </span>
              <span className="text-[#FF9F1C] block drop-shadow-[0_4px_30px_rgba(255,159,28,0.4)]">
                HO SAKTA HAI!
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl leading-relaxed font-normal drop-shadow-md">
              Talent, comedy, music, chaos and completely unexpected performances—live on one stage.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <Link
                href="/apply"
                className="px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-barlow font-bold uppercase tracking-wider text-sm sm:text-base flex items-center gap-2.5 shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:shadow-[0_0_35px_rgba(220,38,38,0.8)] hover:scale-105 transition-all duration-200"
              >
                JOIN GGL <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

              <a
                href="#discover"
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-black/60 hover:bg-black/80 text-white font-barlow font-bold uppercase tracking-wider text-sm sm:text-base border border-white/20 backdrop-blur-md flex items-center gap-2 transition-all duration-200"
              >
                DISCOVER THE SHOW <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              </a>

              <a
                href="https://in.bookmyshow.com/events/gorakhpur-got-latent/ET00518139?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
                target="_blank"
                rel="noreferrer"
                className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-barlow font-bold uppercase tracking-wider text-sm sm:text-base flex items-center gap-2 shadow-[0_0_20px_rgba(255,160,0,0.4)] hover:scale-105 transition-all duration-200"
              >
                <Ticket className="w-4 h-4 text-black" />
                BOOK ON BOOKMYSHOW ↗
              </a>
            </div>
          </div>

          {/* Right Column: Live Scoring Box (from the exact user screenshot) */}
          <div className="lg:col-span-4 w-full flex justify-start lg:justify-end">
            <div className="w-full max-w-sm rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-barlow text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-slate-300">
                    LIVE SCORING
                  </span>
                </div>
                <span className="font-barlow text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  REAL-TIME
                </span>
              </div>

              {/* 5 Judge score boxes */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
                {[
                  { name: 'JUDGE 1', score: '8' },
                  { name: 'JUDGE 2', score: '9' },
                  { name: 'JUDGE 3', score: '7' },
                  { name: 'JUDGE 4', score: '9' },
                  { name: 'JUDGE 5', score: '8' },
                ].map((judge) => (
                  <div key={judge.name} className="p-1.5 sm:p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="block text-[8px] sm:text-[9px] font-barlow font-bold text-slate-400 tracking-wider">
                      {judge.name}
                    </span>
                    <span className="font-bebas text-2xl sm:text-3xl font-bold text-white tracking-normal block mt-0.5">
                      {judge.score}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Score Display */}
              <div className="text-center pt-3 border-t border-white/10 bg-white/[0.02] rounded-xl py-3">
                <span className="font-barlow text-xs font-bold uppercase tracking-[0.2em] text-slate-400 block">
                  TOTAL SCORE
                </span>
                <span className="font-bebas text-4xl sm:text-5xl font-black text-[#FF9F1C] tracking-tight block">
                  8.20
                </span>
                <span className="font-barlow text-[11px] text-slate-400 uppercase tracking-widest block">
                  (OUT OF 10)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EVENT COUNTDOWN & VENUE DETAILS */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-4 relative z-20">
        <CountdownTimer
          targetDate={activeEvent?.event_date ? `${activeEvent.event_date}T${activeEvent.start_time}` : "2026-09-26T13:00:00"}
          venue={activeEvent?.venue_name || "New Uday Lounge, Near Hotel Radient"}
          city={activeEvent?.city || "Gorakhpur"}
        />
      </section>

      {/* 3. "THIS IS GGL" / "ONE STAGE. ENDLESS POSSIBILITIES." */}
      <section id="discover" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 font-barlow text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-400" /> THIS IS GGL
          </div>
          <h2 className="font-bebas text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight uppercase leading-[0.9]">
            ONE STAGE. <span className="text-[#FF9F1C]">ENDLESS POSSIBILITIES.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Show dates, venue updates, booking status and YouTube releases are updated directly from the official GGL schedule.
          </p>
        </div>

        {/* Schedule Cards */}
        <div className="space-y-4">
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-barlow text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                SHOW 01
              </span>
              <span className="font-barlow text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                REGISTRATION OPEN
              </span>
              <div className="flex items-center gap-2 font-bebas text-2xl sm:text-3xl text-white">
                <Calendar className="w-5 h-5 text-amber-400" />
                26 SEP 2026
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 font-barlow uppercase font-medium">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                New Uday Lounge, Near Hotel Radient
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Video className="w-4 h-4 text-red-500" />
                YouTube: To be announced
              </span>
            </div>

            <Link
              href="/apply"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-barlow font-bold uppercase tracking-wider text-sm transition-all"
            >
              REGISTER FOR THIS SHOW
            </Link>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-barlow text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                SHOW 02
              </span>
              <span className="font-barlow text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                REGISTRATION OPEN
              </span>
              <div className="flex items-center gap-2 font-bebas text-2xl sm:text-3xl text-white">
                <Calendar className="w-5 h-5 text-amber-400" />
                OCTOBER 2026
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 font-barlow uppercase font-medium">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                Venue: To Be Decided
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Video className="w-4 h-4 text-red-500" />
                YouTube: To be announced
              </span>
            </div>

            <Link
              href="/apply"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-barlow font-bold uppercase tracking-wider text-sm transition-all"
            >
              REGISTER FOR THIS SHOW
            </Link>
          </div>
        </div>
      </section>

      {/* 4. "CHOOSE YOUR PLACE IN THE ROOM" / "JOIN GGL." (EXACT SCREENSHOT LAYOUT) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 font-barlow text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
            CHOOSE YOUR PLACE IN THE ROOM
          </div>
          <h2 className="font-bebas text-6xl sm:text-8xl lg:text-9xl text-white tracking-tight uppercase leading-[0.88]">
            JOIN <span className="text-[#FF9F1C]">GGL.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Stage par perform karein, audience se result shape karein, brand partner banein ya show ke peeche ki team join karein!
          </p>
        </div>

        {/* 4 Role Cards in Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: PARTICIPANT */}
          <Link
            href="/apply/performer"
            className="group p-6 sm:p-7 rounded-2xl bg-black/50 border border-white/10 hover:border-amber-500/50 hover:bg-black/70 transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <Mic2 className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-barlow text-xs font-bold uppercase tracking-[0.2em] text-slate-400 block">
                01 • PARTICIPANT
              </span>
              <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide leading-none group-hover:text-amber-400 transition-colors">
                SHOW US WHAT YOU'VE GOT.
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Sing, dance, perform comedy, play an instrument, do poetry, mimicry, acting, magic—or bring something nobody has seen before.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-barlow font-bold uppercase tracking-wider text-amber-400">
              <span>APPLY AS PERFORMER</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: AUDIENCE */}
          <a
            href="https://in.bookmyshow.com/events/gorakhpur-got-latent/ET00518139?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
            target="_blank"
            rel="noreferrer"
            className="group p-6 sm:p-7 rounded-2xl bg-black/50 border border-white/10 hover:border-amber-500/50 hover:bg-black/70 transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <Eye className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-barlow text-xs font-bold uppercase tracking-[0.2em] text-slate-400 block">
                02 • AUDIENCE
              </span>
              <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide leading-none group-hover:text-amber-400 transition-colors">
                DON'T JUST WATCH. JUDGE.
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Watch the performances, score the talent from your phone and become part of deciding what happens next.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-barlow font-bold uppercase tracking-wider text-amber-400">
              <span>BOOK TICKETS ↗</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* Card 3: SPONSOR */}
          <Link
            href="/apply/sponsor"
            className="group p-6 sm:p-7 rounded-2xl bg-black/50 border border-white/10 hover:border-amber-500/50 hover:bg-black/70 transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <Handshake className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-barlow text-xs font-bold uppercase tracking-[0.2em] text-slate-400 block">
                03 • SPONSOR
              </span>
              <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide leading-none group-hover:text-amber-400 transition-colors">
                PUT YOUR BRAND HERE.
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Partner with GGL through cash, venue, gifts, food, media or promotional support.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-barlow font-bold uppercase tracking-wider text-amber-400">
              <span>EXPLORE SPONSORSHIP</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: TEAM */}
          <Link
            href="/apply/join-team"
            className="group p-6 sm:p-7 rounded-2xl bg-black/50 border border-white/10 hover:border-amber-500/50 hover:bg-black/70 transition-all flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <Users className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-barlow text-xs font-bold uppercase tracking-[0.2em] text-slate-400 block">
                04 • TEAM
              </span>
              <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide leading-none group-hover:text-amber-400 transition-colors">
                BUILD THE SHOW WITH US.
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Join production, camera, editing, social media management, crowd handling, or technology support.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-barlow font-bold uppercase tracking-wider text-amber-400">
              <span>JOIN CREW</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 5. "PARTNER SPACES" / "YOUR BRAND CAN OWN THIS MOMENT." (EXACT SCREENSHOT LAYOUT) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-14">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 font-barlow text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
              PARTNER SPACES
            </div>
            <h2 className="font-bebas text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight uppercase leading-[0.9]">
              YOUR BRAND CAN <span className="text-[#FF9F1C]">OWN THIS MOMENT.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Be seen on the website, venue screen, show creatives and selected GGL content.
            </p>
          </div>

          <Link
            href="/apply/sponsor"
            className="px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-barlow font-bold uppercase tracking-wider text-sm flex items-center gap-2 whitespace-nowrap shadow-lg shadow-amber-500/20"
          >
            EXPLORE SPONSORSHIPS <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Partner Tier Open Spaces */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { tag: '01 • OPEN SPACE', role: 'TITLE SPONSOR' },
            { tag: '02 • OPEN SPACE', role: 'VENUE PARTNER' },
            { tag: '03 • OPEN SPACE', role: 'POWERED-BY PARTNER' },
            { tag: '04 • OPEN SPACE', role: 'GIFT PARTNER' },
          ].map((item) => (
            <div
              key={item.role}
              className="p-8 rounded-2xl bg-black/40 border border-amber-500/20 hover:border-amber-400/60 transition-all flex flex-col justify-between h-56 space-y-4"
            >
              <span className="font-barlow text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                {item.tag}
              </span>
              <div>
                <h4 className="font-bebas text-4xl text-[#FF9F1C] tracking-wide leading-none">
                  YOUR BRAND
                </h4>
                <p className="font-barlow text-xs font-bold uppercase tracking-widest text-slate-300 mt-2">
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. EXCLUSIVE SHOW PASSES (TICKETS) */}
      {categories.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
          <div className="space-y-4 mb-12 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 font-barlow text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
              <Ticket className="w-4 h-4" /> EXCLUSIVE SHOW PASSES
            </div>
            <h2 className="font-bebas text-5xl sm:text-7xl text-white tracking-tight uppercase leading-[0.9]">
              SELECT YOUR <span className="text-[#FF9F1C]">SHOW EXPERIENCE</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat: any) => (
              <div key={cat.id} className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/30 flex flex-col justify-between space-y-6 hover:border-amber-400 transition-all group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-barlow text-xs font-bold text-amber-400 uppercase tracking-widest">{cat.name} PASS</span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">SELLING FAST</span>
                  </div>
                  <div className="font-bebas text-4xl sm:text-5xl text-white">{formatINR(cat.price)}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{cat.description}</p>
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
                    className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-barlow font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all"
                  >
                    <Ticket className="w-4 h-4" />
                    BOOK ON BOOKMYSHOW ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. FEATURED APPROVED PERFORMERS */}
      {performers.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 font-barlow text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-amber-400 mb-2">
                <Music className="w-4 h-4" /> STAGE SPOTLIGHT
              </div>
              <h2 className="font-bebas text-5xl sm:text-6xl text-white tracking-tight uppercase">
                FEATURED APPROVED <span className="text-[#FF9F1C]">PERFORMERS</span>
              </h2>
            </div>
            <Link href="/performers" className="font-barlow text-sm font-bold uppercase tracking-wider text-amber-400 hover:underline flex items-center gap-1">
              VIEW ALL PERFORMERS <ChevronRight className="w-4 h-4" />
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

      {/* 8. FAQ ACCORDION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/10">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 font-barlow text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
            <HelpCircle className="w-4 h-4" /> FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="font-bebas text-5xl sm:text-6xl text-white tracking-tight uppercase">
            GOT QUESTIONS? <span className="text-[#FF9F1C]">WE HAVE ANSWERS.</span>
          </h2>
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
