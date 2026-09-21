export default function RefundPolicyPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 text-slate-300">
      <h1 className="text-3xl font-black text-white">Ticket & Refund Policy</h1>
      <p className="text-xs text-slate-400">Last updated: September 2026</p>

      <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
        <h3 className="text-base font-bold text-amber-400">1. Non-Refundable Tickets</h3>
        <p>All ticket purchases for Gorakhpur’s Got Latent live shows are final and non-refundable, except in the event of an official show cancellation by the organizers.</p>

        <h3 className="text-base font-bold text-amber-400">2. Duplicate Payment Reconciliation</h3>
        <p>If your account is charged twice due to a network glitch or gateway error, the duplicate transaction will be automatically reconciled and refunded to your original payment method within 5-7 business days.</p>
      </div>
    </div>
  );
}
