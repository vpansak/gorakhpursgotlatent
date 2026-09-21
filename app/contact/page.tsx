import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, Video, Share2, Clock, ShieldCheck } from 'lucide-react';

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
                <span className="text-xs text-amber-300 font-mono">contact@ggllive.in</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-white font-bold">Phone / WhatsApp Support:</strong>
                <span className="text-xs text-amber-300 font-mono">+91 98765 43210</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Official Social Channels</span>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com/gorakhpur_got_latent" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 hover:text-white">
                <Globe className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@gorakhpurgotlatent" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 hover:text-white">
                <Video className="w-5 h-5" />
              </a>
              <a href="https://x.com/ggllive" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 hover:text-white">
                <Share2 className="w-5 h-5" />
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
            <Link href="/tickets" className="w-full py-3.5 rounded-xl bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2">
              BOOK TICKETS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
