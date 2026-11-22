"use client";

import React from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Mail, Phone, ExternalLink, Printer } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

export const RecruiterExecutiveView: React.FC = () => {
  const { data } = usePortfolio();
  const profile = data.profile;
  const experiences = data.experiences;
  const projects = data.projects;
  const certs = data.certifications;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10 px-4 sm:px-8 font-sans max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header bar with Print button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {profile.name}
          </h1>
          <p className="text-base text-cyan-400 font-medium mt-1">
            {profile.title} • Next.js, Node.js, TypeScript, SQL
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 text-xs font-semibold transition-all shadow-sm"
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Contact & Links Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <a
          href={`mailto:${profile.contact.email}`}
          className="flex items-center gap-2 hover:text-cyan-400 transition-colors truncate"
        >
          <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="truncate">{profile.contact.email}</span>
        </a>
        <a
          href={`tel:${profile.contact.phone}`}
          className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
        >
          <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{profile.contact.phone}</span>
        </a>
        <a
          href={profile.contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
        >
          <LinkedinIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>LinkedIn Profile</span>
        </a>
        <a
          href={profile.contact.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
        >
          <GithubIcon className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span>GitHub Profile</span>
        </a>
      </div>

      {/* Professional Summary */}
      <section className="space-y-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
          Executive Summary
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          {profile.summary}
        </p>
      </section>

      {/* Experience */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
          Work Experience
        </h2>
        <div className="space-y-5">
          {experiences.map((exp) => (
            <div key={exp.id} className="space-y-1.5">
              <div className="flex flex-wrap justify-between items-baseline gap-2">
                <h3 className="text-base font-bold text-white">
                  {exp.role} <span className="text-cyan-400 font-normal">@ {exp.company}</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">{exp.period} | {exp.location}</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {exp.achievements.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {exp.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Projects */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
          Featured Engineering Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-sm font-bold text-white">{proj.title}</h3>
                <p className="text-[11px] text-cyan-400 font-mono mt-0.5">{proj.type}</p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {proj.description}
                </p>
                <div className="my-2 p-2 bg-slate-950 rounded text-[11px] font-mono text-emerald-400">
                  {proj.impactHighlight}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-[10px] text-slate-400 font-mono">
                  {proj.techStack.slice(0, 3).join(", ")}
                </span>
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
            Education
          </h2>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">
              {profile.education.institution}
            </h3>
            <p className="text-xs text-slate-300">
              {profile.education.degree}
            </p>
            <p className="text-xs text-slate-400 font-mono">
              {profile.education.period} • CGPA: {profile.education.cgpa}
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
            Certifications & Problem Solving
          </h2>
          <ul className="text-xs text-slate-300 space-y-1.5">
            {certs.map((cert) => (
              <li key={cert.id} className="leading-snug">
                <span className="font-bold text-white">{cert.title}</span> —{" "}
                <span className="text-cyan-400 font-mono">{cert.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
