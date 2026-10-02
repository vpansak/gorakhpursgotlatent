'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Ticket as TicketIcon, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  QrCode as QrIcon, 
  Zap, 
  Flame, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  AtSign, 
  ArrowRight,
  Eye,
  ChevronDown
} from 'lucide-react';
import TicketCard from '@/components/TicketCard';
import { TicketRecord, validateAgeIs18Plus } from '@/lib/ticketTypes';

export default function BookTicketPage() {
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [instagramId, setInstagramId] = useState('');
  const [dob, setDob] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [termsAgreed, setTermsAgreed] = useState(false);

  // UI Flow State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedTicket, setConfirmedTicket] = useState<TicketRecord | null>(null);
  const [showDemoPreview, setShowDemoPreview] = useState(false);

  const unitPrice = 149;
  const totalPrice = unitPrice * Math.max(1, quantity);

  // Demo Ticket Data (Requirement #9)
  const demoTicketSample: TicketRecord = {
    id: 'tck-demo-123456',
    ticket_id: 'GGLT123456',
    booking_id: 'ord-demo-123456',
    customer_name: 'Rahul Sharma',
    mobile: '9876543210',
    email: 'rahul.demo@example.com',
    instagram_id: '@rahul_demo',
    date_of_birth: '15 August 2000',
    quantity: 1,
    amount: 149,
    razorpay_order_id: 'rzp_demo_order',
    razorpay_payment_id: 'pay_demo_123456',
    payment_status: 'PAID',
    ticket_status: 'VALID',
    qr_token: 'ggl_qr_demo_token_GGLT123456',
    checked_in: 0,
    checked_in_at: null,
    created_at: '2026-10-02T10:00:00.000Z',
    updated_at: '2026-10-02T10:00:00.000Z',
    is_demo: true,
  };

  const handleDobChange = (val: string) => {
    setDob(val);
    if (val) {
      const ageCheck = validateAgeIs18Plus(val);
      if (!ageCheck.is18Plus) {
        setErrorMsg('You must be 18 or above to book this ticket.');
      } else {
        setErrorMsg('');
      }
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !mobile.trim() || !email.trim() || !instagramId.trim() || !dob) {
      setErrorMsg('Please fill in all required fields to proceed.');
      return;
    }

    if (!termsAgreed) {
      setErrorMsg('Please agree to the event terms and conditions to continue.');
      return;
    }

    const ageCheck = validateAgeIs18Plus(dob);
    if (!ageCheck.is18Plus) {
      setErrorMsg('You must be 18 or above to book this ticket.');
      return;
    }

    setLoading(true);

    try {
      // 1. Call Backend Order Creation
      const orderRes = await fetch('/api/tickets/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          mobile,
          email,
          instagramId,
          dob,
          quantity,
          termsAgreed,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize ticket booking.');
      }

      // 2. Directly verify and issue instant free ticket pass
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
      if (verifyData.success && verifyData.ticket) {
        setConfirmedTicket(verifyData.ticket);
      } else {
        throw new Error(verifyData.error || 'Server ticket issuance failed.');
      }
      setLoading(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080e] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* Background Radial Spotlights */}
      <div className="spotlight-left pointer-events-none" />
      <div className="spotlight-right pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-10">
        
        {/* HEADER BRANDING */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold font-barlow uppercase tracking-widest shadow-xl">
            <Sparkles className="w-4 h-4 text-amber-400" /> OFFICIAL DIRECT TICKET BOOKING
          </div>

          <h1 className="font-bebas text-4xl sm:text-6xl text-white uppercase tracking-tight">
            BOOK YOUR <span className="gold-gradient-text">GGL TICKET</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-xl mx-auto font-light">
            Experience Gorakhpur&apos;s Got Latent — Live.
          </p>

          {/* PRICE BADGE BANNER */}
          <div className="inline-flex items-center justify-center gap-3 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900 border border-amber-500/40 shadow-2xl">
            <TicketIcon className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="font-bebas text-2xl text-amber-300 tracking-wide">₹149</span>
            <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">/ Ticket</span>
          </div>
        </div>

        {/* 4 FEATURE PILLARS BANNER */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-1">
            <ShieldCheck className="w-5 h-5 text-amber-400 mx-auto" />
            <div className="text-[11px] font-bold text-slate-200 uppercase">Secure Payment</div>
            <div className="text-[9px] text-slate-400">Razorpay Verified</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-1">
            <TicketIcon className="w-5 h-5 text-amber-400 mx-auto" />
            <div className="text-[11px] font-bold text-slate-200 uppercase">Instant Ticket</div>
            <div className="text-[9px] text-slate-400">Digital Pass</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-1">
            <Lock className="w-5 h-5 text-amber-400 mx-auto" />
            <div className="text-[11px] font-bold text-slate-200 uppercase">Unique ID</div>
            <div className="text-[9px] text-slate-400">GGLT Number</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-1">
            <QrIcon className="w-5 h-5 text-amber-400 mx-auto" />
            <div className="text-[11px] font-bold text-slate-200 uppercase">QR Verification</div>
            <div className="text-[9px] text-slate-400">Venue Entry</div>
          </div>
        </div>

        {/* SUCCESS STATE - SHOW CONFIRMED DIGITAL TICKET */}
        {confirmedTicket ? (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-3xl p-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-bebas text-3xl sm:text-4xl text-white uppercase tracking-wide">
                🎉 TICKET CONFIRMED
              </h2>
              <p className="text-xs sm:text-sm text-emerald-300 font-semibold">
                Your GGL ticket has been successfully booked. Ticket ID: <span className="font-mono text-amber-300 font-bold">{confirmedTicket.ticket_id}</span>
              </p>
            </div>

            {/* RENDER DIGITAL TICKET CARD */}
            <TicketCard ticket={confirmedTicket} showActions={true} />

            <div className="text-center pt-4">
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
                className="text-xs text-amber-400 font-bold hover:underline"
              >
                ← Book Another Ticket
              </button>
            </div>
          </div>
        ) : (
          /* BOOKING FORM CONTAINER */
          <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-amber-500/30 bg-slate-900/90 backdrop-blur-2xl shadow-2xl space-y-8 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bebas text-2xl sm:text-3xl text-white uppercase tracking-wide">
                  ATTENDEE REGISTRATION & DETAILS
                </h3>
                <p className="text-xs text-slate-400">
                  Please enter attendee details accurately. Attendees must be 18 years or above.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase shrink-0">
                FREE PASS
              </span>
            </div>

            {/* ERROR ALERT BANNER */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-pulse">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 1. Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-400" /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all text-sm"
                  />
                </div>

                {/* 2. Mobile Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-amber-400" /> Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all text-sm font-mono"
                  />
                </div>

                {/* 3. Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-amber-400" /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all text-sm"
                  />
                </div>

                {/* 4. Instagram ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AtSign className="w-4 h-4 text-pink-400" /> Instagram ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="@username"
                    value={instagramId}
                    onChange={(e) => setInstagramId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all text-sm"
                  />
                </div>

                {/* 5. Date of Birth (18+ Validation) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400" /> Date of Birth (Must be 18+) *
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => handleDobChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all text-sm font-mono"
                  />
                  <p className="text-[11px] text-slate-400">Attendees must be 18 years or older on event date.</p>
                </div>

                {/* 6. Number of Tickets */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <TicketIcon className="w-4 h-4 text-amber-400" /> Number of Tickets *
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 transition-all text-sm font-bold"
                  >
                    <option value={1}>1 Ticket — FREE PASS</option>
                    <option value={2}>2 Tickets — FREE PASS</option>
                    <option value={3}>3 Tickets — FREE PASS</option>
                    <option value={4}>4 Tickets — FREE PASS</option>
                    <option value={5}>5 Tickets — FREE PASS</option>
                  </select>
                </div>

              </div>

              {/* MANDATORY TERMS CHECKBOX */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 leading-relaxed group-hover:text-amber-200">
                    I confirm that the information provided by me is correct and I agree to the event terms and conditions.
                  </span>
                </label>
              </div>

              {/* PAYMENT SUMMARY & SUBMIT BUTTON */}
              <div className="pt-4 space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Ticket Booking Fee</div>
                    <div className="text-xs text-emerald-400 font-mono font-bold">Instant E-Ticket Pass</div>
                  </div>
                  <div className="font-bebas text-3xl text-emerald-400 tracking-wide">
                    FREE (₹0)
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Generating Ticket Pass...</span>
                  ) : (
                    <>
                      <span>CONFIRM & GET FREE TICKET</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
