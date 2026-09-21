import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { formatINR } from '@/lib/helpers';
import {
  TrendingUp, Ticket, Users, FileText, CheckCircle2, ShieldCheck,
  ChevronRight, Mic2, Star, Building2, QrCode, LogOut
} from 'lucide-react';

async function getAdminData() {
  const session = await getSession();
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF', 'TICKET_STAFF'].includes(session.role)) {
    return null;
  }

  const revenueRow = db.prepare("SELECT SUM(total_amount) as total FROM ticket_orders WHERE payment_status = 'PAID'").get() as any;
  const totalRevenue = revenueRow?.total || 0;

  const paidOrdersRow = db.prepare("SELECT COUNT(*) as count FROM ticket_orders WHERE payment_status = 'PAID'").get() as any;
  const totalOrders = paidOrdersRow?.count || 0;

  const ticketsRow = db.prepare('SELECT COUNT(*) as count FROM tickets').get() as any;
  const checkedInRow = db.prepare('SELECT COUNT(*) as count FROM tickets WHERE status = "USED"').get() as any;

  const perfCount = (db.prepare('SELECT COUNT(*) as count FROM performer_applications').get() as any)?.count || 0;
  const guestCount = (db.prepare('SELECT COUNT(*) as count FROM guest_applications').get() as any)?.count || 0;
  const sponsorCount = (db.prepare('SELECT COUNT(*) as count FROM sponsor_applications').get() as any)?.count || 0;
  const eventCount = (db.prepare('SELECT COUNT(*) as count FROM event_booking_applications').get() as any)?.count || 0;

  const recentOrders = db.prepare(`
    SELECT o.*, e.title as event_title
    FROM ticket_orders o
    JOIN events e ON o.event_id = e.id
    ORDER BY o.created_at DESC LIMIT 5
  `).all();

  return {
    session,
    stats: {
      totalRevenue,
      totalOrders,
      totalTickets: ticketsRow?.count || 0,
      totalCheckedIn: checkedInRow?.count || 0,
      perfCount,
      guestCount,
      sponsorCount,
      eventCount,
      totalApplications: perfCount + guestCount + sponsorCount + eventCount,
    },
    recentOrders,
  };
}

export default async function AdminDashboardPage() {
  const data = await getAdminData();

  if (!data) {
    redirect('/malik/login');
  }

  const { session, stats, recentOrders } = data;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase">
              ROLE: {session.role}
            </span>
            <span className="text-xs text-slate-400">Signed in as <strong className="text-white">{session.full_name}</strong></span>
          </div>
          <h1 className="text-3xl font-black text-white mt-1">Executive Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/verify" className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg">
            <QrCode className="w-4 h-4" /> GATE TICKET SCANNER
          </Link>
          <form action="/api/malik/logout" method="POST">
            <button type="submit" className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-red-400 text-xs flex items-center gap-1">
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="p-6 rounded-3xl glass-card space-y-2 border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">TICKET REVENUE</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400">{formatINR(stats.totalRevenue)}</div>
          <p className="text-[11px] text-slate-400">{stats.totalOrders} paid Razorpay orders</p>
        </div>

        {/* Issued Tickets */}
        <div className="p-6 rounded-3xl glass-card space-y-2 border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ISSUED TICKETS</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.totalTickets} Passes</div>
          <p className="text-[11px] text-emerald-400 font-semibold">{stats.totalCheckedIn} Gate Check-ins recorded</p>
        </div>

        {/* Total Applications */}
        <div className="p-6 rounded-3xl glass-card space-y-2 border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">APPLICATIONS</span>
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.totalApplications}</div>
          <p className="text-[11px] text-slate-400">Performers, Guests & Sponsors</p>
        </div>

        {/* Performers Funnel */}
        <div className="p-6 rounded-3xl glass-card space-y-2 border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">PERFORMER FUNNEL</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Mic2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-300">{stats.perfCount}</div>
          <p className="text-[11px] text-slate-400">Audition applications</p>
        </div>
      </div>

      {/* Malik Modules Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link href="/malik/applications" className="p-6 rounded-3xl glass-panel border border-amber-500/30 space-y-3 hover:border-amber-400 transition-all group">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
              <FileText className="w-6 h-6" />
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </div>
          <h3 className="text-xl font-black text-white">Applications Manager</h3>
          <p className="text-xs text-slate-400">Manage status, search, add internal notes, tags, and contact applicants via WhatsApp/Email.</p>
        </Link>

        <Link href="/malik/orders" className="p-6 rounded-3xl glass-panel border border-amber-500/30 space-y-3 hover:border-amber-400 transition-all group">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </div>
          <h3 className="text-xl font-black text-white">Orders & Payments Ledger</h3>
          <p className="text-xs text-slate-400">Inspect Razorpay payment IDs, transaction amounts, status filters, and refund management.</p>
        </Link>

        <Link href="/verify" className="p-6 rounded-3xl glass-panel border border-amber-500/30 space-y-3 hover:border-amber-400 transition-all group">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
              <QrCode className="w-6 h-6" />
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </div>
          <h3 className="text-xl font-black text-white">Gate Ticket Scanner</h3>
          <p className="text-xs text-slate-400">Live QR camera scanner and ticket verification tool with duplicate entry prevention.</p>
        </Link>
      </div>

      {/* Recent Orders Ledger Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Ticket className="w-5 h-5 text-amber-400" /> Recent Ticket Transactions
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-amber-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Order Number</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Razorpay Order</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {recentOrders.map((o: any) => (
                <tr key={o.id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-mono font-bold text-white">{o.order_number}</td>
                  <td className="p-3">
                    <div className="font-bold text-white">{o.customer_name}</div>
                    <div className="text-[10px] text-slate-400">{o.customer_phone}</div>
                  </td>
                  <td className="p-3 font-bold text-amber-400">{formatINR(o.total_amount)}</td>
                  <td className="p-3 font-mono text-[10px] text-slate-400">{o.razorpay_order_id}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${o.payment_status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {o.payment_status}
                    </span>
                  </td>
                  <td className="p-3 text-[10px] text-slate-400">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
