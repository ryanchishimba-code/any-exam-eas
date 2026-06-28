"use client";

import { BookOpen, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { PLATFORM_EXAM_LIST_MIDDOT } from "@/lib/landing/content";
import { FALLBACK_QUESTION_COUNTS } from "@/lib/marketing/bank-stats";
import { useLiveBankCounts } from "@/hooks/use-live-bank-counts";

type HeroTrustSignalsProps = {
  className?: string;
};

export function HeroTrustSignals({ className = "" }: HeroTrustSignalsProps) {
  const { data: bankCounts } = useLiveBankCounts();
  const questionTotal =
    bankCounts?.totalLabel && bankCounts.totalLabel !== "—"
      ? bankCounts.totalLabel
      : FALLBACK_QUESTION_COUNTS.total;

  const signals = [
    {
      icon: BookOpen,
      value: questionTotal,
      label: "Serve-ready questions",
    },
    {
      icon: Sparkles,
      value: "Adaptive",
      label: "Weak-area practice",
    },
    {
      icon: Stethoscope,
      value: "6 exams",
      label: PLATFORM_EXAM_LIST_MIDDOT,
    },
    {
      icon: ShieldCheck,
      value: "OER-backed",
      label: "Trusted explanations",
    },
  ];

  return (
    <div className={`grid grid-cols-2 gap-3 sm:grid-cols-4 ${className}`}>
      {signals.map(({ icon: Icon, value, label }) => (
        <div
          key={label}
          className="rounded-xl border border-teal-100/80 bg-white/60 px-3 py-3 text-center backdrop-blur-sm sm:px-4 sm:py-3.5 lg:text-left"
        >
          <Icon
            className="mx-auto h-4 w-4 text-teal-600 lg:mx-0"
            strokeWidth={2}
            aria-hidden
          />
          <p className="mt-2 text-sm font-bold tracking-tight text-[var(--color-ink)]">{value}</p>
          <p className="mt-0.5 text-[0.6875rem] leading-snug text-[var(--color-ink-muted)]">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
