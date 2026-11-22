"use client";

import React, { useState, useEffect } from "react";
import { sfx } from "../lib/soundFx";
import { Terminal, X, CornerDownLeft } from "lucide-react";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

interface CheatCodeTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheatCodeTerminal: React.FC<CheatCodeTerminalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "LEONIDA KERNEL v6.0.21 [SECURE PROMPT READY]",
    "TYPE 'HELP' TO LIST AVAILABLE CHEAT CODES.",
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toUpperCase();
    if (!cmd) return;

    sfx.playClick();
    const newLogs = [...history, `> ${cmd}`];

    switch (cmd) {
      case "HELP":
        newLogs.push("AVAILABLE CHEAT CODES:");
        newLogs.push("  ADMIN     - Hack security protocol & enter Admin Panel");
        newLogs.push("  LEETCODE  - Unlock 150+ DSA algorithmic firestorm");
        newLogs.push("  SPEED     - Activate 40-60% API latency boost");
        newLogs.push("  GODMODE   - Max out Operative Health & Armor (100%)");
        newLogs.push("  BOUNTY    - Grant $5,000,000 computational value");
        newLogs.push("  CLEAR     - Wipe terminal history");
        break;

      case "ADMIN":
        newLogs.push(">>> OVERRIDE ACCEPTED: ACCESSING SECURE ADMIN TERMINAL...");
        sfx.playWeapon();
        setTimeout(() => {
          onClose();
          router.push("/admin");
        }, 600);
        break;

      case "LEETCODE":
        newLogs.push(">>> CHEAT ACTIVATED: 100+ DAY DSA STREAK UNLEASHED!");
        sfx.playMissionPassed();
        try {
          confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });
        } catch {}
        break;

      case "SPEED":
        newLogs.push(">>> CHEAT ACTIVATED: 40-60% API ACCELERATION ONLINE!");
        sfx.playWeapon();
        break;

      case "GODMODE":
        newLogs.push(">>> CHEAT ACTIVATED: OPERATIVE VITALS OVERCLOCKED TO 100%!");
        sfx.playBleep();
        break;

      case "BOUNTY":
        newLogs.push(">>> CHEAT ACTIVATED: $5,000,000 CREDITED TO SYNDICATE LEDGER!");
        sfx.playMissionPassed();
        break;

      case "CLEAR":
        setHistory(["LEONIDA KERNEL v6.0.21 [CONSOLE CLEARED]"]);
        setInput("");
        return;

      default:
        newLogs.push(`UNKNOWN CHEAT CODE: '${cmd}'. TYPE 'HELP' FOR MANUAL.`);
        sfx.playBleep();
    }

    setHistory(newLogs);
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0e0018] border-2 border-[#00f0ff] max-w-xl w-full rounded-2xl p-5 shadow-[0_0_40px_rgba(0,240,255,0.4)] font-mono text-xs flex flex-col h-[380px]">
        <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
          <div className="flex items-center gap-2 text-[#00f0ff] font-bold">
            <Terminal className="w-4 h-4" />
            <span>VICE CITY CHEAT CONSOLE [HOTKEY: ~]</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 text-gray-300 pr-2">
          {history.map((line, idx) => (
            <div
              key={idx}
              className={
                line.startsWith(">")
                  ? "text-[#ff2a85] font-bold"
                  : line.startsWith(">>>")
                  ? "text-emerald-400 font-bold"
                  : ""
              }
            >
              {line}
            </div>
          ))}
        </div>

        <form onSubmit={handleCommand} className="mt-3 pt-2 border-t border-gray-800 flex items-center gap-2">
          <span className="text-[#00f0ff] font-bold">{">"}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type cheat code (e.g. ADMIN, HELP, LEETCODE, SPEED)..."
            className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-600 font-mono"
            autoFocus
          />
          <button
            type="submit"
            className="p-1.5 bg-[#00f0ff] hover:bg-cyan-300 text-black rounded font-bold"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
