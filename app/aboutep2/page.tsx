import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Gorakhpur's Got Latent Episode 2 – Official Updates, Date & Information",
  description: "Official information and updates about Gorakhpur's Got Latent Episode 2. The previously announced date has been postponed; the revised date will be announced later.",
  alternates: {
    canonical: "https://www.gkpgotlatent.in/aboutep2",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "article",
    url: "https://www.gkpgotlatent.in/aboutep2",
    siteName: "Gorakhpur's Got Latent",
    title: "Gorakhpur's Got Latent Episode 2 – Official Updates",
    description: "Official Episode 2 information. The previously announced date has been postponed; the new date will be revealed later.",
    locale: "en_IN",
  },
};

const updatedAt = "22 October 2026";

export default function AboutEpisode2Page() {
  const updateSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Gorakhpur's Got Latent – Episode 2",
    eventStatus: "https://schema.org/EventPostponed",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: "Gorakhpur's Got Latent Episode 2. The previously announced date has been postponed. The revised date will be announced later by the organisers.",
    organizer: {
      "@type": "Organization",
      name: "Gorakhpur's Got Latent",
      url: "https://www.gkpgotlatent.in/",
      email: "help.gglatent@gmail.com",
    },
    location: {
      "@type": "Place",
      name: "Gorakhpur, Uttar Pradesh, India",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Gorakhpur",
        addressRegion: "Uttar Pradesh",
        addressCountry: "IN",
      },
    },
  };

  return (
    <main className="min-h-screen bg-[#08090d] px-4 py-10 text-slate-200 sm:px-6 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(updateSchema) }} />
      <article className="mx-auto max-w-4xl">
        <header className="border-b border-amber-500/20 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-400">Official Event Information & Updates</p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-6xl">
            Gorakhpur's Got Latent Episode 2
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Episode 2 of Gorakhpur's Got Latent (GGL) is the next instalment of the Gorakhpur-based live talent and entertainment show, featuring original performances and a live audience experience.
          </p>
          <p className="mt-4 text-sm text-slate-500">Last updated: {updatedAt}</p>
        </header>

        <section className="mt-8 rounded-2xl border border-amber-400/40 bg-amber-400/5 p-6 sm:p-8" aria-labelledby="date-status">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Important Date Update</p>
          <h2 id="date-status" className="mt-3 text-2xl font-black text-white sm:text-3xl">Episode 2 Has Been Postponed</h2>
          <p className="mt-4 leading-7 text-slate-300">
            The previously announced date of 31 October 2026 has been postponed. The revised event date has not yet been announced. The organisers will publish the new date when it is confirmed.
          </p>
          <p className="mt-3 leading-7 text-slate-300">
            Please do not treat 31 October 2026 as the confirmed event date. Any future date or schedule should be considered official only after it is announced by the GGL team.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-black text-white">About Episode 2</h2>
          <p className="leading-8 text-slate-300">
            Gorakhpur's Got Latent is a talent and entertainment platform based in Gorakhpur, Uttar Pradesh. Episode 2 continues the show's focus on showcasing talent and original stage performances for a live audience.
          </p>
          <p className="leading-8 text-slate-300">
            Performance categories may include comedy, singing, music, dance, poetry, mimicry, beatboxing and other creative acts. Participation and selection are subject to the organiser's application and review process.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-black text-white">Date, Venue and Schedule</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <dt className="text-sm text-slate-400">Event date</dt>
              <dd className="mt-2 font-bold text-amber-300">Postponed — new date to be announced</dd>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <dt className="text-sm text-slate-400">Location</dt>
              <dd className="mt-2 font-bold text-white">Gorakhpur, Uttar Pradesh, India</dd>
              <p className="mt-1 text-sm text-slate-400">Specific venue and schedule should be reconfirmed in the next official announcement.</p>
            </div>
          </dl>
          <p className="leading-7 text-slate-300">
            The revised date, final schedule and any venue changes will be added to this information page after confirmation. Details are intentionally not presented as final while they remain unconfirmed.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-black text-white">Performer Applications and Audience Tickets</h2>
          <p className="leading-8 text-slate-300">
            Applicants should rely on direct communication from the GGL team for their individual application, shortlist, payment or participation status. Submitting an application does not automatically guarantee selection or a performance slot.
          </p>
          <p className="leading-8 text-slate-300">
            Anyone holding a ticket or considering a booking should check the latest event and ticket status before travelling or making plans, because the previously announced date has been postponed.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-black text-white">Official Contact</h2>
          <p className="leading-7 text-slate-300">
            For questions about Episode 2, contact the Gorakhpur's Got Latent team using the official support email below.
          </p>
          <p><a className="text-amber-300 underline underline-offset-4" href="mailto:help.gglatent@gmail.com">help.gglatent@gmail.com</a></p>
        </section>

        <footer className="mt-12 border-t border-white/10 pt-6 text-sm leading-6 text-slate-500">
          This page is an informational update for Gorakhpur's Got Latent Episode 2. Event details may change; the revised date will be published after it is confirmed by the organisers.
        </footer>
      </article>
    </main>
  );
}
