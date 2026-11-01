import Link from 'next/link';
import { WINNER_PRIZE_DETAILS, WINNER_PRIZE_SUMMARY, winnerPrizeAmount } from '@/lib/winnerPrize';
export default function WinnerPrizeNotice({ amount = 799 }: { amount?: number | string }) {
  const prize = winnerPrizeAmount(amount);
  const currency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);
  return <aside aria-label="Episode 2 winner prize" className="my-6 rounded-2xl border border-amber-400/40 bg-amber-400/[.08] p-5 text-left text-slate-200 sm:p-6">
    <p className="text-xs font-black uppercase tracking-widest text-amber-300">Episode 2 · Winner Prize</p>
    <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">Winner ko verified paid amount ka 3× prize 🏆</h2>
    <p className="mt-3 text-sm leading-7">{WINNER_PRIZE_SUMMARY}</p>
    {prize !== null && <p className="mt-2 font-bold text-amber-200">Example: {currency(Number(amount))} verified participation payment → {currency(prize)} total winner prize.</p>}
    <p className="mt-3 text-xs leading-6 text-slate-300">{WINNER_PRIZE_DETAILS}</p>
    <Link href="/aftershortlist" className="mt-3 inline-block text-sm font-bold text-amber-300 underline underline-offset-4">Prize & participation details →</Link>
  </aside>;
}
