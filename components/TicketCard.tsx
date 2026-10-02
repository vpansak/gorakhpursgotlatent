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

const GGL_MASCOT_DATA = "data:image/webp;base64,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";

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

      {/* PREMIUM GGL TICKET */}
      <div ref={ticketRef} className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-[24px] border-2 border-amber-400/70 bg-[#08080b] text-white shadow-[0_20px_70px_rgba(0,0,0,.55)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(255,190,30,.16),transparent_32%),radial-gradient(circle_at_55%_20%,rgba(180,0,0,.22),transparent_40%),linear-gradient(115deg,#100607,#08080b_55%,#120b06)]" />
        <div className="relative grid grid-cols-1 md:grid-cols-[1.15fr_2.4fr_1fr] min-h-[330px]">
          <div className="relative flex flex-col items-center justify-center p-5 border-b md:border-b-0 md:border-r border-amber-400/30 overflow-hidden">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(220,0,0,.32),transparent_65%)]" />
            <img src={GGL_MASCOT_DATA} alt="GGL mascot" className="relative w-36 h-36 sm:w-44 sm:h-44 object-contain drop-shadow-[0_0_22px_rgba(255,190,30,.55)]" />
            <div className="relative mt-2 text-[10px] font-black tracking-[.28em] text-amber-300 uppercase">LIVE EVENT TICKET</div>
            <div className="relative mt-1 text-xs font-bold text-slate-300">KUCH BHI HO SAKTA HAI!</div>
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-4 border-b border-amber-400/20 pb-4">
              <div>
                <div className="text-[10px] tracking-[.28em] text-amber-300 font-black uppercase">Official Admission Pass</div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">GORAKHPUR&apos;S <span className="text-amber-300">GOT LATENT</span></h2>
                <p className="text-[10px] tracking-[.2em] text-slate-400 mt-1 uppercase">Talent • Comedy • Roast • Vibes</p>
              </div>
              <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black/40 border border-amber-400/30 p-2">
                <img src="/ggl-logo.png" alt="GGL" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-5 text-sm">
              <div><div className="text-[9px] uppercase tracking-widest text-slate-500">Name</div><div className="font-extrabold truncate">{ticket.customer_name}</div></div>
              <div><div className="text-[9px] uppercase tracking-widest text-slate-500">Ticket ID</div><div className="font-black font-mono text-amber-300">{ticket.ticket_id}</div></div>
              <div><div className="text-[9px] uppercase tracking-widest text-slate-500">Mobile</div><div className="font-semibold">{ticket.mobile}</div></div>
              <div><div className="text-[9px] uppercase tracking-widest text-slate-500">Price</div><div className="font-black text-amber-300">{formattedAmount}</div></div>
              <div><div className="text-[9px] uppercase tracking-widest text-slate-500">Email</div><div className="font-semibold text-xs truncate">{ticket.email}</div></div>
              <div><div className="text-[9px] uppercase tracking-widest text-slate-500">Booking Date</div><div className="font-semibold text-xs">{formattedCreated}</div></div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-amber-400/20 pt-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase">{ticket.payment_status || 'PAID'}</span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${ticket.checked_in === 1 ? 'bg-amber-400 text-black' : 'bg-white/10 text-slate-300'}`}>{ticket.checked_in === 1 ? 'CHECKED IN' : 'NOT CHECKED IN'}</span>
              <span className="text-[9px] text-slate-500 ml-auto uppercase tracking-widest">18+ • QR Verified Entry</span>
            </div>
          </div>
          <div className="relative p-5 flex flex-col items-center justify-between border-t md:border-t-0 md:border-l border-dashed border-amber-400/50 bg-black/20">
            <div className="text-center"><div className="text-amber-300 text-xs font-black tracking-[.25em] uppercase">ADMIT ONE</div><div className="text-[9px] text-slate-500 tracking-widest mt-1">SCAN AT VENUE</div></div>
            <div className="p-2 bg-white rounded-2xl border-2 border-amber-400 shadow-[0_0_24px_rgba(255,190,30,.2)]">
              {qrCodeDataUrl ? <img src={qrCodeDataUrl} alt={`QR Code for Ticket ${ticket.ticket_id}`} className="w-32 h-32 object-contain" /> : <div className="w-32 h-32 bg-slate-200 rounded-xl animate-pulse" />}
            </div>
            <div className="w-full text-center">
              <div className="font-mono font-black text-amber-300 text-sm tracking-wider">{ticket.ticket_id}</div>
              <div className="mt-2 h-5 flex gap-[2px] justify-center opacity-80">{Array.from({length: 24}).map((_,i)=><span key={i} className="bg-amber-300" style={{width: i%4===0 ? 3 : 1, height: '100%'}} />)}</div>
              <div className="text-[8px] text-slate-500 tracking-[.2em] mt-1">LIVE • LAUGH • VIBE • EXPERIENCE</div>
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
