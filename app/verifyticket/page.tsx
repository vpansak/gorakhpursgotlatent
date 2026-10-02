'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import jsQR from 'jsqr';
import { 
  ShieldCheck, 
  Camera, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  LogOut, 
  Ticket as TicketIcon, 
  RefreshCw, 
  User, 
  Lock,
  ArrowRight,
  KeyRound,
  Sparkles
} from 'lucide-react';
import TicketCard from '@/components/TicketCard';
import { TicketRecord } from '@/lib/ticketTypes';

export default function VerifyTicketPage() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Verification & Expiration State
  const [ticketIdInput, setTicketIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expireCode, setExpireCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [expiring, setExpiring] = useState(false);

  const [verificationResult, setVerificationResult] = useState<{
    status: 'IDLE' | 'LOOKUP_VALID' | 'SUCCESS_EXPIRED' | 'ALREADY_USED' | 'UNPAID' | 'INVALID';
    message: string;
    ticket?: TicketRecord;
    checkedInAt?: string;
  }>({ status: 'IDLE', message: '' });

  // Camera & QR Scanner State
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastScannedIdRef = useRef<string | null>(null);

  // Check existing session storage on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('ggl_verify_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle Login Submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanId = loginId.trim();
    const cleanPw = loginPassword.trim();

    if (cleanId === '8423858424' && cleanPw === '1122') {
      sessionStorage.setItem('ggl_verify_auth', 'true');
      setIsAuthenticated(true);
      setLoginId('');
      setLoginPassword('');
    } else {
      setLoginError('Invalid ID or Password. Access Denied.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    stopCamera();
    sessionStorage.removeItem('ggl_verify_auth');
    setIsAuthenticated(false);
    setVerificationResult({ status: 'IDLE', message: '' });
  };

  // Step 1: Lookup Ticket Details (Without Expiring Immediately)
  const lookupTicketDetails = async (rawId: string) => {
    if (!rawId || !rawId.trim()) return;

    // Extract ticket ID if raw input is a full verification URL
    let extractedId = rawId.trim();
    const match = extractedId.match(/GGLT\d{6}/i);
    if (match) {
      extractedId = match[0].toUpperCase();
    } else {
      extractedId = extractedId.toUpperCase();
    }

    setLoading(true);
    setCodeError('');
    setExpireCode('');
    setVerificationResult({ status: 'IDLE', message: '' });

    try {
      const res = await fetch('/api/tickets/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: extractedId }),
      });

      const data = await res.json();

      if (data.status === 'VALID' && data.ticket) {
        setVerificationResult({
          status: 'LOOKUP_VALID',
          message: data.message || '✓ Valid Ticket Found. Enter code 11 to confirm entry and expire ticket.',
          ticket: data.ticket,
        });
      } else if (data.status === 'ALREADY_USED' && data.ticket) {
        setVerificationResult({
          status: 'ALREADY_USED',
          message: data.message || `USED — Ticket ${data.ticket.ticket_id} has already been used.`,
          ticket: data.ticket,
          checkedInAt: data.ticket.checked_in_at || undefined,
        });
      } else if (data.status === 'UNPAID' && data.ticket) {
        setVerificationResult({
          status: 'UNPAID',
          message: `✕ UNPAID TICKET: Payment is not completed for ticket ${extractedId}.`,
          ticket: data.ticket,
        });
      } else {
        setVerificationResult({
          status: 'INVALID',
          message: data.message || `✕ INVALID TICKET ID: Ticket ${extractedId} not found in database.`,
        });
      }
    } catch (err) {
      setVerificationResult({
        status: 'INVALID',
        message: 'Network error occurred during ticket lookup. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm Entry & Expire Ticket by Entering Code 11
  const handleConfirmExpireWithCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');

    if (!verificationResult.ticket) return;

    const cleanCode = expireCode.trim();
    if (cleanCode !== '11') {
      setCodeError('✕ INCORRECT CODE! Enter "11" to expire ticket.');
      return;
    }

    setExpiring(true);

    try {
      const res = await fetch('/api/tickets/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: verificationResult.ticket.ticket_id,
          code: cleanCode,
        }),
      });

      const data = await res.json();

      if (data.success && data.ticket) {
        setVerificationResult({
          status: 'SUCCESS_EXPIRED',
          message: `✓ TICKET EXPIRED & ENTRY CONFIRMED: Welcome ${data.ticket.customer_name}!`,
          ticket: data.ticket,
          checkedInAt: data.ticket.checked_in_at || new Date().toISOString(),
        });
        setExpireCode('');
      } else {
        setCodeError(data.message || 'Failed to expire ticket. Please try again.');
      }
    } catch (err) {
      setCodeError('Network error during expiration. Please try again.');
    } finally {
      setExpiring(false);
    }
  };

  // Start Camera Stream & Frame Decoder Loop
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        requestAnimationFrame(tickScanFrame);
      }
    } catch (err) {
      console.warn('Camera stream error:', err);
      alert('Unable to access mobile camera. Please check camera permissions or use manual Ticket ID input.');
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Continuous Camera Frame Decoder using jsQR
  const tickScanFrame = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          const scannedText = code.data.trim();
          if (scannedText !== lastScannedIdRef.current) {
            lastScannedIdRef.current = scannedText;
            lookupTicketDetails(scannedText);
            // Pause re-scans for 3 seconds
            setTimeout(() => {
              lastScannedIdRef.current = null;
            }, 3000);
          }
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(tickScanFrame);
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // -------------------------------------------------------------
  // RENDER LOGIN SCREEN (WHEN NOT AUTHENTICATED)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07080e] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <div className="spotlight-left pointer-events-none" />
        <div className="spotlight-right pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-8">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 mx-auto shadow-[0_0_30px_rgba(255,215,0,0.4)]">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-amber-400">
                <Lock className="w-8 h-8" />
              </div>
            </div>

            <h1 className="font-bebas text-3xl sm:text-4xl text-white uppercase tracking-wider">
              TICKET VERIFICATION LOGIN
            </h1>
            <p className="text-xs text-slate-400">
              Gorakhpur's Got Latent — Staff Gate Entry Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 space-y-5 bg-slate-900/90 shadow-2xl">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-400" /> ID / Mobile Number
              </label>
              <input
                type="text"
                required
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="Enter authorized ID"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all font-mono text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400" /> Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter verification password"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all text-sm font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-barlow font-black uppercase tracking-wider text-base flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,215,0,0.4)] transition-all cursor-pointer"
            >
              <span>ACCESS VERIFICATION SCANNER</span>
              <ArrowRight className="w-5 h-5 text-black" />
            </button>
          </form>

          <div className="text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-amber-400 transition-colors">
              ← Return to GGL Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER VERIFICATION & SCANNER SCREEN (WHEN LOGGED IN)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#07080e] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="spotlight-left pointer-events-none" />
      <div className="spotlight-right pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* HEADER BAR */}
        <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-amber-500/30 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block font-barlow">
                GORAKHPUR'S GOT LATENT • GATE VERIFICATION
              </span>
              <h1 className="font-bebas text-2xl sm:text-3xl text-white uppercase tracking-wide">
                TICKET VERIFICATION
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-barlow uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SCANNER READY
            </span>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        {/* MAIN VERIFICATION MODULE: SCANNER + MANUAL INPUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: CAMERA QR SCANNER (7 COLS) */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-amber-500/30 bg-slate-900/90 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h3 className="font-bebas text-xl text-white uppercase tracking-wide">
                  1. LIVE QR CODE SCANNER
                </h3>
              </div>
              
              {cameraActive && (
                <button
                  onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-mono text-[11px] uppercase border border-slate-700"
                >
                  Flip Camera
                </button>
              )}
            </div>

            <div className="relative aspect-video rounded-2xl bg-black border-2 border-slate-800 overflow-hidden flex items-center justify-center group">
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder Target Box Overlay */}
              {cameraActive && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-amber-400/80 rounded-2xl relative shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-amber-400 -mt-1 -ml-1 rounded-tl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-amber-400 -mt-1 -mr-1 rounded-tr" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-amber-400 -mb-1 -ml-1 rounded-bl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-amber-400 -mb-1 -mr-1 rounded-br" />
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent absolute top-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                </div>
              )}

              {/* Camera Off Placeholder */}
              {!cameraActive && (
                <div className="text-center space-y-3 p-6">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                    <Camera className="w-8 h-8 text-amber-500/60" />
                  </div>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Click below to start mobile rear camera and auto-scan ticket QR code.
                  </p>
                </div>
              )}
            </div>

            {/* Camera Control Buttons */}
            <div className="flex gap-3">
              {!cameraActive ? (
                <button
                  onClick={startCamera}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-barlow font-black uppercase text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-black" />
                  <span>START CAMERA SCANNER</span>
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600/30 hover:bg-red-600/40 text-red-300 font-bold uppercase text-sm border border-red-500/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>STOP CAMERA</span>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: MANUAL TICKET ID SEARCH (5 COLS) */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-amber-500/30 bg-slate-900/90 space-y-5 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                <Search className="w-5 h-5 text-amber-400" />
                <h3 className="font-bebas text-xl text-white uppercase tracking-wide">
                  2. MANUAL TICKET CODE
                </h3>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  lookupTicketDetails(ticketIdInput);
                }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Enter Ticket ID
                  </label>
                  <div className="relative">
                    <TicketIcon className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={ticketIdInput}
                      onChange={(e) => setTicketIdInput(e.target.value)}
                      placeholder="e.g. GGLT542495"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 placeholder-slate-600 font-mono font-bold text-base focus:outline-none focus:border-amber-500 transition-all uppercase"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Type 6-digit Ticket ID printed on digital pass.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-barlow font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 text-black animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5 text-black" />
                      <span>LOOKUP TICKET</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 text-xs space-y-1">
              <span className="font-bold text-amber-400 block uppercase">Gate Rules:</span>
              <p>• Scan QR or type Ticket ID first.</p>
              <p>• If valid, enter code <span className="text-amber-300 font-mono font-bold">11</span> to expire ticket & allow entry.</p>
              <p>• Expired tickets show <span className="text-red-400 font-bold">USED</span> without code input.</p>
            </div>
          </div>

        </div>

        {/* VERIFICATION RESULT DISPLAY CARD */}
        {verificationResult.status !== 'IDLE' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-300">
            
            {/* LOOKUP VALID STATE — ASKS FOR CODE 11 TO EXPIRE */}
            {verificationResult.status === 'LOOKUP_VALID' && verificationResult.ticket && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-amber-500/60 bg-amber-950/30 space-y-6 shadow-[0_0_50px_rgba(245,158,11,0.25)]">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-500/30 pb-4 text-center sm:text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 shrink-0">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 font-black text-xs uppercase tracking-widest font-barlow inline-block mb-1 border border-emerald-500/40">
                        ✓ VALID TICKET FOUND
                      </span>
                      <h2 className="font-bebas text-3xl sm:text-4xl text-white uppercase tracking-wide">
                        ENTER CODE 11 TO EXPIRE & CONFIRM ENTRY
                      </h2>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Ticket ID</span>
                    <span className="text-xl font-mono font-black text-amber-400">
                      {verificationResult.ticket.ticket_id}
                    </span>
                  </div>
                </div>

                {/* Attendee Details Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Attendee Name</span>
                    <span className="font-bold text-white text-sm">{verificationResult.ticket.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Contact Mobile</span>
                    <span className="font-mono font-bold text-slate-200 text-sm">{verificationResult.ticket.mobile}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Instagram ID</span>
                    <span className="font-bold text-pink-400 text-sm">{verificationResult.ticket.instagram_id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Status</span>
                    <span className="font-black text-emerald-400 uppercase text-sm">PAID (₹{verificationResult.ticket.amount})</span>
                  </div>
                </div>

                {/* PROMINENT CODE 11 EXPIRATION BOX */}
                <form
                  onSubmit={handleConfirmExpireWithCode}
                  className="p-5 rounded-2xl bg-slate-950 border-2 border-amber-500/70 space-y-4 shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-6 h-6 text-amber-400" />
                    <div>
                      <h4 className="font-bebas text-xl text-amber-300 uppercase tracking-wide">
                        GATE CONFIRMATION CODE REQUIRED
                      </h4>
                      <p className="text-xs text-slate-300">
                        Type <span className="text-amber-300 font-mono font-bold">11</span> in box below to mark ticket as EXPIRED / USED.
                      </p>
                    </div>
                  </div>

                  {codeError && (
                    <div className="p-3 rounded-xl bg-red-950/90 border border-red-500 text-red-300 text-xs font-bold text-center">
                      {codeError}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      required
                      value={expireCode}
                      onChange={(e) => setExpireCode(e.target.value)}
                      placeholder="Type 11"
                      className="flex-1 px-4 py-3.5 rounded-xl bg-slate-900 border-2 border-amber-500/60 text-amber-300 placeholder-slate-600 font-mono font-black text-center text-xl tracking-widest focus:outline-none focus:border-amber-400 transition-all"
                    />

                    <button
                      type="submit"
                      disabled={expiring}
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-barlow font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {expiring ? (
                        <RefreshCw className="w-5 h-5 text-black animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-black" />
                          <span>CONFIRM & EXPIRE TICKET</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Graphic Ticket Card Preview */}
                <TicketCard ticket={verificationResult.ticket} showActions={true} />
              </div>
            )}

            {/* SUCCESS STATE — JUST EXPIRED WITH CODE 11 */}
            {verificationResult.status === 'SUCCESS_EXPIRED' && verificationResult.ticket && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/60 bg-emerald-950/40 space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.25)] animate-in fade-in zoom-in-95 duration-300">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-500/30 pb-4 text-center sm:text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 font-black text-xs uppercase tracking-widest font-barlow inline-block mb-1 border border-emerald-500/40">
                        ✓ USED / EXPIRED
                      </span>
                      <h2 className="font-bebas text-3xl sm:text-4xl text-emerald-300 uppercase tracking-wide">
                        ENTRY CONFIRMED & TICKET EXPIRED
                      </h2>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">ENTRY TIMESTAMP</span>
                    <span className="text-xs font-mono font-bold text-emerald-300">
                      {new Date(verificationResult.checkedInAt || Date.now()).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/40 text-emerald-300 font-bold text-sm text-center">
                  ✓ Ticket {verificationResult.ticket.ticket_id} is now EXPIRED and marked as USED.
                </div>

                <TicketCard ticket={verificationResult.ticket} showActions={true} />
              </div>
            )}

            {/* ALREADY USED / EXPIRED STATE — NO CODE 11 INPUT SHOWN! */}
            {verificationResult.status === 'ALREADY_USED' && verificationResult.ticket && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-red-500/70 bg-red-950/50 space-y-6 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-red-500/30 pb-4 text-center sm:text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400 shrink-0">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full bg-red-600/40 text-red-200 font-black text-xs uppercase tracking-widest font-barlow inline-block mb-1 animate-pulse border border-red-500/50">
                        ⚠️ USED / EXPIRED
                      </span>
                      <h2 className="font-bebas text-3xl sm:text-4xl text-red-300 uppercase tracking-wide">
                        TICKET IS ALREADY USED
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-black/80 border border-red-500/50 text-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-red-400 font-black text-base uppercase">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span>STATUS: USED</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    This ticket (<span className="font-mono font-bold text-amber-300">{verificationResult.ticket.ticket_id}</span>) has ALREADY been consumed for gate entry. No further check-ins are allowed.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 uppercase block text-[10px]">Attendee Name:</span>
                      <span className="font-bold text-white text-sm">{verificationResult.ticket.customer_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase block text-[10px]">Checked-In Timestamp:</span>
                      <span className="font-mono font-bold text-amber-300 text-xs">
                        {verificationResult.ticket.checked_in_at ? new Date(verificationResult.ticket.checked_in_at).toLocaleString('en-IN') : 'Earlier Session'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase block text-[10px]">Entry Status:</span>
                      <span className="font-black text-red-400 uppercase text-xs">USED</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* UNPAID / PENDING TICKET STATE */}
            {verificationResult.status === 'UNPAID' && (
              <div className="glass-panel p-6 rounded-3xl border border-red-500/60 bg-red-950/40 space-y-4">
                <div className="flex items-center gap-3">
                  <XCircle className="w-8 h-8 text-red-400" />
                  <div>
                    <h3 className="font-bebas text-2xl text-red-400 uppercase">✕ UNPAID TICKET</h3>
                    <p className="text-xs text-slate-300">
                      This ticket cannot be verified or expired because payment is incomplete.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* INVALID TICKET ID STATE */}
            {verificationResult.status === 'INVALID' && (
              <div className="glass-panel p-6 rounded-3xl border border-red-500/60 bg-red-950/40 space-y-4">
                <div className="flex items-center gap-3">
                  <XCircle className="w-8 h-8 text-red-400" />
                  <div>
                    <h3 className="font-bebas text-2xl text-red-400 uppercase">✕ INVALID TICKET ID</h3>
                    <p className="text-xs text-slate-300">
                      {verificationResult.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
