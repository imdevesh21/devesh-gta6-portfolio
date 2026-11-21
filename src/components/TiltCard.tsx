"use client";

import React, { useRef } from "react";
import gsap from "gsap";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "pink" | "cyan" | "amber" | "purple";
  onClick?: () => void;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = "",
  glowColor = "pink",
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // max 10 deg tilt
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 900,
      transformStyle: "preserve-3d",
      duration: 0.4,
      ease: "power2.out",
    });

    if (glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 0.22,
        x: x - 100,
        y: y - 100,
        duration: 0.2,
      });
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });

    if (glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 0,
        duration: 0.4,
      });
    }
  };

  const glowBorder =
    glowColor === "pink"
      ? "border-[#ff2a85]/50 shadow-[0_0_20px_rgba(255,42,133,0.3)]"
      : glowColor === "cyan"
      ? "border-[#00f0ff]/50 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
      : glowColor === "amber"
      ? "border-[#ffb700]/50 shadow-[0_0_20px_rgba(255,183,0,0.3)]"
      : "border-[#7b00ff]/50 shadow-[0_0_20px_rgba(123,0,255,0.3)]";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative rounded-2xl bg-[#140124]/90 backdrop-blur-xl border ${glowBorder} transition-colors overflow-hidden will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Specular Holo Glare Overlay */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute w-52 h-52 rounded-full bg-gradient-to-r from-white via-cyan-300 to-pink-500 blur-2xl opacity-0 z-30"
      />

      {/* Card Content with 3D Pop */}
      <div className="relative z-10" style={{ transform: "translateZ(18px)" }}>
        {children}
      </div>
    </div>
  );
};
