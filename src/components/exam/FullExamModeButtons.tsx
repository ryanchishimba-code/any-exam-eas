"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fullExamLaunchHref, getLengthOptions } from "@/lib/full-exam/config";
import { feUi } from "@/lib/study/full-exam-ui";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamLengthPreset } from "@/types/full-exam";
import { cn } from "@/lib/utils";

const SHORT_LABELS: Record<FullExamLengthPreset, string> = {
  "50": "50 Q",
  "100": "100 Q",
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
      <div className={feUi.chipRow}>
        {options.map((opt) => (
          <Link
            key={opt.preset}
            href={fullExamLaunchHref(examSlug, { mode: opt.preset, autostart: true })}
            className={cn(
              "inline-flex shrink-0 rounded-full border border-black/[0.06] bg-white px-3.5 py-2 text-[12px] font-semibold text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] transition hover:border-[var(--color-accent)]/30 hover:text-[var(--color-accent)]"
            )}
          >
            {SHORT_LABELS[opt.preset]}
          </Link>
        ))}
      </div>
      {showCustomizeLink ? (
        <Link
          href={fullExamLaunchHref(examSlug)}
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--color-accent)] transition hover:gap-1.5"
        >
          Customize &amp; start
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}
