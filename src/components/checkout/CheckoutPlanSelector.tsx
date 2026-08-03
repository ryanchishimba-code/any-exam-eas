"use client";

import { formatMonthlyPrice, formatTrialTodayPrice } from "@/lib/site";
import { TRIAL_DAYS } from "@/lib/billing-config";
import type { SignupPlan } from "@/lib/validators/auth";
import { cn } from "@/lib/utils";

type CheckoutPlanSelectorProps = {
  value: SignupPlan;
  onChange: (plan: SignupPlan) => void;
  /** Signup uses no-card trial copy; checkout keeps payment-aware trial wording. */
  context?: "checkout" | "signup";
};

const CHECKOUT_OPTIONS: { id: SignupPlan; label: string; sub: string }[] = [
  {
    id: "trial",
    label: "Free trial",
    sub: `${formatTrialTodayPrice()} · ${TRIAL_DAYS} days`,
  },
  {
    id: "subscribe",
    label: "Subscribe",
    sub: `From ${formatMonthlyPrice()}/mo`,
  },
];

const SIGNUP_OPTIONS: { id: SignupPlan; label: string; sub: string }[] = [
  {
    id: "trial",
    label: "Start free trial",
    sub: `${formatTrialTodayPrice()} · ${TRIAL_DAYS} days · no card`,
  },
  {
    id: "subscribe",
    label: "Subscribe to Pro",
    sub: `From ${formatMonthlyPrice()}/mo`,
  },
];

export function CheckoutPlanSelector({
  value,
  onChange,
  context = "checkout",
}: CheckoutPlanSelectorProps) {
  const options = context === "signup" ? SIGNUP_OPTIONS : CHECKOUT_OPTIONS;
  const legend = context === "signup" ? "How do you want to start?" : "Plan";
  const ariaLabel = context === "signup" ? "Start with free trial or subscribe" : "Plan type";

  return (
    <fieldset className="space-y-3">
      {/*
        This control sits on light surfaces (AuthCard / checkout cards). Do not use
        `--color-ink*` — those flip to near-white in dark theme and wash out on white pills.
      */}
      <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {legend}
      </legend>
      <div
        className="flex rounded-full bg-black/[0.04] p-1"
        role="radiogroup"
        aria-label={ariaLabel}
      >
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.id)}
              className={cn(
                "min-w-0 flex-1 rounded-full px-4 py-3 text-center transition-all duration-200",
                selected
                  ? "bg-white text-slate-900 shadow-[var(--shadow-apple-sm)]"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <span
                className={cn(
                  "block text-sm font-semibold",
                  selected ? "text-slate-900" : "text-slate-700"
                )}
              >
                {opt.label}
              </span>
              <span
                className={cn(
                  "mt-0.5 block text-[0.6875rem]",
                  selected ? "text-slate-600" : "text-slate-500"
                )}
              >
                {opt.sub}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
