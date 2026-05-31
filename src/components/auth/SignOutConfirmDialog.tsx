"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut } from "lucide-react";

type SignOutConfirmDialogProps = {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function SignOutConfirmDialog({
  open,
  loading = false,
  onCancel,
  onConfirm,
}: SignOutConfirmDialogProps) {
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

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
            aria-label="Cancel sign out"
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
            aria-describedby={descId}
            className="aee-signout-dialog-panel"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--a11y-error-bg)] text-[var(--a11y-error-fg)]">
              <LogOut className="h-5 w-5" aria-hidden />
            </div>
            <h2 id={titleId} className="mt-4 text-lg font-semibold text-[var(--color-ink)]">
              Sign out?
            </h2>
            <p id={descId} className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              You will need to log in again to access your study progress and subscription.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                ref={cancelRef}
                type="button"
                className="aee-signout-dialog-cancel"
                disabled={loading}
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="aee-signout-dialog-confirm"
                disabled={loading}
                onClick={onConfirm}
              >
                {loading ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
