import { NextRequest, NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/cloudStorage";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    const q = String(question || "").trim();
    if (!q) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const data = await getPortfolioData();
    const p = data.profile;
    const lower = q.toLowerCase();

    // Gemini AI enhancement when GEMINI_API_KEY is configured
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      const prompt = `You are Lester, an energetic GTA-style AI Operative Assistant embedded inside ${p.name}'s developer portfolio.
If the user asks a general question (like math, coding, greetings, etc.), answer it accurately and concisely in Lester's fun style.
If the user asks about ${p.name}, answer concisely (max 4 sentences) using this verified portfolio data:

Profile: ${p.name}, ${p.title}, ${p.location}, CGPA ${p.education.cgpa} (${p.education.institution}). Summary: ${p.summary}
Experiences: ${data.experiences.map((e) => `${e.role} at ${e.company} (${e.period}) - ${e.keyMetric}`).join("; ")}
Projects: ${data.projects.map((pr) => `${pr.title}: ${pr.impactHighlight}`).join("; ")}
Skills: ${data.skills.map((s) => s.name).join(", ")}
Resume Download: /api/resume (${p.resumeFileName || "Devesh_Sharma_Resume.pdf"})

User Question: ${q}`;

      for (const model of ["gemini-3-flash-preview", "gemini-3.8-flash", "gemini-2.5-flash-lite"]) {
        try {
          const aiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
              }),
            }
          );
          if (aiRes.ok) {
            const aiJson = await aiRes.json();
            const text = aiJson?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              return NextResponse.json({ success: true, reply: text, source: model });
            }
          }
        } catch {
          // Try next model
        }
      }
    }

    // Deterministic Context-Aware Operative Responder (always works with zero external keys)
    let reply = "";

    if (lower.includes("why") || lower.includes("hire") || lower.includes("summary") || lower.includes("about")) {
      reply = `${p.name} is a ${p.title} (${p.education.degree}, CGPA ${p.education.cgpa}) with 1+ year of production experience across enterprise ERP (Vyn Automation), EdTech (Simplified Learning), and AI/LLM RLHF tuning (Outlier.ai). Key wins: 40–60% faster APIs, ~80% feed-noise reduction on Chrome Extensions, and 150+ DSA problems solved.`;
    } else if (lower.includes("next") || lower.includes("react") || lower.includes("sql") || lower.includes("skill") || lower.includes("stack") || lower.includes("tech")) {
      const skillNames = data.skills.map((s) => s.name).join(", ");
      reply = `Core arsenal includes ${skillNames}. At Vyn Automation, Devesh builds ERP modules using Next.js, Node.js, TypeScript, and SQL—eliminating redundant queries to cut API latency by 40–60%.`;
    } else if (lower.includes("project") || lower.includes("bounty") || lower.includes("work")) {
      const topProjects = data.projects
        .slice(0, 3)
        .map((pr) => `• ${pr.title} (${pr.impactHighlight})`)
        .join("\n");
      reply = `Top deployed artifacts:\n${topProjects}`;
    } else if (lower.includes("experience") || lower.includes("company") || lower.includes("heist") || lower.includes("vyn") || lower.includes("outlier")) {
      const exps = data.experiences
        .map((e) => `• ${e.role} @ ${e.company} (${e.period}) — ${e.keyMetric}`)
        .join("\n");
      reply = `Verified mission history:\n${exps}`;
    } else if (lower.includes("resume") || lower.includes("cv") || lower.includes("pdf") || lower.includes("download")) {
      reply = `You can download Devesh's latest verified resume PDF directly at /api/resume (currently active: ${p.resumeFileName || "Devesh_Sharma_Resume.pdf"}).`;
    } else if (lower.includes("contact") || lower.includes("email") || lower.includes("phone") || lower.includes("reach")) {
      reply = `Direct uplink: ${p.contact.email} | Phone: ${p.contact.phone} | GitHub: ${p.contact.github}. You can also click "RECRUIT" in the hero to send a mission contract straight to his Admin Inbox!`;
    } else {
      reply = `${p.name} (${p.codename}) specializes in Next.js, Node.js, TypeScript, and SQL. Ask me about his experience at Vyn Automation / Simplified Learning, top projects, DSA stats (150+ solved), or how to download his latest resume!`;
    }

    return NextResponse.json({ success: true, reply, source: "operative_intel" });
  } catch (error) {
    console.error("Assistant error:", error);
    return NextResponse.json({ error: "Operative comms offline" }, { status: 500 });
  }
}
