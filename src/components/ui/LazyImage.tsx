"use client";

import React, { useEffect, useRef, useState } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  overlayClassName?: string;
  /** Enable subtle scroll-driven parallax inside the image frame */
  parallax?: boolean;
  /** Root margin for IntersectionObserver pre-loading */
  rootMargin?: string;
  priority?: boolean;
  fallbackGradient?: string;
}

/**
 * Custom IntersectionObserver-based LazyImage with Vice City cyber-shimmer
 * skeleton, smooth blur-up reveal, optional internal parallax, and graceful fallback.
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "w-full h-full object-cover",
  containerClassName = "",
  overlayClassName = "",
  parallax = false,
  rootMargin = "160px",
  priority = false,
  fallbackGradient = "linear-gradient(135deg, #1b0333 0%, #ff2a85 55%, #00f0ff 100%)",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [inView, setInView] = useState<boolean>(priority);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Lazy load trigger via IntersectionObserver
  useEffect(() => {
    if (priority || inView) return;
    const node = containerRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [priority, inView, rootMargin]);

  // Optional internal scroll parallax
  useEffect(() => {
    if (!parallax) return;
    let rafId = 0;

    const updateParallax = () => {
      const container = containerRef.current;
      const img = imgRef.current;
      if (!container || !img) return;

      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      const offset = Math.max(-24, Math.min(24, progress * -22));
      img.style.transform = `scale(1.12) translate3d(0, ${offset}px, 0)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [parallax, loaded]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-[#110122] ${containerClassName}`}
    >
      {/* Cyber Shimmer Skeleton Placeholder */}
      {!loaded && !hasError && (
        <div className="absolute inset-0 z-10 cyber-shimmer flex items-center justify-center">
          <div className="flex flex-col items-center gap-1.5 opacity-60">
            <span className="w-6 h-6 rounded-full border-2 border-[#00f0ff] border-t-transparent animate-spin" />
            <span className="text-[9px] font-mono tracking-widest text-[#00f0ff] uppercase">
              STREAMING ASSET...
            </span>
          </div>
        </div>
      )}

      {/* Artistic Fallback if offline or blocked */}
      {hasError ? (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ background: fallbackGradient }}
          aria-label={alt}
        >
          <span className="text-xs font-mono uppercase tracking-widest text-white/80 bg-black/50 px-3 py-1 rounded border border-white/20">
            LEONIDA VISUAL FEED
          </span>
        </div>
      ) : (
        inView && (
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => {
              setHasError(true);
              setLoaded(true);
            }}
            className={`${className} transition-all duration-700 ease-out will-change-transform ${
              loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105"
            }`}
          />
        )
      )}

      {/* Optional Gradient / Scanline Overlay */}
      {overlayClassName && (
        <div className={`pointer-events-none absolute inset-0 z-20 ${overlayClassName}`} />
      )}
    </div>
  );
};
