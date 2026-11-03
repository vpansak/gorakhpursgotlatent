import Link from 'next/link';
export default function Episode2Schedule() {
  return <aside aria-label="Episode 3 ticket booking" className="rounded-2xl border border-amber-400/30 bg-amber-400/[.06] p-4 text-sm leading-6 text-slate-200">
    <p className="font-black text-amber-300">EPISODE 3 · TICKET BOOKING</p>
    <p>Bookings are open for the next GGL audience show. Episode 3 date, time and venue updates will be announced officially.</p>
    <Link href="/ep3" className="mt-1 inline-block font-bold text-amber-300 underline underline-offset-4">Episode 3 information →</Link>
  </aside>;
}
