'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

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

function XIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const isLiveRoute =
    pathname.startsWith('/display') ||
    pathname.startsWith('/live') ||
    pathname.startsWith('/operator') ||
    pathname.startsWith('/judge') ||
    pathname.startsWith('/vote') ||
    pathname.startsWith('/malik/live') ||
    pathname.startsWith('/computerji');

  if (isLiveRoute || pathname.startsWith('/developer')) return null;

  // Application pages keep only the official GGL logo; hide the full marketing/footer links.
  if (pathname.startsWith('/apply/')) {
    return (
      <footer className="bg-[#05060a] border-t border-amber-500/20 py-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex justify-center">
          <Link href="/" className="inline-block group">
            <div className="relative w-56 sm:w-64 h-16 sm:h-20 transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Gorakhpur's Got Latent Official Logo"
                fill
                className="object-contain filter drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]"
              />
            </div>
          </Link>
        </div>
      </footer>
    );
  }

  // Compute Page-Specific Pre-Drafted WhatsApp Message & Reason
  let whatsappDraftText = "Hi Gorakhpur's Got Latent Team,\n\nI have a general inquiry regarding the show.";
  let emailSubject = "General Inquiry - Gorakhpur's Got Latent";
  let contextLabel = "Quick Support & Help";

  if (pathname.includes('/performer')) {
    whatsappDraftText = "Hi Gorakhpur's Got Latent Team,\n\nI have a query regarding Performer Application / Episode 2 Audition slots.";
    emailSubject = "Performer Audition Query - Gorakhpur's Got Latent";
    contextLabel = "Performer & Audition Support";
  } else if (pathname.includes('/sponsor')) {
    whatsappDraftText = "Hi Gorakhpur's Got Latent Team,\n\nI want to inquire about Brand Sponsorship opportunities for our company.";
    emailSubject = "Brand Sponsorship Inquiry - Gorakhpur's Got Latent";
    contextLabel = "Brand Sponsorship Inquiry";
  } else if (pathname.includes('/guest')) {
    whatsappDraftText = "Hi Gorakhpur's Got Latent Team,\n\nI want to inquire about Guest / Judge / Creator appearance on the show.";
    emailSubject = "Guest & Creator Inquiry - Gorakhpur's Got Latent";
    contextLabel = "Guest & Panel Support";
  } else if (pathname.includes('/join-team')) {
    whatsappDraftText = "Hi Gorakhpur's Got Latent Team,\n\nI have a query regarding joining the show crew / volunteer team.";
    emailSubject = "Join Team Inquiry - Gorakhpur's Got Latent";
    contextLabel = "Crew & Team Support";
  } else if (pathname.includes('/ticket')) {
    whatsappDraftText = "Hi Gorakhpur's Got Latent Team,\n\nI have a query regarding Ticket booking / Show entry confirmation.";
    emailSubject = "Ticket Booking Support - Gorakhpur's Got Latent";
    contextLabel = "Ticket & Booking Support";
  }

  const encodedWhatsappUrl = `https://wa.me/918423858424?text=${encodeURIComponent(whatsappDraftText)}`;
  const encodedEmailUrl = `mailto:help.gglatent@gmail.com?subject=${encodeURIComponent(emailSubject)}`;

  return (
    <footer className="bg-[#05060a] border-t border-amber-500/20 text-slate-300 pt-10 pb-24 lg:pb-12 relative overflow-hidden">
      {/* Ambient background light glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* GLOBAL COMPACT QUICK SUPPORT BAR WITH PAGE-SPECIFIC WHATSAPP REASON DRAFT */}
        <div className="bg-gradient-to-r from-slate-900/90 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block font-barlow">
                {contextLabel}
              </span>
              <h4 className="text-sm sm:text-base font-black text-white">
                Need Help or Have Questions? Chat Directly on WhatsApp
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
            {/* WhatsApp Link with Pre-Drafted Page Context */}
            <a
              href={encodedWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
              title="Chat on WhatsApp with pre-filled page inquiry"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp Inquiry (+91 84238 58424)</span>
            </a>

            {/* Email Link with Pre-Drafted Subject */}
            <a
              href={encodedEmailUrl}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              title="Send an official email inquiry"
            >
              <Mail className="w-4 h-4 text-blue-400" />
              <span>help.gglatent@gmail.com</span>
            </a>
          </div>
        </div>

        {/* FOOTER MAIN GRID */}
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
                href="https://x.com/gkpgotlatent"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-400 hover:text-black hover:bg-amber-400 transition-all shadow-[0_0_10px_rgba(255,215,0,0.2)]"
                aria-label="X (Twitter)"
                title="X (Twitter)"
              >
                <XIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Apply Hub */}
          <div className="space-y-3">
            <h4 className="text-base font-extrabold text-white uppercase tracking-wider gold-gradient-text">
              APPLY NOW
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link href="/apply/performer" className="hover:text-amber-400 transition-colors">Performer Application</Link></li>
              <li><Link href="/apply/guest" className="hover:text-amber-400 transition-colors">Guest / Influencer Application</Link></li>
              <li><Link href="/apply/sponsor" className="hover:text-amber-400 transition-colors">Brand Sponsor Application</Link></li>
              <li><Link href="/apply/join-team" className="hover:text-amber-400 transition-colors">Join Team</Link></li>
            </ul>
          </div>

          {/* Col 3: Policy */}
          <div className="space-y-3">
            <h4 className="text-base font-extrabold text-white uppercase tracking-wider gold-gradient-text">
              POLICY
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-amber-400 transition-colors">Refund & Cancellation Policy</Link></li>
              <li><Link href="/quick-info" className="hover:text-amber-400 transition-colors">Quick Info</Link></li>
            </ul>
          </div>

          {/* Col 5: Venue & Help */}
          <div className="space-y-3">
            <h4 className="text-base font-extrabold text-white uppercase tracking-wider gold-gradient-text">
              VENUE & HELP
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <a 
                  href="https://maps.google.com/?q=26.828049,83.414894" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-amber-400 transition-colors"
                >
                  Announce Soon, Gorakhpur, UP ↗
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={encodedEmailUrl} className="hover:text-amber-400">help.gglatent@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={encodedWhatsappUrl} target="_blank" rel="noreferrer" className="hover:text-amber-400">+91 84238 58424</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Gorakhpur’s Got Latent. All rights reserved.</p>

        </div>
      </div>
    </footer>
  );
}
