import type { Metadata } from 'next';
import Link from 'next/link';

const baseUrl = 'https://www.gkpgotlatent.in';

export const metadata: Metadata = {
  title: "Gorakhpur's Got Latent (GGL) – Official Show, Auditions, Tickets & Contact",
  description: "Complete official guide to Gorakhpur's Got Latent (GGL), Gorakhpur, Uttar Pradesh. Explore the live talent and entertainment show, performer auditions, tickets, episodes, sponsors, GGL Talent Trip and official social links.",
  keywords: [
    "Gorakhpur's Got Latent", "Gorakhpur Got Latent", "GGL", "GGL Gorakhpur",
    "Gorakhpur talent show", "Gorakhpur live show", "Gorakhpur entertainment",
    "Gorakhpur auditions", "Gorakhpur performer audition", "Purvanchal talent show",
    "Gorakhpur comedy show", "Gorakhpur music show", "Gorakhpur events",
    "GGL Episode 2", "Gorakhpur's Got Latent tickets", "GGL sponsor",
    "GGL Talent Trip", "Gorakhpur live entertainment platform"
  ],
  alternates: { canonical: `${baseUrl}/aboutggltowr` },
  openGraph: {
    title: "Gorakhpur's Got Latent – Official Complete Guide",
    description: "Learn about GGL, performer applications, tickets, episodes, sponsorships, the Talent Trip initiative and official links.",
    url: `${baseUrl}/aboutggltowr`,
    siteName: "Gorakhpur's Got Latent",
    type: "article",
    locale: "en_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: "Gorakhpur's Got Latent – Official Complete Guide",
    description: "Official information, auditions, tickets, social media and contact links for GGL."
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Gorakhpur's Got Latent",
  alternateName: ["GGL", "Gorakhpur Got Latent"],
  url: baseUrl,
  description: "A live talent and entertainment platform associated with Gorakhpur, Uttar Pradesh, showcasing creative performances and connecting performers with audiences.",
  sameAs: [
    "https://www.instagram.com/gkp_got_latent/",
    "https://www.youtube.com/@GkpGotLatent",
    "https://x.com/gkpgotlatent",
    "https://www.facebook.com/",
    "https://whatsapp.com/channel/0029Vb91ZX43bbUzFYcP220S"
  ]
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Gorakhpur's Got Latent",
  url: `${baseUrl}/aboutggltowr`,
  description: "The official detailed information page for Gorakhpur's Got Latent (GGL), including applications, ticketing, episodes, sponsorships and official channels.",
  isPartOf: { "@type": "WebSite", name: "Gorakhpur's Got Latent", url: baseUrl },
  about: { "@type": "Organization", name: "Gorakhpur's Got Latent", url: baseUrl }
};

const faqs = [
  ["What is Gorakhpur's Got Latent?", "Gorakhpur's Got Latent (GGL) is a live talent and entertainment platform associated with Gorakhpur, Uttar Pradesh. It aims to bring a variety of creative performances and entertaining personalities together on one stage."],
  ["How can I apply as a performer?", "Use the official performer application page at /apply/performer, submit accurate details and follow the current instructions for sharing your performance clip. Applying does not guarantee selection."],
  ["Is the audition application free?", "The performer application and audition submission process is described as free to apply. If any later fee applies to a shortlisted process, rely only on the amount and instructions officially communicated by the GGL team."],
  ["How can I buy a ticket?", "Visit the official ticket booking page at /book-ticket when sales are open. Review the amount shown on the page and use the official payment flow."],
  ["How can a business sponsor GGL?", "Businesses and brands can submit an enquiry through the official sponsor application page at /apply/sponsor. Sponsorship is subject to discussion and confirmation by the organising team."],
  ["Where can I watch GGL videos?", "Visit the official YouTube channel at youtube.com/@GkpGotLatent for published episodes and other official video content."],
  ["What is GGL Talent Trip?", "GGL Talent Trip is a separate community and travel-oriented initiative. Read the current details and registration instructions at /ggl_talent_trip before submitting information or making any payment."],
  ["Does an application guarantee a performance slot?", "No. Applying is not a guarantee of selection, audition, guest invitation, sponsorship acceptance or a stage slot. The team communicates next steps to applicants it chooses to progress."],
  ["Where can I find official updates?", "Use the official website and the social media links listed on this page. Dates, venue information, ticket availability and programme details should be treated as confirmed only when published by GGL."],
  ["How can I contact GGL?", "Use the official website contact page at /contact or the official social channels linked below. Avoid sending payments or sensitive documents to unverified accounts."]
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a }
  }))
};

