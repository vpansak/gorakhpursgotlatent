'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const slides = [
  {
    id: 1,
    src: '/developer-photo-1.jpg',
    alt: 'Alok Singh — Full-Stack Developer & Software Architect (Portrait)',
    label: 'Developer · Founder · Builder',
  },
  {
    id: 2,
    src: '/alok-singh.jpg',
    alt: 'Alok Singh — Full-Stack Developer & Software Architect',
    label: 'Full-Stack Developer · Gorakhpur',
  },
];

export default function DeveloperPhotoSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative mx-auto w-full max-w-[440px] lg:mx-0">
      {/* Ambient Outer Glow */}
      <div className="absolute -inset-8 rounded-[44px] bg-amber-400/10 blur-3xl" />

      {/* Glassmorphic Container Card */}
      <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.035] p-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
        {/* Photo Container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] border border-amber-300/20 bg-slate-900">
          {/* Images */}
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-0' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 440px"
                  className="object-cover object-center"
                />
              </div>
            );
          })}

          {/* Gradient Overlay for Text Contrast (pointer-events-none) */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#05070d]/85 via-transparent to-black/20" />

          {/* Top Indicator & Navigation Controls */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
            {/* Slide Counter Badge (1/2) */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[11px] font-bold text-white/90 backdrop-blur-md">
              <span>{currentIndex + 1}</span>
              <span className="text-white/40">/</span>
              <span className="text-white/60">{slides.length}</span>
            </div>

            {/* Slider Dots */}
            <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 backdrop-blur-md">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-5 bg-amber-400'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation Arrow Buttons */}
          <button
            onClick={prevSlide}
            aria-label="Previous Photo"
            className="group absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-2 text-white/80 transition-all hover:scale-110 hover:border-amber-400/40 hover:bg-black/70 hover:text-white backdrop-blur-md"
          >
            <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Photo"
            className="group absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-2 text-white/80 transition-all hover:scale-110 hover:border-amber-400/40 hover:bg-black/70 hover:text-white backdrop-blur-md"
          >
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Bottom Badge */}
          <div className="absolute bottom-5 left-5 right-5 z-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-black/50 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-amber-200 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              {slides[currentIndex].label}
            </div>
          </div>
        </div>

        {/* Feature Tags Below Slider */}
        <div className="grid grid-cols-3 gap-2 p-2 pt-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <div className="rounded-xl border border-white/5 bg-black/20 px-2 py-3">
            <span className="block text-white">FULL</span> STACK
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 px-2 py-3">
            <span className="block text-white">PRODUCT</span> BUILDING
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 px-2 py-3">
            <span className="block text-white">UI / UX</span> ENGINEERING
          </div>
        </div>
      </div>
    </div>
  );
}
