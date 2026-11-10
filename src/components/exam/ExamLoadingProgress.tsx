"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Props = {
  progress: number;
  status: string;
  showBar: boolean;
  className?: string;
};

export function ExamLoadingProgress({ progress, status, showBar, className }: Props) {
  const stillWorking = progress >= 70;
  return (
    <div className={cn("space-y-3", className)}>
      {showBar && stillWorking ? (
        <div className="h-1.5 overflow-hidden rounded-full bg-black/10" role="progressbar" aria-valuetext={status}>
          <div className="h-full w-1/3 animate-pulse rounded-full bg-[var(--color-accent)]" />
        </div>
      ) : showBar ? (
        <Progress value={progress} className="h-1.5" />
      ) : null}
      <p
        className="text-center text-[13px] text-[var(--color-ink-muted)]"
        aria-live="polite"
        role="status"
      >
        {status}
      </p>
    </div>
  );
}
