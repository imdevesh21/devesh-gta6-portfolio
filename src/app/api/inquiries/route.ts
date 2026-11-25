import { NextRequest, NextResponse } from "next/server";
import { getInquiries, saveInquiries } from "@/lib/cloudStorage";
import { RecruiterInquiry } from "@/types/inquiry";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const inquiries = await getInquiries();
    return NextResponse.json({ success: true, inquiries });
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

    const inquiries = await getInquiries();
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

    return NextResponse.json({
      success: true,
      inquiry: newItem,
      storage: res.storage,
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
