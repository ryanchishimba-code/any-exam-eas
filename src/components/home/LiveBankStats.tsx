"use client";

import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, Layers } from "lucide-react";
import {
  formatExactServeReadyCount,
  MARKETING_QUESTION_COUNTS,
} from "@/lib/marketing/bank-stats";

type CatalogResponse = {
  totalQuestions: number;
  subjects: { fieldId: string; title: string; questionCount: number }[];
};

type BankCountsResponse = {
  totalLabel: string;
  totalQuestionsLabel: string;
  totalServed: number;
  degraded?: boolean;
};

function formatLiveCount(n: number, fallback: string): string {
  return n > 0 ? formatExactServeReadyCount(n) : fallback;
}

export function LiveBankStats({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const [stats, setStats] = useState<CatalogResponse | null>(null);
  const [bankCounts, setBankCounts] = useState<BankCountsResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch("/api/catalog/subjects", { signal: controller.signal })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch("/api/marketing/bank-counts", { signal: controller.signal })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ]).then(([catalog, counts]) => {
      setStats(catalog && Array.isArray(catalog.subjects) ? catalog : null);
      setBankCounts(counts && typeof counts.totalLabel === "string" ? counts : null);
    });
    return () => controller.abort();
  }, []);

  const total = bankCounts?.totalServed ?? stats?.totalQuestions ?? 0;
  const nursing =
    stats?.subjects.find((s) => s.fieldId === "nursing")?.questionCount ?? 0;

  const items = [
    {
      icon: BookOpen,
      value:
        bankCounts?.totalLabel ??
        formatLiveCount(total, MARKETING_QUESTION_COUNTS.total),
      label: "Serve-ready questions",
    },
    {
      icon: GraduationCap,
      value: "6",
      label: "Licensing exams",
    },
    {
      icon: Layers,
      value: formatLiveCount(nursing, MARKETING_QUESTION_COUNTS.nursing),
      label: "NCLEX bank",
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
          <p className="mt-2 text-sm font-bold tracking-tight text-[var(--color-ink)]">
            {value}
          </p>
          <p className="mt-0.5 text-[0.625rem] leading-snug text-[var(--color-ink-muted)] sm:text-[0.6875rem]">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
