import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import defaultData from "@/data/portfolioData.json";
import { PortfolioData } from "@/types/portfolio";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "portfolioData.json");

export async function GET() {
  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch {
    // If file doesn't exist or failed to parse, return bundled default
    return NextResponse.json(defaultData);
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

    // Write formatted JSON to file for persistent disk updates
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(updatedData, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Portfolio database updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.error("Failed to update portfolio data:", error);
    return NextResponse.json(
      { error: "Failed to persist data to disk" },
      { status: 500 }
    );
  }
}
