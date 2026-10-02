'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mic2, CheckCircle2, ArrowRight, Loader2, Sparkles, MessageSquare, Mail, AlertCircle, CheckSquare } from 'lucide-react';
import { parseResponse } from '@/lib/client-fetch';

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.155.57 4.178 1.564 5.927l-1.664 6.085 6.25-1.639c1.693.923 3.633 1.455 5.706 1.455 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

const WHATSAPP_NUMBER = '918423858424';
const DISPLAY_PHONE = '+91 8423858424';

// Strictly 18+ options only (no ages below 18)
const AGE_OPTIONS = [
  '18 Years', '19 Years', '20 Years', '21 Years', '22 Years', '23 Years',
  '24 Years', '25 Years', '26 Years', '27 Years', '28 Years', '29 Years',
  '30 Years', '31 Years', '32 Years', '33 Years', '34 Years', '35 Years', '36+ Years'
];

export default function PerformerApplyClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState('');
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    age: '18 Years',
    instagramUrl: '',
    performanceCategory: 'Singing',
    performanceTitle: '',
    city: '',
    performanceDescription: '',
    sendClipConfirmed: false,
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

  const constructWhatsAppMessage = (data: typeof formData, appId: string) => {
    return (
`🎤 *GORAKHPUR'S GOT LATENT - PERFORMER AUDITION APPLICATION* 🎤

🆔 *Application ID:* ${appId}
👤 *Name:* ${data.fullName.trim()}
📱 *Mobile Number:* ${data.mobile.trim()}
📧 *Email:* ${data.email.trim()}
🎂 *Age:* ${data.age}
📸 *Instagram URL:* ${data.instagramUrl.trim() || 'N/A'}
🎭 *Performance Category:* ${data.performanceCategory}
🎵 *Act Title:* ${data.performanceTitle.trim() || 'Audition Act'}
📍 *Address / City:* ${data.city.trim() || 'Gorakhpur'}
📝 *About Performance:* ${data.performanceDescription.trim() || 'N/A'}
✅ *WhatsApp Clip Confirmation:* Confirmed to send performance clip on WhatsApp!

------------------------------------
✨ _Saved in Admin Portal | Team contact you soon..._`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Please enter your Full Name.');
      return;
    }
    if (!formData.mobile.trim()) {
      setError('Please enter your Mobile Number.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid Email address.');
      return;
    }
    if (!formData.instagramUrl.trim()) {
      setError('Please enter your Instagram Profile URL or handle (Instagram ID compulsory hai).');
      return;
    }
    if (!formData.sendClipConfirmed) {
      setError('Please check the box confirming you will send your performance video clip on WhatsApp.');
      return;
    }

    setLoading(true);
    let assignedAppId = '';

    try {
      const res = await fetch('/api/apply/performer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await parseResponse(res);
      if (data.success && data.appId) {
        assignedAppId = data.appId;
        setSubmittedAppId(data.appId);
      }
    } catch (err: any) {
      console.warn('DB save notice:', err);
      assignedAppId = `GGL-PER-${Date.now().toString().slice(-6)}`;
      setSubmittedAppId(assignedAppId);
    } finally {
      setLoading(false);
    }

    const messageText = constructWhatsAppMessage(formData, assignedAppId);
    const waUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(messageText)}`;

    setGeneratedWhatsAppUrl(waUrl);
    setSubmitted(true);

    // Auto-redirect to WhatsApp
    setTimeout(() => {
      window.location.href = waUrl;
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="py-16 px-4 max-w-2xl mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-green-400 p-[2px] flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.5)]">
            <div className="w-full h-full bg-[#07080e] rounded-full flex items-center justify-center text-emerald-400">
              <WhatsAppIcon className="w-12 h-12 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> AUDITION SAVED IN ADMIN PORTAL
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Team contact you soon...
          </h1>

          <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
            Your audition application details have been saved successfully. Opening WhatsApp so you can send your performance clip to <strong className="text-emerald-300">{DISPLAY_PHONE}</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 max-w-md mx-auto space-y-1">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-widest block">PERFORMER APPLICATION ID</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-wider">{submittedAppId}</div>
          </div>
        </div>

        <div className="space-y-3 max-w-md mx-auto pt-2">
          <a
            href={generatedWhatsAppUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-400 text-black font-extrabold text-base flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all transform hover:scale-[1.02]"
          >
            <WhatsAppIcon className="w-6 h-6 fill-current" />
            CLICK HERE TO SEND PERFORMANCE CLIP ON WHATSAPP
          </a>
        </div>

        <div className="flex justify-center pt-2">
          <Link href="/" className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
          <Mic2 className="w-4 h-4 text-emerald-400" /> 🎉 EPISODE 2 PERFORMER REGISTRATION IS LIVE
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Performer Application Form</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Performer registrations for Episode 2 auditions are now <strong className="text-emerald-400 font-bold">LIVE</strong>! Fill in your details below to register. Audition form submit kerna FREE hai. Select hone ke baad fee details communicate kiya jayega.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 shadow-2xl">
        <div className="space-y-4">
          {/* 1. Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Full Name (अपना नाम) *</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Rahul Kumar"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none text-xs sm:text-sm"
            />
          </div>

          {/* 2. Mobile & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Number (मोबाइल नंबर) *</label>
              <input
                type="tel"
                name="mobile"
                required
                value={formData.mobile}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address (ईमेल) *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="rahul@example.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* 3. Age Dropdown (Strictly 18+) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Age / उम्र Dropdown (Strictly 18+ Only) *</label>
            <select
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:border-amber-400 outline-none text-xs sm:text-sm cursor-pointer"
            >
              {AGE_OPTIONS.map((ageOpt) => (
                <option key={ageOpt} value={ageOpt}>
                  {ageOpt}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Instagram Profile URL / Handle */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Instagram Profile Link / Handle (इन्स्टाग्राम ID / लिंक) *</label>
            <input
              type="text"
              name="instagramUrl"
              required
              value={formData.instagramUrl}
              onChange={handleChange}
              placeholder="e.g. https://www.instagram.com/your_handle or @your_handle"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none text-xs sm:text-sm"
            />
          </div>

          {/* 5. What will you perform dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">What Will You Perform? (क्या परफॉर्म करेंगे?) *</label>
              <select
                name="performanceCategory"
                value={formData.performanceCategory}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:border-amber-400 outline-none text-xs sm:text-sm cursor-pointer"
              >
                <option value="Singing">Singing (गायन)</option>
                <option value="Dancing">Dancing (नृत्य)</option>
                <option value="Standup Comedy">Standup Comedy (हास्य)</option>
                <option value="Poetry & Shayari">Poetry & Shayari (कविता)</option>
                <option value="Mimicry">Mimicry / Acting</option>
                <option value="Beatboxing & Rap">Beatboxing & Rap</option>
                <option value="Magic & Illusion">Magic & Illusion (जादू)</option>
                <option value="Other Talent">Other Unique Talent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Act Title / Song Name</label>
              <input
                type="text"
                name="performanceTitle"
                value={formData.performanceTitle}
                onChange={handleChange}
                placeholder="e.g. Classical Fusion / Comedy Set"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* 6. Address / Base Location */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Address / City (पता / शहर)</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Civil Lines, Gorakhpur / Deoria"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none text-xs sm:text-sm"
            />
          </div>

          {/* 7. About yourself / performance details */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">About Your Performance / Yourself (थोड़ा सा अपने बारे में)</label>
            <textarea
              name="performanceDescription"
              rows={3}
              value={formData.performanceDescription}
              onChange={handleChange}
              placeholder="Describe your act or experience briefly..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* MANDATORY WHATSAPP CLIP CONFIRMATION CHECKBOX */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
          <label className="flex items-start gap-3 cursor-pointer text-xs text-amber-200">
            <input
              type="checkbox"
              name="sendClipConfirmed"
              checked={formData.sendClipConfirmed}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700 cursor-pointer shrink-0"
            />
            <span className="font-bold">
              Send your performance clip on WhatsApp ({DISPLAY_PHONE}) *
            </span>
          </label>
          <p className="text-[11px] text-slate-400 pl-7">
            Submitting this form will save your audition details and automatically redirect to WhatsApp so you can send your performance video clip.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-400 text-black font-extrabold text-base flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all transform hover:scale-[1.01] cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <WhatsAppIcon className="w-6 h-6 fill-current" />
              SUBMIT & SEND PERFORMANCE CLIP ON WHATSAPP
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
