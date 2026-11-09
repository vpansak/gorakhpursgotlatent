import type { Metadata } from 'next';
import Link from 'next/link';
import TalentTripClient from '@/components/TalentTripClient';

const url = 'https://www.gkpgotlatent.in/ggl_talent_trip';
const title = 'GGL Talent Trip | Travel, Create & Perform | Free Interest Registration';
const description = 'Explore GGL Talent Trip for artists and creators: travel, original music, performances and reels. Register your interest free and share your destination and budget.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title, description, url, type: 'website',
    siteName: "Gorakhpur’s Got Latent", locale: 'en_IN',
    images: [{ url: '/talent-trip-story.png', width: 916, height: 1717, alt: 'GGL Talent Trip — Travel, Create, Perform' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/talent-trip-story.png'] },
};

const questions = [
  ['What is GGL Talent Trip?', 'GGL Talent Trip is an interest-based travel initiative by Gorakhpur’s Got Latent for artists, creators and explorers to travel, create reels and share original music and performances.'],
  ['Is interest registration free?', 'Yes. The first interest registration is free. If selected and you choose to proceed, ₹999 is payable after verification. This is separate from the final trip contribution.'],
  ['Are the dates, destinations and total cost confirmed?', 'No. Destination choices, duration and budget in the form are preferences. Final dates, itinerary and trip contribution will be discussed and confirmed separately by the GGL team.'],
  ['Can I choose my budget and destination?', 'Yes. Share your comfortable budget, preferred destinations, duration and creative interests in the form. A budget preference is not a confirmed package price or booking.'],
];

export default function GGLTalentTripPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url,
      publisher: { '@type': 'Organization', name: "Gorakhpur’s Got Latent", url: 'https://www.gkpgotlatent.in' },
    }).replace(/</g, '\u003c') }} />
    <TalentTripClient />
    <section aria-labelledby="trip-questions" className="bg-[#07080e] px-4 pb-16 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h2 id="trip-questions" className="text-2xl font-black text-amber-300">About GGL Talent Trip — सवाल और जवाब</h2>
        <p className="mt-4 leading-7 text-slate-300">घूमना, अपना talent दिखाना और साथ में नया content बनाना चाहते हैं? अपनी पसंद की जगह, समय और comfortable budget बताकर free interest registration करें। Final plan और कुल खर्च अभी तय नहीं हैं।</p>
        <div className="mt-6 space-y-5">{questions.map(([question, answer]) => <div key={question}><h3 className="font-bold">{question}</h3><p className="mt-2 leading-7 text-slate-300">{answer}</p></div>)}</div>
        <div className="mt-6 flex flex-wrap gap-5 text-amber-300"><Link href="/ggl_talent_trip/policy">Trip details & policy</Link><Link href="/ggl_talent_trip/terms-and-conditions">Terms & conditions</Link><Link href="/contact">Contact GGL</Link></div>
      </div>
    </section>
  </>;
}
