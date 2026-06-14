"use client";

import type { BillingInterval } from "@/lib/billing-config";
import { BillingIntervalDropdown } from "@/components/pricing/BillingIntervalDropdown";

type BillingIntervalPickerProps = {
  value: BillingInterval;
  onChange: (interval: BillingInterval) => void;
  variant?: "pricing" | "checkout";
  className?: string;
};

/** Billing cycle selector with dropdown + original vs discounted savings breakdown. */
export function BillingIntervalPicker(props: BillingIntervalPickerProps) {
  return <BillingIntervalDropdown {...props} />;
}
