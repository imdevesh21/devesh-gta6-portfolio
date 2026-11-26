import { NextRequest, NextResponse } from "next/server";
import { getLLMConfig, saveLLMConfig } from "@/lib/cloudStorage";
import defaultLLMConfig from "@/data/llmConfig.json";
import { LLMConfig } from "@/types/llm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = await getLLMConfig();
    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("Failed to fetch LLM config:", error);
    return NextResponse.json(
      { success: false, config: defaultLLMConfig },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LLMConfig;
    if (!body || !body.systemPrompt) {
      return NextResponse.json(
        { error: "System prompt is required" },
        { status: 400 }
      );
    }

    const res = await saveLLMConfig(body);
    return NextResponse.json({
      success: true,
      storage: res.storage,
      message: "LLM fine-tuning configuration saved and live!",
    });
  } catch (error) {
    console.error("Failed to save LLM config:", error);
    return NextResponse.json(
      { error: "Failed to save LLM training config" },
      { status: 500 }
    );
  }
}
