"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { sfx } from "../lib/soundFx";
import { TiltCard } from "./TiltCard";
import { LazyImage } from "./ui/LazyImage";
import { LazyReveal } from "./ui/LazyReveal";
import { OPEN_DOMAIN_IMAGES } from "@/lib/openDomainImages";
import { ShieldCheck, MapPin, GraduationCap, Trophy, Sparkles, Mail, Download } from "lucide-react";

interface DossierTabProps {
  onOpenHireModal?: () => void;
}

export const DossierTab: React.FC<DossierTabProps> = ({ onOpenHireModal }) => {
  const { data } = usePortfolio();
  const profile = data.profile;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: 3D Tilt Character Mugshot Card with Open-Domain Backdrop */}
        <LazyReveal variant="slide-left" className="lg:col-span-4 flex">
          <TiltCard glowColor="pink" className="w-full flex flex-col justify-between">
            {/* Open-Domain Header Cover */}
            <div className="relative h-36 w-full">
              <LazyImage
                src={OPEN_DOMAIN_IMAGES.cyberpunkCity}
                alt="Vice City Sector"
                parallax
                containerClassName="w-full h-full"
                className="w-full h-full object-cover"
                overlayClassName="bg-gradient-to-t from-[#140124] via-[#140124]/40 to-transparent"
              />
              <div className="absolute top-3 right-3 z-30 text-[10px] font-mono text-[#ff2a85] font-bold border border-[#ff2a85]/60 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md">
                LSPD CASE #021
              </div>
            </div>

            <div className="px-6 pb-6 -mt-14 relative z-20 text-center flex-1 flex flex-col justify-between">
              <div>
                <div className="w-28 h-28 mx-auto rounded-2xl border-2 border-[#00f0ff] p-1 shadow-[0_0_25px_#00f0ff] relative bg-[#0c0119] flex items-center justify-center group cursor-pointer hover:scale-105 transition-transform overflow-hidden">
                  {profile.avatarUrl ? (
                    <LazyImage
                      src={profile.avatarUrl}
                      alt={profile.name}
                      containerClassName="w-full h-full rounded-xl"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <LazyImage
                      src={OPEN_DOMAIN_IMAGES.neonNightStreet}
                      alt={profile.name}
                      containerClassName="w-full h-full rounded-xl"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  )}
                  <div className="absolute bottom-1 right-1 z-30 w-6 h-6 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center text-[10px]">
                    ⚡
                  </div>
                </div>

                <h2 className="text-xl font-black tracking-wider text-white mt-3">
                  {profile.name}
                </h2>
                <p className="text-xs font-mono text-[#00f0ff] font-bold tracking-widest mt-0.5">
                  {profile.codename.toUpperCase()}
                </p>

                <div className="mt-5 pt-4 border-t border-white/10 text-left space-y-2.5 font-mono text-xs text-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <MapPin className="w-3.5 h-3.5 text-[#ff2a85]" /> BASE:
                    </span>
                    <span className="text-white font-bold">{profile.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <GraduationCap className="w-3.5 h-3.5 text-[#00f0ff]" /> DEGREE:
                    </span>
                    <span className="text-white font-bold">{profile.education.degree}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Trophy className="w-3.5 h-3.5 text-[#ffb700]" /> CGPA:
                    </span>
                    <span className="text-[#ffb700] font-bold">{profile.education.cgpa}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> STATUS:
                    </span>
                    <span className="text-emerald-400 font-bold">Active in Production</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    sfx.playWeapon();
                    if (onOpenHireModal) onOpenHireModal();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#ff2a85] to-[#7b00ff] text-white font-bold font-mono text-xs rounded-xl shadow-[0_0_20px_rgba(255,42,133,0.5)] hover:brightness-110 active:scale-95 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>RECRUIT OPERATIVE</span>
                </button>

                <a
                  href="/api/resume"
                  download={profile.resumeFileName || "Devesh_Sharma_Resume.pdf"}
                  onClick={() => sfx.playBleep()}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-black/70 border border-[#00f0ff]/60 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black font-bold font-mono text-xs rounded-xl transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD RESUME (PDF)</span>
                </a>
              </div>
            </div>
          </TiltCard>
        </LazyReveal>

        {/* Right: Narrative Dossier Summary + Metrics */}
        <LazyReveal variant="slide-right" delayMs={100} className="lg:col-span-8 flex">
          <div className="w-full glass-vice border border-[#00f0ff]/40 p-6 sm:p-8 rounded-2xl space-y-6 shadow-[0_0_30px_rgba(0,240,255,0.2)] flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <h3 className="text-lg sm:text-xl font-black tracking-wider text-[#00f0ff] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff2a85]" />
                  <span>CONFIDENTIAL OPERATIVE REPORT</span>
                </h3>
                <span className="text-xs font-mono text-gray-400 bg-black/50 px-2.5 py-1 rounded border border-white/10">
                  CLASSIFIED // {profile.name.toUpperCase()}
                </span>
              </div>

              <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-sans">
                {profile.summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 font-mono text-xs">
                <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-500/35 hover:border-[#ff2a85] transition-colors">
                  <div className="text-[#ff2a85] font-black text-base">40–60% SPEEDUP</div>
                  <div className="text-[11px] text-gray-300 mt-1">
                    Enterprise API latency reduction via redundant query elimination
                  </div>
                </div>
                <div className="bg-cyan-950/40 p-4 rounded-xl border border-cyan-500/35 hover:border-[#00f0ff] transition-colors">
                  <div className="text-[#00f0ff] font-black text-base">80% NOISE KILL</div>
                  <div className="text-[11px] text-gray-300 mt-1">
                    Real-time DOM caching algorithm on LinkedIn feed
                  </div>
                </div>
                <div className="bg-amber-950/40 p-4 rounded-xl border border-amber-500/35 hover:border-[#ffb700] transition-colors">
                  <div className="text-[#ffb700] font-black text-base">+15% AI BOOST</div>
                  <div className="text-[11px] text-gray-300 mt-1">
                    Adversarial &amp; RLHF prompt tuning at Outlier.ai
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-black/55 rounded-xl border border-white/10 space-y-1.5">
                <div className="text-xs font-mono text-gray-400 font-bold flex flex-wrap justify-between gap-2">
                  <span>EDUCATION // ACADEMIC RECORD</span>
                  <span className="text-[#ff2a85]">{profile.education.period}</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {profile.education.institution}
                </div>
                <div className="text-xs text-gray-300">
                  {profile.education.degree} —{" "}
                  <span className="text-[#ffb700] font-mono font-bold">
                    CGPA: {profile.education.cgpa}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-black/40 rounded-xl border border-white/10">
                <div className="text-xs font-mono text-gray-400 mb-2.5 font-bold">
                  COMPUTER SCIENCE FOUNDATION &amp; COURSEWORK:
                </div>
                <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                  {profile.coursework &&
                    profile.coursework.map((course, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-900/90 border border-gray-700/80 rounded-lg text-gray-200 hover:border-[#00f0ff] hover:text-[#00f0ff] transition-colors"
                      >
                        {course}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </LazyReveal>
      </div>
    </div>
  );
};
