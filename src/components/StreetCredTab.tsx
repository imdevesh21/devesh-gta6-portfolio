"use client";

import React from "react";
import { Award, CheckCircle } from "lucide-react";

export const StreetCredTab: React.FC = () => {
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
        
        {/* Google Cloud Security Challenge */}
        <div className="bg-[#140124]/90 border border-[#00f0ff]/60 p-6 rounded-2xl space-y-4 shadow-[0_0_25px_rgba(0,240,255,0.25)]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-3xl">
              🛡️
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-wide">
                GOOGLE CLOUD SECURITY CHALLENGE
              </h3>
              <p className="text-xs font-mono text-[#00f0ff] font-bold">
                LEVEL 1 & LEVEL 2 // OFFICIAL GOOGLE RECOGNITION
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Completed both official Google Cloud security challenge levels. Mastered identity access management (IAM), zero-trust access controls, infrastructure isolation, and cloud perimeter defense best practices.
          </p>

          <div className="font-mono text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/30 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>OFFICIAL RECOGNITION CONFIRMED BY GOOGLE</span>
          </div>
        </div>

        {/* Google Cloud Essentials */}
        <div className="bg-[#140124]/90 border border-[#ff2a85]/60 p-6 rounded-2xl space-y-4 shadow-[0_0_25px_rgba(255,42,133,0.25)]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-pink-950/60 border border-[#ff2a85]/50 flex items-center justify-center text-3xl">
              ☁️
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-wide">
                GOOGLE CLOUD ESSENTIALS
              </h3>
              <p className="text-xs font-mono text-[#ff2a85] font-bold">
                GOOGLE CLOUD PLATFORM VERIFIED BADGE
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Completed hands-on labs verifying proficiency across core GCP computing instances, IAM authorization rules, Cloud Storage bucket configuration, and virtual private network infrastructure.
          </p>

          <div className="font-mono text-xs text-[#ff2a85] bg-pink-950/40 p-2.5 rounded-lg border border-[#ff2a85]/30 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#ff2a85]" />
            <span>VERIFIED DIGITAL BADGE AWARDED</span>
          </div>
        </div>

        {/* LeetCode & DSA 100-Day Streak (Spans full width) */}
        <div className="bg-[#140124]/90 border border-[#ffb700]/60 p-6 rounded-2xl space-y-4 md:col-span-2 shadow-[0_0_25px_rgba(255,183,0,0.25)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/50 flex items-center justify-center text-3xl">
                🔥
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-wide">
                  100+ DAY ALGORITHMIC STREAK
                </h3>
                <p className="text-xs font-mono text-amber-400 font-bold">
                  150+ DSA PROBLEMS SOLVED (LEETCODE / GFG / CODING NINJAS)
                </p>
              </div>
            </div>

            <div className="text-2xl font-mono font-black text-amber-400 bg-amber-950/60 px-4 py-1.5 rounded-xl border border-amber-500/40 shadow-inner">
              150+ SOLVED
            </div>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Demonstrated continuous mental resilience and computational discipline by maintaining a 100+ day unbroken streak. Solid problem-solving foundation across high-complexity topics:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs pt-1">
            <div className="p-3 bg-black/60 rounded-xl border border-gray-800 text-center">
              <div className="text-gray-400 text-[10px]">ARRAYS & STRINGS</div>
              <div className="text-white font-bold text-sm mt-0.5">High Mastery</div>
            </div>
            <div className="p-3 bg-black/60 rounded-xl border border-gray-800 text-center">
              <div className="text-gray-400 text-[10px]">TREES & GRAPHS</div>
              <div className="text-white font-bold text-sm mt-0.5">High Mastery</div>
            </div>
            <div className="p-3 bg-black/60 rounded-xl border border-gray-800 text-center">
              <div className="text-gray-400 text-[10px]">DYNAMIC PROG.</div>
              <div className="text-white font-bold text-sm mt-0.5">High Mastery</div>
            </div>
            <div className="p-3 bg-black/60 rounded-xl border border-gray-800 text-center">
              <div className="text-gray-400 text-[10px]">STREAK LOG</div>
              <div className="text-amber-400 font-bold text-sm mt-0.5">100+ Days</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
