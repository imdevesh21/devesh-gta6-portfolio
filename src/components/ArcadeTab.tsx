"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { sfx } from "../lib/soundFx";
import { Trophy, Flame, RotateCcw, Play, ShieldAlert, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  type: "police" | "civilian" | "barrier";
  color: string;
}

interface Collectible {
  x: number;
  y: number;
  label: string;
  points: number;
  icon: string;
  radius: number;
  color: string;
}

export const ArcadeTab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [nitro, setNitro] = useState<number>(100);
  const [isBoosting, setIsBoosting] = useState<boolean>(false);
  const [wantedStars, setWantedStars] = useState<number>(1);
  const [combo, setCombo] = useState<number>(1);
  const [unlockedEasterEgg, setUnlockedEasterEgg] = useState<boolean>(false);

  // References for live game loop without React re-render lags
  const playerRef = useRef({
    x: 200,
    y: 430,
    width: 44,
    height: 72,
    targetX: 200,
    speed: 7,
  });

  const keysRef = useRef<{ left: boolean; right: boolean; boost: boolean }>({
    left: false,
    right: false,
    boost: false,
  });

  const gameLoopRef = useRef<number | null>(null);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const collectiblesRef = useRef<Collectible[]>([]);
  const roadOffsetRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const distanceRef = useRef<number>(0);
  const nitroRef = useRef<number>(100);
  const boostActiveRef = useRef<boolean>(false);
  const comboRef = useRef<number>(1);
  const comboTimerRef = useRef<number>(0);

  // Load high score from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gta6_arcade_highscore");
      if (saved) setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;

      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = true;
      }
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        keysRef.current.boost = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = false;
      }
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        keysRef.current.boost = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);

  // Start / Reset Game
  const startGame = useCallback(() => {
    sfx.playArcadeBoost();
    setGameState("playing");
    setScore(0);
    setDistance(0);
    setNitro(100);
    setIsBoosting(false);
    setWantedStars(1);
    setCombo(1);
    setUnlockedEasterEgg(false);

    scoreRef.current = 0;
    distanceRef.current = 0;
    nitroRef.current = 100;
    boostActiveRef.current = false;
    comboRef.current = 1;
    comboTimerRef.current = 0;
    obstaclesRef.current = [];
    collectiblesRef.current = [];
    roadOffsetRef.current = 0;

    playerRef.current.x = 200;
    playerRef.current.targetX = 200;
  }, []);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameCount = 0;
    const roadWidth = 320;
    const roadLeft = (canvas.width - roadWidth) / 2;
    const roadRight = roadLeft + roadWidth;

    const TECH_ITEMS: Array<{ label: string; points: number; icon: string; color: string }> = [
      { label: "React", points: 100, icon: "⚛️", color: "#61dafb" },
      { label: "TypeScript", points: 150, icon: "🔷", color: "#3178c6" },
      { label: "Next.js", points: 200, icon: "⚡", color: "#ffffff" },
      { label: "Node.js", points: 250, icon: "🟢", color: "#68a063" },
      { label: "Docker", points: 300, icon: "🐳", color: "#2496ed" },
    ];

    const spawnObstacle = () => {
      const lane = Math.floor(Math.random() * 3);
      const laneWidth = roadWidth / 3;
      const x = roadLeft + lane * laneWidth + laneWidth / 2 - 18;
      const isPolice = Math.random() > 0.55;

      obstaclesRef.current.push({
        x,
        y: -90,
        width: 36,
        height: 64,
        speed: isPolice ? 6 : 4,
        type: isPolice ? "police" : "civilian",
        color: isPolice ? "#00f0ff" : "#ff2a85",
      });
    };

    const spawnCollectible = () => {
      const lane = Math.floor(Math.random() * 3);
      const laneWidth = roadWidth / 3;
      const x = roadLeft + lane * laneWidth + laneWidth / 2;
      const template = TECH_ITEMS[Math.floor(Math.random() * TECH_ITEMS.length)];

      collectiblesRef.current.push({
        x,
        y: -40,
        label: template.label,
        points: template.points,
        icon: template.icon,
        radius: 16,
        color: template.color,
      });
    };

    const animate = () => {
      frameCount++;

      // 1. Base Speeds & Nitro boost
      let baseSpeed = 5 + Math.min(distanceRef.current / 400, 7);
      if (keysRef.current.boost && nitroRef.current > 5) {
        baseSpeed *= 1.7;
        nitroRef.current = Math.max(nitroRef.current - 0.45, 0);
        boostActiveRef.current = true;
      } else {
        boostActiveRef.current = false;
        nitroRef.current = Math.min(nitroRef.current + 0.1, 100);
      }

      setNitro(Math.floor(nitroRef.current));
      setIsBoosting(boostActiveRef.current);

      // Distance & Score progression
      distanceRef.current += Math.floor(baseSpeed);
      scoreRef.current += Math.floor(baseSpeed / 3) * comboRef.current;
      setDistance(distanceRef.current);
      setScore(scoreRef.current);

      // Wanted level progression
      if (distanceRef.current > 3000) setWantedStars(5);
      else if (distanceRef.current > 2000) setWantedStars(4);
      else if (distanceRef.current > 1200) setWantedStars(3);
      else if (distanceRef.current > 500) setWantedStars(2);
      else setWantedStars(1);

      // Easter egg milestone
      if (scoreRef.current > 2000 && !unlockedEasterEgg) {
        setUnlockedEasterEgg(true);
      }

      // Combo Decay
      if (comboTimerRef.current > 0) {
        comboTimerRef.current--;
        if (comboTimerRef.current === 0) {
          comboRef.current = 1;
          setCombo(1);
        }
      }

      // 2. Player Steering
      const steerSpeed = 6.5;
      if (keysRef.current.left) {
        playerRef.current.x = Math.max(playerRef.current.x - steerSpeed, roadLeft + 6);
      }
      if (keysRef.current.right) {
        playerRef.current.x = Math.min(playerRef.current.x + steerSpeed, roadRight - playerRef.current.width - 6);
      }

      // 3. Spawns
      const spawnRate = Math.max(75 - Math.floor(distanceRef.current / 300), 38);
      if (frameCount % spawnRate === 0) {
        spawnObstacle();
      }
      if (frameCount % 90 === 0) {
        spawnCollectible();
      }

      // 4. Update Obstacles
      for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
        const obs = obstaclesRef.current[i];
        obs.y += baseSpeed - obs.speed;

        // Collision Check with Player
        const p = playerRef.current;
        if (
          p.x < obs.x + obs.width &&
          p.x + p.width > obs.x &&
          p.y < obs.y + obs.height &&
          p.y + p.height > obs.y
        ) {
          // CRASH!
          sfx.playArcadeCrash();
          setGameState("gameover");

          // Check for high score
          if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            if (typeof window !== "undefined") {
              localStorage.setItem("gta6_arcade_highscore", scoreRef.current.toString());
            }
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#ff2a85", "#00f0ff", "#ffb700"],
            });
          }
          return;
        }

        // Despawn
        if (obs.y > canvas.height + 100) {
          obstaclesRef.current.splice(i, 1);
        }
      }

      // 5. Update Collectibles
      for (let i = collectiblesRef.current.length - 1; i >= 0; i--) {
        const item = collectiblesRef.current[i];
        item.y += baseSpeed;

        // Collect check
        const p = playerRef.current;
        const centerX = item.x;
        const centerY = item.y;
        const playerCenterX = p.x + p.width / 2;
        const playerCenterY = p.y + p.height / 2;
        const dist = Math.hypot(centerX - playerCenterX, centerY - playerCenterY);

        if (dist < item.radius + p.width / 2) {
          // Collected!
          sfx.playArcadePickup();
          collectiblesRef.current.splice(i, 1);

          comboRef.current = Math.min(comboRef.current + 1, 5);
          comboTimerRef.current = 180; // 3 seconds at 60fps
          setCombo(comboRef.current);

          scoreRef.current += item.points * comboRef.current;
          setScore(scoreRef.current);
          continue;
        }

        if (item.y > canvas.height + 50) {
          collectiblesRef.current.splice(i, 1);
        }
      }

      // 6. DRAW CANVAS SCENE
      // Background: Deep Cyber Neon Highway
      ctx.fillStyle = "#0c0119";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Retro Synthwave Sunset Horizon
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 160);
      skyGrad.addColorStop(0, "#2a0845");
      skyGrad.addColorStop(0.6, "#64147d");
      skyGrad.addColorStop(1, "#ff2a85");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, 160);

      // Glowing Synth Sun
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 130, 48, 0, Math.PI * 2);
      const sunGrad = ctx.createLinearGradient(0, 80, 0, 180);
      sunGrad.addColorStop(0, "#ffb700");
      sunGrad.addColorStop(1, "#ff2a85");
      ctx.fillStyle = sunGrad;
      ctx.shadowColor = "#ff2a85";
      ctx.shadowBlur = 30;
      ctx.fill();

      // Sun horizontal stripes
      ctx.fillStyle = "#0c0119";
      for (let s = 115; s < 175; s += 9) {
        ctx.fillRect(canvas.width / 2 - 50, s, 100, 3);
      }
      ctx.restore();

      // Road Surface
      ctx.fillStyle = "#150228";
      ctx.fillRect(roadLeft, 160, roadWidth, canvas.height - 160);

      // Road Curbs / Borders
      ctx.fillStyle = "#ff2a85";
      ctx.fillRect(roadLeft - 8, 160, 8, canvas.height - 160);
      ctx.fillStyle = "#00f0ff";
      ctx.fillRect(roadRight, 160, 8, canvas.height - 160);

      // Moving Dashed Lanes
      roadOffsetRef.current = (roadOffsetRef.current + baseSpeed) % 40;
      ctx.fillStyle = "#00f0ff";
      const lane1X = roadLeft + roadWidth / 3;
      const lane2X = roadLeft + (roadWidth / 3) * 2;

      for (let y = 160 - 40 + roadOffsetRef.current; y < canvas.height; y += 40) {
        ctx.fillRect(lane1X - 2, y, 4, 22);
        ctx.fillRect(lane2X - 2, y, 4, 22);
      }

      // Draw Collectibles
      collectiblesRef.current.forEach((item) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#110122";
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 15;
        ctx.fill();

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = item.color;
        ctx.stroke();

        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.icon, item.x, item.y);

        // Tech Label
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(item.label, item.x, item.y + 19);
        ctx.restore();
      });

      // Draw Obstacles (Traffic & Police Cruisers)
      obstaclesRef.current.forEach((obs) => {
        ctx.save();
        if (obs.type === "police") {
          // Police Cruiser
          ctx.fillStyle = "#0a0a0c";
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 6);
          ctx.fill();

          // White police doors
          ctx.fillStyle = "#e5e7eb";
          ctx.fillRect(obs.x + 2, obs.y + 14, obs.width - 4, 28);

          // Roof Siren Bar (Alternate Red / Blue Flashing)
          const sirenFlash = Math.floor(frameCount / 6) % 2 === 0;
          ctx.fillStyle = sirenFlash ? "#ff0044" : "#00f0ff";
          ctx.shadowColor = sirenFlash ? "#ff0044" : "#00f0ff";
          ctx.shadowBlur = 18;
          ctx.fillRect(obs.x + 8, obs.y + 24, obs.width - 16, 6);

          // Headlights
          ctx.fillStyle = "#ffb700";
          ctx.fillRect(obs.x + 4, obs.y + obs.height - 4, 6, 3);
          ctx.fillRect(obs.x + obs.width - 10, obs.y + obs.height - 4, 6, 3);
        } else {
          // Civilian Supercar
          ctx.fillStyle = obs.color;
          ctx.shadowColor = obs.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 6);
          ctx.fill();

          // Windshield
          ctx.fillStyle = "#111827";
          ctx.fillRect(obs.x + 4, obs.y + 14, obs.width - 8, 14);

          // Headlights
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(obs.x + 3, obs.y + obs.height - 4, 6, 3);
          ctx.fillRect(obs.x + obs.width - 9, obs.y + obs.height - 4, 6, 3);
        }
        ctx.restore();
      });

      // Draw Player Car (Vice City Cyber Infernus)
      const p = playerRef.current;
      ctx.save();

      // Headlight Beams casting ahead on the road
      const beamGrad = ctx.createLinearGradient(0, p.y, 0, p.y - 120);
      beamGrad.addColorStop(0, "rgba(0, 240, 255, 0.45)");
      beamGrad.addColorStop(1, "rgba(0, 240, 255, 0)");
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(p.x + 6, p.y);
      ctx.lineTo(p.x - 25, p.y - 110);
      ctx.lineTo(p.x + p.width + 25, p.y - 110);
      ctx.lineTo(p.x + p.width - 6, p.y);
      ctx.closePath();
      ctx.fill();

      // Nitro exhaust flame trail
      if (boostActiveRef.current) {
        ctx.fillStyle = "#ff2a85";
        ctx.shadowColor = "#ff2a85";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(p.x + 10, p.y + p.height);
        ctx.lineTo(p.x + 16, p.y + p.height + 28 + Math.random() * 12);
        ctx.lineTo(p.x + 22, p.y + p.height);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(p.x + p.width - 22, p.y + p.height);
        ctx.lineTo(p.x + p.width - 16, p.y + p.height + 28 + Math.random() * 12);
        ctx.lineTo(p.x + p.width - 10, p.y + p.height);
        ctx.fill();
      }

      // Car Body
      ctx.fillStyle = "#00f0ff";
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = boostActiveRef.current ? 25 : 12;
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.width, p.height, 8);
      ctx.fill();

      // Carbon Fiber Roof / Cockpit
      ctx.fillStyle = "#0a0a16";
      ctx.beginPath();
      ctx.roundRect(p.x + 4, p.y + 16, p.width - 8, 32, 4);
      ctx.fill();

      // Tinted Windshield
      ctx.fillStyle = "#ff2a85";
      ctx.fillRect(p.x + 7, p.y + 18, p.width - 14, 10);

      // Rear Spoiler & Taillights
      ctx.fillStyle = "#ff2a85";
      ctx.shadowColor = "#ff2a85";
      ctx.shadowBlur = 12;
      ctx.fillRect(p.x + 2, p.y + p.height - 5, 10, 4);
      ctx.fillRect(p.x + p.width - 12, p.y + p.height - 5, 10, 4);
      ctx.restore();

      gameLoopRef.current = requestAnimationFrame(animate);
    };

    gameLoopRef.current = requestAnimationFrame(animate);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, highScore, unlockedEasterEgg]);

  // Touch Controls Helper
  const handleTouchLeftStart = () => { keysRef.current.left = true; };
  const handleTouchLeftEnd = () => { keysRef.current.left = false; };
  const handleTouchRightStart = () => { keysRef.current.right = true; };
  const handleTouchRightEnd = () => { keysRef.current.right = false; };
  const handleTouchBoostStart = () => { keysRef.current.boost = true; };
  const handleTouchBoostEnd = () => { keysRef.current.boost = false; };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Title Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-black tracking-widest text-[#00f0ff] uppercase drop-shadow-[0_0_12px_#00f0ff] flex items-center justify-center gap-2">
          <span>🕹️</span>
          <span>LEONIDA GETAWAY: VICE ARCADE</span>
        </h2>
        <p className="text-xs font-mono text-gray-400">
          DODGE POLICE CRUISERS • COLLECT TECH STACK ASSETS • SURVIVE 5-STAR WANTED LEVEL
        </p>
      </div>

      {/* Main Arcade Frame Container */}
      <div className="relative bg-[#140124] border-2 border-[#ff2a85] rounded-3xl p-4 shadow-[0_0_35px_rgba(255,42,133,0.35)] overflow-hidden">
        
        {/* Top HUD Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-black/80 p-3 rounded-2xl border border-gray-800 font-mono text-xs mb-3">
          {/* Score & Combo */}
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[10px] text-gray-400 font-bold">TOTAL BOUNTY</div>
              <div className="text-xl font-black text-white tracking-wider">
                ${score.toLocaleString()}
              </div>
            </div>

            {combo > 1 && (
              <div className="px-2.5 py-1 bg-amber-950/80 border border-amber-400 text-amber-300 rounded-lg font-black text-xs animate-bounce flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{combo}X COMBO</span>
              </div>
            )}
          </div>

          {/* Distance & Wanted Stars */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-[10px] text-gray-400 font-bold">DISTANCE</div>
              <div className="text-sm font-black text-[#00f0ff]">
                {distance} M
              </div>
            </div>

            <div className="bg-black/90 px-3 py-1.5 rounded-xl border border-yellow-500/50 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-yellow-400" />
              <div className="text-yellow-400 text-xs font-black">
                {"★".repeat(wantedStars)}
                <span className="text-gray-700">{"★".repeat(5 - wantedStars)}</span>
              </div>
            </div>
          </div>

          {/* Nitro Tank & High Score */}
          <div className="flex items-center gap-4">
            {/* Nitro Gauge */}
            <div className="w-24">
              <div className="flex items-center justify-between text-[9px] text-[#ff2a85] font-bold mb-0.5">
                <span>NITRO</span>
                <span>{nitro}%</span>
              </div>
              <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-pink-500/40">
                <div
                  className="bg-gradient-to-r from-[#ff2a85] to-[#00f0ff] h-full transition-all"
                  style={{ width: `${nitro}%` }}
                />
              </div>
            </div>

            {/* High Score */}
            <div className="text-right">
              <div className="text-[10px] text-gray-400 flex items-center justify-end gap-1 font-bold">
                <Trophy className="w-3 h-3 text-yellow-400" />
                <span>RECORD</span>
              </div>
              <div className="text-xs font-black text-yellow-400">
                ${highScore.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* The 60FPS Game Canvas */}
        <div className="relative flex justify-center bg-black rounded-2xl overflow-hidden border border-gray-900 shadow-inner">
          <canvas
            ref={canvasRef}
            width={640}
            height={520}
            className="w-full max-w-[640px] h-[400px] sm:h-[480px] object-cover"
          />

          {/* Overlay: Start Menu */}
          {gameState === "menu" && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ff2a85] to-[#00f0ff] flex items-center justify-center text-3xl shadow-[0_0_25px_#ff2a85] animate-pulse">
                🏎️
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-widest uppercase">
                LEONIDA HIGHWAY RUNNER
              </h3>
              <p className="text-xs font-mono text-gray-300 max-w-md leading-relaxed">
                Steer through Vice City traffic, dodge flashing police cruisers, and snatch up floating Tech Stack assets (React, TypeScript, Node) for massive multipliers!
              </p>

              <div className="font-mono text-xs text-[#00f0ff] bg-cyan-950/60 p-3 rounded-xl border border-cyan-500/40 space-y-1">
                <div>🎮 <b>Desktop</b>: [A] / [D] or [←] / [→] to Steer • [SPACE] for Nitro Boost</div>
                <div>📱 <b>Mobile</b>: Use the on-screen tactile buttons below</div>
              </div>

              <button
                onClick={startGame}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#00f0ff] via-[#ff2a85] to-[#7b00ff] text-black font-black text-sm tracking-wider uppercase shadow-[0_0_25px_#00f0ff] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>START HIGHWAY PURSUIT</span>
              </button>
            </div>
          )}

          {/* Overlay: Game Over (Wasted / Busted) */}
          {gameState === "gameover" && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 space-y-4 animate-fadeIn">
              <h3 className="text-4xl sm:text-5xl font-black text-red-500 tracking-widest uppercase drop-shadow-[0_0_20px_#ef4444] animate-pulse">
                BUSTED!
              </h3>
              <p className="text-xs font-mono text-gray-400">
                You crashed into Vice City roadblocks!
              </p>

              <div className="grid grid-cols-2 gap-4 font-mono bg-black/60 p-4 rounded-xl border border-gray-800 w-full max-w-xs">
                <div>
                  <div className="text-[10px] text-gray-500">FINAL BOUNTY</div>
                  <div className="text-lg font-black text-white">${score.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500">DISTANCE</div>
                  <div className="text-lg font-black text-[#00f0ff]">{distance} M</div>
                </div>
              </div>

              {unlockedEasterEgg && (
                <div className="bg-emerald-950/80 border border-emerald-400 text-emerald-300 p-3 rounded-xl text-xs font-mono font-bold max-w-sm animate-bounce">
                  🔓 SECRET RECRUITER CLEARANCE CODE: <span className="text-white">DEVESH_SDE_2026</span>
                </div>
              )}

              <button
                onClick={startGame}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#ff2a85] to-[#7b00ff] text-white font-black text-sm tracking-wider uppercase shadow-[0_0_25px_#ff2a85] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>PLAY AGAIN</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Tactile Touch Controls */}
        <div className="mt-4 grid grid-cols-3 gap-2.5 font-mono text-xs font-black">
          <button
            onMouseDown={handleTouchLeftStart}
            onMouseUp={handleTouchLeftEnd}
            onTouchStart={handleTouchLeftStart}
            onTouchEnd={handleTouchLeftEnd}
            className="py-3 bg-black/70 active:bg-cyan-900 border border-[#00f0ff]/50 rounded-xl text-[#00f0ff] flex items-center justify-center gap-1 active:scale-95 transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)] select-none"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>STEER LEFT</span>
          </button>

          <button
            onMouseDown={handleTouchBoostStart}
            onMouseUp={handleTouchBoostEnd}
            onTouchStart={handleTouchBoostStart}
            onTouchEnd={handleTouchBoostEnd}
            className={`py-3 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all select-none border ${
              isBoosting
                ? "bg-[#ff2a85] text-white border-pink-400 shadow-[0_0_20px_#ff2a85]"
                : "bg-black/70 text-[#ff2a85] border-[#ff2a85]/50 hover:bg-pink-950/40"
            }`}
          >
            <Flame className="w-5 h-5" />
            <span>NITRO BOOST</span>
          </button>

          <button
            onMouseDown={handleTouchRightStart}
            onMouseUp={handleTouchRightEnd}
            onTouchStart={handleTouchRightStart}
            onTouchEnd={handleTouchRightEnd}
            className="py-3 bg-black/70 active:bg-cyan-900 border border-[#00f0ff]/50 rounded-xl text-[#00f0ff] flex items-center justify-center gap-1 active:scale-95 transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)] select-none"
          >
            <span>STEER RIGHT</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Mini Lore & Easter Egg Card */}
      <div className="bg-[#140124]/90 p-4 rounded-2xl border border-gray-800 flex items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/50 flex items-center justify-center text-xl">
            🏆
          </div>
          <div>
            <h4 className="text-white font-bold tracking-wide">
              EASTER EGG CHALLENGE
            </h4>
            <p className="text-[11px] text-gray-400">
              Score over $2,000 in a single run to unlock secret operative clearance credentials in the cheat terminal!
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[10px] text-gray-500 uppercase font-bold">STATUS</span>
          <div className={`font-black text-xs ${unlockedEasterEgg ? "text-emerald-400" : "text-gray-400"}`}>
            {unlockedEasterEgg ? "CLEARED ✓" : "LOCKED 🔒"}
          </div>
        </div>
      </div>

    </div>
  );
};
