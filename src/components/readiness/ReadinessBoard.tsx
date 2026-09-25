"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExamOutcomeForm, type OutcomeChoice } from "@/components/readiness/ExamOutcomeForm";
import { dbUi } from "@/lib/study/dashboard-ui";
import {
  READINESS_LEVEL_LABEL,
  READINESS_THIN_AREA_LABEL,
  type ReadinessLevel,
} from "@/lib/learning/readiness-check/thresholds";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ReadinessPageData } from "@/lib/learning/readiness-check/service";

function levelClass(level: string) {
  if (level === "on_track") return "text-[var(--color-accent)]";
  if (level === "getting_close") return "text-[var(--db-ready-review-text,var(--color-ink))]";
  if (level === "not_yet") return "text-[var(--color-ink)]";
  return "text-[var(--color-ink-muted)]";
}

export function ReadinessBoard({ data }: { data: ReadinessPageData }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<OutcomeChoice | null>(
    data.outcome?.result === "passed" || data.outcome?.result === "not_yet" || data.outcome?.result === "not_taken"
      ? data.outcome.result
      : null
  );

  async function start(restart = false) {
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/readiness/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restart }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error || "Could not start the check.");
      router.push(`${ROUTES.readiness}/check`);
    } catch (err) {
      setPending(false);
      setError(err instanceof Error ? err.message : "Could not start the check.");
    }
  }

  async function saveOutcome(result: OutcomeChoice, examDate: string | null) {
    const res = await fetch("/api/readiness/outcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result, examDate }),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) throw new Error(body.error || "Could not save that.");
    setSaved(result);
    router.refresh();
  }

  const showAreas = data.areas.length > 0;

  return (
    <div className={dbUi.page}>
      <header className="space-y-2">
        <p className={dbUi.eyebrow}>{data.examName} readiness</p>
        <h1 className="text-[32px] font-semibold tracking-[-0.04em] text-[var(--color-ink)] sm:text-[40px]">
          {data.result?.summaryLine ?? "A baseline, then proof you're moving"}
        </h1>
        <p className="max-w-2xl text-[16px] leading-relaxed text-[var(--color-ink-muted)]">
          Levels come from your answers on a {data.length}-question check. An area with fewer than 2 answers stays unlabeled. This is practice readiness, not a prediction of passing.
        </p>
        {data.areas.some((area) => area.thinBank) ? (
          <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
            Flagged questions are left out. An area stays unlabeled when there are not enough clean questions to score it.
          </p>
        ) : null}
      </header>

      {data.showRestart || saved === "not_yet" ? (
        <section className={cn(dbUi.surface, "p-5 sm:p-6")}>
          <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
            Didn&apos;t pass yet. The work still counts.
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
            Take a new baseline so today has a starting line, then practice the areas that are not on track. Your first check stays here, so you can see the distance you&apos;ve already covered.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.hasStudyAccess ? (
              <button type="button" className={cn(dbUi.primaryBtn, "min-h-11")} disabled={pending} onClick={() => void start(true)}>
                {pending ? "Building…" : "Start a new baseline"}
              </button>
            ) : (
              <Link href={ROUTES.pricing} className={cn(dbUi.primaryBtn, "min-h-11")}>
                View plans
              </Link>
            )}
            <Link href={data.todayHref} className={cn(dbUi.ghostBtn, "min-h-11")}>
              Today&apos;s set
            </Link>
          </div>
        </section>
      ) : null}

      {(saved === "passed" || (saved == null && data.outcome?.result === "passed")) ? (
        <section className={cn(dbUi.surface, "p-5 sm:p-6")}>
          <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[var(--color-ink)]">You passed.</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
            That&apos;s the result this work was for. Thank you for recording it.
          </p>
        </section>
      ) : null}

      {showAreas ? (
        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-[13px] font-semibold tracking-tight text-[var(--color-ink)]">Areas</h2>
            <Link href={data.todayHref} className="text-[13px] font-semibold text-[var(--color-accent)]">
              Practice in Today
            </Link>
          </div>
          <ul className={dbUi.listSurface}>
            {data.areas.map((area) => {
              const moved = data.progress.find((row) => row.areaId === area.areaId);
              const thin = area.thinBank && area.level === "insufficient";
              return (
                <li key={area.areaId} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">
                      {area.label}
                    </p>
                    <p className={cn("mt-0.5 text-[13px]", levelClass(area.level))}>
                      {thin ? READINESS_THIN_AREA_LABEL : READINESS_LEVEL_LABEL[area.level as ReadinessLevel]}
                      {!thin && moved && data.baselineSummary ? ` · ${moved.detail}` : ""}
                    </p>
                  </div>
                  <Link href={area.practiceHref} className={cn(dbUi.ghostBtn, "shrink-0")}>
                    Practice
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <section className={cn(dbUi.surface, "p-5 sm:p-6")}>
          <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
            No check yet
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
            Start with {data.length} questions drawn from the bank. You can skip it and come back.
          </p>
          {data.hasStudyAccess ? (
            <button type="button" className={cn(dbUi.primaryBtn, "mt-4 min-h-11")} disabled={pending} onClick={() => void start(false)}>
              {pending ? "Building your check…" : "Start baseline"}
            </button>
          ) : (
            <Link href={ROUTES.pricing} className={cn(dbUi.primaryBtn, "mt-4 min-h-11")}>
              View plans
            </Link>
          )}
        </section>
      )}

      {data.result && data.hasStudyAccess ? (
        <div className="flex flex-wrap gap-2">
          {data.resume ? (
            <button type="button" className={cn(dbUi.primaryBtn, "min-h-11")} disabled={pending} onClick={() => void start(false)}>
              Continue check
            </button>
          ) : (
            <button type="button" className={cn(dbUi.ghostBtn, "min-h-11")} disabled={pending} onClick={() => void start(false)}>
              {data.result.retakeDue ? "Retake check" : "Retake now"}
            </button>
          )}
        </div>
      ) : null}

      <section className={cn(dbUi.surface, "p-5 sm:p-6")}>
        <ExamOutcomeForm
          examName={data.examName}
          examDate={data.examDate}
          onSubmit={saveOutcome}
        />
      </section>

      {data.history.length > 1 ? (
        <section className="space-y-2">
          <h2 className="text-[13px] font-semibold text-[var(--color-ink)]">Earlier checks</h2>
          <ul className="space-y-2">
            {data.history.map((row) => (
              <li key={row.id} className="text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
                <span className="font-semibold text-[var(--color-ink)]">
                  {row.isBaseline ? "Baseline" : row.kind === "restart" ? "New baseline" : "Retake"}
                </span>
                {row.completedAt
                  ? ` · ${new Date(row.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
                  : ""}
                {row.summaryLine ? ` · ${row.summaryLine}` : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {error ? <p className="text-[14px] text-[var(--color-ink)]">{error}</p> : null}
    </div>
  );
}
