export default function TermsPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 text-slate-300">
      <h1 className="text-3xl font-black text-white">Terms & Conditions</h1>
      <p className="text-xs text-slate-400">Last updated: September 2026</p>

      <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
        <h3 className="text-base font-bold text-amber-400">1. Entry & QR Ticket Policy</h3>
        <p>Entry to Gorakhpur’s Got Latent live shows is strictly allowed only with a valid digital QR ticket pass generated via our official platform. Tickets must be presented at the venue gate for scanner check-in.</p>

        <h3 className="text-base font-bold text-amber-400">2. Applicant Declarations</h3>
        <p>Performers, guests, and sponsors confirm that all information provided during registration is true and accurate. Submission does not automatically guarantee stage time or publishing unless approved by show management.</p>

        <h3 className="text-base font-bold text-amber-400">3. Media Rights & Recording</h3>
        <p>By attending or participating in the event, attendees grant Gorakhpur’s Got Latent full rights to record, photograph, and broadcast audio/video footage across digital and media platforms.</p>
      </div>
    </div>
  );
}
