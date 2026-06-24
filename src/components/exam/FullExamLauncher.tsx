"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Zap } from "lucide-react";
import { QuestionBankExamHero } from "@/components/study/question-bank/QuestionBankExamHero";
import { QuestionBankSegment } from "@/components/study/question-bank/QuestionBankSection";
import { FullExamLengthWheel } from "@/components/exam/FullExamLengthWheel";
import { StudyPageHeader } from "@/components/study/StudyPageHeader";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import {
  buildSessionConfig,
  formatHms,
  fullExamModeTitle,
  getLengthOptions,
  fullExamSessionHref,
  parseFullExamLengthPreset,
} from "@/lib/full-exam/config";
import { acquireAutostartLock, releaseAutostartLock } from "@/lib/full-exam/autostart-lock";
import { feUi } from "@/lib/study/full-exam-ui";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamLengthPreset } from "@/types/full-exam";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  initialMode?: string | null;
  autostart?: boolean;
  initialTimed?: boolean;
};

export function FullExamLauncher({
  examSlug,
  initialMode,
  autostart = false,
  initialTimed = true,
}: Props) {
  const router = useRouter();
  const exam = EXAM_CATALOG[examSlug];
  const options = getLengthOptions(examSlug);

  const [preset, setPreset] = useState<FullExamLengthPreset>(() =>
    initialMode ? parseFullExamLengthPreset(initialMode) : "full"
  );
  const [timed, setTimed] = useState(initialTimed);
  const [pending, setPending] = useState(autostart);
  const [error, setError] = useState<string | null>(null);
  const startingRef = useRef(false);

  const preview = buildSessionConfig(examSlug, preset, timed);
  const pageTitle = fullExamModeTitle(examSlug, preset);

  async function startExam() {
    if (startingRef.current) return;
    startingRef.current = true;
    setError(null);
    setPending(true);
    const lockKey = `${examSlug}:${preset}:${timed ? "1" : "0"}`;
    try {
      const res = await fetch("/api/full-exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examSlug,
          lengthPreset: preset,
          timed,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        sessionId?: string;
        redirectUrl?: string;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Could not start exam");
        startingRef.current = false;
        releaseAutostartLock(lockKey);
        setPending(false);
        return;
      }
      const href =
        data.redirectUrl ??
        (data.sessionId ? fullExamSessionHref(examSlug, data.sessionId) : null);
      if (!href) {
        setError("Session was not created. Please try again.");
        startingRef.current = false;
        releaseAutostartLock(lockKey);
        setPending(false);
        return;
      }
      router.push(href);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start exam");
      startingRef.current = false;
      releaseAutostartLock(lockKey);
      setPending(false);
    }
  }

  useEffect(() => {
    setPreset(initialMode ? parseFullExamLengthPreset(initialMode) : "full");
  }, [initialMode]);

  useEffect(() => {
    if (!autostart) return;
    const lockKey = `${examSlug}:${preset}:${timed ? "1" : "0"}`;
    if (!acquireAutostartLock(lockKey)) return;
    void startExam();
  }, [autostart, examSlug, preset, timed]);

  if (pending && autostart) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <div className="h-11 w-11 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
        <div className="text-center">
          <p className="text-[17px] font-semibold text-[var(--color-ink)]">Starting {pageTitle}</p>
          <p className="mt-1 text-[13px] text-[var(--color-ink-muted)]">
            {preview.questionCount} questions · preparing your session…
          </p>
        </div>
      </div>
    );
  }

  const summary = [
    `${preview.questionCount} questions`,
    preview.timed ? formatHms(preview.timeLimitSec) : "Untimed",
    preview.adaptive ? "Adaptive mix" : "Standard mix",
  ].join("  ·  ");

  return (
    <div className={cn(feUi.page, "w-full space-y-5")}>
      <StudyPageHeader
        eyebrow="Full simulated exam"
        title={pageTitle}
        subtitle="Test-day conditions with a calm timer, flag-for-review, and a detailed breakdown when you finish."
        breadcrumbs={[{ label: "Dashboard", href: ROUTES.dashboard }, { label: "Full Exam", href: ROUTES.fullExam }]}
      />

      <div className={feUi.pageShell}>
        <div className={cn(feUi.panel, feUi.panelInner)}>
          <div className="mx-auto w-full max-w-xl space-y-7">
            <QuestionBankExamHero exam={exam} examSlug={examSlug} />

            {/* Length — tactile scroll wheel with live counts. */}
            <div className="space-y-2">
              <p className="text-center text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                Choose length
              </p>
              <FullExamLengthWheel options={options} value={preset} onChange={setPreset} />
              <p
                className="text-center text-[13px] font-medium tabular-nums text-[var(--color-ink-muted)]"
                aria-live="polite"
              >
                {summary}
              </p>
            </div>

            {/* Timing — minimal segmented control. */}
            <div className="mx-auto w-full max-w-xs">
              <QuestionBankSegment
                ariaLabel="Exam timing"
                value={timed ? "timed" : "untimed"}
                onChange={(v) => setTimed(v === "timed")}
                options={[
                  { id: "timed", label: "Timed" },
                  { id: "untimed", label: "Untimed" },
                ]}
              />
            </div>

            {error ? (
              <p
                className="mx-auto max-w-sm rounded-[12px] bg-rose-50 px-3 py-2 text-center text-[13px] text-rose-700"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            {/* Single, unmistakable primary action. */}
            <div className="mx-auto w-full max-w-sm space-y-3">
              <button
                type="button"
                disabled={pending}
                onClick={() => void startExam()}
                className={cn(feUi.startBtn, "bg-[var(--color-accent)]")}
              >
                <Zap className="h-4 w-4" aria-hidden />
                {pending ? "Starting…" : timed ? "Start Timed Exam" : "Start Untimed Exam"}
              </button>
              <p className="text-center text-[12px] text-[var(--color-ink-muted)]">
                Auto-saves every answer · Flag &amp; review · Rationales after you submit
              </p>
              <Link
                href={ROUTES.dashboard}
                className="flex items-center justify-center gap-0.5 text-[13px] font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              >
                Back to dashboard
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
