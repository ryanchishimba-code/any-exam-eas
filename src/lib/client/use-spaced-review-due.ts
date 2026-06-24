"use client";

import { useEffect, useState } from "react";
import type { ExamSlug } from "@/types/edtech";

/** Lightweight poll of SRS due count for nav badges — scoped to the active exam. */
export function useSpacedReviewDue(examSlug: ExamSlug | null): number {
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    if (!examSlug) {
      setDueCount(0);
      return;
    }

    let cancelled = false;

    void fetch(`/api/learning/dashboard?examSlug=${encodeURIComponent(examSlug)}`, {
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        setDueCount(data?.dashboard?.spacedReview?.dueCount ?? 0);
      })
      .catch(() => {
        if (!cancelled) setDueCount(0);
      });

    return () => {
      cancelled = true;
    };
  }, [examSlug]);

  return dueCount;
}
