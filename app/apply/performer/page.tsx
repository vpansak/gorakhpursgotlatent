'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mic2, CheckCircle2, AlertCircle, Upload, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function PerformerApplyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedAppId, setSubmittedAppId] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: 'Male',
    email: '',
    whatsapp: '',
    altPhone: '',
    city: '',
    state: 'Uttar Pradesh',
    instagramUrl: '',
    youtubeUrl: '',
    socialUrl: '',
    talentCategory: 'Music / Vocal',
    primaryTalent: '',
    experienceYrs: '2',
    shortBio: '',
    performanceDesc: '',
    achievements: '',
    duration: '5 to 7 Minutes',
    preferredType: 'Solo Performance',
    stageReq: '',
    soundReq: '',
    equipmentReq: '',
    travelReq: 'Local / No travel required',
    accommodationReq: 'Not required',
    importantInfo: '',
    profilePhotoUrl: '',
    perfPhotoUrl: '',
    docUrl: '',
    optDocUrl: '',
    consentAccurate: false,
    consentContact: false,
    consentTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (file: File, targetField: string, isPrivate: boolean = false) => {
    try {
      const fd = new FormData();
      fd.append('file', file);

      const endpoint = isPrivate ? '/api/upload-private' : '/api/upload';
      const res = await fetch(endpoint, { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      const fileUrl = isPrivate ? data.docUrl : data.url;
      setFormData(prev => ({ ...prev, [targetField]: fileUrl }));
    } catch (err: any) {
      alert(`File upload failed: ${err.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.consentAccurate || !formData.consentContact || !formData.consentTerms) {
      setError('You must agree to all 3 consent declarations to proceed.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/apply/performer', {
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
        <h1 className="text-3xl font-extrabold text-white">APPLICATION SUBMITTED!</h1>
        <p className="text-slate-300">Your Performer Application for Gorakhpur’s Got Latent has been successfully recorded in our database.</p>

        <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-2">
          <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">YOUR UNIQUE APPLICATION ID</span>
          <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono tracking-wider">{submittedAppId}</div>
          <p className="text-xs text-slate-400">Save this ID to check your live application status on the tracker portal.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href={`/track?appId=${submittedAppId}`}
            className="px-6 py-3.5 rounded-xl bg-amber-500 text-black font-extrabold text-sm flex items-center justify-center gap-2"
          >
            TRACK STATUS NOW <ArrowRight className="w-4 h-4" />
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Mic2 className="w-4 h-4" /> PERFORMER REGISTRATION
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Performer Application Form</h1>
        <p className="text-xs sm:text-sm text-slate-300">Enter accurate details to be shortlisted for live audition slots.</p>
      </div>

      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>"Please upload only documents relevant to your application. Do not upload unnecessary sensitive information."</span>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-6 sm:p-10 rounded-3xl border border-amber-500/20">
        {/* SECTION 1: PERSONAL INFORMATION */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-amber-400 border-b border-amber-500/20 pb-2">
            1. Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Group / Band">Group / Band</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="aarav@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp Number *</label>
              <input
                type="tel"
                name="whatsapp"
                required
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Alternate Phone Number</label>
              <input
                type="tel"
                name="altPhone"
                value={formData.altPhone}
                onChange={handleChange}
                placeholder="+91 98112 23344"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">City *</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Gorakhpur"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">State *</label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Uttar Pradesh"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Instagram URL</label>
              <input
                type="url"
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">YouTube URL</label>
              <input
                type="url"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Other Social / Reel Link</label>
              <input
                type="url"
                name="socialUrl"
                value={formData.socialUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: TALENT INFORMATION */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-amber-400 border-b border-amber-500/20 pb-2">
            2. Talent Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Talent Category *</label>
              <select
                name="talentCategory"
                value={formData.talentCategory}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              >
                <option value="Music / Vocal">Music / Vocalist</option>
                <option value="Stand-up Comedy / Roast">Stand-up Comedy / Roast</option>
                <option value="Dance / Choreography">Dance / Choreography</option>
                <option value="Beatboxing & Rap">Beatboxing & Rap</option>
                <option value="Instrumental Fusion">Instrumental Fusion</option>
                <option value="Magic / Illusion">Magic / Illusion</option>
                <option value="Mimicry & Voice Art">Mimicry & Voice Art</option>
                <option value="Unique / Wildcard Act">Unique / Wildcard Act</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Primary Talent / Act Title *</label>
              <input
                type="text"
                name="primaryTalent"
                required
                value={formData.primaryTalent}
                onChange={handleChange}
                placeholder="e.g. Bhojpuri Beatbox Fusion"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Years of Experience</label>
              <input
                type="number"
                name="experienceYrs"
                value={formData.experienceYrs}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Preferred Performance Type</label>
              <select
                name="preferredType"
                value={formData.preferredType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none"
              >
                <option value="Solo Performance">Solo Performance</option>
                <option value="Duo Performance">Duo Performance</option>
                <option value="Group / Band Performance">Group / Band Performance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Short Bio</label>
            <textarea
              name="shortBio"
              rows={2}
              value={formData.shortBio}
              onChange={handleChange}
              placeholder="Tell us about yourself in 2-3 sentences..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Performance Description *</label>
            <textarea
              name="performanceDesc"
              rows={3}
              required
              value={formData.performanceDesc}
              onChange={handleChange}
              placeholder="Describe what you plan to perform on the GGL live stage..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 focus:outline-none text-xs"
            />
          </div>
        </div>

        {/* SECTION 3: STAGE & TECH REQUIREMENTS */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-amber-400 border-b border-amber-500/20 pb-2">
            3. Stage & Technical Requirements
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Sound / Mic Requirements</label>
              <input
                type="text"
                name="soundReq"
                value={formData.soundReq}
                onChange={handleChange}
                placeholder="e.g. 2 Cordless Mics, Lapel, AUX track"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Equipment / Prop Requirements</label>
              <input
                type="text"
                name="equipmentReq"
                value={formData.equipmentReq}
                onChange={handleChange}
                placeholder="e.g. Keyboard Stand, High Stool"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: FILE UPLOADS */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-amber-400 border-b border-amber-500/20 pb-2">
            4. Upload Relevant Media & Documents
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Profile Photo */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
              <label className="font-bold text-slate-300 block">Profile Photo (JPG / PNG)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'profilePhotoUrl')}
                className="text-slate-400 text-xs"
              />
              {formData.profilePhotoUrl && <span className="text-emerald-400 block font-semibold">✓ Photo Uploaded</span>}
            </div>

            {/* Performance Photo/Doc */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
              <label className="font-bold text-slate-300 block">Performance Photo / Demo (Optional)</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'perfPhotoUrl')}
                className="text-slate-400 text-xs"
              />
              {formData.perfPhotoUrl && <span className="text-emerald-400 block font-semibold">✓ Performance File Uploaded</span>}
            </div>

            {/* Private Document */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2 col-span-1 sm:col-span-2">
              <label className="font-bold text-slate-300 block">Govt ID / Supporting Document (Private Storage - Optional)</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'docUrl', true)}
                className="text-slate-400 text-xs"
              />
              {formData.docUrl && <span className="text-emerald-400 block font-semibold">✓ ID Document Uploaded Privately</span>}
            </div>
          </div>
        </div>

        {/* SECTION 5: CONSENT DECLARATIONS */}
        <div className="space-y-3 pt-4 border-t border-amber-500/20 text-xs text-slate-300">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="consentAccurate"
              checked={formData.consentAccurate}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 text-amber-500 accent-amber-500"
            />
            <span>I confirm that all information provided in this application is accurate and complete.</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="consentContact"
              checked={formData.consentContact}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 text-amber-500 accent-amber-500"
            />
            <span>I agree to be contacted via Email and WhatsApp regarding my audition and application status.</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="consentTerms"
              checked={formData.consentTerms}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 text-amber-500 accent-amber-500"
            />
            <span>I agree to Gorakhpur’s Got Latent show terms, safety guidelines, and privacy policy.</span>
          </label>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-base flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,215,0,0.4)] hover:scale-[1.01] transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> SUBMITTING APPLICATION...
            </>
          ) : (
            <>
              SUBMIT PERFORMER APPLICATION <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
