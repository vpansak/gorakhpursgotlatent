'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, CheckCircle2, ArrowRight, Loader2, Sparkles, MessageSquare, Phone, Mail } from 'lucide-react';
import { parseResponse } from '@/lib/client-fetch';

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
    website: '',
    industry: '',
    message: '',
    logoUrl: '',
    brandDeckUrl: '',
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
      const data = await parseResponse(res);
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

      const data = await parseResponse(res);
      setSubmittedAppId(data.appId);
    } catch (err: any) {
      setError(err.message || 'Error submitting application');
    } finally {
      setLoading(false);
    }
  };

  // Pre-drafted WhatsApp inquiry message
  const whatsappDraftText = encodeURIComponent(
    `Hi Gorakhpur's Got Latent Team,\n\nI want to inquire about Brand Sponsorship opportunities for our company.\n\nCompany Name:\nContact Person:\nPhone/Mobile:`
  );
  const whatsappUrl = `https://wa.me/918423858424?text=${whatsappDraftText}`;

  if (submittedAppId) {
    return (
      <div className="py-16 px-4 max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-blue-500/20 border-2 border-blue-500 text-blue-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(59,130,246,0.4)]">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">BRAND DETAILS SUBMITTED SUCCESSFULLY!</h1>
        <p className="text-slate-300">Thank you for your interest in Gorakhpur’s Got Latent. Our team will review your brand details and contact you directly with customized sponsorship options & budget details.</p>

        <div className="p-6 rounded-2xl bg-slate-900 border border-blue-500/30 space-y-2">
          <span className="text-xs text-blue-400 font-bold uppercase tracking-widest">SPONSORSHIP INQUIRY ID</span>
          <div className="text-3xl sm:text-4xl font-black text-blue-300 font-mono tracking-wider">{submittedAppId}</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href={`/track?appId=${submittedAppId}`} className="px-6 py-3.5 rounded-xl bg-blue-500 text-white font-extrabold text-sm">
            TRACK INQUIRY STATUS
          </Link>
          <Link href="/" className="px-6 py-3.5 rounded-xl bg-slate-800 text-white font-bold text-sm">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-4 h-4" /> BRAND SPONSORSHIP PORTAL
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Apply Brands for Sponsor</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          Partner your brand with Purvanchal’s biggest live entertainment show. Share your brand details below to receive custom sponsorship proposals.
        </p>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-500/20 text-red-300 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 glass-panel p-6 sm:p-10 rounded-3xl border border-blue-500/20">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-blue-400 border-b border-blue-500/20 pb-2">Brand & Contact Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Company / Brand Name *</label>
              <input
                type="text"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Acme Motors / ABC Beverages"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Contact Person Name *</label>
              <input
                type="text"
                name="contactPerson"
                required
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Marketing Head / Founder"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Industry / Category</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. FMCG, Automobile, Education"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Business Email *</label>
              <input
                type="email"
                name="bizEmail"
                required
                value={formData.bizEmail}
                onChange={handleChange}
                placeholder="name@company.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp / Mobile Number *</label>
              <input
                type="tel"
                name="whatsapp"
                required
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Website or Social Media Link</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Proposal Message / Brand Requirements</label>
            <textarea
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us a little bit about your brand or specific placement goals..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 outline-none text-xs"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-blue-400 border-b border-blue-500/20 pb-1">Upload Brand Logo or Presentation Deck (Optional)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
              <label className="font-bold text-slate-300 block">Brand Logo (PNG / JPG)</label>
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logoUrl')} className="text-slate-400 text-xs" />
              {formData.logoUrl && <span className="text-emerald-400 font-semibold block">✓ Logo Uploaded</span>}
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
              <label className="font-bold text-slate-300 block">Company Deck / PDF (Optional)</label>
              <input type="file" accept=".pdf,image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'brandDeckUrl', true)} className="text-slate-400 text-xs" />
              {formData.brandDeckUrl && <span className="text-emerald-400 font-semibold block">✓ Document Uploaded</span>}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>SUBMIT BRAND DETAILS <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>

      {/* WHATSAPP DRAFT INQUIRY & EMAIL CONTACT CARDS */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 space-y-4 text-center">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-white">Prefer Direct Inquiry on WhatsApp or Email?</h3>
          <p className="text-xs text-slate-300">Click below to send a pre-drafted sponsorship inquiry directly to our brand relations manager.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          {/* WhatsApp Direct Draft Link */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400 transition-all flex items-center justify-center gap-3 text-emerald-300 group shadow-md"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">WhatsApp Direct Inquiry</span>
              <strong className="text-sm text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                Chat on WhatsApp (+91 84238 58424) <ArrowRight className="w-3.5 h-3.5" />
              </strong>
            </div>
          </a>

          {/* Email Support Link */}
          <a
            href="mailto:help@gkpgotlatent.in?subject=Brand%20Sponsorship%20Inquiry%20-%20Gorakhpur%27s%20Got%20Latent"
            className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:border-blue-400 transition-all flex items-center justify-center gap-3 text-blue-300 group shadow-md"
          >
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Official Business Email</span>
              <strong className="text-sm text-white group-hover:text-blue-300 transition-colors flex items-center gap-1">
                help@gkpgotlatent.in <ArrowRight className="w-3.5 h-3.5" />
              </strong>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
