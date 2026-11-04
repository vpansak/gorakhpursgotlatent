import type { Metadata } from 'next';

const pageUrl = 'https://www.gkpgotlatent.in/alok-singh-ggl-cofounder';

export const metadata: Metadata = {
  title: "Alok Singh — Co-Founder, Computerji & Technical Head | Gorakhpur's Got Latent",
  description:
    "Official GGL profile of Alok Singh from Gorakhpur, Uttar Pradesh: Co-Founder, Computerji and Technical Head of Gorakhpur's Got Latent (GGL), responsible for its website, digital platform and technology.",
  keywords: [
    'Alok Singh',
    'Alok Singh Gorakhpur',
    'Alok Singh GGL',
    'Alok Singh Gorakhpur Got Latent',
    "Alok Singh Gorakhpur's Got Latent",
    'Alok Singh GGL Co-Founder',
    'GGL Co-Founder Alok Singh',
    'Gorakhpur Got Latent Co-Founder',
    'Gorakhpur Got Latent Technical Head',
    'Alok Singh Computerji',
    'Computerji GGL',
    'GGL Computerji',
    'Alok Singh Technical Head',
    'Alok Singh Full Stack Developer',
    'Alok Singh web developer Gorakhpur',
    'Alok Singh Kaudiram',
    'Gorakhpur entertainment platform',
  ],
  alternates: { canonical: pageUrl },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'profile',
    url: pageUrl,
    title: "Alok Singh — GGL Co-Founder, Computerji & Technical Head",
    description:
      "Meet Alok Singh, Co-Founder, Computerji and Technical Head associated with the website, digital systems and technology of Gorakhpur's Got Latent.",
    siteName: "Gorakhpur's Got Latent",
    locale: 'en_IN',
    images: [{
      url: 'https://www.gkpgotlatent.in/developer-photo-1.jpg',
      width: 800,
      height: 800,
      alt: "Alok Singh — Co-Founder and Technical Head of Gorakhpur's Got Latent",
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Alok Singh — GGL Co-Founder, Computerji & Technical Head",
    description:
      "Official profile of Alok Singh, Co-Founder, Computerji and Technical Head of Gorakhpur's Got Latent.",
    images: ['https://www.gkpgotlatent.in/developer-photo-1.jpg'],
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://www.gkpgotlatent.in/#alok-singh',
  name: 'Alok Singh',
  alternateName: ['Alok Singh Gorakhpur', 'Alok Singh GGL', 'Computerji', 'Alok Singh GGL Co-Founder'],
  description:
    "Alok Singh is the Co-Founder, Computerji and Technical Head associated with Gorakhpur's Got Latent (GGL), based in Gorakhpur, Uttar Pradesh, India.",
  image: 'https://www.gkpgotlatent.in/developer-photo-1.jpg',
  url: pageUrl,
  jobTitle: ['Co-Founder', 'Computerji', 'Technical Head', 'Full-Stack Developer'],
  sameAs: [
    'https://www.instagram.com/aloksingh_._/',
    'https://x.com/rajpratapsinghh',
    'https://www.facebook.com/meadorush',
    'https://www.linkedin.com/in/alok-singh-8102a8414/',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Gorakhpur',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
  },
  worksFor: {
    '@type': 'Organization',
    '@id': 'https://www.gkpgotlatent.in/#organization',
    name: "Gorakhpur's Got Latent",
    url: 'https://www.gkpgotlatent.in/',
  },
  knowsAbout: [
    'Full-stack web development',
    'Website development',
    'Digital platforms',
    'Technical operations',
    'Ticketing and verification systems',
    'Computerji',
    'Search engine optimization',
  ],
};

const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': pageUrl + '#profile',
  url: pageUrl,
  name: "Alok Singh — Co-Founder, Computerji & Technical Head of Gorakhpur's Got Latent",
  mainEntity: { '@id': 'https://www.gkpgotlatent.in/#alok-singh' },
  about: { '@id': 'https://www.gkpgotlatent.in/#organization' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Who is Alok Singh in Gorakhpur's Got Latent?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Alok Singh is the Co-Founder, Computerji and Technical Head associated with Gorakhpur's Got Latent (GGL).",
      },
    },
    {
      '@type': 'Question',
      name: 'Is Alok Singh a GGL Co-Founder?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. Gorakhpur's Got Latent identifies Alok Singh as its Co-Founder.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is Alok Singh responsible for at GGL?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Alok Singh leads the technical side of GGL, including its website, digital platform and related technology systems. He is also known in the GGL context as Computerji.",
      },
    },
    {
      '@type': 'Question',
      name: 'Who is the founder and host of Gorakhpur’s Got Latent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Naveen Varma is the Founder and Host of Gorakhpur's Got Latent. Alok Singh is the Co-Founder, Computerji and Technical Head.",
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Alok Singh from?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Alok Singh is associated with Gorakhpur, Uttar Pradesh, India.',
      },
    },
  ],
};

