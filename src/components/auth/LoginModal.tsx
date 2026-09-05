"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, ArrowLeft, KeyRound, Mail, ShieldCheck, X } from "lucide-react";
import {
  firstName,
  loadReturningUserHint,
  maskEmail,
} from "@/lib/client/returning-user";
import { DEFAULT_AUTH_CALLBACK } from "@/lib/client/auth-routes";
import { ForgotPasswordPanel, type ForgotPasswordStep } from "@/components/auth/ForgotPasswordPanel";
import { LoginPanel } from "@/components/auth/LoginPanel";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  callbackUrl?: string;
};

type ModalView = "login" | "forgot";

const panelMotion = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
  transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const },
};

export function LoginModal({ open, onClose, callbackUrl = DEFAULT_AUTH_CALLBACK }: LoginModalProps) {
  const [hint, setHint] = useState<ReturnType<typeof loadReturningUserHint>>(null);
  const [view, setView] = useState<ModalView>("login");
  const [forgotStep, setForgotStep] = useState<ForgotPasswordStep>("form");

  useEffect(() => {
    if (!open) return;
    setHint(loadReturningUserHint());
  }, [open]);

  useEffect(() => {
    if (!open) {
      setView("login");
      setForgotStep("form");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (view === "forgot" && forgotStep === "success") {
          setView("login");
          setForgotStep("form");
          return;
        }
        if (view === "forgot") {
          setView("login");
          return;
        }
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, view, forgotStep]);

  const displayName = hint?.name
    ? firstName(hint.name)
    : hint?.email
      ? firstName(null, hint.email)
      : null;

  const header =
    view === "login"
      ? {
          eyebrow: "Log in",
          title: displayName ? `Welcome back, ${displayName}` : "Welcome back",
          subtitle: hint?.email ? (
            <>
              Continue as{" "}
              <span className="font-medium text-white">{maskEmail(hint.email)}</span>
            </>
          ) : (
            <>One tap to your Study Hub — question banks, drugs, and progress.</>
          ),
          icon: Activity,
        }
      : forgotStep === "success"
        ? {
            eyebrow: "Email sent",
            title: "Check your inbox",
            subtitle: <>We sent password reset instructions if an account exists for that email.</>,
            icon: Mail,
          }
        : {
            eyebrow: "Account recovery",
            title: "Forgot your password?",
            subtitle: <>Enter your email and we&apos;ll send a secure reset link.</>,
            icon: KeyRound,
          };

  const HeaderIcon = header.icon;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-6 lg:p-10">
          <motion.button
            type="button"
            aria-label="Close login dialog"
            className="absolute inset-0 bg-[#0c4a6e]/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[96dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-[0_24px_80px_rgba(8,145,178,0.22)] sm:max-h-[min(94vh,820px)] sm:max-w-2xl sm:rounded-[1.75rem] lg:max-w-3xl"
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

              {view === "forgot" && forgotStep === "form" && (
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setForgotStep("form");
                  }}
                  className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                  aria-label="Back to login"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                </button>
              )}

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${view}-${forgotStep}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <HeaderIcon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                  </span>
                  <div className={view === "forgot" && forgotStep === "form" ? "pl-8 sm:pl-0" : undefined}>
                    <p className="text-xs font-medium uppercase tracking-wider text-teal-100/90">
                      {header.eyebrow}
                    </p>
                    <h2 id="login-modal-title" className="text-xl font-semibold tracking-tight">
                      {header.title}
                    </h2>
                  </div>
                </motion.div>
              </AnimatePresence>

              <motion.p
                key={`sub-${view}-${forgotStep}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-sm leading-relaxed text-teal-50/90"
              >
                {header.subtitle}
              </motion.p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-7">
              <AnimatePresence mode="wait" initial={false}>
                {view === "login" ? (
                  <motion.div key="login-panel" {...panelMotion}>
                    <LoginPanel
                      callbackUrl={callbackUrl}
                      onSuccess={onClose}
                      onForgotPassword={() => setView("forgot")}
                      forgotLinkClassName="text-teal-600 hover:text-teal-700"
                    />

                    <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[0.6875rem] text-slate-500">
                      <ShieldCheck className="h-3.5 w-3.5 text-teal-600" aria-hidden />
                      Encrypted · Security-first infrastructure
                    </p>

                    <p className="mt-4 text-center text-xs text-slate-500">
                      New here?{" "}
                      <Link
                        href={LANDING_TRIAL_HREF}
                        onClick={onClose}
                        className="font-semibold text-teal-600 hover:text-teal-700"
                      >
                        Start your trial
                      </Link>
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="forgot-panel" {...panelMotion}>
                    <ForgotPasswordPanel
                      variant="modal"
                      defaultEmail={hint?.email ?? ""}
                      onBackToLogin={() => {
                        setView("login");
                        setForgotStep("form");
                      }}
                      onStepChange={setForgotStep}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
