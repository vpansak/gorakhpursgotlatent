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
  Phone, 
  Mail, 
  AtSign, 
  Calendar, 
  Lock,
  ArrowRight
} from 'lucide-react';
import TicketCard from '@/components/TicketCard';
import { TicketRecord } from '@/lib/ticketsStore';

export default function VerifyTicketPage() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Verification State
  const [ticketIdInput, setTicketIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: 'IDLE' | 'SUCCESS' | 'ALREADY_USED' | 'UNPAID' | 'INVALID';
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

  // Perform Ticket Check-In & Verification
  const verifyAndCheckInTicket = async (rawId: string) => {
    if (!rawId || !rawId.trim()) return;

    // Extract ticket ID if raw input is a full verification URL (e.g. /ticket/verify/GGLT123456)
    let extractedId = rawId.trim();
    const match = extractedId.match(/GGLT\d{6}/i);
    if (match) {
      extractedId = match[0].toUpperCase();
    } else {
      extractedId = extractedId.toUpperCase();
    }

    setLoading(true);
    setVerificationResult({ status: 'IDLE', message: '' });

    try {
      const res = await fetch('/api/tickets/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: extractedId }),
      });

      const data = await res.json();

      if (data.success && data.ticket) {
        setVerificationResult({
          status: 'SUCCESS',
          message: `✓ TICKET VERIFIED / ENTERED: Welcome ${data.ticket.customer_name}! Entry confirmed.`,
          ticket: data.ticket,
          checkedInAt: data.ticket.checked_in_at || new Date().toISOString(),
        });
      } else if (data.isDuplicate && data.ticket) {
        setVerificationResult({
          status: 'ALREADY_USED',
          message: `ALREADY USED — Ticket ${data.ticket.ticket_id} has already been used for entry.`,
          ticket: data.ticket,
          checkedInAt: data.ticket.checked_in_at || undefined,
        });
      } else if (data.ticket && (data.ticket.payment_status !== 'PAID' || data.ticket.ticket_status !== 'VALID')) {
        setVerificationResult({
          status: 'UNPAID',
          message: `✕ UNPAID / INVALID TICKET: Payment is not completed for ticket ${extractedId}.`,
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
        message: 'Network error occurred during ticket verification. Please try again.',
      });
    } finally {
      setLoading(false);
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
            verifyAndCheckInTicket(scannedText);
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
        {/* Background Stage Rays */}
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
      {/* Background Lighting */}
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
              <h3 className="font-bebas text-2xl text-white uppercase flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" /> 1. QR SCANNER
              </h3>
              {cameraActive && (
                <button
                  onClick={() => {
                    stopCamera();
                    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
                    setTimeout(startCamera, 300);
                  }}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Flip Camera
                </button>
              )}
            </div>

            {/* Video Viewport Container */}
            <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-amber-500/40 min-h-[260px] flex items-center justify-center shadow-inner">
              <video ref={videoRef} className="w-full h-64 object-cover" />
              <canvas ref={canvasRef} className="hidden" />

              {!cameraActive ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-950/90">
                  <Camera className="w-12 h-12 text-slate-600" />
                  <p className="text-xs text-slate-400 max-w-xs">
                    Point smartphone camera at the attendee's digital QR pass for instant verification.
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-barlow font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4" /> START CAMERA SCANNER
                  </button>
                </div>
              ) : (
                <div className="absolute inset-4 border-2 border-dashed border-amber-400/80 rounded-xl pointer-events-none flex flex-col items-center justify-between p-3">
                  <div className="w-full flex justify-between text-[10px] text-amber-300 font-mono bg-black/60 px-2.5 py-1 rounded-full">
                    <span>LIVE GATE SCANNER</span>
                    <span className="text-emerald-400 animate-pulse">● SCANNING</span>
                  </div>
                  <div className="w-16 h-16 border-2 border-amber-400 rounded-lg animate-pulse" />
                  <span className="text-[10px] font-bold text-white bg-amber-500/80 px-3 py-1 rounded-full uppercase">
                    Align QR Code inside target frame
                  </span>
                </div>
              )}
            </div>

            {cameraActive && (
              <button
                onClick={stopCamera}
                className="w-full py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold text-xs uppercase transition-all"
              >
                STOP CAMERA
              </button>
            )}
          </div>

          {/* RIGHT COLUMN: MANUAL TICKET CODE INPUT (5 COLS) */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-amber-500/30 bg-slate-900/90 space-y-5 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-bebas text-2xl text-white uppercase flex items-center gap-2">
                  <Search className="w-5 h-5 text-amber-400" /> 2. MANUAL TICKET CODE
                </h3>
                <p className="text-xs text-slate-400">
                  Enter Ticket ID directly if QR scan is unavailable.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  verifyAndCheckInTicket(ticketIdInput);
                }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    Enter Ticket ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketIdInput}
                    onChange={(e) => setTicketIdInput(e.target.value)}
                    placeholder="e.g. GGLT123456"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm font-bold uppercase focus:outline-none focus:border-amber-500 transition-all placeholder:text-slate-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-barlow font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 text-black animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 text-black" />
                      <span>VERIFY TICKET</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-amber-400 uppercase block">Sample Demo Ticket ID:</span>
              <button
                onClick={() => {
                  setTicketIdInput('GGLT123456');
                  verifyAndCheckInTicket('GGLT123456');
                }}
                className="text-amber-300 font-mono font-bold hover:underline"
              >
                GGLT123456 (Click to verify demo)
              </button>
            </div>
          </div>

        </div>

        {/* VERIFICATION RESULT DISPLAY CARD */}
        {verificationResult.status !== 'IDLE' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-300">
            
            {/* SUCCESS STATE */}
            {verificationResult.status === 'SUCCESS' && verificationResult.ticket && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/60 bg-emerald-950/40 space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.25)]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-500/30 pb-4 text-center sm:text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 font-black text-xs uppercase tracking-widest font-barlow inline-block mb-1">
                        ✓ VERIFIED / ENTERED
                      </span>
                      <h2 className="font-bebas text-3xl sm:text-4xl text-emerald-300 uppercase tracking-wide">
                        ENTRY CONFIRMED & CONSUMED
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

                {/* Attendee Details Summary Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Ticket ID</span>
                    <span className="font-mono font-black text-amber-300 text-sm">{verificationResult.ticket.ticket_id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Attendee Name</span>
                    <span className="font-bold text-white text-sm">{verificationResult.ticket.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Status</span>
                    <span className="font-black text-emerald-400 uppercase text-sm">PAID (₹{verificationResult.ticket.amount})</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Entry Status</span>
                    <span className="font-black text-amber-300 uppercase text-sm">USED / ENTERED</span>
                  </div>
                </div>

                {/* Graphic Ticket Card Preview */}
                <TicketCard ticket={verificationResult.ticket} showActions={true} />
              </div>
            )}

            {/* ALREADY USED / DUPLICATE STATE */}
            {verificationResult.status === 'ALREADY_USED' && verificationResult.ticket && (
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border-2 border-red-500/70 bg-red-950/50 space-y-6 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-red-500/30 pb-4 text-center sm:text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400 shrink-0">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full bg-red-600/40 text-red-200 font-black text-xs uppercase tracking-widest font-barlow inline-block mb-1 animate-pulse">
                        ⚠️ ALREADY USED
                      </span>
                      <h2 className="font-bebas text-3xl sm:text-4xl text-red-300 uppercase tracking-wide">
                        DUPLICATE ENTRY REJECTED
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-red-500/40 text-slate-200 text-xs sm:text-sm space-y-2">
                  <p className="font-bold text-red-300">
                    This ticket ({verificationResult.ticket.ticket_id}) has ALREADY been used for entry.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div>
                      <span className="text-slate-400 uppercase block text-[10px]">Attendee:</span>
                      <span className="font-bold text-white">{verificationResult.ticket.customer_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase block text-[10px]">First Checked-In At:</span>
                      <span className="font-mono font-bold text-amber-300">
                        {verificationResult.ticket.checked_in_at ? new Date(verificationResult.ticket.checked_in_at).toLocaleString('en-IN') : 'Earlier Session'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase block text-[10px]">Status:</span>
                      <span className="font-black text-red-400 uppercase">USED / ENTERED</span>
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
                    <h3 className="font-bebas text-2xl text-red-400 uppercase">✕ UNPAID / PENDING PAYMENT</h3>
                    <p className="text-xs text-slate-300">
                      This ticket cannot be verified because payment is not completed.
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
