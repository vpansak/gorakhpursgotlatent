'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
declare global { interface Window { Razorpay: any } }

export default function GuestPaymentPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [payment, setPayment] = useState<any>(null);
  const [keyId, setKeyId] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/guest-payment/' + token).then(r => r.json()).then(j => {
      if (j.success) { setPayment(j.payment); setKeyId(j.keyId || ''); }
      else setError(j.error || 'Payment link unavailable');
    }).catch(() => setError('Unable to load payment details'));
  }, [token]);

  const pay = async () => {
    setBusy(true); setError('');
    try {
      if (!keyId) throw new Error('Online payment is not configured. Please contact GGL support.');
      const loaded = await new Promise<boolean>(resolve => {
        if (window.Razorpay) return resolve(true);
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => resolve(true); s.onerror = () => resolve(false);
        document.body.appendChild(s);
      });
      if (!loaded) throw new Error('Payment service could not load');
      const r = await fetch('/api/guest-payment/' + token, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'create-order' }) });
      const order = await r.json();
      if (!r.ok || !order.success) throw new Error(order.error || 'Unable to start payment');
      const rzp = new window.Razorpay({
        key: order.keyId, amount: order.amount, currency: order.currency, order_id: order.orderId,
        name: 'Gorakhpur’s Got Latent', description: 'Guest application fee',
        prefill: { name: order.name, email: order.email, contact: order.phone },
        theme: { color: '#f59e0b' },
        handler: async (response: any) => {
          try {
            const vr = await fetch('/api/guest-payment/' + token, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'verify', razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature }) });
            const v = await vr.json();
            if (v.success) setPayment((p: any) => ({ ...p, status: 'PAID', razorpay_payment_id: response.razorpay_payment_id }));
            else setError(v.error || 'Payment verification failed');
          } catch { setError('Could not verify payment. Please refresh before retrying.'); }
          setBusy(false);
        },
        modal: { ondismiss: () => setBusy(false) }
      });
      rzp.on('payment.failed', (response: any) => { setError(response.error?.description || 'Payment failed. Please try again.'); setBusy(false); });
      rzp.open();
    } catch (e: any) { setError(e.message || 'Payment failed'); setBusy(false); }
  };

  if (!payment && !error) return <main className="min-h-screen bg-[#08090d] text-white grid place-items-center">Loading secure payment page…</main>;
  const whatsappText = payment ? `🌟 GGL Guest Application\nApplication ID: ${payment.app_id}\nName: ${payment.full_name}\nEmail: ${payment.email}\nWhatsApp: ${payment.whatsapp}\nCategory: ${payment.category}\nProfession: ${payment.profession}\nCity: ${payment.city}\nPayment: ₹100 PAID\nPayment ID: ${payment.razorpay_payment_id || ''}\n\nI have completed my guest application payment.` : '';
  const whatsappUrl = 'https://api.whatsapp.com/send?phone=918423858424&text=' + encodeURIComponent(whatsappText);

  return <main className="min-h-screen bg-[#08090d] text-white px-4 py-10"><div className="max-w-xl mx-auto rounded-3xl border border-amber-500/30 bg-[#11131b] p-6 sm:p-8 shadow-2xl">
    <p className="text-xs tracking-[.25em] text-amber-300 font-bold">GORAKHPUR’S GOT LATENT</p>
    <h1 className="text-2xl font-black mt-3">Guest Application Payment</h1>
    {error && <p className="mt-4 p-3 rounded-xl bg-red-950 text-red-200 text-sm">{error}</p>}
    {payment && <><div className="mt-6 flex justify-between items-center"><span className="text-slate-400">Guest application fee</span><strong className="text-3xl text-amber-300">₹{Number(payment.amount).toFixed(2)}</strong></div>
      <p className="text-sm text-slate-400 mt-2">Your guest application will be submitted after Razorpay verifies the payment.</p>
      <div className="mt-5 space-y-3">{[['Full name',payment.full_name],['Application ID',payment.app_id],['Email',payment.email],['WhatsApp',payment.whatsapp],['Category',payment.category],['Profession',payment.profession],['City',payment.city]].map(([k,v]) => <div key={String(k)} className="border-b border-white/10 pb-2"><p className="text-xs text-slate-500">{k}</p><p className="text-sm break-words">{v || '—'}</p></div>)}</div>
      {payment.status === 'PAID' ? <div className="mt-6 rounded-xl bg-emerald-950 border border-emerald-500/40 p-5 text-emerald-300"><p className="text-lg font-black">✓ Payment verified — application submitted</p><p className="text-sm mt-1">Your guest application has been submitted successfully.</p>{payment.razorpay_payment_id && <p className="text-xs mt-2">Payment ID: {payment.razorpay_payment_id}</p>}<a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-4 block w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 py-4 text-center font-black text-black">Continue to WhatsApp</a></div> : <button disabled={busy} onClick={pay} className="mt-6 w-full rounded-xl bg-gradient-to-r from-amber-300 to-orange-500 hover:brightness-110 disabled:opacity-50 py-4 font-black">{busy ? 'Processing…' : 'Pay ₹100 & Submit Application'}</button>}
      <p className="text-xs text-slate-500 mt-4">Payment status updates only after gateway verification. Never share OTP or UPI PIN with anyone.</p>
    </>}
  </div></main>;
}
