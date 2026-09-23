'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Mail, Phone, MapPin, Award } from 'lucide-react';

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function FacebookIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function BookMyShowIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.5 3h-15A2.5 2.5 0 0 0 2 5.5v3a1.5 1.5 0 0 0 0 3v3A2.5 2.5 0 0 0 4.5 17h15a2.5 2.5 0 0 0 2.5-2.5v-3a1.5 1.5 0 0 0 0-3v-3A2.5 2.5 0 0 0 19.5 3zM12 13.5l-2.06 1.08.39-2.3-1.67-1.63 2.3-.33L12 8.25l1.04 2.07 2.3.33-1.67 1.63.39 2.3L12 13.5z" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const isLiveRoute = pathname.startsWith('/display') || pathname.startsWith('/live') || pathname.startsWith('/judge') || pathname.startsWith('/vote') || pathname.startsWith('/malik/live');
  if (isLiveRoute) return null;

  return (
    <footer className="bg-[#05060a] border-t border-amber-500/20 text-slate-300 pt-16 pb-24 lg:pb-12 relative overflow-hidden">
      {/* Ambient background light glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Logo */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group -ml-2 sm:-ml-3">
              <div className="relative w-64 sm:w-72 h-20 sm:h-22 transition-transform group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Gorakhpur's Got Latent Official Logo"
                  fill
                  className="object-contain object-left filter drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]"
                />
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              Purvanchal’s premier raw talent hunt, entertainment showcase, and live roast event platform. Providing an epic national stage for music, comedy, dance, beatboxing, and extraordinary performers.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/gkp_got_latent/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-400 hover:text-black hover:bg-amber-400 transition-all shadow-[0_0_10px_rgba(255,215,0,0.2)]"
                aria-label="Instagram"
                title="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61593154024693"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-400 hover:text-black hover:bg-amber-400 transition-all shadow-[0_0_10px_rgba(255,215,0,0.2)]"
                aria-label="Facebook"
                title="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href="https://in.bookmyshow.com/events/gorakhpur-got-latent/ET00518139?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-red-500/40 flex items-center justify-center text-red-500 hover:text-white hover:bg-red-600 transition-all shadow-[0_0_12px_rgba(236,28,36,0.3)]"
                aria-label="BookMyShow Tickets"
                title="Book Tickets on BookMyShow"
              >
                <BookMyShowIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-base font-extrabold text-white uppercase tracking-wider gold-gradient-text">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-amber-400 transition-colors">Homepage</Link></li>
              <li><a href="https://in.bookmyshow.com/events/gorakhpur-got-latent/ET00518139?utm_source=ig&utm_medium=social&utm_content=link_in_bio" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors font-semibold text-amber-300 flex items-center gap-1">Book on BookMyShow ↗</a></li>
              <li><Link href="/performers" className="hover:text-amber-400 transition-colors">Approved Performers</Link></li>
              <li><Link href="/guests" className="hover:text-amber-400 transition-colors">Celebrity & Guest Panel</Link></li>
              <li><Link href="/sponsors" className="hover:text-amber-400 transition-colors">Brand Partners & Sponsors</Link></li>
              <li><Link href="/track" className="hover:text-amber-400 transition-colors">Track Application Status</Link></li>
            </ul>
          </div>

          {/* Col 3: Apply Hub */}
          <div className="space-y-3">
            <h4 className="text-base font-extrabold text-white uppercase tracking-wider gold-gradient-text">
              APPLY NOW
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/apply/performer" className="hover:text-amber-400 transition-colors">Performer Application</Link></li>
              <li><Link href="/apply/guest" className="hover:text-amber-400 transition-colors">Guest / Influencer Application</Link></li>
              <li><Link href="/apply/sponsor" className="hover:text-amber-400 transition-colors">Brand Sponsor Application</Link></li>
              <li><Link href="/apply/join-team" className="hover:text-amber-400 transition-colors">Join Team</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Legal */}
          <div className="space-y-3">
            <h4 className="text-base font-extrabold text-white uppercase tracking-wider gold-gradient-text">
              VENUE & HELP
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <span>Gorakhpur Club Ground, Civil Lines, Gorakhpur, UP 273001</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:help@gkpgotlatent.in" className="hover:text-amber-400">help@gkpgotlatent.in</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+918423858424" className="hover:text-amber-400">+91 8423858424</a>
              </li>
            </ul>
            <div className="pt-2 flex flex-col gap-1 text-xs text-slate-400">
              <Link href="/terms" className="hover:text-amber-400">Terms & Conditions</Link>
              <Link href="/privacy" className="hover:text-amber-400">Privacy Policy</Link>
              <Link href="/refund-policy" className="hover:text-amber-400">Ticket & Refund Policy</Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Gorakhpur’s Got Latent. All rights reserved. Registered Entertainment Brand.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-amber-400">
              <Award className="w-4 h-4" /> Secure Razorpay Verified Checkout
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
