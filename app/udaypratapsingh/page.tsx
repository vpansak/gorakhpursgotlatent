import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Award, BookOpen, GraduationCap, Mic2, Trophy, Users, Instagram } from 'lucide-react';

const pageUrl = 'https://gkpgotlatent.in/udaypratapsingh';
const portrait = '/uday-pratap-singh.jpg';

export const metadata: Metadata = {
  title: 'Uday Pratap Singh Gorakhpur | Gold Medalist & Director of Topper’s Classes',
  description:
    'Learn about Uday Pratap Singh of Gorakhpur: Director and Founder of Topper’s Classes, Managing Director of Gorakhpur’s Got Latent, gold medalist, state-level competition winner and public speaker.',
  keywords: [
    'Uday Pratap Singh Gorakhpur',
    'Uday Pratap Singh GKP',
    'Uday Pratap Singh gold medalist',
    'Uday Pratap Singh Topper’s Classes',
    'Director of Topper’s Classes Gorakhpur',
    'Founder of Topper’s Classes',
    'Managing Director Gorakhpur’s Got Latent',
    'Uday Pratap Singh debate winner',
    'Uday Pratap Singh state level competition',
    'Topper’s Classes Rustampur Gorakhpur',
  ],
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  openGraph: {
    type: 'profile',
    url: pageUrl,
    title: 'Uday Pratap Singh | Educator, Gold Medalist & Director',
    description: 'The journey, achievements and work of Uday Pratap Singh in Gorakhpur, Uttar Pradesh.',
    siteName: 'Gorakhpur’s Got Latent',
    locale: 'en_IN',
    images: [{ url: portrait, alt: 'Uday Pratap Singh, Director of Topper’s Classes' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uday Pratap Singh Gorakhpur | Gold Medalist & Director',
    description: 'Discover the work and achievements of Uday Pratap Singh.',
    images: [portrait],
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': pageUrl + '#uday-pratap-singh',
  name: 'Uday Pratap Singh',
  url: pageUrl,
  image: 'https://gkpgotlatent.in' + portrait,
  jobTitle: ['Director and Founder of Topper’s Classes', 'Managing Director of Gorakhpur’s Got Latent'],
  worksFor: [
    { '@type': 'EducationalOrganization', name: 'Topper’s Classes', address: { '@type': 'PostalAddress', addressLocality: 'Gorakhpur', addressRegion: 'Uttar Pradesh', addressCountry: 'IN' } },
    { '@type': 'Organization', name: 'Gorakhpur’s Got Latent', url: 'https://gkpgotlatent.in' },
  ],
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Deen Dayal Upadhyaya Gorakhpur University' },
  sameAs: ['https://www.instagram.com/poetry_writer_boy_245/'],
  knowsAbout: ['Education', 'Public speaking', 'Debate', 'Singing', 'Student guidance', 'Leadership'],
};

const achievements = [
  { icon: Trophy, title: 'State-Level Singing Competition', detail: 'Winner in 2023, as provided in his profile details; associated with Sanskrit Sansthan, Lucknow, Uttar Pradesh.' },
  { icon: Mic2, title: 'State-Level Debate Competitions', detail: 'Two-time state-level debate competition winner, according to his supplied biography.' },
  { icon: Award, title: 'Gold Medalist', detail: 'Recognized as a gold medalist. Specific award details can be added when the certificate or award title is available.' },
  { icon: Users, title: 'Leadership in Gorakhpur', detail: 'Managing Director of Gorakhpur’s Got Latent, a local talent and entertainment platform.' },
];

export default function UdayPratapSinghPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07080e] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }} />
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.15),transparent_38%),radial-gradient(ellipse_at_bottom_left,rgba(185,28,28,0.16),transparent_42%)]" />
      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-300 hover:border-amber-400/40 hover:text-amber-300">
          <ArrowLeft className="h-4 w-4" /> Gorakhpur’s Got Latent
        </Link>

        <section className="grid items-center gap-10 py-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-20">
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-amber-400/40 via-red-600/25 to-transparent blur-xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.7rem] border border-amber-300/30 bg-[#111116] shadow-2xl">
              <Image src={portrait} alt="Uday Pratap Singh from Gorakhpur, Director of Topper’s Classes" fill priority sizes="(max-width: 768px) 90vw, 440px" className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/5" />
              <div className="absolute bottom-0 p-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Gorakhpur · Uttar Pradesh</p>
                <p className="mt-2 text-2xl font-black sm:text-3xl">Educator. Speaker. Leader.</p>
              </div>
            </div>
          </div>
          <div>
            <p className="mb-4 inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">Professional Profile</p>
            <h1 className="text-4xl font-black leading-tight sm:text-6xl">Uday Pratap Singh <span className="text-amber-300">Gorakhpur</span></h1>
            <p className="mt-5 text-xl font-bold text-slate-200">Gold Medalist · Director & Founder of Topper’s Classes · Managing Director, Gorakhpur’s Got Latent</p>
            <p className="mt-5 max-w-3xl leading-8 text-slate-300">Uday Pratap Singh is an educator and community leader associated with Gorakhpur, Uttar Pradesh. His work brings together student guidance, public speaking, competitive performance and local talent development.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="https://www.instagram.com/poetry_writer_boy_245/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 font-extrabold text-black hover:bg-amber-200"><Instagram className="h-5 w-5" /> Instagram</a>
              <Link href="/toppers-classes-gorakhpur" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10"><BookOpen className="h-5 w-5" /> Topper’s Classes</Link>
            </div>
          </div>
        </section>

        <section className="border-t border-amber-300/15 py-12 sm:py-16">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">The journey</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">From facing challenges to building a path of his own</h2>
          <div className="mt-6 max-w-4xl space-y-4 text-base leading-8 text-slate-300">
            <p>Every success story begins somewhere, and not every beginning is easy. The story shared for Uday’s profile describes a boy from a village who faced bullying and difficult moments while growing up. Those experiences are presented here as part of an inspirational narrative, not as independently verified reporting.</p>
            <p>Instead of allowing those early challenges to define the future, the story follows a determination to keep learning, develop confidence, and find a voice through education, speaking and performance. Step by step, the focus shifts from what others may say to what consistent effort can build.</p>
            <p>Today, Uday’s professional profile connects him with Topper’s Classes and Gorakhpur’s Got Latent. His journey can serve as a reminder that a difficult start does not have to decide the destination—and that confidence, skills and persistence can open new doors.</p>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Highlights</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Achievements and recognition</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {achievements.map(({ icon: Icon, title, detail }) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                <Icon className="h-7 w-7 text-amber-300" />
                <h3 className="mt-4 text-xl font-extrabold">{title}</h3>
                <p className="mt-2 leading-7 text-slate-300">{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 py-10 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <GraduationCap className="h-8 w-8 text-amber-300" />
            <h2 className="mt-4 text-2xl font-black">Education</h2>
            <p className="mt-3 leading-7 text-slate-300">Associated with Deen Dayal Upadhyaya Gorakhpur University (DDU), Gorakhpur. This profile intentionally names the university without specifying a degree.</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <BookOpen className="h-8 w-8 text-amber-300" />
            <h2 className="mt-4 text-2xl font-black">Director & Founder of Topper’s Classes</h2>
            <p className="mt-3 leading-7 text-slate-300">Topper’s Classes is listed in Rustampur, Azad Nagar, Gorakhpur, Uttar Pradesh. For location and contact details, visit the dedicated institute page.</p>
            <Link href="/toppers-classes-gorakhpur" className="mt-5 inline-flex font-bold text-amber-300 underline underline-offset-4">View Topper’s Classes details</Link>
          </article>
        </section>

        <section className="rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-300/10 to-red-700/10 p-7 sm:p-10">
          <h2 className="text-2xl font-black sm:text-3xl">A continuing story</h2>
          <p className="mt-4 max-w-4xl leading-8 text-slate-300">From education and public speaking to supporting a coaching institute and a local talent platform, Uday Pratap Singh’s profile reflects a commitment to personal growth and community participation. As new verified milestones become available, this page can be updated with award names, certificates, interviews and press coverage.</p>
        </section>

        <footer className="mt-12 border-t border-white/10 pt-6 text-sm text-slate-400">
          <p>Profile page for Uday Pratap Singh, Gorakhpur, Uttar Pradesh. Some biographical details are based on information supplied for this website and should be supported with documents or published coverage where possible.</p>
          <p className="mt-3"><Link href="/md" className="text-amber-300 hover:underline">GGL leadership profile</Link> · <Link href="/" className="text-amber-300 hover:underline">Gorakhpur’s Got Latent home</Link></p>
        </footer>
      </div>
    </main>
  );
}
