'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Download, Smartphone, Apple, CheckCircle2, Share2, PlusSquare,
  Sparkles, ShieldCheck, Ticket, Mic2, Bell, Zap, ChevronRight, Home
} from 'lucide-react';

export default function AppDownloadPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'desktop'>('desktop');

  useEffect(() => {
    // Detect OS / Device
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(userAgent)) {
      setDeviceType('android');
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setDeviceType('ios');
    } else {
      setDeviceType('desktop');
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Listen for PWA install prompt (Chrome / Android / Edge)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        "📱 To install the app:\n\n1. Tap the 3 dots menu (⋮) at top right of Chrome.\n2. Tap 'Install app' or 'Add to Home screen'."
      );
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 min-h-[85vh] flex flex-col justify-center">
      {/* 1. APP HEADER & LOGO SPOTLIGHT */}
      <div className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,215,0,0.2)]">
          <Sparkles className="w-4 h-4 text-amber-400" /> OFFICIAL GORAKHPUR’S GOT LATENT MOBILE APP
        </div>

        {/* Uploaded Golden App Logo Badge */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_45px_rgba(255,215,0,0.35)] group">
          <Image
            src="/app-logo.png"
            alt="Gorakhpur's Got Latent Official Mobile App Logo"
            fill
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-0 right-0 text-[10px] font-black text-amber-300 uppercase tracking-widest">
            OFFICIAL APP
          </div>
        </div>

        <div className="space-y-2 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Install Gorakhpur’s Got Latent App
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Get instant access to live show tickets, audition registrations, audience voting, and push notifications directly on your phone!
          </p>
        </div>
      </div>

      {/* 2. DEVICE DETECTED DOWNLOAD & INSTALL SECTION */}
      {isInstalled ? (
        <div className="p-8 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/40 text-center space-y-3 shadow-xl">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-2xl font-black text-white">App Successfully Installed!</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Gorakhpur's Got Latent App is ready on your home screen. Open it anytime for instant access.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ANDROID DOWNLOAD / INSTALL CARD */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border transition-all space-y-5 flex flex-col justify-between ${
              deviceType === 'android'
                ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900 to-emerald-950/30 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/30">
                  <Smartphone className="w-4 h-4 text-emerald-400" /> ANDROID
                </span>
                {deviceType === 'android' && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    YOUR DEVICE DETECTED
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-black text-white">Install on Android Phone</h3>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                  <span>Tap <strong>"INSTALL ANDROID APP"</strong> button below or open Chrome.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                  <span>Tap 3 dots menu <strong className="text-white">⋮</strong> at top right of browser.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                  <span>Select <strong className="text-emerald-300">&quot;Install app&quot;</strong> or <strong className="text-emerald-300">&quot;Add to Home screen&quot;</strong>.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleInstallClick}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer mt-4"
            >
              <Download className="w-5 h-5" />
              <span>INSTALL ANDROID APP</span>
            </button>
          </div>

          {/* IPHONE / IOS DOWNLOAD & INSTALL CARD */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border transition-all space-y-5 flex flex-col justify-between ${
              deviceType === 'ios'
                ? 'bg-gradient-to-b from-blue-950/40 via-slate-900 to-blue-950/30 border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.2)]'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-blue-500/30">
                  <Apple className="w-4 h-4 text-blue-400" /> IPHONE (IOS)
                </span>
                {deviceType === 'ios' && (
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                    YOUR DEVICE DETECTED
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-black text-white">Install on iPhone</h3>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                  <span>Open this website in <strong className="text-white">Safari Browser</strong> on your iPhone.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                  <span>Tap the <strong className="text-blue-300">Share Icon [↑]</strong> at bottom of Safari.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                  <span>Scroll down & tap <strong className="text-blue-300">&quot;Add to Home Screen [+]&quot;</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">4</span>
                  <span>Tap <strong className="text-emerald-400">&quot;Add&quot;</strong> — App will appear on your iPhone screen!</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => alert("📱 iPhone Install Instructions:\n\n1. Open Safari on iPhone.\n2. Tap Share icon [↑] at bottom.\n3. Tap 'Add to Home Screen'." )}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer mt-4"
            >
              <Apple className="w-5 h-5" />
              <span>INSTALL IPHONE APP</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. KEY APP FEATURES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-amber-500/20 space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-xl font-black text-white">Why Install the Mobile App?</h3>
          <p className="text-xs text-slate-400">Experience Purvanchal’s #1 talent hunt show directly from your phone screen.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <Ticket className="w-6 h-6 text-amber-400" />
            <h4 className="font-bold text-white text-sm">1-Click Ticket Booking</h4>
            <p className="text-slate-400">Instant access to digital QR tickets without downloading PDFs.</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <Mic2 className="w-6 h-6 text-amber-400" />
            <h4 className="font-bold text-white text-sm">Audition Status</h4>
            <p className="text-slate-400">Track your performer registration & audition slots in real-time.</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <Zap className="w-6 h-6 text-amber-400" />
            <h4 className="font-bold text-white text-sm">Live Audience Voting</h4>
            <p className="text-slate-400">Vote for your favorite performers live during show episodes.</p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <Bell className="w-6 h-6 text-amber-400" />
            <h4 className="font-bold text-white text-sm">Episode Notifications</h4>
            <p className="text-slate-400">Get notified instantly when new episodes and tickets launch.</p>
          </div>
        </div>

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 underline"
          >
            <Home className="w-4 h-4" /> Return to Website Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
