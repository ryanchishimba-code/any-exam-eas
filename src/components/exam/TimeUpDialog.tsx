"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { feUi } from "@/lib/study/full-exam-ui";

export function TimeUpDialog({
  open,
  onFinish,
}: {
  open: boolean;
  onFinish: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div className={feUi.modalOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
          <motion.div
            role="alertdialog"
            className={feUi.modal}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100">
              <Clock className="h-5 w-5 text-rose-600" aria-hidden />
            </div>
            <h2 className="mt-4 text-[17px] font-semibold text-[var(--color-ink)]">Time&apos;s up</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
              Your answers are being saved. Every response you recorded will count toward your score.
            </p>
            <button
              type="button"
              onClick={onFinish}
              className="mt-6 w-full rounded-full bg-rose-600 py-2.5 text-[14px] font-semibold text-white hover:bg-rose-700"
            >
              Submit exam now
            </button>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
