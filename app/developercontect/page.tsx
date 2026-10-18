import { Mail, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact the Developer | Gorakhpur's Got Latent",
  description: "Contact the developer of Gorakhpur's Got Latent for website support and technical queries.",
};

function XIcon({ className = "w-5 h-5" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.964 6.817H1.683l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>;
}

const contactLinks = [
  { label: "Instagram", href: "https://www.instagram.com/aloksingh_._/", icon: "IG", style: "hover:border-pink-500/50 hover:text-pink-300" },
  { label: "X", href: "https://x.com/rajpratapsinghh", icon: "𝕏", style: "hover:border-slate-500 hover:text-white" },
  { label: "Facebook", href: "https://www.facebook.com/meadorush", icon: "f", style: "hover:border-blue-500/50 hover:text-blue-300" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/alok-singh-8102a8414/", icon: "in", style: "hover:border-sky-500/50 hover:text-sky-300" },
];

export default function DeveloperContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="glass-panel overflow-hidden rounded-3xl border border-amber-500/25">
        <div className="border-b border-slate-800 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent px-6 py-8 sm:px-10">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-amber-400">GGL • Technical Support</p>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">Contact the Developer</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Need to report a website issue, share a technical suggestion, or ask about the website? Get in touch directly.</p>
        </div>

        <div className="space-y-6 p-6 sm:p-10">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a href="mailto:infoo.alok@gmail.com?subject=GGL%20Website%20Technical%20Support" className="group flex items-center gap-4 rounded-2xl border border-slate-700 bg-slate-950/50 p-5 transition hover:border-amber-500/50">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400"><Mail className="h-5 w-5" /></span>
              <span className="min-w-0"><span className="block text-xs text-slate-400">Email</span><span className="mt-1 block break-all text-sm font-semibold text-white">infoo.alok@gmail.com</span></span>
            </a>
            <a href="https://wa.me/917380869635?text=Hi%20Alok%2C%20I%20need%20help%20with%20the%20GGL%20website." target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-2xl border border-slate-700 bg-slate-950/50 p-5 transition hover:border-emerald-500/50">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400"><MessageCircle className="h-5 w-5" /></span>
              <span><span className="block text-xs text-slate-400">WhatsApp</span><span className="mt-1 block text-sm font-semibold text-white">+91 73808 69635</span></span>
            </a>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h2 className="mb-1 text-lg font-bold text-white">Connect on social media</h2>
            <p className="mb-4 text-sm text-slate-400">Choose a profile to open the developer's social page.</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {contactLinks.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className={`flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-3 text-sm font-semibold text-slate-200 transition ${item.style}`}>
                  {<span className="text-xs font-black">{item.icon}</span>}
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <p className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-xs leading-5 text-slate-400">For show tickets, auditions, sponsorships, or event enquiries, please use the official GGL contact channels instead.</p>
        </div>
      </section>
    </main>
  );
}
