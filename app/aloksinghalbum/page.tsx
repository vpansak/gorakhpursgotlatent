import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import AlbumGalleryClient, { PhotoItem } from '@/components/AlbumGalleryClient';
import { Camera, MapPin, UserCheck, ExternalLink, Code2 } from 'lucide-react';

const pageUrl = 'https://www.gkpgotlatent.in/aloksinghalbum';
const instagramUrl = 'https://www.instagram.com/aloksingh_._/';

export const metadata: Metadata = {
  title: 'Alok Singh Photos & Album | Official Photo Gallery, Images & Instagram',
  description: 'Explore the Alok Singh photo album and official photo gallery with pictures, profile photos, social media links and Alok Singh Instagram.',
  keywords: ['Alok Singh','Alok Singh photos','Alok Singh photo album','Alok Singh album','Alok Singh photo gallery','Alok Singh pictures','Alok Singh images','Alok Singh profile photo','Alok Singh official photos','Alok Singh Instagram','Alok Singh Instagram ID','Alok Singh social media','Alok Singh Gorakhpur','Alok Singh Full Stack Developer'],
  alternates: { canonical: pageUrl },
  authors: [{ name: 'Alok Singh', url: pageUrl }],
  creator: 'Alok Singh',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: {
    title: 'Alok Singh Photos & Album | Official Photo Gallery',
    description: 'Explore Alok Singh photos, profile pictures, photo gallery and social media profiles.',
    url: pageUrl, siteName: 'Alok Singh', locale: 'en_IN', type: 'profile',
    images: [{ url: 'https://www.gkpgotlatent.in/alok-singh-02.jpg', width: 800, height: 800, alt: 'Alok Singh official photo' }],
  },
  twitter: { card: 'summary_large_image', title: 'Alok Singh Photos & Album | Official Photo Gallery', description: 'Alok Singh photo album, pictures, profile photos and Instagram.', images: ['https://www.gkpgotlatent.in/alok-singh-02.jpg'] },
};

const socials = [
  { name: 'Instagram', handle: '@aloksingh_._', url: instagramUrl },
  { name: 'X', handle: '@rajpratapsinghh', url: 'https://x.com/rajpratapsinghh' },
  { name: 'Facebook', handle: '@meadorush', url: 'https://www.facebook.com/meadorush' },
  { name: 'LinkedIn', handle: 'alok-singh-8102a8414', url: 'https://www.linkedin.com/in/alok-singh-8102a8414/' },
];

const photosList: PhotoItem[] = [
  { id: 'photo-1', src: '/alok-singh-01.jpg', alt: 'Alok Singh mirror selfie photo', category: 'Selfie', batch: 'Batch 1', location: 'Gorakhpur, UP' },
  { id: 'photo-2', src: '/alok-singh-02.jpg', alt: 'Alok Singh official profile photo in blazer and tie', category: 'Profile', batch: 'Batch 1', location: 'Gorakhpur, UP' },
  { id: 'photo-3', src: '/alok-singh-03.jpg', alt: 'Alok Singh outdoor photo in black hoodie', category: 'Outdoor', batch: 'Batch 1', location: 'Gorakhpur, UP' },
  { id: 'photo-4', src: '/alok-singh-04.jpg', alt: 'Alok Singh event photo in red jacket', category: 'Event', batch: 'Batch 1', location: 'Gorakhpur, UP' },
  { id: 'photo-5', src: '/alok-singh-05.jpg', alt: 'Alok Singh portrait photo in a lobby', category: 'Portrait', batch: 'Batch 2', location: 'Gorakhpur, UP' },
  { id: 'photo-6', src: '/alok-singh-06.jpg', alt: 'Alok Singh outdoor portrait photo', category: 'Outdoor', batch: 'Batch 2', location: 'Gorakhpur, UP' },
  { id: 'photo-7', src: '/alok-singh-07.jpg', alt: 'Alok Singh mirror selfie photo in polo t-shirt', category: 'Selfie', batch: 'Batch 2', location: 'Gorakhpur, UP' },
  { id: 'photo-8', src: '/alok-singh-08.jpg', alt: 'Alok Singh black and white gym mirror selfie', category: 'Fitness', batch: 'Batch 2', location: 'Gorakhpur, UP' },
  { id: 'photo-9', src: '/alok-singh-09.jpg', alt: 'Alok Singh casual indoor mirror selfie', category: 'Selfie', batch: 'Batch 3', location: 'Gorakhpur, UP' },
  { id: 'photo-10', src: '/alok-singh-10.jpg', alt: 'Alok Singh black and white portrait', category: 'Portrait', batch: 'Batch 3', location: 'Gorakhpur, UP' },
  { id: 'photo-11', src: '/alok-singh-11.jpg', alt: 'Alok Singh outdoor smiling profile photo', category: 'Profile', batch: 'Batch 3', location: 'Gorakhpur, UP' },
];

