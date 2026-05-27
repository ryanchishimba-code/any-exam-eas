"use client";

import { formatMonthlyPrice } from "@/lib/site";
import { TRIAL_DAYS } from "@/lib/stripe";
import type { SignupPlan } from "@/lib/validators/auth";

type Plan = SignupPlan;

const plans: {
  id: Plan;
  title: string;
  description: string;
  badge?: string;
}[] = [
  {
    id: "trial",
    title: `${TRIAL_DAYS}-day free trial`,
    description: `Try everything free for ${TRIAL_DAYS} days, then ${formatMonthlyPrice()}/month if you keep studying.`,
    badge: "No card required",
  },
  {
    id: "subscribe",
    title: `Subscribe — ${formatMonthlyPrice()}/mo`,
    description: "Pay now and get full access immediately. Cancel anytime from billing settings.",
  },
];

export function PlanChoice({
  value,
  onChange,
  disabled,
}: {
  value: Plan | "";
  onChange: (plan: Plan) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset className="space-y-3" disabled={disabled}>
      <legend className="apple-label">Choose how to start</legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {plans.map((plan) => {
          const selected = value === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onChange(plan.id)}
              className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                selected
                  ? "border-[var(--color-accent)] bg-blue-50/50 shadow-[0_0_0_3px_rgba(0,113,227,0.12)]"
                  : "border-black/[0.08] bg-[var(--color-surface-elevated)] hover:border-black/[0.12]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--color-ink)]">{plan.title}</p>
                {plan.badge && (
                  <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[0.625rem] font-semibold text-green-800">
                    {plan.badge}
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                {plan.description}
              </p>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
