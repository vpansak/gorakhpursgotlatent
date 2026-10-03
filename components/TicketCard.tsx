'use client';

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { 
  ShieldCheck, 
  Ticket as TicketIcon, 
  QrCode as QrIcon, 
  Lock, 
  CheckCircle2, 
  Download, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { TicketRecord } from '@/lib/ticketTypes';

const GGL_MASCOT_DATA = "/ggl-mascot.jpg";

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

  const [downloading, setDownloading] = useState(false);

  const handleDownloadImage = async () => {
    if (!ticketRef.current || downloading) return;
    setDownloading(true);
    try {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#07080e',
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `GGL-Ticket-${ticket.ticket_id}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Ticket image download failed:', error);
    } finally {
      setDownloading(false);
    }
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

      {/* PREMIUM SLEEK GGL TICKET PASS */}
      <div ref={ticketRef} className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-[22px] border-2 border-amber-400/80 bg-[#08080b] text-white shadow-[0_15px_50px_rgba(0,0,0,0.7)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(255,190,30,0.14),transparent_35%),radial-gradient(circle_at_85%_50%,rgba(180,0,0,0.2),transparent_40%),linear-gradient(115deg,#0c0607,#08080b_50%,#110906)]" />
        
        <div className="relative flex flex-col md:flex-row items-stretch min-h-[250px] sm:min-h-[270px]">
          
          {/* 1. LEFT STUB: QR CODE & ADMIT ONE */}
          <div className="w-full md:w-[220px] p-4 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-dashed border-amber-400/40 bg-black/40 shrink-0 text-center">
            <div className="space-y-0.5">
              <div className="text-amber-300 text-[11px] font-black tracking-[0.25em] uppercase font-barlow">ADMIT ONE</div>
              <div className="text-[9px] text-slate-400 tracking-widest uppercase">SCAN AT VENUE</div>
            </div>

            <div className="my-2 p-2 bg-white rounded-2xl border-2 border-amber-400 shadow-[0_0_20px_rgba(255,190,30,0.25)] inline-block">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt={`QR Code for Ticket ${ticket.ticket_id}`} className="w-28 h-28 sm:w-32 sm:h-32 object-contain" />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-slate-200 rounded-xl animate-pulse" />
              )}
            </div>

            <div className="w-full space-y-1">
              <div className="font-mono font-black text-amber-300 text-xs sm:text-sm tracking-wider">{ticket.ticket_id}</div>
              <div className="h-4 flex gap-[2px] justify-center opacity-80">
                {Array.from({length: 22}).map((_,i)=>(
                  <span key={i} className="bg-amber-300" style={{width: i%4===0 ? 3 : 1, height: '100%'}} />
                ))}
              </div>
              <div className="text-[8px] text-slate-400 tracking-[0.18em] uppercase">18+ • QR VERIFIED ENTRY</div>
            </div>
          </div>

          {/* 2. CENTER MAIN: TICKET & ATTENDEE DETAILS */}
          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
            {/* Header Title */}
            <div className="border-b border-amber-400/20 pb-3">
              <div className="text-[10px] tracking-[0.25em] text-amber-300 font-black uppercase font-barlow">Official Admission Pass</div>
              <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white uppercase font-bebas leading-none mt-0.5">
                GORAKHPUR&apos;S <span className="text-amber-300">GOT LATENT</span>
              </h2>
              <p className="text-[9px] sm:text-[10px] tracking-[0.2em] text-slate-400 mt-1 uppercase">Talent • Comedy • Roast • Vibes</p>
            </div>

            {/* Attendee Info Grid (Clean 2-Column Specs) */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs sm:text-sm my-1">
              <div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">NAME</div>
                <div className="font-extrabold text-white text-sm sm:text-base truncate leading-snug">{ticket.customer_name}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">TICKET ID</div>
                <div className="font-black font-mono text-amber-300 text-sm sm:text-base leading-snug">{ticket.ticket_id}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">MOBILE</div>
                <div className="font-bold text-slate-200 leading-snug">{ticket.mobile}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">PRICE</div>
                <div className="font-black text-amber-300 text-sm sm:text-base leading-snug">{formattedAmount}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">EMAIL</div>
                <div className="font-semibold text-slate-300 text-xs truncate max-w-[180px] leading-snug">{ticket.email}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">BOOKING DATE</div>
                <div className="font-semibold text-slate-300 text-xs leading-snug">{formattedCreated}</div>
              </div>
            </div>

            {/* Footer Status Badges */}
            <div className="flex flex-wrap items-center gap-2 border-t border-amber-400/20 pt-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase font-barlow">
                {ticket.payment_status || 'PAID'}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-barlow ${ticket.checked_in === 1 ? 'bg-amber-400 text-black' : 'bg-white/10 text-slate-300'}`}>
                {ticket.checked_in === 1 ? 'CHECKED IN' : 'NOT CHECKED IN'}
              </span>
            </div>
          </div>

          {/* 3. RIGHT STUB: LOGO & MASCOT BRANDING */}
          <div className="w-full md:w-[200px] p-4 flex flex-col items-center justify-between border-t md:border-t-0 md:border-l border-dashed border-amber-400/40 bg-gradient-to-b from-amber-950/40 via-black to-slate-950 shrink-0 text-center">
            <div className="relative w-full aspect-square max-w-[150px] rounded-2xl overflow-hidden border border-amber-400/50 shadow-[0_0_20px_rgba(255,190,30,0.3)] bg-black/60 p-1 flex items-center justify-center my-auto">
              <img src={GGL_MASCOT_DATA} alt="GGL Mascot" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-0.5 mt-2">
              <div className="text-[10px] font-black tracking-[0.2em] text-amber-300 uppercase font-barlow">LIVE EVENT TICKET</div>
              <div className="text-[11px] font-bold text-slate-200">KUCH BHI HO SAKTA HAI!</div>
            </div>
          </div>

        </div>
      </div>

      {/* ACTION BUTTONS: VIEW / DOWNLOAD / PRINT */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 print:hidden">
          <button
            onClick={handleDownloadImage}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'GENERATING IMAGE...' : 'DOWNLOAD TICKET IMAGE'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
