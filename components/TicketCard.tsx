'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { 
  ShieldCheck, 
  Ticket as TicketIcon, 
  QrCode as QrIcon, 
  Lock, 
  CheckCircle2, 
  Download, 
  Printer, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { TicketRecord } from '@/lib/ticketsStore';

interface TicketCardProps {
  ticket: TicketRecord;
  showActions?: boolean;
}

export default function TicketCard({ ticket, showActions = true }: TicketCardProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function generateQr() {
      try {
        const verifyUrl = `https://gkpgotlatent.in/ticket/verify/${ticket.ticket_id}`;
        const url = await QRCode.toDataURL(verifyUrl, {
          width: 250,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
        setQrCodeDataUrl(url);
      } catch (err) {
        console.warn('QR Code generation notice:', err);
      }
    }
    generateQr();
  }, [ticket]);

  const handlePrint = () => {
    window.print();
  };

  const formattedAmount = ticket.amount ? `₹${ticket.amount}` : '₹149';
  const formattedDob = ticket.date_of_birth ? ticket.date_of_birth : '15 August 2000';
  const formattedCreated = ticket.created_at 
    ? new Date(ticket.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : '02 October 2026';

  return (
    <div className="space-y-4">
      {/* Demo Badge Banner if ticket is sample demo */}
      {ticket.is_demo && (
        <div className="bg-amber-500/20 border border-amber-500/50 rounded-2xl p-3 text-center flex items-center justify-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>SAMPLE DEMO TICKET PREVIEW — FOR DEVELOPMENT & PREVIEW ONLY</span>
        </div>
      )}

      {/* TICKET CONTAINER - EXACT MATCH FOR UPLOADED GRAPHIC TEMPLATE */}
      <div 
        ref={ticketRef}
        className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border-2 border-amber-500/50 bg-[#07080e] shadow-[0_0_50px_rgba(255,215,0,0.25)] text-slate-100 print:shadow-none print:border-black"
      >
        {/* Background Curtain and Ambient Red Lighting Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-[#0a0c14] to-[#07080e] pointer-events-none" />
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
          
          {/* LEFT PANEL: GGL MASCOT LOGO & EVENT STAGE ARTWORK (Col 4) */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between items-center text-center border-b lg:border-b-0 lg:border-r border-amber-500/30 bg-gradient-to-b from-red-950/60 via-slate-950/80 to-[#07080e] relative overflow-hidden">
            {/* Curtain Lighting FX */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-amber-500/20 to-transparent pointer-events-none" />

            <div className="space-y-4 w-full flex flex-col items-center my-auto">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 transition-transform hover:scale-105">
                <Image
                  src="/ggl-logo.png"
                  alt="Gorakhpur's Got Latent Logo"
                  fill
                  className="object-contain filter drop-shadow-[0_0_20px_rgba(255,215,0,0.7)]"
                  priority
                />
              </div>

              <div className="space-y-1">
                <h2 className="font-bebas text-2xl sm:text-3xl tracking-wide uppercase gold-gradient-text">
                  GORAKHPUR&apos;S GOT LATENT
                </h2>
                <div className="text-[11px] font-extrabold text-amber-300 uppercase tracking-widest border-t border-b border-amber-500/30 py-1">
                  LIVE EVENT TICKET
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-4">
              KUCH BHI HO SAKTA HAI!
            </div>
          </div>

          {/* MIDDLE PANEL: ATTENDEE & BOOKING DETAILS (Col 5) */}
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-amber-500/30">
            {/* ATTENDEE PERSONAL FIELDS */}
            <div className="space-y-2 text-xs sm:text-sm font-sans">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400 font-bold">Name</span>
                <span className="text-white font-extrabold text-right">{ticket.customer_name}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400 font-bold">Mobile</span>
                <span className="text-slate-200 font-bold font-mono">{ticket.mobile}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400 font-bold">Email</span>
                <span className="text-slate-200 font-mono text-xs truncate max-w-[200px]">{ticket.email}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400 font-bold">Instagram ID</span>
                <span className="text-pink-400 font-bold">{ticket.instagram_id}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400 font-bold">Date of Birth</span>
                <span className="text-slate-200 font-semibold">{formattedDob}</span>
              </div>
            </div>

            {/* TICKET DETAILS DIVIDER */}
            <div className="space-y-2 text-xs sm:text-sm pt-2">
              <div className="flex items-center justify-between py-1 border-b border-amber-500/20">
                <span className="text-amber-400 font-extrabold">Ticket ID</span>
                <span className="text-amber-300 font-black font-mono tracking-wider">{ticket.ticket_id}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-amber-500/20">
                <span className="text-slate-400 font-bold">Ticket Price</span>
                <span className="text-white font-black">{formattedAmount}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-amber-500/20">
                <span className="text-slate-400 font-bold">Payment Status</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[11px] uppercase tracking-wider">
                  {ticket.payment_status}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-amber-500/20">
                <span className="text-slate-400 font-bold">Entry Status</span>
                <span className={`px-2.5 py-0.5 rounded-full text-white font-black text-[11px] uppercase tracking-wider ${
                  ticket.checked_in === 1 ? 'bg-amber-500 text-black' : 'bg-slate-700 text-slate-200'
                }`}>
                  {ticket.checked_in === 1 ? 'CHECKED IN' : 'NOT CHECKED IN'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-amber-500/20">
                <span className="text-slate-400 font-bold">Booking Date</span>
                <span className="text-slate-300 text-xs">{formattedCreated}</span>
              </div>
            </div>

            {/* 4 ICON BADGES AT BOTTOM */}
            <div className="grid grid-cols-4 gap-2 pt-3 text-center border-t border-slate-800">
              <div className="flex flex-col items-center space-y-1">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-[9px] text-slate-400 font-extrabold uppercase leading-tight">SECURE PAYMENT</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <TicketIcon className="w-4 h-4 text-amber-400" />
                <span className="text-[9px] text-slate-400 font-extrabold uppercase leading-tight">INSTANT DIGITAL</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="text-[9px] text-slate-400 font-extrabold uppercase leading-tight">UNIQUE ID</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <QrIcon className="w-4 h-4 text-amber-400" />
                <span className="text-[9px] text-slate-400 font-extrabold uppercase leading-tight">QR CODE ENTRY</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: STUB WITH QR CODE & VERIFICATION BADGE (Col 3) */}
          <div className="lg:col-span-3 p-6 flex flex-col justify-between items-center text-center bg-gradient-to-b from-[#0a0c14] to-[#05060a] relative overflow-hidden">
            {/* Header Stub */}
            <div className="space-y-1">
              <div className="text-[10px] text-amber-400 font-black tracking-widest uppercase font-barlow flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> GGL <Sparkles className="w-3 h-3 text-amber-400" />
              </div>
              <div className="text-[11px] font-extrabold text-white uppercase tracking-wider">
                GORAKHPUR&apos;S GOT LATENT
              </div>
              <div className="inline-block px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-widest mt-1">
                ADMIT ONE
              </div>
            </div>

            {/* Dynamic QR Code Canvas/Image */}
            <div className="my-4 p-2 bg-white rounded-2xl border-2 border-amber-400 shadow-xl relative group">
              {qrCodeDataUrl ? (
                // eslint-disable-next-next/no-img-element
                <img
                  src={qrCodeDataUrl}
                  alt={`QR Code for Ticket ${ticket.ticket_id}`}
                  className="w-36 h-36 sm:w-40 sm:h-40 object-contain"
                />
              ) : (
                <div className="w-36 h-36 sm:w-40 sm:h-40 bg-slate-200 animate-pulse rounded-xl flex items-center justify-center text-black text-xs font-bold">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Ticket ID & Price Tag */}
            <div className="w-full space-y-2">
              <div className="bg-amber-500/15 border border-amber-500/40 rounded-xl py-1.5 px-2">
                <div className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">TICKET ID</div>
                <div className="text-xs font-black text-amber-300 font-mono tracking-wider">{ticket.ticket_id}</div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="font-bebas text-2xl text-white tracking-wide">{formattedAmount}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] uppercase">
                  PAID
                </span>
              </div>

              {/* Decorative Barcode */}
              <div className="pt-2 opacity-70">
                <div className="h-6 w-full bg-gradient-to-r from-white via-slate-400 to-white flex justify-between px-1 items-center font-mono text-[7px] text-black font-bold tracking-widest overflow-hidden">
                  |||||| ||| ||||||| |||| |||||| ||| ||||||
                </div>
                <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest pt-1">
                  LIVE &bull; LAUGH &bull; VIBE &bull; EXPERIENCE
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ACTION BUTTONS: VIEW / DOWNLOAD / PRINT */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 print:hidden">
          <button
            onClick={handlePrint}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT / DOWNLOAD TICKET</span>
          </button>
        </div>
      )}
    </div>
  );
}
