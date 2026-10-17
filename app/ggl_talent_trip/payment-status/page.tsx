import Link from 'next/link';
export default async function TalentTripPaymentStatusPage({searchParams}:{searchParams:Promise<{status?:string}>}) {
 const p=await searchParams;
 const message=p.status==='verification_failed'?'Payment callback could not be verified.':p.status==='link_mismatch'?'The payment link did not match this registration.':'Payment confirmation is not available yet. If money was deducted, keep your Razorpay receipt and contact GGL support.';
 return <main className="min-h-screen bg-[#07080e] px-4 py-20 text-white"><section className="mx-auto max-w-xl rounded-3xl border border-amber-400/20 bg-white/[.03] p-8 text-center"><h1 className="text-3xl font-black">Payment Status</h1><p className="mt-4 leading-7 text-slate-300">{message}</p><p className="mt-3 text-sm text-slate-400">WhatsApp: +91 84238 58424</p><Link href="/ggl_talent_trip" className="mt-7 inline-block rounded-xl bg-amber-400 px-5 py-3 font-black text-black">Back to GGL Talent Trip</Link></section></main>;
}
