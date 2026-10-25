"use client";

import type { BillingInterval } from "@/lib/billing-config";
import { FinishLineOfferMarkup } from "@/components/marketing/finish-line/FinishLineOfferMarkup";
import { isFinishLineEligibleInterval } from "@/lib/marketing/finish-line-offer";

type Props = {
  enabled: boolean;
  interval: BillingInterval;
};

export function FinishLineCheckoutNote({ enabled, interval }: Props) {
  if (!enabled) return null;
  return (
    <FinishLineOfferMarkup
      variant="checkout"
      ineligiblePlan={!isFinishLineEligibleInterval(interval)}
    />
  );
}
