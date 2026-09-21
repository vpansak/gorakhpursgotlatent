import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Gorakhpur’s Got Latent | Talent • Entertainment • Live Shows",
  description: "Where Talent Meets the Stage! Official platform for Gorakhpur's Got Latent live talent hunt, comedy roast, music performances, ticket booking, and performer registration.",
  keywords: ["Gorakhpur's Got Latent", "GGL Live", "Talent Show Gorakhpur", "Standup Comedy Gorakhpur", "Live Show Tickets", "Bhojpuri Fusion", "Purvanchal Talent"],
  openGraph: {
    title: "Gorakhpur’s Got Latent | Talent • Entertainment • Live Shows",
    description: "Where Talent Meets the Stage! Experience raw talent hunt, music fusion, comedy roasts & live audience voting.",
    url: 'https://ggllive.in',
    siteName: "Gorakhpur's Got Latent",
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: "Gorakhpur's Got Latent Logo",
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Gorakhpur’s Got Latent | Talent • Entertainment • Live Shows",
    description: "Where Talent Meets the Stage! Book tickets and apply to perform live.",
    images: ['/logo.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="bg-[#07080e] text-slate-100 antialiased selection:bg-amber-500 selection:text-black min-h-screen flex flex-col justify-between">
        <div>
          <Navbar />
          <main className="relative">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
