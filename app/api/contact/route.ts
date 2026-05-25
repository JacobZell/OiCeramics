import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { saveContactSubmission } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const safeName = String(name).slice(0, 200);
    const safeEmail = String(email).slice(0, 200);
    const safeMessage = String(message).slice(0, 5000);

    // Always save to DB
    saveContactSubmission(safeName, safeEmail, safeMessage);

    // Forward via email if Gmail credentials are set
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: "oiceramicsmadison@gmail.com",
        replyTo: safeEmail,
        subject: `Oi Ceramics — message from ${safeName}`,
        text: `Name: ${safeName}\nEmail: ${safeEmail}\n\n${safeMessage}`,
        html: `
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <hr />
          <p>${safeMessage.replace(/\n/g, "<br>")}</p>
        `,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
