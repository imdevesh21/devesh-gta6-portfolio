"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { MapPin, Calendar, Zap, CheckCircle2, Clock } from "lucide-react";

export const HeistCampaignTab: React.FC = () => {
  const { data } = usePortfolio();
  const heists = data.experiences;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-black tracking-widest text-[#ff2a85] uppercase drop-shadow-[0_0_10px_#ff2a85]">
          STORY MODE: COMPLETED CAMPAIGN HEISTS
        </h2>
        <p className="text-xs font-mono text-cyan-300">
          CHRONOLOGICAL PRODUCTION LOG ACROSS ENTERPRISE ERP, EDTECH, AND AI ALIGNMENT
        </p>
      </div>

      {/* Heist Mission Cards */}
      <div className="space-y-5">
        {heists.map((heist) => {
          const isInProgress = heist.status === "IN PROGRESS";
          const isTraining = heist.status === "TRAINING COMPLETED";

          return (
            <div
              key={heist.id}
              className={`bg-[#140124]/90 p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden shadow-lg ${
                isInProgress
                  ? "border-[#ff2a85] shadow-[0_0_25px_rgba(255,42,133,0.35)]"
                  : isTraining
                  ? "border-gray-700 hover:border-gray-500"
                  : "border-[#00f0ff]/50 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
              }`}
            >
              {/* Mission Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-800 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                        isInProgress
                          ? "bg-emerald-950/60 border-emerald-500 text-emerald-400"
                          : isTraining
                          ? "bg-gray-900 border-gray-600 text-gray-300"
                          : "bg-cyan-950/60 border-cyan-500 text-cyan-300"
                      }`}
                    >
                      {isInProgress ? (
                        <>
                          <Clock className="w-3 h-3 animate-spin" />
                          <span>MISSION ACTIVE (ONSITE)</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>MISSION ACCOMPLISHED</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white tracking-wide">
                    {heist.missionTitle}
                  </h3>
                  <div className="text-xs font-mono text-[#ff2a85] font-bold">
                    <span>{heist.company}</span> <span className="text-gray-400">/</span> <span className="text-white">{heist.role}</span>
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

              {/* Mission Briefing */}
              <div className="mt-3 text-xs font-mono text-pink-200/90 italic">
                BRIEFING: &quot;{heist.briefing}&quot;
              </div>

              {/* Achievements Bullet List */}
              <div className="mt-3 text-sm text-gray-300 space-y-2">
                {heist.achievements.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-[#00f0ff] font-bold mt-0.5">▹</span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              {/* Highlight Metric Pill */}
              <div className="mt-4 p-2.5 bg-black/60 rounded-xl border border-emerald-500/30 flex items-center gap-2 font-mono text-xs">
                <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-gray-400">KEY METRIC ACHIEVED:</span>
                <span className="text-emerald-400 font-bold tracking-wide">
                  {heist.keyMetric}
                </span>
              </div>

              {/* Tech Badges */}
              <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-gray-800/80 font-mono text-xs">
                {heist.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-black/70 border border-gray-700/80 rounded-md text-gray-200 hover:border-[#ff2a85] transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
