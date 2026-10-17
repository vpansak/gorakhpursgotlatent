import type { Metadata } from 'next';
import Link from 'next/link';

const baseUrl = 'https://www.gkpgotlatent.in';
const tripUrl = `${baseUrl}/ggl_talent_trip`;

export const metadata: Metadata = {
  title: 'GGL Talent Trip 2026 – Apply, Dates, Fee & Full Details',
  description: 'Official GGL Talent Trip information: tentative December 2026 travel plan, creative activities, destinations, free interest registration, ₹999 selection-stage entry fee, trip contribution, eligibility and application links.',
  keywords: [
    'GGL Talent Trip', 'Gorakhpur GGL Talent Trip', 'GGL trip 2026',
    'GGL Talent Trip registration', 'GGL trip apply', 'Gorakhpur creator trip',
    'artist community trip India', 'GGL travel and content creation trip',
    'GGL Talent Trip fee', 'GGL Talent Trip December 2026'
  ],
  alternates: { canonical: `${baseUrl}/aboutggltowr` },
  openGraph: {
    title: 'GGL Talent Trip 2026 – Official Information & Application',
    description: 'Explore the tentative travel plan, creative activities, selection process, fees and official GGL Talent Trip application.',
    url: `${baseUrl}/aboutggltowr`,
    siteName: "Gorakhpur's Got Latent",
    type: 'article',
    locale: 'en_IN'
  },
  twitter: {
    card: 'summary',
    title: 'GGL Talent Trip 2026 – Official Guide',
    description: 'Official GGL Talent Trip details, application process, tentative dates, destinations and fees.'
  }
};

const tripSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'GGL Talent Trip 2026 – Official Information',
  url: `${baseUrl}/aboutggltowr`,
  description: 'Official information about GGL Talent Trip, a proposed travel and creative collaboration experience for selected participants.',
  isPartOf: { '@type': 'WebSite', name: "Gorakhpur's Got Latent", url: baseUrl },
  about: { '@type': 'Thing', name: 'GGL Talent Trip' },
  mainEntity: { '@type': 'Event', name: 'GGL Talent Trip 2026', eventStatus: 'https://schema.org/EventScheduled', startDate: '2026-12-20', endDate: '2026-12-31', location: { '@type': 'Place', name: 'Destination to be confirmed', address: { '@type': 'PostalAddress', addressLocality: 'Gorakhpur', addressRegion: 'Uttar Pradesh', addressCountry: 'IN' } }, organizer: { '@type': 'Organization', name: "Gorakhpur's Got Latent", url: baseUrl }, description: 'Tentatively planned for late December 2026 for approximately seven days. Exact dates and destination are not confirmed and will be announced by the organisers.' }
};

const faqs = [
  ['What is GGL Talent Trip?', 'GGL Talent Trip is a proposed shared travel and creative community experience where selected participants can meet, collaborate, create content and take part in activities such as jamming, reels, music mashups and a short film.'],
  ['When is the trip planned?', 'The trip is tentatively planned for late December 2026 for approximately seven days. Exact dates, itinerary and destination are not confirmed until officially announced by the organisers.'],
  ['Where will the trip go?', 'Possible destination preferences include Nepal, Pokhara, Kathmandu, Varanasi, Ayodhya, Rajasthan, Goa, Nainital, Rishikesh, Manali, Himachal Pradesh and Shillong, Meghalaya. These are options being explored, not a confirmed itinerary.'],
  ['Is the first registration free?', 'Yes. The initial interest registration is free. It does not itself confirm a place on the trip.'],
  ['When is the ₹999 fee payable?', 'The ₹999 entry fee is requested only after verification and selection by the GGL team. Do not pay it just to submit the initial interest form. Follow only the instructions shared through official GGL communication.'],
  ['What is the total trip cost?', 'The final trip contribution has not been fixed. It will be discussed with the interested/selected group after planning, including the duration, destination and arrangements. Any sample budget in the interest form is a preference, not a confirmed price or invoice.'],
  ['Who can apply?', 'People interested in travel, creativity, music, dance, reels, filmmaking, photography, comedy or collaborating with other participants can submit an interest form. The team will review details and communicate any selection or eligibility requirements.'],
  ['Does submitting the form guarantee selection?', 'No. The form records interest only. The team may verify details and contact applicants it selects. A confirmed place requires official confirmation and completion of the applicable next steps.'],
  ['How do I apply?', 'Open the official GGL Talent Trip page, complete the interest form, review and accept the trip Terms & Conditions and Trip Policy, and submit. The flow then opens WhatsApp with the registration details; press Send in WhatsApp to message the team.'],
  ['Are the dates and destination final?', 'No. Late December 2026 and approximately seven days are tentative planning details. Destination, itinerary, transport, accommodation and final dates must be confirmed by the organisers.']
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a }
  }))
};

