"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Timer, Zap } from "lucide-react";
import { QuestionBankExamHero } from "@/components/study/question-bank/QuestionBankExamHero";
import {
  QuestionBankSection,
  QuestionBankSegment,
} from "@/components/study/question-bank/QuestionBankSection";
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
import { navigateHard } from "@/lib/client/navigate-hard";
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

type NclexPresetSummary = {
  examNumber: number;
  title: string;
  questionCount: number;
  blueprintSummary: Record<string, number> | null;
};

export function FullExamLauncher({
  examSlug,
  initialMode,
  autostart = false,
  initialTimed = true,
}: Props) {
  const exam = EXAM_CATALOG[examSlug];
  const options = getLengthOptions(examSlug);

  const [preset, setPreset] = useState<FullExamLengthPreset>(() =>
    initialMode ? parseFullExamLengthPreset(initialMode) : "full"
  );
  const [timed, setTimed] = useState(initialTimed);
  const [presetExamNumber, setPresetExamNumber] = useState<number | null>(null);
  const [nclexPresets, setNclexPresets] = useState<NclexPresetSummary[]>([]);
  const [pending, setPending] = useState(autostart);
  const [error, setError] = useState<string | null>(null);
  const startingRef = useRef(false);

  const preview = buildSessionConfig(examSlug, preset, timed, {
    presetExamNumber: presetExamNumber ?? undefined,
  });
  const pageTitle =
    presetExamNumber && examSlug === "nclex"
      ? `NCLEX-RN Practice Exam ${presetExamNumber}`
      : fullExamModeTitle(examSlug, preset);

  async function startExam() {
    if (startingRef.current) return;
    startingRef.current = true;
    setError(null);
    setPending(true);
    const lockKey = `${examSlug}:${preset}:${timed ? "1" : "0"}:${presetExamNumber ?? "rand"}`;
    try {
      const res = await fetch("/api/full-exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examSlug,
          lengthPreset: presetExamNumber ? "full" : preset,
          timed,
          ...(presetExamNumber ? { presetExamNumber } : {}),
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
      navigateHard(href);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start exam");
      startingRef.current = false;
      releaseAutostartLock(lockKey);
      setPending(false);
    }
  }

  useEffect(() => {
    if (examSlug !== "nclex") return;
    void fetch("/api/full-exam/presets?examSlug=nclex")
      .then((r) => r.json())
      .then((data: { exams?: NclexPresetSummary[] }) => {
        if (Array.isArray(data.exams)) setNclexPresets(data.exams);
      })
      .catch(() => {});
  }, [examSlug]);

  useEffect(() => {
    setPreset(initialMode ? parseFullExamLengthPreset(initialMode) : "full");
  }, [initialMode]);

  useEffect(() => {
    if (!autostart) return;
    const lockKey = `${examSlug}:${preset}:${timed ? "1" : "0"}:${presetExamNumber ?? "rand"}`;
    if (!acquireAutostartLock(lockKey)) return;
    void startExam();
  }, [autostart, examSlug, preset, timed, presetExamNumber]);

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

  return (
    <div className={cn(feUi.page, "w-full space-y-5")}>
      <header className="px-0.5">
        <p className={feUi.eyebrow}>Full simulated exam</p>
        <h1 className={cn(feUi.title, "mt-1")}>{pageTitle}</h1>
        <p className={cn(feUi.subtitle, "mt-2 max-w-xl")}>
          Test-day conditions with a calm timer, flag-for-review, scratch pad, and detailed
          breakdown when you finish.
        </p>
      </header>

      <div className={feUi.pageShell}>
        <div className={cn(feUi.panel, feUi.panelInner)}>
          <QuestionBankExamHero exam={exam} examSlug={examSlug} />

          <div className="grid gap-6 lg:grid-cols-[1fr,min(18rem,100%)]">
            <div className="space-y-6">
              {examSlug === "nclex" && nclexPresets.length > 0 ? (
                <QuestionBankSection
                  step={1}
                  title="Curated practice exams"
                  hint="10 full-length exams (80 questions) with 2026 blueprint mix, NGN case studies, and board-level rationales."
                >
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setPresetExamNumber(null)}
                      className={cn(
                        feUi.lengthCard,
                        presetExamNumber === null && feUi.lengthCardActive
                      )}
                    >
                      <p className="text-[14px] font-semibold text-[var(--color-ink)]">
                        Adaptive mix
                      </p>
                      <p className="mt-1 text-[12px] leading-snug text-[var(--color-ink-muted)]">
                        Random QA-passed items — same as live simulator
                      </p>
                    </button>
                    {nclexPresets.map((p) => (
                      <button
                        key={p.examNumber}
                        type="button"
                        onClick={() => {
                          setPresetExamNumber(p.examNumber);
                          setPreset("full");
                        }}
                        className={cn(
                          feUi.lengthCard,
                          presetExamNumber === p.examNumber && feUi.lengthCardActive
                        )}
                      >
                        <p className="text-[14px] font-semibold text-[var(--color-ink)]">
                          Exam {p.examNumber}
                        </p>
                        <p className="mt-1 text-[12px] leading-snug text-[var(--color-ink-muted)]">
                          {p.questionCount} questions · fixed high-yield set
                        </p>
                      </button>
                    ))}
                  </div>
                </QuestionBankSection>
              ) : null}

              {!presetExamNumber ? (
              <QuestionBankSection
                step={examSlug === "nclex" && nclexPresets.length > 0 ? 2 : 1}
                title="Exam length"
                hint="Pick a sprint, extended run, or full board-length simulation."
              >
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {options.map((opt) => (
                    <button
                      key={opt.preset}
                      type="button"
                      onClick={() => setPreset(opt.preset)}
                      className={cn(
                        feUi.lengthCard,
                        preset === opt.preset && feUi.lengthCardActive
                      )}
                    >
                      <p className="text-[14px] font-semibold text-[var(--color-ink)]">{opt.label}</p>
                      <p className="mt-1 text-[12px] leading-snug text-[var(--color-ink-muted)]">
                        {opt.description}
                      </p>
                    </button>
                  ))}
                </div>
              </QuestionBankSection>
              ) : null}

              <QuestionBankSection
                step={examSlug === "nclex" && nclexPresets.length > 0 ? (presetExamNumber ? 2 : 3) : 2}
                title="Timing"
                hint="Timed mode mirrors real exam pressure."
              >
                <QuestionBankSegment
                  ariaLabel="Exam timing"
                  value={timed ? "timed" : "untimed"}
                  onChange={(v) => setTimed(v === "timed")}
                  options={[
                    { id: "timed", label: "Timed" },
                    { id: "untimed", label: "Untimed" },
                  ]}
                />
                <p className="mt-2 text-[12px] text-[var(--color-ink-muted)]">
                  {timed
                    ? "Countdown with pause support — recommended for test-day readiness."
                    : "Timer counts up; practice pacing without pressure."}
                </p>
              </QuestionBankSection>
            </div>

            <aside className="lg:sticky lg:top-[calc(var(--nav-height)+1rem)] lg:self-start">
              <div className={cn(feUi.insetGroup, "bg-white p-4 shadow-[var(--shadow-apple-sm)]")}>
                <p className="text-[14px] font-semibold text-[var(--color-ink)]">Session preview</p>
                <div className="mt-3 divide-y divide-black/[0.06]">
                  <PreviewRow label="Questions" value={String(preview.questionCount)} />
                  <PreviewRow
                    label="Time limit"
                    value={preview.timed ? formatHms(preview.timeLimitSec) : "None"}
                  />
                  <PreviewRow label="Mix" value={presetExamNumber ? "Fixed preset" : preview.adaptive ? "Adaptive" : "Standard"} />
                </div>
                <ul className="mt-4 space-y-2.5 text-[13px] text-[var(--color-ink-muted)]">
                  {[
                    "Auto-save every answer",
                    "Flag, eliminate & scratch pad",
                    "Rationales after submit",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
                {error ? (
                  <p className="mt-3 rounded-[12px] bg-rose-50 px-3 py-2 text-[13px] text-rose-700" role="alert">
                    {error}
                  </p>
                ) : null}
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => void startExam()}
                  className={cn(feUi.startBtn, "mt-4 bg-[var(--color-accent)]")}
                >
                  <Zap className="h-4 w-4" aria-hidden />
                  {pending
                    ? "Starting…"
                    : `Start ${preview.questionCount}-question exam`}
                </button>
                <Link
                  href={ROUTES.dashboard}
                  className="mt-3 flex items-center justify-center gap-0.5 text-[13px] font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                >
                  Back to dashboard
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={feUi.previewRow}>
      <span className={feUi.previewLabel}>{label}</span>
      <span className={feUi.previewValue}>{value}</span>
    </div>
  );
}
