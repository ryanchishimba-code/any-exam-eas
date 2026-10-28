"use client";

import { PictureInPicture2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function VideoPictureInPictureButton({
  visible,
  onEnter,
  className,
}: {
  visible: boolean;
  onEnter: () => void | Promise<unknown>;
  className?: string;
}) {
  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Picture in picture"
      onClick={() => {
        void onEnter();
      }}
      className={cn(
        "inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 text-[var(--color-ink)] shadow-sm backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
        className
      )}
    >
      <PictureInPicture2 className="h-4 w-4" aria-hidden />
    </button>
  );
}
