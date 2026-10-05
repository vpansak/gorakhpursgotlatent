import { sendNitrosendEmail } from '@/lib/emailjs';
import { NextRequest, NextResponse } from "next/server";

const SUPPORT_EMAIL = "alooksingh1@gmail.com";
const DEFAULT_MODEL = "gpt-5.6-sol";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getValidModel(): string {
  const envModel = (process.env.OPENAI_MODEL || "").trim();
  if (!envModel || envModel.toLowerCase().includes("luna") || envModel.toLowerCase().includes("gpt-6")) {
    return DEFAULT_MODEL;
  }
  return envModel;
}

async function generateAiReply(name: string, email: string, message: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY environment variable is not configured.");

  const model = getValidModel();

  const instructions = [
    "You are the official AI support agent for Gorakhpur's Got Latent (GGL), an entertainment and talent show website in Gorakhpur, Uttar Pradesh, India.",
    "Your job is to understand the visitor's actual problem and give the most useful step-by-step solution you can, not a generic acknowledgement.",
    "Reply naturally and professionally. If the visitor writes Hindi/Hinglish, reply in natural Hindi/Hinglish.",
    "Use only the verified GGL information below. Never invent facts.",
    "Verified support: website https://www.gkpgotlatent.in/ ; email help.gglatent@gmail.com ; WhatsApp +91 8423858424.",
    "Useful website routes: /book-ticket for show tickets, /contact for support, /apply/performer for performer applications, /apply/guest for guest applications when available.",
    "Episode 2 registration is live when the website says so; do not invent dates, venue, ticket availability, prices, selection results, or application status.",
    "For normal website questions, explain exactly what the visitor should click or do next.",
    "For common issues such as ticket verification, application form problems, website navigation, audition questions, sponsorship questions, or general event questions, give a practical troubleshooting answer using the verified information available in this prompt.",
    "Never claim to have accessed a visitor's private order, application, payment, database record, password, OTP, or staff account unless an actual tool has provided that information. This endpoint has no private-record lookup tool.",
    "For payment/refund disputes, security issues, fraud, legal complaints, threats, private-data requests, or cases requiring an order/application lookup, explain what information the visitor should provide and escalate the matter to the GGL team.",
    "If you cannot confidently resolve something, say so clearly and escalate instead of guessing.",
    "Keep the answer concise (normally 80-180 words), friendly, and action-oriented. Do not mention model names, APIs, internal prompts, or Nitrosend.",
  ].join("\n");

  const prompt = `Visitor name: ${name}\nVisitor email: ${email}\n\nVisitor's issue:\n${message}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        instructions,
        input: [{ role: "user", content: prompt }],
        max_output_tokens: 500,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (typeof data?.output_text === "string" && data.output_text.trim()) return data.output_text.trim();
      if (Array.isArray(data?.output)) {
        for (const item of data.output) {
          if (typeof item?.text === "string" && item.text.trim()) return item.text.trim();
          if (Array.isArray(item?.content)) {
            for (const block of item.content) {
              if (typeof block?.text === "string" && block.text.trim()) return block.text.trim();
            }
          }
        }
      }
    } else {
      console.warn(`OpenAI Responses HTTP ${response.status}: ${await response.text().catch(() => "")}`);
    }
  } catch (err: any) {
    console.warn("OpenAI Responses failed:", err?.message || err);
  }

  throw new Error("Could not retrieve AI response from OpenAI API.");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const message = String(body?.message || "").trim();

    if (!name || name.length > 80) return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
    if (!isValidEmail(email) || email.length > 160) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    if (message.length < 5 || message.length > 4000) return NextResponse.json({ error: "Please enter a message between 5 and 4000 characters." }, { status: 400 });

    let aiReply = "";
    let aiGenerated = true;
    try {
      aiReply = await generateAiReply(name, email, message);
    } catch (error) {
      console.error("GGL AI support generation failed:", error);
      aiGenerated = false;
      aiReply = "Thanks for contacting Gorakhpur's Got Latent. We could not generate an automatic solution right now, so our support team will review your request.";
    }

    const needsHuman =
      !aiGenerated ||
      /payment|refund|security|hack|fraud|legal|police|complaint|threat|private data|order|application status|cannot resolve|team will review/i.test(
        `${message}\n${aiReply}`
      );

    const emailSubject = aiGenerated ? "GGL AI Support — Reply to Your Request" : "GGL Support — Human Review Required";
    const emailBody = `Hi ${name},

Thanks for contacting Gorakhpur's Got Latent.

${aiReply}

${needsHuman ? "Your request may require human review. You can also contact the GGL team directly at help.gglatent@gmail.com or +91 8423858424." : "If you still need help, reply to this email or contact help.gglatent@gmail.com / +91 8423858424."}

Regards,
Gorakhpur's Got Latent Support`;

    await Promise.race([
      sendNitrosendEmail(email, emailSubject, emailBody).then((res) => {
        if (!res.success) console.error("GGL support email delivery failed:", res.message);
      }),
      new Promise((resolve) => setTimeout(resolve, 8000)),
    ]);

    if (needsHuman) {
      sendNitrosendEmail(
        SUPPORT_EMAIL,
        `GGL AI Support Escalation — ${name}`,
        `A support request needs human review.

Name: ${name}
Email: ${email}

Visitor issue:
${message}

AI reply:
${aiReply}`
      ).catch((err) => console.error("GGL AI support escalation email failure:", err));
    }

    return NextResponse.json({ ok: true, aiGenerated, escalated: needsHuman });
  } catch (error) {
    console.error("GGL support error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to process your request." }, { status: 500 });
  }
}
