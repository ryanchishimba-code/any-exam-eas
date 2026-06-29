"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuthLoadingOverlay({
  show,
  message = "Working on it…",
  className,
}: {
  show: boolean;
  message?: string;
  className?: string;
}) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/80 backdrop-blur-[2px]",
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className="h-7 w-7 animate-spin text-[var(--color-accent)]" aria-hidden />
      <p className="text-sm font-medium text-[var(--color-ink-muted)]">{message}</p>
    </div>
  );
}
