import type { Metadata } from 'next';
import Link from 'next/link';
import {
  UserRound, MapPin, GraduationCap, Code2, BriefcaseBusiness, Globe2,
  ExternalLink, Camera, Users, Rocket, Database,
  Smartphone, Search, Heart, Sparkles
} from 'lucide-react';

const pageUrl = 'https://www.gkpgotlatent.in/allaboutaloksingh';
const instagramUrl = 'https://www.instagram.com/aloksingh_._/';
const xUrl = 'https://x.com/rajpratapsinghh';
const facebookUrl = 'https://www.facebook.com/meadorush';
const linkedinUrl = 'https://www.linkedin.com/in/alok-singh-8102a8414/';

export const metadata: Metadata = {
  title: 'All About Alok Singh | Biography, Education, Developer, GGL Co-Founder & Social Media',
  description:
    'All about Alok Singh: biography, early life, education, BCA at KIPM College, full-stack development, technology journey, projects, Gorakhpur’s Got Latent co-founder role, photos and social media profiles.',
  keywords: [
    'Alok Singh','all about Alok Singh','Alok Singh biography','Alok Singh profile','Alok Singh Gorakhpur',
    'Alok Singh Kaudiram','Alok Singh developer','Alok Singh full stack developer','Alok Singh web developer',
    'Alok Singh software developer','Alok Singh technology builder','Alok Singh BCA','Alok Singh KIPM',
    'Alok Singh education','Alok Singh school','Alok Singh career','Alok Singh projects','Alok Singh GGL',
    'Alok Singh Gorakhpur Got Latent','Alok Singh Co-Founder','Alok Singh Instagram','Alok Singh Instagram ID',
    'Alok Singh photos','Alok Singh photo album','Alok Singh LinkedIn','Alok Singh X','Alok Singh Facebook'
  ],
  alternates: { canonical: pageUrl },
  authors: [{ name: 'Alok Singh', url: pageUrl }],
  creator: 'Alok Singh',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: {
    title: 'All About Alok Singh | Official Biography & Profile',
    description: 'Complete public profile of Alok Singh — developer, technology builder, BCA student/graduate, GGL Co-Founder, projects, education, photos and social profiles.',
    url: pageUrl, siteName: "Gorakhpur's Got Latent", locale: 'en_IN', type: 'profile',
    images: [{ url: 'https://www.gkpgotlatent.in/developer-photo-1.jpg', width: 800, height: 800, alt: 'Alok Singh — Full-Stack Developer and Co-Founder' }]
  },
  twitter: { card: 'summary_large_image', title: 'All About Alok Singh | Official Profile', description: 'Biography, education, technology journey, GGL, projects, photos and social media of Alok Singh.', images: ['https://www.gkpgotlatent.in/developer-photo-1.jpg'] }
};

const education = [
  ['LKG – Class 2', 'Purvanchal Public School', 'Gorakhpur, Uttar Pradesh'],
  ['Class 3', 'KMR, Janipur — Gola Road', 'Gorakhpur District, Uttar Pradesh'],
  ['Class 4 – Class 10', 'Holy Angel International School, Pali — Bansgaon', 'Gorakhpur District, Uttar Pradesh'],
  ['Class 11 – Class 12', 'Purvanchal Public School', 'Gorakhpur, Uttar Pradesh'],
  ['BCA', 'KIPM College', 'Gorakhpur, Uttar Pradesh']
];

const skills = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Full-Stack Web Development', 'UI/UX', 'REST APIs', 'PostgreSQL / SQL',
  'Database Architecture', 'Authentication', 'Cloud Deployment', 'Vercel',
  'GitHub', 'SEO', 'Digital Product Building', 'AI Tools & AI Learning'
];

const projects = [
  ['Gorakhpur’s Got Latent', 'Co-Founder and technology lead for a local talent and entertainment platform, including its website, applications, ticketing and digital systems.', '/'],
  ['VPANSAK', 'Founder-led technology and e-commerce/product-building project history, focused on web products and digital commerce.', null],
  ['ALØK STUDIO', 'Multi-language online code compiler and IDE concept with web development tools, code editing and runtime integrations.', null],
  ['Alok Singh Photo Album', 'Public photo gallery and profile collection with image browsing and social profile links.', '/aloksinghalbum'],
  ['Alok Singh Instagram Profile', 'Dedicated public profile page focused on Alok Singh Instagram, username, profile and social discovery.', '/aloksinghinstagram']
];

