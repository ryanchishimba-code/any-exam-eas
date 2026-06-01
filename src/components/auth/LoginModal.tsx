"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, ShieldCheck, X } from "lucide-react";
import {
  firstName,
  loadReturningUserHint,
  maskEmail,
} from "@/lib/client/returning-user";
import { LoginPanel } from "@/components/auth/LoginPanel";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  callbackUrl?: string;
};

export function LoginModal({ open, onClose, callbackUrl = "/dashboard" }: LoginModalProps) {
  const [hint, setHint] = useState<ReturnType<typeof loadReturningUserHint>>(null);

  useEffect(() => {
    if (!open) return;
    setHint(loadReturningUserHint());
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const displayName = hint?.name
    ? firstName(hint.name)
    : hint?.email
      ? firstName(null, hint.email)
      : null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.button
            type="button"
            aria-label="Close login dialog"
            className="absolute inset-0 bg-[#0c4a6e]/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            initial={{ opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-[0_24px_80px_rgba(8,145,178,0.25)] sm:rounded-[1.75rem]"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0e7490] via-[#0891b2] to-[#0284c7] px-6 pb-7 pt-6 text-white">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Activity className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-teal-100/90">
                    Log in
                  </p>
                  <h2 id="login-modal-title" className="text-xl font-semibold tracking-tight">
                    {displayName ? `Welcome back, ${displayName}` : "Welcome back"}
                  </h2>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-teal-50/90">
                {hint?.email ? (
                  <>
                    Continue as{" "}
                    <span className="font-medium text-white">{maskEmail(hint.email)}</span>
                  </>
                ) : (
                  <>One tap to your dashboard — practice exams, drugs, and progress.</>
                )}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <LoginPanel callbackUrl={callbackUrl} onSuccess={onClose} />

              <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[0.6875rem] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" aria-hidden />
                Encrypted · Security-first infrastructure
              </p>

              <p className="mt-4 text-center text-xs text-slate-500">
                New here?{" "}
                <Link
                  href="/signup?plan=trial"
                  onClick={onClose}
                  className="font-semibold text-teal-600 hover:text-teal-700"
                >
                  Start your trial
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
