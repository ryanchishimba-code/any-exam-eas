"use client";

import Link from "next/link";
import { useState } from "react";
import {
  NCLEX_DIFFICULTY_TIERS,
  NCLEX_FOUR_WEEK_PLAN,
  NCLEX_STUDY_PRESETS,
  nclexPresetModuleHref,
  nclexPresetPracticeHref,
  nclexCatExamHref,
  type NclexStudyPreset,
} from "@/lib/exam-prep/nclex/study-presets";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
};

export function NclexStudyPresetsPanel({ examSlug }: Props) {
  const [weekOpen, setWeekOpen] = useState<number | null>(1);

  if (examSlug !== "nclex") return null;

  const featured = NCLEX_STUDY_PRESETS.filter((p) =>
    [
      "prioritization-workshop",
      "sata-mastery",
      "dosage-calc-sprint",
      "trap-tier-drill",
      "cat-full-exam",
    ].includes(p.id)
  );

  return (
    <div className="mt-8 space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">First-Attempt Study Path</h2>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Curated blocks for prioritization, SATA, calculations, trap-tier judgment, and CAT-style exams.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {(Object.keys(NCLEX_DIFFICULTY_TIERS) as (keyof typeof NCLEX_DIFFICULTY_TIERS)[]).map(
            (tier) => (
              <div
                key={tier}
                className="rounded-xl border border-black/[0.06] bg-white px-4 py-3 text-sm"
              >
                <p className="font-semibold text-[var(--color-ink)]">
                  {NCLEX_DIFFICULTY_TIERS[tier].label}
                </p>
                <p className="mt-1 text-[var(--color-ink-muted)]">
                  {NCLEX_DIFFICULTY_TIERS[tier].description}
                </p>
              </div>
            )
          )}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Featured presets
        </h3>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {featured.map((preset) => (
            <PresetCard key={preset.id} examSlug={examSlug} preset={preset} featured />
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Module-linked blocks
        </h3>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {NCLEX_STUDY_PRESETS.filter((p) => p.reviewModuleSlug && !featured.some((f) => f.id === p.id)).map(
            (preset) => (
              <PresetCard key={preset.id} examSlug={examSlug} preset={preset} />
            )
          )}
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          4-week plan
        </h3>
        <div className="mt-3 space-y-2">
          {NCLEX_FOUR_WEEK_PLAN.map((week) => (
            <div key={week.week} className="rounded-xl border border-black/[0.06] bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left"
                onClick={() => setWeekOpen(weekOpen === week.week ? null : week.week)}
              >
                <span className="font-medium text-[var(--color-ink)]">
                  Week {week.week}: {week.title}
                </span>
                <span className="text-xs text-[var(--color-ink-muted)]">
                  {weekOpen === week.week ? "Hide" : "Show"}
                </span>
              </button>
              {weekOpen === week.week ? (
                <ul className="border-t border-black/[0.06] px-4 py-3 text-sm text-[var(--color-ink-muted)]">
                  {week.days.map((day) => (
                    <li key={day.day} className="py-1.5">
                      <span className="font-medium text-[var(--color-ink)]">Day {day.day}:</span>{" "}
                      {day.label}
                      {day.moduleSlugs?.[0] ? (
                        <>
                          {" "}
                          <Link
                            href={nclexPresetModuleHref(examSlug, day.moduleSlugs[0])}
                            className="text-[var(--color-accent)] underline-offset-2 hover:underline"
                          >
                            Module
                          </Link>
                        </>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PresetCard({
  examSlug,
  preset,
  featured,
}: {
  examSlug: ExamSlug;
  preset: NclexStudyPreset;
  featured?: boolean;
}) {
  const practiceHref =
    preset.id === "cat-full-exam"
      ? nclexCatExamHref(examSlug)
      : nclexPresetPracticeHref(examSlug, preset);

  return (
    <li
      className={cn(
        "list-none rounded-xl border border-black/[0.06] bg-white p-4",
        featured && "ring-1 ring-[var(--color-accent)]/20"
      )}
    >
      <p className="font-semibold text-[var(--color-ink)]">{preset.title}</p>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{preset.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={practiceHref}
          className="rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-white"
        >
          Start {preset.count}Q
        </Link>
        {preset.reviewModuleSlug ? (
          <Link
            href={nclexPresetModuleHref(examSlug, preset.reviewModuleSlug)}
            className="rounded-lg border border-black/[0.08] px-3 py-1.5 text-xs font-medium"
          >
            Review module
          </Link>
        ) : null}
      </div>
    </li>
  );
}