export default function AlokSinghGGLCoFounderPage() {
  return (
    <main className="min-h-screen bg-[#05070d] px-5 py-14 text-white sm:px-8 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="mx-auto max-w-5xl">
        <header className="grid items-center gap-9 md:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-amber-300">
              Gorakhpur&apos;s Got Latent · Official Profile
            </p>
            <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-7xl">
              ALOK <span className="text-amber-300">SINGH</span>
            </h1>
            <h2 className="mt-5 text-xl font-extrabold leading-relaxed text-slate-100 sm:text-2xl">
              Co-Founder · Computerji · Technical Head
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Alok Singh is the Co-Founder, Computerji and Technical Head associated with
              Gorakhpur&apos;s Got Latent (GGL), a talent and entertainment platform based
              in Gorakhpur, Uttar Pradesh. His work is focused on the show&apos;s website,
              digital experience, technical infrastructure and online systems.
            </p>
            <p className="mt-4 text-sm font-semibold text-slate-400">
              Gorakhpur, Uttar Pradesh, India
            </p>
          </div>
          <img
            src="/developer-photo-1.jpg"
            alt="Alok Singh, Co-Founder and Technical Head of Gorakhpur's Got Latent"
            width={800}
            height={800}
            className="aspect-square w-full rounded-3xl border border-amber-300/20 object-cover"
          />
        </header>

        <section className="mt-16 border-t border-white/10 pt-10">
          <h2 className="text-3xl font-black sm:text-4xl">Alok Singh&apos;s role in GGL</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-3">
            {[
              ['Co-Founder', "Alok Singh is a Co-Founder of Gorakhpur's Got Latent and part of the team building the platform."],
              ['Computerji', 'Computerji is the on-show identity associated with Alok Singh in the GGL experience.'],
              ['Technical Head', 'He leads the technical work connected with the GGL website, digital platform and technology systems.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                <h3 className="text-xl font-black text-amber-300">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 max-w-4xl">
          <h2 className="text-3xl font-black">GGL leadership</h2>
          <p className="mt-4 text-base leading-8 text-slate-300">
            Gorakhpur&apos;s Got Latent is founded by Naveen Varma, alongside Co-Founder &amp; Technical Head Alok Singh. Naveen is also the show&apos;s
            host. Alok Singh is the Co-Founder, Computerji and Technical Head. These are
            distinct roles within the GGL team.
          </p>
        </section>

        <section className="mt-14 border-t border-white/10 pt-10">
          <h2 className="text-3xl font-black">Find Alok Singh online</h2>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
            <a className="rounded-xl border border-white/15 px-4 py-3 hover:border-amber-300" href="https://www.instagram.com/aloksingh_._/" rel="me">Instagram</a>
            <a className="rounded-xl border border-white/15 px-4 py-3 hover:border-amber-300" href="https://www.linkedin.com/in/alok-singh-8102a8414/" rel="me">LinkedIn</a>
            <a className="rounded-xl border border-white/15 px-4 py-3 hover:border-amber-300" href="https://x.com/rajpratapsinghh" rel="me">X</a>
            <a className="rounded-xl border border-white/15 px-4 py-3 hover:border-amber-300" href="https://www.gkpgotlatent.in/cofounder">GGL Co-Founder Profile</a>
          </div>
        </section>
      </article>
    </main>
  );
}
