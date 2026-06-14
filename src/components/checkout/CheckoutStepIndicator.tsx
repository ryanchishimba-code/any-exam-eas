"use client";

import { cn } from "@/lib/utils";

type CheckoutStepIndicatorProps = {
  step: "review" | "payment";
};

const STEPS = [
  { id: "review" as const, label: "Review" },
  { id: "payment" as const, label: "Pay" },
];

export function CheckoutStepIndicator({ step }: CheckoutStepIndicatorProps) {
  const activeIndex = step === "review" ? 0 : 1;

  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center justify-center gap-2">
        {STEPS.map((s, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <li key={s.id} className="flex items-center gap-2">
              {i > 0 && (
                <span
                  className={cn(
                    "h-px w-8 sm:w-12",
                    done ? "bg-[var(--color-accent)]" : "bg-black/[0.08]"
                  )}
                  aria-hidden
                />
              )}
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    active
                      ? "bg-[var(--color-accent)] text-white"
                      : done
                        ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
                        : "bg-black/[0.05] text-[var(--color-ink-muted)]"
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    active ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)]"
                  )}
                >
                  {s.label}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
