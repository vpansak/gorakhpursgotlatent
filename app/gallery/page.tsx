import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Images } from 'lucide-react';

const DRIVE_FOLDER_ID = '1TKvwPKNaS5C9s5bI_EKhIGBV_1LzqWVF';
const DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1TKvwPKNaS5C9s5bI_EKhIGBV_1LzqWVF';

export const metadata: Metadata = {
  title: "GGL Photo Gallery | Gorakhpur's Got Latent",
  description: "Explore photos and memories from Gorakhpur's Got Latent.",
  alternates: { canonical: 'https://www.gkpgotlatent.in/gallery' },
  openGraph: {
    title: "GGL Photo Gallery | Gorakhpur's Got Latent",
    description: "Explore photos and memories from Gorakhpur's Got Latent.",
    url: 'https://www.gkpgotlatent.in/gallery',
    siteName: "Gorakhpur's Got Latent",
    type: 'website',
  },
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#050506] px-4 py-10 text-white sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-amber-300 hover:text-amber-200">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <header className="py-8 text-center sm:py-12">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-amber-200">
            <Images className="h-4 w-4" /> Official GGL Memories
          </div>
          <h1 className="mt-5 text-4xl font-black uppercase sm:text-6xl">
            PHOTO <span className="text-amber-400">GALLERY</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Explore Gorakhpur's Got Latent photos, behind-the-scenes moments and event memories.
          </p>
        </header>
        <div className="overflow-hidden rounded-3xl border border-amber-400/30 bg-black p-2 shadow-[0_20px_70px_rgba(0,0,0,.5)] sm:p-4">
          <iframe
            src={`https://drive.google.com/embeddedfolderview?id=${DRIVE_FOLDER_ID}#grid`}
            title="Gorakhpur's Got Latent photo gallery"
            className="h-[70vh] min-h-[520px] w-full rounded-2xl bg-black sm:h-[78vh]"
            loading="lazy"
            allow="autoplay"
          />
        </div>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={DRIVE_FOLDER_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-amber-400/40 px-5 py-3 text-sm font-black uppercase tracking-wide text-amber-200 hover:bg-amber-400/10">
            Open Original Drive Folder <ExternalLink className="h-4 w-4" />
          </a>
          <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-amber-300 to-orange-500 px-5 py-3 text-sm font-black uppercase tracking-wide text-black">
            Back to GGL Website
          </Link>
        </div>
        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          If photos do not appear, update the Drive folder sharing setting to “Anyone with the link — Viewer”.
        </p>
      </div>
    </main>
  );
}
