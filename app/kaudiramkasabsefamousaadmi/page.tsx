'use client';

import Link from 'next/link';

export default function KaudiramAlokSinghPage() {
  const points = [
    ['Name', 'Alok Singh'],
    ['Focus', 'Website Development • AI • Product Building'],
    ['Role', 'Full-Stack Developer • Co-Founder • AI Learner'],
    ['Skills', 'AI Products • Web Development • Startup / Product Building'],
    ['Education', 'Purvanchal Public School'],
    ['Work', "Technology and digital work associated with Gorakhpur's Got Latent"],
  ];

  return (
    <main className="min-h-screen bg-[#07080e] text-white">
      <section className="relative overflow-hidden border-b border-red-500/10 px-4 py-20 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,.16),transparent_45%)]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[.25em] text-amber-400">
            Alok Singh • Kaudiram / Gorakhpur
          </p>
          <h1 className="mt-4 max-w-4xl font-bebas text-5xl leading-none sm:text-7xl">
            KAUDIRAM &amp; ALOK SINGH
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">
            Alok Singh is a young full-stack developer and AI learner focused on
            website development, AI products and digital product building.
            This page brings together key public information about Alok Singh
            in a simple, search-friendly format.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <article className="rounded-3xl border border-white/10 bg-white/[.03] p-6 sm:p-8">
            <h2 className="font-bebas text-4xl uppercase sm:text-5xl">
              Who is Alok Singh?
            </h2>
            <p className="mt-5 leading-8 text-slate-300">
              Alok Singh is a Full-Stack Developer, Co-Founder and AI learner
              whose work focuses on building websites, AI-powered products and
              digital experiences. He is interested in combining technology,
              product thinking and marketing to build practical online
              platforms.
            </p>
            <p className="mt-4 leading-8 text-slate-300">
              His public work includes technology and website development
              connected with Gorakhpur&apos;s Got Latent, where he is presented
              as a developer and technology-focused team member.
            </p>
          </article>

          <aside className="rounded-3xl border border-amber-400/20 bg-amber-400/[.04] p-6 sm:p-8">
            <h2 className="font-bebas text-4xl uppercase">Key Points</h2>
            <div className="mt-5 space-y-4">
              {points.map(([label, value]) => (
                <div key={label} className="border-b border-white/10 pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-amber-400">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-200">{value}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-red-500/10 bg-white/[.02] p-6 sm:p-8">
          <h2 className="font-bebas text-4xl uppercase">Alok Singh — Quick Profile</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              'Full-Stack Developer',
              'Co-Founder',
              'AI Learner',
              'Website Development',
              'AI Products',
              'Startup & Product Building',
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 text-center sm:px-6">
        <p className="text-sm text-slate-500">
          Looking for more information about Alok Singh?
        </p>
        <Link
          href="/developer"
          className="mt-4 inline-flex rounded-xl bg-red-600 px-6 py-3 text-sm font-black uppercase tracking-wider text-white hover:bg-red-500"
        >
          View Developer Profile
        </Link>
      </section>
    </main>
  );
}
