import type { Metadata } from 'next';

const pageUrl = 'https://www.gkpgotlatent.in/gglaloksingh';

export const metadata: Metadata = {
  title: "GGL Alok Singh | Gorakhpur's Got Latent Co-Founder & Developer",
  description:
    "GGL Alok Singh — learn about Alok Singh, Co-Founder and Full-Stack Developer behind the Gorakhpur's Got Latent digital platform, website and technology.",
  keywords: [
    'GGL Alok Singh',
    'Gorakhpur Got Latent Alok Singh',
    "Gorakhpur's Got Latent Alok Singh",
    'Alok Singh GGL',
    'Alok Singh Gorakhpur Got Latent',
    'GGL founder Alok Singh',
    'GGL co-founder Alok Singh',
    'Alok Singh GGL developer',
    'GGL Alok Singh developer',
    'Gorakhpur Got Latent co-founder',
    'Alok Singh Full Stack Developer GGL',
  ],
  alternates: { canonical: pageUrl },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    title: "GGL Alok Singh | Gorakhpur's Got Latent",
    description: "Alok Singh — Co-Founder and Full-Stack Developer associated with Gorakhpur's Got Latent.",
    url: pageUrl,
    siteName: "Gorakhpur's Got Latent",
    locale: 'en_IN',
    type: 'profile',
    images: [{ url: '/developer-photo-1.jpg', width: 800, height: 800, alt: 'Alok Singh - GGL Co-Founder and Developer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "GGL Alok Singh | Gorakhpur's Got Latent",
    description: "Alok Singh, GGL Co-Founder and Full-Stack Developer.",
    images: ['/developer-photo-1.jpg'],
  },
};

const faqs = [
  ['Who is Alok Singh in GGL?', "Alok Singh is listed as a Co-Founder and Full-Stack Developer associated with Gorakhpur's Got Latent."],
  ["What is Alok Singh's role in Gorakhpur's Got Latent?", 'Alok Singh works on the digital and technology side of GGL, including the website and platform development.'],
  ['Is Alok Singh a GGL Co-Founder?', "Yes. GGL's public profile pages identify Alok Singh as a Co-Founder."],
  ['Who developed the GGL website?', "Alok Singh is associated with the full-stack development and technology work for Gorakhpur's Got Latent."],
  ['What is GGL Alok Singh known for?', "GGL Alok Singh is associated with web development, AI learning, digital product building and the technology platform of Gorakhpur's Got Latent."],
  ['Where can I learn more about Alok Singh?', 'You can explore the full Alok Singh profile, photo album, Instagram profile and developer page through the links below.'],
];

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://www.gkpgotlatent.in/developer#person',
  name: 'Alok Singh',
  jobTitle: 'Full-Stack Developer & Co-Founder',
  image: 'https://www.gkpgotlatent.in/developer-photo-1.jpg',
  url: pageUrl,
  sameAs: [
    'https://www.instagram.com/aloksingh_._/',
    'https://x.com/rajpratapsinghh',
    'https://www.facebook.com/meadorush',
    'https://www.linkedin.com/in/alok-singh-8102a8414/',
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function GGLAlokSinghPage() {
  return (
    <main className="min-h-screen bg-[#05070d] font-medium text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
        <header className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">Gorakhpur&apos;s Got Latent</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">GGL Alok Singh</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base font-semibold leading-7 text-slate-400 sm:text-lg">
            Alok Singh and GGL — the Co-Founder and Full-Stack Developer associated with the website,
            digital platform and technology behind Gorakhpur&apos;s Got Latent.
          </p>
        </header>

        <section className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <img
              src="/developer-photo-1.jpg"
              alt="Alok Singh - GGL Co-Founder and Full-Stack Developer"
              className="h-auto w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Alok Singh · GGL</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Alok Singh — GGL Co-Founder</h2>
            <p className="mt-5 text-base font-semibold leading-8 text-slate-400">
              On GGL, Alok Singh is associated with full-stack web development, product building, platform
              technology, applications, ticketing, verification, APIs, deployment and SEO. This page brings
              together the public information connecting Alok Singh with Gorakhpur&apos;s Got Latent.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="/allaboutaloksingh" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold hover:border-amber-400/40">All About Alok Singh</a>
              <a href="/developer" className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black hover:bg-amber-300">Developer Profile</a>
              <a href="/aloksinghalbum" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold hover:border-amber-400/40">Photo Album</a>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">GGL + Alok Singh</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Why Alok Singh appears with GGL</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['Co-Founder', "Alok Singh is publicly presented as a Co-Founder associated with Gorakhpur's Got Latent."],
              ['Full-Stack Developer', 'Technology, web development and platform engineering are part of his GGL role.'],
              ['Website & Platform', 'The GGL website and digital experience are part of the technology work connected with Alok Singh.'],
              ['Ticketing & Verification', 'GGL digital workflows include online ticketing and ticket verification technology.'],
              ['SEO & Digital Growth', 'Alok Singh is associated with SEO, digital product building and online presence for GGL.'],
              ['AI & Product Building', 'His profile includes AI learning and building technology-driven digital products.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-amber-400/15 bg-amber-400/[0.04] p-7 sm:p-10">
          <h2 className="text-3xl font-black">Searches this page answers</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              'GGL Alok Singh',
              'Alok Singh GGL',
              "Gorakhpur's Got Latent Alok Singh",
              'Gorakhpur Got Latent Alok Singh',
              'GGL Co-Founder Alok Singh',
              'GGL Developer Alok Singh',
              'Alok Singh Full-Stack Developer GGL',
            ].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-bold text-slate-300">{item}</span>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">FAQ</p>
          <h2 className="mt-3 text-3xl font-black">GGL Alok Singh — Frequently Asked Questions</h2>
          <div className="mt-7 space-y-3">
            {faqs.map(([q, a]) => (
              <details key={q} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <summary className="cursor-pointer text-sm font-bold">{q}</summary>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-400">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="mt-16 border-t border-white/5 pt-8">
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/allaboutaloksingh" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold">All About Alok Singh</a>
            <a href="/aloksinghinstagram" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold">Alok Singh Instagram</a>
            <a href="/aloksinghfacebook" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold">Alok Singh Facebook</a>
            <a href="/aloksinghx" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold">Alok Singh X</a>
            <a href="/" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold">GGL Home</a>
          </div>
        </footer>
      </div>
    </main>
  );
}