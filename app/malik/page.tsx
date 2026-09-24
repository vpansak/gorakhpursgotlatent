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
  const [performers, sponsors, team, guests] = await Promise.all([
    db.query('SELECT * FROM performer_applications ORDER BY created_at DESC'),
    db.query('SELECT * FROM sponsor_applications ORDER BY created_at DESC'),
    db.query('SELECT * FROM team_applications ORDER BY created_at DESC'),
    db.query('SELECT * FROM guest_applications ORDER BY created_at DESC'),
  ]);

  return {
    session,
    initialData: {
      performers: performers || [],
      sponsors: sponsors || [],
      team: team || [],
      guests: guests || [],
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
              {session.role} CONSOLE
            </span>
            <span className="text-xs text-slate-400">
              Signed in as <strong className="text-white">{session.full_name}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5 tracking-tight flex items-center gap-2">
            <span>Admin Portal</span>
            <span className="text-amber-400 font-mono text-sm px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 font-bold">
              मलिक पैनल
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Performers, Sponsors, Team Members & Judges applications management with instant Excel (.xlsx) download.
          </p>
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
