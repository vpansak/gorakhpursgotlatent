import Link from 'next/link';
import { EPISODE_2 } from '@/lib/episode2';
export default function Episode2Schedule() {
  return <aside aria-label="Episode 2 recording schedule" className="rounded-2xl border border-amber-400/30 bg-amber-400/[.06] p-4 text-sm leading-6 text-slate-200">
    <p className="font-black text-amber-300">EPISODE 2 · RECORDING SCHEDULE</p>
    <p><time dateTime={EPISODE_2.startDate}>{EPISODE_2.weekday}, {EPISODE_2.date} · {EPISODE_2.time}</time></p>
    <p>{EPISODE_2.venue}, Gorakhpur</p>
    <Link href="/ep2" className="mt-1 inline-block font-bold text-amber-300 underline underline-offset-4">Episode 2 details →</Link>
  </aside>;
}
