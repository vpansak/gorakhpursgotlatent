import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Gorakhpur's Got Latent – Gorakhpur Live Talent Show, Auditions & Tickets",
  description:
    "Learn about Gorakhpur's Got Latent (GGL), a live entertainment and talent show from Gorakhpur, Uttar Pradesh featuring music, comedy, dance, poetry, beatboxing and original performances.",
  keywords: [
    "Gorakhpur's Got Latent",
    "Gorakhpur Got Latent",
    "GGL Gorakhpur",
    "Gorakhpur talent show",
    "Gorakhpur live show",
    "Gorakhpur entertainment show",
    "Gorakhpur auditions",
    "Gorakhpur events",
    "Purvanchal talent show",
    "Gorakhpur comedy show",
    "Gorakhpur dance show",
    "Gorakhpur singer auditions",
  ],
  alternates: {
    canonical: "https://www.gkpgotlatent.in/googleseo",
  },
  openGraph: {
    title: "Gorakhpur's Got Latent – Gorakhpur Live Talent & Entertainment Show",
    description:
      "Official information about Gorakhpur's Got Latent, its talent categories, auditions, audience tickets and official online presence.",
    url: "https://www.gkpgotlatent.in/googleseo",
    type: "article",
    siteName: "Gorakhpur's Got Latent",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Gorakhpur's Got Latent – Gorakhpur Live Talent Show, Auditions & Tickets",
  description:
    "Official public information about Gorakhpur's Got Latent, a live entertainment and talent show in Gorakhpur, Uttar Pradesh.",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.gkpgotlatent.in/googleseo",
  },
  publisher: {
    "@type": "Organization",
    name: "Gorakhpur's Got Latent",
    url: "https://www.gkpgotlatent.in/",
  },
  about: [
    { "@type": "Thing", name: "Gorakhpur's Got Latent" },
    { "@type": "Thing", name: "Talent show" },
    { "@type": "Thing", name: "Live entertainment" },
  ],
  inLanguage: "en-IN",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Gorakhpur's Got Latent",
  url: "https://www.gkpgotlatent.in/",
  sameAs: ["https://www.youtube.com/@GkpGotLatent"],
};

