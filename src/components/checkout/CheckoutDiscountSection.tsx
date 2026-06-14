"use client";

import { useState } from "react";
import { ChevronDown, Tag } from "lucide-react";
import type { BillingInterval } from "@/lib/billing-config";
import { DiscountCodeInput } from "@/components/discount/DiscountCodeInput";
import type { DiscountValidation } from "@/lib/discount/types";
import type { SignupPlan } from "@/lib/validators/auth";
import { cn } from "@/lib/utils";

type CheckoutDiscountSectionProps = {
  plan: SignupPlan;
  interval?: BillingInterval;
  initialCode?: string;
  onValidationChange: (result: DiscountValidation | null) => void;
  appliedCode?: string | null;
  onRemove?: () => void;
};

export function CheckoutDiscountSection({
  plan,
  interval = "monthly",
  initialCode = "",
  onValidationChange,
  appliedCode,
  onRemove,
}: CheckoutDiscountSectionProps) {
  const [open, setOpen] = useState(Boolean(initialCode.trim() || appliedCode));

  if (appliedCode && onRemove) {
    return (
      <section aria-label="Discount applied">
        <div className="flex items-center justify-between rounded-2xl border border-emerald-200/80 bg-emerald-50/60 px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-medium text-emerald-900">
            <Tag className="h-4 w-4" aria-hidden />
            <span className="font-semibold">{appliedCode}</span> applied
          </p>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-semibold text-emerald-800 underline-offset-2 hover:underline"
          >
            Remove
          </button>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Promo code">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-2xl border border-black/[0.06] bg-white px-4 py-3.5 text-left transition hover:border-black/[0.1]"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink-muted)]">
          <Tag className="h-4 w-4" aria-hidden />
          Have a promo code?
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[var(--color-ink-muted)] transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {open && (
        <div className="mt-2">
          <DiscountCodeInput
            plan={plan}
            interval={interval}
            initialCode={initialCode}
            onValidationChange={onValidationChange}
            variant="inline"
            hidePricePreview
          />
        </div>
      )}
    </section>
  );
}
