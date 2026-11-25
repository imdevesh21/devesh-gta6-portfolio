import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Devesh Sharma — GTA-VI Full Stack Developer Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #0c0119 0%, #2a044a 55%, #090114 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          border: "8px solid #ff2a85",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#00f0ff",
              letterSpacing: "4px",
            }}
          >
            LEONIDA DIGITAL ZONE // PORTFOLIO VI
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#ffb700",
              background: "rgba(0,0,0,0.5)",
              padding: "8px 18px",
              borderRadius: "999px",
              border: "2px solid #ffb700",
            }}
          >
            ★★★★★ WANTED: FULL STACK
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              fontSize: 78,
              fontWeight: 900,
              letterSpacing: "2px",
              color: "#ffffff",
            }}
          >
            DEVESH SHARMA
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              color: "#ff2a85",
            }}
          >
            Full Stack Developer • Next.js, Node.js, TypeScript, SQL
          </div>
        </div>

        <div style={{ display: "flex", gap: "24px", fontSize: 22, color: "#e2e8f0" }}>
          <span>⚡ 40–60% Faster ERP APIs</span>
          <span>•</span>
          <span>🧠 150+ DSA Solved</span>
          <span>•</span>
          <span>☁️ Google Cloud Certified</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
