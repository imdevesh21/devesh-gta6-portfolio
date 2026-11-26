"use client";

import React, { useState, useRef, useEffect } from "react";
import { sfx } from "@/lib/soundFx";
import { Bot, X, Send, Sparkles, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface ChatMessage {
  role: "bot" | "user";
  text: string;
}

const DEFAULT_QUICK_PROMPTS = [
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
  const [voiceError, setVoiceError] = useState<string>("");
  const [assistantName, setAssistantName] = useState("LESTER // AI OPERATIVE");
  const [quickPrompts, setQuickPrompts] = useState<string[]>(DEFAULT_QUICK_PROMPTS);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Yo! I'm Lester — Devesh's AI Operative. Ask me anything about his Next.js/SQL stack, Vyn Automation impact, projects, or resume!",
    },
  ]);

  useEffect(() => {
    fetch("/api/llm-config")
      .then((r) => r.json())
      .then((json) => {
        if (json.config) {
          if (json.config.assistantName) setAssistantName(json.config.assistantName);
          if (Array.isArray(json.config.quickPrompts) && json.config.quickPrompts.length > 0) {
            setQuickPrompts(json.config.quickPrompts);
          }
          if (json.config.greetingMessage) {
            setMessages([{ role: "bot", text: json.config.greetingMessage }]);
          }
        }
      })
      .catch(() => {});
  }, []);

  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {}
    };
  }, []);

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

  const toggleVoiceInput = async () => {
    if (typeof window === "undefined") return;
    setVoiceError("");

    const SpeechRec =
      (window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;

    if (!SpeechRec) {
      setVoiceError("Voice input is only supported in Chrome / Edge.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
      recognitionRef.current = null;
      return;
    }

    // Request mic permission explicitly first so browsers don't silently abort SpeechRecognition
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      } catch {
        setVoiceError("Mic permission denied. Allow microphone access in browser settings.");
        return;
      }
    }

    try {
      const rec = new SpeechRec() as {
        lang: string;
        continuous: boolean;
        interimResults: boolean;
        maxAlternatives: number;
        onstart: () => void;
        onresult: (e: {
          results: ArrayLike<{ isFinal?: boolean; 0: { transcript: string } }>;
        }) => void;
        onerror: (e: { error?: string }) => void;
        onend: () => void;
        start: () => void;
        stop: () => void;
      };
      recognitionRef.current = rec;
      rec.lang = "en-US";
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      let latestTranscript = "";
      let sent = false;

      rec.onstart = () => {
        setIsListening(true);
        setVoiceError("");
      };

      rec.onresult = (event) => {
        const lastIdx = event.results.length - 1;
        const result = event.results?.[lastIdx];
        const transcript = result?.[0]?.transcript?.trim() || "";
        if (!transcript) return;

        latestTranscript = transcript;
        if (result.isFinal) {
          sent = true;
          try {
            rec.stop();
          } catch {}
          setInput("");
          askQuestion(transcript);
        } else {
          setInput(transcript);
        }
      };

      rec.onerror = (event) => {
        const errCode = event?.error || "unknown";
        if (errCode === "not-allowed" || errCode === "service-not-allowed") {
          setVoiceError("Microphone / Speech service blocked by browser.");
        } else if (errCode === "audio-capture") {
          setVoiceError("No microphone detected on this device.");
        } else if (errCode === "network") {
          setVoiceError("Speech service network error (try Chrome on HTTPS).");
        } else if (errCode === "no-speech") {
          setVoiceError("No speech detected — tap mic and speak closer.");
        } else if (errCode !== "aborted") {
          setVoiceError(`Voice error: ${errCode}`);
        }
        setIsListening(false);
        recognitionRef.current = null;
      };

      rec.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
        if (!sent && latestTranscript) {
          setInput("");
          askQuestion(latestTranscript);
        }
      };

      setIsListening(true);
      rec.start();
    } catch {
      setIsListening(false);
      recognitionRef.current = null;
      setVoiceError("Could not start microphone listener.");
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
                <div className="text-xs font-black text-white">{assistantName}</div>
                {isListening ? (
                  <div className="text-[9px] text-[#ff2a85] font-bold flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span>LISTENING // VOICE UPLINK</span>
                  </div>
                ) : (
                  <div className="text-[9px] text-emerald-400">ONLINE • LIVE RESUME INTEL</div>
                )}
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
            {quickPrompts.map((qp) => (
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

          {/* Voice Error Notice (if browser blocks mic/speech) */}
          {voiceError && !isListening && (
            <div className="px-3.5 py-1.5 bg-red-950/80 border-t border-red-500/40 text-[10px] font-mono text-red-300 flex items-center justify-between gap-2">
              <span>⚠️ {voiceError}</span>
              <button
                type="button"
                onClick={() => setVoiceError("")}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {/* Live Voice Listening Indicator Banner */}
          {isListening && (
            <div className="px-3.5 py-2 bg-gradient-to-r from-[#ff2a85]/20 via-red-950/60 to-[#00f0ff]/15 border-t border-[#ff2a85]/50 flex items-center justify-between gap-2 font-mono">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <span className="text-[11px] font-bold text-white tracking-wide">
                  LESTER IS LISTENING...
                </span>
                {/* Animated Equalizer Bars */}
                <div className="flex items-end gap-0.5 h-3.5" aria-hidden="true">
                  <span className="w-0.5 bg-[#00f0ff] rounded-full animate-bounce h-2" style={{ animationDelay: "0ms" }} />
                  <span className="w-0.5 bg-[#ff2a85] rounded-full animate-bounce h-3.5" style={{ animationDelay: "120ms" }} />
                  <span className="w-0.5 bg-[#00f0ff] rounded-full animate-bounce h-2.5" style={{ animationDelay: "240ms" }} />
                  <span className="w-0.5 bg-[#ff2a85] rounded-full animate-bounce h-3" style={{ animationDelay: "360ms" }} />
                </div>
              </div>
              <button
                type="button"
                onClick={toggleVoiceInput}
                className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 border border-red-400/50 text-red-200 hover:bg-red-500 hover:text-white transition-colors"
              >
                STOP
              </button>
            </div>
          )}

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
              placeholder={isListening ? "Listening... speak now" : "Ask about skills, projects..."}
              className={`flex-1 bg-black/70 border rounded-xl px-3 py-2 text-xs text-white font-mono outline-none transition-colors ${
                isListening ? "border-[#ff2a85] placeholder:text-[#ff85b8]" : "border-gray-700 focus:border-[#00f0ff]"
              }`}
            />
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`relative p-2 rounded-xl border transition-all ${
                isListening
                  ? "bg-red-500 border-red-400 text-white shadow-[0_0_16px_rgba(239,68,68,0.75)]"
                  : "bg-black/70 border-gray-700 hover:border-[#ff2a85] text-gray-300 hover:text-white"
              }`}
              title={isListening ? "Stop listening" : "Speak your question"}
            >
              {isListening && (
                <span className="absolute -inset-1 rounded-xl border border-red-400 animate-ping opacity-60 pointer-events-none" />
              )}
              {isListening ? <MicOff className="w-3.5 h-3.5 relative z-10" /> : <Mic className="w-3.5 h-3.5" />}
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
