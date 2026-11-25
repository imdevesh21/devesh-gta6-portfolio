"use client";

import React, { useEffect, useState } from "react";
import { PhotoItem } from "@/types/photo";
import { LazyImage } from "./ui/LazyImage";
import { LazyReveal } from "./ui/LazyReveal";
import { sfx } from "@/lib/soundFx";
import { Camera, Heart, MapPin, X, Sparkles, Maximize2 } from "lucide-react";

const CATEGORIES = ["All", "Street", "Sunset", "Portraits", "Travel", "Tech", "Nightlife"] as const;

export const PhotoholicGallery: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch("/api/photos");
        const data = await res.json();
        if (data.photos && Array.isArray(data.photos)) {
          setPhotos(data.photos);
        }
      } catch (err) {
        console.error("Failed to fetch photos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  const handleLike = async (e: React.MouseEvent, photo: PhotoItem) => {
    e.stopPropagation();
    if (likedIds[photo.id]) return;

    sfx.playArcadePickup();
    setLikedIds((prev) => ({ ...prev, [photo.id]: true }));
    setPhotos((prev) =>
      prev.map((p) => (p.id === photo.id ? { ...p, likes: (p.likes || 0) + 1 } : p))
    );
    if (lightboxPhoto?.id === photo.id) {
      setLightboxPhoto({ ...lightboxPhoto, likes: (lightboxPhoto.likes || 0) + 1 });
    }

    try {
      await fetch("/api/photos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: photo.id, action: "like" }),
      });
    } catch {}
  };

  const filteredPhotos =
    activeCategory === "All"
      ? photos
      : photos.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  const getAspectClass = (ratio?: PhotoItem["aspectRatio"]) => {
    if (ratio === "landscape") return "aspect-[16/10]";
    if (ratio === "square") return "aspect-square";
    return "aspect-[3/4]";
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <LazyReveal variant="fade-up">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff2a85]/15 border border-[#ff2a85]/45 text-[10px] font-mono tracking-[0.25em] text-[#ff85b8] uppercase font-bold">
            <Camera className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>SNAPMATIC // PHOTOHOLIC PINTEREST BOARD</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_12px_#ff2a85]">
            THROUGH MY LENS
          </h2>
          <p className="text-xs font-mono text-gray-400 max-w-xl mx-auto">
            CURATED FRAMES, LATE-NIGHT STREETS &amp; VISUAL STORIES — LIVE-MANAGED FROM THE ADMIN PANEL
          </p>
        </div>
      </LazyReveal>

      {/* Pinterest-Style Category Filter Pills */}
      <LazyReveal variant="fade-up" delayMs={60}>
        <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  sfx.playClick();
                  setActiveCategory(cat);
                }}
                className={`px-4 py-1.5 rounded-full font-bold transition-all border ${
                  isActive
                    ? "bg-gradient-to-r from-[#ff2a85] to-[#7b00ff] text-white border-transparent shadow-[0_0_16px_rgba(255,42,133,0.5)] scale-105"
                    : "bg-black/60 border-white/15 text-gray-300 hover:border-[#00f0ff] hover:text-white"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            );
          })}
        </div>
      </LazyReveal>

      {/* Pinterest Masonry Columns */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 rounded-2xl border border-white/10 cyber-shimmer" />
          ))}
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-14 glass-vice rounded-2xl border border-white/10 font-mono text-xs text-gray-400">
          NO FRAMES PINNED IN THIS CATEGORY YET. UPLOAD FROM THE ADMIN PANEL!
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {filteredPhotos.map((photo, idx) => (
            <LazyReveal
              key={photo.id}
              variant="zoom-in"
              delayMs={(idx % 3) * 70}
              className="break-inside-avoid"
            >
              <div
                onClick={() => {
                  sfx.playClick();
                  setLightboxPhoto(photo);
                }}
                className="group relative rounded-2xl overflow-hidden glass-vice border border-white/15 hover:border-[#00f0ff]/70 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_28px_rgba(0,240,255,0.3)] transition-all duration-300 cursor-pointer"
              >
                {/* Pin Image */}
                <div className={`relative w-full ${getAspectClass(photo.aspectRatio)} overflow-hidden`}>
                  <LazyImage
                    src={photo.imageUrl}
                    alt={photo.title}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    overlayClassName="bg-gradient-to-t from-[#0c0119] via-transparent to-black/30 opacity-80 group-hover:opacity-95 transition-opacity"
                  />

                  {/* Top Floating Badges (Pinterest Style) */}
                  <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 font-mono text-[10px] font-bold text-[#00f0ff] uppercase">
                      {photo.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleLike(e, photo)}
                        className={`px-2.5 py-1 rounded-full backdrop-blur-md border font-mono text-[11px] font-bold flex items-center gap-1 transition-all ${
                          likedIds[photo.id]
                            ? "bg-[#ff2a85] border-[#ff2a85] text-white shadow-[0_0_12px_#ff2a85]"
                            : "bg-black/70 border-white/20 text-white hover:bg-[#ff2a85]/80 hover:border-[#ff2a85]"
                        }`}
                        title="Save / Like Pin"
                      >
                        <Heart className={`w-3 h-3 ${likedIds[photo.id] ? "fill-white" : ""}`} />
                        <span>{photo.likes || 0}</span>
                      </button>

                      <span className="p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Bottom Pin Info */}
                  <div className="absolute bottom-0 left-0 right-0 z-30 p-4 space-y-1">
                    {photo.featured && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-amber-300 bg-amber-950/75 border border-amber-500/40 px-2 py-0.5 rounded-full mb-1">
                        <Sparkles className="w-2.5 h-2.5" /> FEATURED SHOT
                      </span>
                    )}
                    <h3 className="text-base font-black text-white tracking-wide leading-snug">
                      {photo.title}
                    </h3>
                    {photo.caption && (
                      <p className="text-xs text-gray-300 line-clamp-2 font-sans">
                        {photo.caption}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] font-mono text-gray-400">
                      {photo.location && (
                        <span className="flex items-center gap-1 text-[#ff85b8]">
                          <MapPin className="w-3 h-3" /> {photo.location}
                        </span>
                      )}
                      {photo.camera && (
                        <span className="flex items-center gap-1 text-cyan-300">
                          <Camera className="w-3 h-3" /> {photo.camera}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </LazyReveal>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full glass-vice border border-[#00f0ff]/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.3)] grid grid-cols-1 md:grid-cols-12"
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-3 right-3 z-40 p-2 rounded-full bg-black/75 border border-white/20 text-white hover:border-[#ff2a85] hover:text-[#ff2a85] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="md:col-span-7 bg-black flex items-center justify-center max-h-[75vh]">
              <img
                src={lightboxPhoto.imageUrl}
                alt={lightboxPhoto.title}
                className="w-full h-full object-contain max-h-[75vh]"
              />
            </div>

            <div className="md:col-span-5 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-[#ff2a85]/20 border border-[#ff2a85]/50 font-mono text-[10px] font-bold text-[#ff85b8] uppercase">
                  {lightboxPhoto.category}
                </span>
                <h3 className="text-2xl font-black text-white">{lightboxPhoto.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{lightboxPhoto.caption}</p>

                <div className="pt-3 border-t border-white/10 space-y-2 font-mono text-xs">
                  {lightboxPhoto.location && (
                    <div className="flex items-center gap-2 text-pink-300">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{lightboxPhoto.location}</span>
                    </div>
                  )}
                  {lightboxPhoto.camera && (
                    <div className="flex items-center gap-2 text-[#00f0ff]">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{lightboxPhoto.camera}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-[11px] text-gray-400">
                  PINNED: {lightboxPhoto.createdAt}
                </span>
                <button
                  onClick={(e) => handleLike(e, lightboxPhoto)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#7b00ff] text-white font-mono text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(255,42,133,0.5)] hover:brightness-110"
                >
                  <Heart className={`w-3.5 h-3.5 ${likedIds[lightboxPhoto.id] ? "fill-white" : ""}`} />
                  <span>LIKE ({lightboxPhoto.likes || 0})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
