import { sendNitrosendEmail } from '@/lib/emailjs';
import { NextRequest, NextResponse } from "next/server";

const SUPPORT_EMAIL = "alooksingh1@gmail.com";
const DEFAULT_MODEL = "gpt-4o-mini";

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
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not configured.");
  }

  const model = getValidModel();

  const instructions = [
    "You are the official AI support assistant for Gorakhpur's Got Latent (GGL), an entertainment and talent show event website in Gorakhpur, Uttar Pradesh, India.",
    "Reply in a friendly, concise, helpful, and professional style.",
    "If the visitor writes in Hindi or Hinglish, reply naturally in Hindi or Hinglish.",
    "You may explain general website navigation, ticket booking basics, performer applications, guest applications, sponsorship, careers/join-team, and contact/support information.",
    "Known official support details: WhatsApp +91 8423858424, email help.gglatent@gmail.com, website https://www.gkpgotlatent.in/.",
    "STRICT GUIDELINES:",
    "1. Never invent ticket availability, payment status, refunds, application status, venue details, selection decisions, private records, passwords, OTPs, or staff actions.",
    "2. For payment/refund disputes, security concerns, legal complaints, abusive threats, requests for private data, or anything requiring account/order lookup, clearly say the GGL team will review it.",
    "3. Do not claim that you personally accessed an order or application database.",
    "4. Keep the reply under 180 words and make the next steps clear.",
  ].join("\n");

  const prompt = `Visitor name: ${name}\nVisitor email: ${email}\n\nVisitor message:\n${message}`;

  // Primary attempt: OpenAI Responses API (v1/responses)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

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
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      let outputText = "";

      if (typeof data?.output_text === "string" && data.output_text.trim()) {
        outputText = data.output_text.trim();
      } else if (Array.isArray(data?.output)) {
        for (const item of data.output) {
          if (typeof item?.text === "string" && item.text.trim()) {
            outputText = item.text.trim();
            break;
          }
          if (Array.isArray(item?.content)) {
            for (const contentBlock of item.content) {
              if (typeof contentBlock?.text === "string" && contentBlock.text.trim()) {
                outputText = contentBlock.text.trim();
                break;
              }
            }
          }
        }
      } else if (data?.choices?.[0]?.message?.content) {
        outputText = String(data.choices[0].message.content).trim();
      }

      if (outputText) return outputText;
    } else {
      const errText = await response.text().catch(() => "");
      console.warn(`OpenAI /v1/responses HTTP ${response.status}: ${errText}`);
    }
  } catch (err: any) {
    console.warn("OpenAI /v1/responses fetch failed:", err?.message || err);
  }

  // Backup attempt: OpenAI Chat Completions API (v1/chat/completions)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: instructions },
          { role: "user", content: prompt },
        ],
        max_tokens: 300,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content;
      if (typeof text === "string" && text.trim()) {
        return text.trim();
      }
    } else {
      const errText = await response.text().catch(() => "");
      console.error(`OpenAI /v1/chat/completions HTTP ${response.status}: ${errText}`);
    }
  } catch (err: any) {
    console.error("OpenAI /v1/chat/completions fetch failed:", err?.message || err);
  }

  throw new Error("Could not retrieve AI response from OpenAI API.");
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

    let aiReply = "";
    try {
      aiReply = await generateAiReply(name, email, message);
    } catch (aiError) {
      console.error("GGL AI support generation failed:", aiError);
      aiReply = "Thanks for contacting Gorakhpur's Got Latent. Your request has been received. Our support team will review it and get back to you if further action is needed.";
    }

    const emailSubject = "GGL Support — Reply to Your Request";
    const emailBody = `Hi ${name},

Thanks for contacting Gorakhpur's Got Latent.

${aiReply}

If your issue involves a payment, refund, security matter or something the AI cannot resolve, please contact:

help.gglatent@gmail.com
+91 8423858424
https://www.gkpgotlatent.in/

Regards,
Gorakhpur's Got Latent AI Support`;

    // Send acknowledgement email via Nitrosend without blocking response for too long
    Promise.race([
      sendNitrosendEmail(email, emailSubject, emailBody).then((res) => {
        if (!res.success) {
          console.error("GGL AI support email delivery failed:", res.message);
        }
      }),
      new Promise((resolve) => setTimeout(resolve, 6000)),
    ]).catch((emailErr) => {
      console.error("GGL AI support email sending exception:", emailErr);
    });

    const needsHuman = /payment|refund|security|hack|fraud|legal|police|complaint|angry|threat|cannot resolve|team will review/i.test(
      `${message}\n${aiReply}`
    );

    if (needsHuman) {
      sendNitrosendEmail(
        SUPPORT_EMAIL,
        `GGL AI Support Escalation — ${name}`,
        `A support request was escalated for human review.

Name: ${name}
Email: ${email}

Message:
${message}

AI reply:
${aiReply}`
      ).catch((escErr) => {
        console.error("GGL AI support escalation email failure:", escErr);
      });
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

