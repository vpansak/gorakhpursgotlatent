import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, Barlow_Condensed, Anton, Outfit, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const barlow = Barlow_Condensed({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
});

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#07080e',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://gkpgotlatent.in'),
  title: "Gorakhpur’s Got Latent | Kuch Bhi Ho Sakta Hai",
  description: "Kuch Bhi Ho Sakta Hai! Official platform for Gorakhpur's Got Latent live talent hunt, comedy roast, music performances, ticket booking, and performer registration.",
  keywords: ["Gorakhpur's Got Latent", "GGL Live", "Talent Show Gorakhpur", "Standup Comedy Gorakhpur", "Live Show Tickets", "Bhojpuri Fusion", "Purvanchal Talent"],
  openGraph: {
    title: "Gorakhpur’s Got Latent | Kuch Bhi Ho Sakta Hai",
    description: "Kuch Bhi Ho Sakta Hai! Experience raw talent hunt, music fusion, comedy roasts & live audience voting.",
    url: 'https://gkpgotlatent.in',
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
    title: "Gorakhpur’s Got Latent | Kuch Bhi Ho Sakta Hai",
    description: "Kuch Bhi Ho Sakta Hai! Book tickets and apply to perform live.",
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
    <html lang="en" className={`${bebas.variable} ${barlow.variable} ${anton.variable} ${outfit.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#07080e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GGL App" />
        <link rel="apple-touch-icon" href="/app-logo.png" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('gesturestart', function(e) { e.preventDefault(); });
              document.addEventListener('gesturechange', function(e) { e.preventDefault(); });
              document.addEventListener('gestureend', function(e) { e.preventDefault(); });
            `,
          }}
        />
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
