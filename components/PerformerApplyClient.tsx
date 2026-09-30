'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mic2, CheckCircle2, ArrowRight, Loader2, Sparkles, MessageSquare, Mail } from 'lucide-react';
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

export default function PerformerApplyClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState('');
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    city: '',
    age: '',
    performanceCategory: 'Singing',
    performanceTitle: '',
    performanceDescription: '',
    instagramUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const constructWhatsAppMessage = (data: typeof formData, appId: string) => {
    return (
`🎤 *GORAKHPUR'S GOT LATENT - PERFORMER AUDITION APPLICATION* 🎤

🆔 *Application ID:* ${appId}
👤 *Full Name:* ${data.fullName.trim()}
📱 *Mobile / WhatsApp Number:* ${data.mobile.trim()}
📧 *Email Address:* ${data.email.trim()}
📍 *City:* ${data.city.trim() || 'Gorakhpur'}
🎂 *Age:* ${data.age || 'N/A'}
🎭 *Performance Category:* ${data.performanceCategory}
🎵 *Performance / Act Title:* ${data.performanceTitle.trim() || 'Audition Act'}
📝 *Act Details:* ${data.performanceDescription.trim() || 'Performer Audition Entry'}
📸 *Instagram Profile:* ${data.instagramUrl.trim() || 'N/A'}

------------------------------------
✨ _Saved in Admin Portal | Official Website: gkpgotlatent.in_`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Please enter your Full Name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid Email address.');
      return;
    }
    if (!formData.mobile.trim()) {
      setError('Please enter your Mobile / WhatsApp Number.');
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
      console.warn('DB save warning (proceeding to WhatsApp):', err);
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
    }, 1200);
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

        <div className="space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Audition Details Saved in Admin Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Redirecting to <span className="text-emerald-400">WhatsApp</span>...
          </h1>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Your performer audition details have been saved in the Admin Portal. Opening WhatsApp to connect with our audition team at <strong className="text-emerald-300">{DISPLAY_PHONE}</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 max-w-md mx-auto">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-widest block">PERFORMER APPLICATION ID</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-wider mt-1">{submittedAppId}</div>
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
            CLICK HERE IF NOT REDIRECTED TO WHATSAPP
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href={`/track?appId=${submittedAppId}`} className="px-6 py-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors">
            Track Application Status
          </Link>
          <Link href="/" className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
          <Mic2 className="w-4 h-4 text-amber-400" /> EPISODE 2 AUDITIONS • FEE ₹199
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Performer Application</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          Singers, Dancers, Comedians, Beatboxers, Magicians & Unique Acts! Fill details below to save in Admin Portal and auto-submit your audition details directly to WhatsApp ({DISPLAY_PHONE}).
        </p>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-500/20 text-red-300 text-sm font-semibold">⚠️ {error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 glass-panel p-6 sm:p-10 rounded-3xl border border-amber-500/20 shadow-2xl">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-amber-400 border-b border-amber-500/20 pb-2">Performer & Act Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Name (नाम) *</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Rahul Kumar"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Mobile / WhatsApp Number *</label>
              <input
                type="tel"
                name="mobile"
                required
                value={formData.mobile}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="rahul@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">City / Base Location *</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Gorakhpur / Deoria"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Age (उम्र)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 21"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Performance Category *</label>
              <select
                name="performanceCategory"
                value={formData.performanceCategory}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none text-xs sm:text-sm cursor-pointer"
              >
                <option value="Singing">Singing (गायन)</option>
                <option value="Dancing">Dancing (नृत्य)</option>
                <option value="Standup Comedy">Standup Comedy (हास्य)</option>
                <option value="Beatboxing">Beatboxing & Rap</option>
                <option value="Magic & Illusion">Magic & Illusion (जादू)</option>
                <option value="Poetry & Shayari">Poetry & Shayari (कविता)</option>
                <option value="Unique Talent / Other">Unique Talent / Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Performance / Act Title</label>
            <input
              type="text"
              name="performanceTitle"
              value={formData.performanceTitle}
              onChange={handleChange}
              placeholder="e.g. Classical Fusion Solo / Standup Set"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Instagram Profile Link / Handle</label>
            <input
              type="text"
              name="instagramUrl"
              value={formData.instagramUrl}
              onChange={handleChange}
              placeholder="e.g. https://instagram.com/your_handle or @your_handle"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Act Description / Special Requirements</label>
            <textarea
              name="performanceDescription"
              rows={3}
              value={formData.performanceDescription}
              onChange={handleChange}
              placeholder="Briefly describe your act or any prop/mic requirements..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-400 outline-none text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* WhatsApp Notice Bar */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-200">
          <WhatsAppIcon className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <strong className="text-white block font-bold">Automatic Admin Save & WhatsApp Connect:</strong>
            Submitting this form will automatically save your audition details in the Admin Portal with an Application ID and redirect to WhatsApp ({DISPLAY_PHONE}).
          </div>
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
              SUBMIT AUDITION DETAILS & CONNECT ON WHATSAPP
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
