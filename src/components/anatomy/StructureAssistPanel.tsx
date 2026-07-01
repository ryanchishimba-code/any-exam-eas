"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Mic, MicOff, Send, Sparkles } from "lucide-react";
import type { AnatomyAssistAction } from "@/lib/anatomy/assist-actions";
import type { AnatomyLayer, AnatomyStructure, AnatomySystem } from "@/lib/anatomy/types";
import { anatomyUi } from "@/lib/anatomy/anatomy-ui";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  examSlug: ExamSlug;
  structure: AnatomyStructure | null;
  visibleLayers: Set<AnatomyLayer>;
  systemFilter: AnatomySystem | "all";
  onExecuteActions: (actions: AnatomyAssistAction[]) => void;
};

type BrowserSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function getSpeechRecognition(): (new () => BrowserSpeechRecognition) | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: new () => BrowserSpeechRecognition;
    webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function StructureAssistPanel({
  examSlug,
  structure,
  visibleLayers,
  systemFilter,
  onExecuteActions,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setError(null);
      setInput("");
      const userMsg: ChatMessage = { role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const res = await fetch("/api/anatomy/assist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examSlug,
            message: trimmed,
            selectedStructureId: structure?.id ?? null,
            visibleLayers: [...visibleLayers],
            systemFilter,
            history: messages.slice(-8),
          }),
        });

        const data = (await res.json()) as {
          reply?: string;
          actions?: AnatomyAssistAction[];
          error?: string;
          aiUnavailable?: boolean;
        };

        if (!res.ok) {
          throw new Error(data.error ?? "Request failed");
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply ?? "Done." },
        ]);

        if (data.actions?.length) {
          onExecuteActions(data.actions);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Could not reach AI tutor";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [examSlug, loading, messages, onExecuteActions, structure?.id, systemFilter, visibleLayers]
  );

  const toggleVoice = useCallback(() => {
    const SpeechCtor = getSpeechRecognition();
    if (!SpeechCtor) {
      setError("Voice input is not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechCtor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) void sendMessage(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    setError(null);
  }, [listening, sendMessage]);

  const suggestions = structure
    ? [
        `What is the function of the ${structure.name}?`,
        `Clinical pearls for ${structure.name}`,
        "Show me related structures",
      ]
    : ["Show the heart", "Peel back the skin", "Explain the cardiovascular system"];

  return (
    <section className={cn(anatomyUi.detailSection, "flex flex-col gap-3 !p-3")}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-cyan-400" aria-hidden />
        <h4 className="text-[14px] font-semibold text-[var(--anatomy-ink)]">AI Anatomy Tutor</h4>
      </div>

      <div
        ref={scrollRef}
        className="max-h-44 space-y-2 overflow-y-auto rounded-[14px] bg-black/25 p-2.5"
      >
        {messages.length === 0 ? (
          <p className="text-[12px] leading-relaxed text-[var(--anatomy-ink-muted)]">
            Ask about {structure?.name ?? "any structure"}. The tutor can highlight anatomy, toggle
            layers, and reset the camera.
          </p>
        ) : (
          messages.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={cn(
                "rounded-[12px] px-3 py-2 text-[13px] leading-relaxed",
                m.role === "user"
                  ? "ml-6 bg-cyan-500/15 text-[var(--anatomy-ink)]"
                  : "mr-4 bg-white/[0.06] text-[var(--anatomy-ink-muted)]"
              )}
            >
              {m.content}
            </div>
          ))
        )}
        {loading ? (
          <div className="flex items-center gap-2 text-[12px] text-[var(--anatomy-ink-muted)]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            Thinking…
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-[12px] text-amber-400" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            disabled={loading}
            onClick={() => void sendMessage(s)}
            className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] text-[var(--anatomy-ink-muted)] transition hover:border-cyan-500/30 hover:text-[var(--anatomy-ink)]"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about anatomy…"
          disabled={loading}
          className={cn(anatomyUi.searchInput, "flex-1 !py-2 text-[14px]")}
          aria-label="Ask the anatomy tutor"
        />
        <button
          type="button"
          onClick={toggleVoice}
          disabled={loading}
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition",
            listening
              ? "border-red-400/50 bg-red-500/20 text-red-300"
              : "border-white/[0.1] bg-white/[0.06] text-[var(--anatomy-ink-muted)] hover:text-[var(--anatomy-ink)]"
          )}
          aria-label={listening ? "Stop voice input" : "Start voice input"}
        >
          {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-white transition hover:bg-cyan-500 disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </section>
  );
}
