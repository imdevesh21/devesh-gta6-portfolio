"use client";

import React, { useState, useRef, useEffect } from "react";
import { sfx } from "@/lib/soundFx";
import { Bot, X, Send, Sparkles, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface ChatMessage {
  role: "bot" | "user";
  text: string;
}

const QUICK_PROMPTS = [
  "Why hire Devesh?",
  "Next.js & SQL experience?",
  "Top deployed projects?",
  "Download resume",
];

export const LesterAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Yo! I'm Lester — Devesh's AI Operative. Ask me anything about his Next.js/SQL stack, Vyn Automation impact, projects, or resume!",
    },
  ]);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_`#]/g, "");
      const utter = new SpeechSynthesisUtterance(clean);
      utter.rate = 1.05;
      utter.pitch = 0.95;
      window.speechSynthesis.speak(utter);
    } catch {}
  };

  const toggleVoiceInput = () => {
    if (typeof window === "undefined") return;
    const SpeechRec =
      (window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;

    if (!SpeechRec) {
      alert("Voice input is supported in Chrome / Edge browsers.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const rec = new SpeechRec() as {
        lang: string;
        interimResults: boolean;
        onresult: (e: { results: { 0: { 0: { transcript: string } } } }) => void;
        onerror: () => void;
        onend: () => void;
        start: () => void;
      };
      rec.lang = "en-US";
      rec.interimResults = false;
      setIsListening(true);
      sfx.playClick();
      rec.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          askQuestion(transcript);
        }
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  const askQuestion = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;

    sfx.playClick();
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const json = await res.json();
      sfx.playBleep();
      const replyText = json.reply || "Comms glitch — check the Dossier or download /api/resume!";
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: replyText,
        },
      ]);
      speakText(replyText);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Signal lost. Try asking again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-40">
      {!isOpen ? (
        <button
          onClick={() => {
            sfx.playBleep();
            setIsOpen(true);
          }}
          className="group flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl glass-vice border border-[#00f0ff]/60 shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:scale-105 active:scale-95 transition-all font-mono text-xs"
          title="Ask Lester AI about Devesh"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-[#00f0ff]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="font-black text-white tracking-wider">ASK LESTER AI</div>
            <div className="text-[9px] text-[#00f0ff]">RECRUITER INTEL BOT</div>
          </div>
        </button>
      ) : (
        <div className="w-[calc(100vw-1.5rem)] sm:w-[370px] glass-vice border-2 border-[#00f0ff]/60 rounded-3xl shadow-[0_0_40px_rgba(0,240,255,0.3)] overflow-hidden flex flex-col max-h-[80vh] sm:max-h-[480px]">
          {/* Header */}
          <div className="px-4 py-3 bg-black/70 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono">
              <Bot className="w-4 h-4 text-[#00f0ff]" />
              <div>
                <div className="text-xs font-black text-white">LESTER // AI OPERATIVE</div>
                <div className="text-[9px] text-emerald-400">ONLINE • LIVE RESUME INTEL</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const next = !voiceEnabled;
                  setVoiceEnabled(next);
                  if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  voiceEnabled
                    ? "bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]"
                    : "bg-black/60 border-white/10 text-gray-400 hover:text-white"
                }`}
                title={voiceEnabled ? "Mute Lester Voice" : "Enable Lester Voice Reply"}
              >
                {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-black/60 border border-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                  m.role === "user"
                    ? "ml-8 bg-gradient-to-r from-[#ff2a85]/80 to-[#7b00ff]/80 text-white font-sans"
                    : "mr-6 bg-black/70 border border-white/10 text-gray-200 font-mono text-[11px]"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="mr-6 p-2.5 rounded-2xl bg-black/70 border border-white/10 text-[#00f0ff] font-mono text-[11px] animate-pulse">
                DECRYPTING DOSSIER...
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-1.5 flex flex-wrap gap-1.5 border-t border-white/10 bg-black/40">
            {QUICK_PROMPTS.map((qp) => (
              <button
                key={qp}
                type="button"
                onClick={() => askQuestion(qp)}
                className="px-2 py-1 rounded-full bg-black/70 border border-[#00f0ff]/35 hover:border-[#ff2a85] text-[10px] font-mono text-cyan-200 hover:text-white transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-2.5 h-2.5 text-[#ff2a85]" />
                <span>{qp}</span>
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              askQuestion(input);
            }}
            className="p-2.5 bg-black/80 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about skills, projects..."
              className="flex-1 bg-black/70 border border-gray-700 focus:border-[#00f0ff] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
            />
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2 rounded-xl border transition-all ${
                isListening
                  ? "bg-red-500 border-red-400 text-white animate-pulse"
                  : "bg-black/70 border-gray-700 hover:border-[#ff2a85] text-gray-300 hover:text-white"
              }`}
              title="Speak your question"
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="p-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00a8ff] text-black hover:brightness-110 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
