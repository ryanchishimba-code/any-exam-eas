import { ArrowRight } from "lucide-react";
import { formatTrialCtaLabel } from "@/lib/site";
import {
  LANDING_HERO_EYEBROW,
  LANDING_HERO_HEADLINE,
  LANDING_TRIAL_HREF,
  formatFlagshipHeroSubline,
} from "@/lib/landing/content";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

/** Lightweight hero shell shown while the flagship landing bundle loads client-side. */
export function LandingHeroSkeleton({ bankCounts }: { bankCounts: LandingBankCountsDisplay }) {
  return (
    <section
      className="aee-hero-beat relative w-full overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="aee-hero-beat__atmosphere" aria-hidden />
      <div className="aee-hero-beat__vignette" aria-hidden />
      <div className="aee-hero-beat__shell">
        <div className="aee-hero-beat__copy">
          <p className="aee-hero-beat__brand">{LANDING_HERO_EYEBROW}</p>
          <h1 id="hero-heading" className="aee-hero-beat__headline">
            {LANDING_HERO_HEADLINE}
          </h1>
          <p className="aee-hero-beat__subline">
            {formatFlagshipHeroSubline(bankCounts.totalLabel)}
          </p>
          <div className="aee-hero-beat__actions">
            <a
              href={LANDING_TRIAL_HREF}
              className="aee-flagship-cta aee-flagship-cta--hero aee-flagship-cta--xl aee-flagship-cta--primary group aee-hero-beat__cta inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold"
            >
              {formatTrialCtaLabel()}
              <ArrowRight className="h-5 w-5" aria-hidden />
            </a>
            <a href="#pricing" className="aee-hero-beat__secondary">
              See pricing
            </a>
          </div>
        </div>
        <div className="aee-hero-beat__visual" aria-hidden>
          <span className="aee-hero-beat__stage-glow" />
          <div className="h-[min(52vw,26rem)] w-full max-w-[720px] animate-pulse rounded-[1.5rem] bg-white/8" />
        </div>
      </div>
    </section>
  );
}
