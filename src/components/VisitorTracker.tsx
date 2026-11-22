"use client";

import { useEffect } from "react";

export function VisitorTracker() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    // Avoid double counting same browser session
    const hasTracked = sessionStorage.getItem("gta6_session_tracked");
    if (hasTracked) return;

    try {
      // Get or create persistent visitor ID
      let visitorId = localStorage.getItem("gta6_visitor_id");
      let isNew = false;
      if (!visitorId) {
        visitorId = `vis-${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem("gta6_visitor_id", visitorId);
        isNew = true;
      }

      const referrer = document.referrer || "Direct Uplink";
      const screenWidth = window.innerWidth;

      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          referrer,
          screenWidth,
          isNew,
        }),
      })
        .then(() => {
          sessionStorage.setItem("gta6_session_tracked", "true");
        })
        .catch((err) => {
          console.debug("Telemetry notice:", err);
        });
    } catch {
      // Telemetry should never block page execution
    }
  }, []);

  return null;
}
