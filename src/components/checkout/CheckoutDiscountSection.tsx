"use client";

import { Tag } from "lucide-react";
import { DiscountCodeInput } from "@/components/discount/DiscountCodeInput";
import type { DiscountValidation } from "@/lib/discount/types";
import type { SignupPlan } from "@/lib/validators/auth";

type CheckoutDiscountSectionProps = {
  plan: SignupPlan;
  initialCode?: string;
  onValidationChange: (result: DiscountValidation | null) => void;
  appliedCode?: string | null;
  onRemove?: () => void;
};

/**
 * Step 2 on checkout — discount entry after plan is selected.
 */
export function CheckoutDiscountSection({
  plan,
  initialCode = "",
  onValidationChange,
  appliedCode,
  onRemove,
}: CheckoutDiscountSectionProps) {
  return (
    <section className="space-y-3" aria-labelledby="checkout-discount-heading">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p
            id="checkout-discount-heading"
            className="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            2. Discount code
          </p>
          <p className="mt-0.5 text-sm text-slate-600">Optional — updates your total instantly</p>
        </div>
        <Tag className="h-5 w-5 shrink-0 text-slate-300" aria-hidden />
      </div>

      {appliedCode && onRemove ? (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3">
          <p className="text-sm font-medium text-emerald-900">
            <span className="font-semibold">{appliedCode}</span> applied to this order
          </p>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-semibold text-emerald-800 underline-offset-2 hover:underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <DiscountCodeInput
          plan={plan}
          initialCode={initialCode}
          onValidationChange={onValidationChange}
          variant="inline"
          hidePricePreview
        />
      )}

      <p className="text-center text-[0.6875rem] leading-relaxed text-slate-400">
        Codes are validated securely. Invalid or expired codes won&apos;t block checkout.
      </p>
    </section>
  );
}