const socials = [
  ['Instagram', '@aloksingh_._', instagramUrl],
  ['X / Twitter', '@rajpratapsinghh', xUrl],
  ['Facebook', '@meadorush', facebookUrl],
  ['LinkedIn', 'Alok Singh', linkedinUrl]
];

const faqs = [
  ['Who is Alok Singh?', 'Alok Singh is presented on this website as a Full-Stack Developer, Technology Builder and Co-Founder of Gorakhpur’s Got Latent (GGL), from Kaudiram, Gorakhpur, Uttar Pradesh.'],
  ['Where is Alok Singh from?', 'Alok Singh is from Kaudiram in Gorakhpur district, Uttar Pradesh, India.'],
  ['What does Alok Singh do?', 'Alok Singh works across full-stack web development, digital product building, technology projects and the technical side of Gorakhpur’s Got Latent.'],
  ['What is Alok Singh’s education?', 'His school journey includes Purvanchal Public School, KMR Janipur, Holy Angel International School in Pali/Bansgaon, and senior secondary education at Purvanchal Public School. He pursued BCA at KIPM College.'],
  ['What is Alok Singh’s role in GGL?', 'Alok Singh is a Co-Founder and technology/full-stack development lead associated with Gorakhpur’s Got Latent.'],
  ['What are Alok Singh’s skills?', 'His public technology profile includes HTML, CSS, JavaScript, TypeScript, React, Next.js, Node.js, APIs, databases, cloud deployment, SEO, UI/UX and digital product development.'],
  ['What is Alok Singh Instagram ID?', 'The Instagram profile linked from this page is @aloksingh_._.'],
  ['Where can I see Alok Singh photos?', 'The dedicated Alok Singh photo album is available at /aloksinghalbum.'],
  ['Where can I find Alok Singh professionally?', 'The public LinkedIn profile linked from this page is the main professional social profile.'],
  ['What projects has Alok Singh worked on?', 'The public profile highlights Gorakhpur’s Got Latent, VPANSAK, ALØK STUDIO and dedicated Alok Singh profile/photo pages.']
];

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': pageUrl + '#person',
  name: 'Alok Singh',
  alternateName: ['Alok Singh Gorakhpur', 'Alok Singh Kaudiram', 'Alok Singh Developer', 'Alok Singh GGL Co-Founder'],
  description: 'Full-Stack Developer, Technology Builder and Co-Founder of Gorakhpur’s Got Latent from Kaudiram, Gorakhpur, Uttar Pradesh, India.',
  image: 'https://www.gkpgotlatent.in/developer-photo-1.jpg',
  jobTitle: ['Full-Stack Developer', 'Technology Builder', 'Co-Founder', 'Web Developer'],
  sameAs: [instagramUrl, xUrl, facebookUrl, linkedinUrl],
  address: { '@type': 'PostalAddress', addressLocality: 'Kaudiram, Gorakhpur', addressRegion: 'Uttar Pradesh', addressCountry: 'IN' },
  alumniOf: education.map(([, school]) => ({ '@type': 'EducationalOrganization', name: school })),
  knowsAbout: skills,
  worksFor: { '@type': 'Organization', name: "Gorakhpur's Got Latent", url: 'https://www.gkpgotlatent.in' }
};

const profilePageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': pageUrl + '#profile',
  url: pageUrl,
  name: 'All About Alok Singh — Official Biography & Profile',
  mainEntity: { '@id': pageUrl + '#person' }
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([question, answer]) => ({
    '@type': 'Question', name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer }
  }))
};

