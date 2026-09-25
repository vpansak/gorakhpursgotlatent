'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, CheckCircle2, AlertCircle, ArrowRight, Loader2, MessageSquare, Mail } from 'lucide-react';
import { parseResponse } from '@/lib/client-fetch';

export default function GuestApplyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedAppId, setSubmittedAppId] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    stageName: '',
    dob: '',
    email: '',
    whatsapp: '',
    phone: '',
    instagramUrl: '',
    youtubeUrl: '',
    socialUrl: '',
    city: '',
    location: '',
    profession: 'Content Creator / Influencer',
    category: 'Celebrity Judge & Guest Panel',
    shortIntro: '',
    whyGgl: '',
    previousShows: '',
    socialInfo: '',
    managementName: '',
    managerContact: '',
    availability: 'Available for Nov 2026 Live Show',
    preferredDate: '',
    travelReq: '',
    accommodationReq: '',
    specialReq: '',
    importantInfo: '',
    profilePhotoUrl: '',
    pressKitUrl: '',
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
      const res = await fetch('/api/apply/guest', {
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

  if (submittedAppId) {
    return (
      <div className="py-16 px-4 max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-purple-500/20 border-2 border-purple-500 text-purple-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(168,85,247,0.4)]">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">GUEST EXPRESSION OF INTEREST SUBMITTED!</h1>
        <p className="text-slate-300">Thank you for reaching out. Our celebrity curation team will review your profile and press kit.</p>

        <div className="p-6 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-2">
          <span className="text-xs text-purple-400 font-bold uppercase tracking-widest">YOUR GUEST APPLICATION ID</span>
          <div className="text-3xl sm:text-4xl font-black text-purple-300 font-mono tracking-wider">{submittedAppId}</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href={`/track?appId=${submittedAppId}`} className="px-6 py-3.5 rounded-xl bg-purple-500 text-white font-extrabold text-sm">
            TRACK STATUS NOW
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Star className="w-4 h-4" /> CELEBRITY & GUEST PANEL
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Guest / Influencer Application</h1>
        <p className="text-xs sm:text-sm text-slate-300">Express interest in appearing as a guest judge, performer, or creator.</p>
      </div>

      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200">
        Note: Guest appearances are verified and published exclusively after formal confirmation with show directors.
      </div>

      {error && <div className="p-4 rounded-xl bg-red-500/20 text-red-300 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-6 sm:p-10 rounded-3xl border border-purple-500/20">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-purple-400 border-b border-purple-500/20 pb-2">1. Guest & Professional Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Legal Name *</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Public / Stage Name</label>
              <input type="text" name="stageName" value={formData.stageName} onChange={handleChange} placeholder="e.g. Samarth Standup" className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email *</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp / Call Number *</label>
              <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">City / Base Location *</label>
              <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Profession / Domain *</label>
              <input type="text" name="profession" required value={formData.profession} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-purple-400 border-b border-purple-500/20 pb-2">2. Social Media & Audience Reach</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Instagram Profile URL</label>
              <input type="url" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">YouTube Channel URL</label>
              <input type="url" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Why would you like to appear on Gorakhpur's Got Latent?</label>
            <textarea name="whyGgl" rows={3} value={formData.whyGgl} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-purple-400 border-b border-purple-500/20 pb-2">3. Upload Profile Photo & Press Kit</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
              <label className="font-bold text-slate-300 block">Headshot / Profile Photo</label>
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'profilePhotoUrl')} />
              {formData.profilePhotoUrl && <span className="text-emerald-400 font-semibold block">✓ Uploaded</span>}
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
              <label className="font-bold text-slate-300 block">Press Kit / Portfolio (PDF - Private)</label>
              <input type="file" accept=".pdf,image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'pressKitUrl', true)} />
              {formData.pressKitUrl && <span className="text-emerald-400 font-semibold block">✓ Press Kit Uploaded</span>}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>SUBMIT GUEST EXPRESSION OF INTEREST <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>

      {/* WHATSAPP DRAFT INQUIRY & EMAIL CONTACT CARDS */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/30 space-y-4 text-center">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-white">Guest & Creator Panel Direct Inquiry</h3>
          <p className="text-xs text-slate-300">Have questions regarding guest appearance or panel curation? Chat directly on WhatsApp.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <a
            href={`https://wa.me/918423858424?text=${encodeURIComponent("Hi Gorakhpur's Got Latent Team,\n\nI want to inquire about Guest / Judge / Creator appearance on the show.")}`}
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

          <a
            href={`mailto:help@gkpgotlatent.in?subject=${encodeURIComponent("Guest & Creator Panel Inquiry - Gorakhpur's Got Latent")}`}
            className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 hover:border-purple-400 transition-all flex items-center justify-center gap-3 text-purple-300 group shadow-md"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Official Guest Curation Email</span>
              <strong className="text-sm text-white group-hover:text-purple-300 transition-colors flex items-center gap-1">
                help@gkpgotlatent.in <ArrowRight className="w-3.5 h-3.5" />
              </strong>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
