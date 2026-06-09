"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { isAppShellRoute, isFullExamSessionRoute } from "@/lib/navigation/app-shell";
import { cn } from "@/lib/utils";
import { ShareModal } from "./ShareModal";

export function ShareFab() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const aboveMobileNav =
    isAppShellRoute(pathname) && !isFullExamSessionRoute(pathname);

  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
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
          "fixed right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-[var(--color-accent)] text-white shadow-lg shadow-sky-500/30 transition hover:scale-105 sm:right-6 sm:h-14 sm:w-14",
          aboveMobileNav
            ? "bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] lg:bottom-6"
            : "bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:bottom-6"
        )}
        aria-label="Share your progress"
      >
        <Share2 className="h-6 w-6" />
      </button>
      <ShareModal open={open} onClose={() => setOpen(false)} examLabel={examLabel} />
    </>
  );
}
