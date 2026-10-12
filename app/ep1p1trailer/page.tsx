import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, Clapperboard, PlayCircle, ArrowRight, Youtube } from 'lucide-react';

const pageUrl = 'https://www.gkpgotlatent.in/ep1p1trailer';
const trailerUrl = 'https://www.youtube.com/watch?v=aJfdcrsqoCQ';

export const metadata: Metadata = {
  title: "Episode 1 Part 1 Trailer | Gorakhpur's Got Latent — 14 October 2026",
  description:
    "Watch the official Episode 1 Part 1 trailer of Gorakhpur's Got Latent (GGL). Episode 1 Part 1 is scheduled to premiere on 14 October 2026 on the official GGL YouTube channel.",
  keywords: [
    "Gorakhpur's Got Latent Episode 1 Part 1",
    'GGL Episode 1 trailer',
    "Gorakhpur's Got Latent trailer",
    'GGL full episode release date',
    'Gorakhpur entertainment show',
    'Gorakhpur talent show episode',
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "GGL Episode 1 Part 1 — Trailer & Release Date",
    description:
      "The wait is almost over. Episode 1 Part 1 of Gorakhpur's Got Latent is scheduled for 14 October 2026. Watch the trailer here.",
    url: pageUrl,
    siteName: "Gorakhpur's Got Latent",
    type: 'video.other',
    videos: [trailerUrl],
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: "Gorakhpur's Got Latent official logo" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "GGL Episode 1 Part 1 Trailer",
    description: 'Episode 1 Part 1 is scheduled to premiere on 14 October 2026.',
    images: ['/logo.png'],
  },
};

const videoJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: "Gorakhpur's Got Latent — Episode 1 Part 1 Trailer",
  description:
    "Official trailer for Episode 1 Part 1 of Gorakhpur's Got Latent. Episode 1 Part 1 is scheduled to premiere on 14 October 2026.",
  thumbnailUrl: ['https://img.youtube.com/vi/aJfdcrsqoCQ/maxresdefault.jpg'],
  embedUrl: 'https://www.youtube.com/embed/aJfdcrsqoCQ',
  contentUrl: trailerUrl,
  publisher: {
    '@type': 'Organization',
    name: "Gorakhpur's Got Latent",
    logo: { '@type': 'ImageObject', url: 'https://www.gkpgotlatent.in/logo.png' },
  },
};

export default function Episode1Part1TrailerPage() {
  return (
    <main className="min-h-screen bg-[#07080e] px-4 py-8 text-white sm:px-6 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />
      <div className="mx-auto max-w-6xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">
          <Clapperboard className="h-4 w-4" /> Official GGL Episode Update
        </div>

        <header className="mx-auto mt-5 max-w-4xl text-center">
          <h1 className="text-4xl font-black leading-tight sm:text-6xl">
            Gorakhpur’s Got Latent
            <span className="mt-2 block bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Episode 1 Part 1 Trailer
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-lg">
            Get ready for Episode 1 Part 1 of GGL — the talent and entertainment show from Gorakhpur.
            Watch the trailer below and mark the release date.
          </p>
        </header>

        <section className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl border border-amber-400/25 bg-black shadow-2xl sm:mt-10 sm:rounded-3xl" aria-label="Official Episode 1 Part 1 trailer">
          <div className="relative aspect-video w-full">
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube-nocookie.com/embed/aJfdcrsqoCQ"
              title="Gorakhpur's Got Latent Episode 1 Part 1 Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="flex flex-col gap-3 border-t border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="font-extrabold sm:text-lg">Official Episode 1 Part 1 Trailer</p>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">Gorakhpur’s Got Latent • GGL</p>
            </div>
            <a href={trailerUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-red-500">
              <Youtube className="h-5 w-5" /> Watch on YouTube
            </a>
          </div>
        </section>

        <section className="mx-auto mt-7 max-w-5xl rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/15 via-[#101018] to-red-950/20 p-5 text-center sm:mt-8 sm:rounded-3xl sm:p-9">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-amber-300/30 bg-amber-400/10 text-amber-300">
            <CalendarDays className="h-6 w-6" />
          </div>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-amber-300">Release date</p>
          <h2 className="mt-2 text-3xl font-black sm:text-5xl">14 October 2026</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Episode 1 Part 1 is scheduled to premiere on the official Gorakhpur’s Got Latent YouTube channel on 14 October 2026. Subscribe so you don’t miss the release.
          </p>
          <a href="https://www.youtube.com/@gkpgotlatent" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-black text-black transition hover:bg-amber-300">
            <Youtube className="h-5 w-5" /> Subscribe to GGL <ArrowRight className="h-4 w-4" />
          </a>
        </section>

        <section className="mx-auto mt-10 max-w-4xl space-y-4 text-slate-300">
          <h2 className="text-2xl font-black text-white sm:text-3xl">About GGL Episode 1 Part 1</h2>
          <p className="text-sm leading-7 sm:text-base">
            Gorakhpur’s Got Latent (GGL) is a talent and entertainment platform featuring performers and acts.
            This page brings together the official Episode 1 Part 1 trailer and its announced release date.
            Return here for the trailer and use the official GGL YouTube channel to watch the episode when it premieres.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/episodes" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white transition hover:border-amber-400/50 hover:text-amber-300">
              <PlayCircle className="h-4 w-4" /> Browse GGL Episodes
            </Link>
            <Link href="/apply/performer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white transition hover:border-amber-400/50 hover:text-amber-300">
              Apply to Perform <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
