"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { DoorOpen } from "lucide-react";

export type ExitActivityKind = "exam" | "activity";

type ExitActivityModalProps = {
  open: boolean;
  kind: ExitActivityKind;
  loading?: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

const COPY: Record<
  ExitActivityKind,
  { title: string; description: string; confirm: string; loading: string }
> = {
  exam: {
    title: "End this exam?",
    description: "Are you sure you want to end this exam? Your progress will be saved.",
    confirm: "End exam",
    loading: "Saving progress…",
  },
  activity: {
    title: "End this activity?",
    description: "Are you sure you want to end this activity? Your progress will be saved.",
    confirm: "End activity",
    loading: "Saving progress…",
  },
};

export function ExitActivityModal({
  open,
  kind,
  loading = false,
  error = null,
  onCancel,
  onConfirm,
}: ExitActivityModalProps) {
  const titleId = useId();
  const descId = useId();
  const errorId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const copy = COPY[kind];

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => cancelRef.current?.focus(), 0);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) {
        e.preventDefault();
        onCancel();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [loading, onCancel, open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="aee-signout-dialog-root" role="presentation">
          <motion.button
            type="button"
            className="aee-signout-dialog-backdrop"
            aria-label="Cancel and continue"
            disabled={loading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onCancel}
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={error ? `${descId} ${errorId}` : descId}
            className="aee-signout-dialog-panel"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-700">
              <DoorOpen className="h-5 w-5" aria-hidden />
            </div>
            <h2 id={titleId} className="mt-4 text-lg font-semibold text-[var(--color-ink)]">
              {copy.title}
            </h2>
            <p id={descId} className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {copy.description}
            </p>
            <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
              Press{" "}
              <kbd className="rounded border border-black/10 bg-black/[0.04] px-1 py-0.5 font-mono text-[0.65rem]">
                Esc
              </kbd>{" "}
              to keep going.
            </p>
            {error && (
              <p
                id={errorId}
                role="alert"
                className="mt-3 rounded-lg bg-[var(--a11y-error-bg)] px-3 py-2 text-sm text-[var(--a11y-error-fg)]"
              >
                {error}
              </p>
            )}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                ref={cancelRef}
                type="button"
                className="aee-signout-dialog-cancel"
                disabled={loading}
                onClick={onCancel}
              >
                Keep going
              </button>
              <button
                type="button"
                className="aee-exit-dialog-confirm"
                disabled={loading}
                onClick={onConfirm}
              >
                {loading ? copy.loading : copy.confirm}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
