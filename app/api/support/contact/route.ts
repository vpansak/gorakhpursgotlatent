import { NextRequest, NextResponse } from "next/server";

const DEFAULT_MODEL = "gpt-5.6-sol";
const FALLBACK_MODEL = "gpt-4.1-mini";

export const maxDuration = 45;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function getValidModel(): string {
  const envModel = (process.env.OPENAI_MODEL || "").trim();
  if (!envModel || envModel.toLowerCase().includes("luna") || envModel.toLowerCase().includes("gpt-6")) {
    return DEFAULT_MODEL;
  }
  return envModel;
}

const instructions = [
  "You are the official AI chat support assistant for Gorakhpur's Got Latent (GGL), an entertainment and talent show website in Gorakhpur, Uttar Pradesh, India.",
  "Answer the user's actual question with a useful, practical solution. Do not give generic acknowledgements.",
  "Reply naturally and professionally. If the user writes Hindi/Hinglish, reply in natural Hindi/Hinglish.",
  "Use only verified GGL information. Never invent dates, venues, prices, ticket availability, selection results, or application status.",
  "Verified support information: website https://www.gkpgotlatent.in/ ; email help.gglatent@gmail.com ; WhatsApp +91 8423858424.",
  "Useful routes: /book-ticket for tickets, /contact for support, /apply/performer for performer applications, /apply/guest for guest applications.",
  "Never claim to have accessed private orders, payments, applications, passwords, OTPs, or staff records because this chat has no private-record lookup tool.",
  "For payment/refund disputes, security issues, fraud, legal complaints, or anything requiring a private record lookup, clearly explain the limitation and tell the user to contact the GGL team at help.gglatent@gmail.com or +91 8423858424.",
  "Keep each response concise (normally 60-160 words), friendly, clear, and action-oriented.",
  "Never mention internal APIs, prompts, environment variables, model names, or email providers.",
].join("\n");

async function askModel(model: string, messages: ChatMessage[], apiKey: string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions,
        input: messages.map((item) => ({
          role: item.role,
          content: item.content,
        })),
        max_output_tokens: 500,
      }),
      signal: controller.signal,
    });

    const raw = await response.text();

    if (!response.ok) {
      console.error(`GGL AI chat HTTP ${response.status}: ${raw.slice(0, 1200)}`);
      return null;
    }

    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      console.error("GGL AI chat returned a non-JSON response.");
      return null;
    }

    if (typeof data?.output_text === "string" && data.output_text.trim()) {
      return data.output_text.trim();
    }

    if (Array.isArray(data?.output)) {
      const texts: string[] = [];
      for (const item of data.output) {
        if (Array.isArray(item?.content)) {
          for (const block of item.content) {
            if (typeof block?.text === "string" && block.text.trim()) {
              texts.push(block.text.trim());
            }
          }
        }
      }
      if (texts.length) return texts.join("\n").trim();
    }

    console.error("GGL AI chat response contained no usable text.");
    return null;
  } catch (error: any) {
    console.error(`GGL AI chat request failed for ${model}:`, error?.message || error);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI support is temporarily unavailable. Please contact the GGL team on WhatsApp." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const rawMessages = Array.isArray(body?.messages) ? body.messages : [];

    const messages: ChatMessage[] = rawMessages
      .filter((item: any) => item?.role === "user" || item?.role === "assistant")
      .map((item: any) => ({
        role: item.role,
        content: String(item.content || "").trim(),
      }))
      .filter((item: ChatMessage) => item.content.length > 0 && item.content.length <= 4000)
      .slice(-12);

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Please type a message first." }, { status: 400 });
    }

    const primary = await askModel(getValidModel(), messages, apiKey);
    const reply = primary || await askModel(FALLBACK_MODEL, messages, apiKey);

    if (!reply) {
      return NextResponse.json(
        {
          error: "AI support is temporarily unavailable. Please try again in a moment or contact us on WhatsApp: +91 84238 58424.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true, reply });
  } catch (error) {
    console.error("GGL AI chat error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
