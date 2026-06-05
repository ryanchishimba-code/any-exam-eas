"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { ShareModal } from "./ShareModal";

export function ShareFab() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-[var(--color-accent)] text-white shadow-lg shadow-sky-500/30 transition hover:scale-105"
        aria-label="Share your progress"
      >
        <Share2 className="h-6 w-6" />
      </button>
      <ShareModal open={open} onClose={() => setOpen(false)} examLabel={examLabel} />
    </>
  );
}
