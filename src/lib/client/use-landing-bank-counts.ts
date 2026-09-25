"use client";

import { useEffect, useState } from "react";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

type BankCountsApiResponse = LandingBankCountsDisplay & {
  updatedAt?: string;
  error?: string;
};

/** Starts with published floor counts; upgrades from cached public API when available. */
export function useLandingBankCounts(initial: LandingBankCountsDisplay): LandingBankCountsDisplay {
  const [bankCounts, setBankCounts] = useState(initial);

  useEffect(() => {
    if (!initial.degraded && initial.totalServed > 0) return;
    let cancelled = false;

    fetch("/api/marketing/bank-counts", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: BankCountsApiResponse | null) => {
        if (cancelled || !data || data.degraded || data.error) return;
        setBankCounts((prev) => {
          // Skip re-render when live totals match the published floor (no flicker).
          if (
            prev.totalLabel === data.totalLabel &&
            prev.totalQuestionsLabel === data.totalQuestionsLabel &&
            prev.totalServed === data.totalServed
          ) {
            return prev;
          }
          return {
            totalLabel: data.totalLabel,
            totalQuestionsLabel: data.totalQuestionsLabel,
            totalServed: data.totalServed,
            exams: data.exams,
            degraded: false,
          };
        });
      })
      .catch(() => {
        /* keep floor counts */
      });

    return () => {
      cancelled = true;
    };
  }, [initial.degraded, initial.totalServed]);

  return bankCounts;
}
