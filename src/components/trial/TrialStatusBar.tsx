"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { trialStatusBarMessage, type TrialStatusBarModel } from "@/lib/trial/trial-status";
import { boardAccentPillClass } from "@/lib/marketing/board-accent";
import type { ExamSlug } from "@/types/edtech";

export function TrialStatusBar({
  model,
  examSlug,
  className,
}: {
  model: TrialStatusBarModel;
  examSlug?: ExamSlug | null;
  className?: string;
}) {
  const message = trialStatusBarMessage(model);
  const pillClass = examSlug ? boardAccentPillClass(examSlug) : "aee-board-pill";

  return (
    <div
      className={cn(
        "border-b border-[var(--color-border)]/80 bg-[var(--color-surface-elevated)]/95 backdrop-blur-sm",
        model.urgent && "border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_8%,var(--color-surface-elevated))]",
        className
      )}
      role="status"
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6",
          model.urgent && "sm:py-3"
        )}
      >
        <p
          className={cn(
            "text-[13px] font-medium leading-snug text-[var(--color-ink)]",
            model.urgent && "text-[14px] sm:text-[15px]"
          )}
        >
          {message}
        </p>
        <Link
          href={model.upgradeHref}
          className={cn(
            pillClass,
            "inline-flex shrink-0 items-center justify-center rounded-full px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:opacity-95",
            model.urgent && "px-5 py-2.5 text-[14px]"
          )}
        >
          Upgrade — {model.monthlyLabel}/mo
        </Link>
      </div>
    </div>
  );
}
