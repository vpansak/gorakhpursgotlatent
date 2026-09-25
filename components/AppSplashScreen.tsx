'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export default function AppSplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Play splash screen animation on app open
    const timer1 = setTimeout(() => {
      setIsFadingOut(true);
    }, 2000); // Start fade-out at 2s

    const timer2 = setTimeout(() => {
      setIsVisible(false);
    }, 2500); // Complete removal at 2.5s

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#07080e] flex flex-col items-center justify-center transition-all duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient background red spotlight glow */}
      <div className="absolute w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute w-72 h-72 bg-amber-500/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Red Stage Curtain Circle Container */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Glowing Red Stage Curtain Circle */}
        <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-red-600 to-amber-400 shadow-[0_0_60px_rgba(220,38,38,0.6)] animate-pulse-glow">
          <div className="w-full h-full rounded-full bg-[#3b0707] relative overflow-hidden flex items-center justify-center border-2 border-amber-500/40 shadow-inner">
            {/* Red Stage Curtain Fabric Texture Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-600/40 via-red-950/90 to-black pointer-events-none" />

            {/* Stage Curtain Folds Visual Lines */}
            <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(0,0,0,0.5)_15px,transparent_20px)] pointer-events-none" />

            {/* Spotlight Beam */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-amber-300/20 via-transparent to-transparent pointer-events-none" />

            {/* Mascot Golden Logo with Zoom & Bounce Animation */}
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 animate-bounce duration-1000 filter drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]">
              <Image
                src="/ggl-logo.png"
                alt="Gorakhpur's Got Latent Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Title Brand & Loading Status */}
        <div className="text-center space-y-2 relative z-10 animate-fade-in">
          <h2 className="font-bebas text-3xl sm:text-4xl text-amber-300 tracking-wider uppercase font-bold gold-gradient-text drop-shadow-[0_2px_10px_rgba(255,215,0,0.4)]">
            Gorakhpur’s Got Latent
          </h2>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-barlow uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>KUCH BHI HO SAKTA HAI</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Line at Bottom */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-500 via-red-500 to-amber-400 rounded-full animate-[shimmer_1.8s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
