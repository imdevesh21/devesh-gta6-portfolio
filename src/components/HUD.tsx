"use client";

import React, { useState, useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { sfx } from "../lib/soundFx";
import { Volume2, VolumeX, Briefcase, ShieldAlert, Gamepad2 } from "lucide-react";
import { PalmTreeIcon } from "./Icons";

interface HUDProps {
  executiveMode: boolean;
  onToggleExecutiveMode: () => void;
  onOpenArcade?: () => void;
}

export const HUD: React.FC<HUDProps> = ({ executiveMode, onToggleExecutiveMode, onOpenArcade }) => {
  const { data } = usePortfolio();
  const profile = data.profile;

  const [cash, setCash] = useState(1540890);
  const [isMuted, setIsMuted] = useState(false);
  const [wantedStars, setWantedStars] = useState(profile.wantedLevel || 5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCash((prev) => prev + Math.floor(Math.random() * 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleMuteToggle = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    sfx.setMuted(nextState);
    if (!nextState) sfx.playBleep();
  };

  const handleStarClick = (idx: number) => {
    setWantedStars(idx + 1);
    sfx.playWeapon();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#110122]/90 backdrop-blur-md border-b border-[#ff2a85]/30 px-4 py-2.5 shadow-[0_4px_30px_rgba(255,42,133,0.2)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Operative Callout & Wanted Rating */}
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-1.5 cursor-pointer group" 
            onClick={() => sfx.playBleep()}
          >
            <span className="text-2xl font-black italic tracking-tighter text-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff] group-hover:scale-110 transition-transform">
              VI
            </span>
            <div className="leading-none">
              <h1 className="text-lg font-black tracking-widest text-white uppercase drop-shadow-[0_0_6px_#ff2a85]">
                {profile.name}
              </h1>
              <span className="text-[10px] tracking-widest text-[#ff2a85] font-mono font-bold">
                LEONIDA DIGITAL ZONE // {profile.title.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Wanted Stars */}
          <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded border border-[#ffb700]/40 shadow-[0_0_10px_rgba(255,183,0,0.2)]">
            <ShieldAlert className="w-3.5 h-3.5 text-[#ffb700]" />
            <span className="text-[10px] font-mono text-[#ffb700] font-bold mr-1">WANTED:</span>
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                onClick={() => handleStarClick(i)}
                className={`text-sm cursor-pointer transition-all ${
                  i < wantedStars 
                    ? "text-[#ffb700] drop-shadow-[0_0_6px_#ffb700] scale-105" 
                    : "text-gray-700 opacity-40"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Live Vitals, Bank Balance & Toggles */}
        <div className="flex items-center gap-4 font-mono text-xs">
          
          {/* Health & Armor Status */}
          <div className="hidden lg:flex flex-col gap-1 w-36">
            <div className="flex items-center justify-between text-[9px] text-emerald-400 font-bold">
              <span>{profile.vitals.healthLabel || "HEALTH (UI/UX)"}</span>
              <span>{profile.vitals.healthVal}%</span>
            </div>
            <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden border border-emerald-500/30">
              <div 
                className="bg-emerald-500 h-full shadow-[0_0_8px_#10b981]" 
                style={{ width: `${profile.vitals.healthVal}%` }} 
              />
            </div>
            <div className="flex items-center justify-between text-[9px] text-cyan-400 font-bold">
              <span>{profile.vitals.armorLabel || "ARMOR (BACKEND)"}</span>
              <span>{profile.vitals.armorVal}%</span>
            </div>
            <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden border border-cyan-500/30">
              <div 
                className="bg-cyan-500 h-full shadow-[0_0_8px_#06b6d4]" 
                style={{ width: `${profile.vitals.armorVal}%` }} 
              />
            </div>
          </div>

          {/* Cash Balance Display */}
          <div className="bg-black/70 px-3 py-1.5 rounded border border-[#00f0ff]/40 text-right shadow-[0_0_12px_rgba(0,240,255,0.2)]">
            <div className="text-[9px] text-[#00f0ff] font-bold tracking-wider">OPERATIVE VALUE</div>
            <div className="text-sm font-black text-emerald-400 tracking-wider">
              ${cash.toLocaleString()}
            </div>
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleMuteToggle}
            className="p-1.5 rounded bg-black/60 border border-gray-700 hover:border-[#ff2a85] text-gray-300 hover:text-white transition-colors"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#00f0ff]" />}
          </button>

          {/* Arcade Mini-Game Launcher */}
          {onOpenArcade && !executiveMode && (
            <button
              onClick={() => {
                sfx.playArcadeBoost();
                onOpenArcade();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-black/70 border border-[#00f0ff]/50 hover:border-[#ff2a85] text-[#00f0ff] hover:text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.25)] hover:shadow-[0_0_15px_#ff2a85]"
              title="Play Leonida Drift Arcade Game"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span className="hidden sm:inline">ARCADE</span>
            </button>
          )}

          {/* Recruiter Executive Mode Toggle */}
          <button
            onClick={() => {
              sfx.playBleep();
              onToggleExecutiveMode();
            }}
            className="px-3 py-1.5 rounded bg-gradient-to-r from-[#ff2a85] to-[#7b00ff] text-white font-bold text-xs shadow-[0_0_15px_rgba(255,42,133,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
          >
            {executiveMode ? (
              <>
                <PalmTreeIcon className="w-3.5 h-3.5 text-yellow-300" />
                <span>Vice City Mode</span>
              </>
            ) : (
              <>
                <Briefcase className="w-3.5 h-3.5" />
                <span>Recruiter View</span>
              </>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
