"use client";

import React, { useState, useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { PortfolioData, SkillWeapon, ExperienceItem, ProjectItem, CertificationItem, AnalyticsSummary, VisitorLog } from "@/types/portfolio";
import { BlogPost } from "@/types/blog";
import { sfx } from "@/lib/soundFx";
import Link from "next/link";
import { 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  CheckCircle2, 
  User, 
  Phone, 
  Crosshair, 
  Briefcase, 
  Sparkles, 
  Award, 
  BookOpen,
  Lock,
  Activity,
  BarChart3,
  Globe,
  Users,
  Calendar,
  Smartphone,
  Laptop,
  RefreshCw,
  FileSpreadsheet,
  Search,
  Newspaper,
  Video,
  Image as ImageIcon,
  Edit,
  Eye,
  Heart,
  ExternalLink
} from "lucide-react";
import confetti from "canvas-confetti";

export default function AdminPage() {
  const { data: initialData, saveData, resetToDefault } = usePortfolio();
  const [formData, setFormData] = useState<PortfolioData>(initialData);
  const [activeSection, setActiveSection] = useState<string>("profile");
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Security PIN Authentication State
  const MASTER_PIN = "12487766";
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [shakeLock, setShakeLock] = useState<boolean>(false);

  // Analytics & Visitor Telemetry State
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-11");
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState<boolean>(false);
  const [logSearchQuery, setLogSearchQuery] = useState<string>("");
  const [hoveredDay, setHoveredDay] = useState<{ day: string; date: string; count: number } | null>(null);

  const fetchAnalytics = async (monthToFetch?: string) => {
    setIsLoadingAnalytics(true);
    try {
      const m = monthToFetch || selectedMonth;
      const res = await fetch(`/api/analytics?month=${m}`);
      if (res.ok) {
        const json = await res.json();
        if (json.summary) {
          setAnalytics(json.summary);
        }
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics(selectedMonth);
    }
  }, [isAuthenticated, selectedMonth]);

  // Blog CMS States
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isEditingBlog, setIsEditingBlog] = useState<boolean>(false);
  const [selectedBlog, setSelectedBlog] = useState<Partial<BlogPost>>({
    title: "",
    subtitle: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    videoUrl: "",
    category: "Architecture",
    tags: ["Next.js", "Full-Stack"],
    status: "published",
    featured: false,
    readingTime: "5 min read",
  });
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);
  const [mediaUploadType, setMediaUploadType] = useState<string>("");
  const [blogSearchQuery, setBlogSearchQuery] = useState<string>("");
  const [isSavingBlog, setIsSavingBlog] = useState<boolean>(false);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blog");
      if (res.ok) {
        const json = await res.json();
        if (json.blogs) {
          setBlogs(json.blogs);
        }
      }
    } catch (err) {
      console.error("Failed to load blogs:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBlogs();
    }
  }, [isAuthenticated]);

  const handleMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: "coverImage" | "videoUrl"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sfx.playClick();
    setIsUploadingMedia(true);
    setMediaUploadType(targetField === "videoUrl" ? "video" : "image");

    try {
      const formPayload = new FormData();
      formPayload.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formPayload,
      });

      const data = await res.json();
      if (data.url) {
        setSelectedBlog((prev) => ({ ...prev, [targetField]: data.url }));
        sfx.playArcadePickup();
        setSaveStatus(`Media uploaded successfully: ${data.fileName}`);
        setTimeout(() => setSaveStatus(""), 3500);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload media file to server");
    } finally {
      setIsUploadingMedia(false);
      setMediaUploadType("");
      e.target.value = "";
    }
  };

  const handleSaveBlog = async () => {
    if (!selectedBlog.title || !selectedBlog.excerpt) {
      alert("Please provide at least a title and an excerpt for the dispatch.");
      return;
    }

    sfx.playClick();
    setIsSavingBlog(true);

    try {
      const payload = {
        ...selectedBlog,
        author: {
          name: selectedBlog.author?.name || formData.profile.name || "Devesh Sharma",
          role: selectedBlog.author?.role || formData.profile.title || "Lead Systems Architect & Full-Stack Operative",
          avatar: selectedBlog.author?.avatar || formData.profile.avatarUrl || "https://github.com/imdevesh21.png",
        },
      };

      const method = selectedBlog.id ? "PUT" : "POST";
      const res = await fetch("/api/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        sfx.playMissionPassed();
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        setSaveStatus(
          selectedBlog.id
            ? "DISPATCH UPDATED SUCCESSFULLY"
            : "NEW DISPATCH PUBLISHED TO WEAZEL ARCHIVES"
        );
        setTimeout(() => setSaveStatus(""), 4000);
        setIsEditingBlog(false);
        fetchBlogs();
      } else {
        alert(data.error || "Failed to save blog");
      }
    } catch (err) {
      console.error("Save blog error:", err);
      alert("Network error while saving dispatch");
    } finally {
      setIsSavingBlog(false);
    }
  };

  const handleDeleteBlog = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete dispatch: "${title}"?`)) return;
    sfx.playWeapon();

    try {
      const res = await fetch(`/api/blog?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        setSaveStatus(`Dispatch "${title}" deleted from archives.`);
        setTimeout(() => setSaveStatus(""), 3000);
      } else {
        alert(data.error || "Failed to delete dispatch");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const exportLogsCsv = () => {
    if (!analytics || !analytics.recentLogs || analytics.recentLogs.length === 0) return;
    sfx.playClick();
    const headers = ["Timestamp", "Date", "Time", "Country", "City", "Device", "OS", "Browser", "Referrer", "Visitor_ID", "Status"];
    const rows = analytics.recentLogs.map((l: VisitorLog) => [
      new Date(l.timestamp).toISOString(),
      l.date,
      l.time,
      l.country,
      l.city,
      l.device,
      l.os,
      l.browser,
      l.referrer,
      l.visitorId,
      l.isNew ? "New Visitor" : "Returning Operative"
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Leonida_Visitor_Logs_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Sync with initialData once loaded and check session auth
  useEffect(() => {
    try {
      const auth = sessionStorage.getItem("gta6_admin_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    } catch {}
    setIsCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (initialData && initialData.profile) {
      setFormData(initialData);
    }
  }, [initialData]);

  const verifyPin = (pinToTest: string) => {
    if (pinToTest === MASTER_PIN) {
      sfx.playMissionPassed();
      try {
        sessionStorage.setItem("gta6_admin_auth", "true");
        sessionStorage.setItem("gta6_admin_pin", MASTER_PIN);
      } catch {}
      setIsAuthenticated(true);
      setPinError("");
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch {}
    } else {
      sfx.playWasted();
      setPinError("🚨 ACCESS DENIED: INVALID CLEARANCE PIN. FIB SURVEILLANCE ACTIVE.");
      setShakeLock(true);
      setTimeout(() => setShakeLock(false), 600);
      setEnteredPin("");
    }
  };

  const handleKeypadPress = (val: string) => {
    sfx.playClick();
    if (val === "CLEAR") {
      setEnteredPin("");
      setPinError("");
      return;
    }
    if (enteredPin.length < 8) {
      const next = enteredPin + val;
      setEnteredPin(next);
      if (next.length === 8) {
        verifyPin(next);
      }
    }
  };

  const handlePinFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPin(enteredPin);
  };

  const handleLockVault = () => {
    sfx.playBleep();
    try {
      sessionStorage.removeItem("gta6_admin_auth");
      sessionStorage.removeItem("gta6_admin_pin");
    } catch {}
    setIsAuthenticated(false);
    setEnteredPin("");
    setPinError("");
  };

  // Handle Save
  const handleSave = async () => {
    setIsSaving(true);
    sfx.playWeapon();
    const res = await saveData(formData);
    setIsSaving(false);
    if (res.success) {
      setSaveStatus("DATABASE SYNCHRONIZED SUCCESSFULLY!");
      sfx.playMissionPassed();
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch {}
      setTimeout(() => setSaveStatus(""), 4000);
    } else {
      setSaveStatus("FAILED TO WRITE DATABASE");
      setTimeout(() => setSaveStatus(""), 4000);
    }
  };

  // Handle Reset to Default
  const handleReset = async () => {
    if (confirm("Reset all portfolio fields to default resume values?")) {
      sfx.playBleep();
      await resetToDefault();
      setSaveStatus("RESET TO ORIGINAL DEFAULTS!");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  // Export JSON
  const handleExportJson = () => {
    sfx.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "portfolioData.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.profile && parsed.skills) {
            setFormData(parsed);
            sfx.playMissionPassed();
            setSaveStatus("CUSTOM JSON IMPORTED! CLICK SAVE TO PERSIST.");
          } else {
            alert("Invalid portfolio JSON schema.");
          }
        } catch {
          alert("Error parsing JSON file.");
        }
      };
    }
  };

  // Helper updates for Profile
  const updateProfile = (field: string, val: unknown) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: val,
      },
    }));
  };

  const updateContact = (field: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        contact: {
          ...prev.profile.contact,
          [field]: val,
        },
      },
    }));
  };

  const updateEducation = (field: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        education: {
          ...prev.profile.education,
          [field]: val,
        },
      },
    }));
  };

  const updateVitals = (field: string, val: unknown) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        vitals: {
          ...prev.profile.vitals,
          [field]: val,
        },
      },
    }));
  };

  // Profile Avatar Upload Handler
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sfx.playClick();
    setIsUploadingAvatar(true);

    try {
      const formPayload = new FormData();
      formPayload.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formPayload,
      });

      const data = await res.json();
      if (data.url) {
        updateProfile("avatarUrl", data.url);
        sfx.playArcadePickup();
        setSaveStatus(`Profile avatar updated: ${data.fileName}`);
        setTimeout(() => setSaveStatus(""), 3500);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
      alert("Failed to upload avatar image");
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

  // Helpers for Skills
  const updateSkill = (index: number, field: keyof SkillWeapon, val: unknown) => {
    const updated = [...formData.skills];
    updated[index] = { ...updated[index], [field]: val };
    setFormData((prev) => ({ ...prev, skills: updated }));
  };

  const addSkill = () => {
    sfx.playClick();
    const newSkill: SkillWeapon = {
      id: "skill-" + Date.now(),
      name: "NEW TECH SKILL",
      weaponClass: "Custom Firearm // High Impact",
      icon: "⚡",
      category: "frontend",
      description: "Description of capabilities and architecture.",
      fireRate: 90,
      damage: 90,
      accuracy: 95,
      battleground: "Production Deployment",
    };
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
  };

  const deleteSkill = (index: number) => {
    sfx.playWeapon();
    const updated = formData.skills.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, skills: updated }));
  };

  // Helpers for Experience / Heists
  const updateExperience = (index: number, field: keyof ExperienceItem, val: unknown) => {
    const updated = [...formData.experiences];
    updated[index] = { ...updated[index], [field]: val };
    setFormData((prev) => ({ ...prev, experiences: updated }));
  };

  const addExperience = () => {
    sfx.playClick();
    const newExp: ExperienceItem = {
      id: "exp-" + Date.now(),
      role: "Software Engineer",
      company: "Company Name",
      location: "City, Country",
      period: "2026 – Present",
      status: "IN PROGRESS",
      missionTitle: "HEIST: NEW OPERATION",
      briefing: "Mission briefing details...",
      achievements: ["Shipped core services with zero downtime", "Optimized performance by 30%"],
      keyMetric: "Key impact metric here",
      techStack: ["Next.js", "TypeScript", "SQL"],
    };
    setFormData((prev) => ({ ...prev, experiences: [...prev.experiences, newExp] }));
  };

  const deleteExperience = (index: number) => {
    sfx.playWeapon();
    const updated = formData.experiences.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, experiences: updated }));
  };

  // Helpers for Projects
  const updateProject = (index: number, field: keyof ProjectItem, val: unknown) => {
    const updated = [...formData.projects];
    updated[index] = { ...updated[index], [field]: val };
    setFormData((prev) => ({ ...prev, projects: updated }));
  };

  const addProject = () => {
    sfx.playClick();
    const newProj: ProjectItem = {
      id: "proj-" + Date.now(),
      title: "New Project Title",
      codename: "OPERATION CODENAME",
      type: "Full Stack Application",
      bounty: "$500,000",
      description: "Comprehensive summary of the project architecture.",
      impactHighlight: "Measured 50% performance improvement",
      details: ["Feature point 1", "Feature point 2"],
      techStack: ["React", "TypeScript", "Node.js"],
      githubUrl: "https://github.com/imdevesh21",
      liveUrl: "https://deveshportfolio.vercel.app",
    };
    setFormData((prev) => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const deleteProject = (index: number) => {
    sfx.playWeapon();
    const updated = formData.projects.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, projects: updated }));
  };

  // Helpers for Certifications
  const updateCert = (index: number, field: keyof CertificationItem, val: unknown) => {
    const updated = [...formData.certifications];
    updated[index] = { ...updated[index], [field]: val };
    setFormData((prev) => ({ ...prev, certifications: updated }));
  };

  const addCert = () => {
    sfx.playClick();
    const newCert: CertificationItem = {
      id: "cert-" + Date.now(),
      title: "New Certification Name",
      issuer: "Issuing Organization",
      status: "VERIFIED BADGE",
      icon: "🏆",
      description: "Description of topics covered and verified badge status.",
    };
    setFormData((prev) => ({ ...prev, certifications: [...prev.certifications, newCert] }));
  };

  const deleteCert = (index: number) => {
    sfx.playWeapon();
    const updated = formData.certifications.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, certifications: updated }));
  };

  // Coursework helpers
  const [newCourseInput, setNewCourseInput] = useState("");
  const addCoursework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseInput.trim()) return;
    sfx.playClick();
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        coursework: [...(prev.profile.coursework || []), newCourseInput.trim()],
      },
    }));
    setNewCourseInput("");
  };

  const removeCoursework = (idx: number) => {
    sfx.playClick();
    const updated = formData.profile.coursework.filter((_, i) => i !== idx);
    setFormData((prev) => ({
      ...prev,
      profile: { ...prev.profile, coursework: updated },
    }));
  };

  // 1. Loading State while checking session auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0014] text-white flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#ff2a85] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#00f0ff] tracking-widest uppercase">INITIALIZING FIB CYBERVAULT...</span>
        </div>
      </div>
    );
  }

  // 2. High-Security FIB Keypad Lock Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0014] text-white font-mono flex items-center justify-center p-4 relative overflow-hidden selection:bg-[#ff2a85]">
        {/* Background Cyber Grid */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#ff2a85 1px, transparent 1px), radial-gradient(#00f0ff 1px, #0a0014 1px)",
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0, 20px 20px",
          }}
        />

        {/* Ambient Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Main Vault Terminal Card */}
        <div className={`relative w-full max-w-md bg-[#120124]/95 border-2 ${shakeLock ? "border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.8)]" : "border-[#ff2a85]/70 shadow-[0_0_50px_rgba(255,42,133,0.35)]"} rounded-3xl p-6 md:p-8 backdrop-blur-xl transition-all duration-200`}>
          
          {/* Header Badge */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/70 border border-red-500/50 text-[11px] text-red-400 font-bold tracking-widest uppercase">
              <ShieldAlert className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>FIB SECURITY PROTOCOL v6.2</span>
            </div>

            <h1 className="text-xl md:text-2xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_10px_#ff2a85]">
              LEONIDA CYBER VAULT
            </h1>
            <p className="text-xs text-gray-400 tracking-wide font-sans">
              Dynamic Portfolio Database Access Restricted
            </p>
          </div>

          {/* Masked PIN Display */}
          <div className="mb-6 space-y-2">
            <div className="text-[10px] text-gray-400 text-center tracking-wider uppercase font-bold">
              ENTER 8-DIGIT CLEARANCE PIN
            </div>

            <div className="flex items-center justify-center gap-2 py-3 px-4 bg-black/80 rounded-2xl border border-gray-700 shadow-inner">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
                const isFilled = idx < enteredPin.length;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border transition-all duration-150 ${
                      isFilled
                        ? "bg-[#00f0ff] border-[#00f0ff] shadow-[0_0_10px_#00f0ff] scale-110"
                        : "bg-gray-900 border-gray-700"
                    }`}
                  />
                );
              })}
            </div>

            {/* Error Message */}
            {pinError && (
              <div className="text-center text-xs text-red-400 font-bold bg-red-950/80 p-2.5 rounded-xl border border-red-500/50 animate-pulse">
                {pinError}
              </div>
            )}
          </div>

          {/* Numeric Keypad Grid */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLEAR", "0", "UNLOCK"].map((btn) => {
              return (
                <button
                  key={btn}
                  type="button"
                  onClick={() => {
                    if (btn === "UNLOCK") {
                      verifyPin(enteredPin);
                    } else {
                      handleKeypadPress(btn);
                    }
                  }}
                  className={`h-11 rounded-xl font-mono font-bold text-sm transition-all active:scale-95 flex items-center justify-center ${
                    btn === "CLEAR"
                      ? "bg-red-950/60 border border-red-500/50 text-red-300 hover:bg-red-900/60"
                      : btn === "UNLOCK"
                      ? "bg-gradient-to-r from-[#00f0ff] to-[#00b4d8] text-black font-black hover:opacity-90 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                      : "bg-[#1d0333]/90 border border-purple-500/30 text-white hover:border-[#00f0ff] hover:text-[#00f0ff] hover:bg-[#250442]"
                  }`}
                >
                  {btn === "CLEAR" ? "CLR" : btn === "UNLOCK" ? <Lock className="w-4 h-4" /> : btn}
                </button>
              );
            })}
          </div>

          {/* Direct Keyboard Form Input */}
          <form onSubmit={handlePinFormSubmit} className="mb-4">
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              value={enteredPin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setEnteredPin(val);
                if (val.length === 8) verifyPin(val);
              }}
              placeholder="Or type PIN on keyboard..."
              className="w-full text-center bg-black/50 border border-gray-700 focus:border-[#ff2a85] rounded-xl py-2 px-3 text-sm text-[#00f0ff] font-mono tracking-widest placeholder:text-gray-600 focus:outline-none"
            />
          </form>

          {/* Back to Public Portfolio Link */}
          <div className="text-center pt-2 border-t border-gray-800">
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-[#00f0ff] font-sans flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Dossier</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  const p = formData.profile;

  return (
    <div className="min-h-screen bg-[#0a0014] text-white font-sans selection:bg-[#ff2a85] pb-24">
      
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#120124]/95 border-b border-[#ff2a85]/40 backdrop-blur-md px-4 py-3 shadow-[0_4px_25px_rgba(255,42,133,0.3)]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-black/60 border border-gray-700 hover:border-[#00f0ff] text-gray-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono"
            >
              <ArrowLeft className="w-4 h-4 text-[#00f0ff]" />
              <span className="hidden sm:inline">Back to Portfolio</span>
            </Link>

            <div>
              <div className="text-[10px] font-mono text-[#ff2a85] font-bold tracking-widest flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#ff2a85]" />
                <span>LEONIDA STATE DATABASE // ADMIN TERMINAL</span>
              </div>
              <h1 className="text-lg font-black tracking-wider text-white">
                DYNAMIC PORTFOLIO CONTROL CENTER
              </h1>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded-lg bg-black/60 border border-gray-700 hover:border-[#00f0ff] text-gray-300 hover:text-white flex items-center gap-1.5 transition-all"
              title="Download portfolioData.json backup"
            >
              <Download className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span className="hidden md:inline">Export JSON</span>
            </button>

            <label className="px-3 py-1.5 rounded-lg bg-black/60 border border-gray-700 hover:border-amber-400 text-gray-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-black/60 border border-gray-700 hover:border-red-400 text-gray-400 hover:text-red-300 flex items-center gap-1.5 transition-all"
              title="Reset all fields to original defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#7b00ff] text-white font-bold tracking-wider shadow-[0_0_20px_#ff2a85] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "SAVING..." : "SAVE ALL CHANGES"}</span>
            </button>

            <button
              onClick={handleLockVault}
              className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/50 hover:bg-red-900 text-red-300 hover:text-white flex items-center gap-1.5 transition-all"
              title="Lock admin vault and logout"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden md:inline">Lock Vault</span>
            </button>
          </div>

        </div>

        {/* Save Status Notification Banner */}
        {saveStatus && (
          <div className="mt-2 text-center py-1.5 bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-mono text-xs font-bold rounded-lg animate-pulse flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{saveStatus}</span>
          </div>
        )}
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-2 font-mono text-xs">
          <div className="p-3 bg-[#140124] rounded-2xl border border-gray-800 space-y-1">
            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider px-2 py-1">
              CONTROL MODULES
            </div>
            
            <button
              onClick={() => setActiveSection("profile")}
              className={`w-full px-3 py-2.5 rounded-xl font-bold flex items-center gap-2.5 transition-all ${
                activeSection === "profile"
                  ? "bg-[#ff2a85] text-white shadow-[0_0_15px_#ff2a85]"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Operative Profile</span>
            </button>

            <button
              onClick={() => setActiveSection("contact")}
              className={`w-full px-3 py-2.5 rounded-xl font-bold flex items-center gap-2.5 transition-all ${
                activeSection === "contact"
                  ? "bg-[#00f0ff] text-black shadow-[0_0_15px_#00f0ff]"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Contact & Socials</span>
            </button>

            <button
              onClick={() => setActiveSection("skills")}
              className={`w-full px-3 py-2.5 rounded-xl font-bold flex items-center gap-2.5 transition-all ${
                activeSection === "skills"
                  ? "bg-[#ff2a85] text-white shadow-[0_0_15px_#ff2a85]"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Crosshair className="w-4 h-4" />
              <span>Arsenal / Weapons ({formData.skills.length})</span>
            </button>

            <button
              onClick={() => setActiveSection("heists")}
              className={`w-full px-3 py-2.5 rounded-xl font-bold flex items-center gap-2.5 transition-all ${
                activeSection === "heists"
                  ? "bg-[#00f0ff] text-black shadow-[0_0_15px_#00f0ff]"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Campaign Heists ({formData.experiences.length})</span>
            </button>

            <button
              onClick={() => setActiveSection("projects")}
              className={`w-full px-3 py-2.5 rounded-xl font-bold flex items-center gap-2.5 transition-all ${
                activeSection === "projects"
                  ? "bg-[#ffb700] text-black shadow-[0_0_15px_#ffb700]"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Bounty Contracts ({formData.projects.length})</span>
            </button>

            <button
              onClick={() => setActiveSection("certifications")}
              className={`w-full px-3 py-2.5 rounded-xl font-bold flex items-center gap-2.5 transition-all ${
                activeSection === "certifications"
                  ? "bg-[#7b00ff] text-white shadow-[0_0_15px_#7b00ff]"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Street Cred & Certs ({formData.certifications.length})</span>
            </button>

            <button
              onClick={() => setActiveSection("coursework")}
              className={`w-full px-3 py-2.5 rounded-xl font-bold flex items-center gap-2.5 transition-all ${
                activeSection === "coursework"
                  ? "bg-[#ff2a85] text-white shadow-[0_0_15px_#ff2a85]"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Coursework Tags ({formData.profile.coursework ? formData.profile.coursework.length : 0})</span>
            </button>

            {/* Surveillance Radar / Visitor Telemetry */}
            <div className="pt-2 border-t border-gray-800">
              <button
                onClick={() => {
                  setActiveSection("surveillance");
                  sfx.playClick();
                }}
                className={`w-full px-3 py-2.5 rounded-xl font-bold flex items-center justify-between gap-2 transition-all ${
                  activeSection === "surveillance"
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-[1.02]"
                    : "bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-pulse text-emerald-400" />
                  <span>Visitor Radar Log</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/60 font-mono text-emerald-300 border border-emerald-500/30">
                  {analytics ? `${analytics.totalVisits} LOGS` : "LIVE"}
                </span>
              </button>
            </div>

            {/* Weazel News / Blog CMS */}
            <div className="pt-2 border-t border-gray-800">
              <button
                onClick={() => {
                  setActiveSection("blog");
                  setIsEditingBlog(false);
                  sfx.playClick();
                }}
                className={`w-full px-3 py-2.5 rounded-xl font-bold flex items-center justify-between gap-2 transition-all ${
                  activeSection === "blog"
                    ? "bg-gradient-to-r from-[#ff2a85] to-[#7b00ff] text-white shadow-[0_0_20px_#ff2a85] scale-[1.02]"
                    : "bg-purple-950/40 border border-purple-500/40 text-purple-300 hover:bg-purple-900/50 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-pink-400" />
                  <span>Weazel News (Blog CMS)</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/60 font-mono text-pink-300 border border-pink-500/30">
                  {blogs.length} POSTS
                </span>
              </button>
            </div>
          </div>

          {/* Quick Summary Pill */}
          <div className="p-4 bg-black/60 rounded-2xl border border-gray-800 text-gray-400 space-y-1">
            <div className="text-[10px] font-bold text-[#ff2a85]">LEONIDA SECURITY PROTOCOL:</div>
            <p className="text-[11px] leading-relaxed">
              Edits made here are saved directly to <code className="text-[#00f0ff]">portfolioData.json</code> on the server & synced to browser storage.
            </p>
          </div>
        </aside>

        {/* Editor Main Content Area */}
        <main className="lg:col-span-3">
          
          {/* TAB 1: OPERATIVE PROFILE */}
          {activeSection === "profile" && (
            <div className="bg-[#140124] border border-[#ff2a85]/50 p-6 rounded-2xl space-y-6 shadow-xl animate-fadeIn">
              <div className="border-b border-gray-800 pb-3">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-[#ff2a85]" />
                  <span>OPERATIVE DOSSIER & PROFILE SETTINGS</span>
                </h2>
                <p className="text-xs font-mono text-gray-400 mt-0.5">
                  Customize the core identity, summary, education, and vitals readouts.
                </p>
              </div>

              {/* AVATAR & MUGSHOT MANAGEMENT */}
              <div className="p-4 rounded-xl bg-black/60 border border-purple-900/60 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-full border-2 border-[#00f0ff] p-1 shadow-[0_0_20px_#00f0ff] bg-gradient-to-br from-purple-900 via-pink-900 to-amber-900 flex items-center justify-center overflow-hidden">
                    {p.avatarUrl ? (
                      <img
                        src={p.avatarUrl}
                        alt={p.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-3xl">🕶️</span>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center text-[10px]">
                    ⚡
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-xs font-mono w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[#00f0ff] font-bold">OPERATIVE MUGSHOT / AVATAR:</span>
                    <span className="text-[10px] text-gray-500">Live across HUD Dossier, Phone & Weazel Blog</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Avatar Image URL (or upload image below)..."
                      value={p.avatarUrl || ""}
                      onChange={(e) => updateProfile("avatarUrl", e.target.value)}
                      className="flex-1 bg-black/90 border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00f0ff] text-xs font-mono"
                    />

                    <label className="px-3 py-2 rounded-xl bg-[#ff2a85] hover:bg-[#ff2a85]/80 text-white font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(255,42,133,0.4)] shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingAvatar ? "UPLOADING..." : "UPLOAD PHOTO"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isUploadingAvatar}
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        updateProfile("avatarUrl", "https://github.com/imdevesh21.png");
                        sfx.playClick();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 hover:text-white text-[11px] flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3 text-[#00f0ff]" />
                      <span>Use GitHub Photo (imdevesh21)</span>
                    </button>

                    {p.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          updateProfile("avatarUrl", "");
                          sfx.playClick();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-red-300 text-[11px] flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Reset to Default Icon</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="text-gray-400 block mb-1">OPERATIVE NAME:</label>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => updateProfile("name", e.target.value)}
                    className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ff2a85]"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">CODENAME / ALIAS:</label>
                  <input
                    type="text"
                    value={p.codename}
                    onChange={(e) => updateProfile("codename", e.target.value)}
                    className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ff2a85]"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">PROFESSIONAL TITLE:</label>
                  <input
                    type="text"
                    value={p.title}
                    onChange={(e) => updateProfile("title", e.target.value)}
                    className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ff2a85]"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">BOUNTY / VALUE ESTIMATE:</label>
                  <input
                    type="text"
                    value={p.bounty}
                    onChange={(e) => updateProfile("bounty", e.target.value)}
                    className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-2 text-emerald-400 font-bold outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">BASE LOCATION:</label>
                  <input
                    type="text"
                    value={p.location}
                    onChange={(e) => updateProfile("location", e.target.value)}
                    className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ff2a85]"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">GPS COORDINATES:</label>
                  <input
                    type="text"
                    value={p.coordinates}
                    onChange={(e) => updateProfile("coordinates", e.target.value)}
                    className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-2 text-[#00f0ff] outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>

              {/* Summary Bio */}
              <div className="text-xs font-mono">
                <label className="text-gray-400 block mb-1">EXECUTIVE PROFILE SUMMARY:</label>
                <textarea
                  rows={4}
                  value={p.summary}
                  onChange={(e) => updateProfile("summary", e.target.value)}
                  className="w-full bg-black/70 border border-gray-800 rounded-xl p-3 text-gray-200 outline-none focus:border-[#ff2a85] leading-relaxed"
                />
              </div>

              {/* Education Block */}
              <div className="border-t border-gray-800 pt-4 space-y-3 font-mono text-xs">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#00f0ff]" />
                  <span>ACADEMIC BACKGROUND</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">INSTITUTION / UNIVERSITY:</label>
                    <input
                      type="text"
                      value={p.education.institution}
                      onChange={(e) => updateEducation("institution", e.target.value)}
                      className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00f0ff]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">DEGREE PROGRAM:</label>
                    <input
                      type="text"
                      value={p.education.degree}
                      onChange={(e) => updateEducation("degree", e.target.value)}
                      className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00f0ff]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">TIME PERIOD (e.g. Dec 2020 – Jun 2023):</label>
                    <input
                      type="text"
                      value={p.education.period}
                      onChange={(e) => updateEducation("period", e.target.value)}
                      className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00f0ff]"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">CGPA / GRADE:</label>
                    <input
                      type="text"
                      value={p.education.cgpa}
                      onChange={(e) => updateEducation("cgpa", e.target.value)}
                      className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-2 text-amber-400 font-bold outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Vitals Sliders */}
              <div className="border-t border-gray-800 pt-4 space-y-3 font-mono text-xs">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  <span>OPERATIVE VITALS READOUT</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-black/60 rounded-xl border border-gray-800 space-y-2">
                    <label className="text-emerald-400 block font-bold">
                      HEALTH BAR (UI/UX VELOCITY): {p.vitals.healthVal}%
                    </label>
                    <input
                      type="range"
                      min={50}
                      max={100}
                      value={p.vitals.healthVal}
                      onChange={(e) => updateVitals("healthVal", Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div className="p-3 bg-black/60 rounded-xl border border-gray-800 space-y-2">
                    <label className="text-cyan-400 block font-bold">
                      ARMOR BAR (BACKEND SECURITY): {p.vitals.armorVal}%
                    </label>
                    <input
                      type="range"
                      min={50}
                      max={100}
                      value={p.vitals.armorVal}
                      onChange={(e) => updateVitals("armorVal", Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT & SOCIALS */}
          {activeSection === "contact" && (
            <div className="bg-[#140124] border border-[#00f0ff]/50 p-6 rounded-2xl space-y-6 shadow-xl animate-fadeIn">
              <div className="border-b border-gray-800 pb-3">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#00f0ff]" />
                  <span>COMMUNICATIONS & NETWORKING LINKS</span>
                </h2>
                <p className="text-xs font-mono text-gray-400 mt-0.5">
                  Update phone, email, and social networks linked in the iFruit Smartphone and Executive view.
                </p>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-gray-400 block mb-1">PHONE NUMBER (WITH COUNTRY CODE):</label>
                  <input
                    type="text"
                    value={p.contact.phone}
                    onChange={(e) => updateContact("phone", e.target.value)}
                    className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00f0ff]"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">EMAIL ADDRESS:</label>
                  <input
                    type="email"
                    value={p.contact.email}
                    onChange={(e) => updateContact("email", e.target.value)}
                    className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00f0ff]"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">LINKEDIN URL:</label>
                  <input
                    type="text"
                    value={p.contact.linkedin}
                    onChange={(e) => updateContact("linkedin", e.target.value)}
                    className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00f0ff]"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">GITHUB URL:</label>
                  <input
                    type="text"
                    value={p.contact.github}
                    onChange={(e) => updateContact("github", e.target.value)}
                    className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00f0ff]"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">LIVE PORTFOLIO URL:</label>
                  <input
                    type="text"
                    value={p.contact.portfolio}
                    onChange={(e) => updateContact("portfolio", e.target.value)}
                    className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ARSENAL / WEAPONS (SKILLS) */}
          {activeSection === "skills" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between bg-[#140124] border border-[#ff2a85]/40 p-4 rounded-2xl">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Crosshair className="w-5 h-5 text-[#ff2a85]" />
                    <span>AMMU-NATION WEAPONS & SKILLS</span>
                  </h2>
                  <p className="text-xs font-mono text-gray-400">
                    Add, edit, or adjust combat telemetry stats for technical weapons.
                  </p>
                </div>

                <button
                  onClick={addSkill}
                  className="px-3.5 py-2 rounded-xl bg-[#ff2a85] hover:bg-pink-600 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_#ff2a85] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD WEAPON</span>
                </button>
              </div>

              {/* Weapons List */}
              <div className="space-y-4">
                {formData.skills.map((skill, idx) => (
                  <div
                    key={skill.id || idx}
                    className="p-5 bg-[#140124] border border-gray-800 hover:border-[#ff2a85]/50 rounded-2xl space-y-4 relative"
                  >
                    <button
                      onClick={() => deleteSkill(idx)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900 border border-red-500/40 text-red-400 hover:text-white transition-colors"
                      title="Delete Weapon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                      <div>
                        <label className="text-gray-400 block mb-1">ICON (EMOJI):</label>
                        <input
                          type="text"
                          value={skill.icon}
                          onChange={(e) => updateSkill(idx, "icon", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-gray-400 block mb-1">SKILL / WEAPON NAME:</label>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateSkill(idx, "name", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-white font-bold"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-gray-400 block mb-1">WEAPON CLASSIFICATION:</label>
                        <input
                          type="text"
                          value={skill.weaponClass}
                          onChange={(e) => updateSkill(idx, "weaponClass", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-pink-300"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 block mb-1">BATTLEGROUND / CONTEXT:</label>
                        <input
                          type="text"
                          value={skill.battleground}
                          onChange={(e) => updateSkill(idx, "battleground", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-amber-300"
                        />
                      </div>
                    </div>

                    <div className="text-xs font-mono">
                      <label className="text-gray-400 block mb-1">TACTICAL BRIEFING / DESCRIPTION:</label>
                      <textarea
                        rows={2}
                        value={skill.description}
                        onChange={(e) => updateSkill(idx, "description", e.target.value)}
                        className="w-full bg-black/70 border border-gray-800 rounded-xl p-2.5 text-gray-200"
                      />
                    </div>

                    {/* Combat Sliders */}
                    <div className="grid grid-cols-3 gap-3 font-mono text-xs pt-1">
                      <div>
                        <label className="text-emerald-400 block text-[10px] font-bold">
                          FIRE RATE: {skill.fireRate}%
                        </label>
                        <input
                          type="range"
                          min={50}
                          max={100}
                          value={skill.fireRate}
                          onChange={(e) => updateSkill(idx, "fireRate", Number(e.target.value))}
                          className="w-full accent-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="text-[#00f0ff] block text-[10px] font-bold">
                          DAMAGE: {skill.damage}%
                        </label>
                        <input
                          type="range"
                          min={50}
                          max={100}
                          value={skill.damage}
                          onChange={(e) => updateSkill(idx, "damage", Number(e.target.value))}
                          className="w-full accent-[#00f0ff]"
                        />
                      </div>
                      <div>
                        <label className="text-amber-400 block text-[10px] font-bold">
                          ACCURACY: {skill.accuracy}%
                        </label>
                        <input
                          type="range"
                          min={50}
                          max={100}
                          value={skill.accuracy}
                          onChange={(e) => updateSkill(idx, "accuracy", Number(e.target.value))}
                          className="w-full accent-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CAMPAIGN HEISTS (EXPERIENCE) */}
          {activeSection === "heists" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between bg-[#140124] border border-[#00f0ff]/40 p-4 rounded-2xl">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#00f0ff]" />
                    <span>STORY CAMPAIGN HEISTS (WORK EXPERIENCE)</span>
                  </h2>
                  <p className="text-xs font-mono text-gray-400">
                    Manage work roles, mission briefings, metric milestones, and tech stacks.
                  </p>
                </div>

                <button
                  onClick={addExperience}
                  className="px-3.5 py-2 rounded-xl bg-[#00f0ff] hover:bg-cyan-300 text-black font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_#00f0ff] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD HEIST</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.experiences.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="p-5 bg-[#140124] border border-gray-800 hover:border-[#00f0ff]/50 rounded-2xl space-y-4 relative"
                  >
                    <button
                      onClick={() => deleteExperience(idx)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900 border border-red-500/40 text-red-400 hover:text-white transition-colors"
                      title="Delete Heist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                      <div>
                        <label className="text-gray-400 block mb-1">COMPANY NAME:</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, "company", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 block mb-1">ROLE / TITLE:</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(idx, "role", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-[#00f0ff]"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 block mb-1">LOCATION (e.g. Jaipur Onsite):</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(idx, "location", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 block mb-1">TIME PERIOD (e.g. Sep 2026 – Present):</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => updateExperience(idx, "period", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 block mb-1">STATUS:</label>
                        <select
                          value={exp.status}
                          onChange={(e) => updateExperience(idx, "status", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-emerald-400 font-bold"
                        >
                          <option value="IN PROGRESS">IN PROGRESS</option>
                          <option value="ACCOMPLISHED">ACCOMPLISHED</option>
                          <option value="TRAINING COMPLETED">TRAINING COMPLETED</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-400 block mb-1">MISSION TITLE:</label>
                        <input
                          type="text"
                          value={exp.missionTitle}
                          onChange={(e) => updateExperience(idx, "missionTitle", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-pink-300 font-bold"
                        />
                      </div>
                    </div>

                    <div className="text-xs font-mono">
                      <label className="text-gray-400 block mb-1">MISSION BRIEFING:</label>
                      <input
                        type="text"
                        value={exp.briefing}
                        onChange={(e) => updateExperience(idx, "briefing", e.target.value)}
                        className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-gray-200 italic"
                      />
                    </div>

                    <div className="text-xs font-mono">
                      <label className="text-gray-400 block mb-1">KEY METRIC ACHIEVED (HIGHLIGHT):</label>
                      <input
                        type="text"
                        value={exp.keyMetric}
                        onChange={(e) => updateExperience(idx, "keyMetric", e.target.value)}
                        className="w-full bg-black/70 border border-emerald-500/40 rounded-xl px-3 py-1.5 text-emerald-400 font-bold"
                      />
                    </div>

                    <div className="text-xs font-mono">
                      <label className="text-gray-400 block mb-1">ACHIEVEMENTS (ONE PER LINE):</label>
                      <textarea
                        rows={3}
                        value={exp.achievements.join("\n")}
                        onChange={(e) =>
                          updateExperience(idx, "achievements", e.target.value.split("\n"))
                        }
                        className="w-full bg-black/70 border border-gray-800 rounded-xl p-2.5 text-gray-200 leading-relaxed"
                      />
                    </div>

                    <div className="text-xs font-mono">
                      <label className="text-gray-400 block mb-1">TECH STACK (COMMA SEPARATED):</label>
                      <input
                        type="text"
                        value={exp.techStack.join(", ")}
                        onChange={(e) =>
                          updateExperience(
                            idx,
                            "techStack",
                            e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                          )
                        }
                        className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-cyan-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BOUNTY CONTRACTS (PROJECTS) */}
          {activeSection === "projects" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between bg-[#140124] border border-amber-500/40 p-4 rounded-2xl">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>SYNDICATE BOUNTY CONTRACTS (PROJECTS)</span>
                  </h2>
                  <p className="text-xs font-mono text-gray-400">
                    Add or modify client and personal engineering projects.
                  </p>
                </div>

                <button
                  onClick={addProject}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_#f59e0b] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD CONTRACT</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.projects.map((proj, idx) => (
                  <div
                    key={proj.id || idx}
                    className="p-5 bg-[#140124] border border-gray-800 hover:border-amber-400/50 rounded-2xl space-y-4 relative"
                  >
                    <button
                      onClick={() => deleteProject(idx)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900 border border-red-500/40 text-red-400 hover:text-white transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                      <div>
                        <label className="text-gray-400 block mb-1">PROJECT TITLE:</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => updateProject(idx, "title", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 block mb-1">CODENAME:</label>
                        <input
                          type="text"
                          value={proj.codename}
                          onChange={(e) => updateProject(idx, "codename", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-pink-300 font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 block mb-1">TYPE (e.g. Chrome Extension):</label>
                        <input
                          type="text"
                          value={proj.type}
                          onChange={(e) => updateProject(idx, "type", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-gray-300"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 block mb-1">BOUNTY REWARD ($):</label>
                        <input
                          type="text"
                          value={proj.bounty}
                          onChange={(e) => updateProject(idx, "bounty", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-emerald-400 font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 block mb-1">GITHUB REPO URL:</label>
                        <input
                          type="text"
                          value={proj.githubUrl || ""}
                          onChange={(e) => updateProject(idx, "githubUrl", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-purple-300"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 block mb-1">LIVE DEMO URL:</label>
                        <input
                          type="text"
                          value={proj.liveUrl || ""}
                          onChange={(e) => updateProject(idx, "liveUrl", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-cyan-300"
                        />
                      </div>
                    </div>

                    <div className="text-xs font-mono">
                      <label className="text-gray-400 block mb-1">DESCRIPTION:</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProject(idx, "description", e.target.value)}
                        className="w-full bg-black/70 border border-gray-800 rounded-xl p-2.5 text-gray-200"
                      />
                    </div>

                    <div className="text-xs font-mono">
                      <label className="text-gray-400 block mb-1">IMPACT HIGHLIGHT (METRIC PILL):</label>
                      <input
                        type="text"
                        value={proj.impactHighlight}
                        onChange={(e) => updateProject(idx, "impactHighlight", e.target.value)}
                        className="w-full bg-black/70 border border-emerald-500/40 rounded-xl px-3 py-1.5 text-emerald-400 font-bold"
                      />
                    </div>

                    <div className="text-xs font-mono">
                      <label className="text-gray-400 block mb-1">DETAILS / BULLETS (ONE PER LINE):</label>
                      <textarea
                        rows={3}
                        value={proj.details.join("\n")}
                        onChange={(e) =>
                          updateProject(idx, "details", e.target.value.split("\n"))
                        }
                        className="w-full bg-black/70 border border-gray-800 rounded-xl p-2.5 text-gray-200 leading-relaxed"
                      />
                    </div>

                    <div className="text-xs font-mono">
                      <label className="text-gray-400 block mb-1">TECH STACK (COMMA SEPARATED):</label>
                      <input
                        type="text"
                        value={proj.techStack.join(", ")}
                        onChange={(e) =>
                          updateProject(
                            idx,
                            "techStack",
                            e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                          )
                        }
                        className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-amber-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: STREET CRED (CERTIFICATIONS) */}
          {activeSection === "certifications" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between bg-[#140124] border border-purple-500/40 p-4 rounded-2xl">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    <span>STREET CRED & CERTIFICATIONS</span>
                  </h2>
                  <p className="text-xs font-mono text-gray-400">
                    Add or edit official cloud credentials and competitive programming streaks.
                  </p>
                </div>

                <button
                  onClick={addCert}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_#7b00ff] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD TROPHY</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.certifications.map((cert, idx) => (
                  <div
                    key={cert.id || idx}
                    className="p-5 bg-[#140124] border border-gray-800 hover:border-purple-400/50 rounded-2xl space-y-4 relative"
                  >
                    <button
                      onClick={() => deleteCert(idx)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900 border border-red-500/40 text-red-400 hover:text-white transition-colors"
                      title="Delete Certification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                      <div>
                        <label className="text-gray-400 block mb-1">ICON (EMOJI):</label>
                        <input
                          type="text"
                          value={cert.icon}
                          onChange={(e) => updateCert(idx, "icon", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-gray-400 block mb-1">CERTIFICATION TITLE:</label>
                        <input
                          type="text"
                          value={cert.title}
                          onChange={(e) => updateCert(idx, "title", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 block mb-1">ISSUER (e.g. Google Cloud):</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => updateCert(idx, "issuer", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-gray-400 block mb-1">STATUS (e.g. OFFICIAL RECOGNITION):</label>
                        <input
                          type="text"
                          value={cert.status}
                          onChange={(e) => updateCert(idx, "status", e.target.value)}
                          className="w-full bg-black/70 border border-gray-800 rounded-xl px-3 py-1.5 text-emerald-400 font-bold"
                        />
                      </div>
                    </div>

                    <div className="text-xs font-mono">
                      <label className="text-gray-400 block mb-1">DESCRIPTION:</label>
                      <textarea
                        rows={2}
                        value={cert.description}
                        onChange={(e) => updateCert(idx, "description", e.target.value)}
                        className="w-full bg-black/70 border border-gray-800 rounded-xl p-2.5 text-gray-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: COURSEWORK TAGS */}
          {activeSection === "coursework" && (
            <div className="bg-[#140124] border border-[#ff2a85]/50 p-6 rounded-2xl space-y-6 shadow-xl animate-fadeIn font-mono text-xs">
              <div className="border-b border-gray-800 pb-3">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#ff2a85]" />
                  <span>CORE CS COURSEWORK TAGS</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Add or delete university foundation courses shown in the dossier.
                </p>
              </div>

              {/* Add Tag Input */}
              <form onSubmit={addCoursework} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add new course (e.g. Distributed Systems)..."
                  value={newCourseInput}
                  onChange={(e) => setNewCourseInput(e.target.value)}
                  className="flex-1 bg-black/70 border border-gray-800 rounded-xl px-3 py-2 text-white outline-none focus:border-[#ff2a85]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ff2a85] text-white font-bold rounded-xl shadow-[0_0_15px_#ff2a85]"
                >
                  ADD TAG
                </button>
              </form>

              {/* Active Tags Grid */}
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.profile.coursework &&
                  formData.profile.coursework.map((course, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 bg-black/60 border border-gray-700 rounded-xl flex items-center gap-2 text-gray-200 hover:border-[#00f0ff]"
                    >
                      <span>{course}</span>
                      <button
                        type="button"
                        onClick={() => removeCoursework(idx)}
                        className="text-red-400 hover:text-red-300 font-bold ml-1"
                        title="Remove Tag"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 9: WEAZEL NEWS CMS (BLOG DISPATCHES) */}
          {activeSection === "blog" && (
            <div className="bg-[#140124] border border-[#ff2a85]/50 p-6 rounded-2xl space-y-6 shadow-xl animate-fadeIn">
              
              {/* Header & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-[#ff2a85]" />
                    <h2 className="text-xl font-black text-white tracking-wide">
                      WEAZEL NEWS CMS // DISPATCH ARCHIVES & BROADCAST STUDIO
                    </h2>
                  </div>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    Compose, edit, upload media and publish high-octane engineering intelligence to /blog.
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  {!isEditingBlog ? (
                    <>
                      <button
                        onClick={() => {
                          sfx.playClick();
                          setSelectedBlog({
                            title: "",
                            subtitle: "",
                            slug: "",
                            excerpt: "",
                            content: "",
                            coverImage: "",
                            videoUrl: "",
                            category: "Architecture",
                            tags: ["Next.js", "Full-Stack"],
                            status: "published",
                            featured: false,
                            readingTime: "5 min read",
                          });
                          setIsEditingBlog(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#7b00ff] text-white font-bold tracking-wider shadow-[0_0_15px_#ff2a85] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>WRITE NEW DISPATCH</span>
                      </button>

                      <Link
                        href="/blog"
                        target="_blank"
                        onClick={() => sfx.playClick()}
                        className="px-3 py-2 rounded-xl bg-black/60 border border-[#00f0ff]/50 hover:bg-cyan-950 text-[#00f0ff] hover:text-white flex items-center gap-1.5 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>VIEW LIVE FEED</span>
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        sfx.playClick();
                        setIsEditingBlog(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-black/60 border border-gray-700 hover:border-red-400 text-gray-300 hover:text-white flex items-center gap-1.5 transition-all"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>BACK TO ARCHIVES</span>
                    </button>
                  )}
                </div>
              </div>

              {/* EDITOR FORM VIEW */}
              {isEditingBlog ? (
                <div className="space-y-6 bg-black/50 p-6 rounded-2xl border border-gray-800 font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                    <h3 className="text-sm font-black text-[#00f0ff] uppercase tracking-wider flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      <span>{selectedBlog.id ? "EDITING DISPATCH RECORD" : "COMPOSE NEW TRANSMISSION"}</span>
                    </h3>

                    {selectedBlog.slug && (
                      <span className="text-gray-400">
                        TARGET: <code className="text-[#ff2a85]">/blog/{selectedBlog.slug}</code>
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-gray-400 font-bold uppercase">DISPATCH TITLE *</label>
                      <input
                        type="text"
                        value={selectedBlog.title || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedBlog((prev) => ({
                            ...prev,
                            title: val,
                            slug: prev.id ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
                          }));
                        }}
                        placeholder="e.g. Architecting Scalable Microservices"
                        className="w-full p-2.5 rounded-xl bg-black/80 border border-gray-700 focus:border-[#ff2a85] text-white text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-400 font-bold uppercase">SUBTITLE / CATCHPHRASE</label>
                      <input
                        type="text"
                        value={selectedBlog.subtitle || ""}
                        onChange={(e) => setSelectedBlog((prev) => ({ ...prev, subtitle: e.target.value }))}
                        placeholder="e.g. Lessons from High-Traffic Webapps"
                        className="w-full p-2.5 rounded-xl bg-black/80 border border-gray-700 focus:border-[#ff2a85] text-white text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* Slug, Category & Reading Time */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-gray-400 font-bold uppercase">URL SLUG</label>
                      <input
                        type="text"
                        value={selectedBlog.slug || ""}
                        onChange={(e) => setSelectedBlog((prev) => ({ ...prev, slug: e.target.value }))}
                        placeholder="article-url-slug"
                        className="w-full p-2.5 rounded-xl bg-black/80 border border-gray-700 focus:border-[#00f0ff] text-cyan-300 text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-400 font-bold uppercase">CATEGORY</label>
                      <select
                        value={selectedBlog.category || "Architecture"}
                        onChange={(e) => setSelectedBlog((prev) => ({ ...prev, category: e.target.value as BlogPost["category"] }))}
                        className="w-full p-2.5 rounded-xl bg-black/80 border border-gray-700 focus:border-[#00f0ff] text-white text-xs outline-none"
                      >
                        <option value="Architecture">Architecture</option>
                        <option value="Backend">Backend</option>
                        <option value="Frontend">Frontend</option>
                        <option value="DevOps">DevOps</option>
                        <option value="AI & ML">AI & ML</option>
                        <option value="GTA Dev Logs">GTA Dev Logs</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-400 font-bold uppercase">ESTIMATED READING TIME</label>
                      <input
                        type="text"
                        value={selectedBlog.readingTime || "5 min read"}
                        onChange={(e) => setSelectedBlog((prev) => ({ ...prev, readingTime: e.target.value }))}
                        className="w-full p-2.5 rounded-xl bg-black/80 border border-gray-700 text-white text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* Status, Featured & Tags */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="space-y-1.5">
                      <label className="text-gray-400 font-bold uppercase">BROADCAST STATUS</label>
                      <select
                        value={selectedBlog.status || "published"}
                        onChange={(e) => setSelectedBlog((prev) => ({ ...prev, status: e.target.value as BlogPost["status"] }))}
                        className="w-full p-2.5 rounded-xl bg-black/80 border border-gray-700 text-white text-xs outline-none"
                      >
                        <option value="published">Published (Public)</option>
                        <option value="draft">Draft (Restricted)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-400 font-bold uppercase">BREAKING STORY PIN</label>
                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-black/80 border border-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(selectedBlog.featured)}
                          onChange={(e) => setSelectedBlog((prev) => ({ ...prev, featured: e.target.checked }))}
                          className="rounded text-[#ff2a85] focus:ring-0"
                        />
                        <span className="text-gray-300 font-bold">Featured Hero Banner</span>
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-400 font-bold uppercase">TAGS (COMMA SEPARATED)</label>
                      <input
                        type="text"
                        value={Array.isArray(selectedBlog.tags) ? selectedBlog.tags.join(", ") : (selectedBlog.tags || "")}
                        onChange={(e) => setSelectedBlog((prev) => ({ ...prev, tags: e.target.value.split(",").map((s) => s.trim()) }))}
                        placeholder="Next.js, Three.js, Redis"
                        className="w-full p-2.5 rounded-xl bg-black/80 border border-gray-700 text-white text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* MEDIA SECTION: IMAGE & VIDEO UPLOADS */}
                  <div className="p-4 rounded-xl bg-black/80 border border-[#ff2a85]/40 space-y-4">
                    <div className="flex items-center gap-2 text-pink-400 font-bold">
                      <ImageIcon className="w-4 h-4" />
                      <span>ATTACHED MEDIA ASSETS (IMAGE & VIDEO STORAGE VAULT)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 1. Cover Image Uploader */}
                      <div className="space-y-2 p-3 bg-gray-950/70 rounded-xl border border-gray-800">
                        <label className="text-gray-400 font-bold flex items-center justify-between">
                          <span>1. COVER IMAGE</span>
                          <span className="text-[10px] text-gray-500">PNG, JPG, WebP</span>
                        </label>

                        {/* File Upload Button */}
                        <div className="flex items-center gap-2">
                          <label className="px-3 py-2 rounded-lg bg-pink-950/70 border border-pink-500/50 hover:bg-pink-900 text-pink-300 hover:text-white cursor-pointer flex items-center gap-1.5 transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{isUploadingMedia && mediaUploadType === "image" ? "UPLOADING..." : "UPLOAD IMAGE"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploadingMedia}
                              onChange={(e) => handleMediaUpload(e, "coverImage")}
                              className="hidden"
                            />
                          </label>

                          <span className="text-gray-600">OR</span>

                          <input
                            type="text"
                            value={selectedBlog.coverImage || ""}
                            onChange={(e) => setSelectedBlog((prev) => ({ ...prev, coverImage: e.target.value }))}
                            placeholder="https://... or /uploads/..."
                            className="flex-1 p-2 rounded-lg bg-black border border-gray-800 text-gray-300 text-[11px] outline-none"
                          />
                        </div>

                        {/* Image Preview */}
                        {selectedBlog.coverImage && (
                          <div className="relative h-28 w-full rounded-lg overflow-hidden border border-pink-500/40 bg-black mt-2">
                            <img
                              src={selectedBlog.coverImage}
                              alt="Cover Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setSelectedBlog((prev) => ({ ...prev, coverImage: "" }))}
                              className="absolute top-1 right-1 p-1 rounded bg-black/80 text-red-400 hover:text-white"
                              title="Remove Image"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 2. Video Uploader */}
                      <div className="space-y-2 p-3 bg-gray-950/70 rounded-xl border border-gray-800">
                        <label className="text-gray-400 font-bold flex items-center justify-between">
                          <span>2. EMBEDDED VIDEO</span>
                          <span className="text-[10px] text-gray-500">MP4, WebM or YouTube</span>
                        </label>

                        {/* Video Upload Button */}
                        <div className="flex items-center gap-2">
                          <label className="px-3 py-2 rounded-lg bg-cyan-950/70 border border-cyan-500/50 hover:bg-cyan-900 text-cyan-300 hover:text-white cursor-pointer flex items-center gap-1.5 transition-all">
                            <Video className="w-3.5 h-3.5" />
                            <span>{isUploadingMedia && mediaUploadType === "video" ? "UPLOADING..." : "UPLOAD VIDEO"}</span>
                            <input
                              type="file"
                              accept="video/*"
                              disabled={isUploadingMedia}
                              onChange={(e) => handleMediaUpload(e, "videoUrl")}
                              className="hidden"
                            />
                          </label>

                          <span className="text-gray-600">OR</span>

                          <input
                            type="text"
                            value={selectedBlog.videoUrl || ""}
                            onChange={(e) => setSelectedBlog((prev) => ({ ...prev, videoUrl: e.target.value }))}
                            placeholder="YouTube URL or /uploads/..."
                            className="flex-1 p-2 rounded-lg bg-black border border-gray-800 text-gray-300 text-[11px] outline-none"
                          />
                        </div>

                        {/* Video Preview */}
                        {selectedBlog.videoUrl && (
                          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-cyan-500/40 bg-black mt-2">
                            {selectedBlog.videoUrl.includes("youtube.com") || selectedBlog.videoUrl.includes("youtu.be") ? (
                              <div className="w-full h-full flex items-center justify-center text-cyan-400 text-xs">
                                🎬 YouTube Embed Linked: {selectedBlog.videoUrl}
                              </div>
                            ) : (
                              <video
                                src={selectedBlog.videoUrl}
                                controls
                                className="w-full h-full object-contain"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedBlog((prev) => ({ ...prev, videoUrl: "" }))}
                              className="absolute top-1 right-1 p-1 rounded bg-black/80 text-red-400 hover:text-white"
                              title="Remove Video"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase">SYNOPSIS / EXCERPT (FEED DISPLAY) *</label>
                    <textarea
                      rows={2}
                      value={selectedBlog.excerpt || ""}
                      onChange={(e) => setSelectedBlog((prev) => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief teaser of the article shown in the Weazel feed..."
                      className="w-full p-2.5 rounded-xl bg-black/80 border border-gray-700 focus:border-[#ff2a85] text-white text-xs outline-none"
                    />
                  </div>

                  {/* Markdown Content */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-400 font-bold uppercase">ARTICLE BODY (MARKDOWN SUPPORTED) *</label>
                      <div className="flex items-center gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setSelectedBlog((prev) => ({ ...prev, content: (prev.content || "") + "\n\n## Section Title\n" }))}
                          className="px-2 py-0.5 rounded bg-gray-900 hover:bg-gray-800 text-gray-300"
                        >
                          + Heading
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedBlog((prev) => ({ ...prev, content: (prev.content || "") + "\n\n```typescript\n// Code goes here\n```\n" }))}
                          className="px-2 py-0.5 rounded bg-gray-900 hover:bg-gray-800 text-[#00f0ff]"
                        >
                          + Code Block
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedBlog((prev) => ({ ...prev, content: (prev.content || "") + "\n\n> Important quote or takeaway\n" }))}
                          className="px-2 py-0.5 rounded bg-gray-900 hover:bg-gray-800 text-pink-300"
                        >
                          + Quote
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={12}
                      value={selectedBlog.content || ""}
                      onChange={(e) => setSelectedBlog((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your article markdown here. Supports ## Headings, code blocks (```ts), quotes (>), and bullet points (-)..."
                      className="w-full p-3.5 rounded-xl bg-black/80 border border-gray-700 focus:border-[#00f0ff] text-white text-xs outline-none font-mono leading-relaxed"
                    />
                  </div>

                  {/* Author Dossier Preview */}
                  <div className="p-3.5 rounded-xl bg-black/60 border border-purple-900/40 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border border-[#00f0ff] p-0.5 shrink-0 overflow-hidden">
                      <img
                        src={selectedBlog.author?.avatar || formData.profile.avatarUrl || "https://github.com/imdevesh21.png"}
                        alt={selectedBlog.author?.name || formData.profile.name || "Devesh Sharma"}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="flex-1 text-xs font-mono">
                      <div className="text-white font-bold flex items-center gap-2">
                        <span>BYLINE: {selectedBlog.author?.name || formData.profile.name || "Devesh Sharma"}</span>
                        <span className="text-[10px] text-[#00f0ff] font-bold">OPERATIVE 01</span>
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Role: {selectedBlog.author?.role || formData.profile.title || "Lead Systems Architect & Full-Stack Operative"}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => setIsEditingBlog(false)}
                      className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white"
                    >
                      CANCEL
                    </button>

                    <button
                      type="button"
                      disabled={isSavingBlog}
                      onClick={handleSaveBlog}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#7b00ff] text-white font-bold tracking-wider shadow-[0_0_20px_#ff2a85] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingBlog ? "SAVING..." : selectedBlog.id ? "UPDATE DISPATCH" : "PUBLISH TO WEAZEL ARCHIVES"}</span>
                    </button>
                  </div>

                </div>
              ) : (
                /* DISPATCHES ARCHIVE LIST VIEW */
                <div className="space-y-4">
                  
                  {/* Search & Stats Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-black/50 p-3 rounded-xl border border-gray-800 font-mono text-xs">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-gray-500">TOTAL STORIES:</span>{" "}
                        <span className="text-white font-black">{blogs.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">PUBLISHED:</span>{" "}
                        <span className="text-emerald-400 font-black">{blogs.filter((b) => b.status === "published").length}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">TOTAL VIEWS:</span>{" "}
                        <span className="text-[#00f0ff] font-black">{blogs.reduce((acc, b) => acc + (b.views || 0), 0)}</span>
                      </div>
                    </div>

                    <div className="w-full sm:w-64 relative">
                      <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={blogSearchQuery}
                        onChange={(e) => setBlogSearchQuery(e.target.value)}
                        placeholder="Search dispatches..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black border border-gray-800 text-white text-xs outline-none focus:border-[#ff2a85]"
                      />
                    </div>
                  </div>

                  {/* Dispatches Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blogs
                      .filter((b) => {
                        if (!blogSearchQuery) return true;
                        const q = blogSearchQuery.toLowerCase();
                        return (
                          b.title.toLowerCase().includes(q) ||
                          b.category.toLowerCase().includes(q) ||
                          b.tags.some((t) => t.toLowerCase().includes(q))
                        );
                      })
                      .map((post) => (
                        <div
                          key={post.id}
                          className="bg-black/60 p-4 rounded-2xl border border-gray-800 hover:border-pink-500/50 transition-all flex flex-col justify-between space-y-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-black border border-gray-800 shrink-0">
                              {post.coverImage ? (
                                <img
                                  src={post.coverImage}
                                  alt={post.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-700">
                                  <Newspaper className="w-6 h-6" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="px-2 py-0.5 rounded bg-cyan-950 text-[#00f0ff] font-bold">
                                  {post.category}
                                </span>
                                <span className={post.status === "published" ? "text-emerald-400 font-bold" : "text-amber-400"}>
                                  ● {post.status.toUpperCase()}
                                </span>
                              </div>

                              <h4 className="text-sm font-black text-white line-clamp-1">
                                {post.title}
                              </h4>

                              <p className="text-[11px] text-gray-400 line-clamp-2">
                                {post.excerpt}
                              </p>
                            </div>
                          </div>

                          {/* Footer stats & Action buttons */}
                          <div className="flex items-center justify-between font-mono text-xs pt-2 border-t border-gray-900">
                            <div className="flex items-center gap-3 text-gray-500 text-[11px]">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3 text-[#00f0ff]" /> {post.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3 text-[#ff2a85]" /> {post.likes}
                              </span>
                              {post.videoUrl && (
                                <span className="text-pink-400 flex items-center gap-0.5">
                                  <Video className="w-3 h-3" /> Video
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <Link
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white"
                                title="View Live Dispatch"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>

                              <button
                                onClick={() => {
                                  sfx.playClick();
                                  setSelectedBlog(post);
                                  setIsEditingBlog(true);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-pink-950/60 border border-pink-500/50 hover:bg-pink-900 text-pink-300 hover:text-white font-bold flex items-center gap-1 text-[11px]"
                              >
                                <Edit className="w-3 h-3" />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => handleDeleteBlog(post.id, post.title)}
                                className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900 border border-red-500/40 text-red-400 hover:text-white"
                                title="Delete Dispatch"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            </div>
          )}
          {activeSection === "surveillance" && (
            <div className="bg-[#140124] border border-emerald-500/50 p-6 rounded-2xl space-y-6 shadow-xl animate-fadeIn">
              
              {/* Header & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <h2 className="text-xl font-black text-white tracking-wide">
                      LEONIDA SURVEILLANCE RADAR // VISITOR TELEMETRY
                    </h2>
                  </div>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    Real-time reconnaissance, monthly date breakdown & ingress intelligence.
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <button
                    onClick={() => fetchAnalytics()}
                    disabled={isLoadingAnalytics}
                    className="px-3 py-1.5 rounded-lg bg-black/60 border border-emerald-500/50 hover:bg-emerald-950 text-emerald-300 hover:text-white flex items-center gap-1.5 transition-all disabled:opacity-50"
                    title="Refresh analytics data"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAnalytics ? "animate-spin" : ""}`} />
                    <span>{isLoadingAnalytics ? "Scanning..." : "Re-Scan Radar"}</span>
                  </button>

                  <button
                    onClick={exportLogsCsv}
                    className="px-3 py-1.5 rounded-lg bg-black/60 border border-[#00f0ff]/50 hover:bg-cyan-950 text-[#00f0ff] hover:text-white flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,240,255,0.25)]"
                    title="Download visitor logs as CSV file"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Month Selector Bar */}
              <div className="bg-black/50 p-3.5 rounded-xl border border-gray-800 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">SELECT SURVEILLANCE MONTH:</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const months = analytics?.monthlyBreakdown
                      ? Array.from(new Set(["2026-11", "2026-10", ...Object.keys(analytics.monthlyBreakdown)])).sort().reverse()
                      : ["2026-11", "2026-10"];

                    return months.map((m) => {
                      const [yr, mn] = m.split("-");
                      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                      const label = `${monthNames[parseInt(mn, 10) - 1]} ${yr}`;
                      const isSelected = selectedMonth === m;

                      return (
                        <button
                          key={m}
                          onClick={() => {
                            setSelectedMonth(m);
                            sfx.playClick();
                          }}
                          className={`px-3 py-1 rounded-lg transition-all font-bold ${
                            isSelected
                              ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-105"
                              : "bg-black/70 border border-gray-700 text-gray-300 hover:border-emerald-400 hover:text-white"
                          }`}
                        >
                          {label} ({analytics?.monthlyBreakdown?.[m] || 0})
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* 4 High-Priority Metrics Counter Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
                {/* Total All-Time Visits */}
                <div className="p-4 bg-black/70 rounded-xl border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)] space-y-1">
                  <div className="flex items-center justify-between text-gray-400 text-[10px] uppercase font-bold">
                    <span>ALL-TIME VISITS</span>
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-black text-emerald-400 tracking-wider">
                    {analytics?.totalVisits || 0}
                  </div>
                  <div className="text-[10px] text-gray-400">Total Ingress Events</div>
                </div>

                {/* Unique Visitors */}
                <div className="p-4 bg-black/70 rounded-xl border border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.15)] space-y-1">
                  <div className="flex items-center justify-between text-gray-400 text-[10px] uppercase font-bold">
                    <span>UNIQUE OPERATIVES</span>
                    <Users className="w-3.5 h-3.5 text-[#00f0ff]" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-black text-[#00f0ff] tracking-wider">
                    {analytics?.uniqueVisitors || 0}
                  </div>
                  <div className="text-[10px] text-gray-400">Distinct Devices / IPs</div>
                </div>

                {/* Selected Month Visits */}
                <div className="p-4 bg-black/70 rounded-xl border border-[#ff2a85]/40 shadow-[0_0_15px_rgba(255,42,133,0.15)] space-y-1">
                  <div className="flex items-center justify-between text-gray-400 text-[10px] uppercase font-bold">
                    <span>THIS MONTH</span>
                    <BarChart3 className="w-3.5 h-3.5 text-[#ff2a85]" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-black text-[#ff2a85] tracking-wider">
                    {analytics?.monthVisits || 0}
                  </div>
                  <div className="text-[10px] text-gray-400">In {selectedMonth}</div>
                </div>

                {/* Today's Visits */}
                <div className="p-4 bg-black/70 rounded-xl border border-[#ffb700]/40 shadow-[0_0_15px_rgba(255,183,0,0.15)] space-y-1">
                  <div className="flex items-center justify-between text-gray-400 text-[10px] uppercase font-bold">
                    <span>{"TODAY'S INTEL"}</span>
                    <Activity className="w-3.5 h-3.5 text-[#ffb700]" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-black text-[#ffb700] tracking-wider">
                    {analytics?.todayVisits || 0}
                  </div>
                  <div className="text-[10px] text-gray-400">24-Hour Cycle</div>
                </div>
              </div>

              {/* DAILY HISTOGRAM / BAR CHART (Every Date of Selected Month) */}
              <div className="bg-black/80 p-5 rounded-2xl border border-gray-800 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      <span>DAILY VISITOR HISTOGRAM // {selectedMonth}</span>
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Day-by-day frequency breakdown for all dates in the selected month.
                    </p>
                  </div>

                  {hoveredDay && (
                    <div className="text-xs bg-emerald-950 border border-emerald-500/60 px-3 py-1 rounded-lg text-emerald-300 font-bold animate-fadeIn">
                      📅 {hoveredDay.date}: <span className="text-white">{hoveredDay.count} Visits</span>
                    </div>
                  )}
                </div>

                {/* Histogram Bars Container */}
                <div className="pt-6 pb-2">
                  {(() => {
                    const [y, m] = selectedMonth.split("-").map(Number);
                    const totalDays = new Date(y, m, 0).getDate();
                    const daysList = [];
                    for (let i = 1; i <= totalDays; i++) {
                      const dStr = i < 10 ? `0${i}` : `${i}`;
                      const fullDate = `${selectedMonth}-${dStr}`;
                      const count = analytics?.dailyBreakdown?.[fullDate] || 0;
                      daysList.push({ day: dStr, date: fullDate, count });
                    }
                    const maxCount = Math.max(...daysList.map((d) => d.count), 1);
                    const todayStr = new Date().toISOString().split("T")[0];

                    return (
                      <div className="flex items-end gap-1 sm:gap-1.5 h-44 w-full px-1 border-b border-gray-700">
                        {daysList.map((item) => {
                          const heightPct = item.count > 0 ? Math.max((item.count / maxCount) * 100, 10) : 4;
                          const isToday = item.date === todayStr;

                          return (
                            <div
                              key={item.day}
                              onMouseEnter={() => setHoveredDay(item)}
                              onMouseLeave={() => setHoveredDay(null)}
                              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                            >
                              {/* Hover Tooltip */}
                              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-emerald-400 text-white text-[9px] px-2 py-0.5 rounded shadow-lg pointer-events-none whitespace-nowrap z-30">
                                {item.date}: {item.count}
                              </div>

                              {/* The Bar */}
                              <div
                                style={{ height: `${heightPct}%` }}
                                className={`w-full rounded-t-sm transition-all duration-300 ${
                                  item.count > 0
                                    ? isToday
                                      ? "bg-gradient-to-t from-emerald-500 via-cyan-400 to-[#ff2a85] shadow-[0_0_12px_rgba(0,240,255,0.8)] group-hover:brightness-125"
                                      : "bg-gradient-to-t from-[#ff2a85] to-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.4)] group-hover:brightness-125"
                                    : "bg-gray-800/60 group-hover:bg-gray-700"
                                } ${isToday ? "ring-2 ring-emerald-400 ring-offset-1 ring-offset-black" : ""}`}
                              />

                              {/* Day Label */}
                              <span className={`text-[9px] mt-1.5 ${isToday ? "text-emerald-400 font-bold" : "text-gray-500 group-hover:text-gray-300"}`}>
                                {item.day}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                  <span>Day 01</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#00f0ff]" /> Regular Traffic
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /> Active Date / Today
                    </span>
                  </div>
                  <span>End of Month</span>
                </div>
              </div>

              {/* Hardware & Referrer Intelligence Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                
                {/* Device Breakdown */}
                <div className="p-4 bg-black/60 rounded-xl border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between text-gray-400 font-bold">
                    <span>HARDWARE PLATFORMS</span>
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  </div>

                  {(() => {
                    const dev = analytics?.deviceBreakdown || { Desktop: 0, Mobile: 0, Tablet: 0 };
                    const total = dev.Desktop + dev.Mobile + dev.Tablet || 1;
                    const deskPct = Math.round((dev.Desktop / total) * 100);
                    const mobPct = Math.round((dev.Mobile / total) * 100);
                    const tabPct = Math.round((dev.Tablet / total) * 100);

                    return (
                      <div className="space-y-2.5">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="flex items-center gap-1.5 text-gray-300">
                              <Laptop className="w-3.5 h-3.5 text-cyan-400" /> Desktop
                            </span>
                            <span className="text-cyan-400 font-bold">{dev.Desktop} ({deskPct}%)</span>
                          </div>
                          <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                            <div style={{ width: `${deskPct}%` }} className="h-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="flex items-center gap-1.5 text-gray-300">
                              <Smartphone className="w-3.5 h-3.5 text-pink-400" /> Mobile
                            </span>
                            <span className="text-pink-400 font-bold">{dev.Mobile} ({mobPct}%)</span>
                          </div>
                          <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                            <div style={{ width: `${mobPct}%` }} className="h-full bg-[#ff2a85] shadow-[0_0_6px_#ff2a85]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="flex items-center gap-1.5 text-gray-300">
                              <Activity className="w-3.5 h-3.5 text-purple-400" /> Tablet
                            </span>
                            <span className="text-purple-400 font-bold">{dev.Tablet} ({tabPct}%)</span>
                          </div>
                          <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                            <div style={{ width: `${tabPct}%` }} className="h-full bg-purple-500 shadow-[0_0_6px_#a855f7]" />
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Top Countries */}
                <div className="p-4 bg-black/60 rounded-xl border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between text-gray-400 font-bold">
                    <span>TOP OPERATIVE REGIONS</span>
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {analytics?.countryBreakdown && Object.entries(analytics.countryBreakdown).length > 0 ? (
                      Object.entries(analytics.countryBreakdown)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([country, count]) => {
                          let flag = "🌐";
                          const cLower = country.toLowerCase();
                          if (cLower.includes("india")) flag = "🇮🇳";
                          else if (cLower.includes("united states") || cLower.includes("usa")) flag = "🇺🇸";
                          else if (cLower.includes("germany")) flag = "🇩🇪";
                          else if (cLower.includes("kingdom") || cLower.includes("uk")) flag = "🇬🇧";
                          else if (cLower.includes("canada")) flag = "🇨🇦";
                          else if (cLower.includes("netherlands")) flag = "🇳🇱";

                          return (
                            <div key={country} className="flex items-center justify-between p-1.5 bg-black/40 rounded-lg text-gray-200">
                              <span className="flex items-center gap-2">
                                <span>{flag}</span>
                                <span>{country}</span>
                              </span>
                              <span className="text-emerald-400 font-bold">{count} visits</span>
                            </div>
                          );
                        })
                    ) : (
                      <div className="text-gray-500 text-center py-4">No regional data yet</div>
                    )}
                  </div>
                </div>

                {/* Top Referral Ingress */}
                <div className="p-4 bg-black/60 rounded-xl border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between text-gray-400 font-bold">
                    <span>TRAFFIC CHANNELS</span>
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { name: "LinkedIn", color: "text-[#00f0ff]", border: "border-cyan-500/40" },
                      { name: "GitHub", color: "text-purple-400", border: "border-purple-500/40" },
                      { name: "Direct Uplink", color: "text-emerald-400", border: "border-emerald-500/40" },
                      { name: "Google Search", color: "text-amber-400", border: "border-amber-500/40" },
                      { name: "Twitter / X", color: "text-[#ff2a85]", border: "border-pink-500/40" },
                    ].map((channel) => {
                      const count = analytics?.recentLogs
                        ? analytics.recentLogs.filter((l) => l.referrer.toLowerCase().includes(channel.name.toLowerCase().split(" ")[0])).length
                        : 0;

                      return (
                        <div key={channel.name} className={`flex items-center justify-between p-1.5 bg-black/40 rounded-lg border ${channel.border}`}>
                          <span className={channel.color}>{channel.name}</span>
                          <span className="font-bold text-white">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* DETAILED RECON LOGS STREAM (Table) */}
              <div className="bg-black/80 rounded-2xl border border-gray-800 overflow-hidden font-mono text-xs">
                
                {/* Table Header & Search */}
                <div className="p-4 bg-[#18022b]/80 border-b border-gray-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white tracking-wider">
                      LIVE RECONNAISSANCE STREAM ({analytics?.recentLogs?.length || 0} LOGS)
                    </span>
                  </div>

                  {/* Search Filter */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filter by city, country, browser..."
                      value={logSearchQuery}
                      onChange={(e) => setLogSearchQuery(e.target.value)}
                      className="w-full bg-black/60 border border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-white placeholder:text-gray-500 outline-none focus:border-emerald-400 text-xs"
                    />
                  </div>
                </div>

                {/* Table Records */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-800 bg-black/40 text-[10px] text-gray-400 uppercase tracking-wider">
                        <th className="py-2.5 px-4">TIMESTAMP</th>
                        <th className="py-2.5 px-4">LOCATION</th>
                        <th className="py-2.5 px-4">HARDWARE & OS</th>
                        <th className="py-2.5 px-4">INGRESS CHANNEL</th>
                        <th className="py-2.5 px-4">STATUS</th>
                        <th className="py-2.5 px-4">OPERATIVE ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {(() => {
                        const logsToDisplay = (analytics?.recentLogs || []).filter((l) => {
                          if (!logSearchQuery.trim()) return true;
                          const q = logSearchQuery.toLowerCase();
                          return (
                            l.city.toLowerCase().includes(q) ||
                            l.country.toLowerCase().includes(q) ||
                            l.browser.toLowerCase().includes(q) ||
                            l.os.toLowerCase().includes(q) ||
                            l.referrer.toLowerCase().includes(q) ||
                            l.date.includes(q)
                          );
                        });

                        if (logsToDisplay.length === 0) {
                          return (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-gray-500">
                                No reconnaissance telemetry found matching search filter.
                              </td>
                            </tr>
                          );
                        }

                        return logsToDisplay.slice(0, 30).map((log) => {
                          let flag = "🌐";
                          const cLower = log.country.toLowerCase();
                          if (cLower.includes("india")) flag = "🇮🇳";
                          else if (cLower.includes("united states") || cLower.includes("usa")) flag = "🇺🇸";
                          else if (cLower.includes("germany")) flag = "🇩🇪";
                          else if (cLower.includes("kingdom") || cLower.includes("uk")) flag = "🇬🇧";
                          else if (cLower.includes("canada")) flag = "🇨🇦";
                          else if (cLower.includes("netherlands")) flag = "🇳🇱";

                          return (
                            <tr key={log.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-2.5 px-4 text-gray-300">
                                <div>{log.date}</div>
                                <div className="text-[10px] text-gray-500">{log.time}</div>
                              </td>

                              <td className="py-2.5 px-4">
                                <span className="flex items-center gap-1.5 font-bold text-white">
                                  <span>{flag}</span>
                                  <span>{log.city}, {log.country}</span>
                                </span>
                                <span className="text-[10px] text-gray-500">{log.ip}</span>
                              </td>

                              <td className="py-2.5 px-4 text-gray-300">
                                <div>{log.os} / {log.browser}</div>
                                <div className="text-[10px] text-cyan-400 font-bold">{log.device}</div>
                              </td>

                              <td className="py-2.5 px-4">
                                <span className="px-2 py-0.5 rounded bg-black/60 border border-gray-700 text-gray-200">
                                  {log.referrer}
                                </span>
                              </td>

                              <td className="py-2.5 px-4">
                                {log.isNew ? (
                                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold text-[10px]">
                                    NEW VISITOR
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-bold text-[10px]">
                                    RETURNING
                                  </span>
                                )}
                              </td>

                              <td className="py-2.5 px-4 font-mono text-[10px] text-gray-400">
                                {log.visitorId}
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
