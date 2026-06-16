"use client";

import type { BillingInterval } from "@/lib/billing-config";
import { BillingIntervalDropdown } from "@/components/pricing/BillingIntervalDropdown";

type BillingIntervalSelectorProps = {
  value: BillingInterval;
  onChange: (interval: BillingInterval) => void;
  tier?: import("@/lib/subscription-tiers").SubscriptionTier;
};

export function BillingIntervalSelector({ value, onChange, tier = "pro" }: BillingIntervalSelectorProps) {
  return <BillingIntervalDropdown value={value} onChange={onChange} variant="checkout" tier={tier} />;
}
