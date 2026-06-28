"use client";

import { useQuery } from "@tanstack/react-query";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

export type LiveBankCountsResponse = LandingBankCountsDisplay & {
  updatedAt?: string;
};

async function fetchLiveBankCounts(): Promise<LiveBankCountsResponse> {
  const res = await fetch("/api/marketing/bank-counts");
  if (!res.ok) throw new Error("bank-counts-unavailable");
  return res.json() as Promise<LiveBankCountsResponse>;
}

/** Cached live serve-ready counts for nav, checkout, and client marketing surfaces. */
export function useLiveBankCounts() {
  return useQuery({
    queryKey: ["live-bank-counts"],
    queryFn: fetchLiveBankCounts,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}
