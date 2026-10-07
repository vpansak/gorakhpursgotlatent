import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alok Singh | Kaudiram Ka Sabse Famous Aadmi | Official Profile',
  description: 'Alok Singh — Full-Stack Developer, Co-Founder and AI learner from Kaudiram, Gorakhpur. Official profile, photo, website and key information.',
  keywords: ['Alok Singh','Alok Singh Kaudiram','Kaudiram ka sabse famous aadmi','Alok Singh Gorakhpur','Alok Singh developer','Alok Singh co-founder','Alok Singh website'],
  alternates: { canonical: 'https://www.gkpgotlatent.in/kaudiramkasabsefamousaadmi' },
  openGraph: {
    title: 'Alok Singh | Kaudiram Ka Sabse Famous Aadmi',
    description: 'Official Alok Singh profile from Kaudiram, Gorakhpur — Full-Stack Developer, Co-Founder and AI learner.',
    url: 'https://www.gkpgotlatent.in/kaudiramkasabsefamousaadmi',
    type: 'profile',
    images: [{ url: 'https://www.gkpgotlatent.in/developer-photo-1.jpg', width: 800, height: 800, alt: 'Alok Singh' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alok Singh | Kaudiram Ka Sabse Famous Aadmi',
    description: 'Alok Singh from Kaudiram, Gorakhpur — developer, co-founder and AI learner.',
    images: ['https://www.gkpgotlatent.in/developer-photo-1.jpg'],
  },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Alok Singh',
  jobTitle: 'Full-Stack Developer & Co-Founder',
  image: 'https://www.gkpgotlatent.in/developer-photo-1.jpg',
  description: 'Full-Stack Developer, Co-Founder and AI learner from Kaudiram, Gorakhpur.',
  url: 'https://www.gkpgotlatent.in/developer',
  sameAs: [
    'https://www.instagram.com/aloksingh_._/',
    'https://x.com/rajpratapsinghh',
    'https://www.linkedin.com/in/alok-singh-8102a8414/',
  ],
  knowsAbout: ['Web Development', 'Artificial Intelligence', 'AI Products', 'Product Building', 'Digital Marketing'],
};

const points = [
  ['Name', 'Alok Singh'],
  ['Identity', 'Kaudiram ka sabse famous aadmi — Alok Singh'],
  ['Focus', 'Website Development • AI • Product Building'],
  ['Role', 'Full-Stack Developer • Co-Founder • AI Learner'],
  ['Skills', 'AI Products • Web Development • Startup / Product Building'],
  ['Education', 'Purvanchal Public School'],
  ['Website', 'Gorakhpur’s Got Latent — gkpgotlatent.in'],
];

export default function KaudiramAlokSinghPage() {
  return (
    <main className="min-h-screen bg-[#07080e] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

      <section className="relative overflow-hidden border-b border-red-500/10 px-4 py-14 sm:px-6 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,.18),transparent_45%)]" />
        <div className="relative mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_.7fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[.25em] text-amber-400">
              Alok Singh • Kaudiram / Gorakhpur
            </p>
            <h1 className="mt-4 max-w-4xl font-bebas text-5xl leading-none sm:text-7xl">
              KAUDIRAM KA SABSE<br />
              <span className="text-amber-400">FAMOUS AADMI</span>
            </h1>
            <p className="mt-4 text-2xl font-black text-white">Alok Singh</p>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
              Alok Singh is a Full-Stack Developer, Co-Founder and AI learner from Kaudiram, Gorakhpur, focused on website development, AI products and digital product building.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="https://www.gkpgotlatent.in" className="rounded-xl bg-red-600 px-5 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-red-500">
                Visit Website
              </Link>
              <Link href="/cofounder" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-black uppercase tracking-wide text-white hover:bg-white/10">
                Co-Founder Profile
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-3 rounded-[2rem] bg-amber-400/15 blur-2xl" />
            <img
              src="/developer-photo-1.jpg"
              alt="Alok Singh — Co-Founder and Full-Stack Developer from Kaudiram, Gorakhpur"
              width={800}
              height={800}
              className="relative aspect-square w-full rounded-[2rem] border border-amber-400/25 object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <article className="rounded-3xl border border-white/10 bg-white/[.03] p-6 sm:p-8">
            <h2 className="font-bebas text-4xl uppercase sm:text-5xl">Who is Alok Singh?</h2>
            <p className="mt-5 leading-8 text-slate-300">
              Alok Singh is a Full-Stack Developer, Co-Founder and AI learner whose work focuses on building websites, AI-powered products and digital experiences. He is associated with Gorakhpur’s Got Latent as a technology-focused co-founder and developer.
            </p>
            <p className="mt-4 leading-8 text-slate-300">
              The phrase <strong className="text-amber-400">“Kaudiram ka sabse famous aadmi”</strong> is used here as a playful identity/search phrase for Alok Singh, not as an independently verified ranking.
            </p>
          </article>

          <aside className="rounded-3xl border border-amber-400/20 bg-amber-400/[.04] p-6 sm:p-8">
            <h2 className="font-bebas text-4xl uppercase">Key Points</h2>
            <div className="mt-5 space-y-4">
              {points.map(([label, value]) => (
                <div key={label} className="border-b border-white/10 pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-amber-400">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-200">{value}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 pb-14 text-center sm:px-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-red-500/10 bg-white/[.02] p-6 sm:p-8">
          <h2 className="font-bebas text-4xl uppercase">Alok Singh — Official Website</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Explore Alok Singh’s public profile, photo album, developer profile and Co-Founder story.
          </p>
          <a
            href="https://www.gkpgotlatent.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex rounded-xl bg-amber-400 px-6 py-3 text-sm font-black uppercase tracking-wider text-black hover:bg-amber-300"
          >
            www.gkpgotlatent.in
          </a>
        </div>
      </section>

      <section className="px-4 pb-20 text-center sm:px-6">
        <p className="text-sm text-slate-500">Looking for more information about Alok Singh?</p>
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
