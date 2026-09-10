"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AANP_FNP_FOUR_WEEK_PLAN,
  AANP_FNP_STUDY_PRESETS,
  aanpFnpPresetPracticeHref,
  type AanpFnpStudyPreset,
} from "@/lib/exam-prep/aanp-fnp/study-presets";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
};

const FEATURED_IDS = new Set([
  "assess-domain-block",
  "plan-domain-block",
  "sata-mastery",
  "pharm-therapeutics-block",
  "timed-full-mock",
]);

export function AanpFnpStudyPresetsPanel({ examSlug }: Props) {
  const [weekOpen, setWeekOpen] = useState<number | null>(1);

  if (examSlug !== "aanp-fnp") return null;

  const featured = AANP_FNP_STUDY_PRESETS.filter((p) => FEATURED_IDS.has(p.id));
  const rest = AANP_FNP_STUDY_PRESETS.filter((p) => !FEATURED_IDS.has(p.id));

  return (
    <div className="mt-8 space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">
          AANP FNP Study Path
        </h2>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Domain blocks, lifespan drills, pharm, preventive care, SATA, and a timed full mock —
          packaged like top FNP QBanks.{" "}
          <Link
            href="/aanp-fnp/study-guide"
            className="font-medium text-[var(--color-accent)] underline-offset-2 hover:underline"
          >
            Open the FNP Study Guide
          </Link>
          .
        </p>
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
          More blocks
        </h3>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {rest.map((preset) => (
            <PresetCard key={preset.id} examSlug={examSlug} preset={preset} />
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          4-week plan
        </h3>
        <div className="mt-3 space-y-2">
          {AANP_FNP_FOUR_WEEK_PLAN.map((week) => {
            const open = weekOpen === week.week;
            return (
              <div
                key={week.week}
                className="overflow-hidden rounded-xl border border-black/[0.06] bg-white"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[var(--color-ink)]"
                  onClick={() => setWeekOpen(open ? null : week.week)}
                  aria-expanded={open}
                >
                  <span>
                    Week {week.week}: {week.title}
                  </span>
                  <span className="text-[var(--color-ink-muted)]">{open ? "−" : "+"}</span>
                </button>
                {open ? (
                  <ul className="border-t border-black/[0.04] px-4 py-3 text-sm text-[var(--color-ink-muted)]">
                    {week.days.map((day) => (
                      <li key={day.day} className="flex flex-wrap items-baseline gap-2 py-1.5">
                        <span className="w-14 shrink-0 font-medium text-[var(--color-ink)]">
                          Day {day.day}
                        </span>
                        <span>{day.label}</span>
                        {day.presetIds.map((id) => {
                          const preset = AANP_FNP_STUDY_PRESETS.find((p) => p.id === id);
                          if (!preset) return null;
                          return (
                            <Link
                              key={id}
                              href={aanpFnpPresetPracticeHref(examSlug, preset)}
                              className="text-[var(--color-accent)] underline-offset-2 hover:underline"
                            >
                              Start
                            </Link>
                          );
                        })}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
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
  preset: AanpFnpStudyPreset;
  featured?: boolean;
}) {
  return (
    <li
      className={cn(
        "rounded-xl border bg-white p-4",
        featured ? "border-[var(--color-accent)]/30" : "border-black/[0.06]"
      )}
    >
      <p className="font-semibold text-[var(--color-ink)]">{preset.title}</p>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{preset.description}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-xs text-[var(--color-ink-muted)]">
          {preset.count}Q{preset.timed ? " · timed" : ""}
        </span>
        <Link
          href={aanpFnpPresetPracticeHref(examSlug, preset)}
          className="text-sm font-medium text-[var(--color-accent)] underline-offset-2 hover:underline"
        >
          Practice
        </Link>
      </div>
    </li>
  );
}
