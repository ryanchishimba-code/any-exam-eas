"use client";

import { useEffect, useState } from "react";
import { pricingHeadlineFromContext } from "@/lib/marketing/why-trust-it";

/**
 * Pricing H1. The server title already includes `?field=` / `?exam=`.
 * A same-origin referrer (a board hub, or a URL with `field`) fills in
 * when the query string has no board.
 */
export function PricingBoardHeadline({ initial }: { initial: string }) {
  const [title, setTitle] = useState(initial);

  useEffect(() => {
    if (initial !== "Pro") return;
    try {
      const ref = document.referrer;
      if (!ref) return;
      const url = new URL(ref);
      if (url.origin !== window.location.origin) return;
      const next = pricingHeadlineFromContext({
        referrerPath: url.pathname,
        referrerField: url.searchParams.get("field"),
      });
      if (next !== "Pro") setTitle(next);
    } catch {
      /* ignore a malformed referrer */
    }
  }, [initial]);

  return <>{title}</>;
}
