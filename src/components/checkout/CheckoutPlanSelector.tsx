"use client";

import { formatMonthlyPrice, formatTrialCtaLabel, formatTrialTodayPrice } from "@/lib/site";
import { TRIAL_DAYS } from "@/lib/billing-config";
import type { SignupPlan } from "@/lib/validators/auth";
import { cn } from "@/lib/utils";

type CheckoutPlanSelectorProps = {
  value: SignupPlan;
  onChange: (plan: SignupPlan) => void;
};

export function CheckoutPlanSelector({ value, onChange }: CheckoutPlanSelectorProps) {
  const options: { id: SignupPlan; title: string; detail: string }[] = [
    {
      id: "trial",
      title: `${TRIAL_DAYS}-day trial`,
      detail: `${formatTrialTodayPrice()} · card, Apple Pay, or Google Pay · then ${formatMonthlyPrice()}/mo`,
    },
    {
      id: "subscribe",
      title: "Monthly subscription",
      detail: `${formatMonthlyPrice()}/month · cancel anytime`,
    },
  ];

  return (
    <fieldset className="space-y-3">
      <legend className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        1. Choose your plan
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={cn(
                "rounded-2xl border p-4 text-left transition-all duration-200",
                selected
                  ? "border-[var(--color-accent)] bg-white shadow-[0_0_0_3px_rgba(0,113,227,0.1)]"
                  : "border-slate-200/90 bg-slate-50/50 hover:border-slate-300 hover:bg-white"
              )}
            >
              <p className="text-sm font-semibold text-slate-900">{opt.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{opt.detail}</p>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