export default function GoogleSeoPage() {
  return (
    <main className="min-h-screen bg-[#07080e] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 border-b border-amber-500/20 pb-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            Official Information
          </p>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-6xl">
            Gorakhpur&apos;s Got Latent
          </h1>
          <p className="mt-4 text-2xl font-bold text-amber-300">
            Gorakhpur&apos;s Live Talent &amp; Entertainment Show
          </p>
          <p className="mt-5 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg">
            Gorakhpur&apos;s Got Latent (GGL) is a live entertainment and talent
            platform based in Gorakhpur, Uttar Pradesh. The show brings different
            forms of original performance together on one stage, including singing,
            dance, comedy, poetry, beatboxing, mimicry, unusual acts and other
            creative performances.
          </p>
        </header>

        <div className="space-y-12 text-[15px] leading-8 sm:text-base">
          <section>
            <h2 className="text-3xl font-black text-white">What is Gorakhpur&apos;s Got Latent?</h2>
            <p className="mt-4">
              Gorakhpur&apos;s Got Latent is a live stage entertainment concept created
              around local talent, audience participation, spontaneous conversations
              and unscripted entertainment. Its public website describes GGL as
              Gorakhpur&apos;s live entertainment show where bold, funny, original and
              unexpected performers can share their work with an audience.
            </p>
            <p className="mt-4">
              The concept is designed for performers as well as audiences. Performers
              can present their talent, while audience members can attend the live
              experience and follow official show updates online. The format can
              include musicians, singers, dancers, stand-up comedians, beatboxers,
              poets, mimics, magicians and other original acts.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Gorakhpur&apos;s Got Latent in Gorakhpur, Uttar Pradesh</h2>
            <p className="mt-4">
              Gorakhpur&apos;s Got Latent is associated with Gorakhpur, Uttar Pradesh,
              and its public website presents the show as a local entertainment stage
              connected with the wider Purvanchal audience. The project focuses on
              discovering and showcasing people with different kinds of talent rather
              than limiting participation to one performance category.
            </p>
            <p className="mt-4">
              For people searching for a Gorakhpur talent show, Gorakhpur live event,
              Gorakhpur entertainment show, Gorakhpur auditions or a stage for original
              performances, the official website is the central place to check public
              information, applications, ticketing and show updates.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Talent Categories and Performances</h2>
            <p className="mt-4">
              GGL is intentionally broad in its approach to talent. Publicly described
              performance areas include singing, music, dance, stand-up comedy,
              beatboxing, poetry, mimicry and other unusual or original acts.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Singing & Music", "Singers, musicians and original musical performers can present their work."],
                ["Dance", "Dance performances across different styles can be part of the live talent format."],
                ["Comedy", "Stand-up, comic acts and spontaneous humour are part of the entertainment format."],
                ["Poetry & Spoken Performance", "Poetry, spoken-word and personality-led stage performances can fit the format."],
                ["Beatboxing & Vocal Acts", "Vocal rhythm, beatboxing and other sound-based creative performances can be showcased."],
                ["Unique & Unexpected Acts", "GGL also welcomes the idea of original acts that do not fit into a single conventional category."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-amber-500/15 bg-slate-900/60 p-5">
                  <h3 className="font-bold text-amber-300">{title}</h3>
                  <p className="mt-2 text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">How the GGL Performer Process Works</h2>
            <p className="mt-4">
              The public website describes a simple application workflow for people
              who want to get involved as performers. Applicants choose a category,
              provide their details and work, submit a performance clip or portfolio
              for review, and shortlisted applicants can be contacted for auditions
              and stage opportunities.
            </p>
            <ol className="mt-6 list-decimal space-y-3 pl-6">
              <li><strong>Choose a category:</strong> Select the type of performance or role that best describes your work.</li>
              <li><strong>Submit your details:</strong> Provide the requested profile and performance information through the official application.</li>
              <li><strong>Share your work:</strong> A performance clip, portfolio or relevant work sample may be requested for review.</li>
              <li><strong>Review and audition:</strong> The team reviews submissions and contacts shortlisted applicants about the next stage.</li>
              <li><strong>Stage opportunity:</strong> Selected performers may receive information about the relevant audition or live-stage arrangements.</li>
            </ol>
            <p className="mt-4 text-sm text-slate-400">
              Registration or application does not by itself guarantee selection, a ticket,
              or a stage slot. Final arrangements depend on the official communication
              provided by the GGL team.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">GGL Episode 2</h2>
            <p className="mt-4">
              The official GGL website currently features Episode 2 auditions and
              public ticket information. Visitors should use the official website for
              the latest publicly released application, ticket and event information,
              because dates, venue details and other event arrangements can change.
            </p>
            <p className="mt-4">
              Episode 2 is part of the ongoing GGL entertainment series, continuing
              the platform&apos;s focus on live talent, comedy, audience interaction and
              original performances.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Gorakhpur&apos;s Got Latent Tickets</h2>
            <p className="mt-4">
              Official audience tickets are available through the GGL website when
              ticket sales are open. The public website currently lists the official
              GGL entry ticket at <strong>₹149 per person</strong> and describes online
              booking with an instant digital ticket and QR code for entry verification.
            </p>
            <p className="mt-4">
              Audience members should book through the official website rather than
              relying on unofficial pages or messages. After successful payment
              verification, the website can generate the digital entry ticket associated
              with the booking.
            </p>
            <div className="mt-6">
              <Link
                href="/book-ticket"
                className="inline-flex rounded-xl bg-amber-400 px-6 py-3 font-black text-black transition hover:bg-amber-300"
              >
                Book GGL Ticket
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Digital Ticket and QR Verification</h2>
            <p className="mt-4">
              GGL uses a digital ticket workflow for online audience bookings. The
              public ticket information describes a unique ticket ID and QR code that
              can be used for entry verification at the event.
            </p>
            <p className="mt-4">
              Ticket holders should keep their official digital ticket available when
              arriving at the venue. Entry verification is handled through the official
              GGL ticket-checking process.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Why People Search for GGL Online</h2>
            <p className="mt-4">
              Searches related to Gorakhpur&apos;s Got Latent may include terms such as
              “Gorakhpur Got Latent”, “GGL Gorakhpur”, “Gorakhpur talent show”,
              “Gorakhpur live show”, “Gorakhpur auditions”, “Gorakhpur comedy show”,
              “Gorakhpur dance audition”, “Gorakhpur singer audition” and
              “Gorakhpur events”. This page provides one public reference point for
              understanding what the show is and where to find its official information.
            </p>
            <p className="mt-4">
              Search visibility does not depend on repeating the same keyword many
              times. Useful information, clear page structure, descriptive titles,
              accessible content, internal links and a technically crawlable website
              help search engines understand a page. The content on this page is
              therefore written for visitors first rather than as a list of repeated
              search phrases.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Official GGL Website and Online Presence</h2>
            <p className="mt-4">
              The official website is the primary public source for GGL information,
              including applications, audience ticketing and show-related updates.
              GGL also maintains an official YouTube channel for published show
              episodes, audition clips and other official video content.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <a
                href="https://www.gkpgotlatent.in/"
                className="rounded-2xl border border-amber-500/20 bg-slate-900/60 p-5 hover:border-amber-400/50"
                target="_blank"
                rel="noreferrer"
              >
                <span className="text-sm font-bold text-amber-400">OFFICIAL WEBSITE</span>
                <span className="mt-2 block font-bold text-white">gkpgotlatent.in</span>
              </a>
              <a
                href="https://www.youtube.com/@GkpGotLatent"
                className="rounded-2xl border border-red-500/20 bg-slate-900/60 p-5 hover:border-red-400/50"
                target="_blank"
                rel="noreferrer"
              >
                <span className="text-sm font-bold text-red-400">OFFICIAL YOUTUBE</span>
                <span className="mt-2 block font-bold text-white">@GkpGotLatent</span>
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-bold text-amber-300">What is Gorakhpur&apos;s Got Latent?</h3>
                <p className="mt-2">It is a live entertainment and talent-show platform associated with Gorakhpur, Uttar Pradesh, featuring different types of original performances.</p>
              </div>
              <div>
                <h3 className="font-bold text-amber-300">Where can I find official GGL information?</h3>
                <p className="mt-2">The official website at gkpgotlatent.in is the central public source for GGL applications, tickets and show information.</p>
              </div>
              <div>
                <h3 className="font-bold text-amber-300">Can I apply as a performer?</h3>
                <p className="mt-2">Yes. When performer applications are open, applicants can use the official performer application workflow and submit their details and work for review.</p>
              </div>
              <div>
                <h3 className="font-bold text-amber-300">How much is the GGL audience ticket?</h3>
                <p className="mt-2">The official website currently lists the GGL entry ticket at ₹149 per person. Check the booking page for the current availability and terms before payment.</p>
              </div>
              <div>
                <h3 className="font-bold text-amber-300">Does applying guarantee selection?</h3>
                <p className="mt-2">No. Registration is an application step and does not automatically guarantee selection, an audition slot or a stage appearance.</p>
              </div>
              <div>
                <h3 className="font-bold text-amber-300">Where can I watch official GGL videos?</h3>
                <p className="mt-2">Official episodes, audition clips and other official video content are published through the GGL YouTube channel.</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-red-950/20 p-6 sm:p-8">
            <h2 className="text-2xl font-black text-white">Visit the Official GGL Website</h2>
            <p className="mt-3">
              For the latest public information about Gorakhpur&apos;s Got Latent,
              performer applications, audience tickets and official updates, visit
              the official website.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-xl bg-amber-400 px-5 py-3 font-black text-black hover:bg-amber-300"
              >
                Visit GGL Home
              </Link>
              <Link
                href="/apply/performer"
                className="rounded-xl border border-amber-400/40 px-5 py-3 font-bold text-amber-300 hover:bg-amber-400/10"
              >
                Performer Application
              </Link>
              <Link
                href="/book-ticket"
                className="rounded-xl border border-amber-400/40 px-5 py-3 font-bold text-amber-300 hover:bg-amber-400/10"
              >
                Book Ticket
              </Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
