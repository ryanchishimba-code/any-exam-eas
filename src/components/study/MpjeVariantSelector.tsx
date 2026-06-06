"use client";

import { MPJE_VARIANTS, getMpjeState, type MpjeVariant } from "@/lib/mpje/config";
import { cn } from "@/lib/utils";

type MpjeVariantSelectorProps = {
  variant: MpjeVariant;
  onVariantChange: (variant: MpjeVariant) => void;
  stateCode: string;
  /** Reserved for parent-driven state dropdown (MpjeStateSelect). */
  onStateChange?: (code: string) => void;
};

export function MpjeVariantSelector({
  variant,
  onVariantChange,
  stateCode,
}: MpjeVariantSelectorProps) {
  const selectedState = getMpjeState(stateCode);

  return (
    <div className="space-y-5">
      <div>
        <label className="apple-label">MPJE exam type</label>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {MPJE_VARIANTS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onVariantChange(option.id)}
              className={cn(
                "rounded-xl border px-4 py-4 text-left transition",
                variant === option.id
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 ring-1 ring-[var(--color-accent)]"
                  : "border-black/[0.08] bg-white hover:border-black/[0.12]"
              )}
            >
              <p className="font-medium text-[var(--color-ink)]">{option.label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                {option.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {variant === "state" && (
        <div className="space-y-3">
          {selectedState?.note && (
            <p className="mt-2 rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-xs text-amber-900">
              {selectedState.note}
            </p>
          )}
          {selectedState?.transitioningToUmpje && !selectedState.hasOwnJurisprudenceExam && (
            <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
              Many states are adopting Uniform MPJE (UMPJE) in 2026. Practice both state-specific rules
              and uniform patterns.
            </p>
          )}
        </div>
      )}

      {variant === "uniform" && (
        <div className="rounded-xl border border-black/[0.06] bg-black/[0.02] px-4 py-3">
          <p className="text-sm font-medium text-[var(--color-ink)]">Uniform MPJE (UMPJE)</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink-muted)]">
            Covers common federal pharmacy law plus uniform state law patterns used by most boards.
            Ideal for multistate jurisprudence prep and states transitioning to UMPJE in 2026.
          </p>
        </div>
      )}
    </div>
  );
}