const faqs = [
  ['Where can I find Alok Singh photos?', 'You can browse the Alok Singh photo gallery on this page.'],
  ['Is this the Alok Singh official photo album?', 'This is the Alok Singh photo album page published on gkpgotlatent.in with the current public photo collection and social links.'],
  ['What is Alok Singh Instagram?', 'The Alok Singh Instagram profile linked from this page is @aloksingh_._.'],
  ['Where can I find Alok Singh profile photos?', 'Alok Singh profile photos are available in the Profile and All Photos sections of this gallery.'],
  ['Can I view Alok Singh pictures full screen?', 'Yes. Select any photo in the gallery to open the interactive fullscreen photo viewer.'],
  ['Who is Alok Singh?', 'Alok Singh is presented on this website as a Full-Stack Developer, technology builder and Co-Founder of Gorakhpur’s Got Latent.'],
];

const personJsonLd = {
  '@context': 'https://schema.org', '@type': 'ProfilePage', '@id': pageUrl + '#webpage', url: pageUrl,
  name: 'Alok Singh Photos — Official Photo Album & Social Profiles',
  description: 'Alok Singh photo album, photo gallery and public social media profile links.',
  mainEntity: { '@type': 'Person', '@id': 'https://www.gkpgotlatent.in/developer#person', name: 'Alok Singh', jobTitle: 'Full-Stack Developer & Co-Founder', url: 'https://www.gkpgotlatent.in/developer', image: photosList.map((p) => 'https://www.gkpgotlatent.in' + p.src), sameAs: socials.map((social) => social.url) },
  primaryImageOfPage: { '@type': 'ImageObject', contentUrl: 'https://www.gkpgotlatent.in/alok-singh-02.jpg', caption: 'Alok Singh official profile photo' },
};

const imageGalleryJsonLd = {
  '@context': 'https://schema.org', '@type': 'ImageGallery', '@id': pageUrl + '#gallery',
  name: 'Alok Singh Photo Gallery', description: 'Alok Singh photos, profile pictures and public photo collection.', url: pageUrl,
  image: photosList.map((photo) => ({ '@type': 'ImageObject', contentUrl: 'https://www.gkpgotlatent.in' + photo.src, name: photo.alt, caption: photo.alt })),
};

const faqJsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
};

