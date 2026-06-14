"use client";

import { useState } from "react";
import Link from "next/link";
import type { LearningQuiltContent, QuiltTile } from "@/lib/ai";
import { DEFAULT_STUDY_FIELD_LABEL } from "@/lib/fields";
import { Button } from "./ui/Button";
import { StudyModePicker } from "./StudyModePicker";
import { StudySubnav } from "./StudySubnav";
import { QuiltTileViewer } from "./QuiltTileViewer";
import { InlineError } from "@/components/ui/StatusMessage";
import { EndActivityControl } from "@/components/study/EndActivityControl";
import { ActivitySessionToolbar } from "@/components/study/ActivitySessionToolbar";
import type { ActivitySessionSummary } from "@/lib/client/exam-session-summary";

type TileFilter = "flashcards" | "quiz" | "all";

export function LearningQuiltStudio() {
  const [field, setField] = useState(DEFAULT_STUDY_FIELD_LABEL);
  const [topic, setTopic] = useState("");
  const [tileFilter, setTileFilter] = useState<TileFilter>("flashcards");
  const [loading, setLoading] = useState(false);
  const [quilt, setQuilt] = useState<LearningQuiltContent | null>(null);
  const [quiltId, setQuiltId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const preferredMode =
    tileFilter === "flashcards" ? "flashcards" : tileFilter === "quiz" ? "quiz" : "mixed";

  async function buildQuilt(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setQuilt(null);
    setQuiltId(null);
    setMasteredIds(new Set());
    setStatus("Gathering OER textbooks and web sources for your topic…");

    try {
      const res = await fetch("/api/learn/quilt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, topic, preferredMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setQuilt(data.quilt);
      setQuiltId(data.quiltId ?? null);
      setActiveIndex(0);
      setStatus("");

      if (data.quiltId) {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            entityType: "quilt",
            entityId: data.quiltId,
            metadata: {
              action: "session",
              title: data.quilt.title,
              field,
              topic,
              mode: preferredMode,
            },
          }),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  const allTiles = quilt?.tiles ?? [];
  const tiles = filterTiles(allTiles, tileFilter);
  const current: QuiltTile | undefined = tiles[activeIndex];
  const progressPct =
    tiles.length > 0 ? Math.round((masteredIds.size / tiles.length) * 100) : 0;

  async function markMastered(tile: QuiltTile) {
    setMasteredIds((prev) => new Set(prev).add(tile.id));
    if (quiltId) {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType: "quilt",
          entityId: quiltId,
          score: progressPct,
          metadata: {
            action: "tile_mastered",
            tileId: tile.id,
            title: quilt?.title,
            field,
          },
        }),
      });
    }
    if (activeIndex < tiles.length - 1) {
      setActiveIndex((i) => i + 1);
    }
  }

  return (
    <div className="mt-6">
      <StudySubnav />
      <div className="mt-8">
        <p className="apple-label">Study format</p>
        <div className="mt-3">
          <StudyModePicker compact />
        </div>
        <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
          On this page: flashcards and mini-quiz tiles. For full timed exams, use the{" "}
          <Link href="/full-exam" className="text-[var(--color-accent)] underline">
            timed exam
          </Link>
          .
        </p>
      </div>

      <form onSubmit={buildQuilt} className="apple-card mt-10 p-8 md:p-10">
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

        <p className="apple-label mt-6">Tile type for this quilt</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              { id: "flashcards" as const, label: "Flashcards only" },
              { id: "quiz" as const, label: "Mini-quiz tiles" },
              { id: "all" as const, label: "Mixed" },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setTileFilter(m.id);
                setActiveIndex(0);
              }}
              className={`rounded-full px-4 py-2 text-sm transition ${
                tileFilter === m.id
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-white text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <Button type="submit" disabled={loading}>
            {loading ? "Researching & weaving…" : "Build learning quilt"}
          </Button>
          {loading && status && (
            <p className="mt-2 text-xs text-[var(--color-ink-muted)]">{status}</p>
          )}
        </div>
        {error && (
          <InlineError className="mt-4">
            {error}. <a href="/signup" className="underline">Create an account</a>.
          </InlineError>
        )}
      </form>

      {quilt && tiles.length > 0 && current && (
        <div className="mt-12">
          <ActivitySessionToolbar
            actions={
              <>
                <div className="min-w-[120px] text-right">
                  <p className="text-xs text-[var(--color-ink-muted)]">Progress</p>
                  <p className="text-sm font-semibold tabular-nums text-[var(--color-accent)]">
                    {masteredIds.size}/{tiles.length} mastered
                  </p>
                </div>
                <EndActivityControl
                  kind="activity"
                  onConfirm={async (): Promise<ActivitySessionSummary> => {
                    if (quiltId) {
                      const res = await fetch("/api/progress", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          entityType: "quilt",
                          entityId: quiltId,
                          score: progressPct,
                          metadata: {
                            action: "session_ended",
                            masteredCount: masteredIds.size,
                            totalTiles: tiles.length,
                            field,
                            topic,
                          },
                        }),
                      });
                      if (!res.ok) {
                        throw new Error("Could not save quilt progress.");
                      }
                    }
                    return {
                      title: quilt.title,
                      activityType: "quilt",
                      mastered: masteredIds.size,
                      total: tiles.length,
                      progressPct,
                      endedEarly: true,
                    };
                  }}
                />
              </>
            }
          >
            <div>
              <h2 className="text-lg font-semibold sm:text-xl">{quilt.title}</h2>
              <p className="mt-0.5 text-sm text-[var(--color-ink-muted)]">
                {tileFilter === "flashcards"
                  ? "Flashcard mode"
                  : tileFilter === "quiz"
                    ? "Mini-quiz mode"
                    : "Mixed tiles"}{" "}
                · Tile {activeIndex + 1} of {tiles.length}
              </p>
            </div>
          </ActivitySessionToolbar>

          <div className="mt-8 grid gap-3 sm:grid-cols-4 md:grid-cols-6">
            {tiles.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`aspect-square rounded-2xl border-2 p-3 text-left text-xs transition ${
                  i === activeIndex
                    ? "border-[var(--color-accent)] bg-blue-50 ring-2 ring-[var(--a11y-focus)]"
                    : masteredIds.has(t.id)
                      ? "border-blue-600 bg-blue-50"
                      : "border-black/10 bg-[var(--color-surface)] hover:border-black/20"
                }`}
                aria-current={i === activeIndex ? "true" : undefined}
                aria-label={
                  masteredIds.has(t.id)
                    ? `${t.type} tile ${i + 1}, mastered`
                    : `${t.type} tile ${i + 1}`
                }
              >
                <span className="font-medium capitalize">{t.type}</span>
                {masteredIds.has(t.id) && (
                  <span className="mt-0.5 block text-[0.625rem] font-semibold uppercase tracking-wide text-[var(--a11y-correct-fg)]">
                    Mastered
                  </span>
                )}
                <p className="mt-1 line-clamp-3 text-[var(--color-ink-muted)]">{t.front}</p>
              </button>
            ))}
          </div>

          <div className="mt-8">
            <QuiltTileViewer tile={current} onMastered={() => markMastered(current)} />
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => setActiveIndex((i) => i - 1)}
              className="text-sm font-medium text-[var(--color-accent)] disabled:opacity-30"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={activeIndex >= tiles.length - 1}
              onClick={() => setActiveIndex((i) => i + 1)}
              className="text-sm font-medium text-[var(--color-accent)] disabled:opacity-30"
            >
              Next tile
            </button>
          </div>
        </div>
      )}

      {quilt && tiles.length === 0 && (
        <p className="mt-8 text-sm text-[var(--color-ink-muted)]">
          No tiles match this filter. Try &quot;Mixed&quot; or rebuild the quilt.
        </p>
      )}
    </div>
  );
}

function filterTiles(tiles: QuiltTile[], filter: TileFilter): QuiltTile[] {
  if (filter === "all") return tiles;
  if (filter === "flashcards") return tiles.filter((t) => t.type === "flashcard");
  return tiles.filter((t) => t.type === "quiz");
}
