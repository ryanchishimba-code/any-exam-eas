import { formatMonthlyPrice } from "@/lib/site";
import type { SubscriptionTier } from "@/lib/subscription-tiers";
import { cn } from "@/lib/utils";

type HighlightedPriceProps = {
  tier?: SubscriptionTier;
  period?: "/month" | "/mo" | null;
  size?: "hero" | "hero-lg" | "md" | "sm";
  className?: string;
};

/** Teal-accent price pill — draws the eye to the Pro monthly anchor. */
export function HighlightedPrice({
  tier = "pro",
  period = "/month",
  size = "md",
  className,
}: HighlightedPriceProps) {
  return (
    <span className={cn("aee-price-highlight", `aee-price-highlight--${size}`, className)}>
      <span className="aee-price-highlight__amount">{formatMonthlyPrice(tier)}</span>
      {period ? <span className="aee-price-highlight__period">{period}</span> : null}
    </span>
  );
}
