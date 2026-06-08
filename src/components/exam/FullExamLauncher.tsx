"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, Timer, Zap, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppBreadcrumbs } from "@/components/app/AppBreadcrumbs";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import {
  buildSessionConfig,
  formatHms,
  fullExamModeTitle,
  getLengthOptions,
  fullExamSessionHref,
  parseFullExamLengthPreset,
} from "@/lib/full-exam/config";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamLengthPreset } from "@/types/full-exam";
import { ROUTES } from "@/lib/routes";
import { navigateHard } from "@/lib/client/navigate-hard";
import { acquireAutostartLock, releaseAutostartLock } from "@/lib/full-exam/autostart-lock";
import { StudyHubMpjePicker } from "@/components/study-hub/StudyHubMpjePicker";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  initialMode?: string | null;
  autostart?: boolean;
  initialTimed?: boolean;
  mpjeStateCode?: string | null;
};

export function FullExamLauncher({
  examSlug,
  initialMode,
  autostart = false,
  initialTimed = true,
  mpjeStateCode,
}: Props) {
  const exam = EXAM_CATALOG[examSlug];
  const options = getLengthOptions(examSlug);

  const [preset, setPreset] = useState<FullExamLengthPreset>(() =>
    parseFullExamLengthPreset(initialMode)
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
        body: JSON.stringify({ examSlug, lengthPreset: preset, timed }),
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
    if (initialMode) {
      setPreset(parseFullExamLengthPreset(initialMode));
    }
  }, [initialMode]);

  useEffect(() => {
    if (!autostart) return;
    const lockKey = `${examSlug}:${preset}:${timed ? "1" : "0"}`;
    if (!acquireAutostartLock(lockKey)) return;
    void startExam();
  }, [autostart, examSlug, preset, timed]);

  if (pending && autostart) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900">Starting {pageTitle}</p>
          <p className="mt-1 text-sm text-slate-500">
            {preview.questionCount} questions · preparing your session…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AppBreadcrumbs
        items={[
          { label: "Dashboard", href: ROUTES.dashboard },
          { label: "Full Exam", href: ROUTES.fullExam },
          { label: exam.name },
        ]}
      />
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
          Full simulated exam
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {pageTitle}
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Test-day conditions with a dynamic timer, flag-for-review, scratch-pad notes, and a
          detailed results breakdown — designed to feel calm, not stressful.
        </p>
      </header>

      {examSlug === "mpje" ? (
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4">
          <p className="text-sm font-semibold text-amber-900">MPJE state</p>
          <p className="mt-1 text-sm text-amber-800/90">
            Choose your licensing state so state-specific law questions are included.
          </p>
          <div className="mt-3">
            <StudyHubMpjePicker initialStateCode={mpjeStateCode ?? undefined} persistPreference />
          </div>
          {!mpjeStateCode ? (
            <p className="mt-2 text-xs text-amber-700">
              No state saved yet — federal-only items may be used until you pick a state.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Choose exam length
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {options.map((opt) => (
              <button
                key={opt.preset}
                type="button"
                onClick={() => setPreset(opt.preset)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition hover:shadow-md",
                  preset === opt.preset
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 ring-2 ring-[var(--color-accent)]/20"
                    : "border-slate-200 bg-white hover:border-teal-200"
                )}
              >
                <p className="font-semibold text-slate-900">{opt.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{opt.description}</p>
              </button>
            ))}
          </div>

          <h2 className="pt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Mode
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <ModeCard
              active={timed}
              onClick={() => setTimed(true)}
              icon={Timer}
              title="Timed (recommended)"
              description="Countdown with pause support — mirrors real exam pressure."
            />
            <ModeCard
              active={!timed}
              onClick={() => setTimed(false)}
              icon={Clock}
              title="Untimed"
              description="Practice pacing without pressure. Timer counts up instead."
            />
          </div>
        </div>

        <Card className="h-fit border-slate-200/80 lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="text-lg">Session preview</CardTitle>
            <CardDescription>What to expect when you launch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PreviewRow label="Questions" value={String(preview.questionCount)} />
            <PreviewRow
              label="Time limit"
              value={preview.timed ? formatHms(preview.timeLimitSec) : "None"}
            />
            <PreviewRow label="Adaptive mix" value={preview.adaptive ? "Yes" : "Standard"} />
            <ul className="space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                Auto-save every answer
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                Flag, eliminate, and scratch-pad notes
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                Rationales after submission
              </li>
            </ul>
            {error ? (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="button"
              disabled={pending}
              onClick={() => void startExam()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
            >
              <Zap className="h-4 w-4" />
              {pending ? "Starting…" : "Start exam"}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ModeCard({
  active,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Timer;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex gap-3 rounded-2xl border p-4 text-left transition",
        active
          ? "border-teal-400 bg-teal-50/60"
          : "border-slate-200 bg-white hover:border-slate-300"
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", active ? "text-teal-700" : "text-slate-400")} />
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
    </button>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}
