'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

export default function TalentTourRegistrationForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (!accepted) {
      setError('Please accept the Talent Tour terms and refund policy before continuing.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/talent-tour-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, whatsapp, termsAccepted: accepted }),
      });
      const data = await response.json();
      if (!response.ok || !data.success || !data.paymentUrl) {
        throw new Error(data.error || 'Registration could not be started. Please try again.');
      }
      window.location.href = data.paymentUrl;
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return <main className="min-h-screen bg-[#07080e] px-4 py-10 text-white sm:px-6">
    <section className="mx-auto max-w-2xl rounded-3xl border border-amber-400/20 bg-white/[.035] p-5 shadow-2xl sm:p-9">
      <p className="text-xs font-black uppercase tracking-[.24em] text-amber-300">Gorakhpur’s Got Latent presents</p>
      <h1 className="mt-3 text-3xl font-black sm:text-4xl">GGL Talent Tour</h1>
      <p className="mt-3 leading-7 text-slate-300">Complete the short form below and pay the one-time <strong className="text-white">₹999 registration fee</strong>. Once Razorpay confirms your payment, your registration status will update automatically in the GGL admin dashboard.</p>
      <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5">
        <div><p className="text-sm font-bold text-amber-100">Talent Tour registration</p><p className="mt-1 text-xs text-slate-300">Secure online payment</p></div>
        <p className="text-3xl font-black text-amber-300">₹999</p>
      </div>
      <form onSubmit={submit} className="mt-7 space-y-5">
        {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        <label className="block"><span className="mb-2 block text-sm font-bold">Full name *</span><input required maxLength={120} autoComplete="name" value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Enter your full name" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400"/></label>
        <label className="block"><span className="mb-2 block text-sm font-bold">Email address *</span><input required type="email" maxLength={180} autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400"/></label>
        <label className="block"><span className="mb-2 block text-sm font-bold">WhatsApp number *</span><input required type="tel" inputMode="numeric" autoComplete="tel" minLength={10} maxLength={15} value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="10-digit mobile number" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-amber-400"/><span className="mt-1 block text-xs text-slate-500">Use a number where the GGL team can contact you.</span></label>
        <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-slate-300"><input required type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} className="mt-1 h-4 w-4 accent-amber-400"/><span>I have read and agree to the <Link className="text-amber-300 underline" href="/ggl_talent_trip/terms-and-conditions" target="_blank">Terms & Conditions</Link> and <Link className="text-amber-300 underline" href="/ggl_talent_trip/policy" target="_blank">refund/trip policy</Link>. I understand that ₹999 is the registration fee and is separate from any future trip contribution.</span></label>
        <button disabled={loading} type="submit" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-4 font-black text-black disabled:opacity-60">{loading ? <><Loader2 className="h-5 w-5 animate-spin"/> Preparing secure payment…</> : <><ShieldCheck className="h-5 w-5"/> Pay ₹999 & Register <ArrowRight className="h-5 w-5"/></>}</button>
        <p className="text-center text-xs text-slate-500">Your registration is confirmed only after Razorpay verifies the payment. Do not close the payment page before completion.</p>
      </form>
      <Link href="/ggl_talent_trip" className="mt-6 block text-center text-sm font-bold text-amber-300">← Learn more about the Talent Tour</Link>
    </section>
  </main>;
}
