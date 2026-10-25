"use client";

import { useEffect, useState } from "react";
import { Sparkles, Zap, Heart, Radio, ArrowUpRight, Flame, Star } from "lucide-react";

const CHANNEL_URL = "https://www.youtube.com/@gkpgotlatent";
const ANDROID_INTENT = "intent://www.youtube.com/@gkpgotlatent#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=https%3A%2F%2Fwww.youtube.com%2F%40gkpgotlatent;end";
const messages = [
  { title: "GORAKHPUR, YE WALA TALENT DEKHO! 🔥", subtitle: "Apne shehar ke creators ko milta hai apna stage.", icon: Flame },
  { title: "HANSI BHI. TALENT BHI. FULL VIBE! ⚡", subtitle: "Comedy, performances aur reactions — sab ek jagah.", icon: Zap },
  { title: "APNE SHEHAR KO SUPPORT KARO ❤️", subtitle: "Har view aur subscribe se local talent ko boost milta hai.", icon: Heart },
  { title: "GGL KI DUNIYA MEIN SWAGAT HAI ✨", subtitle: "Naye videos aur unforgettable moments ke liye ready raho.", icon: Star },
  { title: "CHALO, AB FULL ENTERTAINMENT! 🚀", subtitle: "Official channel khul raha hai… milte hain wahan!", icon: ArrowUpRight },
];

