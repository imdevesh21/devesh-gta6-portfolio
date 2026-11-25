"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { sfx } from "../lib/soundFx";
import { Play, RotateCcw, Trophy } from "lucide-react";

interface NavbarGTAGameProps {
  onEarnCash?: (amount: number) => void;
}

interface RoadEntity {
  x: number;
  width: number;
  height: number;
  type: "cop" | "cash";
  passed?: boolean;
}

/**
 * Compact playable GTA-style highway pursuit mini-game embedded directly inside the Navbar.
 * Click / tap or press Space/ArrowUp (when active) to jump over LSPD cruisers and grab cash.
 */
export const NavbarGTAGame: React.FC<NavbarGTAGameProps> = ({ onEarnCash }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "busted">("idle");
  const [score, setScore] = useState<number>(0);
  const [best, setBest] = useState<number>(0);

  const stateRef = useRef({
    carY: 0, // 0 = ground, >0 = jumping up
    vy: 0,
    entities: [] as RoadEntity[],
    spawnTimer: 0,
    roadOffset: 0,
    speed: 3.1,
    score: 0,
    status: "idle" as "idle" | "playing" | "busted",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gta6_navbar_best");
      if (saved) setBest(parseInt(saved, 10) || 0);
    }
  }, []);

  const triggerJump = useCallback(() => {
    const st = stateRef.current;
    if (st.status === "idle" || st.status === "busted") {
      st.status = "playing";
      st.carY = 0;
      st.vy = 0;
      st.entities = [];
      st.spawnTimer = 25;
      st.speed = 3.2;
      st.score = 0;
      setScore(0);
      setStatus("playing");
      sfx.playArcadeBoost();
      return;
    }

    if (st.status === "playing" && st.carY <= 1) {
      st.vy = 5.8;
      sfx.playBleep();
    }
  }, []);

  // Keyboard support (Space / ArrowUp) while playing
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.status !== "playing") return;
      if (e.code === "Space" || e.code === "ArrowUp") {
        // Don't hijack typing inside inputs/textareas
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        triggerJump();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [triggerJump]);

  // Main 60fps Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    const W = canvas.width;
    const H = canvas.height;
    const groundY = H - 8;
    const carX = 28;
    const carW = 24;
    const carH = 11;

    const loop = () => {
      const st = stateRef.current;

      // Clear & draw twilight Vice highway
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, "#120226");
      bgGrad.addColorStop(1, "#220438");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Subtle horizon glow
      ctx.fillStyle = "rgba(255, 42, 133, 0.16)";
      ctx.fillRect(0, groundY - 3, W, 3);

      // Scrolling dashed lane line
      st.roadOffset = (st.roadOffset + (st.status === "busted" ? 0 : st.speed)) % 22;
      ctx.strokeStyle = "rgba(0, 240, 255, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([10, 12]);
      ctx.lineDashOffset = st.roadOffset;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 3);
      ctx.lineTo(W, groundY + 3);
      ctx.stroke();
      ctx.setLineDash([]);

      if (st.status === "playing") {
        // Jump physics
        st.carY += st.vy;
        st.vy -= 0.45;
        if (st.carY < 0) {
          st.carY = 0;
          st.vy = 0;
        }

        // Spawn LSPD cruisers & cash pickups
        st.spawnTimer -= 1;
        if (st.spawnTimer <= 0) {
          const isCash = Math.random() < 0.34;
          st.entities.push({
            x: W + 10,
            width: isCash ? 12 : 22,
            height: isCash ? 12 : 11,
            type: isCash ? "cash" : "cop",
          });
          st.spawnTimer = Math.floor(42 + Math.random() * 34);
          st.speed = Math.min(5.8, st.speed + 0.03);
        }

        // Update entities & check collisions
        const playerTop = groundY - carH - st.carY;
        const playerBottom = groundY - st.carY;

        for (let i = st.entities.length - 1; i >= 0; i--) {
          const ent = st.entities[i];
          ent.x -= st.speed;

          const entY = ent.type === "cash" ? groundY - 22 : groundY - ent.height;
          const entBottom = entY + ent.height;

          // AABB Collision check (with forgiving 2px margin)
          const overlapX = carX + carW - 2 > ent.x + 2 && carX + 2 < ent.x + ent.width - 2;
          const overlapY = playerBottom - 1 > entY + 1 && playerTop + 1 < entBottom - 1;

          if (overlapX && overlapY) {
            if (ent.type === "cash") {
              st.score += 50;
              setScore(st.score);
              sfx.playBleep();
              if (onEarnCash) onEarnCash(250);
              st.entities.splice(i, 1);
              continue;
            } else {
              // Busted!
              st.status = "busted";
              setStatus("busted");
              sfx.playWeapon();
              setBest((prev) => {
                const next = Math.max(prev, st.score);
                if (typeof window !== "undefined") {
                  localStorage.setItem("gta6_navbar_best", String(next));
                }
                return next;
              });
              break;
            }
          }

          if (!ent.passed && ent.type === "cop" && ent.x + ent.width < carX) {
            ent.passed = true;
            st.score += 10;
            setScore(st.score);
            if (onEarnCash) onEarnCash(50);
          }

          if (ent.x + ent.width < -10) {
            st.entities.splice(i, 1);
          }
        }
      } else if (st.status === "idle") {
        // Gentle idle cruise bob
        st.carY = Math.abs(Math.sin(Date.now() * 0.004)) * 1.2;
      }

      // Draw entities
      st.entities.forEach((ent) => {
        if (ent.type === "cash") {
          const y = groundY - 22;
          ctx.fillStyle = "#10b981";
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 8;
          ctx.fillRect(ent.x, y, ent.width, ent.height);
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px monospace";
          ctx.fillText("$", ent.x + 3, y + 9);
        } else {
          const y = groundY - ent.height;
          // LSPD Cruiser body
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(ent.x, y + 3, ent.width, ent.height - 3);
          ctx.fillStyle = "#f8fafc";
          ctx.fillRect(ent.x + 5, y, 11, 5);
          // Flashing red/blue siren
          const flash = Math.floor(Date.now() / 120) % 2 === 0;
          ctx.fillStyle = flash ? "#ef4444" : "#3b82f6";
          ctx.shadowColor = flash ? "#ef4444" : "#3b82f6";
          ctx.shadowBlur = 8;
          ctx.fillRect(ent.x + 8, y - 2, 5, 2);
          ctx.shadowBlur = 0;
        }
      });

      // Draw Player Vice Supercar
      const drawY = groundY - carH - st.carY;
      // Neon underglow
      ctx.fillStyle = "rgba(0, 240, 255, 0.5)";
      ctx.fillRect(carX + 2, drawY + carH - 1, carW - 4, 2);
      // Car body
      ctx.fillStyle = "#ff2a85";
      ctx.shadowColor = "#ff2a85";
      ctx.shadowBlur = 8;
      ctx.fillRect(carX, drawY + 4, carW, carH - 5);
      // Windshield cabin
      ctx.fillStyle = "#00f0ff";
      ctx.fillRect(carX + 6, drawY, 10, 5);
      ctx.shadowBlur = 0;
      // Wheels
      ctx.fillStyle = "#09090b";
      ctx.fillRect(carX + 3, drawY + carH - 3, 5, 3);
      ctx.fillRect(carX + carW - 8, drawY + carH - 3, 5, 3);

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [onEarnCash]);

  return (
    <div className="hidden xl:flex items-center gap-2 bg-black/75 border border-[#00f0ff]/40 rounded-xl px-2.5 py-1 shadow-[0_0_18px_rgba(0,240,255,0.2)]">
      <div
        onClick={triggerJump}
        className="relative cursor-pointer rounded-lg overflow-hidden border border-white/15 select-none group"
        title="Click or press Space to Jump over LSPD & collect Cash!"
      >
        <canvas ref={canvasRef} width={220} height={40} className="block" />

        {status === "idle" && (
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center gap-1.5 font-mono text-[10px] font-black text-[#00f0ff] group-hover:bg-black/25 transition-colors">
            <Play className="w-3 h-3 fill-current" />
            <span>PLAY VICE RUN</span>
          </div>
        )}

        {status === "busted" && (
          <div className="absolute inset-0 bg-red-950/80 flex items-center justify-center gap-1.5 font-mono text-[10px] font-black text-red-300">
            <RotateCcw className="w-3 h-3" />
            <span>BUSTED! RETRY</span>
          </div>
        )}
      </div>

      <div className="font-mono text-[10px] leading-tight min-w-[66px]">
        <div className="text-[#00f0ff] font-black">
          PTS: <span className="text-white">{score}</span>
        </div>
        <div className="text-[#ffb700] font-bold flex items-center gap-1">
          <Trophy className="w-2.5 h-2.5" />
          <span>{best}</span>
        </div>
        <div className="text-[8px] text-gray-400">
          {status === "playing" ? "SPACE / TAP" : "NAV GAME"}
        </div>
      </div>
    </div>
  );
};
