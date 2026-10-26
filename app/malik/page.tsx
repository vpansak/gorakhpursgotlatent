import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { ShieldCheck, LogOut, Sparkles } from 'lucide-react';
import AdminOtpLogin from '@/components/AdminOtpLogin';
import AdminApplicationPortal from '@/components/AdminApplicationPortal';

export const dynamic = 'force-dynamic';

async function getAdminData() {
  const session = await getSession();
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF', 'TICKET_STAFF'].includes(session.role)) {
    return null;
  }

  // Fetch all 4 application streams directly from Neon PostgreSQL
  const [performers, sponsors, team, guests, talentTrip] = await Promise.all([
    db.query("SELECT p.*, CASE WHEN l.razorpay_payment_id IS NOT NULL AND l.status='PAID' AND l.amount=29 AND p.payment_status='PAID' AND p.payment_id=l.razorpay_payment_id AND p.payment_amount=29 THEN l.razorpay_payment_id ELSE NULL END AS verified_payment_id FROM performer_applications p LEFT JOIN performer_payment_links l ON l.app_id=p.app_id ORDER BY COALESCE(p.is_read, 0) ASC, p.created_at DESC"),
    db.query('SELECT * FROM sponsor_applications ORDER BY COALESCE(is_read, 0) ASC, created_at DESC'),
    db.query('SELECT * FROM team_applications ORDER BY COALESCE(is_read, 0) ASC, created_at DESC'),
    db.query("SELECT g.*, l.razorpay_payment_id AS payment_id, l.amount AS payment_amount, 'PAID' AS payment_status FROM guest_applications g INNER JOIN guest_payment_links l ON l.app_id=g.app_id AND l.status='PAID' AND l.razorpay_payment_id IS NOT NULL AND l.amount=49 ORDER BY COALESCE(g.is_read, 0) ASC, g.created_at DESC"),
    db.query('SELECT COUNT(*)::int AS total FROM ggl_talent_trip_registrations'),
  ]);

  return {
    session,
    initialData: {
      performers: performers || [],
      sponsors: sponsors || [],
      team: team || [],
      guests: guests || [],
      talentTripCount: Number(talentTrip?.[0]?.total || 0),
    },
  };
}

export default async function AdminDashboardPage() {
  const data = await getAdminData();

  if (!data) {
    return <AdminOtpLogin />;
  }

  const { session, initialData } = data;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* CLEAN TOP HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              ADMIN CONSOLE
            </span>
            <span className="text-xs text-slate-400">
              Signed in as <strong className="text-white">Admin</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5 tracking-tight flex items-center gap-2">
            <span>Admin Portal</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Performers, Sponsors, Team Members & Judges applications management with instant Excel (.xlsx) download.
          </p>
          <Link href="/malik/talent-trip" className="mt-3 inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-black text-amber-200 hover:bg-amber-400/20">GGL Talent Trip Management <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] text-white">NEW</span></Link>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <form action="/api/malik/logout" method="POST">
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-red-500/60 text-slate-300 hover:text-red-400 font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              title="Log out and return to admin login"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>LOG OUT</span>
            </button>
          </form>
        </div>
      </div>

      {/* STREAMLINED APPLICATION DASHBOARD & EXCEL SPREADSHEET MANAGER */}
      <AdminApplicationPortal session={session} initialData={initialData} />
    </div>
  );
}
