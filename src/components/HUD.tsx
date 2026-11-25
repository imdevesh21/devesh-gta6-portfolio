"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";
import { sfx } from "../lib/soundFx";
import { NavbarMiniGame } from "./NavbarMiniGame";
import {
  Volume2,
  VolumeX,
  Briefcase,
  ShieldAlert,
  Gamepad2,
  Newspaper,
  Radio,
  Menu,
  X,
  Palette,
} from "lucide-react";
import { PalmTreeIcon } from "./Icons";

interface HUDProps {
  executiveMode: boolean;
  onToggleExecutiveMode: () => void;
  onOpenArcade?: () => void;
  onToggleRadio?: () => void;
  isRadioOpen?: boolean;
  onLogoClick?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  executiveMode,
  onToggleExecutiveMode,
  onOpenArcade,
  onToggleRadio,
  isRadioOpen,
  onLogoClick,
}) => {
  const { data } = usePortfolio();
  const profile = data.profile;

  const [cash, setCash] = useState(1540890);
  const [isMuted, setIsMuted] = useState(false);
  const [wantedStars, setWantedStars] = useState(profile.wantedLevel || 5);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"vice" | "gold" | "matrix">("vice");

  const cycleTheme = () => {
    const order: Array<"vice" | "gold" | "matrix"> = ["vice", "gold", "matrix"];
    const next = order[(order.indexOf(themeMode) + 1) % order.length];
    setThemeMode(next);
    sfx.playClick();
    if (typeof document !== "undefined") {
      if (next === "vice") {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", next);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCash((prev) => prev + Math.floor(Math.random() * 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleEarnCash = useCallback((amount: number) => {
    setCash((prev) => prev + amount);
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
    <header className="sticky top-0 z-50 glass-vice border-b border-[#ff2a85]/40 px-3 sm:px-5 py-2 shadow-[0_6px_32px_rgba(255,42,133,0.2)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3">
        {/* LEFT: Brand + Wanted Stars */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex items-center gap-2.5 cursor-pointer group select-none active:scale-95 transition-transform"
            onClick={() => {
              sfx.playBleep();
              if (onLogoClick) onLogoClick();
            }}
            title="Reset to Top"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff2a85] via-[#7b00ff] to-[#00f0ff] p-[1.5px] shadow-[0_0_15px_rgba(0,240,255,0.45)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[10px] bg-[#0c0119] flex items-center justify-center">
                <span className="text-lg font-black italic tracking-tighter text-[#00f0ff]">
                  VI
                </span>
              </div>
            </div>

            <div className="leading-tight truncate">
              <h1 className="text-sm sm:text-base font-black tracking-widest text-white uppercase group-hover:text-[#00f0ff] transition-colors truncate">
                {profile.name}
              </h1>
              <div className="flex items-center gap-1.5 text-[9px] tracking-widest text-[#ff2a85] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate">{profile.title.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Wanted Stars Badge */}
          <div className="hidden xl:flex items-center gap-1 bg-black/65 px-2.5 py-1 rounded-lg border border-[#ffb700]/40">
            <ShieldAlert className="w-3 h-3 text-[#ffb700]" />
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                onClick={() => handleStarClick(i)}
                className={`text-xs cursor-pointer transition-all ${
                  i < wantedStars
                    ? "text-[#ffb700] drop-shadow-[0_0_6px_#ffb700]"
                    : "text-gray-700 opacity-40"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* CENTER: Playable Mini GTA Game Inside the Navbar */}
        {!executiveMode && <NavbarMiniGame onEarnCash={handleEarnCash} />}

        {/* RIGHT: Cash, Audio, Radio, Arcade, Dispatches, Executive Mode */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Live Cash Counter */}
          <div className="hidden sm:block bg-black/70 px-2.5 py-1 rounded-lg border border-emerald-500/35 text-right">
            <div className="text-[8px] text-[#00f0ff] font-bold tracking-wider">VALUE</div>
            <div className="text-xs font-black text-emerald-400 tracking-wider">
              ${cash.toLocaleString()}
            </div>
          </div>

          {/* Desktop Action Pills */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={cycleTheme}
              className="p-2 rounded-lg bg-black/65 border border-white/15 hover:border-[#ffb700] text-gray-300 hover:text-white transition-colors flex items-center gap-1"
              title={`Theme: ${themeMode.toUpperCase()} (Click to switch)`}
            >
              <Palette className="w-3.5 h-3.5 text-[#ffb700]" />
              <span className="hidden xl:inline text-[10px] uppercase">{themeMode}</span>
            </button>

            <button
              onClick={handleMuteToggle}
              className="p-2 rounded-lg bg-black/65 border border-white/15 hover:border-[#ff2a85] text-gray-300 hover:text-white transition-colors"
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#00f0ff]" />
              )}
            </button>

            {onToggleRadio && !executiveMode && (
              <button
                onClick={() => {
                  sfx.playClick();
                  onToggleRadio();
                }}
                className={`px-2.5 py-1.5 rounded-lg border font-bold transition-all flex items-center gap-1.5 ${
                  isRadioOpen
                    ? "bg-amber-950/80 border-amber-400 text-amber-300 shadow-[0_0_12px_#f59e0b]"
                    : "bg-black/65 border-white/15 hover:border-[#ff2a85] text-gray-300 hover:text-white"
                }`}
                title="Vice City Radio"
              >
                <Radio
                  className={`w-3.5 h-3.5 ${
                    isRadioOpen ? "text-amber-400 animate-pulse" : "text-[#ff2a85]"
                  }`}
                />
                <span>RADIO</span>
              </button>
            )}

            {onOpenArcade && !executiveMode && (
              <button
                onClick={() => {
                  sfx.playArcadeBoost();
                  onOpenArcade();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-black/65 border border-[#00f0ff]/45 hover:border-[#ff2a85] text-[#00f0ff] hover:text-white font-bold transition-all flex items-center gap-1.5"
                title="Full Arcade Mode"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>ARCADE</span>
              </button>
            )}

            <Link
              href="/blog"
              onClick={() => sfx.playClick()}
              className="px-2.5 py-1.5 rounded-lg bg-black/65 border border-[#ff2a85]/45 hover:border-[#00f0ff] text-pink-300 hover:text-white font-bold transition-all flex items-center gap-1.5"
              title="Weazel News & Dispatches"
            >
              <Newspaper className="w-3.5 h-3.5 text-[#ff2a85]" />
              <span>BLOG</span>
            </Link>
          </div>

          {/* Recruiter Mode CTA */}
          <button
            onClick={() => {
              sfx.playBleep();
              onToggleExecutiveMode();
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#7b00ff] text-white font-bold text-xs shadow-[0_0_16px_rgba(255,42,133,0.45)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
          >
            {executiveMode ? (
              <>
                <PalmTreeIcon className="w-3.5 h-3.5 text-yellow-300" />
                <span className="hidden sm:inline">Vice City</span>
              </>
            ) : (
              <>
                <Briefcase className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Recruiter</span>
              </>
            )}
          </button>

          {/* Mobile Drawer Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg bg-black/65 border border-white/15 text-gray-200 hover:border-[#00f0ff]"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileOpen && (
        <div className="lg:hidden mt-2 pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
          <button
            onClick={handleMuteToggle}
            className="px-3 py-1.5 rounded-lg bg-black/65 border border-white/15 text-gray-200 flex items-center gap-1.5"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#00f0ff]" />}
            <span>{isMuted ? "Unmute" : "Sound On"}</span>
          </button>

          {onToggleRadio && !executiveMode && (
            <button
              onClick={() => {
                sfx.playClick();
                onToggleRadio();
                setMobileOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-black/65 border border-white/15 text-amber-300 flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Radio</span>
            </button>
          )}

          {onOpenArcade && !executiveMode && (
            <button
              onClick={() => {
                sfx.playArcadeBoost();
                onOpenArcade();
                setMobileOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-black/65 border border-[#00f0ff]/45 text-[#00f0ff] flex items-center gap-1.5"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Arcade</span>
            </button>
          )}

          <Link
            href="/blog"
            onClick={() => sfx.playClick()}
            className="px-3 py-1.5 rounded-lg bg-black/65 border border-[#ff2a85]/45 text-pink-300 flex items-center gap-1.5"
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>Blog</span>
          </Link>
        </div>
      )}
    </header>
  );
};
