"use client";

import { FormEvent, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const welcomeMessage =
  "Hi! 👋 Main GGL AI Support hoon. Tickets, auditions, sponsorships, applications ya website se related koi bhi question poochho.";

export default function SupportForm() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: welcomeMessage },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(event?: FormEvent) {
    event?.preventDefault();

    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/support/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "AI support is temporarily unavailable.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: String(result.reply || "Sorry, I could not generate a reply.") },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  }

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-[#080a10] overflow-hidden shadow-2xl">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-[#0d1018]">
        <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
          <Bot className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-black text-white">GGL AI Support</div>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI CHAT • ONLINE
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-amber-400 ml-auto" />
      </div>

      <div className="h-[330px] overflow-y-auto p-3 sm:p-4 space-y-3">
        {messages.map((item, index) => (
          <div
            key={index}
            className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={
                item.role === "user"
                  ? "max-w-[86%] rounded-2xl rounded-br-md bg-amber-500 text-black px-3.5 py-2.5 text-sm leading-5 font-medium"
                  : "max-w-[90%] rounded-2xl rounded-bl-md bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-sm leading-5 text-slate-200"
              }
            >
              {item.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-slate-900 border border-slate-700 px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                AI is typing…
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mx-3 mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="border-t border-slate-800 bg-[#0b0d13] p-3">
        <div className="flex items-end gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 p-2 focus-within:border-amber-400/70">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value.slice(0, 2000))}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Type your question…"
            aria-label="Ask GGL AI Support"
            className="min-h-[42px] max-h-28 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white placeholder:text-slate-500 outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-10 h-10 shrink-0 rounded-xl bg-amber-500 text-black flex items-center justify-center transition hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
            title="Send message"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="mt-2 text-[10px] leading-4 text-slate-500 text-center">
          AI answers general GGL questions. For payment, security or private-record issues, contact the team directly.
        </p>
      </form>
    </div>
  );
}
