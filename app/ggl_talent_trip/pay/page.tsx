'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

type Participant = { appId:string; name:string; age:number; whatsapp:string; city:string; instagramId:string; talent:string; duration:string; budget:string; destinations:string[]; otherDestination:string; amount:number; paymentUrl:string };

const confirmations = [
  'I confirm that the participant details shown above are correct.',
  'I understand the amount shown is the GGL Talent Trip entry fee set by the team, and is separate from the final trip contribution.',
  'I understand that once I pay, the entry fee is non-refundable if I personally cancel or withdraw.',
  'I understand that if GGL/the organising team cancels the trip, I may claim a full refund of the amount paid under this stated policy.'
];

export default function TalentTripPayPage() {
  const [person,setPerson] = useState<Participant|null>(null);
  const [checks,setChecks] = useState<boolean[]>([false,false,false,false]);
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(true);
  const [paying,setPaying] = useState(false);
  useEffect(() => {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const pathToken = pathParts[0] === 'ggl_talent_trip' && pathParts[1] && pathParts[1] !== 'pay' ? pathParts[1] : '';
    const token = pathToken || new URLSearchParams(window.location.search).get('token') || '';
    fetch('/api/ggl-talent-trip/payment-details?token='+encodeURIComponent(token),{cache:'no-store'})
      .then(async r => { const j=await r.json(); if(!r.ok||!j.success) throw new Error(j.error||'Could not load payment invitation'); setPerson(j.participant); })
      .catch(e => setError(e.message||'Could not load payment details.'))
      .finally(()=>setLoading(false));
  },[]);
  const allChecked = checks.every(Boolean);
  return <main className="min-h-screen bg-[#07080e] px-4 py-10 text-white sm:px-6">
    <section className="mx-auto max-w-3xl rounded-3xl border border-amber-400/20 bg-white/[.035] p-5 sm:p-9">
      <p className="text-xs font-black uppercase tracking-[.22em] text-amber-300">GGL Talent Trip · Secure Payment</p>
      <h1 className="mt-3 text-3xl font-black sm:text-4xl">Review details & confirm</h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">Please review your application details and read every confirmation before proceeding to Razorpay. Your payment is marked paid only after Razorpay confirms it.</p>
      {loading ? <p className="mt-8 text-slate-400">Loading your secure payment invitation…</p> : error ? <div role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">{error}<p className="mt-2 text-sm">Please contact GGL if you believe this is a mistake.</p></div> : person ? <>
        <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs text-slate-400">Registration ID</p><p className="font-black text-amber-300">{person.appId}</p></div><div className="rounded-xl bg-amber-400 px-4 py-3 text-right text-black"><p className="text-xs font-bold">Amount payable</p><p className="text-2xl font-black">₹{person.amount.toLocaleString('en-IN')}</p></div></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">{[
            ['Full name',person.name],['Age',String(person.age)],['WhatsApp',person.whatsapp],['City',person.city],['Instagram ID',person.instagramId||'Not provided'],['Talent / interests',person.talent||'Not provided'],['Preferred duration',person.duration],['Budget preference',person.budget],['Preferred destinations',person.destinations?.join(', ')||'Not provided'],['Other destination',person.otherDestination||'None']
          ].map(([label,value])=><div key={label} className="rounded-xl border border-white/10 p-3"><p className="text-xs font-bold text-slate-400">{label}</p><p className="mt-1 break-words text-sm font-semibold">{value}</p></div>)}</div>
        </div>
        <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/[.05] p-5">
          <h2 className="text-lg font-black text-amber-300">Terms & payment confirmations</h2>
          <p className="mt-1 text-xs leading-5 text-slate-400">All confirmations are required to continue.</p>
          <div className="mt-4 space-y-3">{confirmations.map((label,i)=><label key={label} className="flex cursor-pointer gap-3 rounded-xl border border-white/10 bg-black/20 p-3"><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(old=>old.map((v,n)=>n===i?e.target.checked:v))} className="mt-1 h-4 w-4 accent-amber-400"/><span className="text-sm leading-6 text-slate-200">{label}</span></label>)}</div>
          <div className="mt-4 rounded-xl bg-black/20 p-4 text-sm leading-6 text-slate-300"><p className="font-bold text-white">What happens after payment?</p><ol className="mt-2 list-decimal space-y-1 pl-5"><li>Razorpay securely processes the payment.</li><li>After verified payment, the website shows a 5-second countdown and asks for Aadhaar front, Aadhaar back and passport-size photo uploads.</li><li>After successful document upload, WhatsApp opens with your registration details and Razorpay Payment ID pre-filled for GGL.</li><li>GGL reviews your submission and updates your registration status in the admin dashboard before adding eligible participants to the planning group.</li></ol><p className="mt-3 text-xs text-slate-400">The final trip contribution is separate from this entry fee and will be discussed with participants. Only pay the amount displayed on this page.</p></div>
        </div>
        <button disabled={!allChecked||paying} onClick={()=>{setPaying(true);window.location.href=person.paymentUrl;}} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-4 font-black text-black disabled:cursor-not-allowed disabled:opacity-40"><ShieldCheck className="h-5 w-5"/> {paying?'Opening secure payment…':`Agree & Pay ₹${person.amount.toLocaleString('en-IN')}`} <ArrowRight className="h-5 w-5"/></button>
        <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-slate-500"><CheckCircle2 className="h-4 w-4"/> Payment confirmation is checked by Razorpay, not by a screenshot.</p>
      </> : null}
      <Link href="/ggl_talent_trip" className="mt-7 block text-center text-sm font-bold text-amber-300">Back to GGL Talent Trip</Link>
    </section>
  </main>;
}
