"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DomainMap } from "@/components/dashboard/DomainMap";
import { ReadinessRing } from "@/components/study/ReadinessRing";
import type { ExamRoadmapData } from "@/lib/learning/exam-roadmap";
import { buildPracticeReadinessSummary } from "@/lib/learning/honest-readiness";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { EXAM_SELECTION_THEMES } from "@/lib/edtech/exam-selection-theme";
import { fullExamHref } from "@/lib/routes";
import { domainTilesFromRoadmap } from "@/lib/study/domain-map";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

type Props = {
  data: ExamRoadmapData;
};

export function ExamRoadmapDashboard({ data }: Props) {
  const exam = EXAM_CATALOG[data.examSlug];
  const theme = EXAM_SELECTION_THEMES[data.examSlug];
  const ExamIcon = theme.icon;
  const tiles = domainTilesFromRoadmap(data);
  const readiness = buildPracticeReadinessSummary(data);
  const nextTile = tiles.find((t) => t.highlighted) ?? tiles[0];
  const fullExam = fullExamHref(data.examSlug);

  const primaryCta = data.launch.canContinue
    ? { href: fullExam, label: "Continue exam" }
    : nextTile
      ? { href: nextTile.practiceHref, label: `Practice ${nextTile.label}` }
      : { href: fullExam, label: "Start a practice exam" };

  return (
    <div className={cn(dbUi.page, "space-y-6")}>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-[var(--shadow-apple-sm)]",
              theme.gradient
            )}
          >
            <ExamIcon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className={dbUi.eyebrow}>Blueprint map</p>
            <h1 className={cn(dbUi.title, "mt-0.5")}>{exam.name}</h1>
            <p className={cn(dbUi.subtitle, "mt-1.5 max-w-xl")}>
              Tile size is exam weight. Fill is practice readiness. Tap a domain to drill.
            </p>
          </div>
        </div>
        <ReadinessRing
          score={readiness.overallScore}
          size={112}
          label={readiness.bandLabel}
        />
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <Link href={primaryCta.href} className={dbUi.primaryBtn}>
          {primaryCta.label}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
        <Link
          href={fullExam}
          className="text-[12px] font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] hover:underline"
        >
          Full exam options
        </Link>
      </div>

      {tiles.length > 0 ? (
        <section className="space-y-3" aria-labelledby="roadmap-map-heading">
          <div className="flex items-end justify-between gap-3 px-0.5">
            <h2 id="roadmap-map-heading" className={dbUi.sectionTitle}>
              All blueprint areas
            </h2>
            <p className={dbUi.sectionHint}>
              {data.overallPushCoveragePct}% bank coverage · {data.totalAttempts} answers
            </p>
          </div>
          <DomainMap
            tiles={tiles}
            variant="full"
            aria-label={`${exam.shortName} blueprint domains`}
          />
        </section>
      ) : null}

      {data.totalAttempts === 0 ? (
        <div className={cn(dbUi.surface, "px-4 py-5 text-center")}>
          <p className={dbUi.sectionHint}>No practice yet — start here to fill the map.</p>
          <Link href={fullExam} className={cn(dbUi.primaryBtn, "mt-3")}>
            Start practicing
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      ) : null}

      <details className="rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-surface)]/40 px-3 py-2">
        <summary className="cursor-pointer text-[12px] font-semibold text-[var(--color-ink-muted)]">
          Why {readiness.bandLabel}?
        </summary>
        <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
          {readiness.reason}
        </p>
        <p className="mt-2 border-t border-[var(--color-border)]/60 pt-2 text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
          {readiness.disclaimer}
        </p>
      </details>
    </div>
  );
}
