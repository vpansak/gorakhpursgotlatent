import { db } from '@/lib/db';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';

export default async function GuestsPage() {
  const guests = await db.query("SELECT * FROM guest_applications WHERE status = 'APPROVED' ORDER BY created_at DESC");

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Star className="w-4 h-4 text-purple-400" /> CELEBRITY & GUEST PANEL
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Confirmed Guests & Judges</h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Official guest creators, celebrity judges, and hosts appearing live on Gorakhpur’s Got Latent.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {guests.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm">
            Guest announcements coming soon. <Link href="/apply/guest" className="text-purple-400 underline font-bold">Express interest as a guest creator!</Link>
          </div>
        ) : (
          guests.map((g: any) => (
            <div key={g.app_id} className="glass-card p-6 rounded-3xl space-y-4 border border-purple-500/20 hover:border-purple-400 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-purple-500/20 border-2 border-purple-500/40 flex items-center justify-center font-black text-purple-300 text-lg">
                    {g.full_name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{g.stage_name || g.full_name}</h3>
                    <p className="text-xs text-purple-400 font-bold">{g.profession}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{g.short_intro}</p>

                <div className="space-y-1 text-xs text-slate-400 border-t border-slate-800 pt-3">
                  <div className="flex justify-between">
                    <span>Role / Category:</span>
                    <span className="font-bold text-white">{g.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="text-white flex items-center gap-1"><MapPin className="w-3 h-3 text-purple-400" /> {g.city}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px]">
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
                  CONFIRMED GUEST
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/80 border border-purple-500/30 text-center space-y-4 max-w-3xl mx-auto">
        <h3 className="text-2xl font-black text-white">Are You A Content Creator Or Public Personality?</h3>
        <p className="text-xs sm:text-sm text-slate-300">Join our guest panel as a judge, co-host, or featured guest artist.</p>
        <Link href="/apply/guest" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-purple-600 text-white font-extrabold text-sm shadow-lg">
          APPLY AS GUEST / CREATOR
        </Link>
      </div>
    </div>
  );
}
