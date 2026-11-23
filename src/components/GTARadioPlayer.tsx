"use client";

import React, { useState, useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { sfx } from "@/lib/soundFx";
import { RadioStation } from "@/types/portfolio";
import { 
  Radio, 
  X, 
  Minimize2, 
  Maximize2, 
  ExternalLink, 
  Disc3,
  Music,
  Check
} from "lucide-react";

interface GTARadioPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export const DEFAULT_STATIONS: RadioStation[] = [
  {
    id: "vice-city-fm",
    name: "Vice City FM",
    frequency: "98.3 FM",
    tagline: "The Official Sounds of Leonida & 80s Retrowave",
    genre: "Synthwave / Outrun / GTA-6 Anthem",
    spotifyUri: "track/3k75B7C4Ra0n65i257s2Z0", // Tom Petty - Love Is A Long Road (GTA 6 Trailer)
    accentColor: "#ff2a85",
    icon: "🌴",
    description: "Featuring Tom Petty's 'Love Is A Long Road' (GTA VI Official Trailer Anthem), Kavinsky, and Miami sunset synthpop.",
  },
  {
    id: "radio-los-santos",
    name: "Radio Los Santos",
    frequency: "102.7 FM",
    tagline: "West Coast Heat & Heavy Drill Bass",
    genre: "Hip-Hop / Heavy Trap / Drill",
    spotifyUri: "playlist/37i9dQZF1DX0XUsuxWHRQd", // Rap UK / West Coast
    accentColor: "#ffb700",
    icon: "🔫",
    description: "High-octane rap and West Coast hip-hop curated for high-velocity coding and street missions.",
  },
  {
    id: "leonida-lofi",
    name: "Leonida Lo-Fi Lounge",
    frequency: "94.1 FM",
    tagline: "Late Night Chillhop for Deep Work",
    genre: "Lo-Fi / Ambient / Deep Focus",
    spotifyUri: "playlist/37i9dQZF1DXdLEN7aqioXM", // Retro Chill / Lo-Fi
    accentColor: "#00f0ff",
    icon: "☕",
    description: "Atmospheric chill beats and smooth keys designed for zero-distraction engineering sessions.",
  },
  {
    id: "cyberpunk-underground",
    name: "Cyberpunk 2077 // Underground",
    frequency: "107.5 FM",
    tagline: "Industrial Darkwave & High-Voltage Electro",
    genre: "Industrial / Darkwave / Cyberpunk",
    spotifyUri: "playlist/37i9dQZF1EIeZt7g2t29aW", // Synthwave / Dark Electro
    accentColor: "#a855f7",
    icon: "⚡",
    description: "Relentless electronic pulses, distorted basslines, and dystopian cybernetic anthems.",
  },
];

export function getSpotifyEmbedUrl(input: string): string {
  if (!input) return "https://open.spotify.com/embed/track/3k75B7C4Ra0n65i257s2Z0?utm_source=generator&theme=0";
  
  if (input.includes("/embed/")) {
    return input.includes("theme=0") ? input : `${input}${input.includes("?") ? "&" : "?"}theme=0`;
  }
  
  // Clean URL or URI
  const clean = input.trim().replace(/^spotify:/, "").replace("https://open.spotify.com/", "");
  const parts = clean.split(/[?#]/)[0].split("/");
  
  let type = "track";
  let id = "";
  
  if (parts.length >= 2) {
    type = parts[0];
    id = parts[1];
  } else if (parts.length === 1 && parts[0]) {
    id = parts[0];
  }
  
  return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
}

export const GTARadioPlayer: React.FC<GTARadioPlayerProps> = ({
  isOpen,
  onClose,
  isMinimized,
  onToggleMinimize,
}) => {
  const { data } = usePortfolio();
  const stations = data.radioStations && data.radioStations.length > 0 ? data.radioStations : DEFAULT_STATIONS;

  const [activeStationId, setActiveStationId] = useState<string>("vice-city-fm");
  const [customInputUrl, setCustomInputUrl] = useState<string>(data.customSpotifyUrl || "");
  const [activeEmbedUrl, setActiveEmbedUrl] = useState<string>("");
  const [isTuning, setIsTuning] = useState<boolean>(false);
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const activeStation = stations.find((s) => s.id === activeStationId) || stations[0];

  // Set initial embed URL based on active station
  useEffect(() => {
    if (activeStation) {
      setActiveEmbedUrl(getSpotifyEmbedUrl(activeStation.spotifyUri));
    }
  }, [activeStationId, activeStation]);

  if (!isOpen) return null;

  const handleStationChange = (station: RadioStation) => {
    sfx.playRadioTuning();
    setIsTuning(true);
    setActiveStationId(station.id);
    setActiveEmbedUrl(getSpotifyEmbedUrl(station.spotifyUri));
    setShowCustomInput(false);

    setTimeout(() => {
      setIsTuning(false);
    }, 400);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputUrl.trim()) return;
    sfx.playRadioTuning();
    setIsTuning(true);
    setActiveStationId("custom");
    setActiveEmbedUrl(getSpotifyEmbedUrl(customInputUrl));
    setTimeout(() => setIsTuning(false), 400);
  };

  const handleCopySpotifyLink = () => {
    sfx.playClick();
    const currentUrl = activeStationId === "custom" 
      ? customInputUrl 
      : `https://open.spotify.com/${activeStation.spotifyUri}`;
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      {/* 1. MINIMIZED FLOATING DOCK (Bottom-Right Cassette Pill) */}
      {isMinimized ? (
        <div className="fixed bottom-5 right-5 z-50 animate-slideUp">
          <div className="bg-[#140124]/95 backdrop-blur-xl border border-[#ff2a85]/60 rounded-2xl p-2.5 shadow-[0_0_25px_rgba(255,42,133,0.35)] flex items-center gap-3 font-mono text-xs text-white">
            
            {/* Spinning Vinyl / Cassette Badge */}
            <div 
              onClick={onToggleMinimize}
              className="w-8 h-8 rounded-full border border-[#00f0ff] p-1 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform bg-black shadow-[0_0_12px_#00f0ff]"
              title="Expand Radio Station"
            >
              <Disc3 className="w-4 h-4 text-[#00f0ff] animate-spin" style={{ animationDuration: "4s" }} />
            </div>

            {/* Station Status Readout */}
            <div 
              onClick={onToggleMinimize}
              className="cursor-pointer space-y-0.5 select-none pr-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-950/80 border border-pink-500 text-[#ff2a85] font-black">
                  {activeStation.frequency}
                </span>
                <span className="font-bold text-white tracking-wide">
                  {activeStation.name.toUpperCase()}
                </span>
              </div>
              <div className="text-[10px] text-gray-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ON AIR // SPOTIFY BROADCAST</span>
              </div>
            </div>

            {/* Quick Equalizer animation */}
            <div className="hidden sm:flex items-center gap-0.5 h-4 px-1">
              {[40, 80, 60, 100, 70, 90, 50].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-gradient-to-t from-[#ff2a85] to-[#00f0ff] rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDuration: `${0.4 + i * 0.15}s`,
                  }}
                />
              ))}
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1 border-l border-gray-800 pl-2">
              <button
                onClick={onToggleMinimize}
                className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white"
                title="Expand Radio Console"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#00f0ff]" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white"
                title="Turn Radio Off"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      ) : (
        /* 2. EXPANDED GTA RADIO CONSOLE (Floating Neon Dashboard) */
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[460px] max-w-[460px] animate-fadeIn">
          <div className="bg-[#120021]/95 backdrop-blur-2xl border-2 border-[#ff2a85]/70 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(255,42,133,0.35)] flex flex-col font-sans">
            
            {/* Top Chrome Header */}
            <div className="bg-black/90 px-4 py-3 border-b border-gray-800 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[#00f0ff] font-black tracking-wider">
                  LEONIDA RADIO NETWORK // FM 2026
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={onToggleMinimize}
                  className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                  title="Minimize to Compact Bar"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-white transition-colors"
                  title="Close Radio"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Station Broadcast Banner */}
            <div 
              className="p-4 relative overflow-hidden transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${activeStation.accentColor}25, rgba(18,0,33,0.95))`
              }}
            >
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{activeStation.icon}</span>
                    <div>
                      <h3 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
                        <span>{activeStation.name}</span>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full font-mono font-bold"
                          style={{ 
                            backgroundColor: `${activeStation.accentColor}30`, 
                            color: activeStation.accentColor,
                            border: `1px solid ${activeStation.accentColor}60`
                          }}
                        >
                          {activeStation.frequency}
                        </span>
                      </h3>
                      <p className="text-xs font-mono text-gray-300">{activeStation.genre}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 font-sans pt-1 leading-relaxed">
                    {activeStation.description}
                  </p>
                </div>

                {/* Animated Frequency Equalizer */}
                <div className="flex items-end gap-1 h-9 p-1 bg-black/60 rounded-xl border border-gray-800 shrink-0">
                  {[35, 75, 50, 95, 60, 85, 45, 90].map((h, i) => (
                    <span
                      key={i}
                      className="w-1.5 rounded-full transition-all"
                      style={{
                        height: isTuning ? "20%" : `${h}%`,
                        backgroundColor: activeStation.accentColor,
                        boxShadow: `0 0 8px ${activeStation.accentColor}`,
                        animation: `pulse ${0.3 + (i % 4) * 0.15}s infinite alternate`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Tuning static flash banner */}
              {isTuning && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center font-mono text-xs text-[#00f0ff] tracking-widest uppercase z-20 animate-pulse">
                  ⚡ TUNING FREQUENCY // {activeStation.frequency} ...
                </div>
              )}
            </div>

            {/* GTA Radio Wheel Station Selector Buttons (Option 3) */}
            <div className="p-3 bg-black/70 border-y border-gray-800 font-mono text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-[#ff2a85]" />
                  SELECT STATION PRESET:
                </span>
                <button
                  type="button"
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="text-[10px] text-[#00f0ff] hover:underline flex items-center gap-1"
                >
                  <Music className="w-3 h-3" />
                  <span>{showCustomInput ? "Show Stations" : "+ Custom Link"}</span>
                </button>
              </div>

              {/* Station Preset Pills */}
              <div className="grid grid-cols-2 gap-2">
                {stations.map((st) => {
                  const isCurrent = activeStationId === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => handleStationChange(st)}
                      className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 ${
                        isCurrent
                          ? "bg-white/10 text-white shadow-lg"
                          : "bg-black/50 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
                      }`}
                      style={{
                        borderColor: isCurrent ? st.accentColor : undefined,
                        boxShadow: isCurrent ? `0 0 15px ${st.accentColor}40` : undefined,
                      }}
                    >
                      <span className="text-base">{st.icon}</span>
                      <div className="truncate">
                        <div className="font-bold text-[11px] truncate">{st.name}</div>
                        <div className="text-[9px] text-gray-400 font-mono">{st.frequency}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Spotify URL Input Drawer */}
              {showCustomInput && (
                <form onSubmit={handleApplyCustomUrl} className="mt-3 p-3 bg-black/90 rounded-xl border border-cyan-500/40 space-y-2">
                  <div className="text-[10px] text-[#00f0ff] font-bold">
                    PASTE ANY SPOTIFY TRACK OR PLAYLIST URL:
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="https://open.spotify.com/playlist/... or track/..."
                      value={customInputUrl}
                      onChange={(e) => setCustomInputUrl(e.target.value)}
                      className="flex-1 bg-black border border-gray-700 rounded-lg px-2.5 py-1.5 text-[11px] text-white outline-none focus:border-[#00f0ff]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-black font-bold text-[11px] rounded-lg shrink-0"
                    >
                      TUNE IN
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Embedded Spotify Player Iframe (Option 1) */}
            <div className="p-3 bg-black/90 flex flex-col items-center">
              <div className="w-full rounded-2xl overflow-hidden border border-gray-800 shadow-inner bg-black">
                <iframe
                  key={activeEmbedUrl}
                  src={activeEmbedUrl}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="GTA Vice City Spotify Radio"
                  className="rounded-2xl"
                />
              </div>

              {/* Bottom Player Utilities */}
              <div className="w-full flex items-center justify-between pt-2.5 px-1 font-mono text-[11px] text-gray-400">
                <button
                  onClick={handleCopySpotifyLink}
                  className="hover:text-white transition-colors flex items-center gap-1"
                  title="Copy Spotify track URL"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <ExternalLink className="w-3 h-3 text-[#1DB954]" />}
                  <span className={copiedLink ? "text-emerald-400 font-bold" : ""}>
                    {copiedLink ? "LINK COPIED" : "SHARE TRACK"}
                  </span>
                </button>

                <a
                  href={activeStationId === "custom" ? customInputUrl : `https://open.spotify.com/${activeStation.spotifyUri}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-gray-300 hover:text-white hover:underline transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-[#1DB954] shadow-[0_0_8px_#1DB954]" />
                  <span>OPEN IN SPOTIFY</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
