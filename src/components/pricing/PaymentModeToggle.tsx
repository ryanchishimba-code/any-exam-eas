"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { BillingInterval } from "@/lib/billing-config";
import {
  PAYMENT_MODES,
  paymentModeDetail,
  paymentModeOptions,
  type PaymentMode,
} from "@/lib/billing-payment-mode";
import type { SubscriptionTier } from "@/lib/subscription-tiers";
import { cn } from "@/lib/utils";

type PaymentModeToggleProps = {
  value: PaymentMode;
  onChange: (mode: PaymentMode) => void;
  tier?: SubscriptionTier;
  interval: BillingInterval;
  /** `card` drops the legend for use inside a priced plan card. */
  variant?: "standalone" | "card";
  className?: string;
};

/**
 * Segmented auto-pay / pay-once control.
 *
 * Like `CheckoutPlanSelector`, this renders on white card surfaces, so it uses
 * `slate-*` rather than `--color-ink*` (those invert in dark theme and wash out).
 */
export function PaymentModeToggle({
  value,
  onChange,
  tier = "pro",
  interval,
  variant = "standalone",
  className,
}: PaymentModeToggleProps) {
  const reduceMotion = useReducedMotion();
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const options = paymentModeOptions(tier, interval);

  function focusMode(index: number) {
    const next = (index + PAYMENT_MODES.length) % PAYMENT_MODES.length;
    onChange(PAYMENT_MODES[next]!);
    buttonsRef.current[next]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      focusMode(index + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      focusMode(index - 1);
    }
  }

  return (
    <div className={cn("space-y-2.5", className)}>
      {variant === "standalone" && (
        <p className="text-center text-sm font-medium text-slate-900">
          How would you like to pay?
        </p>
      )}

      <div
        role="radiogroup"
        aria-label="Payment method"
        className="flex rounded-full bg-slate-100 p-1"
      >
        {options.map((opt, index) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              ref={(el) => {
                buttonsRef.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(opt.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "relative min-w-0 flex-1 rounded-full px-4 py-2.5 text-center",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1"
              )}
            >
              {selected && !reduceMotion && (
                <motion.span
                  layoutId="payment-mode-pill"
                  className="absolute inset-0 rounded-full bg-white shadow-[var(--shadow-apple-sm)]"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                  aria-hidden
                />
              )}
              {selected && reduceMotion && (
                <span
                  className="absolute inset-0 rounded-full bg-white shadow-[var(--shadow-apple-sm)]"
                  aria-hidden
                />
              )}
              <span className="relative block">
                <span
                  className={cn(
                    "block text-sm font-semibold transition-colors duration-200",
                    selected ? "text-slate-900" : "text-slate-600"
                  )}
                >
                  {opt.label}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-[0.6875rem] transition-colors duration-200",
                    selected ? "text-slate-600" : "text-slate-500"
                  )}
                >
                  {opt.sub}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p
        aria-live="polite"
        className="text-center text-[0.6875rem] leading-relaxed text-slate-500"
      >
        {paymentModeDetail(value, tier, interval)}
      </p>
    </div>
  );
}
