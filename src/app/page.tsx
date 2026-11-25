"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { HUD } from "../components/HUD";
import { DossierTab } from "../components/DossierTab";
import { WeaponWheelTab } from "../components/WeaponWheelTab";
import { HeistCampaignTab } from "../components/HeistCampaignTab";
import { ContractsTab } from "../components/ContractsTab";
import { StreetCredTab } from "../components/StreetCredTab";
import { PhotoholicGallery } from "../components/PhotoholicGallery";
import { GitHubAndMapSection } from "../components/GitHubAndMapSection";
import { HireMeModal } from "../components/HireMeModal";
import { LesterAssistant } from "../components/LesterAssistant";
import { IFruitPhone } from "../components/IFruitPhone";
import { MissionPassedModal } from "../components/MissionPassedModal";
import { CheatCodeTerminal } from "../components/CheatCodeTerminal";
import { CinematicIntro } from "../components/CinematicIntro";
import { RecruiterExecutiveView } from "../components/RecruiterExecutiveView";
import { GTARadioPlayer } from "../components/GTARadioPlayer";
import { ParallaxHero } from "../components/ui/ParallaxHero";
import { ParallaxSection, ParallaxLayer } from "../components/ui/ParallaxSection";
import { LazyImage } from "../components/ui/LazyImage";
import { LazyReveal } from "../components/ui/LazyReveal";
import { OPEN_DOMAIN_IMAGES } from "../lib/openDomainImages";
import { ProjectItem } from "../types/portfolio";
import { sfx } from "../lib/soundFx";

// Dynamic code-split lazy loading for heavy 3D WebGL & Arcade modules
const ThreeCanvas = dynamic(
  () => import("../components/ThreeCanvas").then((mod) => mod.ThreeCanvas),
  { ssr: false }
);
const ArcadeTab = dynamic(
  () => import("../components/ArcadeTab").then((mod) => mod.ArcadeTab),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 rounded-2xl border border-white/10 cyber-shimmer flex items-center justify-center font-mono text-xs text-[#00f0ff]">
        INITIALIZING VICE ARCADE ENGINE...
      </div>
    ),
  }
);

