"use client";

import type { DiscountValidation } from "@/lib/discount/types";
import { FULL_ACCESS_COPY } from "@/lib/discount/access";
import { formatUsd, hasDiscount } from "@/lib/promo-pricing";
import { MONTHLY_PRICE_USD, TRIAL_INTRO_PRICE_USD, TRIAL_DAYS, usesIntroTrialPricing } from "@/lib/billing-config";
import type { SignupPlan } from "@/lib/validators/auth";

export function CheckoutPriceSummary({
  plan,
  validation,
}: {
  plan: SignupPlan;
  validation: DiscountValidation | null;
}) {
  const pricing = validation?.valid ? validation.pricing : undefined;

  if (pricing && hasDiscount(pricing)) {
    return (
      <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/50 px-4 py-3">
        <p className="text-sm font-semibold text-emerald-900">
          {validation?.code} — you save {pricing.formattedSavings}
        </p>
        <p className="mt-2 text-sm text-slate-700">
          <span className="text-slate-400 line-through">
            {formatUsd(pricing.primary.original)}
          </span>{" "}
          <span className="font-semibold text-emerald-800">
            → {formatUsd(pricing.primary.discounted)}
          </span>
          {pricing.recurring && (
            <>
              {" "}
              · then{" "}
              <span className="text-slate-400 line-through">
                {formatUsd(pricing.recurring.original)}
              </span>{" "}
              <span className="font-semibold text-emerald-800">
                {formatUsd(pricing.recurring.discounted)}/mo
              </span>
            </>
          )}
        </p>
        <p className="mt-2 text-xs text-emerald-800">{FULL_ACCESS_COPY}</p>
      </div>
    );
  }

  if (plan === "trial") {
    if (usesIntroTrialPricing()) {
      return (
        <p className="text-sm text-[var(--color-ink-muted)]">
          {formatUsd(TRIAL_INTRO_PRICE_USD)} intro · {TRIAL_DAYS}-day trial · then{" "}
          {formatUsd(MONTHLY_PRICE_USD)}/mo
        </p>
      );
    }
    return (
      <p className="text-sm text-[var(--color-ink-muted)]">
        {formatUsd(0)} today · {TRIAL_DAYS}-day free trial · Apple Pay, Google Pay & cards · then{" "}
        {formatUsd(MONTHLY_PRICE_USD)}/mo after trial
      </p>
    );
  }

  return (
    <p className="text-sm text-[var(--color-ink-muted)]">
      {formatUsd(MONTHLY_PRICE_USD)}/month · full access immediately
    </p>
  );
}
