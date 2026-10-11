import type { Metadata } from 'next';
import Image from 'next/image';
import { BookOpen, MapPin, Phone, GraduationCap, Award, Users, Clock, ExternalLink } from 'lucide-react';

const pageUrl = 'https://gkpgotlatent.in/toppers-classes-gorakhpur';
const fullAddress = 'Floor No. 1, Pillar No. 56, Rustampur Police Station, opposite Pillar No. 56, Azad Nagar, Gorakhpur, Uttar Pradesh 273016, India';

export const metadata: Metadata = {
  title: "Topper's Classes Gorakhpur | Coaching in Rustampur, Azad Nagar",
  description: "Discover Topper's Classes in Rustampur, Azad Nagar, Gorakhpur. Academic coaching and competitive exam guidance. Contact 09845424877. Director: Uday Pratap Singh.",
  keywords: [
    "Topper's Classes Gorakhpur",
    "Toppers Classes Rustampur",
    "coaching classes in Azad Nagar Gorakhpur",
    "coaching in Rustampur Gorakhpur",
    "academic coaching Gorakhpur",
    "competitive exam preparation Gorakhpur",
    "Uday Pratap Singh Topper's Classes",
  ],
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    url: pageUrl,
    title: "Topper's Classes | Coaching in Gorakhpur",
    description: "Find Topper's Classes in Rustampur, Azad Nagar, Gorakhpur. Call 09845424877 for admission and class information.",
    siteName: "Gorakhpur's Got Latent",
    locale: 'en_IN',
  },
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['EducationalOrganization', 'LocalBusiness'],
  '@id': pageUrl + '#organization',
  name: "Topper's Classes",
  url: pageUrl,
  telephone: '+91-9845424877',
  description: "Topper's Classes is a coaching and educational institute in Rustampur, Azad Nagar, Gorakhpur, Uttar Pradesh, offering academic coaching and guidance for competitive exam preparation.",
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Floor No. 1, Pillar No. 56, Rustampur Police Station, opposite Pillar No. 56, Azad Nagar',
    addressLocality: 'Gorakhpur',
    addressRegion: 'Uttar Pradesh',
    postalCode: '273016',
    addressCountry: 'IN',
  },
  areaServed: { '@type': 'City', name: 'Gorakhpur' },
  founder: {
    '@type': 'Person',
    name: 'Uday Pratap Singh',
    jobTitle: 'Director',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9845424877',
    contactType: 'admissions and general enquiries',
    areaServed: 'IN',
    availableLanguage: ['Hindi', 'English'],
  },
};

const highlights = [
  { icon: BookOpen, title: 'Academic Coaching', detail: 'Support for school learning and academic progress.' },
  { icon: GraduationCap, title: 'Competitive Exam Guidance', detail: 'Guidance for students preparing for competitive examinations.' },
  { icon: Users, title: 'Student-Focused Learning', detail: 'A learning environment focused on practice, progress, and understanding.' },
];

