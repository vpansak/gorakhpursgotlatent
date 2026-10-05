import { NextRequest, NextResponse } from "next/server";
import { sendNitrosendEmail } from "@/lib/emailjs";

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

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function supportEmailHtml(name: string, aiReply: string, needsHuman: boolean): string {
  const logoUrl = "https://www.gkpgotlatent.in/logo-transparent.png";
  const status = needsHuman ? "HUMAN REVIEW FLAGGED" : "AI SUPPORT RESPONSE";
  const statusColor = needsHuman ? "#ff7b7b" : "#f2c14e";
  const replyHtml = escapeHtml(aiReply).replace(/\n/g, "<br>");
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>GGL AI Support</title>
</head>
<body style="margin:0;padding:0;background:#08090d;font-family:Arial,Helvetica,sans-serif;color:#f7f7f7;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Gorakhpur's Got Latent support response</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#08090d;">
    <tr><td align="center" style="padding:16px 8px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#101116;border:1px solid #30240d;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:20px 16px;text-align:center;background:#0d0d10;border-bottom:1px solid #3a2b0e;">
          <img src="${logoUrl}" alt="Gorakhpur's Got Latent" width="82" style="display:block;width:82px;height:auto;margin:0 auto 9px;border:0;">
          <div style="font-size:11px;line-height:15px;letter-spacing:2px;color:#f2c14e;font-weight:800;">GORAKHPUR'S GOT LATENT</div>
          <div style="margin-top:6px;font-size:9px;line-height:14px;letter-spacing:1px;color:#858892;">OFFICIAL SUPPORT</div>
        </td></tr>
        <tr><td style="padding:18px 16px 8px;">
          <div style="display:inline-block;padding:5px 8px;border:1px solid #5d4612;border-radius:999px;background:#191408;color:${statusColor};font-size:9px;line-height:12px;font-weight:800;letter-spacing:.8px;">${status}</div>
          <div style="margin-top:11px;font-size:21px;line-height:27px;font-weight:900;color:#fff;">Hi ${escapeHtml(name)},</div>
          <div style="margin-top:5px;font-size:13px;line-height:20px;color:#a9abb3;">Here is the response to your GGL support request.</div>
        </td></tr>
        <tr><td style="padding:10px 16px 18px;">
          <div style="background:#0a0b0f;border:1px solid #292b32;border-radius:13px;padding:14px 13px;font-size:14px;line-height:22px;color:#e7e7ea;word-break:break-word;overflow-wrap:anywhere;">${replyHtml}</div>
        </td></tr>
        <tr><td style="padding:0 16px 20px;text-align:center;">
          <a href="https://www.gkpgotlatent.in/contact" style="display:inline-block;background:#f2c14e;color:#090a0d;text-decoration:none;font-size:13px;line-height:18px;font-weight:900;padding:12px 20px;border-radius:10px;">OPEN GGL SUPPORT</a>
        </td></tr>
        <tr><td style="padding:16px;background:#0b0c0f;border-top:1px solid #25262c;text-align:center;">
          <div style="font-size:11px;line-height:18px;color:#92949d;">Need further help?</div>
          <div style="margin-top:3px;font-size:12px;line-height:19px;">
            <a href="mailto:help.gglatent@gmail.com" style="color:#f2c14e;text-decoration:none;font-weight:800;">help.gglatent@gmail.com</a>
          </div>
          <div style="margin-top:4px;font-size:11px;line-height:18px;color:#777a83;">WhatsApp: +91 84238 58424</div>
          <div style="margin-top:7px;font-size:10px;line-height:16px;color:#62646c;">© Gorakhpur's Got Latent • Official Support Email</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
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

    const visitorEmail = await sendNitrosendEmail(
      email,
      emailSubject,
      emailBody,
      supportEmailHtml(name, aiReply, needsHuman)
    );

    if (!visitorEmail.success) {
      console.error("GGL visitor support email failed:", visitorEmail.message);
      return NextResponse.json(
        { error: visitorEmail.message || "Support email could not be sent. Please try again or contact help.gglatent@gmail.com." },
        { status: 503 }
      );
    }

    const adminBody = `A new request was submitted on the GGL /contact page.

Name: ${name}
Email: ${email}
Human review required: ${needsHuman ? "YES" : "NO"}

Visitor issue:
${message}

AI reply sent to visitor:
${aiReply}

This notification is for the GGL team/owner records.`;

    const adminEmail = await sendNitrosendEmail(
      SUPPORT_EMAIL,
      `GGL AI Support — New Request from ${name}`,
      adminBody,
      supportEmailHtml("GGL Admin Team", `Visitor: ${name}\nEmail: ${email}\n\nVisitor issue:\n${message}\n\nAI reply:\n${aiReply}`, needsHuman)
    );

    if (!adminEmail.success) {
      console.error("GGL admin support notification failed:", adminEmail.message);
      return NextResponse.json({ ok: true, aiGenerated, escalated: needsHuman, adminNotified: false }, { status: 200 });
    }

    return NextResponse.json({ ok: true, aiGenerated, escalated: needsHuman, adminNotified: true });
  } catch (error) {
    console.error("GGL support error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to process your request." }, { status: 500 });
  }
}
