import {
  FinishLineOfferMarkup,
  type FinishLineOfferVariant,
} from "@/components/marketing/finish-line/FinishLineOfferMarkup";
import { isFinishLineOfferEnabled } from "@/lib/marketing/finish-line-offer";
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

