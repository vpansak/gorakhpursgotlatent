import Link from 'next/link';

export const metadata = {
  title: "After Shortlist | Performer Participation & Refund Policy | GGL",
  description:
    "Important information for shortlisted Gorakhpur's Got Latent performers about the participation charge, payment confirmation, and winner refund policy.",
  alternates: { canonical: "https://www.gkpgotlatent.in/aftershortlist" },
};

export default function AfterShortlistPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <section className="relative overflow-hidden border-b border-red-900/50 bg-gradient-to-br from-[#190707] via-[#090909] to-black">
        <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:px-8 sm:py-24">
          <p className="mb-4 inline-flex rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-red-300">
            Gorakhpur&apos;s Got Latent · Performer Notice
          </p>
          <h1 className="mx-auto max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            Shortlist hone ke baad <span className="text-red-500">kya hoga?</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            Performer application ke baad agar aap shortlist hote hain, toh aage participate karne ke liye GGL team dwara bataya gaya participation charge pay karna hoga.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/apply/performer" className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-500">
              Performer ke liye Apply Karein
            </Link>
            <Link href="/" className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
              GGL Home
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-5 sm:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15 text-2xl">📩</div>
            <h2 className="text-xl font-bold">1. Pehle shortlist</h2>
            <p className="mt-3 leading-7 text-zinc-300">
              GGL team aapki application aur talent clip review karegi. Select/shortlist hone par team aapse official contact channel ke through sampark karegi.
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/15 text-2xl">₹</div>
            <h2 className="text-xl font-bold">2. Charge ki details</h2>
            <p className="mt-3 leading-7 text-zinc-300">
              Shortlist hone ke baad applicable amount aur payment instructions aapko pehle bata diye jayenge. Payment karne se pehle amount aur terms dhyan se padh lein.
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/15 text-2xl">🏆</div>
            <h2 className="text-xl font-bold">3. Winner ko refund</h2>
            <p className="mt-3 leading-7 text-zinc-300">
              GGL ke announced winner ko uska jama kiya gaya applicable participation charge return kiya jayega. Refund ki process aur timeline GGL team confirm karegi.
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-400/15 text-2xl">🔒</div>
            <h2 className="text-xl font-bold">4. Sirf official payment</h2>
            <p className="mt-3 leading-7 text-zinc-300">
              Payment sirf GGL team ke verified official payment link ya instructions se karein. Personal UPI/account par bina verification payment na karein.
            </p>
          </article>
        </div>

        <div className="mt-8 rounded-2xl border border-amber-400/30 bg-amber-400/[0.07] p-6 sm:p-8">
          <h2 className="text-lg font-bold text-amber-200">Zaroori baatein</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-200 sm:text-base">
            <li>• Performer application submit karna shortlist ya selection ki guarantee nahi hai.</li>
            <li>• Charge ki exact amount shortlisted performers ko payment se pehle communicate ki jayegi; is page par koi fixed amount announce nahi kiya gaya hai.</li>
            <li>• Winner refund sirf GGL dwara officially declared winner ke liye hai; refund eligibility aur process ki confirmation team se lein.</li>
            <li>• Payment receipt/transaction ID sambhal kar rakhein aur kisi bhi doubt mein payment karne se pehle GGL team se verify karein.</li>
          </ul>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm leading-6 text-zinc-400">
            Talent dikhaiye, rules samajhiye, aur official confirmation ke baad hi payment kijiye.
          </p>
          <p className="mt-2 font-semibold text-white">Gorakhpur&apos;s Got Latent</p>
          <Link href="https://www.gkpgotlatent.in" className="mt-4 inline-block text-sm font-semibold text-red-400 underline underline-offset-4">
            www.gkpgotlatent.in
          </Link>
        </div>
      </section>
    </main>
  );
}
