"use client";

import React, { useEffect, useRef } from "react";

interface ParallaxSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

interface ParallaxLayerProps {
  children: React.ReactNode;
  /** Vertical scroll speed multiplier (-0.5 to 0.5). Negative moves up slower/reverse. */
  speed?: number;
  /** Pointer-tracking depth multiplier in pixels */
  mouseDepth?: number;
  className?: string;
}

/**
 * Custom Multi-Layer Parallax Layer driven by requestAnimationFrame scroll + pointer depth.
 */
export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  speed = 0.2,
  mouseDepth = 0,
  className = "",
}) => {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = layerRef.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let rafId = 0;
    let pointerX = 0;
    let pointerY = 0;

    const applyTransform = () => {
      if (!el) return;
      const parent = el.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const centerOffset = rect.top + rect.height / 2 - vh / 2;
      const scrollY = centerOffset * speed;

      const mx = pointerX * mouseDepth;
      const my = pointerY * mouseDepth;

      el.style.transform = `translate3d(${mx}px, ${scrollY + my}px, 0)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(applyTransform);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (mouseDepth === 0) return;
      pointerX = (e.clientX / (window.innerWidth || 1) - 0.5) * 2;
      pointerY = (e.clientY / (window.innerHeight || 1) - 0.5) * 2;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(applyTransform);
    };

    applyTransform();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (mouseDepth !== 0) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [speed, mouseDepth]);

  return (
    <div ref={layerRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
};

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  id,
  className = "",
}) => {
  return (
    <section id={id} className={`relative overflow-hidden ${className}`}>
      {children}
    </section>
  );
};
