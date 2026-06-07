"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

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
          <motion.div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <motion.div
            role="alertdialog"
            className="relative w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
              <Clock className="h-6 w-6 text-rose-600" aria-hidden />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">Time&apos;s up</h2>
            <p className="mt-2 text-sm text-slate-600">
              Your answers are being saved automatically. You can submit now or wait a few seconds
              — every response you&apos;ve recorded will count toward your score.
            </p>
            <button
              type="button"
              onClick={onFinish}
              className="mt-6 w-full rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
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
