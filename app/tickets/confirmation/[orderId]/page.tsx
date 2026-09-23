import { db } from '@/lib/db';
import { formatINR } from '@/lib/helpers';
import Image from 'next/image';
import Link from 'next/link';
import QRCode from 'qrcode';
import { CheckCircle2, Ticket, Calendar, MapPin, Download, Printer, ArrowRight } from 'lucide-react';

async function getOrderConfirmation(orderId: string) {
  try {
    const order = await db.queryOne<any>(`
      SELECT o.*, e.title as event_title, e.event_date, e.start_time, e.venue_name, e.venue_address, e.city
      FROM ticket_orders o
      JOIN events e ON o.event_id = e.id
      WHERE o.id = ? OR o.order_number = ?
    `, [orderId, orderId]);

    if (!order) return null;

    const tickets = await db.query<any>(`
      SELECT t.*, c.name as category_name
      FROM tickets t
      JOIN ticket_categories c ON t.category_id = c.id
      WHERE t.order_id = ?
    `, [order.id]);

    // Generate QR Code data URL for each ticket (containing secure hash verification reference)
    const ticketsWithQr = await Promise.all(
      tickets.map(async (t: any) => {
        const qrUrl = await QRCode.toDataURL(t.qr_code_hash, {
          width: 240,
          margin: 1,
          color: { dark: '#000000', light: '#FFFFFF' },
        });
        return { ...t, qrDataUrl: qrUrl };
      })
    );

    return { order, tickets: ticketsWithQr };
  } catch (err) {
    return null;
  }
}

export default async function OrderConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = await params;
  const data = await getOrderConfirmation(resolvedParams.orderId);

  if (!data || !data.order) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Order Not Found</h2>
        <Link href="/tickets" className="text-amber-400 underline text-sm">Return to Tickets</Link>
      </div>
    );
  }

  const { order, tickets } = data;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">BOOKING CONFIRMED!</h1>
        <p className="text-xs sm:text-sm text-slate-300">Your digital ticket pass has been issued. Show QR code at gate entrance.</p>
      </div>

      {/* Ticket Pass List */}
      <div className="space-y-8">
        {tickets.map((t: any, index: number) => (
          <div
            key={t.id}
            className="relative rounded-3xl bg-slate-950 border-2 border-amber-500/40 overflow-hidden shadow-[0_0_40px_rgba(255,215,0,0.2)]"
          >
            {/* Ticket Header Brand */}
            <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 px-6 py-4 flex items-center justify-between text-black">
              <div className="flex items-center gap-3">
                <div className="relative w-36 h-10">
                  <Image src="/logo.png" alt="Gorakhpur's Got Latent" fill className="object-contain" />
                </div>
                <span className="font-black text-xs uppercase tracking-widest bg-black text-amber-300 px-2.5 py-1 rounded-lg">
                  OFFICIAL ENTRY PASS
                </span>
              </div>
              <span className="font-mono text-xs font-bold">
                PASS #{index + 1} OF {tickets.length}
              </span>
            </div>

            {/* Ticket Body */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Left Details */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{t.category_name}</span>
                  <h3 className="text-2xl font-black text-white mt-1">{order.event_title}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 block font-semibold">TICKET ID:</span>
                    <span className="text-amber-300 font-mono font-bold text-sm">{t.ticket_number}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">ORDER ID:</span>
                    <span className="text-white font-mono font-bold">{order.order_number}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">EVENT DATE:</span>
                    <span className="text-white font-bold">{order.event_date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">TIME:</span>
                    <span className="text-white font-bold">{order.start_time} IST</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">ATTENDEE NAME:</span>
                    <span className="text-white font-bold">{t.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">PAYMENT STATUS:</span>
                    <span className="text-emerald-400 font-bold uppercase">{order.payment_status}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 pt-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>{order.venue_name}, {order.venue_address}, {order.city}</span>
                </div>
              </div>

              {/* Right QR Code Pass */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-black space-y-2 text-center shadow-inner">
                <Image src={t.qrDataUrl} alt="Ticket QR Code" width={180} height={180} className="object-contain" />
                <span className="text-[10px] font-mono font-bold text-slate-600">GATE VERIFICATION QR</span>
                <span className="text-xs font-black text-slate-900 uppercase font-mono">{t.ticket_number}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href="/"
          className="px-6 py-3.5 rounded-xl bg-amber-500 text-black font-extrabold text-sm flex items-center gap-2"
        >
          Return to Homepage <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
