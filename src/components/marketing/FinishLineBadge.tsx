import type { BillingInterval } from "@/lib/billing-config";
import {
  FinishLineOfferMarkup,
  type FinishLineOfferVariant,
} from "@/components/marketing/finish-line/FinishLineOfferMarkup";
import {
  isFinishLineEligibleInterval,
  isFinishLineOfferEnabled,
} from "@/lib/marketing/finish-line-offer";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: FinishLineOfferVariant;
};

/** Server-rendered Finish Line Refund badge (hidden when the feature flag is off). */
export function FinishLineBadge({ className, variant = "hero" }: Props) {
  if (!isFinishLineOfferEnabled()) return null;
  return <FinishLineOfferMarkup variant={variant} className={cn("mt-3", className)} />;
}

type PlanProps = Props & {
  interval: BillingInterval;
};

/** Pricing/checkout: full badge on 4-month+ plans, short line on shorter plans. */
export function FinishLinePlanOffer({ interval, className, variant = "pricing" }: PlanProps) {
  if (!isFinishLineOfferEnabled()) return null;
  const ineligible = !isFinishLineEligibleInterval(interval);
  return (
    <FinishLineOfferMarkup
      variant={variant}
      className={cn("mt-3", className)}
      ineligiblePlan={ineligible}
    />
  );
}
