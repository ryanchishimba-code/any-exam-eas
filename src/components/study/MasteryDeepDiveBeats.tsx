"use client";

import { buildFiveDeepDiveBeats } from "@/lib/engine/mastery/deep-dive-beats";
import { naplexCalcPatternsForFlags } from "@/lib/pharmacy/lab-teaching-ranges";
import type { StudyQuestion } from "@/lib/questions/types";
import type { ExamSlug } from "@/types/edtech";

/** Five-beat Deep Dive outline shown under the existing rationale on miss. */
export function MasteryDeepDiveBeats({
  question,
  missed,
  examSlug,
  calcFlags,
}: {
  question: StudyQuestion;
  missed: boolean;
  examSlug?: ExamSlug;
  calcFlags?: string[];
}) {
  if (!missed) return null;
  const beats = buildFiveDeepDiveBeats(question);
  const calcPatterns =
    examSlug === "naplex" ? naplexCalcPatternsForFlags(calcFlags) : [];

  return (
    <div className="space-y-3 rounded-xl border border-[var(--color-border)]/70 bg-[var(--color-surface)]/70 p-3 sm:p-4">
      <p className="text-[12px] font-semibold text-[var(--color-ink)]">Deep Dive beats</p>
      <ol className="space-y-2.5">
        {beats.map((beat) => (
          <li key={beat.id}>
            <p className="text-[12px] font-semibold text-[var(--color-ink)]">{beat.title}</p>
            <p className="mt-0.5 whitespace-pre-wrap text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
              {beat.body}
            </p>
            {beat.id === "why_correct" && calcPatterns.length > 0 ? (
              <ul className="mt-2 space-y-0.5 rounded-lg bg-black/[0.03] px-2.5 py-2 text-[12px] text-[var(--color-ink-muted)]">
                <li className="font-semibold text-[var(--color-ink)]">
                  Calc pattern card
                </li>
                {calcPatterns.map((c) => (
                  <li key={c.id}>• {c.label}</li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="text-[11px] text-[var(--color-ink-muted)]">
        AI Tutor stays optional under beat 2 in the panel below.
      </p>
    </div>
  );
}
