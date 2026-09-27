"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { usePracticeSessionActive } from "@/lib/client/practice-session-context";
import { isAppShellRoute, isFullExamSessionRoute } from "@/lib/navigation/app-shell";
import { isShareFabHiddenRoute } from "@/lib/navigation/share-fab";
import { cn } from "@/lib/utils";
import { ShareModal } from "./ShareModal";

export function ShareFab() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const practiceSession = usePracticeSessionActive();

  if (
    practiceSession ||
    isAppShellRoute(pathname) ||
    isFullExamSessionRoute(pathname) ||
    isShareFabHiddenRoute(pathname)
  ) {
    return null;
  }

  const examLabel = pathname.includes("nclex")
    ? "NCLEX"
    : pathname.includes("usmle")
      ? "USMLE"
      : pathname.includes("naplex")
        ? "NAPLEX"
        : "board";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed left-4 top-[calc(env(safe-area-inset-top,0px)+4.75rem)] z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--study-accent)] text-[var(--study-accent-on)] shadow-lg shadow-teal-900/15 transition hover:bg-[var(--study-accent-hover)]"
        )}
        aria-label="Share your progress"
      >
        <Share2 className="h-6 w-6" />
      </button>
      <ShareModal open={open} onClose={() => setOpen(false)} examLabel={examLabel} />
    </>
  );
}
