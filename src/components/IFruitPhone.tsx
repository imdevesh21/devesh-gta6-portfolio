"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePortfolio } from "@/context/PortfolioContext";
import { sfx } from "../lib/soundFx";
import { Phone, Mail, Radio, MessageSquare, ChevronDown, Gamepad2, Newspaper } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

interface IFruitPhoneProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenArcade?: () => void;
  onToggleRadio?: () => void;
  isRadioOpen?: boolean;
}

export const IFruitPhone: React.FC<IFruitPhoneProps> = ({ 
  isOpen, 
  onToggle, 
  onOpenArcade,
  onToggleRadio,
  isRadioOpen
}) => {
  const { data } = usePortfolio();
  const profile = data.profile;

  const [time, setTime] = useState("20:25");
  const [isRadioOn, setIsRadioOn] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleRadio = () => {
    if (onToggleRadio) {
      sfx.playClick();
      onToggleRadio();
    } else {
      const active = sfx.toggleRadio();
      setIsRadioOn(active);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => {
          sfx.playPhone();
          onToggle();
        }}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#ff2a85] to-[#7b00ff] text-white p-4 rounded-full shadow-[0_0_25px_#ff2a85] hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
        title="Open iFruit 16 Smartphone"
      >
        <span className="text-xl group-hover:rotate-12 transition-transform">📱</span>
        <span className="sr-only">Toggle Smartphone</span>
      </button>

      {/* Slide-out Smartphone Container */}
      <div
        className={`fixed bottom-4 right-4 w-80 bg-[#160026] border-2 border-[#ff2a85] rounded-[32px] shadow-[0_0_40px_rgba(255,42,133,0.7)] z-50 transform transition-all duration-300 ease-out flex flex-col overflow-hidden ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-[120%] opacity-0 pointer-events-none"
        }`}
      >
        {/* Top Speaker & Notch */}
        <div className="bg-black py-2 px-5 flex items-center justify-between text-[11px] font-mono text-gray-400 border-b border-gray-800">
          <span>{time}</span>
          <div className="w-16 h-3 bg-gray-900 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-900" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <span className="text-emerald-400 font-bold">100%</span>
          </div>
        </div>

        {/* Phone Screen Inner */}
        <div className="p-4 space-y-4 max-h-[480px] overflow-y-auto">
          {/* OS Header */}
          <div className="flex items-center justify-between border-b border-pink-500/30 pb-2">
            <div>
              <h4 className="text-xs font-mono font-bold text-[#ff2a85] tracking-widest">
                iFRUIT 16 // VICE OS
              </h4>
              <p className="text-[10px] text-gray-400">OPERATIVE COMM FREQUENCY</p>
            </div>
            <button
              onClick={() => {
                sfx.playClick();
                onToggle();
              }}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Apps Grid */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
            {/* Phone Call */}
            <a
              href={`tel:${profile.contact.phone}`}
              onClick={() => sfx.playPhone()}
              className="p-2.5 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl hover:bg-emerald-900/60 transition-all flex flex-col items-center justify-center gap-1 group"
            >
              <Phone className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-emerald-300 font-bold">Call</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${profile.contact.email}`}
              onClick={() => sfx.playClick()}
              className="p-2.5 bg-pink-950/60 border border-pink-500/50 rounded-2xl hover:bg-pink-900/60 transition-all flex flex-col items-center justify-center gap-1 group"
            >
              <Mail className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
              <span className="text-pink-300 font-bold">Email</span>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${profile.contact.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sfx.playClick()}
              className="p-2.5 bg-green-950/60 border border-green-500/50 rounded-2xl hover:bg-green-900/60 transition-all flex flex-col items-center justify-center gap-1 group"
            >
              <MessageSquare className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
              <span className="text-green-300 font-bold">Chat</span>
            </a>

            {/* LinkedIn */}
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sfx.playClick()}
              className="p-2.5 bg-cyan-950/60 border border-cyan-500/50 rounded-2xl hover:bg-cyan-900/60 transition-all flex flex-col items-center justify-center gap-1 group"
            >
              <LinkedinIcon className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-cyan-300 font-bold">LinkedIn</span>
            </a>

            {/* GitHub */}
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sfx.playClick()}
              className="p-2.5 bg-purple-950/60 border border-purple-500/50 rounded-2xl hover:bg-purple-900/60 transition-all flex flex-col items-center justify-center gap-1 group"
            >
              <GithubIcon className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-purple-300 font-bold">GitHub</span>
            </a>

            {/* Radio Los Santos / Flash FM */}
            <button
              onClick={handleToggleRadio}
              className={`p-2.5 rounded-2xl transition-all flex flex-col items-center justify-center gap-1 group border ${
                (isRadioOpen ?? isRadioOn)
                  ? "bg-amber-950/80 border-amber-400 shadow-[0_0_12px_#f59e0b]"
                  : "bg-rose-950/60 border-rose-500/50 hover:bg-rose-900/60"
              }`}
            >
              <Radio
                className={`w-5 h-5 ${
                  (isRadioOpen ?? isRadioOn) ? "text-amber-300 animate-pulse" : "text-rose-400 group-hover:scale-110"
                }`}
              />
              <span className="text-rose-300 font-bold">
                {(isRadioOpen ?? isRadioOn) ? "Playing" : "Radio"}
              </span>
            </button>

            {/* Arcade Game App */}
            <button
              onClick={() => {
                sfx.playArcadeBoost();
                if (onOpenArcade) onOpenArcade();
                onToggle();
              }}
              className="p-2.5 bg-gradient-to-tr from-[#ff2a85]/40 to-[#00f0ff]/40 border border-[#00f0ff]/60 rounded-2xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 group shadow-[0_0_12px_rgba(0,240,255,0.25)]"
            >
              <Gamepad2 className="w-5 h-5 text-cyan-300 group-hover:rotate-12 transition-transform" />
              <span className="text-cyan-200 font-bold">Arcade</span>
            </button>

            {/* Weazel News Blog App */}
            <Link
              href="/blog"
              onClick={() => {
                sfx.playClick();
                onToggle();
              }}
              className="p-2.5 bg-gradient-to-tr from-purple-950/70 to-pink-950/70 border border-[#ff2a85]/60 rounded-2xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 group shadow-[0_0_12px_rgba(255,42,133,0.25)] col-span-2 sm:col-span-1"
            >
              <Newspaper className="w-5 h-5 text-pink-300 group-hover:rotate-6 transition-transform" />
              <span className="text-pink-200 font-bold">Weazel News</span>
            </Link>
          </div>

          {/* Quick Contact Card Readout */}
          <div className="bg-black/80 p-3.5 rounded-xl border border-gray-800 space-y-2 font-mono text-xs">
            <div className="flex items-center gap-3">
              {profile.avatarUrl ? (
                <div className="w-10 h-10 rounded-full border border-[#00f0ff] p-0.5 shadow-[0_0_10px_#00f0ff] shrink-0 overflow-hidden">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              ) : null}
              <div className="flex-1">
                <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                  OPERATIVE PROFILE CARD
                </div>
                <div className="text-white font-black text-sm">
                  {profile.name}
                </div>
              </div>
            </div>
            <div className="text-[#00f0ff] font-bold">
              {profile.contact.phone}
            </div>
            <div className="text-[#ff2a85] break-all font-bold">
              {profile.contact.email}
            </div>
            <div className="text-gray-400 text-[11px]">
              {profile.location}
            </div>
            <div className="text-emerald-400 text-[11px] pt-1 border-t border-gray-800">
              ⚡ Open to Full-Stack, Frontend & SDE Roles
            </div>
          </div>

          {/* Close Phone Bar */}
          <button
            onClick={() => {
              sfx.playClick();
              onToggle();
            }}
            className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white font-mono text-xs rounded-xl border border-gray-700 transition-colors"
          >
            DISMISS COMM LINK ▼
          </button>
        </div>
      </div>
    </>
  );
};
