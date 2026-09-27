import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingFaqV2 } from "@/components/landing/v2/LandingFaqV2";
import { HeroNgnFrame } from "@/components/marketing/elevation/HeroNgnFrame";
import {
  FinalMarketingCta,
  PathSection,
  PriceSection,
  ProblemSection,
  ProofIntro,
  SocialProof,
} from "@/components/marketing/elevation/MarketingSections";
import { ClinicalReviewers } from "@/components/marketing/ClinicalReviewers";
import { HOME_HERO_PRODUCT_LINE, LANDING_HERO_HEADLINE, LANDING_TRIAL_HREF } from "@/lib/landing/content";
import type { LandingSuccessStory } from "@/lib/landing/content";
import type { HeroNgnFrame as HeroNgnFrameData } from "@/lib/marketing/hero-ngn-frame";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";
import { examMarketingPath } from "@/lib/seo/exam-config";
import { formatPricingCheckoutTrialOffer } from "@/lib/site";

const BOARDS = [
  ["nclex", "NCLEX"],
  ["usmle", "USMLE"],
  ["naplex", "NAPLEX"],
  ["pance", "PANCE"],
  ["aanp-fnp", "AANP FNP"],
  ["npte-pt", "NPTE-PT"],
] as const;

export function PublicHome({
  bankCounts,
  testimonials,
  heroFrame,
  children,
}: {
  bankCounts: LandingBankCountsDisplay;
  testimonials?: LandingSuccessStory[];
  heroFrame: HeroNgnFrameData | null;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-ink)]">
      <section className="px-5 pb-16 pt-[var(--page-top)] sm:px-6 sm:pb-24" aria-labelledby="hero-heading">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              Any Exam Easy
            </p>
            <h1
              id="hero-heading"
              className="mt-5 text-[clamp(2.75rem,7vw,4.75rem)] font-bold leading-[1.02] tracking-tight"
            >
              {LANDING_HERO_HEADLINE}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-ink-muted)]">
              {HOME_HERO_PRODUCT_LINE}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
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
                className="inline-flex min-h-11 items-center text-base font-semibold text-[var(--color-accent)] hover:underline"
              >
                Try free sample questions
              </Link>
            </div>
            <p className="mt-4 text-sm font-medium text-[var(--color-ink)]" data-offer-line>
              {formatPricingCheckoutTrialOffer()}
            </p>
            {bankCounts.totalLabel ? (
              <p className="mt-3 text-sm text-[var(--color-ink-muted)]">{bankCounts.totalQuestionsLabel}</p>
            ) : null}
          </div>
          {heroFrame ? <HeroNgnFrame frame={heroFrame} /> : null}
        </div>
      </section>

      <nav className="border-y border-[var(--color-border)] px-5 py-4 sm:px-6" aria-label="Boards">
        <ul className="mx-auto flex max-w-6xl flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {BOARDS.map(([key, label]) => (
            <li key={key}>
              <Link href={examMarketingPath(key)} className="hover:text-[var(--color-accent)]">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <ProblemSection />
      <PathSection />
      <ProofIntro>
        <div className="mt-12">
          <ClinicalReviewers />
        </div>
      </ProofIntro>
      {children}
      <SocialProof testimonials={testimonials} />
      <PriceSection />
      <LandingFaqV2 />
      <FinalMarketingCta />
    </div>
  );
}
