"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { LearningQuiltContent, QuiltTile } from "@/lib/ai";
import { Button } from "./ui/Button";

type Mode = "flashcards" | "quiz" | "mixed";

export function LearningQuiltStudio() {
  const [field, setField] = useState("Medicine");
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<Mode>("mixed");
  const [loading, setLoading] = useState(false);
  const [quilt, setQuilt] = useState<LearningQuiltContent | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function buildQuilt(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setQuilt(null);
    setStatus("Gathering OER textbooks and web sources for your topic…");

    try {
      const res = await fetch("/api/learn/quilt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, topic, preferredMode: mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setQuilt(data.quilt);
      setActiveIndex(0);
      setFlipped(false);
      setStatus("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  const tiles = quilt?.tiles ?? [];
  const current: QuiltTile | undefined = tiles[activeIndex];

  return (
    <div className="mt-10">
      <form onSubmit={buildQuilt} className="apple-card p-8 md:p-10">
        <div className="grid gap-6 md:grid-cols-2">
          <input
            value={field}
            onChange={(e) => setField(e.target.value)}
            placeholder="Field"
            className="apple-input"
            required
          />
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic"
            className="apple-input"
            required
          />
        </div>

        <p className="apple-label mt-6">Preferred learning mode</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["flashcards", "quiz", "mixed"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-2 text-sm capitalize transition ${
                mode === m
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-white text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <Button type="submit" disabled={loading}>
            {loading ? "Researching & weaving…" : "Build learning quilt"}
          </Button>
          {loading && status && (
            <p className="text-xs text-[var(--color-ink-muted)]">{status}</p>
          )}
        </div>
        {error && (
          <p className="mt-4 text-sm text-red-600">
            {error}. <a href="/signup" className="underline">Create an account</a>.
          </p>
        )}
      </form>

      {quilt && current && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold">{quilt.title}</h2>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Recommended: {quilt.recommendedMode} · Tile {activeIndex + 1} of {tiles.length}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {tiles.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActiveIndex(i);
                  setFlipped(false);
                }}
                className={`aspect-square rounded-2xl border-2 p-3 text-left text-xs transition ${
                  i === activeIndex
                    ? "border-[var(--color-accent)] bg-blue-50"
                    : "border-black/10 bg-[var(--color-surface)] hover:border-black/20"
                }`}
              >
                <span className="font-medium">{t.type}</span>
                <p className="mt-1 line-clamp-3 text-[var(--color-ink-muted)]">{t.front}</p>
              </button>
            ))}
          </div>

          <motion.button
            type="button"
            key={`${activeIndex}-${flipped}`}
            initial={{ rotateY: flipped ? 180 : 0 }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            onClick={() => setFlipped(!flipped)}
            className="mt-8 flex min-h-[200px] w-full flex-col items-center justify-center rounded-3xl bg-[var(--color-ink)] p-8 text-center text-white"
          >
            <p className="text-lg font-medium">
              {flipped ? current.back : current.front}
            </p>
            {!flipped && current.hint && (
              <p className="mt-2 text-sm text-neutral-400">{current.hint}</p>
            )}
            <p className="mt-4 text-xs text-neutral-500">Tap to flip</p>
          </motion.button>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => {
                setActiveIndex((i) => i - 1);
                setFlipped(false);
              }}
              className="text-sm text-[var(--color-accent)] disabled:opacity-30"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={activeIndex >= tiles.length - 1}
              onClick={() => {
                setActiveIndex((i) => i + 1);
                setFlipped(false);
              }}
              className="text-sm text-[var(--color-accent)] disabled:opacity-30"
            >
              Next tile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
