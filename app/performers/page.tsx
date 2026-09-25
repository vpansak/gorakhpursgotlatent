import { db } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { Mic2, Music, UserCheck, Star, MapPin } from 'lucide-react';

export default async function PerformersPage() {
  const performers = await db.query("SELECT * FROM performer_applications WHERE status = 'APPROVED' ORDER BY created_at DESC");

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Mic2 className="w-4 h-4 text-amber-400" /> STAGE TALENT DIRECTORY
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Approved Performers</h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Meet the verified raw talent shortlisted to perform live on the Gorakhpur’s Got Latent stage!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {performers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm">
            No approved performers published yet. <Link href="/apply/performer" className="text-amber-400 underline font-bold">Apply now to get featured!</Link>
          </div>
        ) : (
          performers.map((p: any) => (
            <div key={p.app_id} className="glass-card p-6 rounded-3xl space-y-4 border border-amber-500/20 hover:border-amber-400 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center font-black text-amber-300 text-lg">
                    {p.full_name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{p.full_name}</h3>
                    <p className="text-xs text-amber-400 font-bold">{p.talent_category}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed min-h-[50px]">{p.short_bio || p.performance_desc}</p>

                <div className="space-y-1 text-xs text-slate-400 border-t border-slate-800 pt-3">
                  <div className="flex justify-between">
                    <span>Act Title:</span>
                    <span className="font-bold text-white">{p.primary_talent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <span className="text-white">{p.experience_yrs} Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="text-white flex items-center gap-1"><MapPin className="w-3 h-3 text-orange-400" /> {p.city}, {p.state}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px]">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                  VERIFIED STAGE ACT
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
          Episode 2 Auditions • Next Registration Date Coming Soon
        </div>
        <h3 className="text-2xl font-black text-white">Think You Have What It Takes?</h3>
        <p className="text-xs sm:text-sm text-slate-300">Fill form for Episode 2 auditions now to reserve your slot.</p>
        <Link href="/apply/performer" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold text-sm shadow-lg hover:scale-105 transition-all">
          FILL FORM FOR EPISODE 2 NOW
        </Link>
      </div>
    </div>
  );
}
