import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'GKP Talent Tower | GGL Talent Tower, Gorakhpur',
  description:
    "Discover GKP Talent Tower, also searched as GKP Tilent Tower, Gorakhpur Talent Tower and GGL Talent Tower — a talent-focused initiative connected with Gorakhpur's Got Latent. Explore opportunities and apply online.",
  keywords: [
    'GKP Talent Tower',
    'GKP Tilent Tower',
    'Gorakhpur Talent Tower',
    'Gorakhpur Talent Tower GGL',
    'GGL Talent Tower',
    'GGL Tilent Tower',
    "Gorakhpur's Got Latent",
    'Gorakhpur talent platform',
    'Gorakhpur performers',
    'Purvanchal talent',
    'talent application Gorakhpur',
    'GKP talent',
  ],
  alternates: {
    canonical: 'https://www.gkpgotlatent.in/gkptilenttower',
  },
  openGraph: {
    title: 'GKP Talent Tower | GGL Talent Tower, Gorakhpur',
    description:
      "Learn about the GKP Talent Tower initiative associated with Gorakhpur's Got Latent and explore ways to apply.",
    url: 'https://www.gkpgotlatent.in/gkptilenttower',
    siteName: "Gorakhpur's Got Latent",
    type: 'website',
    locale: 'en_IN',
  },
};

const faqs = [
  {
    q: 'What is GKP Talent Tower?',
    a: "GKP Talent Tower is a name people may use while searching for a Gorakhpur-focused talent hub connected with GGL (Gorakhpur's Got Latent). For official show information and current opportunities, use the GGL website and its application pages.",
  },
  {
    q: 'Is GKP Tilent Tower the same search as GGL Talent Tower?',
    a: 'These are spelling and naming variations visitors may use for the same topic: GKP Talent Tower, GKP Tilent Tower, GGL Talent Tower and Gorakhpur Talent Tower. This page helps visitors find the official GGL platform.',
  },
  {
    q: 'Who can apply through Gorakhpur’s Got Latent?',
    a: 'Depending on current openings, people can explore performer, guest, sponsor and team application options. Each application page explains the relevant process. Applying does not guarantee selection.',
  },
  {
    q: 'How do I apply?',
    a: 'Choose the appropriate application category using the Apply Now button below. Complete the form and follow the instructions shown on the official page. For performer applications, check the latest audition and clip-submission instructions.',
  },
];

