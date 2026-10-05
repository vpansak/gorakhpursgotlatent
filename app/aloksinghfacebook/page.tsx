import type { Metadata } from 'next';

const pageUrl = 'https://www.gkpgotlatent.in/aloksinghfacebook';

export const metadata: Metadata = {
  title: 'Alok Singh Facebook ID & Profile | Official Facebook Profile, ID & Username',
  description: 'Looking for Alok Singh Facebook profile, Facebook ID & Profile, username or official Facebook account? Find the public Alok Singh Facebook profile, social links and updates here.',
  keywords: ["Alok Singh Facebook","Alok Singh Facebook ID","Alok Singh Facebook profile","Alok Singh Facebook username","Alok Singh official Facebook","Alok Singh Facebook account","Alok Singh Gorakhpur Facebook","Alok Singh Facebook page","Alok Singh social media Facebook","Alok Singh Facebook profile link"],
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: {
    title: 'Alok Singh Facebook ID & Profile | Official Facebook Profile',
    description: 'Find Alok Singh Facebook profile, Facebook ID & Profile, username and official social link.',
    url: pageUrl,
    siteName: 'Alok Singh',
    locale: 'en_IN',
    type: 'profile',
    images: [{ url: '/developer-photo-1.jpg', width: 800, height: 800, alt: 'Alok Singh Facebook profile' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alok Singh Facebook ID & Profile | Official Facebook Profile',
    description: 'Find Alok Singh Facebook profile and official social username.',
    images: ['/developer-photo-1.jpg'],
  },
};

const socialUrl = 'https://www.facebook.com/meadorush';
const faqs = [["What is Alok Singh Facebook ID?","The Alok Singh Facebook profile linked on this page is @meadorush."],["What is Alok Singh Facebook username?","Alok Singh Facebook username shown here is @meadorush."],["What is Alok Singh official Facebook?","This page provides the Facebook profile currently listed for Alok Singh and a direct link to it."],["Where can I find Alok Singh Facebook profile?","Use the direct Open Alok Singh Facebook button on this page to visit the linked profile."],["Does Alok Singh have a Facebook account?","Yes. This page provides the Facebook account currently listed for Alok Singh."],["How can I contact Alok Singh on Facebook?","Open the Facebook profile and use Facebook messaging if available."]];

const profileJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': pageUrl + '#webpage',
  url: pageUrl,
  name: 'Alok Singh Facebook ID & Profile — Official Facebook Profile',
  description: 'Public profile page for finding Alok Singh Facebook profile, Facebook ID & Profile, username and social account.',
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://www.gkpgotlatent.in/developer#person',
    name: 'Alok Singh',
    jobTitle: 'Full-Stack Developer & Co-Founder',
    url: 'https://www.gkpgotlatent.in/developer',
    image: 'https://www.gkpgotlatent.in/developer-photo-1.jpg',
    sameAs: [socialUrl],
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#05070d] font-medium text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
        <header className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-300">Official Social Profile</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Alok Singh Facebook ID & Profile</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-400 sm:text-lg">
            Looking for Alok Singh Facebook, Alok Singh Facebook ID & Profile, username or official profile? Find the public profile, social updates and direct account link from one page.
          </p>
        </header>

        <section className="mx-auto mt-10 max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-7 text-center sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-400/20 bg-blue-400/10 text-2xl font-black text-blue-300">f</div>
          <h2 className="mt-6 text-2xl font-black sm:text-3xl">@meadorush</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">Alok Singh · Facebook ID · Facebook Username</p>
          <a href={socialUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-blue-400 px-6 py-4 text-sm font-black text-black transition hover:bg-blue-300 sm:w-auto">
            Open Alok Singh Facebook →
          </a>
          <p className="mt-4 text-xs font-semibold text-slate-600">Open the official social profile for posts, updates and public information.</p>
        </section>

        <section className="mt-14">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">Alok Singh Facebook Search</p>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">Looking for Alok Singh Facebook ID & Profile?</h2>
          <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-400">
            If you searched for Alok Singh Facebook, Alok Singh Facebook ID & Profile, Alok Singh Facebook username, Alok Singh official Facebook or Alok Singh Facebook profile, this page provides the direct profile link.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {["Alok Singh Facebook","Alok Singh Facebook ID","Alok Singh Facebook profile","Alok Singh Facebook username","Alok Singh official Facebook","Alok Singh Facebook account","Alok Singh Gorakhpur Facebook","Alok Singh Facebook page"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm font-bold text-slate-300">{item}</div>
            ))}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="faq">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">FAQ</p>
          <h2 id="faq" className="mt-3 text-2xl font-black sm:text-3xl">Questions about Alok Singh Facebook ID & Profile</h2>
          <div className="mt-6 space-y-3">
            {faqs.map(([q, a]) => (
              <details key={q} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <summary className="cursor-pointer text-sm font-bold text-white">{q}</summary>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-400">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-blue-400/15 bg-blue-400/[0.04] p-7 sm:p-10">
          <h2 className="text-2xl font-black sm:text-3xl">More about Alok Singh</h2>
          <p className="mt-4 text-sm font-semibold leading-7 text-slate-400">Explore the Alok Singh photo album, Instagram profile and developer profile for more public information.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/aloksinghalbum" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold hover:border-blue-400/40">Alok Singh Photo Album</a>
            <a href="/aloksinghinstagram" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold hover:border-blue-400/40">Alok Singh Instagram</a>
            <a href="/developer" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold hover:border-blue-400/40">Developer Profile</a>
          </div>
        </section>

        <footer className="mt-16 border-t border-white/5 pt-7 text-center">
          <a href="/" className="text-sm font-semibold text-slate-400 hover:text-white">← Back to Gorakhpur's Got Latent</a>
        </footer>
      </div>
    </main>
  );
}
