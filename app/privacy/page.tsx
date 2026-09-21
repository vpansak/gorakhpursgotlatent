export default function PrivacyPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 text-slate-300">
      <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
      <p className="text-xs text-slate-400">Last updated: September 2026</p>

      <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
        <h3 className="text-base font-bold text-amber-400">1. Private Document Storage</h3>
        <p>Sensitive documents uploaded during application (such as Government ID proofs, RFP documents, press kits) are stored in secure private server directories. They are never exposed publicly and are accessible strictly to authorized event directors.</p>

        <h3 className="text-base font-bold text-amber-400">2. Payment Security</h3>
        <p>All online ticket payments are processed via Razorpay's PCI-DSS compliant payment gateway. We do not store raw credit card numbers, CVV, or UPI PINs on our servers.</p>
      </div>
    </div>
  );
}
