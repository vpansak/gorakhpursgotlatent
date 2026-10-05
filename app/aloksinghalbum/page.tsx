import type { Metadata } from 'next';
import Link from 'next/link';
import AlbumGalleryClient, { PhotoItem } from '@/components/AlbumGalleryClient';
import {
  Camera,
  Sparkles,
  MapPin,
  GraduationCap,
  UserCheck,
  ExternalLink,
  Code2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Alok Singh Album | Official Photos, Gallery & Social Media Profile',
  description:
    'Official Alok Singh photo album featuring photo gallery, pictures, developer profile portraits, social media profiles, and GGL co-founder details.',
  keywords: [
    'Alok Singh',
    'Alok Singh photos',
    'Alok Singh album',
    'Alok Singh gallery',
    'Alok Singh pictures',
    'Alok Singh images',
    'Alok Singh social media',
    'Alok Singh Instagram',
    'Alok Singh developer',
    'Alok Singh Gorakhpur',
    'Alok Singh Full Stack Developer',
    'Alok Singh Kaudiram',
    'Alok Singh official photo',
    'Alok Singh profile photo',
  ],
  alternates: {
    canonical: 'https://www.gkpgotlatent.in/aloksinghalbum',
  },
  authors: [{ name: 'Alok Singh', url: 'https://www.gkpgotlatent.in/aloksinghalbum' }],
  creator: 'Alok Singh',
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
    title: 'Alok Singh Album | Official Photos & Social Media',
    description: 'Official photo album and social profiles of Alok Singh.',
    url: 'https://www.gkpgotlatent.in/aloksinghalbum',
    siteName: 'Alok Singh',
    images: [
      {
        url: 'https://www.gkpgotlatent.in/alok-singh-02.jpg',
        width: 800,
        height: 800,
        alt: 'Alok Singh official profile photo in blazer and tie',
      },
    ],
    locale: 'en_IN',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alok Singh Album | Official Photos & Social Media',
    description: 'Official photos and social profiles of Alok Singh.',
    images: ['https://www.gkpgotlatent.in/alok-singh-02.jpg'],
  },
};

const socials = [
  {
    name: 'Instagram',
    handle: '@aloksingh_._',
    url: 'https://www.instagram.com/aloksingh_._/',
  },
  {
    name: 'X',
    handle: '@rajpratapsinghh',
    url: 'https://x.com/rajpratapsinghh',
  },
  {
    name: 'Facebook',
    handle: '@meadorush',
    url: 'https://www.facebook.com/meadorush',
  },
  {
    name: 'LinkedIn',
    handle: 'alok-singh-8102a8414',
    url: 'https://www.linkedin.com/in/alok-singh-8102a8414/',
  },
];

