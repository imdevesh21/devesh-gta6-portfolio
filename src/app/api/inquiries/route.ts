import { NextRequest, NextResponse } from "next/server";
import { getInquiries, getPortfolioData, saveInquiries } from "@/lib/cloudStorage";
import { RecruiterInquiry } from "@/types/inquiry";

export const dynamic = "force-dynamic";

async function sendRecruiterAlert(inquiry: RecruiterInquiry, recipientEmail: string) {
  const resendKey = process.env.RESEND_API_KEY;
  const webhookUrl = process.env.ALERT_WEBHOOK_URL;
  const toEmail = process.env.ALERT_EMAIL || recipientEmail || "Deveshsharma.it23@gmail.com";

  let alertSent = false;
  let alertChannel = "none";

  // 1. Resend Email Alert (https://resend.com)
  if (resendKey) {
    try {
      const html = `
        <div style="font-family:Arial,sans-serif;background:#0c0119;color:#ffffff;padding:24px;border-radius:16px;border:2px solid #ff2a85;">
          <h2 style="color:#00f0ff;margin-top:0;">🚨 NEW RECRUITER CONTRACT RECEIVED</h2>
          <p><strong>Operative Inquiry From:</strong> ${inquiry.name} (${inquiry.email})</p>
          <p><strong>Company:</strong> ${inquiry.company}</p>
          <p><strong>Target Role:</strong> ${inquiry.role}</p>
          <div style="background:#18042e;padding:14px;border-radius:10px;border-left:4px solid #ff2a85;margin:16px 0;">
            ${inquiry.message.replace(/\n/g, "<br/>")}
          </div>
          <p style="font-size:12px;color:#94a3b8;">View & manage in your Admin Inbox: https://devesh-gta6-portfolio.vercel.app/admin</p>
        </div>
      `;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "Leonida Portfolio <onboarding@resend.dev>",
          to: [toEmail],
          reply_to: inquiry.email,
          subject: `🚨 New Recruiter Inquiry: ${inquiry.name} (${inquiry.company}) — ${inquiry.role}`,
          html,
        }),
      });

      if (res.ok) {
        alertSent = true;
        alertChannel = "resend_email";
      } else {
        console.warn("Resend alert error:", await res.text());
      }
    } catch (err) {
      console.warn("Resend fetch error:", err);
    }
  }

  // 2. Optional Discord / Slack Webhook Alert
  if (webhookUrl) {
    try {
      const wRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `🚨 **New Recruiter Inquiry!**\n**Name:** ${inquiry.name} (${inquiry.email})\n**Company:** ${inquiry.company}\n**Role:** ${inquiry.role}\n**Message:** ${inquiry.message}`,
        }),
      });
      if (wRes.ok) {
        alertSent = true;
        alertChannel = alertChannel === "resend_email" ? "resend_email+webhook" : "webhook";
      }
    } catch (err) {
      console.warn("Webhook alert error:", err);
    }
  }

  return { alertSent, alertChannel };
}

export async function GET() {
  try {
    const inquiries = await getInquiries();
    const emailConfigured = Boolean(process.env.RESEND_API_KEY || process.env.ALERT_WEBHOOK_URL);
    return NextResponse.json({ success: true, inquiries, emailConfigured });
  } catch (error) {
    console.error("Failed to fetch inquiries:", error);
    return NextResponse.json({ success: false, inquiries: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Name, email, and mission brief are required" },
        { status: 400 }
      );
    }

    const [inquiries, portfolio] = await Promise.all([getInquiries(), getPortfolioData()]);
    const newItem: RecruiterInquiry = {
      id: `inq-${Date.now()}`,
      name: String(body.name).trim(),
      email: String(body.email).trim(),
      company: String(body.company || "Independent / Stealth").trim(),
      role: String(body.role || "Full Stack Engineer").trim(),
      message: String(body.message).trim(),
      status: "new",
      createdAt: new Date().toISOString(),
    };

    inquiries.unshift(newItem);
    const res = await saveInquiries(inquiries);

    const alertResult = await sendRecruiterAlert(
      newItem,
      portfolio.profile?.contact?.email || "Deveshsharma.it23@gmail.com"
    );

    return NextResponse.json({
      success: true,
      inquiry: newItem,
      storage: res.storage,
      alertSent: alertResult.alertSent,
      alertChannel: alertResult.alertChannel,
    });
  } catch (error) {
    console.error("Inquiry submit error:", error);
    return NextResponse.json(
      { error: "Failed to transmit mission contract" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "Inquiry ID required" }, { status: 400 });
    }
    const inquiries = await getInquiries();
    const idx = inquiries.findIndex((i) => i.id === body.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }
    inquiries[idx] = {
      ...inquiries[idx],
      status: body.status === "new" ? "new" : "reviewed",
    };
    await saveInquiries(inquiries);
    return NextResponse.json({ success: true, inquiry: inquiries[idx] });
  } catch (error) {
    console.error("Inquiry update error:", error);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Inquiry ID required" }, { status: 400 });
    }
    const inquiries = await getInquiries();
    const filtered = inquiries.filter((i) => i.id !== id);
    await saveInquiries(filtered);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Inquiry delete error:", error);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
