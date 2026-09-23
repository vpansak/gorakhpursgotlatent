import Link from 'next/link';
import Image from 'next/image';
import { Mic2, Star, Building2, Users, ChevronRight, ShieldAlert } from 'lucide-react';

export default function ApplyPage() {
  const streams = [
    {
      title: 'Performer Application',
      subtitle: 'Singers, Dancers, Comedians, Beatboxers & Unique Acts',
      desc: 'Showcase your talent on the biggest live stage in Purvanchal. Compete in front of celebrity judges and thousands of live audience members.',
      href: '/apply/performer',
      icon: Mic2,
      badge: 'POPULAR',
      color: 'from-amber-500/20 via-amber-500/10 to-transparent',
      borderColor: 'border-amber-500/40',
      btnBg: 'bg-amber-500 text-black hover:bg-amber-400',
    },
    {
      title: 'Guest / Celebrity / Influencer',
      subtitle: 'Judges, Special Appearance & Content Creators',
      desc: 'Express interest in appearing on Gorakhpur’s Got Latent as a celebrity judge, guest performer, co-host, or featured influencer.',
      href: '/apply/guest',
      icon: Star,
      badge: 'VIP PANEL',
      color: 'from-purple-500/20 via-purple-500/10 to-transparent',
      borderColor: 'border-purple-500/40',
      btnBg: 'bg-purple-500 text-white hover:bg-purple-400',
    },
    {
      title: 'Brand Sponsorship',
      subtitle: 'Title Sponsors, Co-Sponsors & Brand Partners',
      desc: 'Partner your brand with Gorakhpur’s premier live entertainment phenomenon. Reach over 100,000+ online and on-ground audience.',
      href: '/apply/sponsor',
      icon: Building2,
      badge: 'BUSINESS',
      color: 'from-blue-500/20 via-blue-500/10 to-transparent',
      borderColor: 'border-blue-500/40',
      btnBg: 'bg-blue-500 text-white hover:bg-blue-400',
    },
    {
      title: 'Join Team',
      subtitle: 'Event Crew, Volunteers, Media & Operations',
      desc: 'Become a core part of Gorakhpur’s Got Latent! Join backstage management, artist coordination, crowd management, or social media team.',
      href: '/apply/join-team',
      icon: Users,
      badge: 'HIRING / CREW',
      color: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/40',
      btnBg: 'bg-emerald-500 text-black hover:bg-emerald-400',
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="relative w-44 h-16 mx-auto">
          <Image src="/logo.png" alt="Gorakhpur's Got Latent" fill className="object-contain" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          APPLY <span className="gold-gradient-text">NOW</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Select your application stream below to get started. All applications receive a unique Application ID for real-time status tracking.
        </p>
      </div>

      {/* Notice */}
      <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs sm:text-sm text-amber-200">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block font-bold">Important Notice:</strong>
          Please upload only documents relevant to your application. Do not upload unnecessary sensitive personal information. Official status changes are updated via your tracking portal.
        </div>
      </div>

      {/* 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {streams.map((stream, idx) => {
          const Icon = stream.icon;
          return (
            <div
              key={idx}
              className={`relative rounded-3xl bg-slate-900/80 border ${stream.borderColor} p-8 flex flex-col justify-between space-y-6 bg-gradient-to-b ${stream.color} shadow-2xl hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 text-amber-400 shadow-inner">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] font-black uppercase tracking-widest">
                    {stream.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-white">{stream.title}</h3>
                  <p className="text-xs font-semibold text-amber-400">{stream.subtitle}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{stream.desc}</p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Link
                  href={stream.href}
                  className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${stream.btnBg}`}
                >
                  FILL {stream.title.toUpperCase()} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
