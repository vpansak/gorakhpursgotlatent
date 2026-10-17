'use client';

import { useMemo, useState } from 'react';
import { useLeadCapture } from '@/lib/leadCapture';
import Link from 'next/link';
import { ArrowRight, MapPin, MessageCircle, Sparkles, Loader2 } from 'lucide-react';

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
  const [showPolicy, setShowPolicy] = useState(false);
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
    <section id="interest-form" className="scroll-mt-24 px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="text-center"><p className="text-xs font-black uppercase tracking-[.25em] text-amber-400">Free Registration</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">I’M INTERESTED</h2><p className="mt-3 text-sm text-slate-400">Share your preferences. Our team will follow up on WhatsApp.</p></div>
        <form onSubmit={submit} className="mt-8 space-y-6 rounded-3xl border border-white/10 bg-white/[.035] p-5 sm:p-8">
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
            <h3 className="text-lg font-black text-amber-300">Terms & Conditions Policy</h3>
            <p className="mt-1 text-sm text-slate-300">Please read the complete trip policy before applying.</p>
            <button type="button" onClick={()=>setShowPolicy(true)} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm font-extrabold text-amber-200 transition hover:bg-amber-400/20">
              Read Terms & Conditions Policy <ArrowRight className="h-4 w-4"/>
            </button>
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-amber-400/30 bg-black/30 p-4">
              <input type="checkbox" required checked={termsAccepted} onChange={e=>setTermsAccepted(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-amber-400"/>
              <span className="text-sm font-bold text-white">I have read and agree to the Terms & Conditions Policy. <span className="text-red-400">*</span></span>
            </label>
          </section>
    <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,.22),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(220,38,38,.2),transparent_45%)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-amber-300"><Sparkles className="h-4 w-4"/> A new GGL experience</span>
          <h1 className="mt-6 text-5xl font-black uppercase leading-[.95] sm:text-7xl">GGL <span className="text-amber-400">Talent Trip</span></h1>
          <p className="mt-5 text-2xl font-extrabold text-white sm:text-3xl">ये सफर है, यहाँ कुछ भी हो सकता है!</p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">Meet talented strangers, explore new destinations, enjoy music and dance, create reels, perform together and make unforgettable memories!</p>
          <p className="mt-4 text-sm font-bold text-amber-200">Travel • Music • Dance • Reels • Performances • Adventures</p>
          <a href="#interest-form" className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-7 py-4 font-black uppercase tracking-wide text-black shadow-lg shadow-amber-500/20 transition hover:scale-[1.02]">I’m Interested <ArrowRight className="h-5 w-5"/></a>
          <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
            {[['FREE','First registration'],['₹999','After verification'],['TOGETHER','Plan the trip']].map(([big,small])=><div key={big} className="rounded-2xl border border-white/10 bg-white/[.04] p-3"><strong className="block text-xl font-black text-amber-300">{big}</strong><span className="mt-1 block text-xs text-slate-400">{small}</span></div>)}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-amber-500/20 to-red-600/20 blur-2xl"/>
          <div className="relative overflow-hidden rounded-[2rem] border border-amber-400/25 bg-slate-950 p-3 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85" alt="Mountain travel destination" className="h-[320px] w-full rounded-[1.5rem] object-cover sm:h-[430px]"/>
            <div className="absolute inset-x-3 bottom-3 rounded-b-[1.5rem] bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-20">
              <div className="flex items-center gap-2 text-amber-300"><MapPin className="h-4 w-4"/> New places, new people</div>
              <p className="mt-2 text-2xl font-black">Your next story starts here.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center"><p className="text-xs font-black uppercase tracking-[.25em] text-amber-400">The Journey</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">HOW IT WORKS</h2><p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400">Not sure about the destination, duration or budget yet? No worries! Fill out our FREE interest form first. We’ll connect on WhatsApp, discuss everyone’s preferences and plan the trip together.</p></div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['01','Free Interest Registration','Fill the first form completely FREE and share your preferences.'],
            ['02','WhatsApp Communication','Our team will contact interested participants and share further details.'],
            ['03','Basic Verification','A simple verification process will be conducted.'],
            ['04','₹999 Entry Fee','After verification, pay the ₹999 entry fee to proceed.'],
            ['05','WhatsApp Planning Group','Registered participants join an exclusive planning group.'],
            ['06','Discussions & Decisions','Discuss destination, dates, duration, activities, stay, transport and contribution together.'],
            ['07','Final Trip Contribution','Final contribution is decided after discussions. Example: 3 days may be approx. ₹3,999/person; actual cost may be higher or lower.'],
            ['08','Final Participants Group','Participants who complete the final contribution join the final WhatsApp group.'],
            ['09','Let’s Travel! 🎉','Strangers become travel buddies through music, dance, reels, performances and adventures.']
          ].map(([n,title,desc])=><article key={n} className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><span className="text-xs font-black tracking-widest text-amber-400">STEP {n}</span><h3 className="mt-2 text-lg font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p></article>)}
        </div>
      </div>
    </section>
    <section className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-red-500/10 p-6 sm:p-9">
        <h2 className="text-2xl font-black sm:text-3xl">CLEAR & TRANSPARENT PRICING</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[['First Interest Registration','FREE'],['Entry Fee After Verification','₹999'],['Trip Contribution','Decided together'],['Illustrative 3-Day Trip','Approx. ₹3,999']].map(([label,value])=><div key={label} className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-xl font-black text-amber-300">{value}</p></div>)}
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-300">The ₹3,999 example is separate from the ₹999 entry fee. The final contribution may increase or decrease depending on the destination, duration, group decisions and arrangements. No trip destination or date is confirmed yet.</p>
      </div>
    </section>

          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-6 text-amber-100"><strong>First interest registration is FREE.</strong> If selected by the GGL team, you will be asked to pay the ₹999 entry fee. The final trip contribution is separate and will be discussed in the planning group.</div>
          <button disabled={loading} type="submit" className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 font-black uppercase tracking-wide text-black transition hover:brightness-110 disabled:opacity-60">{loading?<Loader2 className="h-5 w-5 animate-spin"/>:<><MessageCircle className="h-5 w-5"/>I’m Interested <ArrowRight className="h-4 w-4"/></>}</button>
          <p className="text-center text-xs text-slate-500">By submitting, you agree that GGL may contact you about this trip interest.</p>
        </form>
        <div className="mt-6 text-center"><Link href="/" className="text-sm font-semibold text-amber-300 hover:text-amber-200">← Back to GGL Homepage</Link></div>
      </div>
    </section>
    {showPolicy && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="trip-policy-title">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-amber-400/40 bg-[#0b0b10] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-amber-400/20 p-5">
          <div><p className="text-xs font-black uppercase tracking-widest text-amber-400">Please read before applying</p><h2 id="trip-policy-title" className="mt-1 text-xl font-black text-white sm:text-2xl">GGL Talent Trip — Terms & Conditions Policy</h2></div>
          <button type="button" onClick={()=>setShowPolicy(false)} aria-label="Close policy" className="rounded-lg border border-white/15 px-3 py-2 text-lg text-white hover:bg-white/10">✕</button>
        </div>
        <div className="space-y-4 overflow-y-auto p-5 text-sm leading-6 text-slate-300">
          <p><strong className="text-white">1. Free interest form, not confirmation.</strong> Filling this form is free and only expresses your interest. It does not guarantee selection, a seat, destination, date or trip booking. Please provide accurate details.</p>
          <p><strong className="text-white">2. Selection and ₹999 entry fee.</strong> The GGL team will review applications and contact selected applicants through the WhatsApp number provided. If you are selected and choose to proceed, you will be asked to pay a ₹999 entry fee through the official payment instructions shared by the team. Do not pay personal or unverified accounts. This entry fee is separate from the trip contribution.</p>
          <p><strong className="text-white">3. WhatsApp planning group and voting.</strong> After the ₹999 payment is confirmed, the team will add you to the official WhatsApp planning group. The team will ask participants for their opinions through polls and discussions about how many days to travel, possible destinations, dates, budget, transport, stay and activities. Please participate respectfully and cast your vote in relevant polls. Preferences and votes help planning but do not individually guarantee a particular choice; the final plan depends on group consensus, availability, safety and feasibility.</p>
          <p><strong className="text-white">4. Separate trip contribution.</strong> The actual trip contribution is separate from ₹999 and will be discussed after the group shares preferences and a workable plan is prepared. The earlier example of approximately ₹3,999 for a 3-day trip is illustrative only, not a confirmed price. Review the final itinerary and written cost breakdown before paying any trip contribution.</p>
          <p><strong className="text-white">5. If you cancel or withdraw.</strong> Please decide carefully before making a payment. If you voluntarily cancel, withdraw or stop participating after paying, the amount paid is generally non-refundable under this policy, except where a refund is required by applicable law or the specific written payment terms say otherwise. Any third-party bookings, deductions or commitments should be disclosed before you pay.</p>
          <p><strong className="text-white">6. If GGL cancels the trip.</strong> If GGL/the organizing team cancels the overall trip or the plan cannot proceed due to an issue on the organizing side, you may claim a refund of the amounts you paid to GGL for that cancelled trip/plan. The team will communicate the refund process and timeline. This does not automatically cover payments made directly to third parties unless the applicable booking terms provide for it.</p>
          <p><strong className="text-white">7. Changes and unforeseen circumstances.</strong> Dates, destinations, duration and activities may change because of weather, safety, availability, legal restrictions or other unforeseen issues. GGL will communicate material changes and any options available before asking you to confirm additional costs.</p>
          <p><strong className="text-white">8. Conduct and safety.</strong> Respect other participants, local communities, staff and accommodation rules. Harassment, violence, illegal activity or unsafe conduct is not allowed. Follow safety instructions and take personal responsibility for your belongings, health needs and travel documents.</p>
          <p><strong className="text-white">9. Documents and travel eligibility.</strong> You are responsible for carrying valid identification and any documents required by the final destination. If Nepal or other cross-border travel is selected, additional document and eligibility requirements may apply; no cross-border trip is confirmed until announced by the team.</p>
          <p><strong className="text-white">10. Privacy and communication.</strong> Submitted details will be used for application review, verification, trip planning and relevant GGL communication. Do not share another person's information without permission. Contact the official GGL team if you need clarification.</p>
          <p><strong className="text-white">11. Photos, videos and reels.</strong> The trip may include content creation. Any specific promotional use of identifiable photos/videos should be explained separately and consent obtained where required. Participation does not mean unlimited consent to use your image.</p>
          <p><strong className="text-white">12. Applicable law.</strong> This policy is subject to applicable law and consumer rights. If any payment has separate written terms, review them before paying; those terms should clearly identify the amount, purpose, cancellation and refund conditions.</p>
        </div>
        <div className="border-t border-amber-400/20 p-4"><button type="button" onClick={()=>{setTermsAccepted(true);setShowPolicy(false);}} className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 font-black uppercase text-black hover:brightness-110">I’ve read the policy</button></div>
      </div>
    </div>}
  </main>;
}
