'use client';

import { usePathname } from 'next/navigation';

export default function LeadershipBanner() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <div className="w-full border-y border-amber-500/20 bg-[#101116] px-4 py-2 text-center text-xs sm:text-sm text-slate-300">
      <span className="font-semibold text-amber-300">GGL Leadership —</span> Naveen Varma — Founder &amp; Show Creator <span className="mx-2 text-amber-500">|</span> Alok Singh — Co-Founder &amp; Technical Head
    </div>
  );
}
