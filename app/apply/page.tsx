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
      badge: 'EPISODE 1 FULL • FILL FOR EPISODE 2',
      badgeClass: 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse',
      color: 'from-amber-500/20 via-amber-500/10 to-transparent',
      borderColor: 'border-amber-500/40',
      btnBg: 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black hover:opacity-95',
      btnText: 'FILL FORM FOR EPISODE 2',
      alertBox: {
        tag: 'EPISODE 1 FULL',
        text: 'Episode 1 performer slots are full! Next registration date coming soon. Fill form for Episode 2 now.',
      },
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
    <div className="pt-6 sm:pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
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

      {/* Performer Episode 1 Full & Episode 2 Alert Banner */}
      <div className="max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/70 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm text-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 shrink-0 mt-0.5 sm:mt-0">
            <Mic2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-wider">
                EPISODE 1 FULL
              </span>
              <strong className="text-white font-bold text-sm">
                Performer Registration Notice: Fill Form for Episode 2
              </strong>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Episode 1 ke sabhi performer slots full ho chuke hain! Next registration date <span className="text-amber-400 font-bold">Coming Soon</span> hai. Agar aap perform karna chahte hain toh abhi <strong>Episode 2 ke liye form fill karein</strong>.
            </p>
          </div>
        </div>
        <Link
          href="/apply/performer"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs whitespace-nowrap shadow-lg transition-all flex items-center gap-1.5 shrink-0 self-stretch sm:self-auto justify-center"
        >
          FILL FORM FOR EPISODE 2 <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* General Notice */}
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
                <div className="flex items-center justify-between gap-2">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 text-amber-400 shadow-inner">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${stream.badgeClass || 'bg-white/10 text-amber-300'}`}>
                    {stream.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-white">{stream.title}</h3>
                  <p className="text-xs font-semibold text-amber-400">{stream.subtitle}</p>
                </div>

                {stream.alertBox && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-red-400 text-[11px] uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                      {stream.alertBox.tag}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{stream.alertBox.text}</p>
                  </div>
                )}

                <p className="text-xs text-slate-300 leading-relaxed">{stream.desc}</p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Link
                  href={stream.href}
                  className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${stream.btnBg}`}
                >
                  {stream.btnText || `FILL ${stream.title.toUpperCase()}`} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
