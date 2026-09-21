'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

export default function SponsorApplyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedAppId, setSubmittedAppId] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    designation: '',
    bizEmail: '',
    whatsapp: '',
    phone: '',
    website: '',
    instagramUrl: '',
    socialUrl: '',
    industry: 'Automotive / EV',
    location: 'Gorakhpur / Uttar Pradesh',
    description: '',
    sponsorshipType: 'Title Sponsor',
    budgetEst: '₹2,50,000 - ₹5,00,000',
    preferredPackage: 'Platinum Package',
    campaignObj: '',
    expectedAudience: '100,000+ Online & 1,200+ On-ground',
    eventPreference: 'Season 1 Live Showcase',
    message: '',
    requirements: '',
    logoUrl: '',
    brandDeckUrl: '',
    docUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (file: File, targetField: string, isPrivate: boolean = false) => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const endpoint = isPrivate ? '/api/upload-private' : '/api/upload';
      const res = await fetch(endpoint, { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      const url = isPrivate ? data.docUrl : data.url;
      setFormData(prev => ({ ...prev, [targetField]: url }));
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/apply/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setSubmittedAppId(data.appId);
    } catch (err: any) {
      setError(err.message || 'Error submitting application');
    } finally {
      setLoading(false);
    }
  };

  if (submittedAppId) {
    return (
      <div className="py-16 px-4 max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-blue-500/20 border-2 border-blue-500 text-blue-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(59,130,246,0.4)]">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">BRAND SPONSORSHIP INQUIRY SUBMITTED!</h1>
        <p className="text-slate-300">Thank you for choosing Gorakhpur’s Got Latent. Our partnership manager will reach out within 24 hours.</p>

        <div className="p-6 rounded-2xl bg-slate-900 border border-blue-500/30 space-y-2">
          <span className="text-xs text-blue-400 font-bold uppercase tracking-widest">SPONSORSHIP PROPOSAL ID</span>
          <div className="text-3xl sm:text-4xl font-black text-blue-300 font-mono tracking-wider">{submittedAppId}</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href={`/track?appId=${submittedAppId}`} className="px-6 py-3.5 rounded-xl bg-blue-500 text-white font-extrabold text-sm">
            TRACK PROPOSAL STATUS
          </Link>
          <Link href="/" className="px-6 py-3.5 rounded-xl bg-slate-800 text-white font-bold text-sm">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-4 h-4" /> BRAND SPONSORSHIP PORTAL
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Become a Sponsor</h1>
        <p className="text-xs sm:text-sm text-slate-300">Amplify your brand visibility across North India’s biggest entertainment stage.</p>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-500/20 text-red-300 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-6 sm:p-10 rounded-3xl border border-blue-500/20">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-blue-400 border-b border-blue-500/20 pb-2">1. Company & Brand Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Company / Brand Name *</label>
              <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Contact Person *</label>
              <input type="text" name="contactPerson" required value={formData.contactPerson} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Designation</label>
              <input type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Marketing Head" className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Business Email *</label>
              <input type="email" name="bizEmail" required value={formData.bizEmail} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp / Phone *</label>
              <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Website URL</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-blue-400 border-b border-blue-500/20 pb-2">2. Sponsorship Scope & Budget</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Sponsorship Type *</label>
              <select name="sponsorshipType" value={formData.sponsorshipType} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white">
                <option value="Title Sponsor">Title Sponsor</option>
                <option value="Powered By Sponsor">Powered By Sponsor</option>
                <option value="Stage / Lighting Sponsor">Stage / Lighting Partner</option>
                <option value="Beverage & Food Partner">Beverage & Food Partner</option>
                <option value="Digital Media Partner">Digital Media Partner</option>
                <option value="Gift / Prize Partner">Gift / Prize Partner</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Estimated Budget Range</label>
              <select name="budgetEst" value={formData.budgetEst} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white">
                <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                <option value="₹2,50,000 - ₹5,00,000">₹2,50,000 - ₹5,00,000</option>
                <option value="₹5,00,000+">₹5,00,000+</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-blue-400 border-b border-purple-500/20 pb-2">3. Upload Brand Logo & Deck</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
              <label className="font-bold text-slate-300 block">Brand Logo (PNG Transparent)</label>
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logoUrl')} />
              {formData.logoUrl && <span className="text-emerald-400 font-semibold block">✓ Logo Uploaded</span>}
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
              <label className="font-bold text-slate-300 block">Company Deck / Proposal PDF (Private)</label>
              <input type="file" accept=".pdf,image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'brandDeckUrl', true)} />
              {formData.brandDeckUrl && <span className="text-emerald-400 font-semibold block">✓ Brand Deck Uploaded</span>}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>SUBMIT SPONSORSHIP INQUIRY <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>
    </div>
  );
}