export default function AboutGGLTowerPage() {
  return (
    <main className="min-h-screen bg-[#07080e] text-slate-200">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tripSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <header className="border-b border-amber-500/20 pb-10 sm:pb-12">
          <p className="text-xs font-black uppercase tracking-[.24em] text-amber-300">Official Trip Information & Application Guide</p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-6xl">GGL Talent Trip 2026</h1>
          <p className="mt-4 max-w-3xl text-xl font-bold text-amber-300 sm:text-2xl">Travel together. Create together. Make memories together.</p>
          <p className="mt-5 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg">GGL Talent Trip is a proposed travel and creative collaboration experience for people who want to meet other creative minds, explore places, make content and take part in shared activities. This page is dedicated only to the trip: its purpose, tentative plan, application process, fee information, policies and official application links.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tentative timing</p><p className="mt-1 text-lg font-black text-white">Late December 2026</p></div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Proposed duration</p><p className="mt-1 text-lg font-black text-white">About 7 days</p></div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Initial interest form</p><p className="mt-1 text-lg font-black text-emerald-300">FREE</p></div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-400">Important: timing, duration, destination and itinerary are tentative. Do not book travel or accommodation based on this proposed plan. Wait for official confirmation.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/ggl_talent_trip#interest-form" className="rounded-xl bg-amber-400 px-6 py-3 font-black text-black hover:bg-amber-300">Apply / I’m Interested →</Link>
            <Link href="/ggl_talent_trip/terms-and-conditions" className="rounded-xl border border-amber-400/40 px-5 py-3 font-bold text-amber-200 hover:bg-amber-400/10">Trip Terms & Conditions</Link>
            <Link href="/ggl_talent_trip/policy" className="rounded-xl border border-white/15 px-5 py-3 font-bold text-white hover:bg-white/5">Read Trip Policy</Link>
          </div>
        </header>

        <div className="space-y-12 py-10 text-[15px] leading-8 sm:py-12 sm:text-base">
          <section>
            <h2 className="text-3xl font-black text-white">1. What is GGL Talent Trip?</h2>
            <p className="mt-4">GGL Talent Trip is intended to bring people together for a shared travel experience that combines exploration, friendship, creativity and collaboration. It is designed around the idea that a trip can be more than sightseeing: participants may meet new people, share skills, create memories and work on creative content as a group.</p>
            <p className="mt-4">The trip is a separate initiative from GGL show auditions, audience tickets or performer applications. Submitting interest for the trip does not apply someone for a stage performance, and applying for the show does not automatically register someone for the trip.</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">2. What might happen during the trip?</h2>
            <p className="mt-4">Subject to the final itinerary, group decisions, permissions and available resources, planned creative activities may include:</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ['Group travel & exploration', 'Explore the selected destination together and experience local places and culture.'],
                ['Jamming sessions', 'Spend time sharing music, ideas, skills and spontaneous creative sessions.'],
                ['Reels & social content', 'Collaborate on short-form videos, behind-the-scenes moments and travel memories.'],
                ['Music mashups', 'Explore group music ideas and creative mashups where practical and permitted.'],
                ['Short-film creation', 'Work together on a short film or creative video project, subject to the final plan.'],
                ['Community & collaboration', 'Meet other participants, exchange ideas and build connections through shared experiences.']
              ].map(([title, description]) => <div key={title} className="rounded-2xl border border-amber-500/15 bg-slate-900/60 p-5"><h3 className="font-black text-amber-300">{title}</h3><p className="mt-2 text-sm text-slate-300">{description}</p></div>)}
            </div>
            <p className="mt-4 text-sm text-slate-400">These are proposed activity ideas, not guaranteed deliverables. The final programme depends on the confirmed destination, time, budget, group preferences and organiser arrangements.</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">3. Tentative timing and duration</h2>
            <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
              <p><strong className="text-amber-300">Planning window:</strong> late December 2026</p>
              <p><strong className="text-amber-300">Proposed duration:</strong> approximately 7 days</p>
              <p><strong className="text-amber-300">Confirmed schedule:</strong> not announced yet</p>
            </div>
            <p className="mt-4">The dates above are tentative planning information only. Exact departure and return dates, reporting point, daily itinerary and any changes will be shared by the organisers after planning. Please do not purchase non-refundable travel tickets or make personal bookings until you receive official confirmation.</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">4. Destinations being considered</h2>
            <p className="mt-4">The interest form lets applicants select preferred places so the team can understand the group's interests. Possible options include:</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Nepal','Pokhara','Kathmandu','Varanasi','Ayodhya','Rajasthan','Goa','Nainital','Rishikesh','Manali','Himachal Pradesh','Shillong, Meghalaya','Other destinations'].map(place => <span key={place} className="rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-sm text-slate-200">{place}</span>)}
            </div>
            <p className="mt-4">These are destination preferences under consideration, not a confirmed route or promise that every listed place will be visited. The final destination may depend on the group's preferences, travel feasibility, permissions, weather, safety, available budget and arrangements. Nepal or any other international destination would also require participants to meet applicable travel-document and entry requirements.</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">5. Registration and fee — read carefully</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-5"><h3 className="font-black text-emerald-300">Step 1 — Initial interest registration: FREE</h3><p className="mt-2 text-sm text-slate-300">Submitting the initial form records your interest. There is no initial registration payment required to express interest.</p></div>
              <div className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-5"><h3 className="font-black text-amber-300">Step 2 — Verification and selection</h3><p className="mt-2 text-sm text-slate-300">The team may review the details submitted and contact applicants it wishes to progress. Sending the form does not guarantee selection or a place.</p></div>
              <div className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-5"><h3 className="font-black text-amber-300">Step 3 — ₹999 entry fee, only after selection</h3><p className="mt-2 text-sm text-slate-300">The ₹999 entry fee is applicable only after verification/selection as communicated by the GGL team. Do not send this amount simply to submit the initial interest form. Verify payment instructions through official communication before paying.</p></div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"><h3 className="font-black text-white">Step 4 — Final trip contribution</h3><p className="mt-2 text-sm text-slate-300">The total trip contribution is separate from the ₹999 entry fee and has not been finalised. It will be discussed after group interest and trip arrangements are assessed. The final amount may depend on duration, destination, transport, accommodation, food and planned activities. Any budget selected in the form is only your comfort preference, not a confirmed price.</p></div>
            </div>
            <p className="mt-4 text-sm text-slate-400">No fixed total cost, package, inclusions or refund promise should be assumed until the organisers publish the final terms in official communication and the trip policy.</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">6. Who should submit interest?</h2>
            <p className="mt-4">The trip may suit people who enjoy travel, community activities, creative collaboration or content creation. The form asks about your basic details, city, WhatsApp number, Instagram ID, interests, preferred trip duration, comfortable budget and destination preferences.</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Share accurate contact information so the team can reach you.</li>
              <li>Describe your interests honestly; creative experience is useful but do not claim skills you do not have.</li>
              <li>Select the duration, budget range and destinations that genuinely suit you.</li>
              <li>Read the trip Terms & Conditions and Trip Policy before submitting.</li>
              <li>Keep an eye on the WhatsApp number you provide for official follow-up.</li>
            </ul>
            <p className="mt-4">Eligibility, participant count, any age-related requirements and final selection rules will be subject to the published trip terms and direct organiser confirmation.</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">7. How to apply — step by step</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-6">
              <li>Open the official <Link className="text-amber-300 underline" href="/ggl_talent_trip#interest-form">GGL Talent Trip interest form</Link>.</li>
              <li>Enter your name, age, WhatsApp number, city and Instagram ID, plus your creative interests.</li>
              <li>Choose your preferred duration, comfortable budget and one or more destinations.</li>
              <li>Read and accept the <Link className="text-amber-300 underline" href="/ggl_talent_trip/terms-and-conditions">Trip Terms & Conditions</Link> and <Link className="text-amber-300 underline" href="/ggl_talent_trip/policy">Trip Policy</Link>.</li>
              <li>Submit the form. The website records the interest and then opens WhatsApp with a prefilled message and registration ID.</li>
              <li>In WhatsApp, check the details and press <strong>Send</strong> to send the message to the team. Opening WhatsApp alone does not send the message.</li>
              <li>Wait for the team to review and contact you if your application is selected for the next step.</li>
            </ol>
            <Link href="/ggl_talent_trip#interest-form" className="mt-6 inline-flex rounded-xl bg-amber-400 px-6 py-3 font-black text-black hover:bg-amber-300">Open Interest Registration →</Link>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">8. Important policies and safety notes</h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Initial interest registration is free; the ₹999 entry fee is only due after verification/selection and official communication.</li>
              <li>The total trip contribution, destination, schedule and itinerary are not final until announced.</li>
              <li>Do not pay an unknown person or an unverified account. Confirm any payment request through official GGL communication.</li>
              <li>Never share OTPs, passwords or banking credentials.</li>
              <li>Do not make non-refundable travel or accommodation bookings before official trip confirmation.</li>
              <li>Read the <Link className="text-amber-300 underline" href="/ggl_talent_trip/terms-and-conditions">Terms & Conditions</Link> and <Link className="text-amber-300 underline" href="/ggl_talent_trip/policy">Trip Policy</Link> for the applicable terms before proceeding.</li>
              <li>Travel documents, permissions, safety arrangements and any special requirements depend on the final destination and itinerary.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">9. Frequently asked questions</h2>
            <div className="mt-5 space-y-4">
              {faqs.map(([q, a]) => <div key={q} className="rounded-2xl border border-white/10 bg-slate-900/50 p-5"><h3 className="font-black text-amber-300">{q}</h3><p className="mt-2 text-slate-300">{a}</p></div>)}
            </div>
          </section>

          <section className="rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-slate-900 to-red-950/30 p-6 sm:p-9">
            <p className="text-xs font-black uppercase tracking-[.2em] text-amber-300">Ready to express interest?</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Your trip begins with an application.</h2>
            <p className="mt-4 max-w-3xl text-slate-300">Fill in the official interest form, choose the options that fit you and read the trip terms. Initial interest registration is free; selection and final arrangements are subject to confirmation.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/ggl_talent_trip#interest-form" className="rounded-xl bg-amber-400 px-6 py-3 font-black text-black hover:bg-amber-300">Apply for GGL Talent Trip →</Link>
              <Link href="/ggl_talent_trip/terms-and-conditions" className="rounded-xl border border-amber-400/40 px-5 py-3 font-bold text-amber-200">Terms & Conditions</Link>
              <Link href="/ggl_talent_trip/policy" className="rounded-xl border border-white/15 px-5 py-3 font-bold text-white">Trip Policy</Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
