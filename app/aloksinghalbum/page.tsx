import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Alok Singh Album | Photos, Social Media & Official Profile',
  description:
    'Official Alok Singh album featuring photos, social media profiles, developer work and public profile information.',
  keywords: [
    'Alok Singh',
    'Alok Singh photos',
    'Alok Singh album',
    'Alok Singh social media',
    'Alok Singh Instagram',
    'Alok Singh developer',
    'Alok Singh Gorakhpur',
    'Alok Singh Full Stack Developer',
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
        url: '/developer-photo-1.jpg',
        width: 800,
        height: 800,
        alt: 'Alok Singh',
      },
    ],
    locale: 'en_IN',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alok Singh Album | Official Photos & Social Media',
    description: 'Official photos and social profiles of Alok Singh.',
    images: ['/developer-photo-1.jpg'],
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

const photos = [
  {
    src: '/developer-photo-1.jpg',
    alt: 'Alok Singh — Full-Stack Developer and Co-Founder',
    title: 'Alok Singh',
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
    image: 'https://www.gkpgotlatent.in/developer-photo-1.jpg',
    sameAs: socials.map((social) => social.url),
  },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    contentUrl: 'https://www.gkpgotlatent.in/developer-photo-1.jpg',
    caption: 'Alok Singh',
  },
};

export default function AlokSinghAlbumPage() {
  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
            Official Profile
          </p>
          <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-7xl">
            Alok Singh
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Photos · Social Media · Developer · Co-Founder
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500">
            Official photo album and social media links for Alok Singh. This page is
            designed as a simple public profile and photo archive.
          </p>
        </header>

        <section className="mt-12" aria-labelledby="photo-album">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                Photo Album
              </p>
              <h2 id="photo-album" className="mt-2 text-2xl font-black sm:text-3xl">
                Alok Singh Photos
              </h2>
            </div>
            <span className="text-xs text-slate-600">Official album</span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <figure
                key={photo.src}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
              >
                <div className="relative aspect-square">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="px-5 py-4 text-sm font-semibold text-white">
                  {photo.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="social-media">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Social Media
            </p>
            <h2 id="social-media" className="mt-2 text-2xl font-black sm:text-3xl">
              Connect with Alok Singh
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                <span className="mt-1 block text-sm text-slate-500">{social.handle}</span>
                <span className="mt-4 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Open profile →
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-amber-400/15 bg-amber-400/[0.04] p-7 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
            About Alok
          </p>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">
            Full-Stack Developer & Co-Founder
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
            Alok Singh is a full-stack developer and product builder from Gorakhpur,
            Uttar Pradesh, working across web development, AI, UI/UX, APIs, databases
            and modern digital products.
          </p>
          <a
            href="/developer"
            className="mt-6 inline-flex rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black transition hover:bg-amber-300"
          >
            View Full Developer Profile
          </a>
        </section>

        <footer className="mt-16 border-t border-white/5 pt-7 text-center">
          <a href="/" className="text-sm font-semibold text-slate-400 transition hover:text-white">
            ← Back to Gorakhpur&apos;s Got Latent
          </a>
        </footer>
      </div>
    </main>
  );
}
