"use client";

import { useEffect, useState } from "react";
import { Youtube, Play, Sparkles, ExternalLink, Zap, Heart, Radio } from "lucide-react";

const CHANNEL_URL = "https://www.youtube.com/@gkpgotlatent";
const ANDROID_INTENT = "intent://www.youtube.com/@gkpgotlatent#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=https%3A%2F%2Fwww.youtube.com%2F%40gkpgotlatent;end";
const messages = [
  { title: "Gorakhpur, ready ho?", subtitle: "Talent ka asli stage aa gaya hai!", icon: Sparkles },
  { title: "Real talent. Real reactions.", subtitle: "Comedy • Performances • Unforgettable moments", icon: Zap },
  { title: "YouTube par milte hain!", subtitle: "Official GGL videos aur latest updates ke liye", icon: Youtube },
  { title: "Subscribe karna mat bhoolna ❤️", subtitle: "Aapka support, apne shehar ke talent ke naam!", icon: Heart },
  { title: "Almost there!", subtitle: "YouTube khul raha hai… bas ek second!", icon: Play },
];

export default function YouTubeRedirectPage() {
  const [seconds, setSeconds] = useState(5);
  const [messageIndex, setMessageIndex] = useState(0);
  const [manualOpen, setManualOpen] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      setSeconds(Math.max(0, 5 - elapsed));
      setMessageIndex(Math.min(4, elapsed));
      if (elapsed >= 5) {
        window.clearInterval(interval);
        // On Android, try opening the YouTube app instead of staying inside Instagram.
        const isAndroid = /Android/i.test(navigator.userAgent);
        if (isAndroid) {
          window.location.href = ANDROID_INTENT;
          window.setTimeout(() => {
            if (!document.hidden) window.location.href = CHANNEL_URL;
          }, 1400);
        } else {
          window.location.href = CHANNEL_URL;
        }
      }
    }, 150);
    return () => window.clearInterval(interval);
  }, []);

  const CurrentIcon = messages[messageIndex].icon;

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#07070b] px-5 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-170px] h-[390px] w-[390px] -translate-x-1/2 rounded-full bg-red-600/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-180px] left-[-100px] h-[320px] w-[320px] rounded-full bg-amber-500/15 blur-[90px]" />
        <div className="absolute right-[-100px] top-[35%] h-[250px] w-[250px] rounded-full bg-red-500/10 blur-[90px]" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "23px 23px" }} />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-md text-center">
        <div className="mb-7 flex justify-center">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-red-400/40 bg-gradient-to-br from-red-600/25 to-amber-500/10 shadow-[0_0_65px_rgba(239,68,68,.18)]">
            <div className="absolute inset-2 rounded-[1.5rem] border border-white/10 animate-pulse" />
            <Youtube className="h-14 w-14 text-red-500 drop-shadow-[0_0_18px_rgba(239,68,68,.65)]" />
            <span className="absolute -right-2 -top-2 flex h-8 w-8 animate-bounce items-center justify-center rounded-full bg-amber-400 text-black"><Sparkles className="h-4 w-4" /></span>
          </div>
        </div>

        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.22em] text-red-200">
          <Radio className="h-3.5 w-3.5 animate-pulse" /> Official GGL YouTube
        </p>
        <h1 className="text-3xl font-black leading-tight sm:text-4xl">GORAKHPUR’S<br /><span className="bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent">GOT LATENT</span></h1>
        <p className="mt-3 text-sm font-medium text-slate-400">Talent • Comedy • Entertainment • Live Moments</p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl">
          <div className="relative mx-auto mb-5 flex h-28 w-28 items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100" aria-label={`Redirecting in ${seconds} seconds`}>
              <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="5" />
              <circle cx="50" cy="50" r="43" fill="none" stroke="#f87171" strokeWidth="5" strokeLinecap="round" strokeDasharray="270.2" strokeDashoffset={270.2 * (seconds / 5)} className="transition-all duration-300" />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black tabular-nums">{seconds}</span>
              <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[.2em] text-slate-400">Seconds</span>
            </div>
          </div>

          <div key={messageIndex} className="min-h-[92px] animate-[fadeUp_.45s_ease-out]">
            <div className="mb-3 flex justify-center"><CurrentIcon className="h-6 w-6 text-amber-400" /></div>
            <h2 className="text-xl font-extrabold">{messages[messageIndex].title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{messages[messageIndex].subtitle}</p>
          </div>

          <div className="mt-5 flex justify-center gap-2" aria-label="Countdown progress">
            {messages.map((message, index) => <span key={message.title} className={`h-1.5 rounded-full transition-all duration-300 ${index <= messageIndex ? "w-7 bg-red-500" : "w-2 bg-white/20"}`} />)}
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-500">Aapko official YouTube channel par le ja rahe hain…</p>
        <a href={CHANNEL_URL} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-3.5 text-sm font-black uppercase tracking-wide shadow-lg shadow-red-900/30 transition hover:scale-[1.02]">
          <Play className="h-4 w-4 fill-current" /> Open YouTube Now <ExternalLink className="h-4 w-4" />
        </a>
        <p className="mt-4 text-[10px] leading-relaxed text-slate-600">Agar automatic redirect na ho, upar wale button par tap karein.</p>
      </section>
      <style jsx global>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </main>
  );
}
