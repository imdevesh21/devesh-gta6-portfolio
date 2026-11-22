"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { CheckCircle } from "lucide-react";

export const StreetCredTab: React.FC = () => {
  const { data } = usePortfolio();
  const certs = data.certifications;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-black tracking-widest text-[#ffb700] uppercase drop-shadow-[0_0_10px_#ffb700]">
          100% COMPLETION TROPHIES & STREET CRED
        </h2>
        <p className="text-xs font-mono text-gray-400">
          GOOGLE CLOUD VERIFIED RECOGNITION & 150+ DSA PROBLEM-SOLVING DISCIPLINE
        </p>
      </div>

      {/* Grid of Certifications & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certs.map((cert, idx) => (
          <div
            key={cert.id || idx}
            className={`bg-[#140124]/90 p-6 rounded-2xl space-y-4 shadow-lg border ${
              idx % 2 === 0
                ? "border-[#00f0ff]/60 shadow-[0_0_25px_rgba(0,240,255,0.25)]"
                : "border-[#ff2a85]/60 shadow-[0_0_25px_rgba(255,42,133,0.25)]"
            } ${idx === certs.length - 1 && certs.length % 2 !== 0 ? "md:col-span-2" : ""}`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-3xl">
                {cert.icon || "🏆"}
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-wide">
                  {cert.title}
                </h3>
                <p className="text-xs font-mono text-[#00f0ff] font-bold">
                  {cert.issuer} <span className="opacity-60">/</span> {cert.status}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              {cert.description}
            </p>

            <div className="font-mono text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/30 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>STATUS: {cert.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
