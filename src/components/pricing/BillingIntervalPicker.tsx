"use client";

import type { BillingInterval } from "@/lib/billing-config";
import { BillingIntervalDropdown } from "@/components/pricing/BillingIntervalDropdown";

import type { SubscriptionTier } from "@/lib/subscription-tiers";

type BillingIntervalPickerProps = {
  value: BillingInterval;
  onChange: (interval: BillingInterval) => void;
  tier?: SubscriptionTier;
  variant?: "pricing" | "checkout";
  className?: string;
};

/** Billing cycle selector with dropdown + original vs discounted savings breakdown. */
export function BillingIntervalPicker(props: BillingIntervalPickerProps) {
  return <BillingIntervalDropdown {...props} />;
}
