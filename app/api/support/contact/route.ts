import { NextRequest, NextResponse } from "next/server";

const SUPPORT_EMAIL = "alooksingh1@gmail.com";
const DEFAULT_MODEL = "gpt-6-luna";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function generateAiReply(name: string, email: string, message: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("AI support is not configured yet.");

  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;

  const instructions = [
    "You are the official AI support assistant for Gorakhpur's Got Latent (GGL), an entertainment/talent event website in Gorakhpur, Uttar Pradesh, India.",
    "Reply in a friendly, concise and professional style. Use simple English unless the visitor writes in Hindi/Hinglish, then reply naturally in Hindi/Hinglish.",
    "You may explain general website navigation, ticket booking basics, performer applications, guest applications, sponsorship, careers/join-team, and contact/support information.",
    "Known official support details: WhatsApp +91 8423858424, email help.gglatent@gmail.com, website https://www.gkpgotlatent.in/.",
    "Never invent ticket availability, payment status, refunds, application status, venue details, selection decisions, private records, passwords, OTPs, or staff actions.",
    "For payment/refund disputes, security concerns, legal complaints, abusive threats, requests for private data, or anything requiring account/order lookup, clearly say the GGL team will review it.",
    "Do not claim that you personally accessed an order or application database.",
    "Keep the reply under 180 words and make the next step obvious.",
  ].join("\n");

  const prompt = `Visitor name: ${name}
Visitor email: ${email}

Visitor message:
${message}`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions,
      input: [{ role: "user", content: prompt }],
      max_output_tokens: 300,
    }),
  });

  if (!response.ok) {
    throw new Error("AI support service is temporarily unavailable.");
  }

  const data = await response.json();
  const output = typeof data?.output_text === "string" ? data.output_text.trim() : "";

  if (!output) throw new Error("AI support returned an empty response.");
  return output;
}

async function sendEmail(to: string, subject: string, bodyText: string) {
  const apiKey = process.env.PRIMITIVE_API_KEY;
  const from = process.env.PRIMITIVE_FROM_EMAIL || "agent@raw-trout.primitive.email";

  if (!apiKey) throw new Error("Email support is not configured yet.");

  const bodyHtml = `
    <div style="font-family:Arial,sans-serif;background:#050505;padding:28px;color:#f8fafc">
      <div style="max-width:640px;margin:auto;background:#0f172a;border:1px solid #7a5510;border-radius:16px;padding:28px">
        <h2 style="margin:0 0 18px;color:#fbbf24">Gorakhpur's Got Latent</h2>
        <div style="font-size:15px;line-height:1.7;white-space:pre-wrap">${escapeHtml(bodyText)}</div>
        <hr style="border:0;border-top:1px solid #334155;margin:24px 0">
        <p style="margin:0;color:#94a3b8;font-size:12px">AI Support • gkpgotlatent.in</p>
      </div>
    </div>
  `;

  const response = await fetch("https://api.primitive.dev/v1/send-mail", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: ["help.gglatent@gmail.com"],
      subject,
      body_text: bodyText,
      body_html: bodyHtml,
    }),
  });

  if (!response.ok) {
    throw new Error("Support email could not be delivered.");
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const message = String(body?.message || "").trim();

    if (!name || name.length > 80) {
      return NextResponse.json({ error: "Please enter a valid name." }, { status: 400 });
    }

    if (!isValidEmail(email) || email.length > 160) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (message.length < 5 || message.length > 4000) {
      return NextResponse.json({ error: "Please enter a message between 5 and 4000 characters." }, { status: 400 });
    }

    const aiReply = await generateAiReply(name, email, message);

    await sendEmail(
      email,
      "GGL Support — AI Reply to Your Request",
      `Hi ${name},

Thanks for contacting Gorakhpur's Got Latent.

${aiReply}

If your issue involves a payment, refund, security matter or something the AI cannot resolve, please reply to this email or contact our support team at help.gglatent@gmail.com / +91 8423858424.

Regards,
Gorakhpur's Got Latent AI Support`
    );

    const needsHuman = /payment|refund|security|hack|fraud|legal|police|complaint|angry|threat|cannot resolve|team will review/i.test(
      `${message}\n${aiReply}`
    );

    if (needsHuman && process.env.PRIMITIVE_API_KEY) {
      await sendEmail(
        SUPPORT_EMAIL,
        `GGL AI Support Escalation — ${name}`,
        `A support request was escalated for human review.

Name: ${name}
Email: ${email}

Message:
${message}

AI reply:
${aiReply}`
      ).catch(() => undefined);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("GGL support error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to process your request." },
      { status: 500 }
    );
  }
}
