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

      {/* PREMIUM GGL TICKET */}
      <div ref={ticketRef} className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-[24px] border-2 border-amber-400/70 bg-[#08080b] text-white shadow-[0_20px_70px_rgba(0,0,0,.55)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(255,190,30,.16),transparent_32%),radial-gradient(circle_at_55%_20%,rgba(180,0,0,.22),transparent_40%),linear-gradient(115deg,#100607,#08080b_55%,#120b06)]" />
        <div className="relative grid grid-cols-1 md:grid-cols-[1.3fr_2.4fr_1fr] min-h-[350px]">
          <div className="relative flex flex-col items-center justify-center p-4 sm:p-6 border-b md:border-b-0 md:border-r border-amber-400/30 overflow-hidden bg-gradient-to-b from-amber-950/40 via-black to-slate-950">
            <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_center,rgba(220,0,0,.5),transparent_70%)]" />
            <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-[0_0_40px_rgba(255,190,30,0.55)] transition-transform hover:scale-105">
              <img src={GGL_MASCOT_DATA} alt="GGL Mascot" className="w-full h-full object-cover" />
            </div>
            <div className="relative mt-3 text-[10px] font-black tracking-[.28em] text-amber-300 uppercase text-center">LIVE EVENT TICKET</div>
            <div className="relative mt-0.5 text-xs font-bold text-slate-300 text-center">KUCH BHI HO SAKTA HAI!</div>
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