export default function YouTubeRedirectPage() {
  const [seconds, setSeconds] = useState(5);
  const [messageIndex, setMessageIndex] = useState(0);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      setSeconds(Math.max(0, 5 - elapsed));
      setMessageIndex(Math.min(messages.length - 1, elapsed));
      if (elapsed >= 5) {
        window.clearInterval(interval);
        setRedirecting(true);
        const isAndroid = /Android/i.test(navigator.userAgent);
        if (isAndroid) {
          window.location.href = ANDROID_INTENT;
          window.setTimeout(() => {
            if (!document.hidden) window.location.href = CHANNEL_URL;
          }, 1300);
        } else {
          window.location.href = CHANNEL_URL;
        }
      }
    }, 120);
    return () => window.clearInterval(interval);
  }, []);

  const CurrentIcon = messages[messageIndex].icon;

  const openYouTube = () => {
    if (/Android/i.test(navigator.userAgent)) {
      window.location.href = ANDROID_INTENT;
      window.setTimeout(() => {
        if (!document.hidden) window.location.href = CHANNEL_URL;
      }, 900);
    } else {
      window.location.href = CHANNEL_URL;
    }
  };

  return (
    <main className="yt-standalone relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#08060b] px-5 py-5 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="yt-orb yt-orb-one absolute -left-28 -top-20 h-80 w-80 rounded-full bg-red-600/25 blur-[95px]" />
        <div className="yt-orb yt-orb-two absolute -right-28 top-[28%] h-72 w-72 rounded-full bg-orange-500/20 blur-[100px]" />
        <div className="yt-orb yt-orb-three absolute -bottom-32 left-[18%] h-80 w-80 rounded-full bg-amber-400/15 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.10]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="yt-scan absolute inset-x-0 top-0 h-1/2 opacity-20" />
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} className="yt-particle absolute rounded-full bg-amber-300" style={{ left: ((i * 37 + 7) % 96) + "%", top: ((i * 23 + 9) % 94) + "%", width: i % 3 === 0 ? 4 : 2, height: i % 3 === 0 ? 4 : 2, animationDelay: (i % 7) * -0.7 + "s", animationDuration: 3 + (i % 4) + "s" }} />
        ))}
      </div>

      <section className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center text-center">
        <div className="yt-enter mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-white/[0.055] px-4 py-2 text-[10px] font-black uppercase tracking-[.24em] text-amber-100 shadow-[0_0_30px_rgba(251,146,60,.10)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
          </span>
          Gorakhpur ki awaaz
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
        </div>

        <p className="yt-enter text-xs font-extrabold uppercase tracking-[.28em] text-slate-300" style={{ animationDelay: ".08s" }}>Ek tap. Full entertainment.</p>
        <h1 className="yt-title mt-3 text-[2.65rem] font-black leading-[.98] tracking-[-.055em] sm:text-5xl">
          GORAKHPUR’S
          <span className="mt-2 block bg-gradient-to-r from-yellow-200 via-orange-400 to-red-500 bg-clip-text pb-1 text-transparent">GOT LATENT</span>
        </h1>
        <p className="yt-enter mt-4 max-w-xs text-sm font-medium leading-relaxed text-slate-300" style={{ animationDelay: ".2s" }}>
          Talent asli. Reactions asli. <span className="font-bold text-white">Apne shehar ka scene hi alag hai!</span>
        </p>

        <div className="yt-card relative mt-7 w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#171014]/85 p-5 shadow-[0_18px_80px_rgba(0,0,0,.5)] backdrop-blur-2xl sm:p-6">
          <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-red-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative mx-auto mb-5 flex h-[5.4rem] w-[5.4rem] items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100" aria-label={`Redirecting in ${seconds} seconds`}>
              <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="5" />
              <circle cx="50" cy="50" r="43" fill="none" stroke="url(#ytRing)" strokeWidth="5" strokeLinecap="round" strokeDasharray="270.2" strokeDashoffset={270.2 * (seconds / 5)} className="transition-all duration-300" />
              <defs><linearGradient id="ytRing"><stop offset="0%" stopColor="#facc15" /><stop offset="100%" stopColor="#ef4444" /></linearGradient></defs>
            </svg>
            <div className="flex flex-col items-center">
              <span className="yt-number text-4xl font-black tabular-nums">{seconds}</span>
              <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[.2em] text-slate-400">Seconds</span>
            </div>
          </div>

          <div key={messageIndex} className="yt-message relative min-h-[112px]">
            <div className="mb-3 flex justify-center"><CurrentIcon className="h-6 w-6 text-amber-300" /></div>
            <h2 className="text-lg font-black leading-snug sm:text-xl">{messages[messageIndex].title}</h2>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-300">{messages[messageIndex].subtitle}</p>
          </div>

          <div className="relative mt-4 flex justify-center gap-1.5" aria-label="Countdown progress">
            {messages.map((message, index) => <span key={message.title} className={`h-1.5 rounded-full transition-all duration-500 ${index <= messageIndex ? "w-7 bg-gradient-to-r from-amber-300 to-red-500 shadow-[0_0_10px_rgba(248,113,113,.4)]" : "w-2 bg-white/20"}`} />)}
          </div>
        </div>

        <div className="yt-enter mt-5 flex items-center gap-2 text-xs font-semibold text-slate-400" style={{ animationDelay: ".25s" }}>
          <Radio className="h-4 w-4 animate-pulse text-red-400" />
          {redirecting ? "Channel khul raha hai…" : "Official channel par le ja rahe hain…"}
        </div>

        <button onClick={openYouTube} className="yt-button group relative mt-4 flex min-h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 px-5 py-4 text-sm font-black uppercase tracking-[.09em] text-[#17070a] shadow-[0_10px_35px_rgba(239,68,68,.24)] transition duration-300 hover:scale-[1.02] active:scale-[.98]">
          <span className="yt-button-shine absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-white/30 blur-sm" />
          <Flame className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
          Open channel now
          <ArrowUpRight className="h-5 w-5" />
        </button>

        <p className="yt-enter mt-4 max-w-xs text-[10px] leading-relaxed text-slate-500" style={{ animationDelay: ".35s" }}>
          Auto redirect na ho, toh button tap karo. Milte hain GGL family! ❤️
        </p>
      </section>

      <style jsx global>{`
        body:has(.yt-standalone) { background: #08060b !important; }
        @keyframes ytFadeUp { 0% { opacity: 0; transform: translateY(18px) scale(.985); filter: blur(4px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
        @keyframes ytTitle { 0% { opacity: 0; transform: scale(.88); letter-spacing: -.09em; } 70% { transform: scale(1.025); } 100% { opacity: 1; transform: scale(1); letter-spacing: -.055em; } }
        @keyframes ytFloat { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(12px,-18px,0) scale(1.08); } }
        @keyframes ytParticle { 0%,100% { transform: translateY(0) scale(.65); opacity: .2; } 50% { transform: translateY(-22px) scale(1.4); opacity: .9; } }
        @keyframes ytRingPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(248,113,113,.0); } 50% { box-shadow: 0 0 30px 2px rgba(248,113,113,.12); } }
        @keyframes ytShine { 0% { left: -50%; } 100% { left: 130%; } }
        .yt-enter { animation: ytFadeUp .65s cubic-bezier(.2,.8,.2,1) both; }
        .yt-title { animation: ytTitle .8s cubic-bezier(.2,.8,.2,1) both; text-shadow: 0 0 36px rgba(239,68,68,.12); }
        .yt-orb-one { animation: ytFloat 8s ease-in-out infinite; }
        .yt-orb-two { animation: ytFloat 10s ease-in-out infinite reverse; }
        .yt-orb-three { animation: ytFloat 9s ease-in-out infinite; }
        .yt-particle { animation: ytParticle 4s ease-in-out infinite; }
        .yt-card { animation: ytRingPulse 3s ease-in-out infinite; }
        .yt-message { animation: ytFadeUp .45s cubic-bezier(.2,.8,.2,1) both; }
        .yt-number { text-shadow: 0 0 24px rgba(251,146,60,.25); }
        .yt-button-shine { animation: ytShine 3.5s ease-in-out infinite; }
        .yt-scan { background: linear-gradient(180deg, transparent, rgba(248,113,113,.06), transparent); animation: ytFloat 8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .yt-enter,.yt-title,.yt-orb-one,.yt-orb-two,.yt-orb-three,.yt-particle,.yt-card,.yt-message,.yt-button-shine,.yt-scan { animation: none !important; } }
      `}</style>
    </main>
  );
}
