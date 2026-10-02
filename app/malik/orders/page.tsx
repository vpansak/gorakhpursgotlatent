'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Search, 
  ArrowLeft, 
  Loader2, 
  RefreshCw, 
  Ticket as TicketIcon, 
  QrCode as QrIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  Download, 
  Printer, 
  ShieldCheck, 
  DollarSign, 
  Check, 
  X,
  Plus
} from 'lucide-react';
import TicketCard from '@/components/TicketCard';
import { TicketRecord } from '@/lib/ticketsStore';

export default function OrdersLedgerPage() {
  const [search, setSearch] = useState('');
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [stats, setStats] = useState({
    totalBooked: 0,
    todayBookings: 0,
    paidTickets: 0,
    pendingOrFailed: 0,
    checkedIn: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(false);

  // Selected Ticket for Modal View
  const [selectedTicket, setSelectedTicket] = useState<TicketRecord | null>(null);

  // QR Scanner & Manual Lookup State
  const [showScanner, setShowScanner] = useState(false);
  const [scanInput, setScanInput] = useState('');
  const [scanResultMsg, setScanResultMsg] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async (query = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tickets/search?q=${encodeURIComponent(query || search)}`);
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Admin Check-In Action
  const handleCheckIn = async (ticketId: string) => {
    try {
      const res = await fetch('/api/tickets/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId }),
      });
      const data = await res.json();
      setScanResultMsg(data.message || 'Check-in processed.');
      fetchTickets();
      if (selectedTicket && selectedTicket.ticket_id === ticketId && data.ticket) {
        setSelectedTicket(data.ticket);
      }
    } catch (err) {
      setScanResultMsg('Check-in failed due to network error.');
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setShowScanner(true);
    setScanResultMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setScanResultMsg('Camera access unavailable. Use manual Ticket ID search below.');
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
    setShowScanner(false);
  };

  // Handle Manual QR / ID Lookup Submit
  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    handleCheckIn(scanInput.trim());
    setScanInput('');
  };

  // Export Data to CSV
  const handleExportCSV = () => {
    if (tickets.length === 0) return;
    const headers = ['Ticket ID', 'Customer Name', 'Mobile', 'Email', 'Instagram', 'DOB', 'Quantity', 'Amount', 'Payment Status', 'Entry Status', 'Booking Date'];
    const rows = tickets.map(t => [
      t.ticket_id,
      `"${t.customer_name}"`,
      t.mobile,
      t.email,
      t.instagram_id,
      t.date_of_birth,
      t.quantity,
      t.amount,
      t.payment_status,
      t.checked_in === 1 ? 'CHECKED IN' : 'NOT CHECKED IN',
      t.created_at
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GGL_Tickets_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-slate-100">
      
      {/* HEADER & TOP ACTIONS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Link href="/malik" className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <TicketIcon className="w-7 h-7 text-amber-400" />
            BOOK TICKET & GATE CONTROL MODULE
          </h1>
          <p className="text-xs text-slate-400">Direct ticket management, attendee lookup, QR scanner verification & check-in controller.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/book-ticket"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" /> Book New Ticket
          </Link>

          <button
            onClick={startCamera}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
          >
            <Camera className="w-4 h-4" /> Open QR Scanner
          </button>

          <button 
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Export CSV
          </button>

          <button 
            onClick={() => fetchTickets()}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" /> Refresh
          </button>
        </div>
      </div>

      {/* SUMMARY STATS METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="text-[10px] text-slate-400 font-extrabold uppercase">Total Booked</div>
          <div className="text-2xl font-black text-white">{stats.totalBooked}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="text-[10px] text-slate-400 font-extrabold uppercase">Today&apos;s Bookings</div>
          <div className="text-2xl font-black text-amber-400">{stats.todayBookings}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="text-[10px] text-slate-400 font-extrabold uppercase">Paid Tickets (₹149)</div>
          <div className="text-2xl font-black text-emerald-400">{stats.paidTickets}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="text-[10px] text-slate-400 font-extrabold uppercase">Pending / Failed</div>
          <div className="text-2xl font-black text-red-400">{stats.pendingOrFailed}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="text-[10px] text-slate-400 font-extrabold uppercase">Checked In</div>
          <div className="text-2xl font-black text-amber-300">{stats.checkedIn}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-1">
          <div className="text-[10px] text-slate-400 font-extrabold uppercase">Total Revenue</div>
          <div className="text-2xl font-black text-emerald-300">₹{stats.totalRevenue}</div>
        </div>
      </div>

      {/* QR SCANNER & MANUAL LOOKUP MODAL */}
      {showScanner && (
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/50 bg-slate-900/95 space-y-5 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bebas text-2xl text-white uppercase flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-400" /> ADMIN QR ENTRY SCANNER
            </h3>
            <button onClick={stopCamera} className="p-2 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Camera Video Feed */}
            <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-amber-500/40 min-h-[220px] flex items-center justify-center">
              <video ref={videoRef} className="w-full h-56 object-cover" />
              <div className="absolute inset-4 border-2 border-dashed border-amber-400/70 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-[10px] font-bold text-amber-300 bg-black/60 px-3 py-1 rounded-full uppercase">
                  Point Camera at Ticket QR
                </span>
              </div>
            </div>

            {/* Manual ID Input & Scan Result */}
            <div className="space-y-4">
              <form onSubmit={handleScanSubmit} className="space-y-3">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Scan / Enter Ticket ID Manually:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    placeholder="e.g. GGLT123456"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs uppercase"
                  >
                    Check In
                  </button>
                </div>
              </form>

              {scanResultMsg && (
                <div className={`p-4 rounded-2xl text-xs font-bold ${
                  scanResultMsg.includes('SUCCESSFUL')
                    ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-300'
                    : 'bg-amber-950 border border-amber-500/60 text-amber-300'
                }`}>
                  {scanResultMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchTickets(search)}
            placeholder="Search by Ticket ID (GGLT123456), Customer Name, Mobile, Email, Instagram ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>
        <button
          onClick={() => fetchTickets(search)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase"
        >
          Search
        </button>
      </div>

      {/* TICKETS TABLE LEDGER */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <div className="text-xs font-bold uppercase">Loading Ticket Records...</div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <TicketIcon className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-bold text-white uppercase">No Ticket Records Found</div>
            <p className="text-xs text-slate-500">Book new tickets using the /book-ticket page.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-4">Ticket ID</th>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Instagram</th>
                  <th className="p-4">DOB</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Entry Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {tickets.map((tck) => (
                  <tr key={tck.ticket_id} className="hover:bg-slate-900/50 transition-colors">
                    
                    {/* Ticket ID */}
                    <td className="p-4 font-mono font-black text-amber-400">
                      {tck.ticket_id}
                      {tck.is_demo && (
                        <span className="block text-[9px] text-amber-500/80 font-normal">DEMO SAMPLE</span>
                      )}
                    </td>

                    {/* Customer Name */}
                    <td className="p-4 font-bold text-white">
                      {tck.customer_name}
                    </td>

                    {/* Contact */}
                    <td className="p-4 space-y-0.5">
                      <div className="font-mono text-slate-200">{tck.mobile}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{tck.email}</div>
                    </td>

                    {/* Instagram */}
                    <td className="p-4 font-bold text-pink-400">
                      {tck.instagram_id}
                    </td>

                    {/* DOB */}
                    <td className="p-4 text-slate-300">
                      {tck.date_of_birth}
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-bold text-white font-mono">
                      ₹{tck.amount} ({tck.quantity}x)
                    </td>

                    {/* Payment Status */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-black text-[10px] uppercase ${
                        tck.payment_status === 'PAID' ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40' : 'bg-red-950 text-red-400 border border-red-500/40'
                      }`}>
                        {tck.payment_status}
                      </span>
                    </td>

                    {/* Entry Status */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-black text-[10px] uppercase ${
                        tck.checked_in === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {tck.checked_in === 1 ? 'CHECKED IN' : 'NOT CHECKED IN'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() => setSelectedTicket(tck)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-[11px] uppercase"
                      >
                        View Ticket
                      </button>

                      {tck.checked_in !== 1 && (
                        <button
                          onClick={() => handleCheckIn(tck.ticket_id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase"
                        >
                          Check In
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SELECTED TICKET MODAL VIEW */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#07080e] border border-amber-500/50 rounded-3xl max-w-4xl w-full p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bebas text-2xl text-white uppercase flex items-center gap-2">
                <TicketIcon className="w-5 h-5 text-amber-400" /> TICKET DETAILS — {selectedTicket.ticket_id}
              </h3>
              <button onClick={() => setSelectedTicket(null)} className="p-2 text-slate-400 hover:text-white rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <TicketCard ticket={selectedTicket} showActions={true} />

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              {selectedTicket.checked_in !== 1 ? (
                <button
                  onClick={() => handleCheckIn(selectedTicket.ticket_id)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider"
                >
                  ✓ MARK AS CHECKED IN
                </button>
              ) : (
                <div className="text-xs text-amber-300 font-bold">
                  ✓ Attendees checked in at {selectedTicket.checked_in_at || 'Earlier'}
                </div>
              )}

              <button
                onClick={() => setSelectedTicket(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs uppercase"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
