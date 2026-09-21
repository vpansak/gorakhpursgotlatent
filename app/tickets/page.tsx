import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import { formatINR } from '@/lib/helpers';
import { Ticket, Calendar, MapPin, Clock, ShieldCheck, CheckCircle, Sparkles } from 'lucide-react';

async function getTicketsPageData() {
  try {
    const event = db.prepare("SELECT * FROM events WHERE status = 'PUBLISHED' ORDER BY event_date ASC LIMIT 1").get() as any;

    let categories: any[] = [];
    if (event) {
      categories = db.prepare("SELECT * FROM ticket_categories WHERE event_id = ? AND status = 'ACTIVE' ORDER BY sort_order ASC").all(event.id);
    }

    return { event, categories };
  } catch (err) {
    return { event: null, categories: [] };
  }
}

export default async function TicketsPage() {
  const { event, categories } = await getTicketsPageData();

  if (!event) {
    return (
      <div className="py-20 px-4 max-w-xl mx-auto text-center space-y-4">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
          <h2 className="text-xl font-bold">SALES CLOSED / COMING SOON</h2>
          <p className="text-xs mt-1 text-slate-300">No active ticket sales currently open. Check back soon for Season 1 tickets!</p>
        </div>
      </div>
    );
  }

  const BOOKMYSHOW_URL = "https://in.bookmyshow.com/events/gorakhpur-got-latent/ET00518139?utm_source=ig&utm_medium=social&utm_content=link_in_bio";

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* BookMyShow Banner Callout */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-[0_0_40px_rgba(225,29,72,0.4)] flex flex-col md:flex-row items-center justify-between gap-6 border border-white/20">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-black/40 text-amber-300 text-xs font-black uppercase tracking-wider">
            OFFICIAL TICKETING PARTNER
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">Tickets Now Live on BookMyShow!</h2>
          <p className="text-sm text-white/90">
            Book your official Gorakhpur’s Got Latent show passes directly on BookMyShow.
          </p>
        </div>
        <a
          href={BOOKMYSHOW_URL}
          target="_blank"
          rel="noreferrer"
          className="px-8 py-4 rounded-2xl bg-white text-rose-600 hover:bg-slate-100 font-extrabold text-base flex items-center gap-2 shrink-0 shadow-2xl hover:scale-105 transition-all"
        >
          <Ticket className="w-5 h-5 text-rose-600" />
          BOOK ON BOOKMYSHOW ↗
        </a>
      </div>

      {/* Event Header Banner */}
      <div className="relative rounded-3xl glass-card p-6 sm:p-10 overflow-hidden border border-amber-500/30 space-y-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" /> OFFICIAL TICKET PORTAL
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white">{event.title}</h1>
            <p className="text-sm sm:text-base text-amber-200/90 font-medium">{event.subtitle}</p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-slate-300 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{new Date(event.event_date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{event.start_time} IST Onwards</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>{event.venue_name}, {event.city}</span>
              </div>
            </div>
          </div>

          <div className="relative w-48 sm:w-64 h-28 sm:h-36 shrink-0">
            <Image src="/logo.png" alt="Gorakhpur's Got Latent Logo" fill className="object-contain filter drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]" />
          </div>
        </div>
      </div>

      {/* Ticket Categories Tiers */}
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-white text-center">
          Choose Your <span className="gold-gradient-text">Ticket Category</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat: any) => {
            const isSoldOut = cat.available_qty <= 0;
            return (
              <div
                key={cat.id}
                className={`relative rounded-3xl glass-card p-6 sm:p-8 flex flex-col justify-between space-y-6 border transition-all duration-300 ${
                  isSoldOut ? 'opacity-60 border-slate-800' : 'border-amber-500/30 hover:border-amber-400 hover:scale-[1.02]'
                }`}
              >
                {cat.name.includes('VVIP') && !isSoldOut && (
                  <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] font-black uppercase tracking-widest shadow-lg">
                    BEST EXPERIENCE
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">TIER PASS</span>
                    {isSoldOut && <span className="px-2.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">SOLD OUT</span>}
                  </div>

                  <h3 className="text-2xl font-black text-white">{cat.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed min-h-[40px]">{cat.description}</p>

                  <div className="pt-2">
                    <span className="text-4xl font-black text-amber-400">{formatINR(cat.price)}</span>
                    <span className="text-xs text-slate-400 ml-1">/ ticket</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> BookMyShow Instant E-Ticket Confirmation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> Verified QR Gate Scanner Entry
                    </li>
                  </ul>

                  {isSoldOut ? (
                    <button disabled className="w-full py-3.5 rounded-xl bg-slate-800 text-slate-500 font-bold text-sm">
                      SOLD OUT
                    </button>
                  ) : (
                    <a
                      href={BOOKMYSHOW_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-105 transition-all"
                    >
                      <Ticket className="w-4 h-4 text-white" />
                      BOOK ON BOOKMYSHOW ↗
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terms & Guidelines */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 max-w-4xl mx-auto">
        <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" /> Event Ticket Terms & Conditions
        </h4>
        <pre className="text-xs text-slate-300 font-sans whitespace-pre-line leading-relaxed">
          {event.terms}
        </pre>
      </div>
    </div>
  );
}
