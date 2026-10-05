'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Camera,
  Grid,
  Download,
  Share2,
  Check,
} from 'lucide-react';

export interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  batch: string;
  date?: string;
  location?: string;
  width?: number;
  height?: number;
}

interface AlbumGalleryClientProps {
  photos: PhotoItem[];
}

export default function AlbumGalleryClient({ photos }: AlbumGalleryClientProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);

  const filteredPhotos = activeTab === 'all'
    ? photos
    : photos.filter((p) => p.category.toLowerCase() === activeTab.toLowerCase() || p.batch.toLowerCase() === activeTab.toLowerCase());

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % filteredPhotos.length);
  }, [selectedIndex, filteredPhotos.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! - 1 + filteredPhotos.length) % filteredPhotos.length);
  }, [selectedIndex, filteredPhotos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedIndex]);

  const copyPageLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const categories = [
    { id: 'all', label: 'All Photos', count: photos.length },
    { id: 'batch 1', label: 'Batch 1 (4)', count: photos.filter(p => p.batch === 'Batch 1').length },
    { id: 'batch 2', label: 'Batch 2 (4)', count: photos.filter(p => p.batch === 'Batch 2').length },
    { id: 'batch 3', label: 'Batch 3 (3)', count: photos.filter(p => p.batch === 'Batch 3').length },
  ];

  return (
    <div className="mt-8">
      {/* Category Tabs & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  activeTab === tab.id ? 'bg-black/20 text-black' : 'bg-white/10 text-amber-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyPageLink}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            title="Share album link"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Share2 className="h-3.5 w-3.5 text-amber-300" />}
            {copied ? 'Copied!' : 'Share'}
          </button>
          <span className="text-xs font-semibold text-slate-400">
            Showing <strong className="text-amber-300">{filteredPhotos.length}</strong> photos
          </span>
        </div>
      </div>

      {/* Main Responsive Photo Grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPhotos.map((photo, idx) => (
          <div
            key={photo.id}
            onClick={() => setSelectedIndex(idx)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-amber-300/15 bg-slate-900/80 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/50 hover:shadow-2xl hover:shadow-amber-500/10"
          >
            {/* Image Aspect Box */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                loading={idx < 4 ? 'eager' : 'lazy'}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />

              {/* Top Badge */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] font-bold text-amber-300 backdrop-blur-md">
                <Camera className="h-3 w-3 text-amber-400" />
                <span>#{idx + 1}</span>
              </div>

              {/* Bottom Caption & Zoom Icon */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-4 transition-transform duration-300">
                <p className="line-clamp-2 text-xs font-bold leading-snug text-white group-hover:text-amber-300">
                  {photo.alt}
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                  <span className="rounded bg-white/10 px-2 py-0.5 text-slate-300">
                    {photo.batch}
                  </span>
                  <span className="inline-flex items-center gap-1 text-amber-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    View Fullscreen <Maximize2 className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-2xl transition-all duration-300">
          {/* Close Button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 hover:text-amber-300"
            aria-label="Close photo view"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Previous */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 z-50 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition hover:bg-white/20 hover:text-amber-300"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          {/* Navigation Next */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 z-50 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition hover:bg-white/20 hover:text-amber-300"
            aria-label="Next photo"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          {/* Main Lightbox Content */}
          <div className="relative flex max-h-[90vh] max-w-5xl flex-col items-center justify-center overflow-hidden">
            <div className="relative max-h-[75vh] w-full flex items-center justify-center">
              <img
                src={filteredPhotos[selectedIndex].src}
                alt={filteredPhotos[selectedIndex].alt}
                className="max-h-[75vh] max-w-full rounded-xl border border-white/10 object-contain shadow-2xl"
              />
            </div>

            {/* Modal Bottom Information */}
            <div className="mt-4 max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-xs font-black text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Photo {selectedIndex + 1} of {filteredPhotos.length}</span>
                <span>•</span>
                <span>{filteredPhotos[selectedIndex].batch}</span>
              </div>

              <h3 className="mt-2 text-base font-bold text-white sm:text-lg">
                {filteredPhotos[selectedIndex].alt}
              </h3>

              <div className="mt-3 flex items-center justify-center gap-3">
                <a
                  href={filteredPhotos[selectedIndex].src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/20 hover:text-white"
                >
                  <Download className="h-3.5 w-3.5 text-amber-300" />
                  View Original Image
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
