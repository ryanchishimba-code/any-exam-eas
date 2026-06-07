"use client";

import Link from "next/link";
import { ArrowRight, Clock, Scale, SlidersHorizontal } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import {
  MPJE_VARIANTS,
  getMpjeState,
  type MpjeVariant,
} from "@/lib/mpje/config";
import { saveMpjePreferences } from "@/lib/edtech/actions";
import { mpjePracticeExamHref, mpjePracticeHref } from "@/lib/study-hub/config";
import { MpjeStateSelect } from "@/components/study/MpjeStateSelect";
import { cn } from "@/lib/utils";

export function StudyHubMpjePicker({
  onClose,
  initialStateCode = "",
  persistPreference = false,
}: {
  onClose?: () => void;
  initialStateCode?: string;
  persistPreference?: boolean;
}) {
  const [variant, setVariant] = useState<MpjeVariant>("state");
  const [stateCode, setStateCode] = useState(initialStateCode);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setStateCode(initialStateCode);
  }, [initialStateCode]);

  function syncState(code: string) {
    setStateCode(code);
    if (persistPreference && code) {
      startTransition(() => {
        void saveMpjePreferences({ stateCode: code, variant });
      });
    }
  }

  function onVariantChange(next: MpjeVariant) {
    setVariant(next);
    if (persistPreference) {
      startTransition(() => {
        void saveMpjePreferences({ stateCode, variant: next });
      });
    }
  }

  const selectedState = getMpjeState(stateCode);

  const practiceParams = {
    variant,
    stateCode: variant === "state" ? stateCode : undefined,
  } as const;

  return (
    <div
      id="mpje-picker"
      className="scroll-mt-28 rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700">
            <Scale className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">MPJE</h3>
            <p className="text-sm text-slate-600">Choose your jurisprudence exam type</p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
          >
            Close
          </button>
        )}
      </div>

      <p className="mt-6 text-sm font-medium text-slate-700">Select exam type</p>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {MPJE_VARIANTS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onVariantChange(option.id)}
            className={cn(
              "rounded-xl border px-4 py-4 text-left transition",
              variant === option.id
                ? "border-amber-500 bg-white ring-1 ring-amber-500/40 shadow-sm"
                : "border-slate-200/80 bg-white/80 hover:border-amber-200 hover:bg-white"
            )}
          >
            <p className="font-semibold text-slate-900">{option.shortLabel}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{option.description}</p>
          </button>
        ))}
      </div>

      {variant === "state" && (
        <div className="mt-5 space-y-3">
          <MpjeStateSelect value={stateCode} onChange={syncState} />
          {selectedState?.note && (
            <p className="rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-xs text-amber-900">
              {selectedState.note}
            </p>
          )}
        </div>
      )}

      {variant === "uniform" && (
        <p className="mt-5 rounded-xl border border-slate-200/60 bg-white/60 px-4 py-3 text-xs leading-relaxed text-slate-600">
          Federal law (DEA, FDA, HIPAA) plus uniform multistate patterns — ideal for UMPJE prep
          and boards transitioning in 2026.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href={mpjePracticeHref({ mode: "bank", ...practiceParams })}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Question bank
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href={mpjePracticeHref({ mode: "timed", ...practiceParams })}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <Clock className="h-4 w-4" aria-hidden />
          Timed exam
        </Link>
      </div>

      {variant === "state" && (
        <Link
          href={mpjePracticeExamHref(stateCode)}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300/80 bg-amber-50 px-5 py-3.5 text-sm font-semibold text-amber-950 transition hover:border-amber-400 hover:bg-amber-100/80"
        >
          <Clock className="h-4 w-4" aria-hidden />
          Take Full Practice Exam (120 Questions — 2.5 Hours)
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
