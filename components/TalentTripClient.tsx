'use client';

import { useMemo, useState } from 'react';
import { useLeadCapture } from '@/lib/leadCapture';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Loader2 } from 'lucide-react';

const destinations = ['Nepal','Pokhara','Kathmandu','Varanasi','Ayodhya','Rajasthan','Goa','Nainital','Rishikesh','Manali','Himachal Pradesh','Shillong, Meghalaya','Anywhere, I’m Flexible','Other'];
const durations = ['1 Day','2 Days','3 Days','4 Days','5 Days','6 Days','7 Days'];
const budgets = ['₹799','₹999','₹1,499','₹1,999','₹2,999','₹3,999','₹4,999','₹5,999'];
const WA_NUMBER = '918423858424';

type TripForm = { fullName:string; age:string; whatsapp:string; city:string; instagramId:string; talent:string; duration:string; budget:string; destinations:string[]; otherDestination:string };
const initialForm: TripForm = { fullName:'', age:'', whatsapp:'', city:'', instagramId:'', talent:'', duration:'3 Days', budget:'₹3,999', destinations:[], otherDestination:'' };

export default function TalentTripClient() {
  const [form, setForm] = useState<TripForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appId, setAppId] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  useLeadCapture({
    source: 'ggl_talent_trip',
    customerName: form.fullName,
    mobile: form.whatsapp,
    instagramId: form.instagramId,
    data: {
      fullName: form.fullName,
      age: form.age,
      whatsapp: form.whatsapp,
      city: form.city,
      instagramId: form.instagramId,
      talent: form.talent,
      duration: form.duration,
      budget: form.budget,
      destinations: form.destinations,
      otherDestination: form.otherDestination,
      termsAccepted,
    },
  });
  const update = (key: keyof TripForm, value: any) => setForm(prev => ({...prev, [key]: value}));
  const toggleDestination = (value:string) => update('destinations', form.destinations.includes(value) ? form.destinations.filter(x=>x!==value) : [...form.destinations, value]);
  const message = useMemo(() => `🌍 *GGL TALENT TRIP — INTEREST REGISTRATION*\n\n🆔 Registration ID: ${appId || 'New Interest'}\n👤 Name: ${form.fullName}\n🎂 Age: ${form.age}\n📱 WhatsApp: ${form.whatsapp}\n📍 City: ${form.city}\n📸 Instagram: ${form.instagramId || 'Not provided'}\n🎭 Talent / Interests: ${form.talent}\n🗓️ Preferred Duration: ${form.duration}\n💰 Comfortable Budget: ${form.budget}\n🧭 Preferred Destinations: ${form.destinations.join(', ') || 'Not selected'}${form.otherDestination ? '\nOther destination: '+form.otherDestination : ''}\n\nFirst interest registration is FREE. ₹999 entry fee applies only after verification. Final trip contribution will be decided together after group discussions.\n\nWebsite: https://www.gkpgotlatent.in/ggl_talent_trip`, [appId,form]);
  const submit = async (e:React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!form.fullName.trim() || !form.age.trim() || !form.whatsapp.trim() || !form.city.trim() || !form.talent.trim() || form.destinations.length===0) { setError('Please complete all required fields and select at least one destination.'); return; }
    if (!termsAccepted) { setError('Please read and accept the Terms & Conditions before submitting.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/ggl-talent-trip', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...form, termsAccepted}) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not submit registration. Please try again.');
      setAppId(data.appId);
      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message.replace('New Interest',data.appId))}`;
      window.location.href = url;
    } catch (err:any) { setError(err.message || 'Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return <main className="min-h-screen bg-[#07080e] text-white">
    <section id="interest-form" className="scroll-mt-24 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-center"><p className="text-xs font-black uppercase tracking-[.25em] text-amber-400">GGL Talent Trip • Free Interest Registration</p><h1 className="mt-3 text-3xl font-black sm:text-4xl">I’M INTERESTED</h1><p className="mt-3 text-sm text-slate-400">Fill out this simple form. If selected, our team will contact you on WhatsApp.</p></div>
        <form onSubmit={submit} className="space-y-6 rounded-3xl border border-white/10 bg-white/[.035] p-5 sm:p-8">
          {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {key:'fullName',label:'Full Name',placeholder:'Your full name',type:'text'},
              {key:'age',label:'Age',placeholder:'Your age',type:'number'},
              {key:'whatsapp',label:'WhatsApp Number',placeholder:'10-digit mobile number',type:'tel'},
              {key:'city',label:'City',placeholder:'Your city',type:'text'},
              {key:'instagramId',label:'Instagram ID',placeholder:'@yourusername',type:'text'}
            ].map(f=><label key={f.key} className="block"><span className="mb-2 block text-sm font-bold text-slate-200">{f.label}{f.key!=='instagramId'?' *':''}</span><input required={f.key!=='instagramId'} min={f.key==='age'?1:undefined} name={f.key} type={f.type} value={(form as any)[f.key]} onChange={e=>update(f.key as keyof TripForm,e.target.value)} placeholder={f.placeholder} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400"/></label>)}
            <label className="block sm:col-span-2"><span className="mb-2 block text-sm font-bold text-slate-200">Talent / Creative Interests *</span><textarea required rows={3} value={form.talent} onChange={e=>update('talent',e.target.value)} placeholder="Music, dance, reels, comedy, photography, adventure, etc." className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-400"/></label>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label><span className="mb-2 block text-sm font-bold">Preferred Trip Duration *</span><select value={form.duration} onChange={e=>update('duration',e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm">{durations.map(x=><option key={x}>{x}</option>)}</select></label>
            <label><span className="mb-2 block text-sm font-bold">Comfortable Trip Budget *</span><select value={form.budget} onChange={e=>update('budget',e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm">{budgets.map(x=><option key={x}>{x}</option>)}</select></label>
          </div>
          <fieldset><legend className="mb-3 text-sm font-bold">Preferred Destinations * <span className="font-normal text-slate-400">(select all that apply)</span></legend><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{destinations.map(d=><label key={d} className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-slate-200"><input type="checkbox" checked={form.destinations.includes(d)} onChange={()=>toggleDestination(d)} className="h-4 w-4 accent-amber-400"/>{d}</label>)}</div></fieldset>
          {form.destinations.includes('Other') && <label className="block"><span className="mb-2 block text-sm font-bold">Other Destination</span><input value={form.otherDestination} onChange={e=>update('otherDestination',e.target.value)} placeholder="Enter destination" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-400"/></label>}
          <section className="rounded-2xl border border-amber-400/25 bg-amber-400/[.05] p-4 sm:p-5">
            <h3 className="text-lg font-black text-amber-300">Read Before Applying</h3>
            <p className="mt-1 text-sm text-slate-300">Terms & Conditions and Trip Policy are available as separate full pages.</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link href="/ggl_talent_trip/terms-and-conditions" className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm font-extrabold text-amber-200 hover:bg-amber-400/20">Terms & Conditions <ArrowRight className="inline h-4 w-4"/></Link>
              <Link href="/ggl_talent_trip/policy" className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm font-extrabold text-amber-200 hover:bg-amber-400/20">Trip Policy — More <ArrowRight className="inline h-4 w-4"/></Link>
            </div>
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-amber-400/30 bg-black/30 p-4">
              <input type="checkbox" required checked={termsAccepted} onChange={e=>setTermsAccepted(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-amber-400"/>
              <span className="text-sm font-bold text-white">I have read and agree to the <Link href="/ggl_talent_trip/terms-and-conditions" className="text-amber-300 underline">Terms & Conditions</Link> and <Link href="/ggl_talent_trip/policy" className="text-amber-300 underline">Trip Policy</Link>. <span className="text-red-400">*</span></span>
            </label>
          </section>
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-6 text-amber-100"><strong>First interest registration is FREE.</strong> If selected by the GGL team, you will be asked to pay the ₹999 entry fee. The final trip contribution is separate and will be discussed in the planning group.</div>
          <button disabled={loading} type="submit" className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 font-black uppercase tracking-wide text-black transition hover:brightness-110 disabled:opacity-60">{loading?<Loader2 className="h-5 w-5 animate-spin"/>:<><MessageCircle className="h-5 w-5"/>I’m Interested <ArrowRight className="h-4 w-4"/></>}</button>
          <p className="text-center text-xs text-slate-500">By submitting, you agree that GGL may contact you about this trip interest.</p>
        </form> 
          <div className="mt-2 text-center"><Link href="/" className="text-sm font-semibold text-amber-300 hover:text-amber-200">← Back to GGL Homepage</Link></div>
        </div>
      </section>
    </main>;
}