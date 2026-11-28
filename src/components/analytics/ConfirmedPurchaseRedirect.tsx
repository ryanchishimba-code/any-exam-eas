"use client";

import { useEffect, useRef } from "react";
import type { ConfirmedPurchase } from "@/lib/analytics/google-ads";
import { trackConfirmedPurchaseAndWait } from "@/lib/analytics/google-ads-browser";

/**
 * Checkout return already confirmed the Stripe session on the server.
 * Fire purchase, then continue to the study hub success notice.
 */
export function ConfirmedPurchaseRedirect({
  purchase,
  email,
  nextHref,
}: {
  purchase: ConfirmedPurchase;
  email: string | null;
  nextHref: string;
}) {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void (async () => {
      await trackConfirmedPurchaseAndWait(purchase, email);
      window.location.replace(nextHref);
    })();
  }, [email, nextHref, purchase]);

  return null;
}
