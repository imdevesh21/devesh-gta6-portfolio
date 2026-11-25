"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { ProjectItem } from "../types/portfolio";
import { sfx } from "../lib/soundFx";
import { LazyImage } from "./ui/LazyImage";
import { LazyReveal } from "./ui/LazyReveal";
import { TiltCard } from "./TiltCard";
import { PROJECT_COVERS } from "@/lib/openDomainImages";
import { ExternalLink, Sparkles } from "lucide-react";
import { GithubIcon } from "./Icons";

interface ContractsTabProps {
  onInspectProject: (project: ProjectItem) => void;
}

export const ContractsTab: React.FC<ContractsTabProps> = ({ onInspectProject }) => {
  const { data } = usePortfolio();
  const projects = data.projects;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <LazyReveal variant="fade-up">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#00f0ff] uppercase font-bold">
            SYNDICATE CONTRACTS // DEPLOYED ARTIFACTS
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-widest text-[#00f0ff] uppercase drop-shadow-[0_0_10px_#00f0ff]">
            SYNDICATE BOUNTY CONTRACTS
          </h2>
          <p className="text-xs font-mono text-pink-300">
            FEATURED PRODUCTION ARTIFACTS DEPLOYED &amp; TESTED IN THE WILD
          </p>
        </div>
      </LazyReveal>

      {/* Grid of Contracts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project, idx) => {
          const glowColor =
            idx % 3 === 0 ? "pink" : idx % 3 === 1 ? "cyan" : "amber";
          const coverSrc = PROJECT_COVERS[idx % PROJECT_COVERS.length];

          return (
            <LazyReveal
              key={project.id}
              variant="zoom-in"
              delayMs={idx * 90}
              className="flex"
            >
              <TiltCard
                glowColor={glowColor}
                className="w-full flex flex-col justify-between group"
              >
                {/* Open-Domain Cover Visual with Lazy Loading + Parallax */}
                <div className="relative h-44 w-full overflow-hidden">
                  <LazyImage
                    src={coverSrc}
                    alt={project.title}
                    parallax
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    overlayClassName="bg-gradient-to-t from-[#140124] via-[#140124]/40 to-transparent"
                  />
                  <div className="absolute top-3 left-3 right-3 z-30 flex justify-between items-center text-[10px] font-mono font-bold">
                    <span className="text-gray-200 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15 uppercase tracking-wider">
                      {project.type}
                    </span>
                    <span className="text-emerald-300 bg-emerald-950/85 backdrop-blur-md border border-emerald-500/50 px-2.5 py-0.5 rounded-full">
                      {project.bounty}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 pt-3 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-white tracking-wide">
                      {project.title}
                    </h3>
                    <p className="text-xs font-mono text-[#ff2a85] font-bold mt-0.5">
                      CODENAME: &quot;{project.codename}&quot;
                    </p>

                    <p className="text-xs text-gray-300 mt-3 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="my-3.5 p-2.5 bg-black/60 rounded-xl border border-emerald-500/40 font-mono text-xs text-emerald-300 leading-snug">
                      ⚡ <span className="font-bold">{project.impactHighlight}</span>
                    </div>

                    <ul className="text-xs text-gray-400 space-y-1.5 list-disc list-inside">
                      {project.details.map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer Stack & Actions */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                      {project.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 bg-black/60 border border-white/15 rounded text-gray-300"
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
                            className="p-1.5 bg-black/60 border border-white/15 rounded-lg hover:border-[#00f0ff] text-gray-300 hover:text-white transition-all"
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
                            className="p-1.5 bg-black/60 border border-white/15 rounded-lg hover:border-[#ff2a85] text-gray-300 hover:text-white transition-all"
                            title="View Live Deployment"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
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
