import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getPortfolioData, savePortfolioData } from "@/lib/cloudStorage";

export const dynamic = "force-dynamic";

// GET /api/resume - Always streams the latest active Resume PDF with no-store cache
export async function GET() {
  try {
    const data = await getPortfolioData();
    const resumeUrl = data.profile?.resumeUrl || "/resume/Devesh_Sharma_Resume.pdf";
    const fileName = data.profile?.resumeFileName || "Devesh_Sharma_Resume.pdf";

    // Case 1: Base64 Data URI (used when uploaded on serverless read-only environments)
    if (resumeUrl.startsWith("data:application/pdf;base64,")) {
      const base64Data = resumeUrl.replace("data:application/pdf;base64,", "");
      const buffer = Buffer.from(base64Data, "base64");
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    // Case 2: External URL
    if (resumeUrl.startsWith("http://") || resumeUrl.startsWith("https://")) {
      return NextResponse.redirect(resumeUrl);
    }

    // Case 3: Local public file path (e.g., /resume/Devesh_Sharma_Resume.pdf)
    const sanitizedRelPath = resumeUrl.replace(/^\/+/, "");
    const localPath = path.join(process.cwd(), "public", sanitizedRelPath);
    try {
      const fileBuffer = await fs.readFile(localPath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    } catch {
      // Fallback to default bundled PDF
      const defaultPath = path.join(process.cwd(), "public", "resume", "Devesh_Sharma_Resume.pdf");
      const fallbackBuffer = await fs.readFile(defaultPath);
      return new NextResponse(fallbackBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="Devesh_Sharma_Resume.pdf"`,
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }
  } catch (error) {
    console.error("Failed to serve resume:", error);
    return NextResponse.json({ error: "Resume not available" }, { status: 500 });
  }
}

// POST /api/resume - Upload a new Resume PDF and immediately bind it as the active resume
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No PDF file received" }, { status: 400 });
    }

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return NextResponse.json(
        { error: "Only PDF files (.pdf) are allowed for resume upload" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueFileName = `${Date.now()}_${cleanFileName}`;

    let resumeUrl = `/resume/${uniqueFileName}`;

    try {
      const resumeDir = path.join(process.cwd(), "public", "resume");
      await fs.mkdir(resumeDir, { recursive: true });
      await fs.writeFile(path.join(resumeDir, uniqueFileName), buffer);
    } catch {
      // On Vercel serverless (read-only filesystem), store as base64 Data URI in Redis/cloudStorage
      resumeUrl = `data:application/pdf;base64,${buffer.toString("base64")}`;
    }

    const portfolio = await getPortfolioData();
    const updatedAt = new Date().toISOString();

    portfolio.profile = {
      ...portfolio.profile,
      resumeUrl,
      resumeFileName: cleanFileName,
      resumeUpdatedAt: updatedAt,
    };

    const saveRes = await savePortfolioData(portfolio);

    return NextResponse.json({
      success: true,
      resumeUrl,
      resumeFileName: cleanFileName,
      resumeUpdatedAt: updatedAt,
      storage: saveRes.storage,
      message: "Resume updated! Recruiters will now download this version.",
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload resume PDF" },
      { status: 500 }
    );
  }
}