export default function AlokSinghAlbumPage() {
  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-8 text-white sm:px-8 sm:py-14 md:px-12 lg:px-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGalleryJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-amber-300">Home</Link><span>/</span><span className="text-amber-300">Alok Singh Photo Album</span>
        </nav>

        <section className="relative overflow-hidden rounded-[2rem] border border-amber-300/20 bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-purple-950/40 p-6 shadow-2xl sm:p-10 lg:p-12">
          <div className="grid items-center gap-9 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-1.5 text-xs font-black tracking-widest text-amber-300"><Camera className="h-4 w-4" /> OFFICIAL PHOTO ALBUM</div>
              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">Alok Singh <span className="text-amber-300">Photos</span></h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-lg">Explore the Alok Singh photo album, pictures and profile gallery. This page also connects you to Alok Singh Instagram and other public social profiles.</p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-bold text-slate-200"><MapPin className="h-3.5 w-3.5 text-amber-300" /> Gorakhpur, Uttar Pradesh</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-bold text-slate-200"><UserCheck className="h-3.5 w-3.5 text-amber-300" /> Full-Stack Developer & Co-Founder</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-500/10 px-3.5 py-1.5 text-xs font-bold text-purple-200"><Camera className="h-3.5 w-3.5 text-purple-300" /> {photosList.length} Photos</span>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black hover:bg-amber-300">Instagram Profile <ExternalLink className="h-4 w-4" /></a>
                <Link href="/developer" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-black hover:bg-white/10">Developer Profile <Code2 className="h-4 w-4" /></Link>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-r from-amber-400/20 to-purple-500/20 blur-2xl" />
              <div className="relative aspect-square overflow-hidden rounded-[2rem] border-2 border-amber-300/30 bg-slate-900 shadow-2xl">
                <Image src="/developer-photo-1.jpg" alt="Alok Singh official profile photo" fill priority sizes="(max-width: 1024px) 80vw, 400px" className="object-cover object-center" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="photo-gallery">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Photo Gallery</p><h2 id="photo-gallery" className="mt-2 text-3xl font-black sm:text-4xl">Alok Singh Official Photo Gallery</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Browse Alok Singh pictures by collection and open any image in the fullscreen viewer.</p></div>
            <span className="text-sm font-bold text-slate-400">{photosList.length} photos</span>
          </div>
          <AlbumGalleryClient photos={photosList} />
        </section>

        <section className="mt-16" aria-labelledby="social-media">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Social Media</p>
          <h2 id="social-media" className="mt-2 text-3xl font-black sm:text-4xl">Alok Singh Social Media Profiles</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Find Alok Singh Instagram, X, Facebook and LinkedIn profiles from one page.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {socials.map((social) => <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-amber-400/30 hover:bg-white/[0.05]"><span className="block text-base font-bold text-white group-hover:text-amber-300">{social.name}</span><span className="mt-1 block text-sm text-slate-400">{social.handle}</span><span className="mt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-300">Open profile <ExternalLink className="h-3 w-3" /></span></a>)}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">About</p>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">About Alok Singh</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300 sm:text-base">Alok Singh is presented on this website as a Full-Stack Developer, technology builder and Co-Founder of Gorakhpur’s Got Latent (GGL). This page focuses on his public photo collection and social media profiles.</p>
          <div className="mt-7 flex flex-wrap gap-4 border-t border-white/10 pt-6 text-sm font-semibold">
            <Link href="/aboutaloksingh" className="text-amber-300 hover:underline">Alok Singh Biography ↗</Link>
            <Link href="/developer" className="text-amber-300 hover:underline">Developer Profile ↗</Link>
            <Link href="/cofounder" className="text-amber-300 hover:underline">Co-Founder Profile ↗</Link>
            <Link href="/aloksinghinstagram" className="text-amber-300 hover:underline">Alok Singh Instagram ↗</Link>
          </div>
        </section>

        <section className="mt-16" aria-labelledby="album-faq">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">FAQ</p>
          <h2 id="album-faq" className="mt-2 text-2xl font-black sm:text-3xl">Questions about Alok Singh Photos</h2>
          <div className="mt-6 space-y-3">{faqs.map(([question, answer]) => <details key={question} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><summary className="cursor-pointer text-sm font-bold text-white">{question}</summary><p className="mt-3 text-sm leading-7 text-slate-400">{answer}</p></details>)}</div>
        </section>

        <footer className="mt-20 border-t border-white/10 pt-8 text-center text-xs text-slate-400">
          <p className="font-bold text-white">Alok Singh Official Photo Album</p><p className="mt-2">Photos · Photo Gallery · Instagram · Social Media</p>
          <div className="mt-5 flex flex-wrap justify-center gap-5 font-semibold"><Link href="/" className="hover:text-amber-300">Home</Link><Link href="/developer" className="hover:text-amber-300">Developer</Link><Link href="/cofounder" className="hover:text-amber-300">Co-Founder</Link><Link href="/contact" className="hover:text-amber-300">Contact</Link></div>
          <p className="mt-6">© {new Date().getFullYear()} Gorakhpur’s Got Latent. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
