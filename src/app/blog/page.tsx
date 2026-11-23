"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BlogPost } from "@/types/blog";
import { sfx } from "@/lib/soundFx";
import { 
  Search, 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  ArrowLeft, 
  Flame, 
  Video, 
  Newspaper, 
  Radio, 
  Sparkles,
  SlidersHorizontal
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Architecture",
  "Backend",
  "Frontend",
  "DevOps",
  "AI & ML",
  "GTA Dev Logs"
];

export default function BlogFeedPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchBlogs();
  }, [activeCategory]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const url = activeCategory === "All" 
        ? "/api/blog" 
        : `/api/blog?category=${encodeURIComponent(activeCategory)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.blogs) {
        setBlogs(data.blogs);
      }
    } catch (err) {
      console.error("Failed to fetch blog dispatches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (e: React.MouseEvent, post: BlogPost) => {
    e.preventDefault();
    e.stopPropagation();
    sfx.playClick();

    if (likedPosts[post.id]) return;

    setLikedPosts((prev) => ({ ...prev, [post.id]: true }));
    setBlogs((prev) =>
      prev.map((b) => (b.id === post.id ? { ...b, likes: b.likes + 1 } : b))
    );

    try {
      await fetch(`/api/blog/${post.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      });
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  // Filter client-side search query
  const filteredBlogs = blogs.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.excerpt.toLowerCase().includes(q) ||
      b.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const featuredPost = filteredBlogs.find((b) => b.featured) || filteredBlogs[0];
  const regularPosts = filteredBlogs.filter((b) => b.id !== featuredPost?.id);

  return (
    <div className="min-h-screen bg-[#0c0119] text-white selection:bg-[#ff2a85] selection:text-white font-sans pb-24">
      {/* Top Ticker Bar */}
      <div className="bg-black/90 border-b border-[#ff2a85]/40 py-2 px-4 overflow-hidden relative z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="bg-red-600 px-2 py-0.5 rounded text-[10px] font-black text-white uppercase tracking-wider">
              LIVE BROADCAST
            </span>
            <span className="text-[#00f0ff] font-bold hidden sm:inline">
              WEAZEL NEWS // VICE CITY UNDERGROUND DISPATCHES
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <span className="hidden md:inline text-[11px]">ENCRYPTION: 4096-BIT RSA ACTIVE</span>
            <Link
              href="/"
              onClick={() => sfx.playClick()}
              className="text-[#ff2a85] hover:text-white font-bold flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO PORTFOLIO</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
        
        {/* Banner Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-800 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] font-bold tracking-widest uppercase mb-1">
              <Radio className="w-4 h-4 text-[#ff2a85] animate-pulse" />
              <span>OFFICIAL OPERATIVE INTELLIGENCE LOGS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black italic tracking-tight text-white uppercase drop-shadow-[0_0_15px_#ff2a85]">
              LEONIDA <span className="text-[#00f0ff]">CHRONICLES</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl font-mono mt-1">
              Production engineering notes, high-concurrency microservices, WebGL shaders & career battle stories by Devesh Sharma.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-80 relative font-mono">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dispatches or tech..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-gray-700 focus:border-[#00f0ff] text-white text-xs outline-none transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)]"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar font-mono text-xs">
          <div className="text-gray-500 font-bold flex items-center gap-1 mr-2 text-[11px]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>TOPIC:</span>
          </div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sfx.playClick();
                setActiveCategory(cat);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-[#ff2a85] to-[#7b00ff] text-white border-pink-400 shadow-[0_0_15px_#ff2a85] scale-105"
                  : "bg-black/60 text-gray-400 border-gray-800 hover:border-gray-600 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-24 text-center font-mono space-y-3">
            <div className="w-10 h-10 border-4 border-[#00f0ff] border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-sm text-gray-400 tracking-wider">
              DECRYPTING CLASSIFIED WEAZEL FEEDS...
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBlogs.length === 0 && (
          <div className="py-24 text-center font-mono space-y-3 bg-[#140124]/60 p-8 rounded-3xl border border-gray-800">
            <Newspaper className="w-12 h-12 text-gray-600 mx-auto" />
            <div className="text-lg font-black text-white">NO TRANSMISSIONS FOUND</div>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No articles matched your search query. Try another keyword or switch category filter.
            </p>
          </div>
        )}

        {/* 1. FEATURED HERO ARTICLE */}
        {!loading && featuredPost && (
          <div className="mb-12">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold mb-3">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>TOP HEADLINE // HIGHEST CLEARANCE REPORT</span>
            </div>

            <Link
              href={`/blog/${featuredPost.slug}`}
              onClick={() => sfx.playBleep()}
              className="group block relative bg-[#140124]/90 rounded-3xl overflow-hidden border border-[#00f0ff]/50 hover:border-[#ff2a85] transition-all shadow-[0_0_35px_rgba(0,240,255,0.2)] hover:shadow-[0_0_40px_rgba(255,42,133,0.3)]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Media Image / Video Banner */}
                <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full min-h-[320px] overflow-hidden bg-black">
                  {featuredPost.coverImage ? (
                    <img
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#140124] to-[#ff2a85]/30 flex items-center justify-center">
                      <Newspaper className="w-20 h-20 text-[#00f0ff]/30" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#140124] via-transparent to-transparent lg:hidden" />

                  {/* Video Badge */}
                  {featuredPost.videoUrl && (
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#ff2a85] text-pink-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_#ff2a85]">
                      <Video className="w-3.5 h-3.5 text-[#ff2a85]" />
                      <span>MEDIA DISPATCH</span>
                    </div>
                  )}

                  {/* Category Pill */}
                  <div className="absolute bottom-4 left-4 bg-[#00f0ff] text-black font-mono font-black text-xs px-3 py-1 rounded-lg uppercase tracking-wider shadow-[0_0_15px_#00f0ff]">
                    {featuredPost.category}
                  </div>
                </div>

                {/* Content Pane */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        {featuredPost.publishedAt}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        {featuredPost.readingTime}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white group-hover:text-[#00f0ff] transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed line-clamp-4">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  {/* Tags & Action Bar */}
                  <div className="space-y-4 pt-2 border-t border-gray-800">
                    <div className="flex flex-wrap gap-1.5">
                      {featuredPost.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-black/60 border border-gray-700 text-[10px] font-mono text-gray-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between font-mono text-xs pt-1">
                      <div className="flex items-center gap-4 text-gray-400">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Eye className="w-3.5 h-3.5 text-[#00f0ff]" />
                          {featuredPost.views}
                        </span>

                        <button
                          onClick={(e) => handleLike(e, featuredPost)}
                          className={`flex items-center gap-1 text-[11px] hover:text-red-400 transition-colors ${
                            likedPosts[featuredPost.id] ? "text-red-500 font-bold" : ""
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${likedPosts[featuredPost.id] ? "fill-current" : ""}`} />
                          {featuredPost.likes}
                        </button>
                      </div>

                      <span className="text-[#ff2a85] font-black group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        READ INTEL →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* 2. REGULAR DISPATCHES GRID */}
        {!loading && regularPosts.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-black tracking-wider text-white uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00f0ff]" />
              <span>CLASSIFIED FIELD ARCHIVES</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  onClick={() => sfx.playBleep()}
                  className="group flex flex-col justify-between bg-[#140124]/80 rounded-2xl overflow-hidden border border-gray-800 hover:border-[#00f0ff] transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(0,240,255,0.2)]"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-black">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-purple-950/40 flex items-center justify-center">
                          <Newspaper className="w-12 h-12 text-gray-600" />
                        </div>
                      )}

                      {/* Video Indicator */}
                      {post.videoUrl && (
                        <div className="absolute top-3 left-3 bg-black/80 px-2 py-0.5 rounded-lg border border-[#ff2a85] text-pink-300 font-mono text-[10px] font-bold flex items-center gap-1">
                          <Video className="w-3 h-3 text-[#ff2a85]" />
                          <span>VIDEO</span>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#00f0ff]/50 text-[#00f0ff] font-mono text-[10px] font-black uppercase">
                        {post.category}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400">
                        <span>{post.publishedAt}</span>
                        <span>•</span>
                        <span>{post.readingTime}</span>
                      </div>

                      <h4 className="text-base font-black text-white group-hover:text-[#00f0ff] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h4>

                      <p className="text-xs text-gray-300 font-sans leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Footer & Likes */}
                  <div className="p-5 pt-0 space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-black/60 border border-gray-800 text-[10px] font-mono text-gray-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between font-mono text-xs pt-3 border-t border-gray-800">
                      <div className="flex items-center gap-3 text-gray-400">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Eye className="w-3.5 h-3.5 text-[#00f0ff]" />
                          {post.views}
                        </span>

                        <button
                          onClick={(e) => handleLike(e, post)}
                          className={`flex items-center gap-1 text-[11px] hover:text-red-400 transition-colors ${
                            likedPosts[post.id] ? "text-red-500 font-bold" : ""
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${likedPosts[post.id] ? "fill-current" : ""}`} />
                          {post.likes}
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#ff2a85] group-hover:translate-x-0.5 transition-transform">
                        READ →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
