"use client";

import React from "react";
import { CONTRACT_PROJECTS } from "../data/portfolioData";
import { ProjectItem } from "../types/portfolio";
import { sfx } from "../lib/soundFx";
import { ExternalLink, Sparkles } from "lucide-react";
import { GithubIcon } from "./Icons";

interface ContractsTabProps {
  onInspectProject: (project: ProjectItem) => void;
}

export const ContractsTab: React.FC<ContractsTabProps> = ({ onInspectProject }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-black tracking-widest text-[#00f0ff] uppercase drop-shadow-[0_0_10px_#00f0ff]">
          SYNDICATE BOUNTY CONTRACTS
        </h2>
        <p className="text-xs font-mono text-pink-300">
          FEATURED PRODUCTION ARTIFACTS DEPLOYED & TESTED IN THE WILD
        </p>
      </div>

      {/* Grid of Contracts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CONTRACT_PROJECTS.map((project, idx) => (
          <div
            key={project.id}
            className={`bg-[#140124]/90 rounded-2xl p-6 border flex flex-col justify-between space-y-4 transition-all duration-300 hover:scale-102 ${
              idx === 0
                ? "border-[#ff2a85]/60 shadow-[0_0_25px_rgba(255,42,133,0.3)]"
                : idx === 1
                ? "border-[#00f0ff]/60 shadow-[0_0_25px_rgba(0,240,255,0.3)]"
                : "border-[#ffb700]/60 shadow-[0_0_25px_rgba(255,183,0,0.3)]"
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                <span className="text-gray-400 uppercase tracking-wider">{project.type}</span>
                <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">
                  BOUNTY: {project.bounty}
                </span>
              </div>

              <h3 className="text-xl font-black text-white mt-2 tracking-wide">
                {project.title}
              </h3>
              <p className="text-xs font-mono text-[#ff2a85] font-bold mt-0.5">
                CODENAME: &quot;{project.codename}&quot;
              </p>

              <p className="text-xs text-gray-300 mt-3 leading-relaxed">
                {project.description}
              </p>

              {/* Impact Highlight Box */}
              <div className="my-3.5 p-2.5 bg-black/60 rounded-xl border border-emerald-500/40 font-mono text-xs text-emerald-300 leading-snug">
                ⚡ <span className="font-bold">{project.impactHighlight}</span>
              </div>

              {/* Bullet Details */}
              <ul className="text-xs text-gray-400 space-y-1.5 list-disc list-inside">
                {project.details.map((bullet, bIdx) => (
                  <li key={bIdx} className="leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Stack & Actions */}
            <div className="pt-4 border-t border-gray-800 space-y-3">
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                {project.techStack.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 bg-gray-900 border border-gray-700/80 rounded text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between font-mono text-xs pt-1">
                <button
                  onClick={() => {
                    sfx.playBleep();
                    onInspectProject(project);
                  }}
                  className="flex items-center gap-1.5 text-[#00f0ff] hover:text-white font-bold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#ff2a85]" />
                  <span>CLAIM BOUNTY 🏆</span>
                </button>

                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-black/60 border border-gray-700 rounded hover:border-[#00f0ff] text-gray-300 hover:text-white transition-all"
                      title="View GitHub Repository"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-black/60 border border-gray-700 rounded hover:border-[#ff2a85] text-gray-300 hover:text-white transition-all"
                      title="View Live Deployment"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
