import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Code2,
  Database,
  Globe,
  GraduationCap,
  MapPin,
  Sparkles,
  UserCheck,
  Zap,
  ChevronDown,
  ExternalLink,
  Laptop,
  Cpu,
  Layers,
  Award,
  BookOpen,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Alok Singh — Biography, Story, Developer & Co-Founder in Gorakhpur',
  description:
    'Learn about Alok Singh from Kaudiram, Gorakhpur — his education, technology journey, full-stack development work, social profiles and role as Co-Founder of Gorakhpur’s Got Latent.',
  keywords: [
    'Alok Singh',
    'Alok Singh Gorakhpur',
    'Alok Singh Kaudiram',
    'Alok Singh Kauriram',
    'Alok Singh Uttar Pradesh',
    'Alok Singh biography',
    'Alok Singh story',
    'Alok Singh life story',
    'Alok Singh profile',
    'Alok Singh official',
    'Alok Singh official website',
    'Who is Alok Singh',
    'Alok Singh Gorakhpur biography',
    'Alok Singh Gorakhpur developer',
    'Alok Singh Gorakhpur technology',
    'Alok Singh Gorakhpur creator',
    'Alok Singh Gorakhpur entrepreneur',
    'Alok Singh Gorakhpur co-founder',
    'Alok Singh Kaudiram biography',
    'Alok Singh from Gorakhpur',
    'Alok Singh from Kaudiram',
    'Alok Singh BCA',
    'Alok Singh KIPM',
    'Alok Singh KIPM College',
    'Alok Singh developer',
    'Alok Singh full stack developer',
    'Alok Singh software developer',
    'Alok Singh web developer',
    'Alok Singh programmer',
    'Alok Singh coding',
    'Alok Singh programming',
    'Alok Singh technology builder',
    'Alok Singh technology profile',
    'Alok Singh digital creator',
    'Alok Singh UI UX',
    'Alok Singh website developer',
    'Alok Singh software technology',
    'Alok Singh digital products',
    'Alok Singh cloud deployment',
    'Alok Singh database developer',
    'Alok Singh API developer',
    'Alok Singh career',
    'Alok Singh journey',
    'Alok Singh childhood',
    'Alok Singh school journey',
    'Alok Singh education',
    'Alok Singh student',
    'Alok Singh Co-Founder',
    'Alok Singh GGL',
    'Alok Singh Gorakhpur Got Latent',
    'Alok Singh GGL Co-Founder',
    'Alok Singh Purvanchal Public School',
    'Alok Singh Holy Angel International School',
    'Alok Singh KMR Janipur',
    'Alok Singh Instagram',
    'Alok Singh X profile',
    'Alok Singh Twitter',
    'Alok Singh Facebook',
    'Alok Singh social profiles',
  ],
  alternates: {
    canonical: 'https://www.gkpgotlatent.in/aboutaloksingh',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Alok Singh — Biography, Story, Developer & Co-Founder in Gorakhpur',
    description:
      'Official biography and profile of Alok Singh from Kaudiram, Gorakhpur — full-stack developer, technology builder and Co-Founder of Gorakhpur’s Got Latent.',
    url: 'https://www.gkpgotlatent.in/aboutaloksingh',
    siteName: "Gorakhpur's Got Latent",
    images: [
      {
        url: 'https://www.gkpgotlatent.in/developer-photo-1.jpg',
        width: 800,
        height: 800,
        alt: 'Alok Singh — Full-Stack Developer and Co-Founder from Gorakhpur',
      },
    ],
    locale: 'en_IN',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alok Singh — Biography, Story, Developer & Co-Founder',
    description:
      'Learn about Alok Singh from Kaudiram, Gorakhpur — education, technology journey, full-stack development work, social profiles and role as Co-Founder of Gorakhpur’s Got Latent.',
    images: ['https://www.gkpgotlatent.in/developer-photo-1.jpg'],
  },
};

const profileJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': 'https://www.gkpgotlatent.in/aboutaloksingh#profile',
  url: 'https://www.gkpgotlatent.in/aboutaloksingh',
  name: 'Alok Singh — Official Biography, Profile & Story',
  description:
    'Official biography and profile of Alok Singh, a full-stack developer, technology builder and Co-Founder of Gorakhpur’s Got Latent from Kaudiram, Gorakhpur, Uttar Pradesh, India.',
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://www.gkpgotlatent.in/aboutaloksingh#person',
    name: 'Alok Singh',
    alternateName: [
      'Alok Singh Gorakhpur',
      'Alok Singh Kaudiram',
      'Alok Singh Developer',
      'Alok Singh GGL',
      'Alok Singh Co-Founder',
    ],
    description:
      'Full-stack developer, technology builder and Co-Founder of Gorakhpur’s Got Latent from Kaudiram, Gorakhpur, Uttar Pradesh, India.',
    image: 'https://www.gkpgotlatent.in/developer-photo-1.jpg',
    jobTitle: [
      'Co-Founder',
      'Full-Stack Developer',
      'Technology Builder',
      'Software Developer',
      'Web Developer',
    ],
    sameAs: [
      'https://www.instagram.com/aloksingh_._/',
      'https://x.com/rajpratapsinghh',
      'https://www.facebook.com/meadorush',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kaudiram, Gorakhpur',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'Purvanchal Public School',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'KMR, Janipur, Gola Road',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Holy Angel International School, Pali, Bansgaon',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'KIPM College',
      },
    ],
    knowsAbout: [
      'Full-Stack Web Development',
      'Software Engineering',
      'UI/UX Design',
      'React',
      'Next.js',
      'Cloud Deployment',
      'Databases',
      'API Development',
      'Digital Product Architecture',
      'Entertainment Technology',
    ],
    worksFor: {
      '@type': 'Organization',
      name: "Gorakhpur's Got Latent",
      url: 'https://www.gkpgotlatent.in',
    },
  },
};

