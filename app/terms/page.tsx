import Link from 'next/link';
import {
  ShieldCheck, Ticket, FileText, Video, AlertTriangle, Scale,
  HelpCircle, Lock, CheckCircle2, ArrowLeft, Building, Users, Clock
} from 'lucide-react';

export const metadata = {
  title: "Terms & Conditions | Gorakhpur's Got Latent",
  description: "Official legal terms, entry policies, performer declarations, media recording rights, and event governance rules for Gorakhpur's Got Latent.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Homepage
        </Link>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-widest mx-auto">
          <ShieldCheck className="w-4 h-4 text-amber-400" /> Official Legal Governance & Terms of Service
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Terms & <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent">Conditions</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Please read these Terms & Conditions carefully before booking tickets, submitting performer audition applications, or participating in any live shows organized by <strong className="text-amber-300">Gorakhpur’s Got Latent (GGL)</strong>.
        </p>

        <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 font-mono pt-2 border-b border-slate-800/80 pb-6 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Last Updated: October 2026
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-amber-400" /> Entity: GGL Executive Directorate
          </span>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">

        {/* 1. Entry & QR Ticket Policy */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b border-amber-500/20 pb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block">Clause 1.0</span>
              <h2 className="text-lg sm:text-xl font-black text-white">Entry & Digital QR Ticket Policy</h2>
            </div>
          </div>

          <div className="space-y-3 pl-1 text-slate-300">
            <p>
              1.1 <strong className="text-white">Digital Pass Authentication:</strong> Entry to all Gorakhpur’s Got Latent live shows and recording sessions is strictly restricted to ticket holders possessing a valid, tamper-proof digital QR ticket pass generated exclusively via our official website (<code className="text-amber-300">gkpgotlatent.in</code>).
            </p>
            <p>
              1.2 <strong className="text-white">Gate Verification & Scanner Check-in:</strong> Attendees must present their official digital QR code pass (on smartphone display or printed copy) at the venue entry gates for high-resolution laser scanner check-in. Duplicate, altered, forged, or previously scanned QR passes will be immediately flagged and rejected by security systems.
            </p>
            <p>
              1.3 <strong className="text-white">Government Photo ID Proof:</strong> Gate security personnel reserve the right to verify the attendee’s identity against government-issued photo identification (Aadhaar Card, Voter ID, Driving License, or Passport). The primary ticket holder’s name must match the identity proof presented upon request.
            </p>
            <p>
              1.4 <strong className="text-white">Gate Timing & Late Arrivals:</strong> Doors open strictly 60 minutes prior to scheduled show start time. To preserve the audio-visual quality of live recordings, late entry after doors close is prohibited without explicit security clearance.
            </p>
            <p>
              1.5 <strong className="text-white">Re-Entry Policy:</strong> Re-entry into the auditorium or live stage recording zone after exiting is not permitted once the scanner check-in is complete.
            </p>
          </div>
        </section>

        {/* 2. Applicant Declarations & Performer Rules */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b border-amber-500/20 pb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block">Clause 2.0</span>
              <h2 className="text-lg sm:text-xl font-black text-white">Performer Audition & Applicant Declarations</h2>
            </div>
          </div>

          <div className="space-y-3 pl-1 text-slate-300">
            <p>
              2.1 <strong className="text-white">Accuracy of Information:</strong> Performers, guest panelists, stand-up comedians, musicians, dancers, beatboxers, and sponsors explicitly confirm that all details provided during online registration (Full Name, Age, Contact Numbers, Instagram ID, City, Act Description) are true, accurate, and up-to-date.
            </p>
            <p>
              2.2 <strong className="text-white">Age Qualification (Strictly 18+):</strong> All stage performers must be at least 18 years of age on or before the date of performance. Minors are strictly prohibited from submitting solo stage performance auditions unless accompanied by verified legal parental consent documentation.
            </p>
            <p>
              2.3 <strong className="text-white">Free Audition Submission Discretion:</strong> Submitting an audition registration form online is completely free and does not automatically guarantee stage time, live episode appearance, or digital publication. Show directors and panel judges maintain sole, absolute discretion over performer selection, running order, and act approval.
            </p>
            <p>
              2.4 <strong className="text-white">Content Guidelines & Prohibited Content:</strong> Acts containing hate speech, direct religious disrespect, explicit defamatory statements, obscenity violating Indian Penal Laws, political hate campaigns, or hazardous physical stage props (fire, pyrotechnics, sharp weapons, chemical substances) are strictly prohibited. Non-compliance results in instant disqualification and stage eviction.
            </p>
            <p>
              2.5 <strong className="text-white">Performance Video Submission:</strong> Performers agree to submit authentic performance clips via our official WhatsApp audition helpline (+91 8423858424) or designated upload links for evaluation by the production team.
            </p>
            <p>
              2.6 <strong className="text-white">Payment & Performance Eligibility:</strong> Where a performer fee applies, the performer must pay the complete applicable fee and have the payment verified before taking the stage. If GGL expressly permits a partial deposit, the minimum deposit is ₹100; any deposit or partial payment alone does not confirm final participation. Outstanding balances, non-refundability of partial payments, and applicable exceptions are explained in Clause 5.0 below.
            </p>
          </div>
        </section>

        {/* 3. Media Rights & Broadcast Authorization */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b border-amber-500/20 pb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block">Clause 3.0</span>
              <h2 className="text-lg sm:text-xl font-black text-white">Intellectual Property, Media Rights & Broadcast Authorization</h2>
            </div>
          </div>

          <div className="space-y-3 pl-1 text-slate-300">
            <p>
              3.1 <strong className="text-white">Irrevocable Media Rights Grant:</strong> By entering the event premises or participating as a performer, guest, judge, or audience member, attendees grant Gorakhpur’s Got Latent, its parent media entity, and distribution partners an absolute, perpetual, worldwide, royalty-free, irrevocable right to record, film, photograph, edit, stream, and broadcast audio-visual footage.
            </p>
            <p>
              3.2 <strong className="text-white">Multi-Platform Publishing Rights:</strong> Recorded footage may be monetized, edited, formatted, and published across YouTube, Instagram Reels, OTT platforms, Television Networks, digital streaming channels, and promotional marketing collateral without requiring additional prior consent or financial compensation.
            </p>
            <p>
              3.3 <strong className="text-white">Waiver of Royalty Claims:</strong> Performers and attendees expressly waive any legal claims, copyright demands, performance royalties, or publicity rights against Gorakhpur’s Got Latent management regarding recorded material captured during live show proceedings.
            </p>
            <p>
              3.4 <strong className="text-white">Unauthorized Audience Recording Prohibition:</strong> Professional video cameras, DSLR equipment, audio recorders, and unauthorized commercial live streaming by audience members inside the auditorium are strictly banned during show recording sessions.
            </p>
          </div>
        </section>

        {/* 4. Code of Conduct & Venue Discipline */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b border-amber-500/20 pb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block">Clause 4.0</span>
              <h2 className="text-lg sm:text-xl font-black text-white">Venue Discipline, Safety & Code of Conduct</h2>
            </div>
          </div>

          <div className="space-y-3 pl-1 text-slate-300">
            <p>
              4.1 <strong className="text-white">Zero Tolerance Policy:</strong> Alcohol consumption, illicit drug possession, smoking inside auditorium zones, carrying weapons, verbal abuse, harassment, rowdy behavior, or deliberate disruption of live recording sessions will result in immediate security eviction without refund.
            </p>
            <p>
              4.2 <strong className="text-white">Audience Participation & Judge Interaction:</strong> Attendees agree to maintain decorum during live judging rounds and follow stage manager instructions regarding applause, silence cues, and audience voting rules.
            </p>
            <p>
              4.3 <strong className="text-white">Law Enforcement Escalation:</strong> Severe misconduct, property damage, or physical altercations will be escalated immediately to local Uttar Pradesh Police authorities for legal prosecution under applicable statutory laws.
            </p>
          </div>
        </section>

        {/* 5. Cancellation, Rescheduling & Refund Guidelines */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b border-amber-500/20 pb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block">Clause 5.0</span>
              <h2 className="text-lg sm:text-xl font-black text-white">Performer Payment, Ticketing, Cancellation & Refund Policy</h2>
            </div>
          </div>

          <div className="space-y-3 pl-1 text-slate-300">
            <p>
              5.1 <strong className="text-white">Minimum Deposit & Part-Payment:</strong> Where GGL permits a performer to pay in installments, the minimum initial deposit is ₹100 and must be paid only through a payment link generated by GGL’s official website. The deposit is adjusted against the total applicable performer fee. Paying ₹100 or any other partial amount does not mean the full fee has been paid, does not complete registration, and does not authorize the performer to perform.
            </p>
            <p>
              5.2 <strong className="text-white">Full Amount Must Be Paid Before Performing:</strong> The performer must pay the complete, exact total amount shown for their registration using the official, website-generated GGL payment link. If the amount paid is even ₹1 less than the total fee, payment will be treated as incomplete. The performer will not be permitted to perform until the outstanding balance is paid and verified. A deposit or partial payment does not guarantee stage participation. Do not rely on a manually altered amount or an unofficial payment link.
            </p>
            <p>
              5.3 <strong className="text-white">Partial Payments & Non-Refundable Deposit:</strong> Once a performer has successfully paid a deposit or any part of the performer fee, that amount is generally non-refundable if the performer fails to pay the remaining balance, withdraws, changes their plans, cannot attend, or is not permitted to perform because the full fee has not been paid. For example, if the total fee is ₹799 and the performer pays ₹100 but does not pay the remaining ₹699, the performer will not be permitted to perform and the ₹100 deposit will generally not be refunded. The same applies if the amount paid is even ₹1 short of the total fee. This clause remains subject to applicable law and any refund rights that cannot lawfully be excluded.
            </p>
            <p>
              5.4 <strong className="text-white">Event Rescheduling or Cancellation by GGL:</strong> If an event is rescheduled, GGL will communicate the revised arrangements and explain whether the payment will be carried forward. If GGL cancels an event and does not offer a replacement date or equivalent arrangement, eligible payments will be handled in accordance with applicable law and the circumstances of the cancellation.
            </p>
            <p>
              5.5 <strong className="text-white">Payment Errors or Duplicate Debits:</strong> If money is debited but the payment/registration is not confirmed, or if a duplicate debit occurs, contact GGL with the transaction/UTR ID, payment date and time, amount, and screenshot. After verification with the payment provider, GGL will take appropriate steps to resolve the error and arrange any refund due. Bank and payment-provider timelines may vary.
            </p>
            <p>
              5.6 <strong className="text-white">Applicable Law:</strong> All payments, cancellations, and refunds are subject to applicable Indian law. Nothing in this policy is intended to exclude or restrict any refund or remedy that must be provided under applicable law.
            </p>
          </div>
        </section>

        {/* 6. Guest Panelists, Judges & Sponsor Engagements */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b border-amber-500/20 pb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block">Clause 6.0</span>
              <h2 className="text-lg sm:text-xl font-black text-white">Guest Panelists, Judges & Brand Sponsors</h2>
            </div>
          </div>

          <div className="space-y-3 pl-1 text-slate-300">
            <p>
              6.1 <strong className="text-white">Guest & Panelist Alignment:</strong> Special celebrity guests, judge panelists, and influencers agree to uphold professional artistic integrity, provide constructive scoring, and respect show formatting during live episodes.
            </p>
            <p>
              6.2 <strong className="text-white">Brand Sponsorship & Logo Usage:</strong> Brand sponsors and corporate partners must comply with approved brand deck specifications. Logo placement, stage banners, backdrop integration, and social media mentions will follow official sponsorship tier agreements.
            </p>
          </div>
        </section>

        {/* 7. Health, Liability & Personal Belongings */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b border-amber-500/20 pb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block">Clause 7.0</span>
              <h2 className="text-lg sm:text-xl font-black text-white">Personal Property, Health & Liability Waiver</h2>
            </div>
          </div>

          <div className="space-y-3 pl-1 text-slate-300">
            <p>
              7.1 <strong className="text-white">Personal Belongings Responsibility:</strong> Attendees and performers are solely responsible for their personal items, electronic gadgets, musical instruments, and valuables. Management assumes zero liability for lost, stolen, or damaged belongings inside or outside the venue premises.
            </p>
            <p>
              7.2 <strong className="text-white">Health & Medical Emergencies:</strong> Attendees confirm they are physically fit to attend live events with strobe lighting and high-volume sound amplification. Basic first-aid support is available at the venue; however, management is not liable for pre-existing health complications.
            </p>
          </div>
        </section>

        {/* 8. Digital Security, Privacy & Governing Law */}
        <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b border-amber-500/20 pb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block">Clause 8.0</span>
              <h2 className="text-lg sm:text-xl font-black text-white">Data Privacy, Digital Security & Governing Law</h2>
            </div>
          </div>

          <div className="space-y-3 pl-1 text-slate-300">
            <p>
              8.1 <strong className="text-white">Data Security & Storage:</strong> User information, ticket records, and audition submissions are stored securely in encrypted databases (Neon PostgreSQL / Neon S3 storage) compliant with Information Technology Act, 2000 rules.
            </p>
            <p>
              8.2 <strong className="text-white">Governing Jurisdiction:</strong> These terms shall be governed by and construed in accordance with the statutory laws of India. Any legal disputes, claims, or arbitration proceedings arising from event participation shall fall strictly under the exclusive jurisdiction of the competent courts in <strong className="text-amber-300">Gorakhpur, Uttar Pradesh, India</strong>.
            </p>
          </div>
        </section>

        {/* 9. Contact Support Desk */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white">Have Questions Regarding Terms & Governance?</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            Our legal compliance team and official helpdesk are available to assist attendees, performers, and corporate sponsors with any queries.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-mono pt-2">
            <a href="mailto:help.gglatent@gmail.com" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors">
              📧 help.gglatent@gmail.com
            </a>
            <a href="https://api.whatsapp.com/send?phone=918423858424" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors">
              💬 WhatsApp Helpline (+91 8423858424)
            </a>
          </div>

          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-xs tracking-wider transition-all shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" /> ACCEPT & RETURN TO HOMEPAGE
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
