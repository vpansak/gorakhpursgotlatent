'use client';

import React, { useState, useEffect } from 'react';
import { Ticket as TicketIcon, CheckCircle2, AlertCircle, ShieldCheck, Lock } from 'lucide-react';
import TicketCard from '@/components/TicketCard';
import { TicketRecord } from '@/lib/ticketTypes';
import { useLeadCapture } from '@/lib/leadCapture';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function BookTicketPage() {
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [instagramId, setInstagramId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedTicket, setConfirmedTicket] = useState<TicketRecord | null>(null);

  const totalAmount = quantity * 149;

  useLeadCapture({
    source: 'book-ticket',
    data: { customerName, mobile, email, instagramId, quantity, termsAgreed },
    customerName,
    mobile,
    email,
    instagramId,
    quantity,
  });

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !mobile.trim()) {
      setErrorMsg('Please enter both your Full Name and Mobile Number.');
      return;
    }

    if (!termsAgreed) {
      setErrorMsg('Please accept the terms and conditions.');
      return;
    }

    setLoading(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const orderRes = await fetch('/api/tickets/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, mobile, email, instagramId, quantity, termsAgreed }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize ticket order.');
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amountPaise || totalAmount * 100,
        currency: 'INR',
        name: "Gorakhpur's Got Latent",
        description: `Show Pass (${quantity} Ticket${quantity > 1 ? 's' : ''})`,
        image: '/logo.png',
        order_id: orderData.razorpayOrderId,
        prefill: { name: customerName, email: email || '', contact: mobile },
        theme: { color: '#FFD700' },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/tickets/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                bookingId: orderData.bookingId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customerName,
                mobile,
                email,
                instagramId,
                quantity,
                amount: totalAmount,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success || !verifyData.ticket) {
              throw new Error(verifyData.error || 'Server ticket issuance failed.');
            }

            setConfirmedTicket(verifyData.ticket);
          } catch (verifyErr: any) {
            setErrorMsg(verifyErr.message || 'Payment verification failed.');
          } finally {
            setLoading(false);
          }
        },
        modal: { ondismiss: function () { setLoading(false); } },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setErrorMsg(`Payment Failed: ${response.error.description || 'Transaction declined'}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
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
          <button onClick={() => {
            setConfirmedTicket(null);
            setCustomerName('');
            setMobile('');
            setEmail('');
            setInstagramId('');
            setQuantity(1);
            setTermsAgreed(false);
          }} className="w-full py-3 rounded-xl border border-amber-500/40 text-amber-300 font-bold">
            Book Another Ticket
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07080e] text-white px-4 py-4 sm:py-6">
      <div className="max-w-xl mx-auto space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">Book GGL Ticket</h1>
          <p className="text-sm text-slate-400 mt-1.5">
            <strong className="text-amber-400">₹149 / person</strong>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400"><TicketIcon className="w-5 h-5" /></div>
            <div>
              <span className="font-extrabold text-white block">Official Ticket Pass</span>
              <span className="text-slate-300 text-xs">₹149 per ticket</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block uppercase">Total Price</span>
            <span className="text-xl font-mono font-black text-amber-300">₹{totalAmount}</span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-sm flex gap-2 items-center">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">Full Name *</label>
            <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Enter your full name" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-amber-500/50 text-white outline-none focus:border-amber-400" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5">Mobile Number (WhatsApp) *</label>
            <input type="tel" required inputMode="numeric" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit mobile number" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-amber-500/50 text-white outline-none focus:border-amber-400" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address <span className="text-[10px] text-slate-500 font-normal lowercase">(optional)</span></label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email (optional)" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Instagram Handle <span className="text-[10px] text-slate-500 font-normal lowercase">(optional)</span></label>
            <input type="text" value={instagramId} onChange={(e) => setInstagramId(e.target.value)} placeholder="@username (optional)" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Number of Tickets *</label>
            <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-bold outline-none focus:border-amber-500">
              <option value={1}>1 Ticket (₹149)</option>
              <option value={2}>2 Tickets (₹298)</option>
              <option value={3}>3 Tickets (₹447)</option>
              <option value={4}>4 Tickets (₹596)</option>
              <option value={5}>5 Tickets (₹745)</option>
            </select>
          </div>

          <label className="flex items-start gap-3 text-xs text-slate-300 pt-2 cursor-pointer">
            <input type="checkbox" required checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 accent-amber-500" />
            <span>I confirm my details are correct, I am 18+, and agree to the event terms and conditions.</span>
          </label>

          <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(255,215,0,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
            <Lock className="w-4 h-4 text-black" />
            <span>{loading ? 'OPENING RAZORPAY...' : `PAY ₹${totalAmount} & BOOK TICKET VIA RAZORPAY`}</span>
          </button>

          <div className="text-center pt-1">
            <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure 256-Bit SSL Encrypted Razorpay Checkout (UPI, GPay, Cards)
            </span>
          </div>
        </form>
      </div>
    </main>
  );
}
