"use client";

import React, { useState, useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { PortfolioData, SkillWeapon, ExperienceItem, ProjectItem, CertificationItem } from "@/types/portfolio";
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
  BookOpen 
} from "lucide-react";
import confetti from "canvas-confetti";

export default function AdminPage() {
  const { data: initialData, saveData, resetToDefault } = usePortfolio();
  const [formData, setFormData] = useState<PortfolioData>(initialData);
  const [activeSection, setActiveSection] = useState<string>("profile");
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Sync with initialData once loaded
  useEffect(() => {
    if (initialData && initialData.profile) {
      setFormData(initialData);
    }
  }, [initialData]);

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

        </main>
      </div>
    </div>
  );
}
