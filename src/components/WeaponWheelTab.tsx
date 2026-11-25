"use client";

import React, { useState, useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { SkillWeapon } from "../types/portfolio";
import { sfx } from "../lib/soundFx";
import { LazyImage } from "./ui/LazyImage";
import { LazyReveal } from "./ui/LazyReveal";
import { TiltCard } from "./TiltCard";
import { OPEN_DOMAIN_IMAGES } from "@/lib/openDomainImages";
import { Crosshair, Zap, Target } from "lucide-react";

export const WeaponWheelTab: React.FC = () => {
  const { data } = usePortfolio();
  const weaponsList = data.skills;
  const [selectedWeapon, setSelectedWeapon] = useState<SkillWeapon>(
    weaponsList[0] || ({} as SkillWeapon)
  );

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
    return (
      <div className="text-center font-mono text-gray-500 py-10">
        NO WEAPONS LOADED IN ARSENAL.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Parallax Open-Domain Tactical Header Banner */}
      <LazyReveal variant="fade-up">
        <div className="relative rounded-2xl overflow-hidden border border-[#00f0ff]/40 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
          <LazyImage
            src={OPEN_DOMAIN_IMAGES.arsenalSetup}
            alt="Ammu-Nation Tactical Tech Setup"
            parallax
            containerClassName="h-44 sm:h-52 w-full"
            className="w-full h-full object-cover opacity-55"
            overlayClassName="bg-gradient-to-r from-[#0c0119] via-[#140124]/75 to-[#0c0119]"
          />
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#ff2a85] uppercase font-bold mb-1">
              AMMUNATION // COMBAT TECH LOADOUT
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-widest text-[#00f0ff] uppercase drop-shadow-[0_0_12px_#00f0ff]">
              TECHNICAL ARSENAL
            </h2>
            <p className="text-xs font-mono text-pink-200 mt-1 max-w-xl">
              SELECT A WEAPON FROM THE WHEEL TO INSPECT PRODUCTION CAPABILITIES &amp; TELEMETRY
            </p>
          </div>
        </div>
      </LazyReveal>

      {/* Grid of Weapon Loadout Cards */}
      <LazyReveal variant="zoom-in" delayMs={80}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {weaponsList.map((w) => {
            const isSelected = selectedWeapon.id === w.id;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => handleSelectWeapon(w)}
                className={`cursor-pointer p-4 rounded-2xl glass-vice transition-all text-center border relative overflow-hidden group hover:-translate-y-1 ${
                  isSelected
                    ? "border-[#ff2a85] shadow-[0_0_25px_rgba(255,42,133,0.55)] ring-1 ring-[#ff2a85]/60"
                    : "border-white/10 hover:border-[#00f0ff]/60"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff2a85] animate-ping" />
                )}
                <div className="text-3xl mb-1.5 group-hover:scale-110 transition-transform">
                  {w.icon || "⚡"}
                </div>
                <div className="font-bold text-white text-xs sm:text-sm tracking-wider">
                  {w.name}
                </div>
                <div className="text-[10px] font-mono text-gray-400 mt-1 truncate">
                  {w.weaponClass ? w.weaponClass.split("//")[0] : ""}
                </div>
              </button>
            );
          })}
        </div>
      </LazyReveal>

      {/* Selected Weapon Detail Inspector */}
      <LazyReveal variant="fade-up" delayMs={140}>
        <TiltCard glowColor="pink" className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Icon & Classification */}
            <div className="text-center md:border-r border-white/10 md:pr-6 flex flex-col justify-center items-center">
              <div className="text-6xl mb-3 p-5 rounded-2xl bg-black/60 border border-white/10 shadow-inner">
                {selectedWeapon.icon || "⚡"}
              </div>
              <h3 className="text-xl font-black text-white tracking-wide">
                {selectedWeapon.name}
              </h3>
              <p className="text-xs font-mono text-[#ff2a85] font-bold mt-1 tracking-wider uppercase">
                {selectedWeapon.weaponClass}
              </p>
              <div className="mt-4 px-3 py-1 bg-emerald-950/60 rounded-full border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold">
                TIER: S-RANK PRODUCTION LOADOUT
              </div>
            </div>

            {/* Right Columns: Description & Combat Telemetry */}
            <div className="md:col-span-2 space-y-5">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-gray-400 font-bold tracking-widest">
                  TACTICAL BRIEFING:
                </span>
                <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-sans">
                  {selectedWeapon.description}
                </p>
              </div>

              <div className="space-y-3.5 font-mono text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-[#ff2a85] font-bold">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> DAMAGE (IMPACT)
                    </span>
                    <span>{selectedWeapon.damage}%</span>
                  </div>
                  <div className="w-full bg-black/70 h-2.5 rounded-full overflow-hidden border border-[#ff2a85]/30">
                    <div
                      className="bg-gradient-to-r from-[#ff2a85] to-[#ff6b9d] h-full transition-all duration-500 shadow-[0_0_10px_#ff2a85]"
                      style={{ width: `${selectedWeapon.damage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[#00f0ff] font-bold">
                    <span className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" /> FIRE RATE (VELOCITY)
                    </span>
                    <span>{selectedWeapon.fireRate}%</span>
                  </div>
                  <div className="w-full bg-black/70 h-2.5 rounded-full overflow-hidden border border-[#00f0ff]/30">
                    <div
                      className="bg-gradient-to-r from-[#00f0ff] to-[#60efff] h-full transition-all duration-500 shadow-[0_0_10px_#00f0ff]"
                      style={{ width: `${selectedWeapon.fireRate}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[#ffb700] font-bold">
                    <span className="flex items-center gap-1.5">
                      <Crosshair className="w-3.5 h-3.5" /> ACCURACY (CLEAN CODE)
                    </span>
                    <span>{selectedWeapon.accuracy}%</span>
                  </div>
                  <div className="w-full bg-black/70 h-2.5 rounded-full overflow-hidden border border-[#ffb700]/30">
                    <div
                      className="bg-gradient-to-r from-[#ffb700] to-[#ffe066] h-full transition-all duration-500 shadow-[0_0_10px_#ffb700]"
                      style={{ width: `${selectedWeapon.accuracy}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[10px] font-mono text-gray-400 font-bold mb-1.5">
                  PROVEN BATTLEGROUND &amp; DEPLOYMENT CONTEXT:
                </div>
                <div className="inline-flex items-center px-3 py-1.5 bg-black/60 border border-[#00f0ff]/30 rounded-lg text-xs font-mono text-[#00f0ff]">
                  {selectedWeapon.battleground}
                </div>
              </div>
            </div>
          </div>
        </TiltCard>
      </LazyReveal>
    </div>
  );
};
