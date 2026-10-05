import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";


function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
}

function FacebookIcon({ className = "w-5 h-5" }: { className?: string }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
}

function YoutubeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.7V8.3l6.4 3.7-6.4 3.7Z"/></svg>;
}

function XIcon({ className = "w-5 h-5" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.964 6.817H1.683l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>;
}

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
        <p className="text-xs sm:text-sm text-slate-300">Got questions about tickets, performer auditions, or sponsorship? Contact the GGL team directly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 space-y-6">
          <h3 className="text-xl font-bold text-amber-400 border-b border-slate-800 pb-3">Official Communication Channels</h3>

          <div className="space-y-4 text-sm text-slate-200">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-white font-bold">Show Venue Address:</strong>
                <p className="text-xs text-slate-300">Announce Soon, Gorakhpur, Uttar Pradesh</p>
                <a
                  href="https://maps.google.com/?q=26.828049,83.414894"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold mt-1 hover:underline"
                >
                  View Location on Google Maps ↗
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-white font-bold">Email Support:</strong>
                <a href="mailto:help.gglatent@gmail.com" className="text-xs text-amber-300 font-mono hover:underline">help.gglatent@gmail.com</a>
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
            <div className="grid grid-cols-2 gap-3">
              <a href="https://www.instagram.com/gkp_got_latent/" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 hover:text-white" aria-label="Instagram">
                <InstagramIcon className="w-5 h-5" /><span className="text-xs font-bold">Instagram</span>
              </a>
              <a href="https://www.youtube.com/@GkpGotLatent" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 hover:text-white" aria-label="YouTube">
                <YoutubeIcon className="w-5 h-5" /><span className="text-xs font-bold">YouTube</span>
              </a>
              <a href="https://www.facebook.com/people/Gorakhpurs-Got-Latent/61593154024693/" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 hover:text-white" aria-label="Facebook">
                <FacebookIcon className="w-5 h-5" /><span className="text-xs font-bold">Facebook</span>
              </a>
              <a href="https://x.com/gkpgotlatent" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 hover:text-white" aria-label="X">
                <XIcon className="w-5 h-5" /><span className="text-xs font-bold">X</span>
              </a>
            </div>
            <a href="https://whatsapp.com/channel/0029Vb91ZX43bbUzFYcP220S" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20">
              <MessageCircle className="w-5 h-5" /><span className="text-xs font-bold">Join Official WhatsApp Channel</span>
            </a>
          </div>
        </div>

        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-amber-500/30 space-y-5 flex flex-col">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Need Immediate Help?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              For tickets, auditions, applications, payments, or any other query, contact the GGL team directly using the official channels.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <a
              href="https://wa.me/918423858424"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              CONTACT ON WHATSAPP
            </a>
            <a
              href="mailto:help.gglatent@gmail.com"
              className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all border border-slate-700"
            >
              EMAIL GGL SUPPORT
            </a>
          </div>

          <Link
            href="/book-ticket"
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            BOOK SHOW TICKETS — ₹149
          </Link>
        </div>
      </div>
    </div>
  );
}