export default function ToppersClassesPage() {
  return (
    <main className="min-h-screen bg-[#07080e] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd).replace(/</g, '\\u003c') }}
      />
      <section className="relative isolate overflow-hidden border-b border-amber-400/20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.19),transparent_42%),radial-gradient(ellipse_at_bottom_left,rgba(185,28,28,0.18),transparent_40%)]" />
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="mb-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div
              aria-label="Topper's Classes logo placeholder"
              className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-amber-300/50 bg-black/30 p-3 text-center text-xs font-bold leading-5 text-amber-200 sm:h-32 sm:w-32"
            >
              LOGO<br />PLACEHOLDER
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Director · Topper&apos;s Classes</p>
              <p className="mt-1 text-2xl font-black text-white sm:text-3xl">Uday Pratap Singh</p>
              <p className="mt-2 text-sm text-slate-400">Rustampur, Azad Nagar, Gorakhpur</p>
            </div>
          </div>
          <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
            <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
            <BookOpen className="h-4 w-4" /> Education · Gorakhpur
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            Topper&apos;s Classes <span className="text-amber-300">Gorakhpur</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
            Academic coaching and competitive exam guidance in Rustampur, Azad Nagar, Gorakhpur, Uttar Pradesh.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="tel:+919845424877" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 font-extrabold text-black transition hover:bg-amber-200">
              <Phone className="h-5 w-5" /> Call 09845424877
            </a>
            <a href="https://www.google.com/maps/search/?api=1&query=Topper%27s%20Classes%20Pillar%20No.%2056%20Rustampur%20Gorakhpur" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-bold text-white transition hover:bg-white/10">
              <MapPin className="h-5 w-5" /> Get Directions <ExternalLink className="h-4 w-4" />
            </a>
            </div>
            <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-amber-400/35 via-red-600/25 to-transparent blur-xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.7rem] border border-amber-300/30 bg-[#111116] shadow-2xl shadow-black/50">
                <Image
                  src="/uday-pratap-singh.jpg"
                  alt="Uday Pratap Singh, Director of Topper's Classes"
                  fill
                  priority
                  sizes="(max-width: 1024px) 85vw, 420px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Director</p>
                  <p className="mt-1 text-2xl font-black text-white">Uday Pratap Singh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1.4fr_0.8fr] lg:py-16">
        <div>
          <h2 className="text-2xl font-black sm:text-3xl">About Topper&apos;s Classes</h2>
          <div className="mt-5 space-y-4 text-base leading-8 text-slate-300">
            <p>
              Topper&apos;s Classes is an educational coaching institute located in the Rustampur and Azad Nagar area of Gorakhpur. The institute supports students with academic learning and preparation for competitive examinations.
            </p>
            <p>
              Students and parents can contact the institute directly to ask about current batches, subjects, class timings, admission availability, and course details. Please confirm the latest schedule and offerings by phone before visiting.
            </p>
          </div>
          <h2 className="mt-10 text-2xl font-black sm:text-3xl">Learning and Guidance</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map(({ icon: Icon, title, detail }) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <Icon className="h-7 w-7 text-amber-300" />
                <h3 className="mt-4 font-extrabold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-6">
            <div className="flex items-center gap-3">
              <Award className="h-7 w-7 text-amber-300" />
              <h2 className="text-xl font-black">Institute Director</h2>
            </div>
            <p className="mt-3 text-2xl font-extrabold text-amber-200">Uday Pratap Singh</p>
            <p className="mt-2 leading-7 text-slate-300">
              Uday Pratap Singh is the Director of Topper&apos;s Classes. For institute-related enquiries, students and parents can contact Topper&apos;s Classes using the phone number listed on this page.
            </p>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-white/10 bg-[#10121b] p-6 sm:p-7">
          <h2 className="text-xl font-black">Contact & Location</h2>
          <div className="mt-6 flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-amber-300"><Phone className="h-5 w-5" /></span>
            <div>
              <p className="text-sm text-slate-400">Phone</p>
              <a href="tel:+919845424877" className="mt-1 block text-lg font-bold text-white hover:text-amber-300">09845424877</a>
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-amber-300"><MapPin className="h-5 w-5" /></span>
            <div>
              <p className="text-sm text-slate-400">Address</p>
              <p className="mt-1 leading-7 text-slate-200">{fullAddress}</p>
            </div>
          </div>
          <a href="https://www.google.com/maps/search/?api=1&query=Topper%27s%20Classes%20Pillar%20No.%2056%20Rustampur%20Gorakhpur" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300/30 px-4 py-3 text-center font-bold text-amber-200 transition hover:bg-amber-300/10">
            Open in Google Maps <ExternalLink className="h-4 w-4" />
          </a>
          <p className="mt-5 text-xs leading-5 text-slate-500"><Clock className="mr-1 inline h-3.5 w-3.5" /> Call ahead to confirm current opening hours and class timings.</p>
        </aside>
      </section>

      <section className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <h2 className="text-2xl font-black">Frequently Asked Questions</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div><h3 className="font-bold text-white">Where is Topper&apos;s Classes located?</h3><p className="mt-2 leading-7 text-slate-400">It is listed at Pillar No. 56, near Rustampur Police Station, Azad Nagar, Gorakhpur, Uttar Pradesh 273016.</p></div>
            <div><h3 className="font-bold text-white">How can I contact Topper&apos;s Classes?</h3><p className="mt-2 leading-7 text-slate-400">Call 09845424877 to ask about courses, admissions, and class timings.</p></div>
            <div><h3 className="font-bold text-white">Who is the director of Topper&apos;s Classes?</h3><p className="mt-2 leading-7 text-slate-400">The director is Uday Pratap Singh.</p></div>
            <div><h3 className="font-bold text-white">Does the institute offer competitive exam guidance?</h3><p className="mt-2 leading-7 text-slate-400">The institute listing mentions competitive exam preparation. Contact the institute to confirm the exams and current batches offered.</p></div>
          </div>
        </div>
      </section>
    </main>
  );
}
