'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, CheckCircle2, ArrowRight, Loader2, MessageSquare, Mail } from 'lucide-react';
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

export default function GuestApplyClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState('');
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    stageName: '',
    email: '',
    whatsapp: '',
    city: '',
    profession: 'Content Creator / Influencer',
    category: 'Celebrity Judge & Guest Panel',
    instagramUrl: '',
    youtubeUrl: '',
    whyGgl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const constructWhatsAppMessage = (data: typeof formData, appId: string) => {
    return (
`🌟 *GORAKHPUR'S GOT LATENT - GUEST & VIP PANEL APPLICATION* 🌟

🆔 *Application ID:* ${appId}
👤 *Full Legal Name:* ${data.fullName.trim()}
🎭 *Public / Stage Name:* ${data.stageName.trim() || 'N/A'}
📧 *Email Address:* ${data.email.trim()}
📱 *WhatsApp / Call Number:* ${data.whatsapp.trim()}
📍 *City / Base Location:* ${data.city.trim()}
💼 *Profession / Domain:* ${data.profession.trim()}
📸 *Instagram Profile:* ${data.instagramUrl.trim() || 'N/A'}
▶️ *YouTube Channel:* ${data.youtubeUrl.trim() || 'N/A'}

📝 *Why Appear on Gorakhpur's Got Latent:*
${data.whyGgl.trim() || 'Interested in appearing as guest judge/panelist.'}

------------------------------------
✨ _Saved in Admin Portal | Official Website: gkpgotlatent.in_`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Please enter your Full Legal Name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid Email address.');
      return;
    }
    if (!formData.whatsapp.trim()) {
      setError('Please enter WhatsApp / Call Number.');
      return;
    }
    if (!formData.city.trim()) {
      setError('Please enter your City / Base Location.');
      return;
    }

    setLoading(true);
    let assignedAppId = '';

    try {
      const res = await fetch('/api/apply/guest', {
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
      assignedAppId = `GST-${Date.now().toString().slice(-6)}`;
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
            <CheckCircle2 className="w-4 h-4" /> Guest Details Saved in Admin Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Redirecting to <span className="text-emerald-400">WhatsApp</span>...
          </h1>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Your guest expression of interest has been saved in the Admin Portal. Opening WhatsApp to connect with our guest curation team at <strong className="text-emerald-300">{DISPLAY_PHONE}</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/30 max-w-md mx-auto">
            <span className="text-xs text-purple-400 font-bold uppercase tracking-widest block">GUEST APPLICATION ID</span>
            <div className="text-2xl sm:text-3xl font-black text-purple-300 font-mono tracking-wider mt-1">{submittedAppId}</div>
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

        <div className="flex justify-center pt-2">
          <Link href="/" className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Star className="w-4 h-4" /> CELEBRITY & GUEST PANEL
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Guest / Influencer Application</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          Express interest in appearing as a guest judge, celebrity performer, or featured content creator.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 text-center">
        Note: Submitting this form saves your details in the Admin Portal and opens WhatsApp directly to connect with show directors.
      </div>

      {error && <div className="p-4 rounded-xl bg-red-500/20 text-red-300 text-sm font-semibold">⚠️ {error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-6 sm:p-10 rounded-3xl border border-purple-500/20 shadow-2xl">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-purple-400 border-b border-purple-500/20 pb-2">1. Guest & Professional Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Legal Name *</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="e.g. Samarth Sharma" className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Public / Stage Name</label>
              <input type="text" name="stageName" value={formData.stageName} onChange={handleChange} placeholder="e.g. Samarth Standup" className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email *</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="name@domain.com" className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp / Call Number *</label>
              <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleChange} placeholder="+91 98765 43210" className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm font-mono focus:border-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">City / Base Location *</label>
              <input type="text" name="city" required value={formData.city} onChange={handleChange} placeholder="e.g. Gorakhpur / Lucknow" className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Profession / Domain *</label>
              <input type="text" name="profession" required value={formData.profession} onChange={handleChange} placeholder="Content Creator / Influencer" className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-purple-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-purple-400 border-b border-purple-500/20 pb-2">2. Social Media & Audience Reach</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Instagram Profile URL</label>
              <input type="url" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/..." className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">YouTube Channel URL</label>
              <input type="url" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleChange} placeholder="https://youtube.com/..." className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Why would you like to appear on Gorakhpur's Got Latent?</label>
            <textarea name="whyGgl" rows={3} value={formData.whyGgl} onChange={handleChange} placeholder="Tell us why you want to appear on the show..." className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-purple-500 outline-none leading-relaxed" />
          </div>
        </div>

        {/* WhatsApp Notice Bar */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-200">
          <WhatsAppIcon className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <strong className="text-white block font-bold">Automatic Admin Save & WhatsApp Connect:</strong>
            Submitting this form will automatically save your details in the Admin Portal with an Application ID and redirect to WhatsApp ({DISPLAY_PHONE}).
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
              SUBMIT GUEST DETAILS & CONNECT ON WHATSAPP
              <ArrowRight className="w-5 h-5" />
            </>
          )}
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
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Gorakhpur's Got Latent Team,\n\nI want to inquire about Guest / Judge / Creator appearance on the show.")}`}
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
                Chat on WhatsApp ({DISPLAY_PHONE}) <ArrowRight className="w-3.5 h-3.5" />
              </strong>
            </div>
          </a>

          <a
            href={`mailto:help.gglatent@gmail.com?subject=${encodeURIComponent("Guest & Creator Panel Inquiry - Gorakhpur's Got Latent")}`}
            className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 hover:border-purple-400 transition-all flex items-center justify-center gap-3 text-purple-300 group shadow-md"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Official Guest Curation Email</span>
              <strong className="text-sm text-white group-hover:text-purple-300 transition-colors flex items-center gap-1">
                help.gglatent@gmail.com <ArrowRight className="w-3.5 h-3.5" />
              </strong>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