export default function AllAboutAlokSinghPage() {
  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-8 font-medium text-white sm:px-8 sm:py-14 lg:px-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-amber-300">Home</Link><span>/</span>
          <span className="text-amber-300">All About Alok Singh</span>
        </nav>

        <section className="overflow-hidden rounded-[2.2rem] border border-amber-300/20 bg-gradient-to-br from-amber-500/15 via-slate-900 to-purple-950/30 p-6 shadow-2xl sm:p-10 lg:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-1.5 text-xs font-black tracking-[0.18em] text-amber-300"><Sparkles className="h-4 w-4" /> COMPLETE PUBLIC PROFILE</span>
              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">All About <span className="text-amber-300">Alok Singh</span></h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">A complete public profile covering Alok Singh’s biography, education, technology journey, development skills, projects, Gorakhpur’s Got Latent role, photos and social media profiles — all in one place.</p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold text-slate-200"><MapPin className="mr-1 inline h-3.5 w-3.5 text-amber-300" /> Kaudiram, Gorakhpur, UP</span>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold text-slate-200"><Code2 className="mr-1 inline h-3.5 w-3.5 text-amber-300" /> Full-Stack Developer</span>
                <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-200"><Users className="mr-1 inline h-3.5 w-3.5 text-amber-300" /> GGL Co-Founder</span>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold text-slate-200"><GraduationCap className="mr-1 inline h-3.5 w-3.5 text-amber-300" /> BCA · KIPM College</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black hover:bg-amber-300">Instagram <Camera className="h-4 w-4" /></a>
                <Link href="/aloksinghalbum" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-black hover:bg-white/10"><Camera className="h-4 w-4" /> Photos</Link>
                <Link href="/developer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-black hover:bg-white/10"><Code2 className="h-4 w-4" /> Developer</Link>
              </div>
            </div>
            <div className="mx-auto w-full max-w-sm">
              <div className="overflow-hidden rounded-[2rem] border-2 border-amber-300/30 bg-slate-900 shadow-2xl">
                <img src="/developer-photo-1.jpg" alt="Alok Singh official profile photo" className="aspect-square w-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Name', 'Alok Singh', UserRound],
            ['Location', 'Kaudiram, Gorakhpur', MapPin],
            ['Primary Role', 'Full-Stack Developer', Code2],
            ['Leadership', 'GGL Co-Founder', Users]
          ].map(([label, value, Icon]) => {
            const I = Icon as typeof UserRound;
            return <div key={label as string} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><I className="h-5 w-5 text-amber-300" /><p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">{label as string}</p><p className="mt-1 text-base font-black text-white">{value as string}</p></div>
          })}
        </section>

        <section className="mt-16 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">A — Z PROFILE</p>
          <h2 className="mt-2 text-3xl font-black sm:text-5xl">Who is Alok Singh?</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2 text-sm leading-8 text-slate-300 sm:text-base">
            <div className="space-y-5">
              <p><strong className="text-white">Alok Singh</strong> is a Full-Stack Developer, Technology Builder and Co-Founder associated with <strong className="text-amber-300">Gorakhpur’s Got Latent (GGL)</strong>. His public profile combines software development, digital product building, web technology and local entertainment technology.</p>
              <p>He is from <strong className="text-white">Kaudiram, Gorakhpur, Uttar Pradesh</strong>. His education journey spans multiple schools in the Gorakhpur region before his BCA studies at KIPM College.</p>
              <p>His work focuses on turning ideas into usable websites, digital platforms, applications, databases, APIs and production-ready web experiences.</p>
            </div>
            <div className="space-y-4">
              {[
                ['Identity', 'Developer · Technology Builder · Co-Founder'],
                ['Region', 'Gorakhpur · Purvanchal · Uttar Pradesh'],
                ['Education', 'BCA · KIPM College'],
                ['Focus', 'Web Development · AI Learning · Digital Products'],
                ['Public Interests', 'Technology · Coding · Websites · Startup/Product Building']
              ].map(([a,b]) => <div key={a} className="flex gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"><span className="min-w-24 text-xs font-black uppercase text-amber-300">{a}</span><span className="text-sm text-slate-300">{b}</span></div>)}
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">EDUCATION</p><h2 className="mt-2 text-3xl font-black sm:text-5xl">Alok Singh Education Journey</h2></div><GraduationCap className="hidden h-10 w-10 text-amber-300 sm:block" /></div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {education.map(([stage, school, location], i) => <div key={stage} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><span className="rounded-md border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-xs font-black text-amber-300">{stage}</span><h3 className="mt-4 text-lg font-black">{school}</h3><p className="mt-1 text-xs font-semibold text-slate-500">{location}</p><p className="mt-4 text-xs leading-6 text-slate-300">Academic milestone {i + 1}: part of Alok Singh’s public education journey.</p></div>)}
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-amber-300/20 bg-gradient-to-br from-amber-500/10 via-slate-900 to-black p-6 sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">TECHNOLOGY</p>
          <h2 className="mt-2 text-3xl font-black sm:text-5xl">Alok Singh Skills & Technology</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">A broad public technology profile covering frontend, backend, databases, APIs, deployment, SEO and digital product development.</p>
          <div className="mt-7 flex flex-wrap gap-2.5">{skills.map(skill => <span key={skill} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold text-slate-200">{skill}</span>)}</div>
        </section>

        <section className="mt-16">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">WORK & PROJECTS</p>
          <h2 className="mt-2 text-3xl font-black sm:text-5xl">Alok Singh Projects & Digital Work</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {projects.map(([name, description, href]) => <div key={name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><Rocket className="h-6 w-6 text-amber-300" /><h3 className="mt-4 text-xl font-black">{name}</h3><p className="mt-2 text-sm leading-7 text-slate-300">{description}</p>{href && <Link href={href} className="mt-5 inline-flex items-center gap-2 text-xs font-black text-amber-300 hover:underline">Open project/profile <ExternalLink className="h-3 w-3" /></Link>}</div>)}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">GGL</p>
          <h2 className="mt-2 text-3xl font-black sm:text-5xl">Alok Singh & Gorakhpur’s Got Latent</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2 text-sm leading-7 text-slate-300 sm:text-base">
            <p><strong className="text-white">Gorakhpur’s Got Latent</strong> is a talent and entertainment platform based in Gorakhpur. Alok Singh is associated with the project as <strong className="text-amber-300">Co-Founder and technology/full-stack development lead</strong>.</p>
            <ul className="space-y-3">
              <li>• Official website and digital platform engineering</li>
              <li>• Performer, guest, sponsor and team application workflows</li>
              <li>• Ticket booking and ticket verification systems</li>
              <li>• Database, API, authentication and deployment work</li>
              <li>• Digital experience, SEO and website maintenance</li>
            </ul>
          </div>
          <Link href="/" className="mt-7 inline-flex rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black hover:bg-amber-300">Visit GGL Website</Link>
        </section>

        <section className="mt-16">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">SOCIAL MEDIA</p>
          <h2 className="mt-2 text-3xl font-black sm:text-5xl">Alok Singh Social Media & Profiles</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {socials.map(([name, handle, url]) => <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-amber-300/30"><span className="text-xs font-black uppercase tracking-wider text-amber-300">{name}</span><h3 className="mt-3 text-lg font-black">{handle}</h3><span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-slate-400">Open profile <ExternalLink className="h-3 w-3" /></span></a>)}
          </div>
        </section>

        <section className="mt-16">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">PHOTOS</p>
          <h2 className="mt-2 text-3xl font-black sm:text-5xl">Alok Singh Photos & Album</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">
            <div className="overflow-hidden rounded-3xl border border-white/10"><img src="/developer-photo-1.jpg" alt="Alok Singh profile photo" className="aspect-square w-full object-cover" /></div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"><Camera className="h-7 w-7 text-amber-300" /><h3 className="mt-4 text-2xl font-black">Official Photo Collection</h3><p className="mt-3 text-sm leading-7 text-slate-300">Browse the dedicated Alok Singh photo album for profile photos, pictures and the public gallery.</p><Link href="/aloksinghalbum" className="mt-6 inline-flex rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black">Open Photo Album</Link></div>
          </div>
        </section>

        <section className="mt-16" aria-labelledby="faq">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">FAQ</p>
          <h2 id="faq" className="mt-2 text-3xl font-black sm:text-5xl">Frequently Asked Questions About Alok Singh</h2>
          <div className="mt-7 space-y-3">{faqs.map(([q,a], i) => <details key={q} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><summary className="cursor-pointer font-bold">{i + 1}. {q}</summary><p className="mt-3 text-sm leading-7 text-slate-400">{a}</p></details>)}</div>
        </section>

        <section className="mt-16 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">EXPLORE MORE</p>
          <h2 className="mt-2 text-3xl font-black">Alok Singh Official Pages</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              ['/aboutaloksingh','Biography'],
              ['/developer','Developer Profile'],
              ['/cofounder','Co-Founder Profile'],
              ['/aloksinghalbum','Photo Album'],
              ['/aloksinghinstagram','Instagram Profile'],
              ['/contact','Contact']
            ].map(([href,label]) => <Link key={href} href={href} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold hover:border-amber-300/30 hover:text-amber-300">{label}</Link>)}
          </div>
        </section>

        <footer className="mt-20 border-t border-white/10 pt-8 text-center text-xs text-slate-500">
          <p className="font-black text-white">All About Alok Singh</p>
          <p className="mt-2">Biography · Education · Developer · Technology · Projects · GGL · Photos · Social Media</p>
          <p className="mt-5">© {new Date().getFullYear()} Gorakhpur’s Got Latent</p>
        </footer>
      </div>
    </main>
  );
}
