import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import defaultLogs from "@/data/visitorLogs.json";
import { VisitorLog, AnalyticsSummary } from "@/types/portfolio";

const LOCAL_DATA_PATH = path.join(process.cwd(), "src", "data", "visitorLogs.json");
const TMP_DATA_PATH = path.join("/tmp", "visitorLogs.json");

// Helper to determine active file path (supports Vercel serverless /tmp and local dev)
async function getActiveLogPath(): Promise<string> {
  try {
    await fs.access(LOCAL_DATA_PATH);
    return LOCAL_DATA_PATH;
  } catch {
    return TMP_DATA_PATH;
  }
}

// In-memory cache for fast response and serverless longevity
let memoryLogs: VisitorLog[] = (defaultLogs as unknown as VisitorLog[]) || [];

async function loadAllLogs(): Promise<VisitorLog[]> {
  const filePath = await getActiveLogPath();
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryLogs = parsed;
      return parsed;
    }
  } catch {
    // If file doesn't exist, use in-memory cache or bundled defaults
  }
  return memoryLogs;
}

async function persistLogs(logs: VisitorLog[]): Promise<void> {
  memoryLogs = logs;
  const filePath = await getActiveLogPath();
  try {
    await fs.writeFile(filePath, JSON.stringify(logs, null, 2), "utf-8");
  } catch {
    // If local path is read-only (like production Vercel lambda), fallback to /tmp
    try {
      await fs.writeFile(TMP_DATA_PATH, JSON.stringify(logs, null, 2), "utf-8");
    } catch (e) {
      console.warn("Could not write logs to filesystem:", e);
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    const logs = await loadAllLogs();
    const url = new URL(req.url);
    const filterMonth = url.searchParams.get("month"); // e.g. "2026-11"

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const currentMonthStr = todayStr.substring(0, 7);
    const activeMonth = filterMonth || currentMonthStr;

    // Filter logs if a specific month is requested
    const filteredLogs = filterMonth
      ? logs.filter((l) => l.month === filterMonth)
      : logs;

    // Unique visitors calculation
    const uniqueIds = new Set(logs.map((l) => l.visitorId));

    // Daily breakdown for the active month
    const dailyBreakdown: { [date: string]: number } = {};
    // Monthly breakdown for all months
    const monthlyBreakdown: { [month: string]: number } = {};
    const deviceBreakdown = { Desktop: 0, Mobile: 0, Tablet: 0 };
    const countryBreakdown: { [country: string]: number } = {};

    let todayVisits = 0;
    let monthVisits = 0;

    logs.forEach((log) => {
      // Monthly accumulation
      monthlyBreakdown[log.month] = (monthlyBreakdown[log.month] || 0) + 1;

      if (log.month === activeMonth) {
        monthVisits++;
        dailyBreakdown[log.date] = (dailyBreakdown[log.date] || 0) + 1;
      }

      if (log.date === todayStr) {
        todayVisits++;
      }

      // Device & Country breakdown
      if (log.device === "Mobile") deviceBreakdown.Mobile++;
      else if (log.device === "Tablet") deviceBreakdown.Tablet++;
      else deviceBreakdown.Desktop++;

      const country = log.country || "Unknown";
      countryBreakdown[country] = (countryBreakdown[country] || 0) + 1;
    });

    // Recent logs (latest first)
    const recentLogs = [...filteredLogs].sort((a, b) => b.timestamp - a.timestamp);

    const summary: AnalyticsSummary = {
      totalVisits: logs.length,
      uniqueVisitors: uniqueIds.size,
      monthVisits,
      todayVisits,
      dailyBreakdown,
      monthlyBreakdown,
      deviceBreakdown,
      countryBreakdown,
      recentLogs: recentLogs.slice(0, 100), // Return up to 100 recent entries
    };

    return NextResponse.json({
      success: true,
      activeMonth,
      summary,
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Failed to compute analytics" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const logs = await loadAllLogs();

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const monthStr = dateStr.substring(0, 7);
    const timeStr = now.toTimeString().split(" ")[0];

    // Read header telemetry
    const forwardedFor = req.headers.get("x-forwarded-for");
    const rawIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
    // Anonymize IP (e.g. 192.168.***.***)
    const ipParts = rawIp.split(".");
    const maskedIp = ipParts.length === 4 ? `${ipParts[0]}.${ipParts[1]}.***.***` : "Anonymized";

    const countryHeader = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry");
    const cityHeader = req.headers.get("x-vercel-ip-city");
    const userAgent = req.headers.get("user-agent") || "";

    // Device parsing
    let device: "Desktop" | "Mobile" | "Tablet" = "Desktop";
    if (/tablet|ipad/i.test(userAgent) || (body.screenWidth && body.screenWidth >= 600 && body.screenWidth < 1024)) {
      device = "Tablet";
    } else if (/mobile|android|iphone/i.test(userAgent) || (body.screenWidth && body.screenWidth < 600)) {
      device = "Mobile";
    }

    // OS parsing
    let os = "Other";
    if (/windows/i.test(userAgent)) os = "Windows";
    else if (/macintosh|mac os x/i.test(userAgent)) os = "macOS";
    else if (/android/i.test(userAgent)) os = "Android";
    else if (/iphone|ipad|ipod/i.test(userAgent)) os = "iOS";
    else if (/linux/i.test(userAgent)) os = "Linux";

    // Browser parsing
    let browser = "Browser";
    if (/edg/i.test(userAgent)) browser = "Edge";
    else if (/chrome/i.test(userAgent)) browser = "Chrome";
    else if (/firefox/i.test(userAgent)) browser = "Firefox";
    else if (/safari/i.test(userAgent)) browser = "Safari";
    else if (/opera|opr/i.test(userAgent)) browser = "Opera";

    // Referrer normalization
    let referrer = body.referrer || req.headers.get("referer") || "Direct Uplink";
    if (referrer.includes("linkedin.com")) referrer = "LinkedIn";
    else if (referrer.includes("github.com")) referrer = "GitHub";
    else if (referrer.includes("google.com")) referrer = "Google";
    else if (referrer.includes("t.co") || referrer.includes("twitter.com") || referrer.includes("x.com")) referrer = "Twitter / X";
    else if (referrer.startsWith("http")) {
      try {
        referrer = new URL(referrer).hostname;
      } catch {}
    }

    const visitorId = body.visitorId || `vis-${Math.random().toString(36).substring(2, 8)}`;
    const isReturning = logs.some((l) => l.visitorId === visitorId);

    const newLog: VisitorLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      date: dateStr,
      month: monthStr,
      time: timeStr,
      ip: maskedIp,
      country: countryHeader ? formatCountryName(countryHeader) : body.country || "India",
      city: cityHeader ? decodeURIComponent(cityHeader) : body.city || "Jaipur",
      device,
      browser,
      os,
      referrer,
      visitorId,
      isNew: !isReturning,
    };

    logs.unshift(newLog);

    // Keep max 5000 logs to prevent unbounded file size
    if (logs.length > 5000) {
      logs.splice(5000);
    }

    await persistLogs(logs);

    return NextResponse.json({
      success: true,
      message: "Visitor telemetry recorded",
      logId: newLog.id,
      totalVisits: logs.length,
    });
  } catch (error) {
    console.error("Telemetry error:", error);
    return NextResponse.json({ error: "Failed to record log" }, { status: 500 });
  }
}

// Reset/Clear logs (requires admin pin)
export async function DELETE(req: NextRequest) {
  try {
    const pin = req.headers.get("x-admin-pin");
    if (pin !== "12487766") {
      return NextResponse.json({ error: "Unauthorized: Invalid PIN" }, { status: 401 });
    }

    await persistLogs([]);
    return NextResponse.json({ success: true, message: "Visitor logs cleared successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to clear logs" }, { status: 500 });
  }
}

function formatCountryName(code: string): string {
  const map: { [key: string]: string } = {
    IN: "India",
    US: "United States",
    GB: "United Kingdom",
    DE: "Germany",
    CA: "Canada",
    NL: "Netherlands",
    SG: "Singapore",
    AU: "Australia",
    FR: "France",
    JP: "Japan",
  };
  return map[code.toUpperCase()] || code;
}
