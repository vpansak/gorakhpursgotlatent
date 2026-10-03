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
      const images = Array.from(ticketRef.current.querySelectorAll('img'));
      await Promise.all(
        images.map(
          (img) =>
            new Promise((res) => {
              if (img.complete && img.naturalWidth !== 0) {
                res(true);
              } else {
                img.onload = () => res(true);
                img.onerror = () => res(true);
                setTimeout(() => res(true), 1200);
              }
            })
        )
      );

      const renderPromise = html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#08080b',
        logging: false,
        imageTimeout: 2000,
      });

      const timeoutPromise = new Promise<null>((res) => setTimeout(() => res(null), 4000));
      const canvas = await Promise.race([renderPromise, timeoutPromise]);

      if (canvas && canvas instanceof HTMLCanvasElement) {
        const link = document.createElement('a');
        link.download = `GGL-Ticket-${ticket.ticket_id}.png`;
        link.href = canvas.toDataURL('image/png', 0.95);
        link.click();
      } else {
        console.warn('Primary html2canvas render timed out, using fast fallback render...');
        const fallbackCanvas = await html2canvas(ticketRef.current, {
          scale: 1.5,
          backgroundColor: '#08080b',
          logging: false,
          imageTimeout: 1000,
        });
        const link = document.createElement('a');
        link.download = `GGL-Ticket-${ticket.ticket_id}.png`;
        link.href = fallbackCanvas.toDataURL('image/png', 0.9);
        link.click();
      }
    } catch (error) {
      console.error('Ticket image download failed:', error);
      alert('Download notice: Please tap Download Ticket Image again.');
    } finally {
      setDownloading(false);
    }
  };

  const formattedAmount = ticket.amount ? `₹${ticket.amount}` : '₹149';
  const formattedCreated = ticket.created_at 
    ? new Date(ticket.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : '03 October 2026';

  return (
    <div className="space-y-4 w-full">
      {/* Demo Badge Banner if ticket is sample demo */}
      {ticket.is_demo && (
        <div className="bg-amber-500/20 border border-amber-500/50 rounded-2xl p-2.5 text-center flex items-center justify-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>SAMPLE DEMO TICKET PREVIEW — FOR DEVELOPMENT & PREVIEW ONLY</span>
        </div>
      )}

      {/* SLEEK WIDE GGL TICKET PASS */}
      <div ref={ticketRef} className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-[20px] border-2 border-amber-400/80 bg-[#08080b] text-white shadow-[0_15px_50px_rgba(0,0,0,0.7)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(255,190,30,0.15),transparent_35%),radial-gradient(circle_at_85%_50%,rgba(180,0,0,0.2),transparent_40%),linear-gradient(115deg,#0c0607,#08080b_50%,#110906)]" />
        
        <div className="relative flex flex-col md:flex-row items-stretch min-h-[220px] sm:min-h-[240px]">
          
          {/* 1. LEFT STUB: LOGO & MASCOT ARTWORK ("lest me logo") */}
          <div className="w-full md:w-[220px] lg:w-[240px] p-3 sm:p-4 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-dashed border-amber-400/40 bg-gradient-to-b from-amber-950/50 via-black to-slate-950 shrink-0 text-center">
            <div className="relative w-full h-[140px] sm:h-[150px] rounded-xl overflow-hidden border border-amber-400/50 shadow-[0_0_20px_rgba(255,190,30,0.3)] bg-black/60 p-1 flex items-center justify-center my-auto">
              <img src={GGL_MASCOT_DATA} alt="GGL Mascot" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-0.5 mt-1.5">
              <div className="text-[10px] font-black tracking-[0.2em] text-amber-300 uppercase font-barlow">LIVE EVENT TICKET</div>
              <div className="text-[11px] font-bold text-slate-200">KUCH BHI HO SAKTA HAI!</div>
            </div>
          </div>

          {/* 2. CENTER MAIN: ATTENDEE & TICKET DETAILS ("bech me details") */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-3">
            {/* Header Title */}
            <div className="flex items-center justify-between gap-2 border-b border-amber-400/20 pb-2.5">
              <div>
                <div className="text-[9px] sm:text-[10px] tracking-[0.25em] text-amber-300 font-black uppercase font-barlow">Official Admission Pass</div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white uppercase font-bebas leading-none mt-0.5">
                  GORAKHPUR&apos;S <span className="text-amber-300">GOT LATENT</span>
                </h2>
                <p className="text-[9px] tracking-[0.2em] text-slate-400 mt-0.5 uppercase">Talent • Comedy • Roast • Vibes</p>
              </div>

              <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-black/50 border border-amber-400/30 p-1.5">
                <img src="/ggl-logo.png" alt="GGL" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Attendee Info Grid (Clean 2-Column Specs) */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm my-0.5">
              <div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">NAME</div>
                <div className="font-extrabold text-white text-xs sm:text-sm truncate leading-tight">{ticket.customer_name}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">TICKET ID</div>
                <div className="font-black font-mono text-amber-300 text-xs sm:text-sm leading-tight">{ticket.ticket_id}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">MOBILE</div>
                <div className="font-bold text-slate-200 text-xs leading-tight">{ticket.mobile}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">PRICE</div>
                <div className="font-black text-amber-300 text-xs sm:text-sm leading-tight">{formattedAmount}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">EMAIL</div>
                <div className="font-semibold text-slate-300 text-[11px] truncate max-w-[170px] leading-tight">{ticket.email}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">BOOKING DATE</div>
                <div className="font-semibold text-slate-300 text-[11px] leading-tight">{formattedCreated}</div>
              </div>
            </div>

            {/* Footer Status Badges */}
            <div className="flex flex-wrap items-center gap-2 border-t border-amber-400/20 pt-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[9px] font-black uppercase font-barlow">
                {ticket.payment_status || 'PAID'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-barlow ${ticket.checked_in === 1 ? 'bg-amber-400 text-black' : 'bg-white/10 text-slate-300'}`}>
                {ticket.checked_in === 1 ? 'CHECKED IN' : 'NOT CHECKED IN'}
              </span>
            </div>
          </div>

          {/* 3. RIGHT STUB: QR CODE & TICKET CODE ("right me qr aur code") */}
          <div className="w-full md:w-[210px] lg:w-[230px] p-3 sm:p-4 flex flex-col items-center justify-between border-t md:border-t-0 md:border-l border-dashed border-amber-400/40 bg-black/50 shrink-0 text-center">
            <div className="space-y-0.5">
              <div className="text-amber-300 text-[10px] font-black tracking-[0.25em] uppercase font-barlow">ADMIT ONE</div>
              <div className="text-[8px] text-slate-400 tracking-widest uppercase">SCAN AT VENUE</div>
            </div>

            <div className="my-1.5 p-1.5 bg-white rounded-2xl border-2 border-amber-400 shadow-[0_0_20px_rgba(255,190,30,0.25)] inline-block">
              {qrCodeDataUrl ? (
                <img src={qrCodeDataUrl} alt={`QR Code for Ticket ${ticket.ticket_id}`} className="w-24 h-24 sm:w-28 sm:h-28 object-contain" />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-200 rounded-xl animate-pulse" />
              )}
            </div>

            <div className="w-full space-y-1">
              <div className="font-mono font-black text-amber-300 text-xs sm:text-sm tracking-wider">{ticket.ticket_id}</div>
              <div className="h-3.5 flex gap-[2px] justify-center opacity-80">
                {Array.from({length: 22}).map((_,i)=>(
                  <span key={i} className="bg-amber-300" style={{width: i%4===0 ? 3 : 1, height: '100%'}} />
                ))}
              </div>
              <div className="text-[8px] text-slate-400 tracking-[0.18em] uppercase">18+ • QR VERIFIED ENTRY</div>
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
