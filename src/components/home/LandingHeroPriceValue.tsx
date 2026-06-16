import { Check } from "lucide-react";
import {
  LANDING_HERO_PRICE_INCLUDES,
  LANDING_HERO_PRICE_TAGLINE,
} from "@/lib/landing/content";
import { formatMonthlyPrice } from "@/lib/site";

type LandingHeroPriceValueProps = {
  className?: string;
};

export function LandingHeroPriceValue({ className = "" }: LandingHeroPriceValueProps) {
  return (
    <div
      className={`aee-hero-price-value ${className}`.trim()}
      aria-label={`Only ${formatMonthlyPrice()} per month includes full platform access`}
    >
      <p className="aee-hero-price-value__only">Only</p>
      <p className="aee-hero-price-value__amount">
        <span className="aee-hero-price-value__figure">{formatMonthlyPrice()}</span>
        <span className="aee-hero-price-value__period">/mo</span>
      </p>

      <ul className="aee-hero-price-value__includes">
        {LANDING_HERO_PRICE_INCLUDES.map((item) => (
          <li key={item} className="aee-hero-price-value__include">
            <Check className="h-4 w-4 shrink-0 text-[var(--flagship-teal)]" strokeWidth={2.5} aria-hidden />
            {item}
          </li>
        ))}
      </ul>

      <p className="aee-hero-price-value__tagline">
        <span className="aee-flagship-gradient-text">{LANDING_HERO_PRICE_TAGLINE}</span>
      </p>
    </div>
  );
}
