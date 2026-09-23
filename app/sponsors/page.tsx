import { db } from '@/lib/db';
import Link from 'next/link';
import { Building2, Award, ChevronRight, CheckCircle2 } from 'lucide-react';

export default async function SponsorsPage() {
  const sponsors = await db.query("SELECT * FROM sponsor_applications WHERE status = 'APPROVED' ORDER BY created_at DESC");

  const packages = [
    {
      title: 'Platinum Title Sponsor',
      subtitle: 'Exclusive Naming Rights & Maximum Brand Exposure',
      perks: [
        'Main stage title branding: "Gorakhpur’s Got Latent Presented By [Brand]"',
        'VIP Front Row Sofas & 20 Complimentary VVIP Passes',
        '30-Second Promotional Video played on main stage LED screens',
        'Logo placement on all digital tickets, posters, and social posts',
        'Dedicated booth / stall space at venue ground',
      ],
      badge: 'MAXIMUM EXPOSURE',
    },
    {
      title: 'Gold Powered-By Partner',
      subtitle: 'Co-Branding & High-Impact Digital Reach',
      perks: [
        'Co-branding title rights: "Powered By [Brand]"',
        'Logo on stage backdrop & entrance archways',
        '10 Complimentary VIP Fan Zone Passes',
        'Social media spotlight across YouTube & Instagram reels',
        'Promotional flyer / sample distribution at entry gate',
      ],
      badge: 'HIGH IMPACT',
    },
    {
      title: 'Category & Beverage Partner',
      subtitle: 'Targeted On-Ground Product Experience',
      perks: [
        'Exclusive product pouring / display rights at venue',
        'Logo on show website, tickets, and partner wall',
        '5 Complimentary VIP Passes',
        'On-stage verbal shoutout by event hosts',
      ],
      badge: 'PRODUCT TASTING',
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-4 h-4 text-blue-400" /> BRAND PARTNERSHIPS
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Sponsors & Brand Partners</h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Partner your brand with Purvanchal’s biggest live entertainment show. Over 100,000+ digital reach and 1,200+ on-ground audience.
        </p>
      </div>

      {/* Approved Active Sponsors */}
      {sponsors.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white text-center">Official Season Sponsors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.map((s: any) => (
              <div key={s.app_id} className="glass-card p-6 rounded-3xl space-y-3 border border-blue-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center font-bold text-blue-300">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{s.company_name}</h3>
                    <span className="text-xs text-blue-400 font-semibold">{s.sponsorship_type}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 italic">{s.message || `Proud official ${s.sponsorship_type} of Gorakhpur's Got Latent.`}</p>
                <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800 flex justify-between">
                  <span>Industry: {s.industry}</span>
                  <span className="text-emerald-400 font-bold uppercase">APPROVED SPONSOR</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Configurable Sponsorship Packages */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white">Sponsorship Opportunities</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Submit your brand details — customized sponsorship proposals and budget options will be shared directly by our management team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-3xl border border-blue-500/30 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-widest">
                  {pkg.badge}
                </span>
                <h3 className="text-2xl font-black text-white">{pkg.title}</h3>
                <p className="text-xs text-slate-300 font-medium">{pkg.subtitle}</p>

                <ul className="space-y-2.5 pt-4 text-xs text-slate-300 border-t border-slate-800">
                  {pkg.perks.map((perk, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Link
                  href="/apply/sponsor"
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  SUBMIT BRAND DETAILS <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
