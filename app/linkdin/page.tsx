import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = 'https://www.gkpgotlatent.in';
const pageUrl = `${siteUrl}/linkdin`;
const linkedInUrl = 'https://www.linkedin.com/in/gglgkp';

export const metadata: Metadata = {
  title: "Gorakhpur's Got Latent on LinkedIn | GGL Official Profile",
  description:
    "Connect with Gorakhpur's Got Latent (GGL) on LinkedIn. Explore our talent and entertainment platform, creator collaborations, auditions, events, and GGL Talent Tour updates.",
  keywords: [
    "Gorakhpur's Got Latent LinkedIn",
    'GGL LinkedIn',
    'GGL GKP',
    'Gorakhpur talent platform',
    'Gorakhpur talent show',
    'Gorakhpur entertainment platform',
    'GGL Talent Tour',
    'Purvanchal talent',
    'Gorakhpur creators',
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Gorakhpur's Got Latent on LinkedIn | GGL",
    description:
      'Find the official LinkedIn profile for Gorakhpur’s Got Latent (GGL), discover our work, and explore talent, creator, event and collaboration updates.',
    url: pageUrl,
    siteName: "Gorakhpur's Got Latent",
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary',
    title: "Gorakhpur's Got Latent on LinkedIn | GGL",
    description:
      'Connect with GGL for talent, entertainment, creator collaborations and GGL Talent Tour updates.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: "Gorakhpur's Got Latent",
  alternateName: ['GGL', 'GGL GKP'],
  url: siteUrl,
  description:
    "Gorakhpur's Got Latent (GGL) is a talent and entertainment platform focused on discovering and showcasing performers, creators and original acts from Gorakhpur and the wider Purvanchal region.",
  sameAs: [linkedInUrl, 'https://www.instagram.com/gkp_got_latent/', 'https://www.youtube.com/@GkpGotLatent', 'https://x.com/gkpgotlatent'],
  knowsAbout: [
    'Talent discovery',
    'Entertainment',
    'Creator collaborations',
    'Live events',
    'GGL Talent Tour',
  ],
};

export default function LinkedInProfilePage() {
  return (
    <main className="min-h-screen bg-[#07080e] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <section className="relative overflow-hidden border-b border-amber-500/20 bg-gradient-to-br from-[#1b1015] via-[#07080e] to-[#171006] px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-400">
            Official Social Profile
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            Gorakhpur’s Got Latent
            <span className="mt-2 block text-amber-400">(GGL) on LinkedIn</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Welcome to the official website page for Gorakhpur’s Got Latent (GGL) on LinkedIn.
            GGL is a talent and entertainment platform focused on discovering unique performers,
            encouraging original acts, and creating opportunities for creators and collaborators
            from Gorakhpur and the wider Purvanchal region.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg bg-amber-400 px-6 py-3 font-extrabold text-black transition hover:bg-amber-300"
            >
              Visit GGL on LinkedIn ↗
            </a>
            <Link
              href="/"
              className="inline-flex rounded-lg border border-white/20 px-6 py-3 font-bold text-white transition hover:border-amber-400"
            >
              Visit Official GGL Website
            </Link>
          </div>
          <p className="mt-4 break-all text-sm text-slate-400">
            LinkedIn profile: <a className="text-amber-300 underline underline-offset-4" href={linkedInUrl} target="_blank" rel="noopener noreferrer">{linkedInUrl}</a>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
        <h2 className="text-3xl font-black sm:text-4xl">About Gorakhpur’s Got Latent (GGL)</h2>
        <p className="mt-5 leading-8 text-slate-300">
          Gorakhpur’s Got Latent is a talent and entertainment initiative built to give distinctive
          performers and creative people a platform to showcase their skills. Through auditions,
          entertainment episodes, digital content and collaborations, GGL aims to connect talent
          with audiences and build a stronger creative community in Gorakhpur.
        </p>
        <p className="mt-4 leading-8 text-slate-300">
          Our areas of interest include talent discovery, original performances, creator
          collaborations, event production, brand partnerships and the GGL Talent Tour. Dates,
          eligibility and participation opportunities are announced through official GGL channels
          when confirmed.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-xl font-bold text-amber-300">Talent & auditions</h3>
            <p className="mt-3 leading-7 text-slate-300">Explore current performer information and official audition instructions.</p>
            <Link href="/apply/performer" className="mt-4 inline-block font-bold text-amber-300 underline underline-offset-4">Performer application →</Link>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-xl font-bold text-amber-300">Creators & guests</h3>
            <p className="mt-3 leading-7 text-slate-300">Find information for creators and potential guests interested in connecting with GGL.</p>
            <Link href="/apply/guest" className="mt-4 inline-block font-bold text-amber-300 underline underline-offset-4">Guest application →</Link>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-xl font-bold text-amber-300">Brands & sponsorships</h3>
            <p className="mt-3 leading-7 text-slate-300">Businesses can review official sponsorship information and partnership options.</p>
            <Link href="/apply/sponsor" className="mt-4 inline-block font-bold text-amber-300 underline underline-offset-4">Sponsor with GGL →</Link>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-xl font-bold text-amber-300">GGL Talent Tour</h3>
            <p className="mt-3 leading-7 text-slate-300">Follow official announcements for the GGL Talent Tour and related creative activities.</p>
            <Link href="/ggl_talent_trip" className="mt-4 inline-block font-bold text-amber-300 underline underline-offset-4">Explore talent tour information →</Link>
          </article>
        </div>

        <div className="mt-12 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-black">Follow GGL’s official channels</h2>
          <p className="mt-3 leading-7 text-slate-300">
            Use these links to find GGL updates and opportunities. For confirmed announcements,
            always refer to the official website and linked social accounts.
          </p>
          <ul className="mt-5 space-y-3 text-slate-200">
            <li><span className="font-bold">Website:</span> <a className="text-amber-300 underline" href={siteUrl}>gkpgotlatent.in</a></li>
            <li><span className="font-bold">LinkedIn:</span> <a className="text-amber-300 underline" href={linkedInUrl} target="_blank" rel="noopener noreferrer">linkedin.com/in/gglgkp</a></li>
            <li><span className="font-bold">Instagram:</span> <a className="text-amber-300 underline" href="https://www.instagram.com/gkp_got_latent/" target="_blank" rel="noopener noreferrer">@gkp_got_latent</a></li>
            <li><span className="font-bold">YouTube:</span> <a className="text-amber-300 underline" href="https://www.youtube.com/@GkpGotLatent" target="_blank" rel="noopener noreferrer">Gorakhpur’s Got Latent</a></li>
            <li><span className="font-bold">X:</span> <a className="text-amber-300 underline" href="https://x.com/gkpgotlatent" target="_blank" rel="noopener noreferrer">@gkpgotlatent</a></li>
          </ul>
        </div>
      </section>
    </main>
  );
}
