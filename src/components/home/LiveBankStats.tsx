"use client";

import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, Layers } from "lucide-react";
import { formatExactServeReadyCount, FALLBACK_QUESTION_COUNTS } from "@/lib/marketing/bank-stats";
import { useLiveBankCounts } from "@/hooks/use-live-bank-counts";

export function LiveBankStats({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { data: bankCounts } = useLiveBankCounts();
  const [nursingFallback, setNursingFallback] = useState(0);

  useEffect(() => {
    if (bankCounts?.degraded) return;
    fetch("/api/catalog/subjects")
      .then((r) => (r.ok ? r.json() : null))
      .then((catalog) => {
        if (catalog?.subjects) {
          const n = catalog.subjects.find(
            (s: { fieldId: string }) => s.fieldId === "nursing"
          )?.questionCount;
          if (typeof n === "number") setNursingFallback(n);
        }
      })
      .catch(() => undefined);
  }, [bankCounts?.degraded]);

  const degraded = bankCounts?.degraded === true;

  const totalLabel =
    !degraded && bankCounts?.totalLabel && bankCounts.totalLabel !== "—"
      ? bankCounts.totalLabel
      : degraded
        ? "—"
        : FALLBACK_QUESTION_COUNTS.total;

  const nursingLive = bankCounts?.exams.find((e) => e.slug === "nclex");
  const nursingLabel =
    !degraded && nursingLive?.countLabel && nursingLive.countLabel !== "—"
      ? nursingLive.countLabel
      : degraded
        ? "—"
        : nursingFallback > 0
          ? formatExactServeReadyCount(nursingFallback)
          : FALLBACK_QUESTION_COUNTS.nursing;

  const items = [
    {
      icon: BookOpen,
      value: totalLabel,
      label: degraded ? "Serve-ready questions (updating)" : "Serve-ready questions",
    },
    {
      icon: GraduationCap,
      value: "6",
      label: "Licensing exams",
    },
    {
      icon: Layers,
      value: nursingLabel,
      label: degraded ? "NCLEX bank (updating)" : "NCLEX bank",
    },
  ];

  if (compact) {
    return (
      <div
        className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-between ${className}`}
        aria-label="Live question bank stats"
      >
        {items.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm">
            <Icon
              className="h-3.5 w-3.5 shrink-0 text-teal-600 dark:text-teal-400"
              strokeWidth={2}
              aria-hidden
            />
            <span>
              <span className="font-bold text-[var(--color-ink)]">{value}</span>
              <span className="text-[var(--color-ink-muted)]"> · {label}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      {items.map(({ icon: Icon, value, label }) => (
        <div
          key={label}
          className="rounded-xl border border-teal-100/80 bg-[color-mix(in_srgb,var(--color-surface-elevated)_60%,transparent)] px-3 py-3 text-center backdrop-blur-sm dark:border-teal-900/40 sm:px-4 sm:py-3.5"
        >
          <Icon
            className="mx-auto h-4 w-4 text-teal-600 dark:text-teal-400"
            strokeWidth={2}
            aria-hidden
          />
          <p className="mt-2 text-sm font-bold tracking-tight text-[var(--color-ink)]">{value}</p>
          <p className="mt-0.5 text-[0.625rem] leading-snug text-[var(--color-ink-muted)] sm:text-[0.6875rem]">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
