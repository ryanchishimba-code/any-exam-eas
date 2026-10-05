"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { pricingHeadlineFromContext } from "@/lib/marketing/pricing-headline";

/**
 * Pricing H1. `?field=` / `?exam=` are read here so the page can stay cached.
 * A same-origin referrer fills in when the query string has no board.
 */
export function PricingBoardHeadline() {
  const searchParams = useSearchParams();
  const fromQuery = pricingHeadlineFromContext({
    field: searchParams.get("field"),
    exam: searchParams.get("exam"),
  });
  const [referrerTitle, setReferrerTitle] = useState<string | null>(null);
  const title = fromQuery !== "Pro" ? fromQuery : (referrerTitle ?? "Pro");

  useEffect(() => {
    if (fromQuery !== "Pro") return;
    try {
      const ref = document.referrer;
      if (!ref) return;
      const url = new URL(ref);
      if (url.origin !== window.location.origin) return;
      const next = pricingHeadlineFromContext({
        referrerPath: url.pathname,
        referrerField: url.searchParams.get("field"),
      });
      if (next !== "Pro") setReferrerTitle(next);
    } catch {
      /* ignore a malformed referrer */
    }
  }, [fromQuery]);

  const display = title === "Pro" ? "Six boards. One monthly price." : `${title} is on this plan.`;
  return <>{display}</>;
}
