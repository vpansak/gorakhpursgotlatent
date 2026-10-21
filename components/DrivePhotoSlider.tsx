'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';

type Photo = { id: string; src: string };

export default function DrivePhotoSlider() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let alive = true;
    fetch('/api/gallery-photos')
      .then((res) => res.json())
      .then((data) => { if (alive && Array.isArray(data.photos)) setPhotos(data.photos); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (photos.length < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % photos.length), 3500);
    return () => window.clearInterval(timer);
  }, [photos.length]);

  const move = (delta: number) => setActive((current) => (current + delta + photos.length) % photos.length);

  if (!photos.length) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl border border-amber-400/20 bg-[#0b0b0d] px-5 text-center">
        <Images className="h-10 w-10 text-amber-400" />
        <p className="text-sm text-slate-300">GGL Moments</p>
        <p className="max-w-md text-xs text-slate-500">Photos abhi load nahi ho pa rahi hain. Drive folder public Viewer access par hona chahiye.</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-400/20 bg-[#080809] p-3 sm:p-5">
      <div className="relative mx-auto flex h-[260px] items-center justify-center overflow-hidden sm:h-[390px]">
        {photos.map((photo, index) => {
          const offset = (index - active + photos.length) % photos.length;
          const visible = offset === 0 || offset === 1 || offset === photos.length - 1;
          const position = offset === 0 ? 0 : offset === 1 ? 1 : -1;
          return (
            <div
              key={photo.id}
              className="absolute h-[82%] w-[72%] overflow-hidden rounded-xl border border-amber-400/20 shadow-2xl transition-all duration-700 ease-in-out sm:w-[54%]"
              style={{
                transform: `translateX(${position * 82}%) scale(${offset === 0 ? 1 : 0.78})`,
                opacity: visible ? (offset === 0 ? 1 : 0.42) : 0,
                zIndex: offset === 0 ? 2 : 1,
                pointerEvents: offset === 0 ? 'auto' : 'none',
              }}
            >
              <img src={photo.src} alt={`GGL event photo ${index + 1}`} className="h-full w-full object-contain bg-black" loading={offset <= 1 ? 'eager' : 'lazy'} />
            </div>
          );
        })}
        <button type="button" aria-label="Previous photos" onClick={() => move(-1)} className="absolute left-1 z-10 rounded-full border border-amber-400/40 bg-black/80 p-2 text-amber-300 hover:bg-amber-400/20 sm:left-3">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" aria-label="Next photos" onClick={() => move(1)} className="absolute right-1 z-10 rounded-full border border-amber-400/40 bg-black/80 p-2 text-amber-300 hover:bg-amber-400/20 sm:right-3">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        {photos.slice(0, Math.min(photos.length, 9)).map((photo, index) => (
          <button key={photo.id} type="button" aria-label={`Show photo ${index + 1}`} onClick={() => setActive(index)} className={`h-1.5 rounded-full transition-all ${active === index ? 'w-7 bg-amber-400' : 'w-1.5 bg-slate-600'}`} />
        ))}
      </div>
    </div>
  );
}
