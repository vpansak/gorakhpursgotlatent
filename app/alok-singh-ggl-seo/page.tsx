import type { Metadata } from 'next';
import Link from 'next/link';

const pageUrl = 'https://www.gkpgotlatent.in/alok-singh-ggl-seo';

export const metadata: Metadata = {
  title: 'Alok Singh — Official GGL Co-Founder & Technical Head Profile Hub',
  description:
    "Explore the official GGL profile pages for Alok Singh: Co-Founder, Computerji, Technical Head, developer profile, biography, projects and public social profiles.",
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: {
    type: 'website',
    url: pageUrl,
    title: "Alok Singh | Gorakhpur's Got Latent — Profile & SEO Hub",
    description: "A directory of official profile pages about Alok Singh and his Co-Founder and technical role at Gorakhpur's Got Latent.",
    siteName: "Gorakhpur's Got Latent",
    locale: 'en_IN',
    images: [{ url: 'https://www.gkpgotlatent.in/developer-photo-1.jpg', width: 800, height: 800, alt: 'Alok Singh — GGL Co-Founder and Technical Head' }],
  },
};

const pages = [
  {
    href: '/alok-singh-ggl-cofounder',
    title: 'Alok Singh — GGL Co-Founder, Computerji & Technical Head',
    description: "The dedicated GGL profile explaining Alok Singh's Co-Founder, Computerji and Technical Head roles.",
  },
  {
    href: '/cofounder',
    title: 'GGL Co-Founder Profile',
    description: "A profile focused on Alok Singh's Co-Founder role and his work with Gorakhpur's Got Latent.",
  },
  {
    href: '/aboutaloksingh',
    title: 'About Alok Singh',
    description: 'Biography, background, education and technology journey.',
  },
  {
    href: '/allaboutaloksingh',
    title: 'All About Alok Singh',
    description: 'A broader profile directory covering biography, interests, projects and public profiles.',
  },
  {
    href: '/developer',
    title: 'Alok Singh — Developer Profile',
    description: 'Full-stack development, web engineering, APIs, databases and digital product work.',
  },
  {
    href: '/gglaloksingh',
    title: 'Alok Singh and Gorakhpur’s Got Latent',
    description: 'A GGL-focused page connecting Alok Singh with the Gorakhpur talent and entertainment platform.',
  },
  {
    href: '/aloksinghinstagram',
    title: 'Alok Singh — Instagram Profile',
    description: 'A dedicated page for finding Alok Singh’s Instagram presence.',
  },
  {
    href: '/aloksinghalbum',
    title: 'Alok Singh — Photo Album',
    description: 'A public photo and visual profile page.',
  },
];

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Alok Singh official profile pages',
  itemListElement: pages.map((page, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: 'https://www.gkpgotlatent.in' + page.href,
    name: page.title,
  })),
};

export default function AlokSinghSeoHubPage() {
  return (
    <main className="min-h-screen bg-[#05070d] px-5 py-14 text-white sm:px-8 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <article className="mx-auto max-w-5xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-amber-300">
          Gorakhpur&apos;s Got Latent · Official Profile Directory
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
          Alok Singh <span className="text-amber-300">— Profile Hub</span>
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
          This page brings together the official profile resources published on the
          Gorakhpur&apos;s Got Latent website about Alok Singh. Within GGL, Alok Singh is
          identified as Co-Founder, Computerji and Technical Head. The pages below cover
          different subjects, including his GGL role, biography, technology work and public
          profile resources.
        </p>
        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          {pages.map((page, index) => (
            <Link
              key={page.href}
              href={page.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-amber-300/50 hover:bg-white/[0.06]"
            >
              <span className="text-xs font-bold tracking-widest text-amber-300">PROFILE {String(index + 1).padStart(2, '0')}</span>
              <h2 className="mt-3 text-xl font-extrabold text-white group-hover:text-amber-200">{page.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{page.description}</p>
              <span className="mt-5 inline-block text-sm font-bold text-amber-300">Explore page →</span>
            </Link>
          ))}
        </section>
        <section className="mt-14 border-t border-white/10 pt-9">
          <h2 className="text-2xl font-black">GGL leadership</h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-300">
            Naveen Varma is the Founder and Host of Gorakhpur&apos;s Got Latent. Alok Singh
            is the Co-Founder, Computerji and Technical Head. This directory focuses on
            Alok&apos;s role and the different public resources about his work.
          </p>
          <p className="mt-6 text-sm text-slate-400">
            Official website: <a className="text-amber-300 underline" href="https://www.gkpgotlatent.in/">gkpgotlatent.in</a>
          </p>
        </section>
      </article>
    </main>
  );
}
