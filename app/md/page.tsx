import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Award, GraduationCap, Trophy, BookOpen, Star } from 'lucide-react';

function InstagramIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: 'Uday Pratap Singh | Managing Director & Gold Medalist',
  description:
    'Meet Uday Pratap Singh, Managing Director of Gorakhpur’s Got Latent, a state-level singing and debate competition winner, Gold Medalist, and Founder & Director of Topper’s Classes.',
  alternates: { canonical: '/md' },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Uday Pratap Singh | Gorakhpur’s Got Latent',
    description: 'Educator, Gold Medalist, and Managing Director of Gorakhpur’s Got Latent.',
    url: 'https://gkpgotlatent.in/md',
    siteName: 'Gorakhpur’s Got Latent',
    type: 'profile',
    images: [{ url: '/uday-pratap-singh.jpg', alt: 'Uday Pratap Singh' }],
  },
};

const achievements = [
  {
    icon: Trophy,
    title: 'State-Level Singing Competition Winner',
    detail: 'Winner · 2023',
    note: 'Organized by Sanskrit Sansthan, Lucknow, Uttar Pradesh',
  },
  {
    icon: Award,
    title: 'Two-Time State-Level Debate Winner',
    detail: 'Winner · 2 times',
    note: 'Recognized for debate and public-speaking achievement',
  },
  {
    icon: Star,
    title: 'Gold Medalist',
    detail: 'Academic distinction',
    note: 'Gold medalist, as provided in his profile details',
  },
];

