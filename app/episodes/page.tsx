'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clapperboard, Maximize2, Play, Share2, X } from 'lucide-react';

type Episode = {
  id: string;
  number: number;
  title: string;
  description: string;
  driveFileId?: string;
  youtubeId?: string;
  status: 'available' | 'coming-soon' | 'locked';
};

const EPISODES: Episode[] = [
  {
    id: 'episode-1-trailer',
    number: 1,
    title: 'Episode 1 — Official Trailer',
    description: 'Watch the official Gorakhpur’s Got Latent Episode 1 trailer.',
    youtubeId: 'aJfdcrsqoCQ',
    status: 'available',
  },
  {
    id: 'episode-1-part-1',
    number: 1,
    title: 'Episode 1 — Part 1',
    description: 'Episode 1 Part 1 unlocks on 14 October 2026 at 12:00 PM IST.',
    driveFileId: '1rIrnu06FKCuKLNfdC9rrRGVv72EnTSsP',
    status: 'locked',
  },
  {
    id: 'episode-1',
    number: 1,
    title: 'Episode 1 — Full Episode',
    description: 'The first episode of Gorakhpur’s Got Latent. Watch it here on the official GGL website.',
    driveFileId: '1rIrnu06FKCuKLNfdC9rrRGVv72EnTSsP',
    status: 'available',
  },
];

