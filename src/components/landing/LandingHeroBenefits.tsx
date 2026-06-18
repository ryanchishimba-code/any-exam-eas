import { Check } from "lucide-react";
import { LANDING_HERO_BENEFITS } from "@/lib/landing/content";

export function LandingHeroBenefits({ className = "" }: { className?: string }) {
  return (
    <ul className={`aee-hero-benefits ${className}`.trim()} aria-label="Key platform benefits">
      {LANDING_HERO_BENEFITS.map((benefit) => (
        <li key={benefit} className="aee-hero-benefits__item">
          <span className="aee-hero-benefits__icon" aria-hidden>
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  );
}
