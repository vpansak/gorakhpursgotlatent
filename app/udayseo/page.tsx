import type { Metadata } from "next";
import Link from "next/link";

const pageUrl = "https://gkpgotlatent.in/udayseo";

export const metadata: Metadata = {
  title: "Uday Pratap Singh FAQ | Topper's Classes Gorakhpur, Gold Medalist",
  description:
    "Frequently asked questions about Uday Pratap Singh of Gorakhpur, Director of Topper's Classes, Gold Medalist, state-level singing and debate achievements, education, and Gorakhpur's Got Latent.",
  keywords: [
    "Uday Pratap Singh",
    "Uday Pratap Singh Gorakhpur",
    "Uday Pratap Singh GKP",
    "Uday Pratap Singh Topper's Classes",
    "Director of Topper's Classes Gorakhpur",
    "Topper's Classes Rustampur",
    "Uday Pratap Singh gold medalist",
    "Uday Pratap Singh debate competition",
    "Uday Pratap Singh singing competition",
    "Uday Pratap Singh DDU University",
    "Uday Pratap Singh Gorakhpur's Got Latent",
    "Uday Pratap Singh biography",
    "Uday Pratap Singh questions and answers",
  ],
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Uday Pratap Singh Gorakhpur — Questions & Answers",
    description:
      "A question-and-answer profile about Uday Pratap Singh, Topper's Classes, and his reported achievements.",
    url: pageUrl,
    type: "profile",
    images: [{ url: "/uday-pratap-singh.jpg", alt: "Uday Pratap Singh" }],
  },
};