export default function EpisodesPage() {
  const [selectedId, setSelectedId] = useState('episode-1-trailer');
  const [expandedPlayer, setExpandedPlayer] = useState(false);
  const [showCountdownPopup, setShowCountdownPopup] = useState(false);
  const unlockAt = new Date('2026-10-14T12:00:00+05:30').getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (Date.now() >= unlockAt) return;
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= unlockAt) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [unlockAt]);

  const locked = now < unlockAt;
  const secondsLeft = Math.max(0, Math.floor((unlockAt - now) / 1000));
  const daysLeft = Math.floor(secondsLeft / 86400);
  const hoursLeft = Math.floor((secondsLeft % 86400) / 3600);
  const minutesLeft = Math.floor((secondsLeft % 3600) / 60);
  const remainingSeconds = secondsLeft % 60;
  const selectedEpisode = EPISODES.find((episode) => episode.id === selectedId) ?? EPISODES[0];
  const playerUrl = selectedEpisode.youtubeId
    ? `https://www.youtube-nocookie.com/embed/${selectedEpisode.youtubeId}?rel=0`
    : `https://drive.google.com/file/d/${selectedEpisode.driveFileId}/preview`;
  const selectedEpisodeLocked = selectedEpisode.id === 'episode-1-part-1' && locked;

  useEffect(() => {
    const episodeNumber = Number(new URLSearchParams(window.location.search).get('episode'));
    const sharedEpisode = EPISODES.find((episode) => episode.number === episodeNumber && episode.status === 'available');
    if (sharedEpisode) setSelectedId(sharedEpisode.id);
  }, []);

  const shareEpisode = async (episode: Episode) => {
    const url = `${window.location.origin}/episodes?episode=${episode.number}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `GGL — Episode ${episode.number}`, text: episode.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        window.alert('Episode link copied!');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(url);
          window.alert('Episode link copied!');
        } catch {
          window.prompt('Copy this episode link:', url);
        }
      }
    }
  };

  useEffect(() => {
    if (!expandedPlayer) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpandedPlayer(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [expandedPlayer]);

  const videoFrame = (expanded = false) => (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <iframe
        key={`${expanded ? 'expanded-' : ''}${selectedEpisode.youtubeId ?? selectedEpisode.driveFileId}`}
        src={playerUrl}
        title={selectedEpisode.title}
        className="absolute inset-0 h-full w-full border-0 bg-black"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      {/* Cover Google Drive's external-open shortcut in the embedded player. */}
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 z-10 h-14 w-16 bg-black" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#07080e] pb-24 text-white lg:pb-12">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_top,rgba(180,83,9,0.2),transparent_58%)]">
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-amber-300 sm:text-sm">
            <Clapperboard className="h-4 w-4" /> GGL WATCH
          </div>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-black leading-none tracking-tight sm:text-5xl lg:text-7xl">
                WATCH <span className="text-amber-400">EPISODES</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                Watch the official Episode 1 trailer below. Episode 1 Part 1 unlocks tomorrow at 12:00 PM IST.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-300 sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Official trailer available
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-7">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d14] shadow-[0_24px_90px_rgba(0,0,0,.5)] sm:rounded-3xl">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-3 sm:px-5">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300 sm:text-xs">Now playing</p>
                  <h2 className="mt-1 truncate text-sm font-extrabold sm:text-lg">{selectedEpisode.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedPlayer(true)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold transition hover:border-amber-400/50 hover:bg-amber-400 hover:text-black sm:text-sm"
                  aria-label="Open full-screen video player"
                >
                  <Maximize2 className="h-4 w-4" />
                  <span>Full screen</span>
                </button>
              </div>

              <div className="relative aspect-video w-full bg-black">
                {videoFrame()}
              </div>

              <div className="p-4 sm:p-6">
                <p className="text-base font-extrabold sm:text-xl">{selectedEpisode.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">{selectedEpisode.description}</p>
              </div>
            </div>
            <p className="mt-3 px-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
              Video playback stays on the GGL website. Use the player’s full-screen control for a distraction-free view.
            </p>
          </div>

          <aside className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d14] sm:rounded-3xl">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">Up next</p>
                <h2 className="mt-1 text-lg font-black sm:text-xl">All Episodes</h2>
              </div>
              <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-300">{EPISODES.length}</span>
            </div>
            <div className="space-y-2 p-3 sm:p-4">
              {EPISODES.map((episode) => {
                const active = episode.id === selectedId;
                return (
                  <div key={episode.id} className={`flex items-stretch gap-2 rounded-xl border p-2 transition sm:rounded-2xl sm:p-3 ${active ? 'border-amber-400/50 bg-amber-400/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'}`}>
                    <button
                      type="button"
                      onClick={() => {
                        if (episode.id === 'episode-1-part-1' && locked) {
                          setShowCountdownPopup(true);
                          return;
                        }
                        setSelectedId(episode.id);
                      }}
                      disabled={false}
                      className="group flex min-w-0 flex-1 items-center gap-3 p-1 text-left disabled:cursor-not-allowed"
                      aria-current={active ? 'true' : undefined}
                    >
                      <span className={`flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border sm:h-[72px] sm:w-28 ${active ? 'border-amber-300/40 bg-amber-400/10 text-amber-300' : 'border-white/10 bg-black/50 text-slate-400'}`}>
                        {active ? <Play className="h-6 w-6 fill-current" /> : <span className="text-lg font-black">EP {episode.number}</span>}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Episode {episode.number}</span>
                        <span className={`mt-1 block text-sm font-extrabold leading-snug ${active ? 'text-amber-200' : 'text-white'}`}>{episode.title.replace('Episode 1 — ', '')}</span>
                        <span className="mt-1 block text-[11px] text-slate-400">{episode.id === 'episode-1-trailer' ? '▶ Official YouTube trailer' : episode.status === 'locked' && locked ? '🔒 Tap to see countdown' : episode.status === 'available' ? '▶ Watch now' : 'Coming soon'}</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => shareEpisode(episode)}
                      disabled={false}
                      aria-label={`Share Episode ${episode.number}`}
                      title="Share episode link"
                      className="inline-flex w-10 shrink-0 items-center justify-center self-center rounded-lg border border-amber-400/30 text-amber-300 transition hover:bg-amber-400 hover:text-black disabled:opacity-40 sm:w-11"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
              <div className="rounded-xl border border-dashed border-white/15 p-4 text-center sm:rounded-2xl">
                <p className="text-xs font-bold text-slate-300">More episodes coming soon</p>
                <p className="mt-1 text-[11px] text-slate-500">New episodes will be added to this playlist.</p>
              </div>
            </div>
            <div className="px-3 pb-3 sm:px-4 sm:pb-4">
              <Link href="/apply/performer" className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-400/30 px-4 py-3 text-sm font-extrabold text-amber-300 transition hover:bg-amber-400/10">
                Be part of the next episode <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {showCountdownPopup && locked && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Episode 1 Part 1 countdown">
          <div className="relative w-full max-w-lg rounded-3xl border border-amber-400/30 bg-[#0b0d14] p-5 text-center shadow-2xl sm:p-8">
            <button type="button" onClick={() => setShowCountdownPopup(false)} className="absolute right-3 top-3 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Close countdown">
              <X className="h-5 w-5" />
            </button>
            <Clapperboard className="mx-auto h-10 w-10 text-amber-300" />
            <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-amber-300">GGL WATCH</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">EPISODE 1 · PART 1</h2>
            <p className="mt-2 text-sm text-slate-300">Unlocks tomorrow, 14 October at 12:00 PM IST.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Days', value: daysLeft },
                { label: 'Hours', value: hoursLeft },
                { label: 'Minutes', value: minutesLeft },
                { label: 'Seconds', value: remainingSeconds },
              ].map((unit) => (
                <div key={unit.label} className="rounded-xl border border-amber-400/20 bg-black/40 px-2 py-4">
                  <div className="text-3xl font-black tabular-nums text-amber-300">{String(unit.value).padStart(2, '0')}</div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{unit.label}</div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setShowCountdownPopup(false)} className="mt-6 rounded-xl bg-amber-400 px-6 py-3 text-sm font-black text-black transition hover:bg-amber-300">Okay, got it</button>
          </div>
        </div>
      )}

      {expandedPlayer && (
        <div className="fixed inset-0 z-[100] flex h-[100dvh] flex-col bg-black p-0" role="dialog" aria-modal="true" aria-label="Full-screen episode player">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#08080a] px-3 py-3 sm:px-5">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">GGL WATCH</p>
              <p className="truncate text-sm font-bold sm:text-base">{selectedEpisode.title}</p>
            </div>
            <button
              type="button"
              onClick={() => setExpandedPlayer(false)}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm font-bold transition hover:bg-white/10"
              aria-label="Close full-screen player"
            >
              <X className="h-5 w-5" /> <span>Close</span>
            </button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black p-0 sm:p-2">
            <div className="relative aspect-video w-full max-h-full max-w-[calc(100dvh*1.7778)] overflow-hidden bg-black">
              {videoFrame(true)}
            </div>
          </div>
          <div className="shrink-0 bg-[#08080a] px-3 py-2 text-center text-[10px] text-slate-500 sm:text-xs">
            Press Esc or tap Close to return to Episodes.
          </div>
        </div>
      )}
    </main>
  );
}
