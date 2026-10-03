import Image from 'next/image';
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import { db } from '@/lib/db';
import {
  Ticket, Sparkles, UserCheck, CheckCircle2, ShieldCheck, ChevronRight,
  Music, HelpCircle, Zap, Flame, Disc
} from 'lucide-react';

function YouTubeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505-7.505-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
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
  const { activeEvent, performers } = await getHomepageData();

  const faqs = [
    { q: "What is Gorakhpur's Got Latent?", a: "Gorakhpur's Got Latent is Purvanchal's flagship live talent hunt show and entertainment phenomenon. It showcases musicians, beatboxers, stand-up comedians, dancers, magicians, and raw unique performers live on stage." },
    { q: "How can I apply as a performer for Episode 2?", a: "Episode 2 audition registrations are now LIVE. Auditions are FREE to submit. Fill your details and send your performance clip on WhatsApp." },
    { q: "How do I receive my ticket after payment?", a: "As soon as your payment is verified via Razorpay, your official Digital E-Ticket with a unique QR code is generated instantly." },
    { q: "Can my brand sponsor the show?", a: "Yes! Go to Apply Now → Brand Sponsor and submit your company details, budget estimate, and brand deck." },
    { q: "What is the refund policy for tickets?", a: "Tickets are non-refundable unless the event is officially cancelled by the organizers. Duplicate payments are automatically reconciled." }
  ];

  return (
    <div className="home-dark relative overflow-hidden">
      {/* PREMIUM HERO */}
      <section className="home-hero relative min-h-[82vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="home-spot home-spot-left" />
          <div className="home-spot home-spot-right" />
          <div className="home-grid" />
          <div className="home-vignette" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-black/35 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300 backdrop-blur-xl shadow-[0_0_35px_rgba(245,158,11,.10)]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)] animate-pulse" />
            EPISODE 2 • AUDITIONS LIVE
          </div>

          <div className="relative mx-auto -mt-5 h-48 w-[310px] sm:h-64 sm:w-[570px] md:h-80 md:w-[760px] lg:h-[360px] lg:w-[900px]">
            <div className="home-logo-aura" />
            <Image
              src="/logo.png"
              alt="Gorakhpur's Got Latent Official Title Logo"
              fill
              priority
              className="object-contain drop-shadow-[0_18px_55px_rgba(0,0,0,.8)]"
            />
          </div>

          <div className="mx-auto -mt-2 max-w-3xl">
            <p className="font-bebas text-3xl sm:text-5xl md:text-6xl uppercase tracking-[0.13em] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,.8)]">
              KUCH BHI HO SAKTA HAI
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base font-semibold leading-relaxed text-slate-300">
              Purvanchal ka raw talent, live roasts, music, comedy aur unforgettable stage moments.
            </p>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/book-ticket" className="home-primary-btn">
              <Ticket className="h-5 w-5" />
              BOOK YOUR TICKET
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/apply/performer" className="home-secondary-btn">
              <UserCheck className="h-5 w-5 text-amber-400" />
              APPLY FOR EPISODE 2
            </Link>
          </div>

          <div className="mx-auto mt-9 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:p-5 text-left backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,.45)]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-500">
                  <YouTubeIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-400">Official YouTube Channel</p>
                  <h3 className="mt-1 text-sm sm:text-base font-extrabold text-white">Gorakhpur's Got Latent</h3>
                </div>
              </div>
              <a href="https://www.youtube.com/@GkpGotLatent" target="_blank" rel="noreferrer" className="w-full sm:w-auto rounded-xl bg-red-600 px-5 py-3 text-center text-xs font-black uppercase tracking-wider text-white transition hover:bg-red-500 hover:scale-[1.03]">
                SUBSCRIBE NOW ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* EVENT COUNTDOWN */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-5 relative z-20">
        <CountdownTimer
          targetDate={activeEvent?.event_date ? `${activeEvent.event_date}T${activeEvent.start_time}` : "2026-09-26T13:00:00"}
          venue={activeEvent?.venue_name || "Announce Soon"}
          city={activeEvent?.city || "Gorakhpur"}
        />
      </section>

      {/* SHOW INTRO */}
      <section className="home-section py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <div className="home-kicker"><Sparkles className="h-4 w-4" /> THE SHOW</div>
            <h2 className="home-title mt-4">RAW TALENT.<br /><span>REAL REACTIONS.</span><br />ONE BIG STAGE.</h2>
            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-300 font-medium">
              Gorakhpur’s Got Latent brings singers, dancers, comedians, beatboxers, creators and unique performers together for a live entertainment experience built around talent and unpredictability.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 max-w-lg">
              <div className="home-stat"><strong>100+</strong><span>SHORTLISTED PERFORMERS</span></div>
              <div className="home-stat"><strong>₹149</strong><span>LIVE SHOW ENTRY</span></div>
            </div>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-glow" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#08080b]">
              <div className="relative h-64 sm:h-80">
                <Image src="/logo.png" alt="Gorakhpur's Got Latent Stage" fill className="object-contain p-8" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between rounded-xl border border-white/10 bg-black/65 px-4 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  <span className="text-amber-300">LIVE STAGE</span>
                  <span className="text-emerald-400">READY</span>
                </div>
              </div>
            </div>
            <h3 className="relative mt-5 font-bebas text-3xl uppercase text-white">Purvanchal’s Biggest Stage Is Ready</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-slate-400">Book your digital ticket and experience the show live from the audience arena.</p>
          </div>
        </div>
      </section>

      {/* TICKET */}
      <section className="home-section px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-9">
            <div className="home-kicker justify-center"><Ticket className="h-4 w-4" /> OFFICIAL SHOW PASS</div>
            <h2 className="home-title mt-3">YOUR SEAT.<br /><span>YOUR NIGHT.</span></h2>
          </div>

          <div className="home-ticket">
            <div className="home-ticket-main">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-black uppercase tracking-[0.15em] text-amber-400 flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Official Entry Pass</span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">⚡ Selling Fast</span>
              </div>
              <h3 className="mt-5 font-bebas text-4xl sm:text-6xl uppercase tracking-wide text-white">GGL TICKETING — <span>₹149</span></h3>
              <p className="mt-3 flex items-center gap-2 text-sm font-bold text-emerald-400"><CheckCircle2 className="h-4 w-4" /> Instant Digital QR Pass after verified payment</p>
              <p className="mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300 font-medium">Access the live audience arena, front stage seating, live performances and interactive show experience. Your unique Ticket ID and QR code are used for entry verification.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  [Sparkles, 'Front Stage Seating'],
                  [UserCheck, 'Audience Arena Access'],
                  [Ticket, 'Instant E-Ticket']
                ].map(([Icon, label]: any) => (
                  <span key={label} className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-amber-400" /> {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="home-ticket-cta">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Price Per Ticket</span>
              <strong>₹149</strong>
              <span className="text-xs text-slate-500">per person</span>
              <Link href="/book-ticket" className="home-primary-btn w-full"> <Ticket className="h-5 w-5" /> BOOK TICKET NOW </Link>
              <p className="text-[10px] text-slate-500 font-semibold">Razorpay • Instant E-Ticket • QR Verification</p>
            </div>
          </div>
        </div>
      </section>

      {/* PERFORMERS */}
      {performers.length > 0 && (
        <section className="home-section py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
              <div>
                <div className="home-kicker"><Music className="h-4 w-4" /> Stage Spotlight</div>
                <h2 className="home-title mt-3">FEATURED <span>PERFORMERS</span></h2>
              </div>
              <Link href="/performers" className="text-sm font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300">View All Performers →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {performers.map((p: any) => (
                <div key={p.app_id} className="home-performer">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full border border-amber-400/30 bg-amber-400/10 flex items-center justify-center text-lg font-black text-amber-300">{p.full_name[0]}</div>
                    <div>
                      <h4 className="font-extrabold text-white">{p.full_name}</h4>
                      <p className="text-xs font-bold text-amber-400">{p.talent_category} • {p.city}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-400">{p.short_bio || p.performance_desc}</p>
                  <div className="mt-4 border-t border-white/10 pt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex justify-between">
                    <span>Talent: {p.primary_talent}</span><span className="text-emerald-400">Approved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* APPLY */}
      <section className="home-section py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="home-kicker justify-center"><UserCheck className="h-4 w-4" /> Application Workflow</div>
            <h2 className="home-title mt-3">GET ON THE <span>GGL STAGE</span></h2>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              ['01','Choose Category','Performer, Celebrity Guest, Brand Sponsor, or Event Host.'],
              ['02','Fill Details & Work','Submit talent profile, video links, press kit or brand deck.'],
              ['03','Send Your Clip','Send performance clip or portfolio on WhatsApp for review.'],
              ['04','Audition & Stage','Shortlisted candidates receive audition and stage details.']
            ].map(([step,title,desc]) => (
              <div key={step} className="home-step">
                <span>{step}</span><h4>{title}</h4><p>{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-9">
            <Link href="/apply" className="home-primary-btn">START APPLICATION <ChevronRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="home-section py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <div className="home-kicker justify-center"><HelpCircle className="h-4 w-4" /> Frequently Asked Questions</div>
            <h2 className="home-title mt-3">GOT QUESTIONS?<br /><span>WE HAVE ANSWERS.</span></h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="home-faq">
                <h4><span>Q.</span>{faq.q}</h4>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
