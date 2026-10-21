import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "All About GGL | Alok Singh & Naveen – Co-Founders of Gorakhpur's Got Latent",
  description:
    "Learn about Gorakhpur's Got Latent (GGL), its co-founders Alok Singh and Naveen, the 50-50% partnership stated by the founders, the show's vision, talent platform, episodes and official links.",
  alternates: { canonical: 'https://www.gkpgotlatent.in/allaboutggl123' },
  openGraph: {
    title: "All About GGL | Alok Singh & Naveen",
    description:
      "The story, vision and people behind Gorakhpur's Got Latent — co-founded by Alok Singh and Naveen.",
    url: 'https://www.gkpgotlatent.in/allaboutggl123',
    siteName: "Gorakhpur's Got Latent",
    type: 'website',
  },
};

const links = [
  { label: 'Official Website', href: 'https://www.gkpgotlatent.in' },
  { label: 'Instagram', href: 'https://www.instagram.com/gkp_got_latent/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@GkpGotLatent' },
  { label: 'WhatsApp Channel', href: 'https://whatsapp.com/channel/0029Vb91ZX43bbUzFYcP220S' },
  { label: 'X', href: 'https://x.com/gkpgotlatent' },
  { label: 'Facebook', href: 'https://www.facebook.com/' },
  { label: 'About Alok Singh', href: '/allaboutaloksingh' },
  { label: 'Episodes', href: '/episodes' },
  { label: 'Apply as Performer', href: '/apply/performer' },
  { label: 'Sponsor GGL', href: '/apply/sponsor' },
];

export default function AllAboutGGL123Page() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <section className="relative overflow-hidden border-b border-red-900/50 bg-gradient-to-br from-[#260909] via-[#100707] to-black">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-red-400">The Story Behind the Stage</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            All About <span className="text-red-500">Gorakhpur&apos;s Got Latent</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Gorakhpur&apos;s talent deserves a stage of its own. GGL is a talent and entertainment platform built around discovering local performers, creating memorable show experiences, and giving emerging talent an opportunity to be seen.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/apply/performer" className="rounded-xl bg-red-600 px-5 py-3 font-bold hover:bg-red-500">Show Your Talent</Link>
            <Link href="/episodes" className="rounded-xl border border-white/20 px-5 py-3 font-bold hover:bg-white/10">Explore Episodes</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-red-500/30 bg-white/[0.04] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">Co-Founder · Show Creator · Technology</p>
            <h2 className="mt-3 text-3xl font-black">Alok Singh</h2>
            <p className="mt-4 leading-7 text-zinc-300">
              Alok Singh is a co-founder and show creator associated with building Gorakhpur&apos;s Got Latent. His work spans the show&apos;s concept and digital presence, website development, technology, and the systems that help performers discover and engage with GGL.
            </p>
            <p className="mt-4 leading-7 text-zinc-300">
              A technology builder and full-stack developer from the Gorakhpur region, Alok brings together creativity and technology with the goal of helping local talent reach a wider audience.
            </p>
            <Link href="/allaboutaloksingh" className="mt-6 inline-flex font-bold text-red-400 underline underline-offset-4">Read Alok Singh&apos;s profile →</Link>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Co-Founder</p>
            <h2 className="mt-3 text-3xl font-black">Naveen</h2>
            <p className="mt-4 leading-7 text-zinc-300">
              Naveen is also a co-founder of Gorakhpur&apos;s Got Latent. He and Alok have been involved together in bringing the GGL concept and platform forward.
            </p>
            <p className="mt-4 leading-7 text-zinc-300">
              GGL is a collaborative effort: both co-founders contribute to the project and its development. This page identifies both founders so that information about the people behind the platform is easier to find.
            </p>
          </article>
        </div>

        <section className="mt-8 rounded-3xl border border-amber-400/30 bg-amber-400/[0.06] p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Partnership</p>
          <h2 className="mt-3 text-2xl font-black">Alok Singh & Naveen — 50–50% partnership</h2>
          <p className="mt-3 max-w-4xl leading-7 text-zinc-300">
            As stated by the GGL team for this profile, Alok Singh and Naveen are associated with GGL on a 50–50% partnership basis. For formal legal, financial, or contractual matters, refer to the applicable signed agreements and official records.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-black">What is GGL?</h2>
          <p className="mt-4 max-w-4xl leading-8 text-zinc-300">
            Gorakhpur&apos;s Got Latent is a talent and entertainment platform focused on giving performers a chance to present their unique skills. The wider vision includes live show experiences, performer discovery, episodes, guest appearances, audience participation, and opportunities for local brands to support the arts.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Talent', 'A platform for original, distinctive performances and emerging artists.'],
              ['Entertainment', 'Show experiences designed to bring performers and audiences together.'],
              ['Community', 'Connecting artists, viewers, guests, and local supporters.'],
              ['Opportunity', 'Ways to perform, collaborate, and explore sponsorships.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-lg font-bold text-red-300">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl font-black">Explore GGL</h2>
          <p className="mt-3 text-zinc-400">Official pages and useful ways to connect with the platform.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((item) => (
              <Link key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-4 py-4 font-semibold transition hover:border-red-500/50 hover:bg-red-500/10">
                <span>{item.label}</span><span className="text-red-400">↗</span>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-14 border-t border-white/10 pt-6 text-sm leading-6 text-zinc-500">
          <p>This page is an informational overview of Gorakhpur&apos;s Got Latent and its co-founders. For current announcements, dates, venue details, and participation terms, rely on GGL&apos;s official channels.</p>
          <p className="mt-3">© {new Date().getFullYear()} Gorakhpur&apos;s Got Latent · <Link href="/" className="text-red-400 underline">Official Website</Link></p>
        </footer>
      </section>
    </main>
  );
}
