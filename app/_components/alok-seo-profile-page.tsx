import Link from 'next/link';

type Section = { title: string; body: string };
type ProfilePageProps = {
  title: string;
  eyebrow: string;
  intro: string;
  sections: Section[];
  related: { href: string; label: string }[];
};

export default function AlokSeoProfilePage({ title, eyebrow, intro, sections, related }: ProfilePageProps) {
  const canonical = 'https://www.gkpgotlatent.in' + (typeof window === 'undefined' ? '' : '');
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.gkpgotlatent.in/#alok-singh',
    name: 'Alok Singh',
    alternateName: ['Computerji', 'Alok Singh GGL Co-Founder'],
    jobTitle: ['Co-Founder', 'Computerji', 'Technical Head'],
    worksFor: { '@type': 'Organization', name: "Gorakhpur's Got Latent", url: 'https://www.gkpgotlatent.in/' },
    address: { '@type': 'PostalAddress', addressLocality: 'Gorakhpur', addressRegion: 'Uttar Pradesh', addressCountry: 'IN' },
    sameAs: ['https://www.instagram.com/aloksingh_._/', 'https://www.linkedin.com/in/alok-singh-8102a8414/', 'https://x.com/rajpratapsinghh']
  };
  return (
    <main className="min-h-screen bg-[#05070d] px-5 py-14 text-white sm:px-8 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <article className="mx-auto max-w-4xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-amber-300">{eyebrow}</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">{title}</h1>
        <p className="mt-6 text-base leading-8 text-slate-300 sm:text-lg">{intro}</p>
        <div className="mt-10 space-y-9">
          {sections.map((section) => (
            <section key={section.title} className="border-t border-white/10 pt-7">
              <h2 className="text-2xl font-black text-white">{section.title}</h2>
              <p className="mt-3 leading-8 text-slate-300">{section.body}</p>
            </section>
          ))}
        </div>
        <section className="mt-12 border-t border-white/10 pt-8">
          <h2 className="text-2xl font-black">Related GGL and Alok Singh pages</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {related.map((item) => <li key={item.href}><Link className="text-amber-300 underline underline-offset-4 hover:text-amber-200" href={item.href}>{item.label}</Link></li>)}
            <li><Link className="text-amber-300 underline underline-offset-4" href="/alok-singh-ggl-seo">Alok Singh profile directory</Link></li>
            <li><Link className="text-amber-300 underline underline-offset-4" href="/alok-singh-ggl-cofounder">Official GGL Co-Founder profile</Link></li>
          </ul>
        </section>
        <footer className="mt-12 border-t border-white/10 pt-6 text-sm text-slate-400">
          Gorakhpur&apos;s Got Latent · Gorakhpur, Uttar Pradesh, India ·
          <Link className="ml-2 text-amber-300 underline" href="/">Official GGL website</Link>
        </footer>
      </article>
    </main>
  );
}
