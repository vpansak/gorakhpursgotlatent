'use client';

import { useMemo, useState } from 'react';
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
  const update = (key: keyof TripForm, value: any) => setForm(prev => ({...prev, [key]: value}));
  const toggleDestination = (value:string) => update('destinations', form.destinations.includes(value) ? form.destinations.filter(x=>x!==value) : [...form.destinations, value]);
  const message = useMemo(() => `🌍 *GGL TALENT TRIP — INTEREST REGISTRATION*\n\n🆔 Registration ID: ${appId || 'New Interest'}\n👤 Name: ${form.fullName}\n🎂 Age: ${form.age}\n📱 WhatsApp: ${form.whatsapp}\n📍 City: ${form.city}\n📸 Instagram: ${form.instagramId || 'Not provided'}\n🎭 Talent / Interests: ${form.talent}\n🗓️ Preferred Duration: ${form.duration}\n💰 Comfortable Budget: ${form.budget}\n🧭 Preferred Destinations: ${form.destinations.join(', ') || 'Not selected'}${form.otherDestination ? '\nOther destination: '+form.otherDestination : ''}\n\nFirst interest registration is FREE. ₹999 entry fee applies only after verification. Final trip contribution will be decided together after group discussions.\n\nWebsite: https://www.gkpgotlatent.in/ggl_talent_trip`, [appId,form]);
  const submit = async (e:React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!form.fullName.trim() || !form.age.trim() || !form.whatsapp.trim() || !form.city.trim() || !form.talent.trim() || form.destinations.length===0) { setError('Please complete all required fields and select at least one destination.'); return; }
    if (!termsAccepted) { setError('Please read and accept the Terms & Conditions before submitting.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/ggl-talent-trip', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not submit registration. Please try again.');
      setAppId(data.appId);
      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message.replace('New Interest',data.appId))}`;
      window.location.href = url;
    } catch (err:any) { setError(err.message || 'Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return <main className="min-h-screen bg-[#07080e] text-white">
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
            <h3 className="text-lg font-black text-amber-300">GGL Talent Trip — Terms & Conditions</h3>
            <p className="mt-1 text-xs text-slate-400">Please read all terms carefully before submitting your interest form.</p>
            <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-2 text-sm leading-6 text-slate-300">
              <p><strong className="text-white">1. Interest registration is free.</strong> Submitting this form only records your interest and preferences. It does not confirm a seat, selection, booking or a guaranteed trip.</p>
              <p><strong className="text-white">2. WhatsApp contact.</strong> You agree that GGL’s team may contact you on the WhatsApp number provided to verify your details, discuss preferences and share updates. After successful submission, you will be redirected to WhatsApp with a pre-filled message containing the details you submitted. You must press Send in WhatsApp to send that message to GGL.</p>
              <p><strong className="text-white">3. Verification and ₹999 entry fee.</strong> The team may conduct basic verification and explain the next steps. The ₹999 entry fee is payable only after verification and further instructions from GGL. Do not pay anyone who is not confirmed through official GGL communication. The fee is separate from the trip contribution; any refund or cancellation terms applicable to this fee will be communicated before payment.</p>
              <p><strong className="text-white">4. Trip contribution is separate and not fixed yet.</strong> Participants will discuss and finalize destination, dates, duration, activities, accommodation, transport and other arrangements together. The final contribution can be higher or lower depending on the confirmed plan. The example of approximately ₹3,999 for a 3-day trip is illustrative only and is separate from the ₹999 entry fee. No destination, date, duration or final price is guaranteed at this stage.</p>
              <p><strong className="text-white">5. Preferences are not a booking.</strong> Your selected destination, budget and duration are preferences only. GGL may consider group consensus, availability, logistics, safety and feasibility when finalizing the itinerary. “Anywhere, I’m Flexible” and “Other” selections do not guarantee a destination.</p>
              <p><strong className="text-white">6. Group participation and conduct.</strong> Participants must follow reasonable instructions, respect other participants, staff, local communities and accommodation rules, and avoid harassment, violence, illegal activity or unsafe conduct. GGL may remove a participant from a group or activity for serious misconduct, subject to applicable law and communicated payment terms.</p>
              <p><strong className="text-white">7. Travel, documents and personal responsibility.</strong> Participants are responsible for providing accurate details, carrying valid identification and any travel documents required for the final destination, and following applicable laws and local rules. Nepal or other cross-border travel, if selected, may require additional documents and eligibility checks. Do not assume such travel is confirmed.</p>
              <p><strong className="text-white">8. Safety and health.</strong> Travel and adventure activities can involve ordinary and unforeseen risks. Follow safety instructions and disclose any essential support needs directly to the team before confirming participation. Activities may be changed or cancelled if unsafe or impractical.</p>
              <p><strong className="text-white">9. Changes, cancellation and refunds.</strong> The destination, itinerary, dates, duration, transport, accommodation and activities may change before final confirmation because of availability, weather, safety, cost or group decisions. No specific refund or cancellation promise is made by this interest form. Before paying any fee or contribution, review the specific written payment, cancellation and refund terms provided for that payment. Applicable consumer rights and laws remain unaffected.</p>
              <p><strong className="text-white">10. Privacy and information accuracy.</strong> Your information will be used to manage this trip interest, verification, communication and planning. Do not submit another person’s information without permission. Keep your WhatsApp number and contact details accurate. Access to submitted information should be limited to the team members who need it for these purposes.</p>
              <p><strong className="text-white">11. Photos, videos and reels.</strong> The trip may involve content creation. Participation in travel content does not automatically mean you grant unlimited rights to use your image or performance. Any specific promotional filming or use of identifiable content should be explained separately and consent obtained where required.</p>
              <p><strong className="text-white">12. No guaranteed outcome.</strong> Submitting the form does not guarantee acceptance, a place in the final group, a particular activity, influencer collaboration, destination or travel date. Final participation depends on verification, disclosed fees, availability and confirmed arrangements.</p>
              <p><strong className="text-white">13. Contact and updates.</strong> Follow only official GGL instructions and contact the team if you have questions. The team will share further details on WhatsApp after reviewing your interest.</p>
            </div>
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-amber-400/30 bg-black/30 p-4">
              <input type="checkbox" required checked={termsAccepted} onChange={e=>setTermsAccepted(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-amber-400"/>
              <span className="text-sm font-bold text-white">I have read and agree to all GGL Talent Trip Terms & Conditions above. <span className="text-red-400">*</span></span>
            </label>
          </section>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm leading-6 text-emerald-100"><strong>First interest registration is FREE.</strong> The ₹999 entry fee is payable only after verification. The final trip contribution is decided separately after group discussions.</div>
          <button disabled={loading} type="submit" className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 font-black uppercase tracking-wide text-black transition hover:brightness-110 disabled:opacity-60">{loading?<Loader2 className="h-5 w-5 animate-spin"/>:<><MessageCircle className="h-5 w-5"/>I’m Interested <ArrowRight className="h-4 w-4"/></>}</button>
          <p className="text-center text-xs text-slate-500">By submitting, you agree that GGL may contact you about this trip interest.</p>
        </form>
        <div className="mt-6 text-center"><Link href="/" className="text-sm font-semibold text-amber-300 hover:text-amber-200">← Back to GGL Homepage</Link></div>
      </div>
    </section>
  </main>;
}
