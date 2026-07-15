"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Zap } from "lucide-react";
import { QuestionBankExamHero } from "@/components/study/question-bank/QuestionBankExamHero";
import { QuestionBankSegment } from "@/components/study/question-bank/QuestionBankSection";
import { FullExamLengthWheel } from "@/components/exam/FullExamLengthWheel";
import { ExamLaunchActions } from "@/components/exam/ExamLaunchActions";
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
import { ExamLoadingProgress } from "@/components/exam/ExamLoadingProgress";
import { useLongRunningProgress } from "@/hooks/use-long-running-progress";
import { feUi } from "@/lib/study/full-exam-ui";
import { ROUTES } from "@/lib/routes";
import { stashFullExamSessionPayload } from "@/lib/full-exam/session-payload-cache";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamLengthPreset } from "@/types/full-exam";
import type { ExamQuestion } from "@/lib/ai";
import {
  defaultMockPresetForAccess,
  filterLengthOptionsForAccess,
  mockPresetLockedMessage,
  type MockExamAccess,
} from "@/lib/study/mock-exam-access";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  /** USMLE step field (usmle-step-1/2/3) — drives full-length count and assembly. */
  fieldId?: string;
  initialMode?: string | null;
  autostart?: boolean;
  initialTimed?: boolean;
  initialNclexCat?: boolean;
  mockAccess: MockExamAccess;
  hasRetake?: boolean;
  canContinue?: boolean;
  focusAreas?: string[];
};

