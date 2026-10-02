'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Phone, 
  Mail, 
  AtSign, 
  Calendar, 
  Ticket as TicketIcon,
  ArrowLeft,
  Check
} from 'lucide-react';
import { TicketRecord } from '@/lib/ticketsStore';
import TicketCard from '@/components/TicketCard';

export default function TicketVerificationPage() {
  const params = useParams();
  const ticketId = params?.ticketId as string;

  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<TicketRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [checkInMsg, setCheckInMsg] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    async function fetchTicketData() {
      if (!ticketId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/tickets/search?q=${encodeURIComponent(ticketId)}`);
        const data = await res.json();
        if (data.success && data.tickets && data.tickets.length > 0) {
          const match = data.tickets.find((t: TicketRecord) => 
            t.ticket_id.toUpperCase() === ticketId.toUpperCase() || t.qr_token === ticketId
          );
          if (match) {
            setTicket(match);
          } else {
            setErrorMsg('✕ INVALID TICKET: This ticket could not be verified.');
          }
        } else {
          setErrorMsg('✕ INVALID TICKET: This ticket could not be verified.');
        }
      } catch (err) {
        setErrorMsg('✕ INVALID TICKET: Verification request failed.');
      } finally {
        setLoading(false);
      }

      // Check if admin is logged in from localStorage
      try {
        const adminSession = localStorage.getItem('malik_admin_session');
        if (adminSession) {
          setIsAdminLoggedIn(true);
        }
      } catch (e) {}
    }

    fetchTicketData();
  }, [ticketId]);

  const handleAdminCheckIn = async () => {
    if (!ticket) return;
    setCheckingIn(true);
    setCheckInMsg('');

    try {
      const res = await fetch('/api/tickets/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: ticket.ticket_id }),
      });
      const data = await res.json();
      if (data.ticket) {
        setTicket(data.ticket);
      }
      setCheckInMsg(data.message || 'Check-in processed.');
    } catch (err) {
      setCheckInMsg('Check-in failed due to network error.');
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10 space-y-8">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-barlow uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> TICKET VERIFICATION SYSTEM
          </div>
          <h1 className="font-bebas text-3xl sm:text-5xl text-white uppercase tracking-tight">
            GORAKHPUR&apos;S GOT LATENT
          </h1>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="glass-panel p-8 rounded-3xl text-center space-y-4 border border-amber-500/30">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-sm font-bold text-amber-300 uppercase tracking-wider">
              Verifying Ticket Credentials...
            </div>
          </div>
        )}

        {/* INVALID TICKET CARD */}
        {!loading && errorMsg && (
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-red-500/50 bg-red-950/40 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-400 flex items-center justify-center mx-auto text-red-400">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="font-bebas text-3xl text-white uppercase tracking-wide">
              ✕ INVALID TICKET
            </h2>
            <p className="text-xs sm:text-sm text-red-300 max-w-md mx-auto leading-relaxed">
              This ticket could not be verified. Please check the Ticket ID or scan a valid GGL ticket QR code.
            </p>
            <div className="pt-2">
              <Link
                href="/book-ticket"
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Book a Valid Ticket</span>
              </Link>
            </div>
          </div>
        )}

        {/* VALID TICKET CARD */}
        {!loading && ticket && (
          <div className="space-y-6">
            
            {/* PUBLIC STATUS BANNER */}
            {ticket.checked_in === 1 ? (
              <div className="glass-panel p-6 rounded-3xl border border-amber-500/60 bg-amber-950/40 text-center space-y-2 shadow-xl">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto text-amber-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="font-bebas text-2xl sm:text-3xl text-amber-300 uppercase tracking-wide">
                  ⚠️ ALREADY CHECKED IN
                </h2>
                <p className="text-xs text-slate-300 font-semibold">
                  This ticket ({ticket.ticket_id}) has already been used for entry at {ticket.checked_in_at || 'earlier session'}.
                </p>
              </div>
            ) : (
              <div className="glass-panel p-6 rounded-3xl border border-emerald-500/60 bg-emerald-950/40 text-center space-y-2 shadow-xl">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="font-bebas text-2xl sm:text-3xl text-emerald-400 uppercase tracking-wide">
                  ✓ VALID GGL TICKET
                </h2>
                <div className="text-xs text-slate-200 font-bold font-mono">
                  Ticket ID: <span className="text-amber-300">{ticket.ticket_id}</span> &bull; Payment: <span className="text-emerald-400 font-black">PAID</span>
                </div>
              </div>
            )}

            {/* RENDER GRAPHIC TICKET CARD */}
            <TicketCard ticket={ticket} showActions={true} />

            {/* ADMIN / STAFF CHECK-IN ACTION BOX */}
            {isAdminLoggedIn && (
              <div className="glass-panel p-6 rounded-3xl border border-amber-500/40 bg-slate-900/90 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    🛡️ ADMIN ENTRY GATE CONTROL
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Staff Session Active</span>
                </div>

                {checkInMsg && (
                  <div className={`p-3.5 rounded-xl text-xs font-bold ${
                    checkInMsg.includes('SUCCESSFUL') 
                      ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-300' 
                      : 'bg-amber-950 border border-amber-500/60 text-amber-300'
                  }`}>
                    {checkInMsg}
                  </div>
                )}

                {ticket.checked_in === 1 ? (
                  <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-center space-y-1">
                    <div className="text-sm font-black text-amber-300 uppercase">ENTRY STATUS: CHECKED IN</div>
                    <div className="text-xs text-slate-300 font-mono">Checked in at: {ticket.checked_in_at || 'Earlier'}</div>
                    <div className="text-[11px] text-amber-400 font-bold pt-1">Duplicate check-in blocked.</div>
                  </div>
                ) : (
                  <button
                    onClick={handleAdminCheckIn}
                    disabled={checkingIn}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <Check className="w-5 h-5" />
                    <span>{checkingIn ? 'Processing Check-In...' : 'CHECK IN ATTENDEE'}</span>
                  </button>
                )}
              </div>
            )}

            <div className="text-center pt-4">
              <Link
                href="/book-ticket"
                className="text-xs text-amber-400 font-bold hover:underline"
              >
                ← Back to Ticket Booking
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