const faqItems = [
  {
    question: 'Who is Alok Singh?',
    answer:
      'Alok Singh is a Full-Stack Developer, technology builder, digital creator, and Co-Founder of Gorakhpur’s Got Latent. Hailing from Kaudiram, Gorakhpur, Uttar Pradesh, he designs digital platforms, web software applications, database architectures, and digital product experiences.',
  },
  {
    question: 'Where is Alok Singh from?',
    answer:
      'Alok Singh is from Kaudiram, a prominent town in the Gorakhpur district of Uttar Pradesh, India. He completed his schooling across renowned schools in Gorakhpur and pursued his higher education in Computer Applications locally.',
  },
  {
    question: 'Is Alok Singh from Gorakhpur?',
    answer:
      'Yes, Alok Singh is rooted in Gorakhpur, Uttar Pradesh. His family belongs to Kaudiram in Gorakhpur, and his entire education and technology initiatives—including Co-Founding Gorakhpur’s Got Latent—are centered around Gorakhpur and the Purvanchal region.',
  },
  {
    question: 'Where is Kaudiram?',
    answer:
      'Kaudiram is a major market hub and block headquarters situated in the southern part of the Gorakhpur district, Uttar Pradesh, along the Gorakhpur-Varanasi highway. It forms an integral part of Alok Singh’s childhood background and identity.',
  },
  {
    question: 'What does Alok Singh do?',
    answer:
      'Alok Singh works as a Full-Stack Web Developer and Technology Builder. He designs modern user interfaces (UI/UX), writes backend code, builds REST APIs, configures database systems, deploys cloud applications, and oversees the complete digital product architecture for Gorakhpur’s Got Latent.',
  },
  {
    question: 'Is Alok Singh a developer?',
    answer:
      'Yes, Alok Singh is a skilled Full-Stack Web Developer proficient in JavaScript, TypeScript, React, Next.js, Node.js, database management (PostgreSQL/SQL), API integration, and production web deployment.',
  },
  {
    question: 'What is Alok Singh’s educational background?',
    answer:
      'Alok Singh’s school journey includes early education at Purvanchal Public School (LKG to Class 2), KMR Janipur Gola Road (Class 3), Holy Angel International School in Pali, Bansgaon (Class 4 to Class 10), and Purvanchal Public School (Class 11 & 12). He then pursued a Bachelor of Computer Applications (BCA) degree at KIPM College.',
  },
  {
    question: 'Where did Alok Singh study?',
    answer:
      'Alok Singh studied at Purvanchal Public School, KMR Janipur (Gola Road), Holy Angel International School (Pali, Bansgaon), and completed his college education at KIPM College in Gorakhpur, specializing in BCA.',
  },
  {
    question: 'What is Alok Singh’s connection with KIPM College?',
    answer:
      'Alok Singh pursued his BCA (Bachelor of Computer Applications) at KIPM College. His time at KIPM College provided him with structured theoretical knowledge and practical training in programming, software engineering, databases, and web technology.',
  },
  {
    question: 'Who founded Gorakhpur’s Got Latent?',
    answer:
      'Gorakhpur’s Got Latent was co-founded by Alok Singh and Naveen to showcase local talent, artists, comedians, and performers across Gorakhpur and Purvanchal through a premium talent platform.',
  },
  {
    question: 'Who is the Co-Founder of Gorakhpur’s Got Latent?',
    answer:
      'Alok Singh is the Co-Founder of Gorakhpur’s Got Latent alongside Naveen. While Naveen handles creative leadership and talent execution, Alok Singh leads the technology, website engineering, digital platform building, and online systems.',
  },
  {
    question: 'What is Alok Singh’s role in GGL?',
    answer:
      'Alok Singh serves as Co-Founder and Lead Full-Stack Developer for Gorakhpur’s Got Latent (GGL). He architected and built the official website, performer application portals, ticket booking workflows, voting modules, database schemas, and digital event technology.',
  },
  {
    question: 'Where can I find Alok Singh on Instagram?',
    answer:
      'Alok Singh’s official Instagram profile is @aloksingh_._ (https://www.instagram.com/aloksingh_._/). You can follow his personal updates, technology projects, and GGL event highlights there.',
  },
  {
    question: 'What is Alok Singh’s X/Twitter profile?',
    answer:
      'Alok Singh can be followed on X (formerly Twitter) at @rajpratapsinghh (https://x.com/rajpratapsinghh), where he shares thoughts on technology, software development, web tools, and startup building.',
  },
  {
    question: 'Where is Alok Singh on Facebook?',
    answer:
      'Alok Singh’s official Facebook profile can be accessed at https://www.facebook.com/meadorush (@meadorush).',
  },
  {
    question: 'What is Alok Singh known for?',
    answer:
      'Alok Singh is known as a young technology builder, full-stack software developer, and Co-Founder of Gorakhpur’s Got Latent from Kaudiram, Gorakhpur. He is recognized for bringing tech innovation to the local entertainment ecosystem in Eastern Uttar Pradesh.',
  },
  {
    question: 'How did Alok Singh start his technology journey?',
    answer:
      'Alok Singh started his technology journey out of curiosity for how websites and software operate. Beginning with basic programming and web markup, he progressed into advanced full-stack development, database design, and cloud deployment during his BCA studies at KIPM College, leading up to co-founding GGL.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://www.gkpgotlatent.in/aboutaloksingh#faq',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

const educationTimeline = [
  {
    stage: 'LKG → Class 2',
    school: 'Purvanchal Public School',
    location: 'Gorakhpur, Uttar Pradesh',
    description:
      'The foundational first chapter of Alok Singh’s school journey, where early curiosity and fundamental learning began.',
    icon: BookOpen,
  },
  {
    stage: 'Class 3',
    school: 'KMR, Janipur — Gola Road',
    location: 'Gorakhpur District, UP',
    description:
      'A transition to a new school environment at KMR Janipur on Gola Road, building adaptability and new friendships.',
    icon: GraduationCap,
  },
  {
    stage: 'Class 4 → Class 10',
    school: 'Holy Angel International School, Pali — Bansgaon',
    location: 'Bansgaon Tehsil, Gorakhpur',
    description:
      'A long, highly formative decade of secondary schooling. This phase shaped academic discipline, problem-solving skills, and early interest in digital systems.',
    icon: BookOpen,
  },
  {
    stage: 'Class 11 → Class 12',
    school: 'Purvanchal Public School',
    location: 'Gorakhpur, Uttar Pradesh',
    description:
      'Returning to Purvanchal Public School for senior secondary education, concentrating on science, analytical thinking, and preparing for a technology career.',
    icon: GraduationCap,
  },
  {
    stage: 'College Degree (BCA)',
    school: 'KIPM College',
    location: 'Gorakhpur, Uttar Pradesh',
    description:
      'Bachelor of Computer Applications (BCA) degree program. The pivotal technology chapter where Alok mastered computer programming, full-stack web development, database management, software engineering, and API integration.',
    icon: Award,
  },
];

const techPillars = [
  {
    icon: Code2,
    title: 'Full-Stack Web Development',
    description:
      'Crafting scalable, high-performance web applications using React, Next.js, TypeScript, JavaScript, and Node.js with clean modular architecture.',
  },
  {
    icon: Layers,
    title: 'UI / UX Design & Frontend Engineering',
    description:
      'Building dark-mode, glassmorphism, responsive, accessible web interfaces engineered for seamless user experience across mobile and desktop devices.',
  },
  {
    icon: Database,
    title: 'Database Architecture & Backend APIs',
    description:
      'Designing relational database schemas (PostgreSQL/SQL), backend API endpoints, user authentication flows, and data storage solutions.',
  },
  {
    icon: Cpu,
    title: 'Cloud Deployment & DevOps',
    description:
      'Managing production cloud deployments on Vercel, AWS S3 asset delivery, domain setup, SSL security, and web performance optimization.',
  },
  {
    icon: Laptop,
    title: 'Digital Product Development',
    description:
      'Taking raw ideas from initial concept to wireframes, functional code prototypes, fully tested platforms, and production release.',
  },
  {
    icon: Zap,
    title: 'GGL Entertainment Technology',
    description:
      'Architecting the end-to-end digital infrastructure for Gorakhpur’s Got Latent—including performer portals, ticketing, voting, and live displays.',
  },
];

export default function AboutAlokSinghPage() {
  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-10 text-white sm:px-8 sm:py-16 md:px-12 lg:px-16">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-xs font-semibold text-slate-400"
        >
          <Link href="/" className="transition hover:text-amber-300">
            Home
          </Link>
          <span>/</span>
          <Link href="/cofounder" className="transition hover:text-amber-300">
            Co-Founder
          </Link>
          <span>/</span>
          <span className="text-amber-300">Alok Singh Biography</span>
        </nav>

        {/* Section 1: Hero Profile Header */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-amber-300/20 bg-gradient-to-br from-amber-500/10 via-slate-900/60 to-purple-900/20 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-1.5 text-xs font-black tracking-widest text-amber-300 uppercase">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                OFFICIAL PROFILE · ALOK SINGH
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                ALOK <span className="text-amber-300">SINGH</span>
              </h1>

              <p className="mt-4 text-lg font-bold text-amber-200/90 sm:text-xl lg:text-2xl">
                Full-Stack Developer · Technology Builder · Co-Founder
              </p>

              <p className="mt-4 text-sm font-medium leading-relaxed text-slate-300 sm:text-base lg:text-lg">
                Official profile and complete life story of{' '}
                <strong className="text-white">Alok Singh</strong> from{' '}
                <strong className="text-amber-300">Kaudiram, Gorakhpur, Uttar Pradesh</strong>.
                Explore his education journey, BCA studies at KIPM College, software engineering expertise, digital creator work, and role as Co-Founder of Gorakhpur’s Got Latent (GGL).
              </p>

              {/* Quick Info Badges */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-bold text-slate-200">
                  <MapPin className="h-3.5 w-3.5 text-amber-300" />
                  Kaudiram, Gorakhpur, UP
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-bold text-slate-200">
                  <GraduationCap className="h-3.5 w-3.5 text-amber-300" />
                  BCA · KIPM College
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-bold text-amber-200">
                  <UserCheck className="h-3.5 w-3.5 text-amber-300" />
                  Co-Founder @ GGL
                </span>
              </div>

              {/* Action Links */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/cofounder"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black transition hover:bg-amber-300 shadow-lg shadow-amber-500/20"
                >
                  Co-Founder Profile
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link
                  href="/developer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
                >
                  Developer Portfolio
                  <Code2 className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Profile Image Column */}
            <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
              <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-r from-amber-400/20 to-purple-500/20 blur-2xl" />
              <div className="relative aspect-square overflow-hidden rounded-[2rem] border-2 border-amber-300/30 bg-slate-900 shadow-2xl">
                <img
                  src="/developer-photo-1.jpg"
                  alt="Alok Singh — Full-Stack Developer and Co-Founder from Gorakhpur"
                  width={800}
                  height={800}
                  className="h-full w-full object-cover object-center transition duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-black/60 p-3 backdrop-blur-md">
                  <p className="text-xs font-black tracking-wider text-amber-300 uppercase">
                    Alok Singh
                  </p>
                  <p className="text-xs text-slate-300">
                    Full-Stack Developer & Co-Founder · Gorakhpur’s Got Latent
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: "Who is Alok Singh?" */}
        <section className="mt-16 sm:mt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3.5 py-1 text-xs font-black tracking-widest text-amber-300 uppercase">
            SEARCH INTENT OVERVIEW
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Who is Alok Singh?
          </h2>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 space-y-4 text-base font-normal leading-relaxed text-slate-300 sm:text-lg">
            <p>
              <strong className="text-white">Alok Singh</strong> is an Indian full-stack web developer, software technology builder, digital creator, and Co-Founder of <strong className="text-amber-300">Gorakhpur’s Got Latent (GGL)</strong>. Born and raised in <strong className="text-white">Kaudiram, Gorakhpur, Uttar Pradesh</strong>, Alok represents a new generation of self-driven technology professionals from Eastern Uttar Pradesh who blend software engineering capabilities with real-world entrepreneurial initiative.
            </p>
            <p>
              His work spans across front-end web development, server-side REST API design, relational database administration, cloud server deployment, and user interface (UI/UX) engineering. As the technological backbone behind Gorakhpur’s Got Latent, Alok built the digital ecosystem that enables performers, audiences, judges, and event organizers across Gorakhpur to interact seamlessly.
            </p>
          </div>
        </section>

        {/* Section 3 & 4: "Alok Singh Biography", "Alok Singh's Story", & "Alok Singh from Gorakhpur" */}
        <section className="mt-16 sm:mt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3.5 py-1 text-xs font-black tracking-widest text-amber-300 uppercase">
            LIFE STORY & ROOTS
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Alok Singh Biography & Story from Gorakhpur
          </h2>

          <div className="mt-8 space-y-6 text-base font-normal leading-relaxed text-slate-300 sm:text-lg">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-bold text-amber-300 sm:text-2xl">
                Early Life in Kaudiram & Primary Schooling
              </h3>
              <p>
                Alok Singh spent his childhood in <strong className="text-white">Kaudiram</strong>, a historic market town in the Gorakhpur district of Uttar Pradesh. Growing up in Kaudiram instilled a grounded work ethic and a deep connection to the regional culture of Purvanchal.
              </p>
              <p>
                His academic journey began at <strong className="text-white">Purvanchal Public School</strong>, where he completed his early education from LKG through Class 2. In Class 3, his schooling transitioned to <strong className="text-white">KMR, Janipur on Gola Road</strong>. Moving between schools early in life taught Alok adaptability and resilience—traits that would later prove essential in his software development and entrepreneurial pursuits.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-bold text-amber-300 sm:text-2xl">
                Secondary Schooling & Growth in Bansgaon
              </h3>
              <p>
                From Class 4 to Class 10, Alok attended <strong className="text-white">Holy Angel International School in Pali, Bansgaon</strong>. This seven-year period formed the cornerstone of his academic development. It was during these school years that Alok developed strong logical thinking, problem-solving skills, and a curiosity for how computer systems operate behind the scenes.
              </p>
              <p>
                For Class 11 and Class 12, Alok returned to <strong className="text-white">Purvanchal Public School</strong> to complete his senior secondary education with a focus on science and mathematics, laying the groundwork for his future higher education in technology.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-bold text-amber-300 sm:text-2xl">
                Higher Education: BCA at KIPM College
              </h3>
              <p>
                Following his school graduation, Alok Singh enrolled in the <strong className="text-amber-300">Bachelor of Computer Applications (BCA)</strong> program at <strong className="text-white">KIPM College</strong> in Gorakhpur. His college years at KIPM marked his complete pivot into software engineering and web programming.
              </p>
              <p>
                Rather than limiting himself to classroom curriculum, Alok actively immersed himself in practical coding, learning HTML, CSS, JavaScript, React, Node.js, database queries, and web deployment techniques. Programming transformed from an academic subject into a passion for building functional digital products that solve real-world problems.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: "Alok Singh Education" Timeline */}
        <section className="mt-16 sm:mt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3.5 py-1 text-xs font-black tracking-widest text-amber-300 uppercase">
            ACADEMIC MILESTONES
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Alok Singh Education & Academic Journey
          </h2>
          <p className="mt-4 max-w-3xl text-base text-slate-300 sm:text-lg">
            A comprehensive look at Alok Singh’s educational path from primary school in Gorakhpur to earning his BCA degree at KIPM College.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {educationTimeline.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-amber-300/30 hover:bg-white/[0.05]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md border border-amber-300/30 bg-amber-400/10 px-2.5 py-1 text-xs font-black text-amber-300">
                        {item.stage}
                      </span>
                      <IconComp className="h-5 w-5 text-slate-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-black text-white">{item.school}</h3>
                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      📍 {item.location}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-slate-300">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-white/10 pt-3 text-[11px] font-bold text-slate-400">
                    Milestone {index + 1} of 5
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 6: "Alok Singh's Technology Journey" & "Digital & Technology Work" */}
        <section className="mt-16 sm:mt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3.5 py-1 text-xs font-black tracking-widest text-amber-300 uppercase">
            SOFTWARE & ENGINEERING
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Alok Singh’s Technology Journey & Digital Work
          </h2>
          <p className="mt-4 max-w-3xl text-base text-slate-300 sm:text-lg">
            Alok Singh specializes in modern web software engineering, digital product architecture, database design, and cloud infrastructure.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {techPillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-amber-300/30 hover:bg-white/[0.06]"
                >
                  <div className="inline-flex rounded-xl bg-amber-400/10 p-3 text-amber-300 border border-amber-300/20">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-black text-white">{pillar.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 7: "Alok Singh and Gorakhpur's Got Latent" & "What does Alok Singh do?" */}
        <section className="mt-16 sm:mt-20 overflow-hidden rounded-[2.5rem] border border-amber-300/30 bg-gradient-to-br from-amber-500/15 via-slate-900 to-black p-8 sm:p-12 shadow-2xl relative">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-3.5 py-1 text-xs font-black tracking-widest text-amber-300 uppercase">
            ENTREPRENEURSHIP & CO-FOUNDING
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Alok Singh and Gorakhpur’s Got Latent (GGL)
          </h2>

          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            <p>
              The inception of <strong className="text-amber-300">Gorakhpur’s Got Latent (GGL)</strong> represents the intersection of technology, creative entertainment, and local community empowerment in Eastern Uttar Pradesh. Founded by <strong className="text-white">Alok Singh</strong> and <strong className="text-white">Naveen</strong>, GGL was established to give emerging talent, performers, comedians, singers, and artists across Gorakhpur a high-production platform.
            </p>
            <p>
              As <strong className="text-white">Co-Founder and Full-Stack Developer</strong>, Alok Singh’s primary role encompasses all technical aspects of the platform:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-slate-200">
              <li>Building and maintaining the official website (<Link href="/" className="text-amber-300 underline">gkpgotlatent.in</Link>).</li>
              <li>Designing the online registration system for performers, guests, judges, and event sponsors.</li>
              <li>Engineering digital ticket booking flows, seating options, and ticket verification logic.</li>
              <li>Architecting real-time audience voting platforms and live score displays.</li>
              <li>Managing cloud deployment, website security, and server performance under high visitor traffic.</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black transition hover:bg-amber-300"
            >
              Apply as Performer
              <ExternalLink className="h-4 w-4" />
            </Link>
            <Link
              href="/tickets"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
            >
              Book Event Tickets
            </Link>
          </div>
        </section>

        {/* Section 8: "Alok Singh Social Profiles" */}
        <section className="mt-16 sm:mt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3.5 py-1 text-xs font-black tracking-widest text-amber-300 uppercase">
            CONNECT & FOLLOW
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Alok Singh Social Profiles & Official Links
          </h2>
          <p className="mt-4 max-w-3xl text-base text-slate-300 sm:text-lg">
            Connect directly with Alok Singh through his verified social media accounts and official web profiles.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="https://www.instagram.com/aloksingh_._/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-2xl border border-pink-500/30 bg-pink-500/10 p-6 transition hover:border-pink-500 hover:bg-pink-500/20"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-pink-300 uppercase tracking-wider">
                    INSTAGRAM
                  </span>
                  <ExternalLink className="h-4 w-4 text-pink-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="mt-3 text-xl font-black text-white">@aloksingh_._</h3>
                <p className="mt-2 text-xs text-pink-200">
                  Follow personal updates, developer insights, photos, and behind-the-scenes GGL content on Instagram.
                </p>
              </div>
              <span className="mt-6 text-xs font-bold text-pink-300 underline">
                View Instagram Profile ↗
              </span>
            </a>

            <a
              href="https://x.com/rajpratapsinghh"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-2xl border border-slate-700 bg-white/[0.04] p-6 transition hover:border-slate-500 hover:bg-white/[0.08]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-300 uppercase tracking-wider">
                    X / TWITTER
                  </span>
                  <ExternalLink className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="mt-3 text-xl font-black text-white">@rajpratapsinghh</h3>
                <p className="mt-2 text-xs text-slate-300">
                  Read tech posts, web engineering thoughts, software project announcements, and startup building updates.
                </p>
              </div>
              <span className="mt-6 text-xs font-bold text-amber-300 underline">
                View X Profile ↗
              </span>
            </a>

            <a
              href="https://www.facebook.com/meadorush"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6 transition hover:border-blue-500 hover:bg-blue-500/20"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-300 uppercase tracking-wider">
                    FACEBOOK
                  </span>
                  <ExternalLink className="h-4 w-4 text-blue-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h3 className="mt-3 text-xl font-black text-white">@meadorush</h3>
                <p className="mt-2 text-xs text-blue-200">
                  Connect on Facebook for personal updates, community posts, and regional networking in Gorakhpur.
                </p>
              </div>
              <span className="mt-6 text-xs font-bold text-blue-300 underline">
                View Facebook Profile ↗
              </span>
            </a>
          </div>
        </section>

        {/* Section 9: "Frequently Asked Questions" (FAQ) */}
        <section className="mt-16 sm:mt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3.5 py-1 text-xs font-black tracking-widest text-amber-300 uppercase">
            FAQ & SEARCH INTENT
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Frequently Asked Questions about Alok Singh
          </h2>
          <p className="mt-4 max-w-3xl text-base text-slate-300 sm:text-lg">
            Answers to common search queries regarding Alok Singh’s background, location, education, technology work, and role in Gorakhpur’s Got Latent.
          </p>

          <div className="mt-8 space-y-4">
            {faqItems.map((item, index) => (
              <details
                key={index}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-amber-300/30 open:bg-white/[0.05] open:border-amber-300/40"
              >
                <summary className="flex cursor-pointer items-center justify-between text-base sm:text-lg font-bold text-white list-none">
                  <span>
                    {index + 1}. {item.question}
                  </span>
                  <ChevronDown className="h-5 w-5 text-amber-300 transition duration-300 group-open:rotate-180 shrink-0 ml-2" />
                </summary>
                <div className="mt-4 border-t border-white/10 pt-4 text-xs sm:text-sm font-medium leading-relaxed text-slate-300">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Section 10: Internal Links & Footer Navigation */}
        <footer className="mt-20 border-t border-white/10 pt-10 text-xs sm:text-sm text-slate-400">
          <div className="flex flex-wrap justify-between gap-6">
            <div>
              <p className="font-bold text-white">Alok Singh Official Profile</p>
              <p className="mt-1 text-xs text-slate-300">
                Full-Stack Developer · Technology Builder · Co-Founder @ Gorakhpur’s Got Latent
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Kaudiram, Gorakhpur, Uttar Pradesh, India
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-semibold">
              <Link href="/" className="hover:text-amber-300">
                Home
              </Link>
              <Link href="/cofounder" className="hover:text-amber-300">
                Co-Founder Profile
              </Link>
              <Link href="/developer" className="hover:text-amber-300">
                Developer Profile
              </Link>
              <Link href="/founder" className="hover:text-amber-300">
                Founder Profile
              </Link>
              <Link href="/about" className="hover:text-amber-300">
                About GGL
              </Link>
              <Link href="/apply" className="hover:text-amber-300">
                Apply
              </Link>
              <Link href="/tickets" className="hover:text-amber-300">
                Tickets
              </Link>
              <Link href="/sponsors" className="hover:text-amber-300">
                Sponsors
              </Link>
              <Link href="/contact" className="hover:text-amber-300">
                Contact
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-slate-300">
            © {new Date().getFullYear()} Gorakhpur’s Got Latent. All rights reserved. Canonical URL:{' '}
            <a
              href="https://www.gkpgotlatent.in/aboutaloksingh"
              className="text-amber-300 hover:underline"
            >
              https://www.gkpgotlatent.in/aboutaloksingh
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