export function FullExamLauncher({
  examSlug,
  fieldId,
  initialMode,
  autostart = false,
  initialTimed = true,
  initialNclexCat = false,
  mockAccess,
  hasRetake = false,
  canContinue = false,
  focusAreas,
}: Props) {
  const router = useRouter();
  const exam = EXAM_CATALOG[examSlug];
  const allOptions = useMemo(() => getLengthOptions(examSlug, fieldId), [examSlug, fieldId]);
  const options = useMemo(
    () => filterLengthOptionsForAccess(allOptions, mockAccess),
    [allOptions, mockAccess.allowFullLengthMocks, mockAccess.allowShortMocks]
  );
  const defaultPreset = defaultMockPresetForAccess(mockAccess);
  const lockedHint = mockPresetLockedMessage(mockAccess);

  const [preset, setPreset] = useState<FullExamLengthPreset>(() => {
    const fromUrl = initialMode ? parseFullExamLengthPreset(initialMode) : null;
    if (fromUrl && options.some((o) => o.preset === fromUrl)) return fromUrl;
    return defaultPreset;
  });
  const presetRef = useRef<FullExamLengthPreset>(preset);
  const [timed, setTimed] = useState(initialTimed);
  const [nclexCat, setNclexCat] = useState(initialNclexCat && examSlug === "nclex");
  const [pending, setPending] = useState(autostart);
  const [error, setError] = useState<string | null>(null);
  const startingRef = useRef(false);

  const handlePresetChange = useCallback((next: FullExamLengthPreset) => {
    presetRef.current = next;
    setPreset(next);
  }, []);

  useEffect(() => {
    presetRef.current = preset;
  }, [preset]);

  const preview = buildSessionConfig(examSlug, preset, timed, {
    nclexCat: examSlug === "nclex" ? nclexCat : undefined,
    fieldId: examSlug === "usmle" ? fieldId : undefined,
  });
  const pageTitle = fullExamModeTitle(examSlug, preset, fieldId);
  const startSteps = useMemo(
    () => [
      { at: 0, label: "Preparing your session…" },
      { at: 10, label: "Working on it — setting up your exam…" },
      { at: 35, label: "Working on it — almost ready…" },
      { at: 60, label: "Still working on it — hang tight…" },
    ],
    []
  );
  const startProgress = useLongRunningProgress(pending, { steps: startSteps });

  async function startExam(
    presetOverride?: FullExamLengthPreset,
    opts?: { autostart?: boolean }
  ) {
    if (startingRef.current) return;
    startingRef.current = true;
    setError(null);
    setPending(true);
    const activePreset = presetOverride ?? presetRef.current;
    const sessionConfig = buildSessionConfig(examSlug, activePreset, timed, {
      nclexCat: examSlug === "nclex" ? nclexCat : undefined,
      fieldId: examSlug === "usmle" ? fieldId : undefined,
    });
    const lockKey = `${examSlug}:${sessionConfig.lengthPreset}:${timed ? "1" : "0"}`;
    if (opts?.autostart && !acquireAutostartLock(lockKey)) {
      startingRef.current = false;
      setPending(false);
      return;
    }
    try {
      const res = await fetch("/api/full-exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examSlug,
          launchMode: "new_exam",
          lengthPreset: sessionConfig.lengthPreset,
          timed,
          fieldId: examSlug === "usmle" ? fieldId : undefined,
          nclexCat: examSlug === "nclex" ? nclexCat : undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        sessionId?: string;
        redirectUrl?: string;
        error?: string;
        questions?: ExamQuestion[];
        bankItemIds?: string[];
      };
      if (!res.ok) {
        setError(data.error ?? "Could not start exam");
        startingRef.current = false;
        if (opts?.autostart) releaseAutostartLock(lockKey);
        setPending(false);
        return;
      }
      const href =
        data.redirectUrl ??
        (data.sessionId ? fullExamSessionHref(examSlug, data.sessionId) : null);
      if (!href) {
        setError("Session was not created. Please try again.");
        startingRef.current = false;
        if (opts?.autostart) releaseAutostartLock(lockKey);
        setPending(false);
        return;
      }
      if (data.sessionId && data.questions?.length && data.bankItemIds?.length) {
        stashFullExamSessionPayload(data.sessionId, {
          questions: data.questions,
          bankItemIds: data.bankItemIds,
        });
      }
      router.prefetch(href);
      router.push(href);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start exam");
      startingRef.current = false;
      if (opts?.autostart) releaseAutostartLock(lockKey);
      setPending(false);
    }
  }

  // Deep-link only — never reset the wheel to full-length on unrelated re-renders.
  useEffect(() => {
    if (!initialMode) return;
    const fromUrl = parseFullExamLengthPreset(initialMode);
    if (fromUrl && options.some((o) => o.preset === fromUrl)) {
      handlePresetChange(fromUrl);
    }
  }, [initialMode, options, handlePresetChange]);

  // If plan access changes and the current preset is locked, fall back once.
  useEffect(() => {
    if (options.some((o) => o.preset === presetRef.current)) return;
    handlePresetChange(defaultPreset);
  }, [options, defaultPreset, handlePresetChange]);

  const autostartRanRef = useRef(false);

  useEffect(() => {
    if (!autostart || autostartRanRef.current) return;
    autostartRanRef.current = true;
    const fromUrl = initialMode ? parseFullExamLengthPreset(initialMode) : null;
    const activePreset =
      fromUrl && options.some((o) => o.preset === fromUrl) ? fromUrl : defaultPreset;
    handlePresetChange(activePreset);
    void startExam(activePreset, { autostart: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autostart]);

  if (pending && autostart) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6">
        <div className="h-11 w-11 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
        <div className="w-full max-w-sm text-center">
          <p className="text-[17px] font-semibold text-[var(--color-ink)]">Starting {pageTitle}</p>
          <p className="mt-1 text-[13px] text-[var(--color-ink-muted)]">
            {preview.questionCount} questions
          </p>
          <ExamLoadingProgress
            className="mt-4"
            progress={startProgress.progress}
            status={startProgress.status}
            showBar={startProgress.showBar}
          />
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

            <ExamLaunchActions
              examSlug={examSlug}
              fieldId={fieldId}
              lengthPreset={preset}
              timed={timed}
              nclexCat={nclexCat}
              hasRetake={hasRetake}
              canContinue={canContinue}
              focusAreas={focusAreas}
              density="compact"
            />

            {/* Length — tap presets with live counts. */}
            <div className="space-y-2">
              <p className="text-center text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                Choose length
              </p>
              <FullExamLengthWheel options={options} value={preset} onChange={handlePresetChange} />
              {lockedHint ? (
                <p className="text-center text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
                  {lockedHint}{" "}
                  <Link href="/pricing?upgrade=pro&feature=unlimited_mock_exams" className="font-semibold text-[var(--color-accent)]">
                    Compare plans
                  </Link>
                </p>
              ) : null}
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

            {examSlug === "nclex" && preset === "full" ? (
              <label className="mx-auto flex max-w-sm cursor-pointer items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3 text-sm">
                <input
                  type="checkbox"
                  checked={nclexCat}
                  onChange={(e) => setNclexCat(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <span>
                  <span className="font-medium text-[var(--color-ink)]">CAT-style adaptive</span>
                  <span className="mt-0.5 block text-xs text-[var(--color-ink-muted)]">
                    Mixed blueprint exam with 75–145Q stop rules (practice simulation).
                  </span>
                </span>
              </label>
            ) : null}

            {pending ? (
              <ExamLoadingProgress
                className="mx-auto max-w-sm"
                progress={startProgress.progress}
                status={startProgress.status}
                showBar={startProgress.showBar}
              />
            ) : null}

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
                onClick={() => void startExam(presetRef.current)}
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
