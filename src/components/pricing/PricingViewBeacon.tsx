"use client";

import { useEffect } from "react";

/** Records a pricing view without rendering anything into the document. */
export function PricingViewBeacon() {
  useEffect(() => {
    const id = window.setTimeout(() => {
      void import("@/lib/analytics").then(({ analytics }) => analytics.pricingViewed("/pricing"));
    }, 1500);
    return () => window.clearTimeout(id);
  }, []);
  return null;
}