const internalLinks = [
  { title: "Home", href: "/", description: "Main GGL website and current public announcements." },
  { title: "About GGL", href: "/about", description: "Introduction to the show and its format." },
  { title: "Episodes", href: "/episodes", description: "Browse published show and episode information." },
  { title: "Episode 1", href: "/ep1", description: "Episode 1 information and related content." },
  { title: "Performer Application", href: "/apply/performer", description: "Apply to be considered for a performance opportunity." },
  { title: "Guest Application", href: "/apply/guest", description: "Submit a guest or special-appearance enquiry." },
  { title: "Sponsor Application", href: "/apply/sponsor", description: "Enquire about brand and business sponsorship." },
  { title: "Join the Team", href: "/apply/join-team", description: "Express interest in contributing to GGL." },
  { title: "Event Booking / Enquiry", href: "/apply/event-booking", description: "Send an event-related booking enquiry." },
  { title: "Book a Ticket", href: "/book-ticket", description: "Open the official ticket booking flow when available." },
  { title: "GGL Talent Trip", href: "/ggl_talent_trip", description: "Read the separate Talent Trip information and registration process." },
  { title: "Performers", href: "/performers", description: "Explore the performers section if available." },
  { title: "Sponsors", href: "/sponsors", description: "Explore sponsor information." },
  { title: "Contact GGL", href: "/contact", description: "Find official contact and enquiry information." },
  { title: "Terms & Conditions", href: "/terms", description: "Review website terms." },
  { title: "Privacy Policy", href: "/privacy", description: "Review how information is handled." },
  { title: "Refund Policy", href: "/refund-policy", description: "Review published refund guidance before paying." },
];

