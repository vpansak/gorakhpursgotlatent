'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { QrCode, Search, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function TicketVerificationPage() {
  const [ticketInput, setTicketInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleVerify = async (action: 'LOOKUP' | 'CHECK_IN' = 'LOOKUP') => {
    if (!ticketInput.trim()) {
      setError('Please scan QR code or enter Ticket ID');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/verify-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketQuery: ticketInput.trim(),
          action,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error verifying ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-amber-400" /> GATE VERIFICATION SCANNER
        </div>
        <h1 className="text-3xl font-black text-white">Staff Ticket Gate Verification</h1>
        <p className="text-xs sm:text-sm text-slate-300">Scan QR pass or enter Ticket ID to approve venue entry.</p>
      </div>

      {/* Input Box */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <QrCode className="w-5 h-5 text-amber-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="Scan QR or enter GGL-TKT-XXXXXX"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono uppercase text-sm sm:text-base focus:border-amber-400 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleVerify('LOOKUP')}
            />
          </div>

          <button
            onClick={() => handleVerify('LOOKUP')}
            disabled={loading}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'VERIFY TICKET'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-semibold flex items-center gap-2">
          <XCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Display Banner */}
      {result && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-6">
          {/* Status Alert Box */}
          {result.status === 'VALID' && (
            <div className="p-6 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-300 space-y-2 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h2 className="text-2xl font-black text-white">VALID TICKET PASS</h2>
              <p className="text-xs">{result.message}</p>
            </div>
          )}

          {result.status === 'CHECKED_IN_SUCCESS' && (
            <div className="p-6 rounded-2xl bg-emerald-500/30 border-2 border-emerald-400 text-white space-y-2 text-center shadow-[0_0_40px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h2 className="text-3xl font-black">ENTRY APPROVED!</h2>
              <p className="text-xs text-emerald-200">Ticket has been marked as USED in the database.</p>
            </div>
          )}

          {result.status === 'ALREADY_USED' && (
            <div className="p-6 rounded-2xl bg-red-500/20 border-2 border-red-500 text-red-300 space-y-2 text-center">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
              <h2 className="text-2xl font-black text-white">ALREADY USED TICKET!</h2>
              <p className="text-xs font-semibold">{result.message}</p>
            </div>
          )}

          {result.status === 'INVALID' && (
            <div className="p-6 rounded-2xl bg-red-500/20 border-2 border-red-500 text-red-300 space-y-2 text-center">
              <XCircle className="w-12 h-12 text-red-400 mx-auto" />
              <h2 className="text-2xl font-black text-white">INVALID TICKET!</h2>
              <p className="text-xs">{result.message}</p>
            </div>
          )}

          {/* Ticket Information Table */}
          {result.ticket && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">TICKET ID</span>
                  <span className="text-amber-300 font-mono font-bold text-sm">{result.ticket.ticket_number}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">TIER CATEGORY</span>
                  <span className="text-white font-bold">{result.ticket.category_name}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">ATTENDEE NAME</span>
                  <span className="text-white font-bold">{result.ticket.customer_name}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">ATTENDEE PHONE</span>
                  <span className="text-white font-bold">{result.ticket.customer_phone}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">EVENT</span>
                  <span className="text-white font-bold">{result.ticket.event_title}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">TICKET STATUS</span>
                  <span className={`font-bold uppercase ${result.ticket.status === 'VALID' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {result.ticket.status}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {result.ticket.status === 'VALID' && result.status !== 'CHECKED_IN_SUCCESS' && (
                <div className="pt-4">
                  <button
                    onClick={() => handleVerify('CHECK_IN')}
                    className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5" /> MARK AS USED & APPROVE ENTRY
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
