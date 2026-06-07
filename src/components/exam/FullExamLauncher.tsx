"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clock, Timer, Zap, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import {
  buildSessionConfig,
  formatMmSs,
  getLengthOptions,
  fullExamSessionHref,
} from "@/lib/full-exam/config";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamLengthPreset } from "@/types/full-exam";
import { cn } from "@/lib/utils";

export function FullExamLauncher({ examSlug }: { examSlug: ExamSlug }) {
  const router = useRouter();
  const exam = EXAM_CATALOG[examSlug];
  const options = getLengthOptions(examSlug);

  const [preset, setPreset] = useState<FullExamLengthPreset>("50");
  const [timed, setTimed] = useState(true);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const preview = buildSessionConfig(examSlug, preset, timed);

  function startExam() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/full-exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examSlug, lengthPreset: preset, timed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not start exam");
        return;
      }
      router.push(fullExamSessionHref(examSlug, data.sessionId));
    });
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
          Full simulated exam
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {exam.name} Simulator
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Test-day conditions with a dynamic timer, flag-for-review, elimination mode, and a
          beautiful results breakdown — designed to feel calm, not stressful.
        </p>
      </header>

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
              value={preview.timed ? formatMmSs(preview.timeLimitSec) : "None"}
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
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <button
              type="button"
              disabled={pending}
              onClick={startExam}
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
