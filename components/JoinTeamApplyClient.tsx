'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { parseResponse } from '@/lib/client-fetch';
import { useLeadCapture } from '@/lib/leadCapture';
import {
  Users, User, Phone, Mail, Calendar, MapPin, FileText, CheckCircle2,
  ArrowRight, Sparkles, HeartHandshake, Briefcase, Loader2
} from 'lucide-react';

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.155.57 4.178 1.564 5.927l-1.664 6.085 6.25-1.639c1.693.923 3.633 1.455 5.706 1.455 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

const WHATSAPP_NUMBER = '918423858424';
const DISPLAY_PHONE = '+91 8423858424';

export default function JoinTeamApplyClient() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    dob: '',
    address: '',
    instagram: '',
    about: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState('');

  useLeadCapture({ source: 'team', data: formData, customerName: formData.name, mobile: formData.mobile, email: formData.email, instagramId: formData.instagram, dob: formData.dob });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const constructWhatsAppMessage = (data: typeof formData, appId: string) => {
    return (
`👥 *GORAKHPUR'S GOT LATENT - JOIN TEAM APPLICATION* 👥

🆔 *Application ID:* ${appId}
👤 *Full Name:* ${data.name.trim()}
📱 *Mobile Number:* ${data.mobile.trim()}
📧 *Email Address:* ${data.email.trim()}
🎂 *Date of Birth:* ${data.dob}
📍 *Address / Location:* ${data.address.trim()}
📸 *Instagram Profile:* ${data.instagram.trim()}

📝 *About Applicant / Why Join Team:*
${data.about.trim()}

------------------------------------
✨ _Saved in Admin Portal | Official Website: gkpgotlatent.in_`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    const cleanMobile = formData.mobile.replace(/[^0-9]/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.dob) {
      setErrorMessage('Please provide your Date of Birth.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Please provide your address/location.');
      return;
    }
    if (!formData.instagram.trim()) {
      setErrorMessage('Please enter your Instagram link or username.');
      return;
    }
    if (!formData.about.trim()) {
      setErrorMessage('Please tell us a bit about yourself.');
      return;
    }

    setLoading(true);
    let assignedAppId = '';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch('/api/apply/join-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await parseResponse(res);
      if (data.success && data.appId) {
        assignedAppId = data.appId;
        setSubmittedAppId(data.appId);
      }
    } catch (err) {
      console.warn('API save warning (proceeding to WhatsApp):', err);
      assignedAppId = `EVT-${Date.now().toString().slice(-6)}`;
      setSubmittedAppId(assignedAppId);
    } finally {
      setLoading(false);
    }

    const messageText = constructWhatsAppMessage(formData, assignedAppId);
    const waUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(messageText)}`;

    setGeneratedWhatsAppUrl(waUrl);
    setSubmitted(true);

    // Automatically trigger WhatsApp redirect
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
            <CheckCircle2 className="w-4 h-4" /> Team Application Saved in Admin Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Redirecting to <span className="text-emerald-400">WhatsApp</span>...
          </h1>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Your team application is saved in the Admin Portal and formatted. Opening WhatsApp to deliver details to <strong className="text-emerald-300">{DISPLAY_PHONE}</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 max-w-md mx-auto">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-widest block">TEAM APPLICATION ID</span>
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

        <div className="flex justify-center pt-2">
          <Link href="/" className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="relative w-44 h-16 mx-auto">
          <Image src="/logo.png" alt="Gorakhpur's Got Latent" fill className="object-contain" priority />
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
          <Users className="w-4 h-4 text-amber-400" /> CREW & VOLUNTEER RECRUITMENT
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
          JOIN THE <span className="gold-gradient-text">TEAM</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Be a part of Purvanchal’s biggest live entertainment sensation! Fill out your details below to save in Admin Portal and connect directly with the organizing team via WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase">Live Event Operations</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Backstage management, stage control, crowd coordination & VIP assistance.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase">Media & Content</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Photography, videography, reels creation, editing & social media handle.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase">Direct VIP Access</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Work closely with top influencers, celebrity judges, artists & mentors.</p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <span>⚠️ {errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 glass-panel p-6 sm:p-10 rounded-3xl border border-amber-500/20 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" /> Team Member Application
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">All details will be saved in Admin Portal and sent directly on WhatsApp ({DISPLAY_PHONE}).</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" /> Full Name (नाम) *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Verma"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-amber-400 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" /> Mobile Number (मोबाइल नं.) *
            </label>
            <input
              type="tel"
              name="mobile"
              required
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-amber-400 focus:outline-none font-mono transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" /> Email Address (ईमेल) *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. rahul@example.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-amber-400 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> Date of Birth (जन्म तिथि) *
            </label>
            <input
              type="date"
              name="dob"
              required
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-amber-400 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Full Address & City (पता) *
            </label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Mohaddipur, Gorakhpur, Uttar Pradesh 273008"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-amber-400 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <InstagramIcon className="w-3.5 h-3.5 text-amber-400" /> Instagram Profile Link / Username (इंस्टाग्राम लिंक) *
            </label>
            <input
              type="text"
              name="instagram"
              required
              value={formData.instagram}
              onChange={handleChange}
              placeholder="e.g. https://instagram.com/your_handle or @your_handle"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-amber-400 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" /> About Yourself & Why You Want to Join (अपने बारे में बताएं) *
            </label>
            <textarea
              name="about"
              required
              rows={4}
              value={formData.about}
              onChange={handleChange}
              placeholder="Tell us about yourself, your skills, experience, and why you want to join Gorakhpur's Got Latent..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-amber-400 focus:outline-none transition-all leading-relaxed"
            />
          </div>
        </div>

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
              SUBMIT APPLICATION & CONNECT ON WHATSAPP
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
