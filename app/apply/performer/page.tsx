'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mic2, CheckCircle2, AlertCircle, ShieldCheck, ArrowRight, Loader2,
  RefreshCw, Info, Sparkles, Check, Phone, Mail
} from 'lucide-react';
import { parseResponse } from '@/lib/client-fetch';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PerformerApplyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentFailed, setPaymentFailed] = useState(false);

  // Success State
  const [successData, setSuccessData] = useState<{
    appId: string;
    email: string;
    whatsapp: string;
    mobile: string;
  } | null>(null);

  // Saved Order Details for Payment Retry
  const [pendingOrder, setPendingOrder] = useState<{
    appId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    keyId: string;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    whatsappNumber: '',
    alternateContact: '',
    performanceCategory: 'Singing',
    performanceTitle: '',
    performanceDescription: '',
    performanceType: 'Solo',
    performerCount: '1',
    performanceDuration: '3 to 5 Minutes',
    performanceLanguage: 'Hindi',
    specialRequirements: '',
    instagramUrl: '',
    youtubeUrl: '',
    facebookUrl: '',
    city: '',
    age: '18',
    discoverySource: 'Instagram',
    additionalMessage: '',
    consent: false,
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

  // Helper to load Razorpay Checkout Script dynamically
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Initiate Razorpay Checkout & Server Verification
  const openRazorpayCheckout = async (orderData: {
    appId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    keyId: string;
  }) => {
    setLoading(true);
    setPaymentFailed(false);
    setError('');

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded && !orderData.keyId) {
      console.warn('Razorpay SDK not loaded or keyId empty. Triggering verification.');
    }

    if (!window.Razorpay || !orderData.keyId) {
      // In local demo or fallback mode without Razorpay API keys configured
      console.warn('⚠️ Razorpay Key ID not configured in environment. Triggering server-side payment verification fallback.');
      try {
        const verifyRes = await fetch('/api/apply/performer/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appId: orderData.appId,
            razorpay_order_id: orderData.razorpayOrderId,
            razorpay_payment_id: `pay_demo_${Date.now()}`,
            razorpay_signature: `sig_demo_${Date.now()}`,
          }),
        });

        const verifyData = await parseResponse(verifyRes);

        setSuccessData({
          appId: orderData.appId,
          email: formData.email,
          whatsapp: formData.whatsappNumber,
          mobile: formData.mobileNumber,
        });
      } catch (err: any) {
        setError(err.message || 'Payment verification failed');
        setPaymentFailed(true);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Razorpay Official Modal Configuration
    const options = {
      key: orderData.keyId,
      amount: orderData.amount * 100,
      currency: orderData.currency || 'INR',
      name: "Gorakhpur's Got Latent",
      description: `Performer Audition Registration (${orderData.appId})`,
      image: '/logo.png',
      order_id: orderData.razorpayOrderId,
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.mobileNumber,
      },
      theme: {
        color: '#f59e0b',
      },
      handler: async function (response: any) {
        setLoading(true);
        try {
          // CRITICAL: Send signature to server for verification!
          const verifyRes = await fetch('/api/apply/performer/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              appId: orderData.appId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verifyData.error || 'Server-side payment verification failed');

          setSuccessData({
            appId: orderData.appId,
            email: formData.email,
            whatsapp: formData.whatsappNumber,
            mobile: formData.mobileNumber,
          });
        } catch (err: any) {
          setError(err.message || 'Payment verification failed on server');
          setPaymentFailed(true);
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          setPaymentFailed(true);
          setError('Payment was not completed. You can retry payment anytime.');
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      setLoading(false);
      setPaymentFailed(true);
      setError(`Payment Failed: ${response.error?.description || 'Transaction unsuccessful'}`);
    });
    rzp.open();
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPaymentFailed(false);

    if (!formData.consent) {
      setError('You must agree to the consent statement to register.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Application and Razorpay Order on server
      const res = await fetch('/api/apply/performer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Server Error (${res.status}): ${res.statusText || 'Invalid response from server'}`);
      }
      if (!res.ok) throw new Error(data.error || 'Failed to submit registration');

      const orderData = {
        appId: data.appId,
        razorpayOrderId: data.razorpayOrderId,
        amount: data.amount || 199,
        currency: data.currency || 'INR',
        keyId: data.keyId || '',
      };

      setPendingOrder(orderData);

      // 2. Launch Razorpay Checkout
      await openRazorpayCheckout(orderData);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  // Retry Payment Handler
  const handleRetryPayment = async () => {
    if (pendingOrder) {
      await openRazorpayCheckout(pendingOrder);
    }
  };

  // 1. USER SUCCESS PAGE
  if (successData) {
    return (
      <div className="py-16 px-4 max-w-2xl mx-auto space-y-8 text-center animate-in fade-in duration-300">
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.4)]">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-3">
          <span className="px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-widest border border-amber-500/40">
            GORAKHPUR’S GOT LATENT
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">Application Submitted Successfully!</h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Your performer application has been successfully received. Our team will review your details and contact you using the registered contact information.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-amber-500/30 space-y-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-400 font-mono block">APPLICATION ID</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-wider">{successData.appId}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <Check className="w-4 h-4" /> Payment Verified
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300 pt-2">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-400" /> Registered Email:</span>
              <strong className="text-white">{successData.email}</strong>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Number:</span>
              <strong className="text-white">{successData.whatsapp}</strong>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-amber-400" /> Call Contact Number:</span>
              <strong className="text-white">{successData.mobile}</strong>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link
            href={`/track?appId=${successData.appId}`}
            className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
          >
            TRACK AUDITION STATUS <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/" className="px-8 py-4 rounded-2xl bg-slate-900 border border-slate-700 text-white font-bold text-sm">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header Headline & Subtitle */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-black uppercase tracking-wider border border-amber-500/30">
          <Mic2 className="w-4 h-4" /> GORAKHPUR’S GOT LATENT
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Want to Perform at Gorakhpur’s Got Latent?
        </h1>
        <p className="text-base sm:text-lg text-amber-200/90 font-medium">
          Register your talent and get a chance to showcase your performance.
        </p>
      </div>

      {/* Pre-Payment Review Note */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-400 font-bold block mb-0.5">Audition & Refund Selection Notice:</strong>
          Application fees are subject to the event’s selection and review process. If your application is rejected by the event team, you may claim a refund according to the event refund policy. The team will review and process eligible refunds.
        </div>
      </div>

      {/* Payment Failure / Error Alert Banner */}
      {error && (
        <div className="p-5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs sm:text-sm font-semibold space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>

          {paymentFailed && pendingOrder && (
            <button
              onClick={handleRetryPayment}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} RETRY PAYMENT FOR {pendingOrder.appId}
            </button>
          )}
        </div>
      )}

      {/* REGISTRATION FORM */}
      <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-6 sm:p-10 rounded-3xl border border-amber-500/30 shadow-[0_0_50px_rgba(255,215,0,0.1)]">
        {/* 1. PERSONAL DETAILS */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-amber-400 uppercase tracking-wider border-b border-amber-500/20 pb-2">
            PERSONAL DETAILS
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
                placeholder="e.g. Rahul Verma"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
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
                placeholder="rahul@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Number *</label>
              <input
                type="tel"
                name="mobileNumber"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp Number *</label>
              <input
                type="tel"
                name="whatsappNumber"
                required
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Call Number / Alternate Contact *</label>
              <input
                type="tel"
                name="alternateContact"
                required
                value={formData.alternateContact}
                onChange={handleChange}
                placeholder="+91 98112 23344"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. PERFORMANCE DETAILS */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-amber-400 uppercase tracking-wider border-b border-amber-500/20 pb-2">
            PERFORMANCE DETAILS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">What do you want to perform? *</label>
              <select
                name="performanceCategory"
                value={formData.performanceCategory}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none font-semibold"
              >
                <option value="Singing">Singing</option>
                <option value="Rap">Rap</option>
                <option value="Dance">Dance</option>
                <option value="Stand-up Comedy">Stand-up Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Acting">Acting</option>
                <option value="Poetry / Shayari">Poetry / Shayari</option>
                <option value="Beatboxing">Beatboxing</option>
                <option value="Instrumental">Instrumental</option>
                <option value="Magic">Magic</option>
                <option value="Mimicry">Mimicry</option>
                <option value="Content Creation">Content Creation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Performance Title / Name *</label>
              <input
                type="text"
                name="performanceTitle"
                required
                value={formData.performanceTitle}
                onChange={handleChange}
                placeholder="e.g. Acoustic Bhojpuri Classical Fusion"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Solo / Duo / Group *</label>
              <select
                name="performanceType"
                value={formData.performanceType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              >
                <option value="Solo">Solo</option>
                <option value="Duo">Duo</option>
                <option value="Group">Group</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Number of Performers *</label>
              <input
                type="number"
                name="performerCount"
                min="1"
                required
                value={formData.performerCount}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Performance Duration (Fixed)</label>
              <input
                type="text"
                name="performanceDuration"
                value="3 to 5 Minutes (Fixed Audition Slot)"
                disabled
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-300 font-bold text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Language of Performance</label>
              <input
                type="text"
                name="performanceLanguage"
                value={formData.performanceLanguage}
                onChange={handleChange}
                placeholder="e.g. Hindi / Bhojpuri / English"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Detailed Description of Performance *</label>
            <textarea
              name="performanceDescription"
              rows={3}
              required
              value={formData.performanceDescription}
              onChange={handleChange}
              placeholder="Describe your act, style, theme, and key highlights..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Any Special Requirements? (Microphone, Music System, Instrument, Stage Space, Props, Lighting, Other)</label>
            <input
              type="text"
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleChange}
              placeholder="e.g. 2 Cordless Mics, High Stool, AUX Cable"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* 3. SOCIAL MEDIA */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-amber-400 uppercase tracking-wider border-b border-amber-500/20 pb-2">
            SOCIAL MEDIA
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Instagram Profile URL *</label>
              <input
                type="url"
                name="instagramUrl"
                required
                value={formData.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/yourhandle"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">YouTube Channel URL (Optional)</label>
              <input
                type="url"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/@channel (Optional)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Facebook Profile/Page URL (Optional)</label>
              <input
                type="url"
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleChange}
                placeholder="https://facebook.com/page (Optional)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. ADDITIONAL INFORMATION */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-amber-400 uppercase tracking-wider border-b border-amber-500/20 pb-2">
            ADDITIONAL INFORMATION
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">City *</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Gorakhpur"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Age *</label>
              <input
                type="number"
                name="age"
                min="10"
                max="100"
                required
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">How did you hear about GGL?</label>
              <select
                name="discoverySource"
                value={formData.discoverySource}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
              >
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Friend">Friend</option>
                <option value="Google">Google</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Applicant Message / Additional Information</label>
            <textarea
              name="additionalMessage"
              rows={2}
              value={formData.additionalMessage}
              onChange={handleChange}
              placeholder="Any message for the audition judges or organizing team..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* 5. CONSENT DECLARATION */}
        <div className="pt-4 border-t border-amber-500/20">
          <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-200">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-0.5 w-5 h-5 text-amber-500 accent-amber-500 shrink-0"
            />
            <span className="leading-relaxed">
              “I confirm that the information provided by me is correct and I agree to the event/application terms.”
            </span>
          </label>
        </div>

        {/* SUBMIT & PAY BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:scale-[1.01] transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" /> PROCESSING REGISTRATION...
            </>
          ) : (
            <>
              <ShieldCheck className="w-6 h-6" /> PROCEED TO PAY AUDITION FEE & SUBMIT <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
