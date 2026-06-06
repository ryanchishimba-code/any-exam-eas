"use client";

import { Scale } from "lucide-react";
import { buildMpjeScopeLabel } from "@/lib/mpje/config";
import { getMpjeState } from "@/lib/mpje/config";

type MpjePracticeBannerProps = {
  stateCode: string;
};

export function MpjePracticeBanner({ stateCode }: MpjePracticeBannerProps) {
  const state = getMpjeState(stateCode);
  const title = state ? `${state.name} MPJE Practice` : buildMpjeScopeLabel("state", stateCode);

  return (
    <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white px-5 py-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700">
          <Scale className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            High-yield {state?.name ?? "state"} pharmacy law mixed with federal DEA, FDA, and HIPAA
            rules. Questions prioritize your selected state.
          </p>
        </div>
      </div>
    </div>
  );
}