export default function AboutGGLTowerPage() {
  return (
    <main className="min-h-screen bg-[#07080e] text-slate-200">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <header className="border-b border-amber-500/20 pb-10 sm:pb-12">
          <p className="text-xs font-black uppercase tracking-[.24em] text-amber-300">Official GGL Information Guide</p>
          <h1 className="mt-4 max-w-5xl text-4xl font-black leading-tight text-white sm:text-6xl">Gorakhpur&apos;s Got Latent (GGL)</h1>
          <p className="mt-4 max-w-4xl text-xl font-bold text-amber-300 sm:text-2xl">Gorakhpur&apos;s Talent &amp; Entertainment Platform</p>
          <p className="mt-5 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg">Welcome to the detailed official information page for Gorakhpur&apos;s Got Latent, also known as GGL. This page brings together the show overview, performer applications, ticketing, episodes, sponsorship enquiries, the GGL Talent Trip initiative, important policies and official online channels in one place.</p>
          <p className="mt-3 text-sm leading-7 text-slate-400">Official website: <a className="text-amber-300 underline" href={baseUrl}>www.gkpgotlatent.in</a> · Location association: Gorakhpur, Uttar Pradesh, India.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/apply/performer" className="rounded-xl bg-amber-400 px-5 py-3 font-black text-black hover:bg-amber-300">Apply as Performer</Link>
            <Link href="/book-ticket" className="rounded-xl border border-amber-400/40 px-5 py-3 font-bold text-amber-200 hover:bg-amber-400/10">Book a Ticket</Link>
            <Link href="/apply/sponsor" className="rounded-xl border border-white/15 px-5 py-3 font-bold text-white hover:bg-white/5">Become a Sponsor</Link>
          </div>
        </header>

        <div className="space-y-12 py-10 text-[15px] leading-8 sm:py-12 sm:text-base">
          <section>
            <h2 className="text-3xl font-black text-white">1. What is Gorakhpur&apos;s Got Latent?</h2>
            <p className="mt-4">Gorakhpur&apos;s Got Latent (GGL) is a live talent and entertainment platform connected with Gorakhpur, Uttar Pradesh. The concept brings different creative personalities and performance styles together for an audience-facing show. The aim is to make space for originality, humour, personality, music, stage confidence and unexpected talent rather than focusing on just one art form.</p>
            <p className="mt-4">The name is commonly searched in different ways, including “Gorakhpur&apos;s Got Latent”, “Gorakhpur Got Latent”, “GGL Gorakhpur” and “Gorakhpur talent show”. This page is intended to help visitors understand the project and find its official application, ticket and social links.</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">2. Talent categories and performance ideas</h2>
            <p className="mt-4">Depending on the show brief and the current episode&apos;s requirements, creative performance ideas may include:</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Comedy & Stand-up", "Original jokes, observations, roasts and comic stage acts that fit the event rules."],
                ["Singing & Music", "Singers, instrumentalists, original music and distinctive musical performances."],
                ["Dance & Movement", "Dance styles, choreography and movement-based performances."],
                ["Beatboxing & Vocal Acts", "Beatboxing, vocal rhythm, mimicry and sound-based creative acts."],
                ["Poetry & Spoken Word", "Poetry, storytelling and spoken performances with a clear point of view."],
                ["Mimicry & Character Acts", "Impressions, character comedy and performance-led storytelling."],
                ["Magic & Skill Acts", "Visual skills, tricks or demonstrations suitable for a live stage."],
                ["Unique & Experimental Talent", "Unexpected ideas and original acts that do not fit neatly into a standard category."],
                ["Creators & Special Acts", "Personality-led performances and creative formats reviewed against the current brief."]
              ].map(([title, description]) => <div key={title} className="rounded-2xl border border-amber-500/15 bg-slate-900/60 p-5"><h3 className="font-black text-amber-300">{title}</h3><p className="mt-2 text-sm text-slate-300">{description}</p></div>)}
            </div>
            <p className="mt-4 text-sm text-slate-400">Categories and selection criteria may vary by episode. Applicants should follow the latest instructions on the official application page and any direct communication from the GGL team.</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">3. How to apply as a performer</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-6">
              <li><strong>Open the official form:</strong> visit <Link className="text-amber-300 underline" href="/apply/performer">GGL Performer Application</Link>.</li>
              <li><strong>Enter accurate details:</strong> use a working phone number and the correct information requested by the form.</li>
              <li><strong>Prepare your performance clip:</strong> follow the instructions on the application page for submitting your clip or sample.</li>
              <li><strong>Wait for review:</strong> the team reviews applications and may contact selected or shortlisted applicants with next steps.</li>
              <li><strong>Follow official updates:</strong> audition details, timing, location and any applicable later-stage conditions are shared through official communication.</li>
            </ol>
            <p className="mt-4">Submitting an application does not guarantee selection or a performance slot. Do not assume a date, venue or selection status unless it has been officially communicated.</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">4. Guests, team members and event enquiries</h2>
            <p className="mt-4">GGL also provides separate enquiry routes for people who may want to participate in other ways. Choose the route that matches your purpose so your request reaches the relevant workflow.</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li><Link className="text-amber-300 underline" href="/apply/guest">Guest application</Link> — for guest, creator or special-appearance enquiries.</li>
              <li><Link className="text-amber-300 underline" href="/apply/join-team">Join the GGL team</Link> — for people interested in contributing to the event or project.</li>
              <li><Link className="text-amber-300 underline" href="/apply/event-booking">Event booking enquiry</Link> — for event-related booking or collaboration requests.</li>
              <li><Link className="text-amber-300 underline" href="/contact">Contact page</Link> — for general questions and official enquiries.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">5. Tickets and audience information</h2>
            <p className="mt-4">When audience ticket sales are open, use the official <Link className="text-amber-300 underline" href="/book-ticket">GGL ticket booking page</Link>. Check the displayed event information, ticket price, availability and terms before payment. Follow the instructions on the booking page to complete payment and retain your digital ticket or confirmation.</p>
            <p className="mt-4">Ticket prices, venue, date, availability and entry instructions can change by event. The booking page at the time of purchase is the place to check the amount payable; do not rely on old posters or unofficial messages for current pricing.</p>
            <p className="mt-4">For ticket-related questions, start with the <Link className="text-amber-300 underline" href="/contact">official contact page</Link> and review the <Link className="text-amber-300 underline" href="/refund-policy">refund policy</Link> before making a payment.</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">6. Episodes and official video content</h2>
            <p className="mt-4">GGL&apos;s online presence can include episode announcements, trailers, performance highlights and other show-related videos. Published content can be found through the official video channel and relevant website pages.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="https://www.youtube.com/@GkpGotLatent" target="_blank" rel="noreferrer" className="rounded-xl bg-red-600 px-5 py-3 font-black text-white hover:bg-red-500">Watch / Subscribe on YouTube ↗</a>
              <Link href="/episodes" className="rounded-xl border border-amber-400/40 px-5 py-3 font-bold text-amber-200 hover:bg-amber-400/10">Explore Episodes</Link>
              <Link href="/ep1" className="rounded-xl border border-white/15 px-5 py-3 font-bold text-white hover:bg-white/5">Episode 1 Information</Link>
            </div>
            <p className="mt-4 text-sm text-slate-400">Only content actually published on the official channel should be treated as an official episode or announcement. Upcoming dates and venues should be considered unconfirmed until published by GGL.</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">7. Brand sponsorship and collaboration</h2>
            <p className="mt-4">GGL can be approached by businesses, brands and organisations interested in discussing sponsorship or collaboration. A sponsorship enquiry can describe the business, contact person, goals and the type of association being considered. Potential categories may include local businesses, education providers, gyms, hotels, restaurants, service providers and other brands whose audience is relevant to the event.</p>
            <p className="mt-4">Submitting a sponsor form is an enquiry, not an automatic sponsorship approval. Packages, deliverables, placement, timelines and commercial terms should be confirmed directly by the authorised GGL team.</p>
            <Link href="/apply/sponsor" className="mt-5 inline-flex rounded-xl bg-amber-400 px-5 py-3 font-black text-black hover:bg-amber-300">Open Sponsor Application</Link>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">8. GGL Talent Trip</h2>
            <p className="mt-4">GGL Talent Trip is a separate initiative presented through the GGL website, focused on a shared travel and community experience that may include meeting people, exploring destinations, creating content and enjoying activities together. Its registration process, eligibility, contribution details, dates and arrangements are separate from audience tickets for a GGL live show.</p>
            <p className="mt-4">Read the current information carefully on the dedicated <Link className="text-amber-300 underline" href="/ggl_talent_trip">GGL Talent Trip page</Link>. Only rely on the current amount and instructions displayed on the official page or provided by the team. Do not treat a trip as confirmed until the organisers publish or directly confirm its details.</p>
            <Link href="/ggl_talent_trip" className="mt-5 inline-flex rounded-xl border border-amber-400/40 px-5 py-3 font-bold text-amber-200 hover:bg-amber-400/10">View GGL Talent Trip</Link>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">9. Official GGL links and social channels</h2>
            <p className="mt-4">Use the links below to reach GGL&apos;s website and social channels. Confirm that an account is official before sharing personal information or acting on a payment request.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["Official website", "https://www.gkpgotlatent.in/", "Main site, applications and announcements"],
                ["Instagram", "https://www.instagram.com/gkp_got_latent/", "Follow official visual updates"],
                ["YouTube", "https://www.youtube.com/@GkpGotLatent", "Episodes and official video uploads"],
                ["WhatsApp Channel", "https://whatsapp.com/channel/0029Vb91ZX43bbUzFYcP220S", "Follow channel updates"],
                ["X", "https://x.com/gkpgotlatent", "Official posts and updates"],
                ["Facebook", "https://www.facebook.com/", "Find the GGL Facebook page through the official website"]
              ].map(([title, url, description]) => <a key={title} href={url} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition hover:border-amber-400/40"><span className="font-black text-amber-300">{title} ↗</span><span className="mt-2 block break-all text-sm text-slate-300">{url}</span><span className="mt-2 block text-xs text-slate-400">{description}</span></a>)}
            </div>
            <p className="mt-4 text-sm text-slate-400">Instagram: <a className="text-amber-300 underline" href="https://www.instagram.com/gkp_got_latent/" target="_blank" rel="noreferrer">@gkp_got_latent</a> · YouTube: <a className="text-amber-300 underline" href="https://www.youtube.com/@GkpGotLatent" target="_blank" rel="noreferrer">@GkpGotLatent</a> · X: <a className="text-amber-300 underline" href="https://x.com/gkpgotlatent" target="_blank" rel="noreferrer">@gkpgotlatent</a>.</p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">10. Policies, safety and important notes</h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Read the <Link className="text-amber-300 underline" href="/terms">Terms &amp; Conditions</Link> before using relevant website services.</li>
              <li>Review the <Link className="text-amber-300 underline" href="/privacy">Privacy Policy</Link> to understand how submitted information is addressed.</li>
              <li>Review the <Link className="text-amber-300 underline" href="/refund-policy">Refund Policy</Link> before paying for a ticket or any paid service.</li>
              <li>Use only the official website and verified communication channels for applications and payments.</li>
              <li>Never share OTPs, passwords or banking credentials with anyone claiming to represent GGL.</li>
              <li>Do not send Aadhaar or other sensitive documents unless they are genuinely required by the official process and you have verified the destination.</li>
              <li>Application, ticket purchase or enquiry does not automatically guarantee selection, entry outside the purchased terms, a sponsorship deal or trip participation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">11. Official internal website directory</h2>
            <p className="mt-4">Use this directory to find key GGL pages without searching around the website.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {internalLinks.map((item) => <Link key={item.href} href={item.href} className="rounded-xl border border-white/10 bg-slate-900/50 p-4 transition hover:border-amber-400/40"><span className="font-bold text-white">{item.title} →</span><span className="mt-1 block text-sm text-slate-400">{item.description}</span><span className="mt-2 block text-xs text-amber-300">{item.href}</span></Link>)}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">12. Frequently asked questions</h2>
            <div className="mt-5 space-y-5">
              {faqs.map(([q, a]) => <div key={q} className="rounded-2xl border border-white/10 bg-slate-900/50 p-5"><h3 className="font-black text-amber-300">{q}</h3><p className="mt-2 text-slate-300">{a}</p></div>)}
            </div>
          </section>

          <section className="rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-slate-900 to-red-950/30 p-6 sm:p-9">
            <p className="text-xs font-black uppercase tracking-[.2em] text-amber-300">Stay Connected</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Discover GGL. Apply. Attend. Follow the Journey.</h2>
            <p className="mt-4 max-w-3xl text-slate-300">For accurate updates, current applications, ticket availability and official announcements, start with the GGL website and the official channels listed on this page.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/" className="rounded-xl bg-amber-400 px-5 py-3 font-black text-black hover:bg-amber-300">GGL Home</Link>
              <Link href="/apply/performer" className="rounded-xl border border-amber-400/40 px-5 py-3 font-bold text-amber-200">Apply as Performer</Link>
              <Link href="/contact" className="rounded-xl border border-white/15 px-5 py-3 font-bold text-white">Contact GGL</Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
