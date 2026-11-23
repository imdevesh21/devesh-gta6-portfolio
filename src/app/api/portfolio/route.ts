import { NextRequest, NextResponse } from "next/server";
import { getPortfolioData, savePortfolioData } from "@/lib/cloudStorage";
import { PortfolioData } from "@/types/portfolio";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to read portfolio data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authPin = req.headers.get("x-admin-pin");
    if (authPin !== "12487766") {
      return NextResponse.json(
        { error: "Unauthorized: Invalid FIB security clearance PIN" },
        { status: 401 }
      );
    }

    const updatedData: PortfolioData = await req.json();

    if (!updatedData.profile || !updatedData.skills || !updatedData.experiences) {
      return NextResponse.json(
        { error: "Invalid portfolio data structure" },
        { status: 400 }
      );
    }

    const result = await savePortfolioData(updatedData);

    return NextResponse.json({
      success: true,
      message: "Portfolio database updated successfully",
      storage: result.storage,
      data: updatedData,
    });
  } catch (error) {
    console.error("Failed to update portfolio data:", error);
    return NextResponse.json(
      { error: "Failed to persist data" },
      { status: 500 }
    );
  }
}
