"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { USMLE_STEPS, type UsmleFieldId } from "@/lib/exam-prep/usmle/steps";
import type { UsmleStepLevel } from "@/lib/exam-prep/usmle/types";
import { cn } from "@/lib/utils";

type Props = {
  pending?: boolean;
  onClose: () => void;
  onConfirm: (fieldId: UsmleFieldId) => void;
};

/**
 * Inline step choice for USMLE. Stays on the exam selector — no second page.
 * Step 1 starts selected; Step 2 CK and Step 3 stay one tap away.
 */
export function UsmleStepSheet({ pending = false, onClose, onConfirm }: Props) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [level, setLevel] = useState<UsmleStepLevel>("step1");
  const selected = USMLE_STEPS.find((step) => step.level === level) ?? USMLE_STEPS[0]!;

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, pending]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close step chooser"
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
        onClick={() => {
          if (!pending) onClose();
        }}
      />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative m-0 w-full max-w-lg rounded-t-3xl border border-white/10 bg-[var(--color-surface-elevated)] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl outline-none sm:m-4 sm:rounded-3xl sm:px-7 sm:pb-7 sm:pt-6"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
          USMLE
        </p>
        <h2
          id={titleId}
          className="mt-2 text-[1.65rem] font-bold tracking-tight text-[var(--color-ink)]"
        >
          Choose your Step
        </h2>
        <p className="mt-1.5 text-[15px] leading-relaxed tracking-tight text-[var(--color-ink-muted)]">
          Step 1 is selected. Pick another step if you need it, then continue to your Study Hub.
        </p>

        <div role="radiogroup" aria-label="USMLE step" className="mt-5 space-y-2">
          {USMLE_STEPS.map((step) => {
            const active = step.level === level;
            return (
              <button
                key={step.fieldId}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={pending}
                onClick={() => setLevel(step.level)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition",
                  active
                    ? "border-teal-500/50 bg-teal-500/10"
                    : "border-[var(--color-border)] bg-transparent hover:border-teal-500/30 hover:bg-teal-500/5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    active
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-[var(--color-border)] text-transparent"
                  )}
                  aria-hidden
                >
                  <Check className="h-3 w-3" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[16px] font-semibold tracking-tight text-[var(--color-ink)]">
                    {step.name}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug tracking-tight text-[var(--color-ink-muted)]">
                    {step.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="text-[13px] font-semibold tracking-tight text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] disabled:opacity-50"
          >
            All exams
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selected.fieldId)}
            disabled={pending}
            className="inline-flex min-h-11 min-w-[12rem] items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 text-[15px] font-semibold tracking-tight text-white transition hover:bg-teal-700 disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Opening Study Hub…
              </>
            ) : (
              `Continue with ${selected.shortName}`
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