const photosList: PhotoItem[] = [
  {
    id: 'photo-1',
    src: '/alok-singh-01.jpg',
    alt: 'Alok Singh mirror selfie photo',
    category: 'Selfie',
    batch: 'Batch 1',
    location: 'Gorakhpur, UP',
  },
  {
    id: 'photo-2',
    src: '/alok-singh-02.jpg',
    alt: 'Alok Singh official profile photo in blazer and tie',
    category: 'Profile',
    batch: 'Batch 1',
    location: 'Gorakhpur, UP',
  },
  {
    id: 'photo-3',
    src: '/alok-singh-03.jpg',
    alt: 'Alok Singh outdoor photo in black hoodie near palm tree',
    category: 'Outdoor',
    batch: 'Batch 1',
    location: 'Kaudiram, Gorakhpur',
  },
  {
    id: 'photo-4',
    src: '/alok-singh-04.jpg',
    alt: 'Alok Singh photo in red jacket at illuminated star event backdrop',
    category: 'Event',
    batch: 'Batch 1',
    location: 'Gorakhpur, UP',
  },
  {
    id: 'photo-5',
    src: '/alok-singh-05.jpg',
    alt: 'Alok Singh sitting in lobby armchair photo',
    category: 'Portrait',
    batch: 'Batch 2',
    location: 'Gorakhpur, UP',
  },
  {
    id: 'photo-6',
    src: '/alok-singh-06.jpg',
    alt: 'Alok Singh standing in front of traditional arch gateway photo',
    category: 'Outdoor',
    batch: 'Batch 2',
    location: 'Gorakhpur, UP',
  },
  {
    id: 'photo-7',
    src: '/alok-singh-07.jpg',
    alt: 'Alok Singh mirror selfie in polo t-shirt photo',
    category: 'Selfie',
    batch: 'Batch 2',
    location: 'Gorakhpur, UP',
  },
  {
    id: 'photo-8',
    src: '/alok-singh-08.jpg',
    alt: 'Alok Singh black and white gym mirror selfie photo',
    category: 'Fitness',
    batch: 'Batch 2',
    location: 'Gorakhpur, UP',
  },
  {
    id: 'photo-9',
    src: '/alok-singh-09.jpg',
    alt: 'Alok Singh casual indoor mirror selfie photo',
    category: 'Selfie',
    batch: 'Batch 3',
    location: 'Gorakhpur, UP',
  },
  {
    id: 'photo-10',
    src: '/alok-singh-10.jpg',
    alt: 'Alok Singh black and white portrait photo',
    category: 'Portrait',
    batch: 'Batch 3',
    location: 'Gorakhpur, UP',
  },
  {
    id: 'photo-11',
    src: '/alok-singh-11.jpg',
    alt: 'Alok Singh outdoor smiling profile photo',
    category: 'Profile',
    batch: 'Batch 3',
    location: 'Gorakhpur, UP',
  },
];

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': 'https://www.gkpgotlatent.in/aloksinghalbum#webpage',
  url: 'https://www.gkpgotlatent.in/aloksinghalbum',
  name: 'Alok Singh — Official Album & Social Media',
  description: 'Official Alok Singh photo album and social media profile page.',
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://www.gkpgotlatent.in/developer#person',
    name: 'Alok Singh',
    jobTitle: 'Full-Stack Developer & Co-Founder',
    url: 'https://www.gkpgotlatent.in/developer',
    image: photosList.map((p) => `https://www.gkpgotlatent.in${p.src}`),
    sameAs: socials.map((social) => social.url),
  },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    contentUrl: 'https://www.gkpgotlatent.in/alok-singh-02.jpg',
    caption: 'Alok Singh',
  },
};

const imageGalleryJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  '@id': 'https://www.gkpgotlatent.in/aloksinghalbum#gallery',
  name: 'Alok Singh Photo Album',
  description: 'Official photo album and gallery collection of Alok Singh.',
  url: 'https://www.gkpgotlatent.in/aloksinghalbum',
  image: photosList.map((photo) => ({
    '@type': 'ImageObject',
    contentUrl: `https://www.gkpgotlatent.in${photo.src}`,
    name: photo.alt,
    caption: photo.alt,
  })),
};

