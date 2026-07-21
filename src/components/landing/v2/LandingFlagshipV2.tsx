"use client";

/**
 * LandingFlagshipV2 — conversion-first landing (UWorld-clarity + AEE wedge).
 *
 * Flow:
 *   Full-bleed hero (brand + benefit H1 + laptop still + trial CTA, no price)
 *     → Offering
 *     → Product showcase
 *     → Choose your exam
 *     → Why choose us (vs stacking QBanks)
 *     → Cross-exam comparison
 *     → Trust + testimonials
 *     → Pricing (price + multi-exam savings)
 *     → Final CTA + sticky bar
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, LogIn } from "lucide-react";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingHashScroll } from "@/components/landing/LandingHashScroll";
import { LandingHeroV2 } from "@/components/landing/v2/LandingHeroV2";
import {
  ChooseYourExam,
  LandingClinicianTrust,
  LandingCrossExamComparison,
  LandingFaqV2,
  LandingOfferingV2,
  LandingPricingPreview,
  LandingShowcaseV2,
  LandingStickyCta,
  LandingTestimonialsV2,
  LandingTrialGuarantee,
  LandingWhyChooseV2,
  ProBenefitsComparison,
} from "@/components/landing/v2/LandingFlagshipSectionsLazy";
import {
  LANDING_TRIAL_DETAIL,
  LANDING_TRIAL_HREF,
  PLATFORM_EXAM_LIST_MIDDOT,
} from "@/lib/landing/content";
import { LEGAL_ENTITY } from "@/lib/legal";
import { ROUTES } from "@/lib/routes";
import { formatMonthlyPrice, formatTrialLabel, formatTrialCtaLabel, MARKETING_DISCLAIMER, TRIAL_PAYMENT_DISCLOSURE } from "@/lib/site";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";
import { LandingSectionPageviews } from "@/components/landing/v2/LandingSectionPageviews";

export function LandingFlagshipV2({
  bankCounts,
  testimonials,
  children,
}: {
  bankCounts: LandingBankCountsDisplay;
  testimonials?: import("@/lib/landing/content").LandingSuccessStory[];
  /** Long-form SEO guide rendered from the server page. */
  children?: ReactNode;
}) {
  return (
    <div className="aee-flagship aee-flagship--conversion">
      <LandingHashScroll />
      <LandingSectionPageviews />

      <LandingHeroV2 bankCounts={bankCounts} />

      <LandingOfferingV2 />

      <LandingShowcaseV2 />

      <ChooseYourExam bankCounts={bankCounts} />

      <LandingWhyChooseV2 bankCounts={bankCounts} />

      <LandingCrossExamComparison />

      <LandingClinicianTrust />

      <LandingTestimonialsV2 stories={testimonials} />

      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-20 sm:py-24">
        <ProBenefitsComparison />
      </section>

      <section id="pricing" className="scroll-mt-24 bg-[var(--color-bg)] py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Simple pricing
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              One plan. Every board. Start free.
            </h2>
            <p className="mt-4 text-lg text-[var(--color-ink-muted)]">
              Pro at {formatMonthlyPrice("pro")}/mo for all six boards — typically less than
              stacking per-exam QBanks. {formatTrialLabel()} · cancel anytime.
            </p>
          </div>
          <div className="mt-10">
            <LandingPricingPreview />
          </div>
        </div>
      </section>

      <LandingTrialGuarantee />

      <LandingFaqV2 />

      {children}

      <section className="aee-flagship-final-cta" aria-labelledby="final-cta-heading">
        <div className="aee-flagship-final-cta__bg" aria-hidden />
        <div className="aee-flagship-inner relative text-center">
          <h2 id="final-cta-heading" className="aee-flagship-final-cta__title">
            Premium board prep starts here
          </h2>
          <p className="aee-flagship-final-cta__subtitle">
            {formatTrialLabel()} · {LANDING_TRIAL_DETAIL} · {PLATFORM_EXAM_LIST_MIDDOT}
          </p>
          <div className="aee-flagship-final-cta__actions">
            <LandingCta
              href={LANDING_TRIAL_HREF}
              variant="primary"
              className="aee-flagship-cta--hero aee-flagship-cta--xl group aee-flagship-cta--on-dark"
              icon={
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              }
            >
              {formatTrialCtaLabel()}
            </LandingCta>
            <LoginModalTrigger
              callbackUrl={`${ROUTES.settings}?reactivate=1`}
              className="aee-flagship-cta aee-flagship-cta--ghost-dark"
            >
              <LogIn className="h-4 w-4" aria-hidden />
              Already subscribed? Log in
            </LoginModalTrigger>
          </div>
          <p className="aee-flagship-final-cta__legal mt-4">{TRIAL_PAYMENT_DISCLOSURE}</p>
          <p className="aee-flagship-final-cta__legal mt-2">{MARKETING_DISCLAIMER}</p>
          <p className="aee-flagship-final-cta__legal mt-2">
            {LEGAL_ENTITY.productName} is a product of {LEGAL_ENTITY.companyName}.{" "}
            <Link href={ROUTES.about} prefetch={false} className="aee-flagship-final-cta__legal-link">
              About
            </Link>
            {" · "}
            <Link href="/legal/terms" prefetch={false} className="aee-flagship-final-cta__legal-link">
              Terms
            </Link>
            {" · "}
            <Link href="/legal/privacy" prefetch={false} className="aee-flagship-final-cta__legal-link">
              Privacy
            </Link>
          </p>
        </div>
      </section>

      <LandingStickyCta />
    </div>
  );
}
