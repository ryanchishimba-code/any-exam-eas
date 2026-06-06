"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Brain,
  Clock,
  Flag,
  Zap,
  ArrowRight,
  Scale,
} from "lucide-react";
import {
  EXAM_FIELD_OPTIONS,
  PRACTICE_MODES,
  type PracticeModeId,
} from "@/lib/exam-prep/practice-modes";
import type { ExamFieldId } from "@/lib/exam-prep/types";
import { MpjeStateSelect } from "./MpjeStateSelect";
import { MPJE_DEFAULT_STATE_CODE } from "@/lib/mpje/us-jurisdictions";
import { parseMpjeStateParam } from "@/lib/mpje/validators";
import { mpjePracticeExamHref } from "@/lib/study-hub/config";
import { cn } from "@/lib/utils";

const MODE_ICONS = {
  zap: Zap,
  clock: Clock,
  brain: Brain,
  book: BookOpen,
  flag: Flag,
} as const;

function resolveFieldId(param: string | null): ExamFieldId {
  const match = EXAM_FIELD_OPTIONS.find(
    (e) => e.fieldParam === param || e.id === param || e.label.toLowerCase() === param?.toLowerCase()
  );
  return match?.id ?? "nursing";
}

export function UnifiedPracticeHub() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fieldId, setFieldId] = useState<ExamFieldId>(() =>
    resolveFieldId(searchParams.get("field"))
  );
  const [mode, setMode] = useState<PracticeModeId>("adaptive");
  const [mpjeState, setMpjeState] = useState(MPJE_DEFAULT_STATE_CODE);

  useEffect(() => {
    const f = resolveFieldId(searchParams.get("field"));
    setFieldId(f);
    const state = parseMpjeStateParam(
      searchParams.get("state"),
      searchParams.get("mpjeState")
    );
    setMpjeState(state);
  }, [searchParams]);

  const exam = EXAM_FIELD_OPTIONS.find((e) => e.id === fieldId)!;
  const isMpje = fieldId === "mpje";
  const selectedMode = PRACTICE_MODES.find((m) => m.id === mode)!;

  function syncUrl(nextField: ExamFieldId, nextState?: string) {
    const qs = new URLSearchParams({ field: nextField });
    if (nextField === "mpje" && nextState) {
      qs.set("state", nextState);
      qs.set("mpjeState", nextState);
    }
    router.replace(`/study/practice?${qs.toString()}`, { scroll: false });
  }

  function launchHref(): string {
    if (isMpje) {
      const qs = new URLSearchParams({
        field: "mpje",
        mpjeVariant: "state",
        state: mpjeState,
        mpjeState,
      });
      if (mode === "simulator" || mode === "test_day") {
        return mpjePracticeExamHref(mpjeState);
      }
      if (mode === "quick") {
        qs.set("mode", "bank");
        qs.set("count", "15");
        qs.set("style", "adaptive");
      } else if (mode === "adaptive") {
        qs.set("mode", "bank");
        qs.set("style", "adaptive");
        qs.set("count", "25");
      } else if (mode === "topic") {
        qs.set("mode", "bank");
      } else {
        qs.set("mode", "timed");
      }
      return `/study/practice?${qs.toString()}`;
    }
    return selectedMode.href(fieldId);
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-black/[0.06] bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
          Exam prep hub · 2015–2026 blueprints
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[var(--color-ink)]">
          Choose your exam
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--color-ink-muted)]">
          Clinical judgment, vignettes, and state-aware MPJE — built for declining pass rates
          with adaptive weak-area targeting and realistic simulation.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {EXAM_FIELD_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setFieldId(opt.id);
                syncUrl(opt.id, mpjeState);
              }}
              className={cn(
                "rounded-xl border px-4 py-4 text-left transition",
                fieldId === opt.id
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 ring-1 ring-[var(--color-accent)]"
                  : "border-black/[0.08] bg-white hover:border-black/[0.12]"
              )}
            >
              <p className="font-semibold text-[var(--color-ink)]">{opt.label}</p>
              <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{opt.timing}</p>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-black/[0.06] bg-black/[0.02] px-4 py-3">
          <p className="text-sm font-medium text-[var(--color-ink)]">{exam.label} format</p>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{exam.description}</p>
          <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
            {exam.format} · {exam.timing}
          </p>
        </div>
      </div>

      {isMpje && (
        <div className="apple-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Scale className="h-5 w-5 text-amber-600" aria-hidden />
            <p className="font-semibold text-[var(--color-ink)]">MPJE state jurisdiction</p>
          </div>
          <MpjeStateSelect
            value={mpjeState}
            onChange={(code) => {
              setMpjeState(code);
              syncUrl("mpje", code);
            }}
          />
        </div>
      )}

      <div>
        <p className="apple-label">Practice mode</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRACTICE_MODES.map((m) => {
            const Icon = MODE_ICONS[m.icon as keyof typeof MODE_ICONS] ?? Zap;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={cn(
                  "rounded-xl border px-4 py-4 text-left transition",
                  mode === m.id
                    ? "border-[var(--color-accent)] bg-white ring-1 ring-[var(--color-accent)]"
                    : "border-black/[0.08] bg-white/80 hover:border-black/[0.12]"
                )}
              >
                <Icon className="h-5 w-5 text-[var(--color-accent)]" aria-hidden />
                <p className="mt-3 font-semibold text-[var(--color-ink)]">{m.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                  {m.description}
                </p>
                <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                  {m.timing} · {m.bestFor}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <Link
        href={launchHref()}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:opacity-90"
      >
        Start {selectedMode.label}
        <ArrowRight className="h-5 w-5" aria-hidden />
      </Link>
    </div>
  );
}
