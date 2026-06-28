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
  return (
    <div className={cn("space-y-3", className)}>
      {showBar ? <Progress value={progress} className="h-1.5" /> : null}
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
