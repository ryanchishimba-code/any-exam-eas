"use client";

import type { BillingInterval } from "@/lib/billing-config";
import { BillingIntervalDropdown } from "@/components/pricing/BillingIntervalDropdown";

type BillingIntervalSelectorProps = {
  value: BillingInterval;
  onChange: (interval: BillingInterval) => void;
};

export function BillingIntervalSelector({ value, onChange }: BillingIntervalSelectorProps) {
  return <BillingIntervalDropdown value={value} onChange={onChange} variant="checkout" />;
}
