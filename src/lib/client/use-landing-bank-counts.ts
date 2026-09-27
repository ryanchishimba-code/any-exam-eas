"use client";

import { useEffect, useState } from "react";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

type BankCountsApiResponse = LandingBankCountsDisplay & {
  updatedAt?: string;
  error?: string;
};

/** Starts from the server snapshot and refreshes from the public counts API. */
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
            sentence: data.sentence ?? data.totalQuestionsLabel,
            roundedDown: data.roundedDown ?? "",
            totalServed: data.totalServed,
            exams: data.exams,
            degraded: false,
          };
        });
      })
      .catch(() => {
        /* keep the server snapshot, which omits a number when the lookup failed */
      });

    return () => {
      cancelled = true;
    };
  }, [initial.degraded, initial.totalServed]);

  return bankCounts;
}
