"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { LazyImage } from "./ui/LazyImage";
import { LazyReveal } from "./ui/LazyReveal";
import { TiltCard } from "./TiltCard";
import { OPEN_DOMAIN_IMAGES } from "@/lib/openDomainImages";
import { CheckCircle } from "lucide-react";

const CERT_COVERS = [
  OPEN_DOMAIN_IMAGES.cloudTech,
  OPEN_DOMAIN_IMAGES.codeMatrix,
  OPEN_DOMAIN_IMAGES.luxuryMiami,
];

export const StreetCredTab: React.FC = () => {
  const { data } = usePortfolio();
  const certs = data.certifications;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <LazyReveal variant="fade-up">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#ffb700] uppercase font-bold">
            ACHIEVEMENT UNLOCKED // VERIFIED CREDENTIALS
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-widest text-[#ffb700] uppercase drop-shadow-[0_0_10px_#ffb700]">
            100% COMPLETION TROPHIES &amp; STREET CRED
          </h2>
          <p className="text-xs font-mono text-gray-400">
            GOOGLE CLOUD VERIFIED RECOGNITION &amp; 150+ DSA PROBLEM-SOLVING DISCIPLINE
          </p>
        </div>
      </LazyReveal>

      {/* Grid of Certifications & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certs.map((cert, idx) => (
          <LazyReveal
            key={cert.id || idx}
            variant="fade-up"
            delayMs={idx * 80}
            className={
              idx === certs.length - 1 && certs.length % 2 !== 0 ? "md:col-span-2" : ""
            }
          >
            <TiltCard
              glowColor={idx % 2 === 0 ? "cyan" : "pink"}
              className="overflow-hidden h-full"
            >
              <div className="relative h-28 w-full">
                <LazyImage
                  src={CERT_COVERS[idx % CERT_COVERS.length]}
                  alt={cert.title}
                  parallax
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover opacity-50"
                  overlayClassName="bg-gradient-to-t from-[#140124] via-[#140124]/60 to-transparent"
                />
                <div className="absolute bottom-3 left-5 z-30 flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-black/75 backdrop-blur-md border border-cyan-400/60 flex items-center justify-center text-3xl shadow-lg">
                    {cert.icon || "🏆"}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                      {cert.title}
                    </h3>
                    <p className="text-xs font-mono text-[#00f0ff] font-bold">
                      {cert.issuer} <span className="opacity-60">/</span> {cert.status}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-4 space-y-4">
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
                  {cert.description}
                </p>

                <div className="font-mono text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/30 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>STATUS: {cert.status}</span>
                </div>
              </div>
            </TiltCard>
          </LazyReveal>
        ))}
      </div>
    </div>
  );
};
