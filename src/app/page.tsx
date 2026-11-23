"use client";

import React, { useState } from "react";
import { HUD } from "../components/HUD";
import { ThreeCanvas } from "../components/ThreeCanvas";
import { DossierTab } from "../components/DossierTab";
import { WeaponWheelTab } from "../components/WeaponWheelTab";
import { HeistCampaignTab } from "../components/HeistCampaignTab";
import { ContractsTab } from "../components/ContractsTab";
import { StreetCredTab } from "../components/StreetCredTab";
import { ArcadeTab } from "../components/ArcadeTab";
import { IFruitPhone } from "../components/IFruitPhone";
import { MissionPassedModal } from "../components/MissionPassedModal";
import { CheatCodeTerminal } from "../components/CheatCodeTerminal";
import { CinematicIntro } from "../components/CinematicIntro";
import { RecruiterExecutiveView } from "../components/RecruiterExecutiveView";
import { GTARadioPlayer } from "../components/GTARadioPlayer";
import { ProjectItem } from "../types/portfolio";
import { sfx } from "../lib/soundFx";
import { Terminal } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("dossier");
  const [executiveMode, setExecutiveMode] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isPhoneOpen, setIsPhoneOpen] = useState<boolean>(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isRadioOpen, setIsRadioOpen] = useState<boolean>(false);
  const [isRadioMinimized, setIsRadioMinimized] = useState<boolean>(false);

  const handleTabChange = (tabId: string) => {
    sfx.playClick();
    setActiveTab(tabId);
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

  return (
    <div className="relative min-h-screen bg-[#0c0119] text-white overflow-x-hidden selection:bg-[#ff2a85] selection:text-white">

      {/* 1. Cinematic Intro Sequence */}
      <CinematicIntro onComplete={() => { }} />

      {/* 2. Top Heads-Up Display (HUD) */}
      <HUD
        executiveMode={executiveMode}
        onToggleExecutiveMode={() => setExecutiveMode(!executiveMode)}
        onOpenArcade={() => handleTabChange("arcade")}
        onToggleRadio={handleToggleRadio}
        isRadioOpen={isRadioOpen}
      />

      {executiveMode ? (
        /* Executive Recruiter Mode View */
        <RecruiterExecutiveView />
      ) : (
        /* Full 3D AAA Vice City Experience */
        <div className="relative min-h-[calc(100vh-65px)]">

          {/* 3. Three.js 3D WebGL Background Scene */}
          <ThreeCanvas activeTab={activeTab} />

          {/* 4. CRT Scanlines Ambient Filter */}
          <div className="fixed inset-0 scanlines pointer-events-none z-10 opacity-30" />

          {/* 5. Main Hero Callout & Interactive Navigation Bar */}
          <div className="relative z-20 max-w-6xl mx-auto px-4 pt-6 pb-2">

            {/* Quick Tactical Location Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono mb-4 bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-gray-800">
              <div className="flex items-center gap-2 text-[#00f0ff]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>COORDINATES: 26.9124° N, 75.7873° E // JAIPUR - LEONIDA GRID</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="hidden sm:inline">PBR SHADER: ACTIVE</span>
                <button
                  onClick={() => {
                    sfx.playClick();
                    setIsTerminalOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-amber-400 hover:text-white px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/40"
                  title="Press ` or ~ to toggle cheat terminal"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>CHEAT CONSOLE [~]</span>
                </button>
              </div>
            </div>

            {/* Mission Deck Tab Bar */}
            <nav className="bg-[#140124]/90 backdrop-blur-xl border border-[#ff2a85]/40 rounded-2xl p-1.5 shadow-[0_0_25px_rgba(255,42,133,0.3)] mb-6">
              <div className="flex items-center justify-between overflow-x-auto gap-1.5 no-scrollbar">
                <button
                  onClick={() => handleTabChange("dossier")}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "dossier"
                      ? "bg-[#ff2a85] text-white shadow-[0_0_15px_#ff2a85] scale-102"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <span>👤</span>
                  <span>Operative Dossier</span>
                </button>

                <button
                  onClick={() => handleTabChange("weapons")}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "weapons"
                      ? "bg-[#00f0ff] text-black shadow-[0_0_15px_#00f0ff] scale-102"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <span>🔫</span>
                  <span>Weapon Wheel (Skills)</span>
                </button>

                <button
                  onClick={() => handleTabChange("campaign")}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "campaign"
                      ? "bg-[#ff2a85] text-white shadow-[0_0_15px_#ff2a85] scale-102"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <span>🚁</span>
                  <span>Campaign Heists (Exp)</span>
                </button>

                <button
                  onClick={() => handleTabChange("contracts")}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "contracts"
                      ? "bg-[#00f0ff] text-black shadow-[0_0_15px_#00f0ff] scale-102"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <span>💎</span>
                  <span>Bounty Contracts (Projects)</span>
                </button>

                <button
                  onClick={() => handleTabChange("trophies")}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "trophies"
                      ? "bg-[#ffb700] text-black shadow-[0_0_15px_#ffb700] scale-102"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <span>🏆</span>
                  <span>Street Cred (Certs)</span>
                </button>

                <button
                  onClick={() => handleTabChange("arcade")}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === "arcade"
                      ? "bg-gradient-to-r from-[#ff2a85] to-[#00f0ff] text-white shadow-[0_0_20px_#ff2a85] scale-102"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <span className="animate-pulse">🕹️</span>
                  <span>Vice Arcade</span>
                </button>
              </div>
            </nav>

            {/* 6. Active Tab Content Pane */}
            <main className="pb-24">
              {activeTab === "dossier" && <DossierTab />}
              {activeTab === "weapons" && <WeaponWheelTab />}
              {activeTab === "campaign" && <HeistCampaignTab />}
              {activeTab === "contracts" && (
                <ContractsTab onInspectProject={(p) => setSelectedProject(p)} />
              )}
              {activeTab === "trophies" && <StreetCredTab />}
              {activeTab === "arcade" && <ArcadeTab />}
            </main>

          </div>

          {/* 7. Interactive iFruit 16 Smartphone */}
          <IFruitPhone
            isOpen={isPhoneOpen}
            onToggle={() => setIsPhoneOpen(!isPhoneOpen)}
            onOpenArcade={() => handleTabChange("arcade")}
            onToggleRadio={handleToggleRadio}
            isRadioOpen={isRadioOpen}
          />

          {/* 8. Mission Passed Modal with Confetti & Synth Flourish */}
          <MissionPassedModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />

          {/* 9. In-Game Cheat Code Terminal */}
          <CheatCodeTerminal
            isOpen={isTerminalOpen}
            onClose={() => setIsTerminalOpen(false)}
            onOpenArcade={() => handleTabChange("arcade")}
            onToggleRadio={handleToggleRadio}
          />

          {/* 10. Vice City Radio & Spotify Player (Option 1 + Option 3) */}
          <GTARadioPlayer
            isOpen={isRadioOpen}
            onClose={() => setIsRadioOpen(false)}
            isMinimized={isRadioMinimized}
            onToggleMinimize={() => setIsRadioMinimized(!isRadioMinimized)}
          />

        </div>
      )}

      {/* Footer Branding */}
      <footer className="relative z-20 border-t border-gray-900 bg-black/80 py-4 px-4 text-center font-mono text-xs text-gray-500">
        <p>
          GTA-VI THEMED DEVELOPER PORTFOLIO // DEVESH SHARMA © 2026 • BUILT WITH NEXT.JS 14, THREE.JS, GSAP & TAILWIND CSS
        </p>
      </footer>

    </div>
  );
}