export default function ManagingDirectorPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080e] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[32rem] w-[48rem] -translate-x-1/2 rounded-full bg-red-700/15 blur-[130px]" />
        <div className="absolute right-[-10rem] top-[35rem] h-80 w-80 rounded-full bg-amber-500/10 blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.16) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-amber-400/40 hover:text-amber-300">
          <ArrowLeft className="h-4 w-4" /> Back to GGL
        </Link>

        <section className="grid items-center gap-10 pb-16 pt-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14 md:pb-24 md:pt-16">
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-amber-400/40 via-red-600/25 to-transparent blur-xl" />
            <div className="relative overflow-hidden rounded-[1.7rem] border border-amber-300/30 bg-[#111116] shadow-2xl shadow-black/50">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/uday-pratap-singh.jpg"
                  alt="Portrait of Uday Pratap Singh"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 420px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/10" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-black/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-amber-200 backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> GGL Leadership
                  </span>
                  <p className="mt-3 font-bebas text-3xl tracking-wide text-white sm:text-4xl">EDUCATION. EXPRESSION. EXCELLENCE.</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-2 flex items-center gap-2 rounded-xl border border-amber-300/30 bg-[#111116] px-4 py-3 shadow-xl sm:-right-5">
              <Award className="h-6 w-6 text-amber-300" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-amber-200">Gold Medalist</p>
                <p className="text-[10px] text-slate-400">Achievement highlight</p>
              </div>
            </div>
          </div>

          <div className="pt-3 text-center md:text-left">
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-red-400">
              <span className="h-px w-8 bg-red-500" /> Meet the Leadership
            </p>
            <h1 className="mt-5 font-bebas text-5xl leading-[0.95] tracking-wide sm:text-7xl lg:text-8xl">
              UDAY PRATAP <span className="block text-amber-300">SINGH</span>
            </h1>
            <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.2em] text-white sm:text-base">
              Managing Director <span className="mx-2 text-red-500">/</span> Gorakhpur’s Got Latent
            </p>
            <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-red-600 to-amber-300 md:mx-0" />
            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg md:mx-0">
              An educator, Gold Medalist, and accomplished state-level competition winner, Uday Pratap Singh brings a passion for learning, expression, and talent development to his work. Alongside his role at Gorakhpur’s Got Latent, he is the Founder and Director of Topper’s Classes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-4 py-2 text-xs font-bold text-amber-100">Gold Medalist</span>
              <span className="rounded-full border border-red-400/20 bg-red-400/[0.08] px-4 py-2 text-xs font-bold text-red-100">State-Level Winner</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-slate-200">Educator & Mentor</span>
            </div>
            <div className="mt-6 flex justify-center md:justify-start">
              <a
                href="https://www.instagram.com/poetry_writer_boy_245/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Uday Pratap Singh on Instagram"
                className="inline-flex items-center gap-3 rounded-full border border-pink-400/30 bg-gradient-to-r from-pink-500/10 via-red-500/10 to-amber-400/10 px-5 py-3 text-sm font-bold text-white transition hover:border-pink-300/60 hover:bg-pink-500/15"
              >
                <InstagramIcon className="h-5 w-5 text-pink-300" />
                <span>Instagram <span className="ml-1 text-slate-300">@poetry_writer_boy_245</span></span>
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl border-t border-white/10 py-14 sm:py-16">
          <div className="mb-9 text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">A Note from the Managing Director</p>
            <h2 className="mt-3 font-bebas text-4xl tracking-wide sm:text-5xl">EVERY TALENT DESERVES A CHANCE.</h2>
          </div>
          <blockquote className="relative rounded-3xl border border-amber-300/20 bg-gradient-to-br from-white/[0.06] to-white/[0.015] p-6 text-center sm:p-10">
            <span aria-hidden="true" className="absolute left-5 top-1 font-serif text-6xl text-amber-300/40">“</span>
            <p className="mx-auto max-w-3xl text-base leading-8 text-slate-200 sm:text-xl sm:leading-9">
              I believe talent grows when people are given the right opportunity, encouragement, and platform. Gorakhpur’s Got Latent is a space to celebrate creativity, bring people together, and give emerging performers the confidence to share what makes them unique.
            </p>
            <span aria-hidden="true" className="absolute bottom-0 right-5 font-serif text-6xl text-amber-300/40">”</span>
          </blockquote>
        </section>

        <section className="py-8 sm:py-12">
          <div className="mb-9 text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">Milestones & Recognition</p>
            <h2 className="mt-3 font-bebas text-4xl tracking-wide sm:text-5xl">ACHIEVEMENTS THAT INSPIRE</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {achievements.map(({ icon: Icon, title, detail, note }, index) => (
              <article key={title} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-amber-300/30 hover:bg-white/[0.055]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-300/25 bg-amber-300/10 text-amber-300">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-red-400">0{index + 1} / Recognition</p>
                <h3 className="mt-2 text-xl font-extrabold leading-snug text-white">{title}</h3>
                <p className="mt-2 text-sm font-bold text-amber-200">{detail}</p>
                <p className="mt-3 text-sm leading-6 text-slate-400">{note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-7 w-7 text-amber-300" />
              <h2 className="font-bebas text-3xl tracking-wide">EDUCATION</h2>
            </div>
            <p className="mt-5 text-lg font-bold text-white">LL.B. — Deen Dayal Upadhyaya Gorakhpur University</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Legal education from DDU University, Gorakhpur.</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <BookOpen className="h-7 w-7 text-amber-300" />
              <h2 className="font-bebas text-3xl tracking-wide">EDUCATION & LEADERSHIP</h2>
            </div>
            <p className="mt-5 text-lg font-bold text-white">Founder & Director — Topper’s Classes</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Supporting students through education, guidance, and a focus on academic growth.</p>
          </article>
        </section>

        <section className="mt-14 rounded-3xl border border-red-500/20 bg-gradient-to-r from-red-950/50 via-[#151017] to-amber-950/30 p-7 text-center sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">Gorakhpur’s Got Latent</p>
          <h2 className="mt-3 font-bebas text-4xl tracking-wide sm:text-5xl">A PLATFORM FOR RAW TALENT.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Celebrating the people, ideas, and performances that make every show memorable.</p>
          <Link href="/" className="mt-7 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-red-950/40 transition hover:brightness-110">
            Explore GGL <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
          </Link>
        </section>
      </div>
    </main>
  );
}
