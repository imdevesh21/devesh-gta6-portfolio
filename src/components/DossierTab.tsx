"use client";

import React from "react";
import { OPERATIVE_PROFILE } from "../data/portfolioData";
import { sfx } from "../lib/soundFx";
import { ShieldCheck, MapPin, GraduationCap, Trophy, Sparkles, Mail } from "lucide-react";

export const DossierTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner & Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Police Mugshot / Character Card */}
        <div className="bg-[#140124]/90 border border-[#ff2a85]/50 p-5 rounded-xl text-center relative overflow-hidden shadow-[0_0_20px_rgba(255,42,133,0.3)]">
          <div className="absolute top-2 right-2 text-[10px] font-mono text-[#ff2a85] font-bold border border-[#ff2a85]/50 px-1.5 py-0.5 rounded bg-black/40">
            LSPD CASE #021
          </div>

          <div className="w-32 h-32 mx-auto rounded-full border-2 border-[#00f0ff] p-1 shadow-[0_0_25px_#00f0ff] relative my-3 bg-gradient-to-br from-purple-900 via-pink-900 to-amber-900 flex items-center justify-center text-5xl group cursor-pointer hover:scale-105 transition-transform">
            🕶️
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center text-[10px]">
              ⚡
            </div>
          </div>

          <h2 className="text-xl font-black tracking-wider text-white">
            {OPERATIVE_PROFILE.name}
          </h2>
          <p className="text-xs font-mono text-[#00f0ff] font-bold tracking-widest mt-0.5">
            {OPERATIVE_PROFILE.codename.toUpperCase()}
          </p>

          <div className="mt-4 pt-3 border-t border-gray-800 text-left space-y-2 font-mono text-xs text-gray-300">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-gray-400">
                <MapPin className="w-3.5 h-3.5 text-[#ff2a85]" /> BASE:
              </span>
              <span className="text-white font-bold">{OPERATIVE_PROFILE.location}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-gray-400">
                <GraduationCap className="w-3.5 h-3.5 text-[#00f0ff]" /> DEGREE:
              </span>
              <span className="text-white font-bold">B.Tech IT</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-gray-400">
                <Trophy className="w-3.5 h-3.5 text-[#ffb700]" /> CGPA:
              </span>
              <span className="text-[#ffb700] font-bold">{OPERATIVE_PROFILE.education.cgpa}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> STATUS:
              </span>
              <span className="text-emerald-400 font-bold">Active in Production</span>
            </div>
          </div>

          <a
            href={`mailto:${OPERATIVE_PROFILE.contact.email}`}
            onClick={() => sfx.playWeapon()}
            className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-[#ff2a85] to-[#7b00ff] text-white font-bold font-mono text-xs rounded-lg shadow-[0_0_15px_rgba(255,42,133,0.5)] hover:opacity-90 active:scale-98 transition-all"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>RECRUIT OPERATIVE</span>
          </a>
        </div>

        {/* Narrative Dossier Summary */}
        <div className="md:col-span-2 bg-[#140124]/90 border border-[#00f0ff]/50 p-6 rounded-xl space-y-4 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <h3 className="text-lg font-black tracking-wider text-[#00f0ff] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff2a85]" />
              <span>CONFIDENTIAL OPERATIVE REPORT</span>
            </h3>
            <span className="text-xs font-mono text-gray-400">CLASSIFIED // DEVESH-21</span>
          </div>

          <p className="text-sm text-gray-200 leading-relaxed font-sans">
            {OPERATIVE_PROFILE.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
            <div className="bg-purple-950/40 p-3 rounded-lg border border-purple-500/30">
              <div className="text-[#ff2a85] font-bold text-sm">40–60% SPEEDUP</div>
              <div className="text-[11px] text-gray-300 mt-0.5">Enterprise API latency reduction via redundant query elimination</div>
            </div>
            <div className="bg-cyan-950/40 p-3 rounded-lg border border-cyan-500/30">
              <div className="text-[#00f0ff] font-bold text-sm">80% NOISE KILL</div>
              <div className="text-[11px] text-gray-300 mt-0.5">Real-time DOM caching algorithm on LinkedIn feed</div>
            </div>
            <div className="bg-amber-950/40 p-3 rounded-lg border border-amber-500/30">
              <div className="text-[#ffb700] font-bold text-sm">+15% AI BOOST</div>
              <div className="text-[11px] text-gray-300 mt-0.5">Adversarial & RLHF prompt tuning at Outlier.ai</div>
            </div>
          </div>

          <div className="p-3.5 bg-black/60 rounded-lg border border-gray-800 space-y-2">
            <div className="text-xs font-mono text-gray-400 font-bold flex justify-between">
              <span>EDUCATION // ACADEMIC RECORD</span>
              <span className="text-[#ff2a85]">{OPERATIVE_PROFILE.education.period}</span>
            </div>
            <div className="text-sm font-bold text-white">
              {OPERATIVE_PROFILE.education.institution}
            </div>
            <div className="text-xs text-gray-300">
              {OPERATIVE_PROFILE.education.degree} — <span className="text-[#ffb700] font-mono font-bold">CGPA: {OPERATIVE_PROFILE.education.cgpa}</span>
            </div>
          </div>

          <div className="p-3 bg-black/40 rounded-lg border border-gray-800">
            <div className="text-xs font-mono text-gray-400 mb-2 font-bold">
              COMPUTER SCIENCE FOUNDATION & COURSEWORK:
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {OPERATIVE_PROFILE.coursework.map((course, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-gray-900/90 border border-gray-700/80 rounded text-gray-200 hover:border-[#00f0ff] transition-colors"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
