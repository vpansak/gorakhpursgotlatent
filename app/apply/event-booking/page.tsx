'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

export default function EventBookingApplyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedAppId, setSubmittedAppId] = useState('');

  const [formData, setFormData] = useState({
    orgName: '',
    contactPerson: '',
    email: '',
    whatsapp: '',
    phone: '',
    city: '',
    venue: '',
    eventDate: '',
    expectedAudience: '1000+',
    eventType: 'College Fest Showcase',
    eventDesc: '',
    perfDuration: '60 - 90 Minutes',
    budgetRange: '₹1,00,000 - ₹2,50,000',
    travelReq: 'Organizer to arrange local transport & flight',
    accommodationReq: '4-Star Hotel Rooms required',
    techReq: '',
    stageReq: '',
    addInfo: '',
    docUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload-private', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setFormData(prev => ({ ...prev, docUrl: data.docUrl }));
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/apply/event-booking', {
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
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">EVENT BOOKING REQUEST SUBMITTED!</h1>
        <p className="text-slate-300">Thank you for inviting Gorakhpur’s Got Latent. Our events curation team will get back to you with availability.</p>

        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-2">
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest">EVENT BOOKING APPLICATION ID</span>
          <div className="text-3xl sm:text-4xl font-black text-emerald-300 font-mono tracking-wider">{submittedAppId}</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href={`/track?appId=${submittedAppId}`} className="px-6 py-3.5 rounded-xl bg-emerald-500 text-black font-extrabold text-sm">
            TRACK REQUEST STATUS
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <CalendarCheck className="w-4 h-4" /> SHOW & EVENT COLLABORATION
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Book GGL Show / Performers</h1>
        <p className="text-xs sm:text-sm text-slate-300">Host Gorakhpur’s Got Latent live team at your college fest, corporate event, or private venue.</p>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-500/20 text-red-300 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-6 sm:p-10 rounded-3xl border border-emerald-500/20">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-emerald-400 border-b border-emerald-500/20 pb-2">1. Organization & Host Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Organization / Event Name *</label>
              <input type="text" name="orgName" required value={formData.orgName} onChange={handleChange} placeholder="e.g. MMMUT Youth Fest 2026" className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Contact Person *</label>
              <input type="text" name="contactPerson" required value={formData.contactPerson} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email *</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp / Phone *</label>
              <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">City / Location *</label>
              <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Event Date *</label>
              <input type="date" name="eventDate" required value={formData.eventDate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-emerald-400 border-b border-emerald-500/20 pb-2">2. Event Scope & Technical Specs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Event Type</label>
              <select name="eventType" value={formData.eventType} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white">
                <option value="College Fest Showcase">College Fest Showcase</option>
                <option value="Corporate Annual Meet">Corporate Annual Meet</option>
                <option value="Private Celebration / Wedding">Private Celebration / Wedding</option>
                <option value="Public Auditorium Show">Public Auditorium Show</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Expected Audience Size</label>
              <input type="text" name="expectedAudience" value={formData.expectedAudience} onChange={handleChange} placeholder="e.g. 2,000 Students" className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Event Description & Requirements</label>
            <textarea name="eventDesc" rows={3} value={formData.eventDesc} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-emerald-400 border-b border-emerald-500/20 pb-2">3. RFP / Invitation Document Upload</h3>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2 text-xs">
            <label className="font-bold text-slate-300 block">Invitation Letter / RFP Document (PDF - Private)</label>
            <input type="file" accept=".pdf,image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
            {formData.docUrl && <span className="text-emerald-400 font-semibold block">✓ Document Uploaded</span>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>SUBMIT EVENT BOOKING REQUEST <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>
    </div>
  );
}
