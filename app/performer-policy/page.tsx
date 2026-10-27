import Link from 'next/link';
import { ChevronLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: "Performer Application Policy | Gorakhpur's Got Latent",
  description: "Read the application fee, selection, additional charges and refund policy for GGL Episode 2 performer applications.",
};

const sections = [
  {
    title: "1. Application form and separate payment links",
    body: "Submitting the performer audition form is free. If GGL sends you a separate official payment link, review the amount and purpose shown on that page before paying. The current performer payment-link flow is ₹799. Payment does not guarantee shortlisting, selection or a performance slot."
  },
  {
    title: "2. Selection and shortlisting",
    body: "Submitting an application and paying the stated fee does not guarantee that an applicant will be shortlisted, selected, invited to audition or given a performance slot. Applications and performance clips are reviewed according to the show's requirements and the organisers' decisions. Please provide accurate contact details and genuine performance information."
  },
  {
    title: "3. Additional charges after shortlisting",
    body: "If an applicant is shortlisted or selected, additional charges may apply for a later stage or a separately offered service, such as participation, a show ticket, training, travel, accommodation or other clearly described arrangements. These are not included in the stated application fee. Any applicable amount, purpose, due date and conditions must be communicated separately before the applicant is asked to pay. Do not assume any additional payment is required unless GGL communicates it through an official channel, and ask for clarification if details are unclear."
  },
  {
    title: "4. Non-refundable application fee",
    body: "Once the stated application payment has been successfully completed and recorded, it is non-refundable because it is charged for application processing/consideration. The fee is not refundable merely because an applicant is not shortlisted, is not selected, changes their mind, does not attend a later stage, or the event date is postponed. This policy does not override any refund or remedy required by applicable law. If you are charged more than once for the same application, or money is debited but the payment/application is not recorded, contact GGL with the payment reference so the transaction can be checked and any confirmed duplicate or failed transaction can be resolved."
  },
  {
    title: "5. Event date changes or cancellation",
    body: "Episode 2 recording starts on Tuesday, 3 November 2026 at 1:00 PM IST at Mars Orbit Entertainment, Gorakhpur. Applicants should check official updates and keep their contact details active. A date change alone does not automatically make the application fee refundable, subject to applicable law and any specific announcement made by the organisers. If the event is cancelled or the policy changes, GGL will communicate relevant next steps through official channels."
  },
  {
    title: "6. Payment safety and official communication",
    body: "Pay only through the official payment flow on gkpgotlatent.in. Do not send application fees to a personal UPI ID or an individual claiming to represent GGL unless the official website explicitly instructs you to do so. Keep your payment confirmation/transaction ID. Never share your OTP, card PIN or banking password with anyone."
  },
  {
    title: "7. Performance clip and contact",
    body: "After applying, send your performance clip on the official WhatsApp link provided on the website: +91 84238 58424. Sending a clip does not itself guarantee selection. For questions about the application fee or a payment issue, contact GGL through its official website or official WhatsApp channel and include your application details and payment reference. Do not send sensitive banking credentials."
  }
];

export default function PerformerPolicyPage() {
  return (
    <main className="min-h-screen bg-[#08080b] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-amber-300 hover:text-amber-200">
          <ChevronLeft className="h-4 w-4" /> Back to homepage
        </Link>
        <header className="mt-6 rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-red-950/20 p-6 sm:p-8">
          <div className="flex items-center gap-3 text-amber-300">
            <ShieldCheck className="h-7 w-7" />
            <p className="text-xs font-black uppercase tracking-[0.18em]">Official GGL Policy</p>
          </div>
          <h1 className="mt-4 text-3xl font-black uppercase sm:text-4xl">Performer Application Policy</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">Gorakhpur's Got Latent (GGL) · Episode 2</p>
          <div className="mt-5 rounded-xl border border-amber-400/30 bg-black/40 p-4">
            <p className="font-extrabold text-amber-200">Important: The audition application form is free.</p>
            <p className="mt-1 text-sm leading-6 text-slate-200">A separate official performer payment link shows ₹799. Review the displayed amount and the communicated payment conditions before paying.</p>
          </div>
        </header>
        <div className="mt-6 space-y-4">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
              <h2 className="text-lg font-extrabold text-amber-200">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{section.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/apply/performer" className="inline-flex min-h-[50px] items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-sm font-black uppercase text-black hover:bg-amber-300">Apply as performer</Link>
          <a href="https://wa.me/918423858424" className="inline-flex min-h-[50px] items-center justify-center rounded-xl border border-emerald-400/40 px-6 py-3 text-sm font-black text-emerald-300 hover:bg-emerald-400/10">Contact on WhatsApp</a>
        </div>
      </div>
    </main>
  );
}