const faqs = [
  {
    q: "Who is Uday Pratap Singh?",
    a: "Uday Pratap Singh is presented in this profile as an education-sector leader from Gorakhpur, Uttar Pradesh, associated with Topper's Classes and Gorakhpur's Got Latent.",
  },
  {
    q: "Who is Uday Pratap Singh in Gorakhpur?",
    a: "Uday Pratap Singh is associated with Topper's Classes in the Rustampur–Azad Nagar area of Gorakhpur. This page collects the biographical details supplied for his profile.",
  },
  {
    q: "What is Uday Pratap Singh known for?",
    a: "His profile highlights his association with Topper's Classes, a reported Gold Medalist achievement, state-level singing and debate competitions, and work with Gorakhpur's Got Latent.",
  },
  {
    q: "Is Uday Pratap Singh the Director of Topper's Classes?",
    a: "The information provided for this profile describes Uday Pratap Singh as the Director and Founder of Topper's Classes, Gorakhpur.",
  },
  {
    q: "Where is Topper's Classes located?",
    a: "Topper's Classes is associated with the Rustampur–Azad Nagar area of Gorakhpur, Uttar Pradesh. Please confirm the latest address and class timings directly with the institute before visiting.",
  },
  {
    q: "Is Uday Pratap Singh a Gold Medalist?",
    a: "The biography supplied for this page identifies Uday Pratap Singh as a Gold Medalist. Supporting certificates or an official announcement should be added to verify the exact event and year.",
  },
  {
    q: "Did Uday Pratap Singh win a state-level singing competition?",
    a: "The supplied profile says he won a state-level singing competition in 2023 associated with Sanskrit Sansthan, Lucknow, Uttar Pradesh. The exact event details should be confirmed with an award record or organizer.",
  },
  {
    q: "Has Uday Pratap Singh won debate competitions?",
    a: "The supplied biography describes him as a two-time state-level debate competition winner. Event names, dates, and certificates can help readers independently verify this achievement.",
  },
  {
    q: "Where did Uday Pratap Singh study?",
    a: "The education information supplied for this profile mentions Deen Dayal Upadhyaya Gorakhpur University (DDU University). No specific degree is listed here.",
  },
  {
    q: "What is Uday Pratap Singh's connection with Gorakhpur's Got Latent?",
    a: "The supplied information describes Uday Pratap Singh as Managing Director of Gorakhpur's Got Latent (GGL), an entertainment and talent platform.",
  },
  {
    q: "What is Gorakhpur's Got Latent?",
    a: "Gorakhpur's Got Latent, also called GGL, is presented as a talent and entertainment platform connected with Gorakhpur. Visit the official website for current announcements and participation information.",
  },
  {
    q: "What is the official website for Gorakhpur's Got Latent?",
    a: "The website is https://gkpgotlatent.in.",
  },
  {
    q: "What is Uday Pratap Singh's Instagram account?",
    a: "The Instagram profile supplied for Uday Pratap Singh is @poetry_writer_boy_245. You can visit it at instagram.com/poetry_writer_boy_245.",
  },
  {
    q: "What is Uday Pratap Singh's biography?",
    a: "The profile describes his work with Topper's Classes and Gorakhpur's Got Latent and lists reported academic and extracurricular achievements. More first-person details, dates, and documentary evidence would make the biography more complete.",
  },
  {
    q: "Did Uday Pratap Singh face bullying in his village?",
    a: "An inspirational story requested for this profile describes a boy who faced bullying in his village and kept working toward his goals. This is a personal-story narrative supplied for the page, not independently verified reporting; it should be published as factual biography only after Uday confirms the details.",
  },
  {
    q: "What can students learn from Uday Pratap Singh's story?",
    a: "The intended message is to keep learning, build confidence, and continue working toward meaningful goals despite setbacks. Readers should treat the story as inspirational context rather than a verified record unless supporting details are provided.",
  },
  {
    q: "How can I contact Topper's Classes?",
    a: "Please use the institute's current official contact details or verified listing before calling or visiting. Contact numbers and opening hours can change, so this FAQ avoids treating older listing details as guaranteed current.",
  },
  {
    q: "Are all details on this Uday Pratap Singh FAQ independently verified?",
    a: "No. This page organizes information supplied for the profile. Claims about awards, titles, competition results, and personal experiences should be supported with certificates, official announcements, or confirmation from the person concerned.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function UdaySeoPage() {
  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="border-b border-amber-400/20 bg-gradient-to-br from-[#17120b] via-[#08090d] to-[#1b0909]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
            Biography • Frequently Asked Questions
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            Uday Pratap Singh Gorakhpur — Questions &amp; Answers
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Learn about Uday Pratap Singh (GKP), his reported achievements,
            Topper&apos;s Classes, DDU University, and his association with
            Gorakhpur&apos;s Got Latent.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/udaypratapsingh" className="rounded-full bg-amber-300 px-5 py-3 font-bold text-black hover:bg-amber-200">
              View Full Profile
            </Link>
            <a href="https://www.instagram.com/poetry_writer_boy_245/" target="_blank" rel="noreferrer" className="rounded-full border border-white/20 px-5 py-3 font-semibold hover:border-amber-300">
              Instagram Profile
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold sm:text-3xl">Popular questions about Uday Pratap Singh</h2>
          <p className="mt-3 text-zinc-400">
            Answers are based on profile information supplied for this page.
            Awards and personal-history claims should be verified with primary sources.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={faq.q} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 open:border-amber-300/40 sm:p-6">
              <summary className="flex cursor-pointer list-none items-start gap-4 font-semibold sm:text-lg">
                <span className="mt-0.5 text-sm font-bold text-amber-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">{faq.q}</span>
                <span className="text-amber-300 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="ml-9 mt-4 max-w-3xl leading-7 text-zinc-300">{faq.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-6">
          <h2 className="text-xl font-bold">About this page</h2>
          <p className="mt-3 leading-7 text-zinc-300">
            This FAQ is intended to make the profile easier to understand and discover.
            Search engines decide independently whether and how a page appears in results;
            no page can guarantee a top Google ranking or a special FAQ display.
          </p>
        </div>
        <footer className="mt-10 border-t border-white/10 pt-6 text-sm text-zinc-500">
          <Link href="/" className="hover:text-amber-300">Gorakhpur&apos;s Got Latent home</Link>
          <span className="mx-2">·</span>
          <Link href="/udaypratapsingh" className="hover:text-amber-300">Uday Pratap Singh full profile</Link>
        </footer>
      </section>
    </main>
  );
}
