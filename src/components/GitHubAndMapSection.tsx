"use client";

import React, { useEffect, useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { LazyReveal } from "./ui/LazyReveal";
import { TiltCard } from "./TiltCard";
import { GithubIcon } from "./Icons";
import { sfx } from "@/lib/soundFx";
import { MapPin, Star, GitFork, ExternalLink, Radar, Code2 } from "lucide-react";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

interface GitHubProfile {
  public_repos: number;
  followers: number;
}

const MAP_PINS = [
  {
    id: "vyn",
    label: "JAIPUR HQ // VYN AUTOMATION",
    role: "Full Stack Developer (Sep 2026 – Present)",
    metric: "40–60% Faster ERP APIs • Next.js, Node.js, SQL",
    x: "62%",
    y: "42%",
    color: "bg-[#ff2a85]",
  },
  {
    id: "jecrc",
    label: "JAIPUR // JECRC UNIVERSITY",
    role: "B.Tech IT (CGPA: 7.58 / 10)",
    metric: "150+ DSA Problems • Google Cloud Certified",
    x: "54%",
    y: "58%",
    color: "bg-[#ffb700]",
  },
  {
    id: "ajmer",
    label: "AJMER // SIMPLIFIED LEARNING",
    role: "Full Stack Developer (Jan – Sep 2026)",
    metric: "EdTech Platform • Payment Gateway & Socket.io",
    x: "33%",
    y: "64%",
    color: "bg-[#00f0ff]",
  },
  {
    id: "outlier",
    label: "REMOTE SATELLITE // OUTLIER.AI",
    role: "Freelance AI Contributor (2025)",
    metric: "200+ LLM Prompts • +15% Contextual Boost",
    x: "22%",
    y: "28%",
    color: "bg-emerald-400",
  },
];

export const GitHubAndMapSection: React.FC = () => {
  const { data } = usePortfolio();
  const [ghProfile, setGhProfile] = useState<GitHubProfile>({ public_repos: 24, followers: 18 });
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [activePin, setActivePin] = useState(MAP_PINS[0]);

  useEffect(() => {
    const fetchGitHub = async () => {
      try {
        const [uRes, rRes] = await Promise.all([
          fetch("https://api.github.com/users/imdevesh21"),
          fetch("https://api.github.com/users/imdevesh21/repos?sort=updated&per_page=4"),
        ]);
        if (uRes.ok) {
          const uJson = await uRes.json();
          setGhProfile({
            public_repos: uJson.public_repos ?? 24,
            followers: uJson.followers ?? 18,
          });
        }
        if (rRes.ok) {
          const rJson = await rRes.json();
          if (Array.isArray(rJson)) setRepos(rJson);
        }
      } catch {}
    };
    fetchGitHub();
  }, []);

  return (
    <div className="space-y-6">
      <LazyReveal variant="fade-up">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#00f0ff] uppercase font-bold">
            SATELLITE UPLINK // LIVE TELEMETRY &amp; RADAR
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_10px_#00f0ff]">
            GITHUB RADAR &amp; LEONIDA CAREER MAP
          </h2>
        </div>
      </LazyReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Live GitHub Telemetry */}
        <LazyReveal variant="slide-left" className="lg:col-span-6 flex">
          <TiltCard glowColor="cyan" className="w-full p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <GithubIcon className="w-5 h-5 text-[#00f0ff]" />
                <div>
                  <h3 className="text-base font-black text-white">GITHUB // @imdevesh21</h3>
                  <p className="text-[10px] font-mono text-gray-400">
                    LIVE REPOSITORY TELEMETRY &amp; 150+ DSA STREAK
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-[#00f0ff] font-bold">
                  {ghProfile.public_repos} REPOS
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-pink-950/60 border border-pink-500/40 text-[#ff85b8] font-bold">
                  {ghProfile.followers} FOLLOWERS
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {repos.length > 0 ? (
                repos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl bg-black/60 border border-white/10 hover:border-[#00f0ff] transition-all flex flex-col justify-between space-y-2 group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-white group-hover:text-[#00f0ff] truncate">
                          {repo.name}
                        </span>
                        <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-[#00f0ff] shrink-0" />
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">
                        {repo.description || "Production software & engineering repository."}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1">
                      <span className="flex items-center gap-1 text-amber-300">
                        <Code2 className="w-3 h-3" /> {repo.language || "TypeScript"}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-amber-400" /> {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <GitFork className="w-3 h-3 text-cyan-400" /> {repo.forks_count}
                        </span>
                      </span>
                    </div>
                  </a>
                ))
              ) : (
                data.projects.slice(0, 4).map((pr) => (
                  <div
                    key={pr.id}
                    className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-1"
                  >
                    <div className="font-mono text-xs font-bold text-[#00f0ff]">{pr.title}</div>
                    <div className="text-[11px] text-gray-400 line-clamp-2">{pr.description}</div>
                  </div>
                ))
              )}
            </div>
          </TiltCard>
        </LazyReveal>

        {/* RIGHT: Interactive GTA-VI Leonida Career Radar Map */}
        <LazyReveal variant="slide-right" delayMs={80} className="lg:col-span-6 flex">
          <TiltCard glowColor="pink" className="w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Radar className="w-5 h-5 text-[#ff2a85] animate-spin" style={{ animationDuration: "8s" }} />
                <div>
                  <h3 className="text-base font-black text-white">LEONIDA CAREER RADAR</h3>
                  <p className="text-[10px] font-mono text-gray-400">
                    CLICK ANY RADAR PIN TO INSPECT DEPLOYMENT SECTOR
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
                GPS LOCKED
              </span>
            </div>

            {/* Interactive Tactical Map Grid */}
            <div
              className="relative h-52 rounded-2xl border border-[#00f0ff]/35 bg-[#090114] overflow-hidden"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(0,240,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,42,133,0.08) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            >
              {/* Radar Sweep Circle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-40 h-40 rounded-full border border-[#00f0ff]/20" />
                <div className="absolute w-64 h-64 rounded-full border border-[#ff2a85]/15" />
              </div>

              {MAP_PINS.map((pin) => {
                const isSelected = activePin.id === pin.id;
                return (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={() => {
                      sfx.playClick();
                      setActivePin(pin);
                    }}
                    style={{ left: pin.x, top: pin.y }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                  >
                    <span
                      className={`absolute inset-0 rounded-full ${pin.color} opacity-50 ${
                        isSelected ? "animate-ping" : "group-hover:animate-ping"
                      }`}
                    />
                    <span
                      className={`relative flex items-center justify-center w-7 h-7 rounded-full border-2 ${
                        isSelected
                          ? "border-white scale-125 shadow-[0_0_15px_#fff]"
                          : "border-black/80 hover:scale-110"
                      } ${pin.color} transition-all`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-black" />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Pin Details */}
            <div className="p-3.5 rounded-xl bg-black/70 border border-[#ff2a85]/40 font-mono text-xs space-y-1">
              <div className="text-[#ff2a85] font-black">{activePin.label}</div>
              <div className="text-white font-bold">{activePin.role}</div>
              <div className="text-[#00f0ff] text-[11px]">⚡ {activePin.metric}</div>
            </div>
          </TiltCard>
        </LazyReveal>
      </div>
    </div>
  );
};
