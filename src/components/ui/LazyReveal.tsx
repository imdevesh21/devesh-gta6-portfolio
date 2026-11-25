"use client";

import React, { useEffect, useRef, useState } from "react";

type RevealVariant = "fade-up" | "slide-left" | "slide-right" | "zoom-in";

interface LazyRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delayMs?: number;
  threshold?: number;
  rootMargin?: string;
  /** Defer mounting children until near viewport for true lazy rendering */
  lazyMount?: boolean;
  skeletonHeightClass?: string;
  className?: string;
}

const VARIANT_HIDDEN: Record<RevealVariant, string> = {
  "fade-up": "opacity-0 translate-y-10",
  "slide-left": "opacity-0 -translate-x-10",
  "slide-right": "opacity-0 translate-x-10",
  "zoom-in": "opacity-0 scale-95",
};

const VARIANT_VISIBLE = "opacity-100 translate-y-0 translate-x-0 scale-100";

/**
 * Custom IntersectionObserver-based LazyReveal wrapper.
 * Supports deferred lazy-mounting (skeleton until scrolled near) and smooth cinematic entrance.
 */
export const LazyReveal: React.FC<LazyRevealProps> = ({
  children,
  variant = "fade-up",
  delayMs = 0,
  threshold = 0.08,
  rootMargin = "120px",
  lazyMount = false,
  skeletonHeightClass = "min-h-[240px]",
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(!lazyMount);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsMounted(true);
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsMounted(true);
            requestAnimationFrame(() => setIsVisible(true));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        isVisible ? VARIANT_VISIBLE : VARIANT_HIDDEN[variant]
      } ${className}`}
    >
      {isMounted ? (
        children
      ) : (
        <div
          className={`w-full ${skeletonHeightClass} rounded-2xl border border-white/10 cyber-shimmer flex items-center justify-center`}
        >
          <span className="text-xs font-mono tracking-widest text-[#00f0ff]/70 uppercase">
            LOADING SECTOR DATA...
          </span>
        </div>
      )}
    </div>
  );
};
