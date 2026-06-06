"use client";

import { MpjeStateSearch } from "./MpjeStateSearch";
import { MPJE_US_JURISDICTIONS } from "@/lib/mpje/us-jurisdictions";
import { getMpjeState } from "@/lib/mpje/config";
import { cn } from "@/lib/utils";

type MpjeUsStateSearchProps = {
  value: string;
  onChange: (code: string) => void;
  className?: string;
  disabled?: boolean;
};

/**
 * Searchable state selector — 50 US states + DC only (no territories).
 * Default OK; syncs with ?state= query param via parent.
 */
export function MpjeUsStateSearch({
  value,
  onChange,
  className,
  disabled = false,
}: MpjeUsStateSearchProps) {
  const selected = getMpjeState(value);
  const isUs = MPJE_US_JURISDICTIONS.some((j) => j.code === value);

  return (
    <div className={cn("space-y-2", className)}>
      <MpjeStateSearch
        value={isUs ? value : "OK"}
        onChange={disabled ? () => {} : onChange}
        jurisdictions={MPJE_US_JURISDICTIONS}
        className={disabled ? "pointer-events-none opacity-60" : undefined}
      />
      <p className="text-xs text-[var(--color-ink-muted)]">
        {selected && isUs
          ? `Practicing ${selected.name} (${selected.code}) pharmacy law plus federal rules.`
          : "50 states + DC. Questions match your state or federal/uniform MPJE content."}
      </p>
      {selected?.transitioningToUmpje && (
        <p className="rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-xs text-amber-900">
          {selected.name} is transitioning to Uniform MPJE (UMPJE) in 2026 — practice includes both
          state-specific and uniform federal principles.
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