export default function GkpTalentTowerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'GKP Talent Tower | GGL Talent Tower, Gorakhpur',
    url: 'https://www.gkpgotlatent.in/gkptilenttower',
    description:
      "Information for people searching for GKP Talent Tower, GKP Tilent Tower, Gorakhpur Talent Tower and GGL Talent Tower.",
    isPartOf: {
      '@type': 'WebSite',
      name: "Gorakhpur's Got Latent",
      url: 'https://www.gkpgotlatent.in',
    },
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  };

  return (
    <div className="min-h-screen bg-[#07080e] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative overflow-hidden border-b border-amber-500/20 bg-gradient-to-br from-[#160b12] via-[#07080e] to-[#171006] px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-amber-400">
            Gorakhpur • Purvanchal • Talent & Entertainment
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            GKP Talent Tower
            <span className="mt-2 block text-amber-400">GGL Talent Tower, Gorakhpur</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Searching for <strong>GKP Tilent Tower</strong>, <strong>Gorakhpur Talent Tower</strong>,
            or <strong>GGL Talent Tower</strong>? This page connects you with Gorakhpur’s Got Latent
            (GGL), a talent and entertainment platform for discovering performers, creative people,
            collaborators and local opportunities across Gorakhpur and the wider Purvanchal region.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/apply" className="inline-flex rounded-lg bg-amber-400 px-6 py-3 font-extrabold text-black transition hover:bg-amber-300">
              Apply Now →
            </Link>
            <Link href="/" className="inline-flex rounded-lg border border-white/20 px-6 py-3 font-bold text-white transition hover:border-amber-400">
              Explore Official GGL Website
            </Link>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-slate-400">
            Note: This page is an information and application guide for the GGL talent platform. It does not claim that a separate physical tower or venue is currently open.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
        <h2 className="text-3xl font-black sm:text-4xl">What is GKP Talent Tower?</h2>
        <p className="mt-5 leading-8 text-slate-300">
          The terms <strong>GKP Talent Tower</strong>, <strong>GKP Tilent Tower</strong> and
          <strong> GGL Talent Tower</strong> may be used by people looking for a talent-focused
          destination in Gorakhpur. GGL stands for <strong>Gorakhpur’s Got Latent</strong> — a live
          talent and entertainment show that brings together original acts, unusual skills, comedy,
          music, creators and audience energy. The official GGL website shares show announcements,
          audition information, ticket details and ways to participate.
        </p>
        <p className="mt-4 leading-8 text-slate-300">
          Whether you are a performer looking for a stage, a creator interested in collaborating,
          a business exploring sponsorship, or a person who wants to follow local entertainment,
          start with the official GGL information and choose the application route that matches
          your role. Availability, eligibility, event dates and selection decisions depend on
          the latest announcement from the GGL team.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-xl font-bold text-amber-300">For performers</h3>
            <p className="mt-3 leading-7 text-slate-300">Explore performer applications and read the current audition, clip-submission and shortlist instructions before applying.</p>
            <Link href="/apply/performer" className="mt-4 inline-block font-bold text-amber-300 underline underline-offset-4">Performer application →</Link>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-xl font-bold text-amber-300">For guests and creators</h3>
            <p className="mt-3 leading-7 text-slate-300">If you are a creator, public personality or potential guest, review the guest application route and share relevant details.</p>
            <Link href="/apply/guest" className="mt-4 inline-block font-bold text-amber-300 underline underline-offset-4">Guest application →</Link>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-xl font-bold text-amber-300">For brands and sponsors</h3>
            <p className="mt-3 leading-7 text-slate-300">Businesses interested in supporting local talent and entertainment can review the sponsorship application and submit their proposal.</p>
            <Link href="/apply/sponsor" className="mt-4 inline-block font-bold text-amber-300 underline underline-offset-4">Sponsor application →</Link>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-xl font-bold text-amber-300">For team and production support</h3>
            <p className="mt-3 leading-7 text-slate-300">People interested in helping with production, media, technology or event operations can check the current team application option.</p>
            <Link href="/apply/join-team" className="mt-4 inline-block font-bold text-amber-300 underline underline-offset-4">Join the team →</Link>
          </article>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] px-5 py-14 sm:py-18">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-black sm:text-4xl">Why people search for GKP Talent Tower</h2>
          <p className="mt-5 leading-8 text-slate-300">
            Search phrases are not always typed the same way. Some people write “Gorakhpur Talent
            Tower”, others search “GKP Talent Tower”, “GKP Tilent Tower”, “GGL Talent Tower” or
            “Gorakhpur’s Got Latent”. This page brings those related terms together in one useful
            place and directs visitors to official GGL information instead of making them guess
            which page to open.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {['GKP Talent Tower', 'GKP Tilent Tower', 'Gorakhpur Talent Tower', 'GGL Talent Tower', 'GGL Tilent Tower', 'Gorakhpur’s Got Latent', 'Purvanchal talent', 'Gorakhpur talent platform'].map((term) => (
              <span key={term} className="rounded-full border border-amber-400/25 bg-amber-400/5 px-3 py-2 text-sm text-amber-100">{term}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
        <h2 className="text-3xl font-black sm:text-4xl">Frequently asked questions</h2>
        <div className="mt-7 space-y-4">
          {faqs.map(({ q, a }) => (
            <article key={q} className="rounded-xl border border-white/10 p-5">
              <h3 className="text-lg font-bold text-amber-300">{q}</h3>
              <p className="mt-2 leading-7 text-slate-300">{a}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-amber-400/30 bg-amber-400/[0.06] p-7 sm:p-9">
          <h2 className="text-2xl font-black sm:text-3xl">Ready to take the next step?</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-300">
            Visit the official application hub to choose performer, guest, sponsor or team options.
            Review the instructions carefully and submit accurate information.
          </p>
          <Link href="/apply" className="mt-6 inline-flex rounded-lg bg-amber-400 px-6 py-3 font-extrabold text-black transition hover:bg-amber-300">
            Go to Apply Now →
          </Link>
        </div>
      </section>
    </div>
  );
}