const NAV_SECTIONS = [
  { id: "dossier", label: "Dossier", icon: "👤", accent: "from-[#ff2a85] to-[#7b00ff]" },
  { id: "weapons", label: "Arsenal", icon: "🔫", accent: "from-[#00f0ff] to-[#00a8ff]" },
  { id: "campaign", label: "Heists", icon: "🚁", accent: "from-[#ff2a85] to-[#e11d48]" },
  { id: "contracts", label: "Bounties", icon: "💎", accent: "from-[#00f0ff] to-[#38bdf8]" },
  { id: "photos", label: "Photoholic", icon: "📸", accent: "from-[#ff2a85] to-[#ffb700]" },
  { id: "trophies", label: "Street Cred", icon: "🏆", accent: "from-[#ffb700] to-[#f59e0b]" },
  { id: "arcade", label: "Arcade", icon: "🕹️", accent: "from-[#ff2a85] via-[#a855f7] to-[#00f0ff]" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("dossier");
  const [executiveMode, setExecutiveMode] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isPhoneOpen, setIsPhoneOpen] = useState<boolean>(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isRadioOpen, setIsRadioOpen] = useState<boolean>(false);
  const [isRadioMinimized, setIsRadioMinimized] = useState<boolean>(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState<boolean>(false);

  const jumpToSection = (sectionId: string) => {
    sfx.playClick();
    setActiveTab(sectionId);
    if (typeof document !== "undefined") {
      const el = document.getElementById(`section-${sectionId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleToggleRadio = () => {
    if (!isRadioOpen) {
      sfx.playRadioTuning();
      setIsRadioOpen(true);
      setIsRadioMinimized(false);
    } else {
      setIsRadioOpen(false);
    }
  };

  const handleLogoClick = () => {
    sfx.playWeapon();
    setActiveTab("dossier");
    setExecutiveMode(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0c0119] text-white overflow-x-hidden selection:bg-[#ff2a85] selection:text-white">
      {/* 1. Cinematic Intro Sequence */}
      <CinematicIntro onComplete={() => {}} />

      {/* 2. Top Heads-Up Display (HUD) */}
      <HUD
        executiveMode={executiveMode}
        onToggleExecutiveMode={() => setExecutiveMode(!executiveMode)}
        onOpenArcade={() => jumpToSection("arcade")}
        onToggleRadio={handleToggleRadio}
        isRadioOpen={isRadioOpen}
        onLogoClick={handleLogoClick}
      />

      {executiveMode ? (
        <RecruiterExecutiveView />
      ) : (
        <div className="relative">
          {/* 3. Three.js 3D WebGL Background Scene */}
          <ThreeCanvas activeTab={activeTab} />

          {/* 4. CRT Scanlines Ambient Filter */}
          <div className="fixed inset-0 scanlines pointer-events-none z-10 opacity-25" />

          {/* 5. Multi-Layer Open-Domain Parallax Hero */}
          <ParallaxHero
            onOpenTerminal={() => setIsTerminalOpen(true)}
            onJumpToSection={jumpToSection}
            onOpenHireModal={() => setIsHireModalOpen(true)}
          />

          {/* 6. Sticky Glassmorphic Mission Dock */}
          <div className="sticky top-[62px] z-40 max-w-7xl mx-auto px-4 mb-10">
            <nav className="glass-vice border border-[#ff2a85]/40 rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.65)]">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {NAV_SECTIONS.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => jumpToSection(item.id)}
                      className={`py-2.5 px-3 rounded-xl font-mono text-xs font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 select-none ${
                        isActive
                          ? `bg-gradient-to-r ${item.accent} text-white shadow-[0_0_20px_rgba(255,42,133,0.45)] scale-[1.02]`
                          : "bg-black/50 border border-white/10 text-gray-300 hover:text-white hover:border-[#00f0ff]/50 hover:bg-white/5"
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* 7. Scrollable Lazy-Loaded Sections with Parallax Dividers */}
          <main className="relative z-20 max-w-7xl mx-auto px-4 pb-28 space-y-20">
            {/* Sector 1: Dossier */}
            <section id="section-dossier" className="scroll-mt-36">
              <DossierTab onOpenHireModal={() => setIsHireModalOpen(true)} />
            </section>

            {/* Sector 2: Weapon Wheel (Lazy Mounted) */}
            <section id="section-weapons" className="scroll-mt-36">
              <LazyReveal lazyMount skeletonHeightClass="min-h-[420px]">
                <WeaponWheelTab />
              </LazyReveal>
            </section>

            {/* Parallax Open-Domain Interlude Banner */}
            <ParallaxSection className="rounded-3xl border border-[#ff2a85]/40 h-52 sm:h-64 flex items-center justify-center shadow-[0_0_40px_rgba(255,42,133,0.2)]">
              <ParallaxLayer speed={0.22} className="absolute inset-0 -top-12 -bottom-12">
                <LazyImage
                  src={OPEN_DOMAIN_IMAGES.neonCarNight}
                  alt="Vice City Night Drive"
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover opacity-50"
                  overlayClassName="bg-gradient-to-r from-[#0c0119] via-transparent to-[#0c0119]"
                />
              </ParallaxLayer>
              <ParallaxLayer speed={-0.06} className="relative z-20 text-center px-4">
                <p className="text-[10px] font-mono tracking-[0.35em] text-[#00f0ff] uppercase font-bold">
                  STATE OF LEONIDA // PRODUCTION CHRONICLES
                </p>
                <h3 className="gta-title text-3xl sm:text-5xl mt-1">
                  SHIPPED UNDER PRESSURE
                </h3>
              </ParallaxLayer>
            </ParallaxSection>

            {/* Sector 3: Heist Campaign (Lazy Mounted) */}
            <section id="section-campaign" className="scroll-mt-36">
              <LazyReveal lazyMount skeletonHeightClass="min-h-[460px]">
                <HeistCampaignTab />
              </LazyReveal>
            </section>

            {/* Sector 4: Bounty Contracts (Lazy Mounted) */}
            <section id="section-contracts" className="scroll-mt-36">
              <LazyReveal lazyMount skeletonHeightClass="min-h-[460px]">
                <ContractsTab onInspectProject={(p) => setSelectedProject(p)} />
              </LazyReveal>
            </section>

            {/* Sector 5: Photoholic Pinterest Board (Lazy Mounted) */}
            <section id="section-photos" className="scroll-mt-36">
              <LazyReveal lazyMount skeletonHeightClass="min-h-[460px]">
                <PhotoholicGallery />
              </LazyReveal>
            </section>

            {/* Sector 6: Street Cred & Trophies (Lazy Mounted) */}
            <section id="section-trophies" className="scroll-mt-36">
              <LazyReveal lazyMount skeletonHeightClass="min-h-[340px]">
                <StreetCredTab />
              </LazyReveal>
            </section>

            {/* Sector 6.5: Live GitHub Telemetry & Leonida Career Radar Map */}
            <section id="section-radar" className="scroll-mt-36">
              <LazyReveal lazyMount skeletonHeightClass="min-h-[380px]">
                <GitHubAndMapSection />
              </LazyReveal>
            </section>

            {/* Sector 6: Vice Arcade (Dynamically Code-Split + Lazy Mounted) */}
            <section id="section-arcade" className="scroll-mt-36">
              <LazyReveal lazyMount skeletonHeightClass="min-h-[380px]">
                <div className="relative rounded-3xl overflow-hidden border border-[#ff2a85]/40 p-1 bg-gradient-to-br from-[#ff2a85]/20 via-transparent to-[#00f0ff]/20">
                  <div className="relative h-28 rounded-t-2xl overflow-hidden mb-4">
                    <LazyImage
                      src={OPEN_DOMAIN_IMAGES.arcadeNeon}
                      alt="Vice City Neon Arcade"
                      parallax
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover opacity-55"
                      overlayClassName="bg-gradient-to-t from-[#0c0119] via-[#0c0119]/40 to-transparent"
                    />
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                      <span className="font-mono text-xs sm:text-sm font-black tracking-[0.25em] text-[#00f0ff] uppercase drop-shadow-[0_0_10px_#00f0ff]">
                        🕹️ VICE ARCADE // INTERACTIVE MINI-GAME
                      </span>
                    </div>
                  </div>
                  <div className="px-2 pb-4">
                    <ArcadeTab />
                  </div>
                </div>
              </LazyReveal>
            </section>
          </main>

          {/* 8. Interactive iFruit 16 Smartphone */}
          <IFruitPhone
            isOpen={isPhoneOpen}
            onToggle={() => setIsPhoneOpen(!isPhoneOpen)}
            onOpenArcade={() => jumpToSection("arcade")}
            onToggleRadio={handleToggleRadio}
            isRadioOpen={isRadioOpen}
          />

          {/* 9. Mission Passed Modal with Confetti & Synth Flourish */}
          <MissionPassedModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />

          {/* 10. In-Game Cheat Code Terminal */}
          <CheatCodeTerminal
            isOpen={isTerminalOpen}
            onClose={() => setIsTerminalOpen(false)}
            onOpenArcade={() => jumpToSection("arcade")}
            onToggleRadio={handleToggleRadio}
          />

          {/* 11. Vice City Radio & Spotify Player */}
          <GTARadioPlayer
            isOpen={isRadioOpen}
            onClose={() => setIsRadioOpen(false)}
            isMinimized={isRadioMinimized}
            onToggleMinimize={() => setIsRadioMinimized(!isRadioMinimized)}
          />

          {/* 12. Hire Me / Mission Contract Modal */}
          <HireMeModal
            isOpen={isHireModalOpen}
            onClose={() => setIsHireModalOpen(false)}
          />

          {/* 13. Lester AI Operative Recruiter Assistant */}
          <LesterAssistant />
        </div>
      )}

      {/* Footer Branding */}
      <footer className="relative z-20 border-t border-white/10 bg-black/85 py-5 px-4 text-center font-mono text-xs text-gray-500">
        <p>
          GTA-VI THEMED DEVELOPER PORTFOLIO // DEVESH SHARMA © 2026 • BUILT WITH NEXT.JS 14, THREE.JS, PARALLAX ENGINE &amp; LAZY LOADING
        </p>
      </footer>
    </div>
  );
}
