import { BadgeCheck, CreditCard } from "lucide-react";
import {
  NO_PAYMENT_TRIAL_BADGE,
  NO_PAYMENT_TRIAL_HEADLINE,
  NO_PAYMENT_TRIAL_SUBLINE,
  formatTrialLabel,
} from "@/lib/site";
import { cn } from "@/lib/utils";

type Variant = "prominent" | "badge" | "compact" | "ribbon";

type Props = {
  variant?: Variant;
  className?: string;
  /** Override subline on prominent variant. */
  subline?: string;
};

/**
 * High-visibility callout that the free trial does not require a payment method.
 * Use `prominent` on signup/pricing, `badge` near hero CTAs, `ribbon` on pricing cards.
 */
export function NoPaymentTrialCallout({
  variant = "prominent",
  className,
  subline = NO_PAYMENT_TRIAL_SUBLINE,
}: Props) {
  if (variant === "badge") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-500/15 px-3.5 py-1.5 shadow-[0_0_0_1px_rgba(16,185,129,0.08),0_4px_14px_-4px_rgba(16,185,129,0.35)]",
          className
        )}
        role="status"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
          <BadgeCheck className="h-3 w-3" strokeWidth={2.5} aria-hidden />
        </span>
        <span className="text-xs font-bold tracking-wide text-emerald-950 sm:text-[13px]">
          {NO_PAYMENT_TRIAL_HEADLINE}
        </span>
        <span className="hidden text-[11px] font-semibold text-emerald-800/90 sm:inline">
          · {NO_PAYMENT_TRIAL_BADGE}
        </span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <p
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-900",
          className
        )}
        role="status"
      >
        <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
        {NO_PAYMENT_TRIAL_HEADLINE} — {formatTrialLabel()}
      </p>
    );
  }

  if (variant === "ribbon") {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-1.5 bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white",
          className
        )}
        role="status"
      >
        <CreditCard className="h-3.5 w-3.5 opacity-90" aria-hidden />
        {NO_PAYMENT_TRIAL_HEADLINE}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 border-emerald-400/45 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/80 p-4 shadow-[0_8px_24px_-12px_rgba(16,185,129,0.45)] sm:p-5",
        className
      )}
      role="status"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-400/15 blur-2xl"
        aria-hidden
      />
      <div className="relative flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/25">
          <BadgeCheck className="h-6 w-6" strokeWidth={2.25} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold tracking-tight text-emerald-950 sm:text-lg">
            {NO_PAYMENT_TRIAL_HEADLINE}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-emerald-900/85 sm:text-sm">{subline}</p>
        </div>
      </div>
    </div>
  );
}
