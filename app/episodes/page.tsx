'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown, Clapperboard, ExternalLink, Maximize2, Play, Sparkles, X } from 'lucide-react';

type Episode = {
  id: string;
  number: number;
  title: string;
  description: string;
  driveFileId: string;
  status: 'available' | 'coming-soon';
};

const EPISODES: Episode[] = [
  {
    id: 'episode-1',
    number: 1,
    title: 'Episode 1 — Full Episode',
    description: 'The first episode of Gorakhpur’s Got Latent. Watch the full show here.',
    driveFileId: '1rIrnu06FKCuKLNfdC9rrRGVv72EnTSsP',
    status: 'available',
  },
];

export default function EpisodesPage() {
  const [selectedId, setSelectedId] = useState(EPISODES[0].id);
  const [expandedPlayer, setExpandedPlayer] = useState(false);
  const selectedEpisode = EPISODES.find((episode) => episode.id === selectedId) ?? EPISODES[0];
  const drivePreviewUrl = `https://drive.google.com/file/d/${selectedEpisode.driveFileId}/preview`;
  const driveOpenUrl = `https://drive.google.com/file/d/${selectedEpisode.driveFileId}/view`;

  useEffect(() => {
    if (!expandedPlayer) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpandedPlayer(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [expandedPlayer]);

  return (
    <main className="min-h-screen bg-[#07080e] text-white pb-24 lg:pb-12">
      <section className="relative overflow-hidden border-b border-amber-400/15 bg-[radial-gradient(ellipse_at_top,rgba(180,83,9,0.22),transparent_55%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="flex items-center gap-2 text-amber-300 text-xs sm:text-sm font-black tracking-[0.22em] uppercase">
            <Clapperboard className="w-4 h-4" /> GGL Watch
          </div>
          <div className="mt-4 grid lg:grid-cols-[1fr_auto] gap-6 items-end">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[0.98]">
                THE <span className="text-amber-400">EPISODES</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
                Gorakhpur’s Got Latent — watch each episode in one place. New episodes will appear here as they are released.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs sm:text-sm font-bold text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> {EPISODES.filter((e) => e.status === 'available').length} episode available
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 lg:gap-8 items-start">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-400/20 bg-[#0b0d14] shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/10">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.18em] font-black text-amber-300">Now playing</p>
                  <h2 className="mt-1 text-sm sm:text-lg font-extrabold truncate">{selectedEpisode.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedPlayer(true)}
                  className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-amber-400 hover:text-black px-3 py-2 text-xs sm:text-sm font-bold transition-colors"
                  aria-label="Expand video player"
                >
                  <Maximize2 className="w-4 h-4" /> <span className="hidden xs:inline">Expand</span>
                </button>
              </div>
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  key={selectedEpisode.driveFileId}
                  src={drivePreviewUrl}
                  title={selectedEpisode.title}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="eager"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-6">
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-extrabold">{selectedEpisode.title}</p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-400">{selectedEpisode.description}</p>
                </div>
                <a
                  href={driveOpenUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 px-4 py-3 text-sm font-black text-black transition-colors"
                >
                  Open video <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
              <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Playback tip: use the player’s full-screen control for an immersive view. If the video asks for access, the Drive file owner needs to set sharing to “Anyone with the link — Viewer”.
              </p>
            </div>
          </div>

          <aside className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0b0d14] overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-black">Watch list</p>
                <h2 className="mt-1 text-lg font-black">All Episodes</h2>
              </div>
              <span className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-slate-300 font-bold">{EPISODES.length}</span>
            </div>
            <div className="p-3 sm:p-4 space-y-3">
              {EPISODES.map((episode) => {
                const active = episode.id === selectedId;
                return (
                  <button
                    type="button"
                    key={episode.id}
                    onClick={() => episode.status === 'available' && setSelectedId(episode.id)}
                    disabled={episode.status !== 'available'}
                    className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all ${active ? 'border-amber-400/60 bg-amber-400/10' : 'border-white/10 bg-white/[0.02] hover:border-amber-400/30 hover:bg-white/[0.04]'}`}
                    aria-current={active ? 'true' : undefined}
                  >
                    <span className={`flex h-14 w-20 sm:h-16 sm:w-24 shrink-0 items-center justify-center rounded-xl border ${active ? 'border-amber-300/40 bg-amber-400/15 text-amber-300' : 'border-white/10 bg-black/40 text-slate-400'}`}>
                      {active ? <Play className="w-5 h-5 fill-current" /> : <span className="text-xl font-black">EP {episode.number}</span>}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] uppercase tracking-[0.15em] font-black text-slate-500">Episode {episode.number}</span>
                      <span className={`mt-1 block text-sm font-extrabold leading-snug ${active ? 'text-amber-200' : 'text-white'}`}>{episode.title.replace(/^Episode \\d+ — /, '')}</span>
                      <span className="mt-1 block text-[11px] text-slate-400">{episode.status === 'available' ? 'Full episode' : 'Coming soon'}</span>
                    </span>
                    {active && <ChevronDown className="w-4 h-4 text-amber-300 shrink-0" />}
                  </button>
                );
              })}
              <div className="rounded-2xl border border-dashed border-white/15 p-4 text-center">
                <p className="text-xs font-bold text-slate-300">More episodes are on the way</p>
                <p className="mt-1 text-[11px] text-slate-500">This list will grow as new videos are added.</p>
              </div>
            </div>
            <div className="px-4 pb-4">
              <Link href="/apply/performer" className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/30 px-4 py-3 text-sm font-extrabold text-amber-300 hover:bg-amber-400/10 transition-colors">
                Be part of the next episode <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {expandedPlayer && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 p-2 sm:p-5" role="dialog" aria-modal="true" aria-label="Expanded episode player">
          <div className="flex items-center justify-between gap-3 px-2 pb-3 sm:px-4">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.18em] text-amber-300 font-black">GGL full-screen view</p>
              <p className="text-sm sm:text-base font-bold truncate">{selectedEpisode.title}</p>
            </div>
            <button type="button" onClick={() => setExpandedPlayer(false)} className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm font-bold hover:bg-white/10" aria-label="Close expanded player">
              <X className="w-5 h-5" /> Close
            </button>
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <div className="relative w-full max-w-[1600px] aspect-video max-h-full bg-black rounded-lg overflow-hidden">
              <iframe
                key={`expanded-${selectedEpisode.driveFileId}`}
                src={drivePreviewUrl}
                title={`${selectedEpisode.title} — expanded player`}
                className="absolute inset-0 h-full w-full border-0"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
          <p className="pt-3 text-center text-[11px] sm:text-xs text-slate-500">Press Esc or tap Close to return to Episodes.</p>
        </div>
      )}
    </main>
  );
}
