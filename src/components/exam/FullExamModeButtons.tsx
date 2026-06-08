"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fullExamLaunchHref, getLengthOptions } from "@/lib/full-exam/config";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamLengthPreset } from "@/types/full-exam";
import { cn } from "@/lib/utils";

const SHORT_LABELS: Record<FullExamLengthPreset, string> = {
  "50": "50 questions",
  "100": "100 questions",
  full: "Full length",
};

type Props = {
  examSlug: ExamSlug;
  className?: string;
  showCustomizeLink?: boolean;
};

export function FullExamModeButtons({
  examSlug,
  className,
  showCustomizeLink = true,
}: Props) {
  const options = getLengthOptions(examSlug);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <Link
            key={opt.preset}
            href={fullExamLaunchHref(examSlug, { mode: opt.preset, autostart: true })}
            className="rounded-full border border-black/[0.08] bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[var(--color-ink-muted)] transition hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)]"
          >
            {SHORT_LABELS[opt.preset]}
          </Link>
        ))}
      </div>
      {showCustomizeLink ? (
        <Link
          href={fullExamLaunchHref(examSlug)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)] transition hover:gap-2"
        >
          Customize &amp; start
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}
