"use client";

import { useEffect, useId, useRef } from "react";
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
    cancelRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) {
        e.preventDefault();
        onCancel();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [loading, onCancel, open]);

  if (!open) return null;

  return (
    <div className="aee-signout-dialog-root" role="presentation">
      <button
        type="button"
        className="aee-signout-dialog-backdrop"
        aria-label="Cancel sign out"
        disabled={loading}
        onClick={onCancel}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="aee-signout-dialog-panel"
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
      </div>
    </div>
  );
}
