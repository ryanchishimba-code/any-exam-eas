"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { feUi } from "@/lib/study/full-exam-ui";

export function PauseExamDialog({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.button
            type="button"
            className={feUi.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            aria-label="Close"
          />
          <motion.div
            role="alertdialog"
            aria-labelledby="pause-title"
            className={feUi.modal}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
          >
            <h2 id="pause-title" className="text-[17px] font-semibold text-[var(--color-ink)]">
              Pause exam?
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
              The timer stops while paused. Take a breath — you&apos;ve got this.
            </p>
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={onCancel} className="flex-1 rounded-full border border-black/[0.08] py-2.5 text-[14px] font-semibold text-[var(--color-ink)] hover:bg-black/[0.02]">
                Keep going
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 rounded-full bg-[var(--color-accent)] py-2.5 text-[14px] font-semibold text-white shadow-[var(--shadow-apple-btn)]"
              >
                Pause
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
