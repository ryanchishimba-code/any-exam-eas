"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { EXAM_NAV_ITEMS } from "@/lib/routes";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";

export function ExamsDropdown() {
  const id = useId();
  const menuId = `${id}-menu`;
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);

  const examsActive = EXAM_NAV_ITEMS.some(
    (e) => pathname === e.href || pathname.startsWith(`${e.href}/`) || pathname.startsWith(`/practice/${e.slug}`)
  );

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        id={`${id}-trigger`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 text-xs transition-opacity duration-200",
          examsActive
            ? "font-semibold text-[var(--color-ink)] underline decoration-2 underline-offset-4 decoration-[var(--color-accent)]"
            : "text-[var(--color-ink)] opacity-80 hover:opacity-100"
        )}
      >
        Exams
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-labelledby={`${id}-trigger`}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-1.5 shadow-lg ring-1 ring-black/[0.04]"
          >
            {EXAM_NAV_ITEMS.map((exam) => (
              <Link
                key={exam.slug}
                href={exam.href}
                role="menuitem"
                className="block px-4 py-2.5 transition hover:bg-indigo-50/80"
                onClick={close}
              >
                <span className="text-sm font-medium text-[var(--color-ink)]">{exam.label}</span>
                <span className="mt-0.5 block text-xs text-[var(--color-ink-muted)]">
                  {exam.short} · {exam.stat}
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
