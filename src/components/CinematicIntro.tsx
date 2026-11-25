"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { sfx } from "../lib/soundFx";

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [hidden, setHidden] = useState(false);

  const dismissIntro = () => {
    setHidden(true);
    onCompleteRef.current();
  };

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setHidden(true);
        onCompleteRef.current();
      },
    });

    try {
      sfx.playWeapon();
    } catch {}

    tl.to(textRef.current, {
      opacity: 1,
      scale: 1.05,
      duration: 1.0,
      ease: "power2.out",
    })
      .to(textRef.current, {
        opacity: 0,
        y: -25,
        duration: 0.5,
        ease: "power2.in",
      })
      .to(
        topBarRef.current,
        {
          yPercent: -100,
          duration: 0.85,
          ease: "power3.inOut",
        },
        "-=0.25"
      )
      .to(
        bottomBarRef.current,
        {
          yPercent: 100,
          duration: 0.85,
          ease: "power3.inOut",
        },
        "<"
      );

    return () => {
      tl.kill();
    };
  }, []);

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-between overflow-hidden pointer-events-none">
      {/* Top Letterbox Bar */}
      <div
        ref={topBarRef}
        className="w-full h-1/2 bg-black flex items-end justify-center pb-8 border-b border-[#ff2a85]/40 relative"
      >
        <div
          ref={textRef}
          className="text-center font-mono opacity-0 space-y-1.5 px-4 drop-shadow-[0_0_15px_#ff2a85]"
        >
          <div className="text-3xl sm:text-5xl font-black italic tracking-widest text-[#00f0ff]">
            STATE OF LEONIDA
          </div>
          <div className="text-xs sm:text-sm tracking-widest text-[#ff2a85] font-bold">
            INITIALIZING FULL-STACK OPERATIVE DEVESH SHARMA // 2026
          </div>
        </div>
      </div>

      {/* Bottom Letterbox Bar */}
      <div
        ref={bottomBarRef}
        className="w-full h-1/2 bg-black border-t border-[#00f0ff]/40 flex flex-col items-center justify-start pt-8 gap-4"
      >
        <div className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">
          SECURE CONNECTION ESTABLISHED • 60 FPS PBR RENDERER LOADED
        </div>

        <button
          type="button"
          onClick={dismissIntro}
          className="pointer-events-auto px-4 py-1.5 rounded-full bg-white/10 hover:bg-[#ff2a85] border border-white/20 text-[10px] font-mono text-gray-300 hover:text-white tracking-widest uppercase transition-all"
        >
          SKIP INTRO ⏭
        </button>
      </div>
    </div>
  );
};
