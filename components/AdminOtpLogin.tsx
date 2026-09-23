'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, Mail, KeyRound, Loader2, ArrowRight,
  RefreshCw, AlertCircle, CheckCircle2, Clock, ArrowLeft
} from 'lucide-react';

interface AdminOtpLoginProps {
  onSuccess?: () => void;
}

export default function AdminOtpLogin({ onSuccess }: AdminOtpLoginProps) {
  const router = useRouter();

  // State: 'ENTER_EMAIL' | 'VERIFY_OTP'
  const [step, setStep] = useState<'ENTER_EMAIL' | 'VERIFY_OTP'>('ENTER_EMAIL');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Timers
  const [expirySeconds, setExpirySeconds] = useState(300); // 5 minutes
  const [cooldownSeconds, setCooldownSeconds] = useState(60); // 60s cooldown for resend
  const [isExpired, setIsExpired] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Expiry Countdown (5 mins)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'VERIFY_OTP' && expirySeconds > 0) {
      timer = setInterval(() => {
        setExpirySeconds((prev) => {
          if (prev <= 1) {
            setIsExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, expirySeconds]);

  // Resend Cooldown Countdown (60s)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'VERIFY_OTP' && cooldownSeconds > 0) {
      timer = setInterval(() => {
        setCooldownSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, cooldownSeconds]);

  // Focus first OTP input when transitioning to VERIFY_OTP
  useEffect(() => {
    if (step === 'VERIFY_OTP') {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  const formatCountdown = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 1. Submit Email & Request OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter your authorized administrator email.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/malik/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Unable to send verification code. Please check your administrator access.');
      }

      setStep('VERIFY_OTP');
      setOtpDigits(['', '', '', '', '', '']);
      setExpirySeconds(data.expiresInSeconds || 300);
      setCooldownSeconds(data.cooldownSeconds || 60);
      setIsExpired(false);
      setSuccessMsg(`Verification code sent to: ${cleanEmail}`);
    } catch (err: any) {
      setError(err.message || 'Unable to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  // 2. OTP Input Handler with auto-advance and backspace
  const handleDigitChange = (index: number, val: string) => {
    // Only numeric
    const clean = val.replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];

    if (clean.length > 1) {
      // Pasting full code
      const pasted = clean.slice(0, 6).split('');
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextIdx = Math.min(pasted.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    newDigits[index] = clean;
    setOtpDigits(newDigits);

    if (clean && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (pastedData) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedData[i] || '';
      }
      setOtpDigits(newDigits);
      const focusIndex = Math.min(pastedData.length, 5);
      otpInputRefs.current[focusIndex]?.focus();
    }
  };

  // 3. Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    if (isExpired) {
      setError('OTP has expired. Please click SEND NEW OTP.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/malik/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: fullOtp }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid verification code.');
      }

      setSuccessMsg('Authenticated! Opening GGL Admin Portal...');

      // Notify parent or refresh router
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/malik');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel p-8 sm:p-9 rounded-3xl border border-amber-500/30 space-y-7 shadow-[0_0_60px_rgba(245,158,11,0.12)] relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header with GGL Branding */}
        <div className="text-center space-y-3 relative z-10">
          <div className="relative w-48 h-14 mx-auto">
            <Image src="/logo.png" alt="Gorakhpur's Got Latent" fill className="object-contain" priority />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-black uppercase tracking-widest shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" /> GGL ADMIN PORTAL
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Secure Administrator Verification
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {step === 'ENTER_EMAIL'
              ? 'Enter your authorized administrator email to receive a secure one-time passcode.'
              : 'Enter the 6-digit security code sent to your authorized email address.'}
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-semibold flex items-start gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {successMsg && !error && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-start gap-2.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{successMsg}</span>
          </div>
        )}

        {/* STEP 1: ENTER EMAIL */}
        {step === 'ENTER_EMAIL' && (
          <form onSubmit={handleSendOtp} className="space-y-5 relative z-10">
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                ADMIN EMAIL
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="Enter authorized admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none transition-all"
                  autoComplete="email"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-500 pt-0.5">
                Only authorized GGL administrators can receive verification codes.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>GENERATING SECURE OTP...</span>
                </>
              ) : (
                <>
                  <span>SEND OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 'VERIFY_OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6 relative z-10">
            <div className="text-center space-y-1 bg-black/30 p-3 rounded-2xl border border-white/5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Verification code sent to:
              </span>
              <span className="font-mono text-xs font-black text-amber-300 break-all">
                {email}
              </span>
            </div>

            {/* 6 Digit Inputs */}
            <div className="space-y-2">
              <label className="block text-center text-xs font-black uppercase tracking-wider text-slate-300">
                ENTER 6-DIGIT CODE
              </label>
              <div className="flex justify-between gap-2 sm:gap-2.5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                    disabled={loading || isExpired}
                    className={`w-11 h-14 sm:w-12 sm:h-14 text-center font-mono text-xl font-black rounded-2xl border bg-slate-900/90 text-white focus:outline-none transition-all ${
                      digit
                        ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                        : 'border-slate-700 focus:border-amber-400'
                    } ${isExpired ? 'opacity-40 border-red-500/40' : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* Expiry and Resend Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-1 border-t border-white/5">
              {/* Expiry Countdown */}
              <div className="flex items-center gap-1.5 font-mono">
                <Clock className={`w-3.5 h-3.5 ${isExpired ? 'text-red-400' : 'text-slate-400'}`} />
                {isExpired ? (
                  <span className="font-black text-red-400">OTP EXPIRED</span>
                ) : (
                  <span className="text-slate-300">
                    OTP expires in <strong className="text-amber-400 font-bold">{formatCountdown(expirySeconds)}</strong>
                  </span>
                )}
              </div>

              {/* Resend OTP */}
              <div>
                {isExpired ? (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={loading}
                    className="text-amber-400 hover:text-amber-300 font-black flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> SEND NEW OTP
                  </button>
                ) : cooldownSeconds > 0 ? (
                  <span className="text-slate-500 font-mono text-[11px]">
                    Resend in {cooldownSeconds}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={loading}
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> RESEND OTP
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                type="submit"
                disabled={loading || otpDigits.join('').length !== 6 || isExpired}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>VERIFYING CODE...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>VERIFY OTP & ACCESS PORTAL</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('ENTER_EMAIL');
                  setError('');
                  setSuccessMsg('');
                }}
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Change Email
              </button>
            </div>
          </form>
        )}

        {/* Security badge footer */}
        <div className="text-center text-[10px] text-slate-500 border-t border-white/5 pt-3">
          GORAKHPUR’S GOT LATENT • 256-BIT ENCRYPTED ADMIN AUTHENTICATION
        </div>
      </div>
    </div>
  );
}
