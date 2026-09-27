import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingFaqV2 } from "@/components/landing/v2/LandingFaqV2";
import { ClinicalReviewers } from "@/components/marketing/ClinicalReviewers";
import { FounderNote } from "@/components/marketing/elevation/FounderNote";
import { HeroNgnFrame } from "@/components/marketing/elevation/HeroNgnFrame";
import {
  FinalMarketingCta,
  PathSection,
  PriceSection,
} from "@/components/marketing/elevation/MarketingSections";
import {
  HOME_HERO_BOARDS_EYEBROW,
  HOME_HERO_SHORT_SUBLINE,
  LANDING_HERO_HEADLINE,
  LANDING_TRIAL_HREF,
} from "@/lib/landing/content";
import type { HeroNgnFrame as HeroNgnFrameData } from "@/lib/marketing/hero-ngn-frame";
import { ROUTES } from "@/lib/routes";
import { formatPricingCheckoutTrialOffer } from "@/lib/site";

export function PublicHome({
  heroFrame,
  children,
}: {
  heroFrame: HeroNgnFrameData | null;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-ink)]">
      <section className="px-5 pb-6 pt-[var(--page-top)] sm:px-6 sm:pb-8" aria-labelledby="hero-heading">
        <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8">
          <div data-hero-stack>
            <p className="text-[11px] font-bold uppercase leading-snug tracking-[0.12em] text-[var(--color-accent)] sm:text-xs">
              {HOME_HERO_BOARDS_EYEBROW}
            </p>
            <h1
              id="hero-heading"
              className="mt-2 text-[clamp(1.75rem,4.2vw,2.65rem)] font-bold leading-[1.08] tracking-tight"
            >
              {LANDING_HERO_HEADLINE}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-snug text-[var(--color-ink-muted)] sm:text-base">
              {HOME_HERO_SHORT_SUBLINE}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <LandingCta
                href={LANDING_TRIAL_HREF}
                ctaName="hero_trial"
                location="hero"
                icon={<ArrowRight className="h-4 w-4" aria-hidden />}
              >
                Start your free trial
              </LandingCta>
              <Link
                href="#try-questions"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-accent)] hover:underline sm:text-base"
              >
                Try free sample questions
              </Link>
            </div>
            <p className="mt-2 text-sm font-medium leading-snug text-[var(--color-ink)]" data-offer-line>
              {formatPricingCheckoutTrialOffer()}
            </p>
          </div>
          {heroFrame ? (
            <HeroNgnFrame frame={heroFrame} className="lg:max-h-[30rem] lg:overflow-y-auto" />
          ) : null}
        </div>
      </section>

      {children}

      <PathSection compact />

      <section className="px-5 py-12 sm:px-6" aria-labelledby="clinical-reviewers">
        <div className="mx-auto max-w-5xl">
          <ClinicalReviewers />
          <p className="mt-3">
            <Link
              href={ROUTES.howQuestionsAreReviewed}
              className="font-semibold text-[var(--color-accent)] hover:underline"
            >
              How our questions are built and reviewed
            </Link>
          </p>
        </div>
      </section>

      <PriceSection showNclexComparison />
      <LandingFaqV2 scope="home" />
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6">
        <FounderNote />
      </div>
      <FinalMarketingCta compact />
    </div>
  );
}
