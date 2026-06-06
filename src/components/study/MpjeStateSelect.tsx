"use client";

import { useId } from "react";
import { getMpjeState } from "@/lib/mpje/config";
import {
  isMpjeUsJurisdiction,
  MPJE_US_JURISDICTIONS,
} from "@/lib/mpje/us-jurisdictions";
import { cn } from "@/lib/utils";

type MpjeStateSelectProps = {
  /** Two-letter state code, or "" when none selected. */
  value: string;
  onChange: (code: string) => void;
  className?: string;
  disabled?: boolean;
};

/**
 * MPJE state selector — clean native dropdown, 50 states + DC.
 * Empty selection = federal pharmacy law only (parent syncs ?state= when set).
 */
export function MpjeStateSelect({
  value,
  onChange,
  className,
  disabled = false,
}: MpjeStateSelectProps) {
  const id = useId();
  const normalized =
    value && isMpjeUsJurisdiction(value) ? value.toUpperCase() : "";
  const selected = normalized ? getMpjeState(normalized) : undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--color-ink)]"
      >
        Select State for MPJE
      </label>
      <select
        id={id}
        value={normalized}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full appearance-none rounded-xl border border-black/[0.12] bg-white px-3 py-2.5 pr-9 text-sm text-[var(--color-ink)]",
          "shadow-sm transition",
          "hover:border-black/[0.18]",
          "focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/25",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "sm:max-w-md"
        )}
      >
        <option value="">Choose State</option>
        {MPJE_US_JURISDICTIONS.map((j) => (
          <option key={j.code} value={j.code}>
            {j.code} — {j.name}
          </option>
        ))}
      </select>
      <p className="max-w-prose text-xs leading-relaxed text-[var(--color-ink-muted)]">
        {selected
          ? `Practicing ${selected.name} (${selected.code}) pharmacy law plus federal rules.`
          : "No state selected — questions use federal pharmacy law only (DEA, FDA, HIPAA, and uniform MPJE). Pick a state to add state-specific practice act items."}
      </p>
      {selected?.transitioningToUmpje && (
        <p className="rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-xs text-amber-900">
          {selected.name} is transitioning to Uniform MPJE (UMPJE) in 2026 — practice includes
          both state-specific and uniform federal principles.
        </p>
      )}
      {selected?.note && (
        <p className="rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-xs text-amber-900">
          {selected.note}
        </p>
      )}
    </div>
  );
}
