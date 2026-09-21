import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function FacebookIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-white">Contact & Event Location</h1>
        <p className="text-xs sm:text-sm text-slate-300">Got questions about tickets, performer auditions, or sponsorship? Reach out to our team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Contact Info */}
        <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 space-y-6">
          <h3 className="text-xl font-bold text-amber-400 border-b border-slate-800 pb-3">Official Communication Channels</h3>

          <div className="space-y-4 text-sm text-slate-200">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-white font-bold">Show Venue Address:</strong>
                <p className="text-xs text-slate-300">Gorakhpur Club Ground, Civil Lines, Near Town Hall, Gorakhpur, Uttar Pradesh 273001</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-white font-bold">Email Support:</strong>
                <a href="mailto:Gkpgotlatent@gmail.com" className="text-xs text-amber-300 font-mono hover:underline">Gkpgotlatent@gmail.com</a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-white font-bold">Phone / WhatsApp Support:</strong>
                <a href="tel:+918423858424" className="text-xs text-amber-300 font-mono hover:underline">+91 8423858424</a>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Official Social Channels</span>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/gkp_got_latent/" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 hover:text-white" aria-label="Instagram">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61593154024693" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 hover:text-white" aria-label="Facebook">
                <FacebookIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Links */}
        <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Need Immediate Help?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              For application status updates, please use your unique Application ID (`GGL-PER-*`, `GGL-GST-*`, `GGL-SPN-*`, `GGL-EVT-*`) on the live tracking tool.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/track" className="w-full py-3.5 rounded-xl bg-amber-500 text-black font-extrabold text-sm flex items-center justify-center gap-2">
              TRACK APPLICATION STATUS
            </Link>
            <a
              href="https://in.bookmyshow.com/events/gorakhpur-got-latent/ET00518139?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-xl bg-slate-800 text-amber-400 font-bold text-sm flex items-center justify-center gap-2"
            >
              BOOK TICKETS ON BOOKMYSHOW ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
