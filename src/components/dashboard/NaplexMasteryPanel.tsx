"use client";

import { useEffect, useState } from "react";
import { NAPLEX_OUTLINE_2025 } from "@/lib/pharmacy/naplex-outline-2025";
import type { CellState } from "@/lib/engine/mastery/types";
import { cn } from "@/lib/utils";

type DomainTile = {
  domain: number;
  id: string;
  label: string;
  weight: number;
  cellState: CellState;
  cellsTouched: number;
  cellsTotal: number;
};

type Rollup = {
  coveragePct: number | null;
  competencePct: number | null;
  topLeaks: Array<{
    cellKey: string;
    systemLabel: string;
    topicLabel: string;
    state: CellState;
    weight: number;
  }>;
};

const STATE_COLOR: Record<CellState, string> = {
  unseen: "bg-[var(--color-border)]/70",
  primed: "bg-sky-300",
  learning: "bg-amber-400",
  shaky: "bg-rose-500",
  stable: "bg-emerald-400",
  exam_ready: "bg-teal-600",
};

const STATE_LABEL: Record<CellState, string> = {
  unseen: "Unseen",
  primed: "Primed",
  learning: "Learning",
  shaky: "Shaky",
  stable: "Stable",
  exam_ready: "Exam-ready",
};

/** Five-domain NAPLEX map + coverage / competence / top leaks. */
export function NaplexMasteryPanel() {
  const [domains, setDomains] = useState<DomainTile[] | null>(null);
  const [rollup, setRollup] = useState<Rollup | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/study/naplex-mastery");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unavailable");
        if (cancelled) return;
        setDomains(data.domains);
        setRollup(data.rollup);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unavailable");
          // Fallback empty map from outline so UI still renders.
          setDomains(
            NAPLEX_OUTLINE_2025.map((d) => ({
              domain: d.domain,
              id: d.id,
              label: d.label,
              weight: d.blueprintWeight,
              cellState: "unseen" as const,
              cellsTouched: 0,
              cellsTotal: 0,
            }))
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!domains) {
    return (
      <section className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/60 p-4">
        <p className="text-[13px] text-[var(--color-ink-muted)]">Loading NAPLEX map…</p>
      </section>
    );
  }

  return (
    <section
      aria-label="NAPLEX mastery map"
      className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/60 p-4 sm:p-5"
    >
      <div className="mb-3">
        <h3 className="text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">
          NAPLEX content map
        </h3>
        <p className="mt-0.5 text-[12px] text-[var(--color-ink-muted)]">
          Five NABP domains · colored by cell state · Domain 3 is 40% of the exam
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-5">
        {domains.map((d) => (
          <div
            key={d.id}
            className="rounded-xl border border-[var(--color-border)]/40 bg-[var(--color-bg)]/50 p-2.5"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-bold text-[var(--color-ink-muted)]">
                D{d.domain}
              </span>
              <span
                className={cn("h-2.5 w-2.5 rounded-full", STATE_COLOR[d.cellState])}
                title={STATE_LABEL[d.cellState]}
              />
            </div>
            <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-snug text-[var(--color-ink)]">
              {d.label}
            </p>
            <p className="mt-1 text-[10px] text-[var(--color-ink-muted)]">
              {d.weight}% · {STATE_LABEL[d.cellState]}
            </p>
          </div>
        ))}
      </div>

      {rollup ? (
        <div className="mt-4 grid gap-3 border-t border-[var(--color-border)]/40 pt-3 sm:grid-cols-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
              Coverage
            </p>
            <p className="text-[18px] font-semibold tabular-nums text-[var(--color-ink)]">
              {rollup.coveragePct == null ? "—" : `${rollup.coveragePct}%`}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
              Competence
            </p>
            <p className="text-[18px] font-semibold tabular-nums text-[var(--color-ink)]">
              {rollup.competencePct == null ? "—" : `${rollup.competencePct}%`}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
              Top leaks
            </p>
            <ul className="mt-0.5 space-y-0.5 text-[12px] text-[var(--color-ink)]">
              {rollup.topLeaks.slice(0, 3).map((leak) => (
                <li key={leak.cellKey} className="truncate">
                  {leak.topicLabel}
                </li>
              ))}
              {rollup.topLeaks.length === 0 ? (
                <li className="text-[var(--color-ink-muted)]">None yet — start Today</li>
              ) : null}
            </ul>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="mt-2 text-[11px] text-[var(--color-ink-muted)]">{error}</p>
      ) : null}
    </section>
  );
}
