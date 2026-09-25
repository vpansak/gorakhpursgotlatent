import Link from 'next/link';
import {
  FileQuestion, Mic2, Ticket, Search, HelpCircle, Phone, Mail,
  ArrowRight, Home, ShieldCheck, FileText, Users, Building2
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

export default function NotFound() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 min-h-[80vh] flex flex-col justify-center">
      {/* 1. TOP HEADER & 404 BADGE */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(255,215,0,0.15)]">
          <FileQuestion className="w-4 h-4 text-amber-400" /> 404 - PAGE NOT FOUND
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          Oops! Page Not Found
        </h1>
        
        <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
          The link or URL you typed does not exist or has been moved. You can apply for performance in Episode 2 below or get help instantly!
        </p>
      </div>

      {/* 2. PRIMARY CTA: APPLY FOR PERFORMANCE IN EPISODE 2 */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-orange-950/40 border-2 border-amber-500/40 shadow-[0_0_30px_rgba(255,215,0,0.15)] text-center space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl bg-amber-500 text-black font-extrabold text-[10px] uppercase tracking-wider">
          Auditions Open
        </div>

        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
          <Mic2 className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Apply for Performance in Episode 2
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Fill the registration form now to reserve your audition slot for Episode 2.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/apply/performer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:scale-105 transition-all"
          >
            <span>FILL EPISODE 2 REGISTRATION FORM</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </div>

      {/* 3. HELPFUL ARTICLES & QUICK LINKS */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>Helpful Articles & Quick Links</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="https://in.bookmyshow.com/events/gorakhpur-got-latent/ET00518139?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
            target="_blank"
            rel="noreferrer"
            className="glass-card p-4 rounded-2xl border border-red-500/30 hover:border-red-400 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-red-400">
              <span className="flex items-center gap-1.5"><Ticket className="w-4 h-4" /> Book Tickets</span>
              <span className="group-hover:translate-x-1 transition-transform">↗</span>
            </div>
            <p className="text-xs text-slate-300">Book live audience passes on BookMyShow.</p>
          </a>

          <Link
            href="/track"
            className="glass-card p-4 rounded-2xl border border-amber-500/20 hover:border-amber-400 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span className="flex items-center gap-1.5"><Search className="w-4 h-4" /> Track Application</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
            <p className="text-xs text-slate-300">Check status using your Application ID.</p>
          </Link>

          <Link
            href="/apply/sponsor"
            className="glass-card p-4 rounded-2xl border border-blue-500/20 hover:border-blue-400 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-blue-300">
              <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Brand Sponsorship</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
            <p className="text-xs text-slate-300">Submit brand details for show sponsorship.</p>
          </Link>

          <Link
            href="/apply/join-team"
            className="glass-card p-4 rounded-2xl border border-purple-500/20 hover:border-purple-400 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-purple-300">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Join Team</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
            <p className="text-xs text-slate-300">Apply as crew member or show volunteer.</p>
          </Link>

          <Link
            href="/refund-policy"
            className="glass-card p-4 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> Ticket & Refund Policy</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
            <p className="text-xs text-slate-400">Read rules regarding tickets & refunds.</p>
          </Link>

          <Link
            href="/terms"
            className="glass-card p-4 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Terms & Guidelines</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
            <p className="text-xs text-slate-400">Show rules & venue entry guidelines.</p>
          </Link>
        </div>
      </div>

      {/* 4. DIRECT CONTACT SUPPORT */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/20 space-y-4">
        <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider">
          NEED IMMEDIATE ASSISTANCE? CONTACT OUR SUPPORT TEAM
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* WhatsApp / Phone */}
          <a
            href="https://wa.me/918423858424"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400 transition-all flex items-center gap-3 text-emerald-300 group"
          >
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">WhatsApp / Call Support</span>
              <strong className="text-sm text-white group-hover:text-emerald-300 transition-colors">+91 84238 58424</strong>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:help@gkpgotlatent.in"
            className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:border-blue-400 transition-all flex items-center gap-3 text-blue-300 group"
          >
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Official Support Email</span>
              <strong className="text-sm text-white group-hover:text-blue-300 transition-colors">help@gkpgotlatent.in</strong>
            </div>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/gkp_got_latent/"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/30 hover:border-pink-400 transition-all flex items-center gap-3 text-pink-300 group"
          >
            <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 shrink-0">
              <InstagramIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Official Instagram</span>
              <strong className="text-sm text-white group-hover:text-pink-300 transition-colors">@gkp_got_latent</strong>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
