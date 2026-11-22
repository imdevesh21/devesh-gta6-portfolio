"use client";

import React, { useState, useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { SkillWeapon } from "../types/portfolio";
import { sfx } from "../lib/soundFx";
import { Crosshair, Zap, Target } from "lucide-react";

export const WeaponWheelTab: React.FC = () => {
  const { data } = usePortfolio();
  const weaponsList = data.skills;
  const [selectedWeapon, setSelectedWeapon] = useState<SkillWeapon>(weaponsList[0] || {} as SkillWeapon);

  useEffect(() => {
    if (weaponsList.length > 0) {
      setSelectedWeapon(weaponsList[0]);
    }
  }, [weaponsList]);

  const handleSelectWeapon = (weapon: SkillWeapon) => {
    sfx.playWeapon();
    setSelectedWeapon(weapon);
  };

  if (!selectedWeapon || !selectedWeapon.name) {
    return <div className="text-center font-mono text-gray-500 py-10">NO WEAPONS LOADED IN ARSENAL.</div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-black tracking-widest text-[#00f0ff] uppercase drop-shadow-[0_0_10px_#00f0ff]">
          AMMU-NATION TECHNICAL ARSENAL
        </h2>
        <p className="text-xs font-mono text-pink-300">
          SELECT A WEAPON FROM THE WHEEL TO INSPECT COMBAT CAPABILITIES & TELEMETRY
        </p>
      </div>

      {/* Grid of Weapon Loadout Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {weaponsList.map((w) => {
          const isSelected = selectedWeapon.id === w.id;
          return (
            <div
              key={w.id}
              onClick={() => handleSelectWeapon(w)}
              className={`cursor-pointer p-3.5 rounded-xl bg-[#140124]/90 transition-all text-center border relative overflow-hidden group hover:scale-102 ${
                isSelected
                  ? "border-[#ff2a85] shadow-[0_0_20px_rgba(255,42,133,0.6)] bg-[#ff2a85]/15"
                  : "border-gray-800 hover:border-[#00f0ff]/50 hover:bg-black/60"
              }`}
            >
              {isSelected && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ff2a85] animate-ping" />
              )}
              <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">
                {w.icon || "⚡"}
              </div>
              <div className="font-bold text-white text-xs tracking-wider">
                {w.name}
              </div>
              <div className="text-[10px] font-mono text-gray-400 mt-1 truncate">
                {w.weaponClass ? w.weaponClass.split("//")[0] : ""}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Weapon Detail Inspector */}
      <div className="bg-[#140124]/95 border border-[#ff2a85]/60 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 shadow-[0_0_30px_rgba(255,42,133,0.25)] relative overflow-hidden">
        {/* Left Column: Icon & Classification */}
        <div className="text-center md:border-r border-gray-800 md:pr-6 flex flex-col justify-center items-center">
          <div className="text-6xl mb-3 p-4 rounded-2xl bg-black/60 border border-gray-800 shadow-inner">
            {selectedWeapon.icon || "⚡"}
          </div>
          <h3 className="text-xl font-black text-white tracking-wide">
            {selectedWeapon.name}
          </h3>
          <p className="text-xs font-mono text-[#ff2a85] font-bold mt-1 tracking-wider uppercase">
            {selectedWeapon.weaponClass}
          </p>
          <div className="mt-4 px-3 py-1 bg-gray-900/90 rounded-full border border-gray-700 text-[10px] font-mono text-emerald-400 font-bold">
            TIER: S-RANK PRODUCTION LOADOUT
          </div>
        </div>

        {/* Right Columns: Description & Combat Telemetry */}
        <div className="md:col-span-2 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-gray-400 font-bold">TACTICAL BRIEFING:</span>
            <p className="text-sm text-gray-200 leading-relaxed font-sans">
              {selectedWeapon.description}
            </p>
          </div>

          {/* Combat Metrics Bars */}
          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Zap className="w-3.5 h-3.5" /> FIRE RATE (RENDER / EXECUTION VELOCITY):
                </span>
                <span className="text-emerald-400 font-bold">{selectedWeapon.fireRate}%</span>
              </div>
              <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-emerald-500/30">
                <div
                  className="bg-emerald-500 h-full shadow-[0_0_8px_#10b981] transition-all duration-500"
                  style={{ width: `${selectedWeapon.fireRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span className="flex items-center gap-1.5 text-[#00f0ff] font-bold">
                  <Crosshair className="w-3.5 h-3.5" /> DAMAGE (ARCHITECTURAL IMPACT):
                </span>
                <span className="text-[#00f0ff] font-bold">{selectedWeapon.damage}%</span>
              </div>
              <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-cyan-500/30">
                <div
                  className="bg-[#00f0ff] h-full shadow-[0_0_8px_#00f0ff] transition-all duration-500"
                  style={{ width: `${selectedWeapon.damage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span className="flex items-center gap-1.5 text-[#ffb700] font-bold">
                  <Target className="w-3.5 h-3.5" /> ACCURACY (TYPE SAFETY / ZERO DRIFT):
                </span>
                <span className="text-[#ffb700] font-bold">{selectedWeapon.accuracy}%</span>
              </div>
              <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-amber-500/30">
                <div
                  className="bg-amber-400 h-full shadow-[0_0_8px_#f59e0b] transition-all duration-500"
                  style={{ width: `${selectedWeapon.accuracy}%` }}
                />
              </div>
            </div>
          </div>

          {/* Deployed Battleground */}
          <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400">DEPLOYED BATTLEGROUND:</span>
            <span className="text-[#ff2a85] font-bold">{selectedWeapon.battleground}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
