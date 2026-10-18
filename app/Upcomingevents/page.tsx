'use client';

import { useEffect } from 'react';
import { CalendarDays, MapPin, Sparkles, ExternalLink } from 'lucide-react';

declare global {
  interface Window {
    EventWidget?: {
      init: (elementId: string, options: {
        cityName: string;
        category: string;
        coordinates: { latitude: number; longitude: number };
        radius: number;
        sort: number;
        showHeading: boolean;
      }) => void;
    };
  }
}

export default function UpcomingEventsPage() {
  useEffect(() => {
    let cancelled = false;
    const initWidget = () => {
      if (cancelled || !window.EventWidget) return;
      const target = document.getElementById('ae-city-events-widget');
      if (!target || target.dataset.initialized === 'true') return;
      target.dataset.initialized = 'true';
      window.EventWidget.init('ae-city-events-widget', {
        cityName: 'Gorakhpur',
        category: 'Comedy',
        coordinates: {
          latitude: 26.760555267333984,
          longitude: 83.3731689453125,
        },
        radius: 1,
        sort: 1,
        showHeading: true,
      });
    };

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-allevents-widget="true"]');
    if (window.EventWidget) {
      initWidget();
    } else if (existingScript) {
      existingScript.addEventListener('load', initWidget);
    } else {
      const script = document.createElement('script');
      script.src = 'https://allevents.in/scripts/ae_event_plugin_widget.js';
      script.async = true;
      script.dataset.alleventsWidget = 'true';
      script.onload = initWidget;
      script.onerror = () => {
        const status = document.getElementById('events-widget-status');
        if (status) status.textContent = 'Events could not be loaded right now. Please try again later.';
      };
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
      existingScript?.removeEventListener('load', initWidget);
    };
  }, []);

  return (
    <main className="min-h-[70vh] overflow-hidden bg-[#050506] text-white">
      <section className="relative border-b border-amber-400/15 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.14),transparent_55%),radial-gradient(ellipse_at_30%_50%,rgba(185,28,28,0.10),transparent_50%)] px-4 py-14 sm:px-6 sm:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/[0.07] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">
            <Sparkles className="h-4 w-4" /> Discover what&apos;s happening
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.05] sm:text-6xl">
            Upcoming Events <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-400 bg-clip-text text-transparent">in Gorakhpur</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
            Explore comedy shows and events around Gorakhpur. Find something to enjoy, discover local happenings, and keep your next outing on the calendar.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-white/75">
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"><MapPin className="h-4 w-4 text-amber-300" /> Gorakhpur, Uttar Pradesh</span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"><CalendarDays className="h-4 w-4 text-amber-300" /> Comedy & local events</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Explore listings</p>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">Events near you</h2>
            <p className="mt-2 text-sm leading-6 text-white/55">Event listings are supplied by AllEvents.in. Availability and details may change.</p>
          </div>
          <a href="https://allevents.in/gorakhpur" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-amber-300/30 px-4 py-3 text-sm font-bold text-amber-200 transition hover:bg-amber-300/10 sm:self-auto">
            Browse AllEvents.in <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="min-h-[360px] rounded-2xl border border-white/10 bg-[#0c0c10] p-3 shadow-[0_25px_80px_rgba(0,0,0,.35)] sm:p-5">
          <div id="ae-city-events-widget" className="min-h-[320px] w-full overflow-x-auto" />
          <p id="events-widget-status" className="mt-3 text-center text-xs text-white/40" aria-live="polite">
            Loading comedy events for Gorakhpur…
          </p>
        </div>
        <p className="mt-5 text-xs leading-5 text-white/40">
          This is a third-party event listing. Gorakhpur&apos;s Got Latent does not organize or verify every event shown here. Please confirm event details with the organizer before making plans.
        </p>
      </section>
    </main>
  );
}
