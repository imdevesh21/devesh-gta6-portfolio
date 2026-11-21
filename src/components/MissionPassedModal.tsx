"use client";

import React, { useEffect } from "react";
import { ProjectItem } from "../types/portfolio";
import { sfx } from "../lib/soundFx";
import confetti from "canvas-confetti";
import { CheckCircle2, DollarSign, ExternalLink } from "lucide-react";
import { GithubIcon } from "./Icons";

interface MissionPassedModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const MissionPassedModal: React.FC<MissionPassedModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    if (project) {
      sfx.playMissionPassed();

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ff2a85", "#00f0ff", "#ffb700", "#7b00ff", "#ffffff"],
        });
      } catch {
        // graceful fallback
      }
    }
  }, [project]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#150124] border-2 border-[#ff2a85] max-w-lg w-full p-6 sm:p-8 rounded-3xl text-center space-y-5 shadow-[0_0_60px_#ff2a85] relative overflow-hidden">
        
        {/* Glow ambient background aura */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#ff2a85]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#00f0ff]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Iconic GTA MISSION PASSED Title */}
        <div className="space-y-1">
          <div className="text-4xl sm:text-5xl font-black italic tracking-widest text-[#ffb700] drop-shadow-[0_0_15px_#f59e0b] font-mono">
            MISSION PASSED!
          </div>
          <div className="text-xs font-mono text-emerald-400 font-bold tracking-widest flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>RESPECT + 1000 // LOOT SECURED</span>
          </div>
        </div>

        {/* Bounty Payout */}
        <div className="bg-black/60 p-3 rounded-2xl border border-amber-500/40 inline-flex items-center gap-2 font-mono text-amber-400 font-black text-lg shadow-inner">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <span>PAYOUT: {project.bounty}</span>
        </div>

        {/* Project Target Dossier */}
        <div className="p-4 bg-black/70 rounded-2xl border border-gray-800 text-left space-y-2.5 font-mono text-xs">
          <div className="flex justify-between items-center text-gray-400 border-b border-gray-800 pb-2">
            <span>TARGET ARTIFACT:</span>
            <span className="text-white font-bold text-sm">{project.title}</span>
          </div>
          <div className="flex justify-between items-center text-gray-400">
            <span>CODENAME:</span>
            <span className="text-[#ff2a85] font-bold">&quot;{project.codename}&quot;</span>
          </div>
          <div className="flex justify-between items-center text-gray-400">
            <span>VERIFIED OUTCOME:</span>
            <span className="text-emerald-400 font-bold">{project.impactHighlight}</span>
          </div>
          <div className="text-gray-400 pt-1">
            <span>TECH ARSENAL: </span>
            <span className="text-[#00f0ff]">{project.techStack.join(" • ")}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <GithubIcon className="w-4 h-4" />
              <span>INSPECT REPO</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl bg-[#00f0ff] hover:bg-cyan-300 text-black font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>LIVE DEMO</span>
            </a>
          )}
          <button
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-[#ff2a85] hover:bg-pink-600 text-white font-mono text-xs font-bold shadow-[0_0_15px_#ff2a85] transition-all"
          >
            CONTINUE PATROL
          </button>
        </div>

      </div>
    </div>
  );
};
