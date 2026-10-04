"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

export default function SupportForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/support/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") || "").trim(),
          email: String(data.get("email") || "").trim(),
          message: String(data.get("message") || "").trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Unable to send your message.");
      }

      form.reset();
      setStatus("success");
      setMessage("Message received! Our AI support assistant has sent a reply to your email.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  const messageStyle =
    status === "success"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : "border-red-500/30 bg-red-500/10 text-red-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="support-name" className="block text-xs font-bold text-slate-300 mb-1.5">
            Your Name
          </label>
          <input
            id="support-name"
            name="name"
            type="text"
            required
            maxLength={80}
            placeholder="Enter your name"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
          />
        </div>

        <div>
          <label htmlFor="support-email" className="block text-xs font-bold text-slate-300 mb-1.5">
            Email Address
          </label>
          <input
            id="support-email"
            name="email"
            type="email"
            required
            maxLength={160}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
          />
        </div>
      </div>

      <div>
        <label htmlFor="support-message" className="block text-xs font-bold text-slate-300 mb-1.5">
          How can we help?
        </label>
        <textarea
          id="support-message"
          name="message"
          required
          minLength={5}
          maxLength={4000}
          rows={5}
          placeholder="Tell us your issue, ticket question, audition query, sponsorship question, etc."
          className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            AI SUPPORT IS REPLYING…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            GET AI SUPPORT
          </>
        )}
      </button>

      {message && (
        <div className={`rounded-xl border px-4 py-3 text-xs font-semibold flex items-start gap-2 ${messageStyle}`}>
          {status === "success" && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
          <span>{message}</span>
        </div>
      )}

      <p className="text-[11px] text-slate-500 leading-relaxed">
        AI support can answer general questions about tickets, auditions, sponsorships and the website.
        Payment disputes, security issues and cases the AI cannot confidently resolve may be escalated to our team.
      </p>
    </form>
  );
}
