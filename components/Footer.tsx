import Link from 'next/link';
import Image from 'next/image';
import { Globe, Video, Share2, ShieldCheck, Mail, Phone, MapPin, Award, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#05060a] border-t border-amber-500/20 text-slate-300 pt-16 pb-24 lg:pb-12 relative overflow-hidden">
      {/* Ambient background light glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Logo */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <div className="relative w-56 h-20 transition-transform group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Gorakhpur's Got Latent Official Logo"
                  fill
                  className="object-contain filter drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]"
                />
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              Purvanchal’s premier raw talent hunt, entertainment showcase, and live roast event platform. Providing an epic national stage for music, comedy, dance, beatboxing, and extraordinary performers.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/gorakhpur_got_latent"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-400 hover:text-black hover:bg-amber-400 transition-all shadow-[0_0_10px_rgba(255,215,0,0.2)]"
                aria-label="Instagram"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@gorakhpurgotlatent"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-400 hover:text-black hover:bg-amber-400 transition-all shadow-[0_0_10px_rgba(255,215,0,0.2)]"
                aria-label="YouTube"
              >
                <Video className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/ggllive"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-400 hover:text-black hover:bg-amber-400 transition-all shadow-[0_0_10px_rgba(255,215,0,0.2)]"
                aria-label="X Twitter"
              >
                <Share2 className="w-5 h-5" />
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
              <li><Link href="/apply/event-booking" className="hover:text-amber-400 transition-colors">Show & Event Booking</Link></li>
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
                <span>contact@ggllive.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 98765 43210</span>
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
