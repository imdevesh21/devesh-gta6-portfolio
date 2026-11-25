"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { sfx } from "../lib/soundFx";
import { Play, RotateCcw, Trophy } from "lucide-react";

interface NavbarMiniGameProps {
  onEarnCash?: (amount: number) => void;
}

interface NavObstacle {
  x: number;
  width: number;
  height: number;
  kind: "cop" | "cone";
}

interface NavCoin {
  x: number;
  y: number;
  collected: boolean;
}

/**
 * Playable mini GTA highway chase game embedded directly inside the Navbar.
 * Tap / Click / Space to jump over LSPD cruisers & cones and grab Vice cash.
 */
export const NavbarMiniGame: React.FC<NavbarMiniGameProps> = ({ onEarnCash }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "busted">("idle");
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  const stateRef = useRef({
    carY: 0, // offset from ground (0 = on road, negative = in air)
    velY: 0,
    isJumping: false,
    roadOffset: 0,
    speed: 3.4,
    score: 0,
    obstacles: [] as NavObstacle[],
    coins: [] as NavCoin[],
    spawnTimer: 0,
    coinTimer: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gta6_nav_highscore");
      if (saved) setHighScore(parseInt(saved, 10) || 0);
    }
  }, []);

  const resetAndStart = useCallback(() => {
    sfx.playArcadeBoost();
    stateRef.current = {
      carY: 0,
      velY: 0,
      isJumping: false,
      roadOffset: 0,
      speed: 3.5,
      score: 0,
      obstacles: [],
      coins: [],
      spawnTimer: 45,
      coinTimer: 25,
    };
    setScore(0);
    setStatus("playing");
  }, []);

  const triggerJump = useCallback(() => {
    if (status === "idle" || status === "busted") {
      resetAndStart();
      return;
    }
    const st = stateRef.current;
    if (!st.isJumping) {
      st.velY = -6.4;
      st.isJumping = true;
      sfx.playClick();
    }
  }, [status, resetAndStart]);

  // Keyboard support when user presses Space/ArrowUp while not typing in an input
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (status !== "playing") return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.code === "Space" || e.code === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        triggerJump();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [status, triggerJump]);

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

    const renderFrame = () => {
      const st = stateRef.current;

      // Sky & Vice City twilight backdrop
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#0b0118");
      grad.addColorStop(0.7, "#240342");
      grad.addColorStop(1, "#120224");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Synth sun glow on horizon
      ctx.fillStyle = "rgba(255, 42, 133, 0.25)";
      ctx.beginPath();
      ctx.arc(W - 44, groundY - 8, 18, Math.PI, 0);
      ctx.fill();

      // Road surface & animated neon dashes
      ctx.fillStyle = "#16072b";
      ctx.fillRect(0, groundY, W, 8);
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(W, groundY);
      ctx.stroke();

      st.roadOffset = (st.roadOffset + (status === "playing" ? st.speed : 1.4)) % 24;
      ctx.fillStyle = "rgba(255, 42, 133, 0.7)";
      for (let x = -st.roadOffset; x < W; x += 24) {
        ctx.fillRect(x, groundY + 3, 12, 1.5);
      }

      if (status === "playing") {
        // Car jump physics
        if (st.isJumping) {
          st.carY += st.velY;
          st.velY += 0.42; // gravity
          if (st.carY >= 0) {
            st.carY = 0;
            st.velY = 0;
            st.isJumping = false;
          }
        }

        // Gradually ramp speed
        st.speed = Math.min(6.2, st.speed + 0.0008);

        // Spawn obstacles (LSPD cruisers & cones)
        st.spawnTimer--;
        if (st.spawnTimer <= 0) {
          const isCop = Math.random() > 0.4;
          st.obstacles.push({
            x: W + 10,
            width: isCop ? 22 : 10,
            height: isCop ? 11 : 10,
            kind: isCop ? "cop" : "cone",
          });
          st.spawnTimer = Math.floor(52 + Math.random() * 48);
        }

        // Spawn cash pickups
        st.coinTimer--;
        if (st.coinTimer <= 0) {
          st.coins.push({
            x: W + 10,
            y: groundY - (Math.random() > 0.45 ? 24 : 11),
            collected: false,
          });
          st.coinTimer = Math.floor(45 + Math.random() * 55);
        }

        // Update & draw coins
        for (let i = st.coins.length - 1; i >= 0; i--) {
          const c = st.coins[i];
          c.x -= st.speed;

          if (!c.collected) {
            // Draw glowing cash orb
            ctx.fillStyle = "#10b981";
            ctx.beginPath();
            ctx.arc(c.x, c.y, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 7px monospace";
            ctx.fillText("$", c.x - 2, c.y + 2.5);

            // Pickup check
            const carTop = groundY - carH + st.carY;
            if (
              c.x > carX - 4 &&
              c.x < carX + carW + 4 &&
              c.y > carTop - 6 &&
              c.y < carTop + carH + 4
            ) {
              c.collected = true;
              st.score += 100;
              setScore(st.score);
              sfx.playBleep();
              if (onEarnCash) onEarnCash(250);
            }
          }

          if (c.x < -12 || c.collected) {
            st.coins.splice(i, 1);
          }
        }

        // Update & draw obstacles
        const carTop = groundY - carH + st.carY;
        for (let i = st.obstacles.length - 1; i >= 0; i--) {
          const o = st.obstacles[i];
          o.x -= st.speed;

          if (o.kind === "cop") {
            // LSPD cruiser with flashing red/blue light
            ctx.fillStyle = "#e2e8f0";
            ctx.fillRect(o.x, groundY - o.height, o.width, o.height - 2);
            ctx.fillStyle = "#0f172a";
            ctx.fillRect(o.x + 5, groundY - o.height - 3, 10, 4);
            const sirenOn = Math.floor(Date.now() / 120) % 2 === 0;
            ctx.fillStyle = sirenOn ? "#ef4444" : "#3b82f6";
            ctx.fillRect(o.x + 8, groundY - o.height - 5, 4, 2);
          } else {
            // Neon roadblock cone
            ctx.fillStyle = "#f97316";
            ctx.beginPath();
            ctx.moveTo(o.x, groundY);
            ctx.lineTo(o.x + o.width / 2, groundY - o.height);
            ctx.lineTo(o.x + o.width, groundY);
            ctx.closePath();
            ctx.fill();
          }

          // Collision detection (forgiving hitbox)
          const pad = 3;
          if (
            carX + carW - pad > o.x + 2 &&
            carX + pad < o.x + o.width - 2 &&
            carTop + carH > groundY - o.height + 2
          ) {
            sfx.playWeapon();
            setStatus("busted");
            const finalScore = st.score;
            setHighScore((prev) => {
              const next = Math.max(prev, finalScore);
              if (typeof window !== "undefined") {
                localStorage.setItem("gta6_nav_highscore", String(next));
              }
              return next;
            });
            break;
          }

          if (o.x < -30) {
            st.obstacles.splice(i, 1);
            st.score += 10;
            setScore(st.score);
          }
        }
      }

      // Draw Player Vice Sports Car (neon pink/cyan)
      const cy = groundY - carH + st.carY;
      // Headlight beam
      ctx.fillStyle = "rgba(0, 240, 255, 0.25)";
      ctx.beginPath();
      ctx.moveTo(carX + carW, cy + 5);
      ctx.lineTo(carX + carW + 28, cy - 2);
      ctx.lineTo(carX + carW + 28, cy + 10);
      ctx.closePath();
      ctx.fill();

      // Car body
      ctx.fillStyle = "#ff2a85";
      ctx.fillRect(carX, cy + 2, carW, carH - 4);
      // Cabin
      ctx.fillStyle = "#00f0ff";
      ctx.fillRect(carX + 5, cy - 2, 12, 5);
      // Wheels
      ctx.fillStyle = "#09090b";
      ctx.beginPath();
      ctx.arc(carX + 5, cy + carH - 1, 3, 0, Math.PI * 2);
      ctx.arc(carX + carW - 5, cy + carH - 1, 3, 0, Math.PI * 2);
      ctx.fill();

      rafId = requestAnimationFrame(renderFrame);
    };

    rafId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(rafId);
  }, [status, onEarnCash]);

  return (
    <div className="hidden sm:flex items-center gap-2 bg-black/75 border border-[#ff2a85]/45 rounded-xl px-2 py-1 shadow-[0_0_18px_rgba(255,42,133,0.2)]">
      {/* Mini Game Canvas */}
      <div
        onClick={triggerJump}
        className="relative rounded-lg overflow-hidden border border-white/10 cursor-pointer select-none group"
        title={status === "playing" ? "Click or Press SPACE to Jump!" : "Click to Play Vice Chase"}
      >
        <canvas ref={canvasRef} width={220} height={38} className="block w-[145px] md:w-[190px] lg:w-[220px] h-[34px] md:h-[38px]" />

        {status === "idle" && (
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center gap-1.5 backdrop-blur-[1px] group-hover:bg-black/25 transition-colors">
            <Play className="w-3 h-3 text-[#00f0ff] fill-[#00f0ff]" />
            <span className="font-mono text-[10px] font-black tracking-wider text-white">
              VICE CHASE
            </span>
          </div>
        )}

        {status === "busted" && (
          <div className="absolute inset-0 bg-red-950/80 flex items-center justify-center gap-1.5">
            <RotateCcw className="w-3 h-3 text-amber-300" />
            <span className="font-mono text-[10px] font-black tracking-widest text-red-300">
              BUSTED! RETRY
            </span>
          </div>
        )}
      </div>

      {/* Mini Score & High Score Readout */}
      <div className="font-mono text-[9px] leading-tight pr-1 min-w-[62px]">
        <div className="text-[#00f0ff] font-bold flex items-center justify-between gap-1">
          <span>PTS</span>
          <span className="text-white">{score}</span>
        </div>
        <div className="text-amber-400/90 flex items-center justify-between gap-1 mt-0.5">
          <Trophy className="w-2.5 h-2.5" />
          <span>{highScore}</span>
        </div>
        <div className="text-[8px] text-gray-500 mt-0.5 uppercase">
          {status === "playing" ? "[SPACE] JUMP" : "MINI-GAME"}
        </div>
      </div>
    </div>
  );
};
