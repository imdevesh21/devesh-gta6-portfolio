"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { ParallaxSection, ParallaxLayer } from "./ParallaxSection";
import { LazyImage } from "./LazyImage";
import { OPEN_DOMAIN_IMAGES } from "@/lib/openDomainImages";
import { sfx } from "@/lib/soundFx";
import { Terminal, ChevronDown, Sparkles, MapPin, ShieldCheck, Mail, Download } from "lucide-react";

interface ParallaxHeroProps {
  onOpenTerminal: () => void;
  onJumpToSection: (sectionId: string) => void;
  onOpenHireModal?: () => void;
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = ({
  onOpenTerminal,
  onJumpToSection,
  onOpenHireModal,
}) => {
  const { data } = usePortfolio();
  const profile = data.profile;

  return (
    <ParallaxSection className="relative min-h-[540px] sm:min-h-[600px] flex items-center justify-center border-b border-[#ff2a85]/30 mb-8">
      {/* LAYER 0: Deep Skyline Open-Domain Photography (slowest scroll + subtle mouse drift) */}
      <ParallaxLayer
        speed={0.22}
        mouseDepth={-10}
        className="absolute inset-0 -top-16 -bottom-16 z-0"
      >
        <LazyImage
          src={OPEN_DOMAIN_IMAGES.viceSkyline}
          alt="Leonida Vice City Neon Skyline"
          priority
          containerClassName="w-full h-full"
          className="w-full h-full object-cover opacity-55 saturate-150 contrast-110"
          overlayClassName="bg-gradient-to-b from-[#0c0119]/80 via-[#1a0233]/65 to-[#0c0119]"
        />
      </ParallaxLayer>

      {/* LAYER 1: Midground Vice Sun Glow & Palm Silhouette Horizon */}
      <ParallaxLayer
        speed={0.12}
        mouseDepth={16}
        className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
      >
        <div className="w-[260px] h-[260px] sm:w-[460px] sm:h-[460px] rounded-full bg-gradient-to-b from-[#ffb700]/30 via-[#ff2a85]/25 to-transparent blur-3xl opacity-80" />
      </ParallaxLayer>

      {/* LAYER 2: Secondary Open-Domain Palm / Ocean Texture Strip */}
      <ParallaxLayer
        speed={-0.08}
        mouseDepth={8}
        className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none opacity-30 mix-blend-screen"
      >
        <LazyImage
          src={OPEN_DOMAIN_IMAGES.vicePalmsSunset}
          alt="Vice Beach Sunset"
          priority
          containerClassName="w-full h-full"
          className="w-full h-full object-cover object-bottom"
          overlayClassName="bg-gradient-to-t from-[#0c0119] via-transparent to-[#0c0119]"
        />
      </ParallaxLayer>

      {/* LAYER 3: Foreground Tactical Hero Content */}
      <ParallaxLayer
        speed={-0.04}
        mouseDepth={-6}
        className="relative z-20 max-w-6xl mx-auto px-4 py-12 w-full"
      >
        {/* Top Tactical Telemetry Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono mb-8 bg-black/55 backdrop-blur-xl px-3.5 py-2 rounded-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
          <div className="flex items-center gap-2 text-[#00f0ff]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <MapPin className="w-3.5 h-3.5 text-[#ff2a85]" />
            <span className="tracking-wider">
              26.9124° N, 75.7873° E // {profile.location.toUpperCase()} — LEONIDA GRID
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              AVAILABLE FOR HIRE
            </span>
            <button
              onClick={() => {
                sfx.playClick();
                onOpenTerminal();
              }}
              className="flex items-center gap-1.5 text-amber-300 hover:text-white px-2.5 py-1 rounded-lg bg-amber-950/50 border border-amber-500/40 hover:border-amber-300 transition-all"
              title="Press ` or ~ to toggle cheat terminal"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>CHEAT CONSOLE [~]</span>
            </button>
          </div>
        </div>

        {/* Main Hero Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: GTA VI Stylized Headline & Pitch */}
          <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff2a85]/15 border border-[#ff2a85]/50 text-[#ff85b8] font-mono text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#ffb700]" />
              <span>WELCOME TO LEONIDA // {profile.codename.toUpperCase()}</span>
            </div>

            <h1 className="gta-title text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-wider">
              {profile.name}
            </h1>

            <p className="text-sm sm:text-xl font-mono font-bold text-[#00f0ff] tracking-wide drop-shadow-[0_0_12px_rgba(0,240,255,0.45)]">
              {profile.title}
            </p>

            <p className="text-xs sm:text-base text-gray-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed bg-black/35 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10">
              {profile.summary}
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-2 font-mono text-xs">
              <button
                onClick={() => {
                  sfx.playWeapon();
                  onJumpToSection("contracts");
                }}
                className="w-full sm:w-auto justify-center px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#7b00ff] text-white font-black tracking-widest uppercase shadow-[0_0_25px_rgba(255,42,133,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>EXPLORE BOUNTIES</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <a
                href="/api/resume"
                download={profile.resumeFileName || "Devesh_Sharma_Resume.pdf"}
                onClick={() => sfx.playBleep()}
                className="w-full sm:w-auto justify-center px-5 sm:px-6 py-3 rounded-xl bg-black/70 backdrop-blur-md border border-[#00f0ff]/60 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black font-black tracking-widest uppercase shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD RESUME</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  sfx.playBleep();
                  if (onOpenHireModal) onOpenHireModal();
                }}
                className="w-full sm:w-auto justify-center px-5 py-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white hover:border-[#ff2a85] hover:text-[#ff85b8] font-black tracking-widest uppercase transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>RECRUIT</span>
              </button>
            </div>
          </div>

          {/* Right: Floating 3D-Glass Operative Preview Card */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-full max-w-xs glass-vice rounded-3xl p-5 border border-[#00f0ff]/40 shadow-[0_0_40px_rgba(0,240,255,0.25)] space-y-4 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#ff2a85]/25 blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between text-[10px] font-mono text-gray-300">
                <span className="text-[#ff2a85] font-bold">LSPD DOSSIER #021</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ONLINE
                </span>
              </div>

              <div className="relative h-44 rounded-2xl overflow-hidden border border-white/15">
                <LazyImage
                  src={profile.avatarUrl || OPEN_DOMAIN_IMAGES.neonNightStreet}
                  alt={profile.name}
                  priority
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover"
                  overlayClassName="bg-gradient-to-t from-[#0c0119] via-transparent to-transparent"
                />
                <div className="absolute bottom-2.5 left-3 right-3 z-30 flex items-center justify-between font-mono text-xs">
                  <span className="font-black text-white drop-shadow">{profile.codename}</span>
                  <span className="text-[#ffb700] font-bold">★ {profile.wantedLevel}/5</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="bg-black/55 rounded-xl p-2 border border-white/10">
                  <div className="text-[#ff2a85] font-black text-sm">60%</div>
                  <div className="text-[9px] text-gray-400">API BOOST</div>
                </div>
                <div className="bg-black/55 rounded-xl p-2 border border-white/10">
                  <div className="text-[#00f0ff] font-black text-sm">150+</div>
                  <div className="text-[9px] text-gray-400">DSA SOLVED</div>
                </div>
                <div className="bg-black/55 rounded-xl p-2 border border-white/10">
                  <div className="text-[#ffb700] font-black text-sm">{profile.education.cgpa}</div>
                  <div className="text-[9px] text-gray-400">CGPA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ParallaxLayer>
    </ParallaxSection>
  );
};
