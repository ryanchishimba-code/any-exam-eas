import { Check } from "lucide-react";
import {
  LANDING_HERO_PRICE_INCLUDES,
  LANDING_HERO_PRICE_TAGLINE,
} from "@/lib/landing/content";
import { formatMonthlyPrice, formatTrialLabel } from "@/lib/site";
import { BILLING_TRIAL_DISCLOSURE } from "@/lib/billing-plans";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

type LandingHeroPriceValueProps = {
  className?: string;
  bankCounts?: LandingBankCountsDisplay;
};

export function LandingHeroPriceValue({
  className = "",
  bankCounts,
}: LandingHeroPriceValueProps) {
  // First bullet is the question-count claim — drive it from the live bank, not the static floor.
  const includes = bankCounts
    ? [`${bankCounts.totalLabel} board-style questions`, ...LANDING_HERO_PRICE_INCLUDES.slice(1)]
    : LANDING_HERO_PRICE_INCLUDES;
  return (
    <div
      className={`aee-hero-price-value ${className}`.trim()}
      aria-label={`Basic from ${formatMonthlyPrice("basic")} per month includes full platform access`}
    >
      <p className="aee-hero-price-value__only">Basic from</p>
      <p className="aee-hero-price-value__amount">
        <span className="aee-hero-price-value__figure">{formatMonthlyPrice("basic")}</span>
        <span className="aee-hero-price-value__period">/mo</span>
      </p>
      <p className="mt-1 text-xs font-medium text-[var(--color-accent)]">
        Pro from {formatMonthlyPrice("pro")}/mo · {formatTrialLabel()}
      </p>

      <ul className="aee-hero-price-value__includes">
        {includes.map((item) => (
          <li key={item} className="aee-hero-price-value__include">
            <Check className="h-4 w-4 shrink-0 text-[var(--flagship-teal)]" strokeWidth={2.5} aria-hidden />
            {item}
          </li>
        ))}
      </ul>

      <p className="aee-hero-price-value__tagline">
        <span className="aee-flagship-gradient-text">{LANDING_HERO_PRICE_TAGLINE}</span>
      </p>
      <p className="mt-2 text-[0.6875rem] text-[var(--color-ink-muted)]">{BILLING_TRIAL_DISCLOSURE}</p>
    </div>
  );
}
