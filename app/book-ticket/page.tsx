'use client';

import React, { useState } from 'react';
import { Ticket as TicketIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import TicketCard from '@/components/TicketCard';
import { TicketRecord, validateAgeIs18Plus } from '@/lib/ticketTypes';

export default function BookTicketPage() {
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [instagramId, setInstagramId] = useState('');
  const [dob, setDob] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedTicket, setConfirmedTicket] = useState<TicketRecord | null>(null);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !mobile.trim() || !email.trim() || !instagramId.trim() || !dob) {
      setErrorMsg('Please fill all required fields.');
      return;
    }

    if (!termsAgreed) {
      setErrorMsg('Please accept the terms and conditions.');
      return;
    }

    const ageCheck = validateAgeIs18Plus(dob);
    if (!ageCheck.is18Plus) {
      setErrorMsg('You must be 18 or above to book this ticket.');
      return;
    }

    setLoading(true);

    try {
      const orderRes = await fetch('/api/tickets/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, mobile, email, instagramId, dob, quantity, termsAgreed }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize ticket booking.');
      }

      const verifyRes = await fetch('/api/tickets/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: orderData.bookingId,
          razorpay_order_id: orderData.razorpayOrderId || `free_order_${orderData.bookingId}`,
          razorpay_payment_id: `free_pass_${Date.now()}`,
          razorpay_signature: 'free_verified_signature',
          customerName,
          mobile,
          email,
          instagramId,
          dob: ageCheck.formattedDob,
          quantity,
          amount: 0,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success || !verifyData.ticket) {
        throw new Error(verifyData.error || 'Server ticket issuance failed.');
      }

      setConfirmedTicket(verifyData.ticket);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (confirmedTicket) {
    return (
      <main className="min-h-screen bg-[#07080e] text-white px-4 py-8">
        <div className="max-w-4xl sm:max-w-5xl mx-auto space-y-6">
          <div className="text-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-3" />
            <h1 className="text-3xl font-bold">Ticket Confirmed</h1>
            <p className="text-sm text-emerald-300 mt-2">Your GGL ticket has been booked successfully.</p>
          </div>
          <TicketCard ticket={confirmedTicket} showActions={true} />
          <button
            onClick={() => {
              setConfirmedTicket(null);
              setCustomerName('');
              setMobile('');
              setEmail('');
              setInstagramId('');
              setDob('');
              setQuantity(1);
              setTermsAgreed(false);
            }}
            className="w-full py-3 rounded-xl border border-amber-500/40 text-amber-300 font-bold"
          >
            Book Another Ticket
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07080e] text-white px-4 py-6 sm:py-10">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Book Your GGL Ticket</h1>
          <p className="text-sm text-slate-400 mt-2">Fill the details below. Attendees must be 18+.</p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-sm flex gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Full Name *</label>
            <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Enter your full name" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Mobile Number *</label>
            <input type="tel" required inputMode="numeric" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit mobile number" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Email *</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Instagram ID *</label>
            <input type="text" required value={instagramId} onChange={(e) => setInstagramId(e.target.value)} placeholder="@username" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Date of Birth *</label>
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => {
                const value = e.target.value;
                setDob(value);
                setErrorMsg(value && !validateAgeIs18Plus(value).is18Plus ? 'You must be 18 or above to book this ticket.' : '');
              }}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Number of Tickets *</label>
            <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500">
              <option value={1}>1 Ticket</option>
              <option value={2}>2 Tickets</option>
              <option value={3}>3 Tickets</option>
              <option value={4}>4 Tickets</option>
              <option value={5}>5 Tickets</option>
            </select>
          </div>

          <label className="flex items-start gap-3 text-sm text-slate-300 pt-2 cursor-pointer">
            <input type="checkbox" required checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} className="mt-1 w-4 h-4 accent-amber-500" />
            <span>I confirm my details are correct and agree to the event terms and conditions.</span>
          </label>

          <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-amber-400 text-black font-black text-sm uppercase disabled:opacity-50 flex items-center justify-center gap-2">
            <TicketIcon className="w-5 h-5" />
            {loading ? 'Generating Ticket...' : 'Book Ticket'}
          </button>
        </form>
      </div>
    </main>
  );
}
