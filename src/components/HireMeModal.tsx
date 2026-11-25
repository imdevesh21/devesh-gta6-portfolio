"use client";

import React, { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { sfx } from "@/lib/soundFx";
import { X, Send, CheckCircle2, Mail, Briefcase } from "lucide-react";
import confetti from "canvas-confetti";

interface HireMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HireMeModal: React.FC<HireMeModalProps> = ({ isOpen, onClose }) => {
  const { data } = usePortfolio();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("Full Stack Developer");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    sfx.playClick();
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, role, message }),
      });
      if (res.ok) {
        sfx.playMissionPassed();
        try {
          confetti({ particleCount: 65, spread: 75, origin: { y: 0.6 } });
        } catch {}
        setSubmitted(true);
        setName("");
        setEmail("");
        setCompany("");
        setMessage("");
      } else {
        alert("Failed to send mission contract. Try emailing directly.");
      }
    } catch {
      alert("Network error while sending mission contract.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto glass-vice border-2 border-[#ff2a85]/70 rounded-3xl p-5 sm:p-8 shadow-[0_0_50px_rgba(255,42,133,0.35)] space-y-5"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/60 border border-white/15 text-gray-300 hover:text-white hover:border-[#ff2a85]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ff2a85]/20 border border-[#ff2a85]/50 font-mono text-[10px] font-bold text-[#ff85b8]">
            <Briefcase className="w-3 h-3" />
            <span>SYNDICATE CONTRACT DISPATCH</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide">
            RECRUIT {data.profile.name.toUpperCase()}
          </h2>
          <p className="text-xs font-mono text-gray-400">
            Send an interview invite or project brief straight to the Admin Vault Inbox.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-black text-emerald-300 font-mono">
                MISSION CONTRACT TRANSMITTED!
              </h3>
              <p className="text-xs text-gray-300">
                Devesh will review your inquiry and reply shortly.
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00a8ff] text-black font-mono text-xs font-black"
            >
              RETURN TO LEONIDA
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-gray-400 block mb-1">YOUR NAME *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full bg-black/75 border border-gray-700 focus:border-[#00f0ff] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">WORK EMAIL *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full bg-black/75 border border-gray-700 focus:border-[#00f0ff] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-gray-400 block mb-1">COMPANY / ORG</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Tech"
                  className="w-full bg-black/75 border border-gray-700 focus:border-[#ff2a85] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">TARGET ROLE</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Full Stack Engineer"
                  className="w-full bg-black/75 border border-gray-700 focus:border-[#ff2a85] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">MISSION BRIEF / MESSAGE *</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about the role, project, or interview schedule..."
                className="w-full bg-black/75 border border-gray-700 focus:border-[#00f0ff] rounded-xl p-3 text-white outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href={`mailto:${data.profile.contact.email}`}
                className="text-gray-400 hover:text-[#00f0ff] flex items-center gap-1.5 text-[11px]"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Or open email app</span>
              </a>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#7b00ff] text-white font-black tracking-wider shadow-[0_0_20px_rgba(255,42,133,0.5)] hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? "TRANSMITTING..." : "SEND CONTRACT"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
