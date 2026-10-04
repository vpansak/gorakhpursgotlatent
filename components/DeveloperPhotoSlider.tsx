import Image from 'next/image';
import { Sparkles } from 'lucide-react';

const slide = {
  src: '/developer-photo-1.jpg',
  alt: 'Alok Singh — Full-Stack Developer & Software Architect (Portrait)',
  label: 'Developer · Founder · Builder',
};

export default function DeveloperPhotoSlider() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] lg:mx-0">
      <div className="absolute -inset-8 rounded-[44px] bg-amber-400/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.035] p-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] border border-amber-300/20 bg-slate-900">
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 440px"
            className="object-cover object-center"
          />

          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#05070d]/85 via-transparent to-black/20" />

          <div className="absolute bottom-5 left-5 right-5 z-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-black/50 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-amber-200 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              {slide.label}
            </div>
          </div>
        </div>

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