export default function AlokSinghAlbumPage() {
  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-10 text-white sm:px-8 sm:py-16 md:px-12 lg:px-16">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGalleryJsonLd) }}
      />

      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-xs font-semibold text-slate-400"
        >
          <Link href="/" className="transition hover:text-amber-300">
            Home
          </Link>
          <span>/</span>
          <Link href="/aboutaloksingh" className="transition hover:text-amber-300">
            About Alok Singh
          </Link>
          <span>/</span>
          <span className="text-amber-300">Photo Album</span>
        </nav>

        {/* Hero Banner / Header */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-amber-300/20 bg-gradient-to-br from-amber-500/10 via-slate-900/80 to-purple-950/40 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-1.5 text-xs font-black tracking-widest text-amber-300 uppercase">
                <Camera className="h-4 w-4 text-amber-300" />
                OFFICIAL PROFILE & PHOTO ALBUM
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                ALOK <span className="text-amber-300">SINGH</span>
                <span className="block text-2xl font-bold tracking-normal text-slate-300 sm:text-3xl lg:text-4xl mt-1">
                  Photo Album & Social Media
                </span>
              </h1>

              <p className="mt-4 text-sm font-medium leading-relaxed text-slate-300 sm:text-base lg:text-lg max-w-2xl">
                Official picture gallery of <strong className="text-white">Alok Singh</strong> from{' '}
                <strong className="text-amber-300">Kaudiram, Gorakhpur, Uttar Pradesh</strong> — Full-Stack Developer, technology builder and Co-Founder of Gorakhpur’s Got Latent (GGL).
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
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-500/10 px-3.5 py-1.5 text-xs font-bold text-purple-200">
                  <Camera className="h-3.5 w-3.5 text-purple-300" />
                  {photosList.length} Photos Uploaded
                </span>
              </div>

              {/* Navigation Actions */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/aboutaloksingh"
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black transition hover:bg-amber-300 shadow-lg shadow-amber-500/20"
                >
                  Read Biography
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

            {/* Featured Developer Photo Frame (Preserved as requested) */}
            <div className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md">
              <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-r from-amber-400/20 to-purple-500/20 blur-2xl" />
              <div className="relative aspect-square overflow-hidden rounded-[2rem] border-2 border-amber-300/30 bg-slate-900 shadow-2xl">
                <img
                  src="/developer-photo-1.jpg"
                  alt="Alok Singh — Full-Stack Developer & Co-Founder"
                  width={800}
                  height={800}
                  className="h-full w-full object-cover object-center transition duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-black/70 p-3 backdrop-blur-md">
                  <p className="text-xs font-black tracking-wider text-amber-300 uppercase">
                    Featured Profile Photo
                  </p>
                  <p className="text-xs text-slate-300">
                    Alok Singh · Lead Developer & Co-Founder
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Title */}
        <section className="mt-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3.5 py-1 text-xs font-black tracking-widest text-amber-300 uppercase">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                PHOTO GALLERY
              </div>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Alok Singh Official Photo Album
              </h2>
              <p className="mt-2 text-sm text-slate-300 sm:text-base max-w-2xl">
                All photos are preserved in full resolution. Click on any picture to view in interactive fullscreen lightbox view.
              </p>
            </div>
          </div>

          {/* Interactive Album Gallery Client */}
          <AlbumGalleryClient photos={photosList} />
        </section>

        {/* Social Media Section */}
        <section className="mt-16" aria-labelledby="social-media">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Social Media
            </p>
            <h2 id="social-media" className="mt-2 text-2xl font-black sm:text-3xl text-white">
              Connect with Alok Singh
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-amber-400/30 hover:bg-white/[0.05]"
              >
                <span className="block text-base font-bold text-white group-hover:text-amber-300">
                  {social.name}
                </span>
                <span className="mt-1 block text-sm text-slate-400">{social.handle}</span>
                <span className="mt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                  Open profile <ExternalLink className="h-3 w-3" />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Biography & Context Section */}
        <section className="mt-16 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-10">
          <h2 className="text-2xl font-black text-white sm:text-3xl">
            About Alok Singh & Photo Gallery Context
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            <p>
              This official photo album documents the profile and life journey of <strong className="text-white">Alok Singh</strong>, born and raised in <strong className="text-amber-300">Kaudiram, Gorakhpur, Uttar Pradesh</strong>.
            </p>
            <p>
              Alok Singh is a Full-Stack Web Developer and Co-Founder of <strong className="text-white">Gorakhpur’s Got Latent (GGL)</strong>. Having completed his schooling across Purvanchal Public School and Holy Angel International School, he earned his Bachelor of Computer Applications (BCA) degree at KIPM College. Today, he architects digital platform software, web applications, and live event infrastructure across Gorakhpur and Purvanchal.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 border-t border-white/10 pt-6 text-xs text-slate-400">
            <Link href="/aboutaloksingh" className="text-amber-300 hover:underline">
              Read Complete Alok Singh Biography ↗
            </Link>
            <Link href="/developer" className="text-amber-300 hover:underline">
              View Developer Portfolio ↗
            </Link>
            <Link href="/cofounder" className="text-amber-300 hover:underline">
              View Co-Founder Profile ↗
            </Link>
            <Link href="/" className="text-amber-300 hover:underline">
              Gorakhpur’s Got Latent Homepage ↗
            </Link>
          </div>
        </section>

        {/* Footer Navigation */}
        <footer className="mt-20 border-t border-white/10 pt-10 text-xs sm:text-sm text-slate-400">
          <div className="flex flex-wrap justify-between gap-6">
            <div>
              <p className="font-bold text-white">Alok Singh Official Photo Album</p>
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
              <Link href="/aboutaloksingh" className="hover:text-amber-300">
                Biography
              </Link>
              <Link href="/cofounder" className="hover:text-amber-300">
                Co-Founder
              </Link>
              <Link href="/developer" className="hover:text-amber-300">
                Developer Profile
              </Link>
              <Link href="/tickets" className="hover:text-amber-300">
                Tickets
              </Link>
              <Link href="/contact" className="hover:text-amber-300">
                Contact
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-slate-300">
            © {new Date().getFullYear()} Gorakhpur’s Got Latent. All rights reserved. Canonical URL:{' '}
            <a
              href="https://www.gkpgotlatent.in/aloksinghalbum"
              className="text-amber-300 hover:underline"
            >
              https://www.gkpgotlatent.in/aloksinghalbum
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
