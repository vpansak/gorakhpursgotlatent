'use client';
import { useEffect, useState } from 'react';
import { performerDetailFields } from '@/lib/performerDetailsFields';
export default function PerformerDetailsForm({ token }: { token: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/performer-details/${token}`, { cache: 'no-store' }).then(async res => {
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || 'Unable to load form');
      if (!cancelled) { setAnswers(result.answers); setLoaded(true); }
    }).catch(error => { if (!cancelled) setError(error.message); });
    return () => { cancelled = true; };
  }, [token]);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setSaved(false);
    try {
      const res = await fetch(`/api/performer-details/${token}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(answers) });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || 'Unable to save form');
      setSaved(true);
    } catch (error: any) { setError(error.message || 'Please try again'); }
    finally { setBusy(false); }
  }
  const inputStyle = 'performer-detail-input mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 p-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-400';
  return <main className="performer-details-form mx-auto max-w-3xl px-4 py-10 text-white">
    <div className="rounded-3xl border border-orange-400/40 bg-slate-900 p-5 sm:p-8">
      <p className="font-bold text-orange-300">GORAKHPUR’S GOT LATENT</p>
      <h1 className="mt-2 text-3xl font-black">Performer Details 🎤</h1>
      <p className="mt-3 text-sm text-slate-300">Pehle di hui details check karke edit kar sakte hain. Baaki sawalon ke jawab fill karke submit karein. * wale sawal zaroori hain.</p>
      {error && <p role="alert" className="mt-5 rounded-xl bg-red-950 p-4 text-red-200">{error}</p>}
      {!loaded && !error && <p className="mt-6" role="status">Aapka form load ho raha hai…</p>}
      {saved && <div role="status" className="mt-6 rounded-xl border border-orange-400 bg-orange-400/10 p-5">
        <h2 className="text-xl font-bold text-orange-200">✓ Details save ho gayi hain!</h2>
        <p className="mt-2 text-sm">GGL team ko aapka detailed form mil gaya hai.</p>
        <button type="button" onClick={() => setSaved(false)} className="mt-4 underline">Apne answers edit karein</button>
      </div>}
      {loaded && !saved && <form onSubmit={submit} className="mt-7 space-y-6">
        {performerDetailFields.map(field => {
          const required = 'required' in field && field.required;
          if ('options' in field) return <fieldset key={field.key}>
            <legend className="text-sm font-semibold">{field.label}{required ? ' *' : ''}</legend>
            <div className="mt-3 flex flex-wrap gap-3">{field.options.map(option => <label key={option} className="performer-detail-choice flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm">
              <input type="radio" name={field.key} value={option} required={required} checked={answers[field.key] === option} onChange={() => setAnswers(prev => ({ ...prev, [field.key]: option }))} className="accent-orange-500" />{option}{field.key === 'duration' ? ' min' : ''}
            </label>)}</div>
            {field.key === 'reportedPaymentStatus' && <p className="mt-2 text-xs text-slate-400">Yeh aapka payment declaration hai. Verified payment Razorpay confirmation ke baad hi update hota hai.</p>}
          </fieldset>;
          return <div key={field.key}><label htmlFor={field.key} className="text-sm font-semibold">{field.label}{required ? ' *' : ''}</label>
            {'multiline' in field ? <textarea id={field.key} placeholder="Apna jawab yahan likhein…" rows={4} maxLength={6000} required={required} value={answers[field.key] || ''} onChange={e => setAnswers(prev => ({ ...prev, [field.key]: e.target.value }))} className={inputStyle} />
              : <input id={field.key} placeholder={field.key === 'mobile' ? 'Mobile number' : 'Yahan likhein…'} type={'type' in field ? field.type : 'text'} maxLength={field.key === 'mobile' ? 20 : 6000} required={required} value={answers[field.key] || ''} onChange={e => setAnswers(prev => ({ ...prev, [field.key]: e.target.value }))} className={inputStyle} />}
          </div>;
        })}
        <button disabled={busy} className="w-full rounded-xl bg-orange-500 px-6 py-4 font-black text-black hover:bg-orange-400 disabled:opacity-50">{busy ? 'Saving…' : 'Submit Performer Details'}</button>
      </form>}
    </div>
  </main>;
}
