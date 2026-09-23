'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Ticket, Sparkles, UserCheck, ShieldCheck, PhoneCall } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isLiveRoute = pathname.startsWith('/display') || pathname.startsWith('/live') || pathname.startsWith('/operator') || pathname.startsWith('/judge') || pathname.startsWith('/vote') || pathname.startsWith('/malik/live');
  if (isLiveRoute) return null;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Show', href: '/#about' },
    { name: 'Performers', href: '/performers' },
    { name: 'Guests', href: '/guests' },
    { name: 'Sponsors', href: '/sponsors' },
    { name: 'Tickets', href: 'https://in.bookmyshow.com/events/gorakhpur-got-latent/ET00518139?utm_source=ig&utm_medium=social&utm_content=link_in_bio', isExternal: true },
    { name: 'Apply Now', href: '/apply' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#07080e]/85 border-b border-amber-500/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Brand */}
            <Link href="/" className="flex items-center group -ml-2 sm:-ml-4 lg:-ml-6">
              <div className="relative w-56 sm:w-64 lg:w-72 h-14 sm:h-16 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Gorakhpur's Got Latent Golden Title Logo"
                  fill
                  priority
                  className="object-contain object-left filter drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]"
                />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                if (link.isExternal) {
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-lg text-sm font-semibold text-amber-400 hover:text-amber-300 hover:bg-white/5 transition-all duration-200"
                    >
                      {link.name} ↗
                    </a>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 shadow-[0_0_12px_rgba(255,215,0,0.15)]'
                        : 'text-slate-300 hover:text-amber-300 hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Header Right Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href="https://in.bookmyshow.com/events/gorakhpur-got-latent/ET00518139?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
                target="_blank"
                rel="noreferrer"
                className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,160,0,0.6)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 rounded-xl animate-shimmer" />
                <span className="relative flex items-center gap-2 px-4 py-2.5 rounded-[11px] bg-[#07080e] text-amber-300 font-bold group-hover:bg-transparent group-hover:text-black transition-all">
                  <Ticket className="w-4 h-4 text-amber-400 group-hover:text-black transition-colors" />
                  BOOK ON BOOKMYSHOW
                </span>
              </a>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center lg:hidden gap-2">
              <a
                href="https://in.bookmyshow.com/events/gorakhpur-got-latent/ET00518139?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs flex items-center gap-1"
              >
                <Ticket className="w-3.5 h-3.5" />
                BOOK TICKET
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-400 focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Out Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-amber-500/20 bg-[#07080e]/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-300">
            {navLinks.map((link) => {
              if (link.isExternal) {
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-semibold text-amber-400 hover:bg-amber-500/10 border border-transparent transition-all"
                  >
                    {link.name} ↗
                  </a>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-base font-medium text-slate-200 hover:text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 transition-all"
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07080e]/95 backdrop-blur-xl border-t border-amber-500/20 px-3 py-2 flex items-center justify-around text-center shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
        <Link href="/" className="flex flex-col items-center gap-0.5 text-xs text-slate-300 hover:text-amber-400">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Home</span>
        </Link>
        <a
          href="https://in.bookmyshow.com/events/gorakhpur-got-latent/ET00518139?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-0.5 text-xs text-amber-400 font-bold"
        >
          <div className="p-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg">
            <Ticket className="w-5 h-5" />
          </div>
          <span>Tickets</span>
        </a>
        <Link href="/apply" className="flex flex-col items-center gap-0.5 text-xs text-slate-300 hover:text-amber-400">
          <UserCheck className="w-5 h-5 text-orange-400" />
          <span>Apply</span>
        </Link>
        <Link href="/contact" className="flex flex-col items-center gap-0.5 text-xs text-slate-300 hover:text-amber-400">
          <PhoneCall className="w-5 h-5 text-amber-400" />
          <span>Contact</span>
        </Link>
      </div>
    </>
  );
}
