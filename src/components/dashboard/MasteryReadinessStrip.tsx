"use client";

import type { MasteryRollup } from "@/lib/engine/mastery/types";
import { cellStateLabel } from "@/lib/engine/mastery/transitions";

/** Readiness strip: coverage, competence, top 3 leaks (omit empty tiles). */
export function MasteryReadinessStrip({ rollup }: { rollup: MasteryRollup }) {
  const tiles: Array<{ label: string; value: string; detail?: string }> = [];
  if (rollup.coveragePct !== null) {
    tiles.push({
      label: "Coverage",
      value: `${rollup.coveragePct}%`,
      detail: "Skill Cells touched",
    });
  }
  if (rollup.competencePct !== null) {
    tiles.push({
      label: "Competence",
      value: `${rollup.competencePct}%`,
      detail: "Stable or exam-ready weight",
    });
  }
  if (rollup.topLeaks.length > 0) {
    tiles.push({
      label: "Top leaks",
      value: String(rollup.topLeaks.length),
      detail: rollup.topLeaks
        .map((l) => `${l.topicLabel} (${cellStateLabel(l.state)})`)
        .join(" · "),
    });
  }
  if (tiles.length === 0) return null;

  return (
    <section
      aria-label="Mastery readiness"
      className="grid gap-3 sm:grid-cols-3"
    >
      {tiles.map((t) => (
        <div
          key={t.label}
          className="rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)] px-4 py-3"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            {t.label}
          </p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-[var(--color-ink)]">
            {t.value}
          </p>
          {t.detail ? (
            <p className="mt-1 text-[11px] leading-snug text-[var(--color-ink-muted)]">
              {t.detail}
            </p>
          ) : null}
        </div>
      ))}
    </section>
  );
}
