"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BlogPost } from "@/types/blog";
import { sfx } from "@/lib/soundFx";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  Check, 
  Copy, 
  Video, 
  ShieldCheck
} from "lucide-react";
import confetti from "canvas-confetti";

export default function SingleBlogArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [liked, setLiked] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  const [readingProgress, setReadingProgress] = useState<number>(0);

  useEffect(() => {
    if (!slug) return;
    fetchArticle();
  }, [slug]);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(Math.min(Math.max(progress, 0), 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blog/${slug}`);
      const data = await res.json();
      if (data.blog) {
        setPost(data.blog);
      }
    } catch (err) {
      console.error("Failed to load article:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post || liked) return;
    sfx.playClick();
    setLiked(true);
    setPost((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : prev));

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#ff2a85", "#00f0ff"],
    });

    try {
      await fetch(`/api/blog/${post.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      });
    } catch (err) {
      console.error("Failed to like:", err);
    }
  };

  const handleShare = () => {
    sfx.playClick();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleCopyCode = (code: string, idx: number) => {
    sfx.playClick();
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Render video embed or HTML5 player
  const renderVideoPlayer = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const embedId = url.includes("v=")
        ? url.split("v=")[1]?.split("&")[0]
        : url.split("/").pop();
      return (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#ff2a85] shadow-[0_0_30px_rgba(255,42,133,0.3)] bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${embedId}`}
            title="Video Dispatch"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      );
    }

    return (
      <div className="relative rounded-2xl overflow-hidden border border-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.3)] bg-black">
        <video
          src={url}
          controls
          playsInline
          className="w-full max-h-[500px] object-contain mx-auto"
        />
      </div>
    );
  };

  // Content formatting renderer
  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    let codeBlockCount = 0;

    return parts.map((part, pIdx) => {
      // Code block
      if (part.startsWith("```") && part.endsWith("```")) {
        codeBlockCount++;
        const currentIdx = codeBlockCount;
        const lines = part.slice(3, -3).trim().split("\n");
        const language = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : "typescript";
        const codeContent = language === lines[0] ? lines.slice(1).join("\n") : lines.join("\n");

        return (
          <div key={pIdx} className="my-6 rounded-2xl overflow-hidden border border-gray-800 bg-black/90 font-mono shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900/90 border-b border-gray-800 text-xs">
              <span className="text-[#00f0ff] font-bold uppercase tracking-wider">{language}</span>
              <button
                onClick={() => handleCopyCode(codeContent, currentIdx)}
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
              >
                {copiedCodeIdx === currentIdx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs sm:text-sm text-gray-200 overflow-x-auto leading-relaxed">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // Normal text paragraphs / headings / lists
      return (
        <div key={pIdx} className="space-y-4">
          {part.split("\n\n").map((para, paraIdx) => {
            const trimmed = para.trim();
            if (!trimmed) return null;

            // Heading 2 (##)
            if (trimmed.startsWith("## ")) {
              return (
                <h2
                  key={paraIdx}
                  className="text-xl sm:text-2xl font-black text-white pt-6 pb-2 tracking-wide border-b border-gray-800 uppercase flex items-center gap-2"
                >
                  <span className="text-[#ff2a85]">#</span>
                  <span>{trimmed.replace("## ", "")}</span>
                </h2>
              );
            }

            // Heading 3 (###)
            if (trimmed.startsWith("### ")) {
              return (
                <h3
                  key={paraIdx}
                  className="text-lg sm:text-xl font-bold text-[#00f0ff] pt-4 pb-1 tracking-wide"
                >
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }

            // Blockquote (> )
            if (trimmed.startsWith("> ")) {
              return (
                <blockquote
                  key={paraIdx}
                  className="my-4 pl-4 border-l-4 border-[#ff2a85] bg-pink-950/20 py-2.5 pr-4 rounded-r-xl italic text-gray-300 text-sm"
                >
                  {trimmed.replace(/^>\s*/gm, "")}
                </blockquote>
              );
            }

            // Unordered list
            if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
              const listItems = trimmed.split("\n").map((li) => li.replace(/^[-*]\s*/, ""));
              return (
                <ul key={paraIdx} className="space-y-2 my-3 pl-4 list-disc list-inside text-gray-300 text-sm">
                  {listItems.map((li, liIdx) => (
                    <li key={liIdx} className="leading-relaxed">
                      {li}
                    </li>
                  ))}
                </ul>
              );
            }

            // Standard Paragraph
            return (
              <p key={paraIdx} className="text-gray-300 text-sm sm:text-base leading-relaxed font-sans">
                {trimmed}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0119] text-white selection:bg-[#ff2a85] selection:text-white font-sans pb-28">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/60 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#00f0ff] via-[#ff2a85] to-[#ffb700] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Top Navbar */}
      <div className="bg-black/90 border-b border-gray-800 py-3 px-4 sticky top-1 z-40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between font-mono text-xs">
          <Link
            href="/blog"
            onClick={() => sfx.playClick()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#00f0ff]" />
            <span>DISPATCH ARCHIVE</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-black/60 border border-gray-700 hover:border-[#00f0ff] text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
              title="Copy transmission link"
            >
              {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedShare ? "LINK COPIED" : "SHARE"}</span>
            </button>

            <Link
              href="/"
              onClick={() => sfx.playClick()}
              className="px-3 py-1.5 rounded-lg bg-[#ff2a85]/30 border border-[#ff2a85] text-pink-300 hover:text-white font-bold transition-all"
            >
              PORTFOLIO HUD
            </Link>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-32 text-center font-mono space-y-3">
          <div className="w-10 h-10 border-4 border-[#ff2a85] border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-sm text-gray-400 tracking-wider">
            DECRYPTING ARTICLE ENCRYPTION KEYS...
          </div>
        </div>
      )}

      {/* Not Found State */}
      {!loading && !post && (
        <div className="max-w-md mx-auto py-24 text-center font-mono space-y-4 px-4">
          <h2 className="text-3xl font-black text-red-500 uppercase">404 // DISPATCH REDACTED</h2>
          <p className="text-xs text-gray-400">
            This article either does not exist or has been wiped from the Weazel server archives.
          </p>
          <Link
            href="/blog"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#00f0ff] text-black font-black text-xs uppercase"
          >
            RETURN TO ARCHIVES
          </Link>
        </div>
      )}

      {/* Article Content */}
      {!loading && post && (
        <article className="max-w-3xl mx-auto px-4 pt-10 space-y-8">
          
          {/* Header Metadata */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              <span className="px-3 py-1 rounded-lg bg-[#00f0ff] text-black font-black uppercase tracking-wider shadow-[0_0_15px_#00f0ff]">
                {post.category}
              </span>
              <span className="text-gray-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                {post.publishedAt}
              </span>
              <span className="text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                {post.readingTime}
              </span>
              <span className="text-gray-400 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-gray-500" />
                {post.views} views
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-[0_0_20px_rgba(255,42,133,0.3)]">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-base sm:text-lg text-[#00f0ff] font-mono leading-relaxed">
                {post.subtitle}
              </p>
            )}

            {/* Author Byline */}
            <div className="flex items-center justify-between pt-4 pb-2 border-t border-gray-800 font-mono text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff2a85] to-[#00f0ff] p-0.5 shadow-[0_0_15px_#ff2a85]">
                  <img
                    src={post.author.avatar || "https://github.com/imdevesh21.png"}
                    alt={post.author.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <div className="text-white font-black tracking-wide flex items-center gap-1">
                    <span>{post.author.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00f0ff]" />
                  </div>
                  <div className="text-[10px] text-gray-400">{post.author.role}</div>
                </div>
              </div>

              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                  liked
                    ? "bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_15px_#ef4444]"
                    : "bg-black/60 border-gray-700 hover:border-red-400 text-gray-300 hover:text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                <span className="font-bold">{post.likes}</span>
              </button>
            </div>
          </div>

          {/* Video Player (If attached) */}
          {post.videoUrl && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-[#ff2a85] font-bold">
                <Video className="w-4 h-4" />
                <span>INTELLIGENCE BRIEFING VIDEO FEED</span>
              </div>
              {renderVideoPlayer(post.videoUrl)}
            </div>
          )}

          {/* Cover Image (If attached and no video, or below video) */}
          {post.coverImage && !post.videoUrl && (
            <div className="rounded-3xl overflow-hidden border border-[#ff2a85]/40 shadow-[0_0_30px_rgba(255,42,133,0.25)] bg-black">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full max-h-[480px] object-cover"
              />
            </div>
          )}

          {/* Body Content */}
          <div className="pt-2 text-gray-200">
            {renderFormattedContent(post.content)}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-gray-800 space-y-3 font-mono">
            <span className="text-xs text-gray-400 font-bold uppercase">CLASSIFIED DISPATCH TOPICS:</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-xl bg-black/80 border border-gray-700 text-xs text-[#00f0ff] font-bold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Dossier Box */}
          <div className="p-6 rounded-3xl bg-[#140124]/90 border border-[#00f0ff]/50 shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col sm:flex-row items-center gap-5 font-mono">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ff2a85] to-[#00f0ff] p-0.5 shrink-0 shadow-[0_0_20px_#ff2a85]">
              <img
                src={post.author.avatar || "https://github.com/imdevesh21.png"}
                alt={post.author.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1">
              <div className="text-white font-black text-base flex items-center justify-center sm:justify-start gap-1.5">
                <span>{post.author.name}</span>
                <span className="text-[10px] bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500 text-[#00f0ff]">
                  OPERATIVE 01
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Full-Stack Developer & Systems Architect specializing in Next.js, Distributed Backends, High-Performance Microservices, and Interactive 3D WebGL.
              </p>
              <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 text-xs text-[#ff2a85] font-bold">
                <Link href="/" className="hover:underline">View Portfolio →</Link>
                <Link href="/blog" className="hover:underline text-[#00f0ff]">All Dispatches →</Link>
              </div>
            </div>
          </div>

        </article>
      )}
    </div>
  );
}
