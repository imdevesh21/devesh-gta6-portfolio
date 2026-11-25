"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { LazyImage } from "./ui/LazyImage";
import { LazyReveal } from "./ui/LazyReveal";
import { TiltCard } from "./TiltCard";
import { HEIST_COVERS } from "@/lib/openDomainImages";
import { MapPin, Calendar, Zap, CheckCircle2, Clock } from "lucide-react";

export const HeistCampaignTab: React.FC = () => {
  const { data } = usePortfolio();
  const heists = data.experiences;

  return (
    <div className="space-y-6">
      <LazyReveal variant="fade-up">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#ff2a85] uppercase font-bold">
            CAREER TIMELINE // LEONIDA ARCHIVES
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_10px_#ff2a85]">
            STORY MODE: COMPLETED CAMPAIGN HEISTS
          </h2>
          <p className="text-xs font-mono text-cyan-300">
            CHRONOLOGICAL PRODUCTION LOG ACROSS ENTERPRISE ERP, EDTECH, AND AI ALIGNMENT
          </p>
        </div>
      </LazyReveal>

      <div className="space-y-6">
        {heists.map((heist, hIdx) => {
          const isInProgress = heist.status === "IN PROGRESS";
          const isTraining = heist.status === "TRAINING COMPLETED";
          const coverSrc = HEIST_COVERS[hIdx % HEIST_COVERS.length];

          return (
            <LazyReveal
              key={heist.id}
              variant={hIdx % 2 === 0 ? "slide-left" : "slide-right"}
              delayMs={hIdx * 70}
            >
              <TiltCard
                glowColor={isInProgress ? "pink" : isTraining ? "purple" : "cyan"}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Open-Domain Mission Cover Thumbnail with Parallax */}
                  <div className="lg:col-span-4 relative min-h-[190px]">
                    <LazyImage
                      src={coverSrc}
                      alt={heist.missionTitle}
                      parallax
                      containerClassName="w-full h-full min-h-[190px]"
                      className="w-full h-full object-cover"
                      overlayClassName="bg-gradient-to-t lg:bg-gradient-to-r from-[#140124] via-[#140124]/45 to-transparent"
                    />
                    <div className="absolute top-3 left-3 z-30">
                      <span
                        className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border backdrop-blur-md flex items-center gap-1 ${
                          isInProgress
                            ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                            : isTraining
                            ? "bg-black/75 border-gray-500 text-gray-300"
                            : "bg-cyan-950/80 border-cyan-400 text-cyan-200"
                        }`}
                      >
                        {isInProgress ? (
                          <>
                            <Clock className="w-3 h-3 animate-spin" />
                            <span>ACTIVE (ONSITE)</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>ACCOMPLISHED</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Heist Content */}
                  <div className="lg:col-span-8 p-6 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3">
                      <div className="space-y-1">
                        <h3 className="text-lg sm:text-xl font-black text-white tracking-wide">
                          {heist.missionTitle}
                        </h3>
                        <div className="text-xs font-mono text-[#ff2a85] font-bold">
                          <span>{heist.company}</span>{" "}
                          <span className="text-gray-500">/</span>{" "}
                          <span className="text-white">{heist.role}</span>
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs space-y-1">
                        <div className="flex items-center justify-end gap-1 text-gray-400">
                          <MapPin className="w-3.5 h-3.5 text-[#ff2a85]" />
                          <span>{heist.location}</span>
                        </div>
                        <div className="flex items-center justify-end gap-1 text-gray-300">
                          <Calendar className="w-3.5 h-3.5 text-[#00f0ff]" />
                          <span>{heist.period}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-pink-200/90 italic">
                      BRIEFING: &quot;{heist.briefing}&quot;
                    </div>

                    <div className="text-sm text-gray-300 space-y-2">
                      {heist.achievements.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-[#00f0ff] font-bold mt-0.5">▹</span>
                          <span className="leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-[#ffb700] font-bold bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-500/35">
                        <Zap className="w-3.5 h-3.5 text-[#ffb700]" />
                        <span>LOOT: {heist.keyMetric}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                        {heist.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-black/60 border border-white/15 rounded-md text-gray-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </LazyReveal>
          );
        })}
      </div>
    </div>
  );
};
