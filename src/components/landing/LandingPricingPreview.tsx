"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Crown, Sparkles, X, Zap } from "lucide-react";
import type { BillingInterval } from "@/lib/billing-config";
import { BillingIntervalPicker } from "@/components/pricing/BillingIntervalPicker";
import { LandingCta } from "@/components/landing/LandingCta";
import {
  formatPlanUsd,
  getBillingPlanTier,
  BILLING_TRIAL_DISCLOSURE,
} from "@/lib/billing-plans";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { DRUGS_DECK_MARKETING_TITLE } from "@/lib/marketing/bank-stats";
import {
  PRO_ONLY_FEATURES,
  TIER_DEFINITIONS,
  UNIVERSAL_FEATURES,
  type SubscriptionTier,
} from "@/lib/subscription-tiers";
import { formatMonthlyPrice, formatTrialCtaLabel } from "@/lib/site";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const INTERVALS: BillingInterval[] = ["monthly", "quarterly", "semiannual", "yearly"];

function PreviewTierCard({
  tier,
  interval,
  highlighted,
}: {
  tier: SubscriptionTier;
  interval: BillingInterval;
  highlighted: boolean;
}) {
  const def = TIER_DEFINITIONS[tier];
  const plan = getBillingPlanTier(tier, interval);
  const params = new URLSearchParams({ plan: "trial", interval, tier });
  const href = `/signup?${params.toString()}`;

  return (
    <article
      className={cn(
        "aee-landing-pricing-card",
        highlighted && "aee-landing-pricing-card--highlight"
      )}
    >
      {highlighted && (
        <span className="aee-landing-pricing-card__badge">
          {interval === "yearly" ? (
            <>
              <Crown className="h-3.5 w-3.5" aria-hidden />
              Most Popular
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Recommended
            </>
          )}
        </span>
      )}

      <div className="aee-landing-pricing-card__head">
        <h3 className="aee-landing-pricing-card__name">{def.name}</h3>
        <p className="aee-landing-pricing-card__tagline">{def.tagline}</p>
        <p className="aee-landing-pricing-card__price">
          <span>{formatPlanUsd(plan.totalUsd)}</span>
          <span className="aee-landing-pricing-card__period">
            {interval === "monthly" ? "/mo" : `/${plan.shortLabel}`}
          </span>
        </p>
        {plan.savingsBadge ? (
          <p className="aee-landing-pricing-card__savings">{plan.savingsBadge}</p>
        ) : null}
        {interval !== "monthly" ? (
          <p className="aee-landing-pricing-card__equiv">
            ≈ {formatPlanUsd(plan.monthlyEquivalentUsd)}/mo
          </p>
        ) : null}
      </div>

      <LandingCta
        href={href}
        className={cn(
          "aee-flagship-cta--hero group w-full",
          highlighted ? "aee-flagship-cta--xl" : ""
        )}
        icon={
          <ArrowRight
            className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        }
      >
        {formatTrialCtaLabel()}
      </LandingCta>

      <ul className="aee-landing-pricing-card__features">
        {UNIVERSAL_FEATURES.map((item) => (
          <li key={item}>
            <Check className="h-4 w-4 shrink-0 text-[var(--flagship-teal)]" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
        {tier === "pro"
          ? PRO_ONLY_FEATURES.slice(0, 5).map((item) => (
              <li key={item} className="aee-landing-pricing-card__feature--pro">
                <Check className="h-4 w-4 shrink-0 text-[var(--flagship-teal)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))
          : PRO_ONLY_FEATURES.slice(0, 4).map((item) => (
              <li key={item} className="aee-landing-pricing-card__feature--muted">
                <X className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
      </ul>
    </article>
  );
}

export function LandingPricingPreview() {
  const [interval, setInterval] = useState<BillingInterval>("yearly");

  return (
    <div className="aee-landing-pricing">
      <p className="aee-landing-pricing__value-line">
        6 exams + powerful tools for less than one UWorld subscription
      </p>

      {/* Day-one trial features strip */}
      <div className="mb-6 mt-2 rounded-2xl border border-[color-mix(in_srgb,var(--color-accent)_25%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_7%,var(--color-surface-elevated))] px-5 py-4">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
          <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Unlocked from day one of your free trial
        </p>
        <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-4">
          {[
            "All 6 exam question banks",
            "Blueprint Roadmaps",
            `${DRUGS_DECK_MARKETING_TITLE} + FDA reference`,
            "Memory Cards & calculators",
          ].map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-xs text-[var(--color-ink)]">
              <Check className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="aee-landing-pricing__interval">
        <BillingIntervalPicker value={interval} onChange={setInterval} variant="pricing" tier="pro" />
      </div>

      <div className="aee-landing-pricing__grid">
        <PreviewTierCard tier="basic" interval={interval} highlighted={false} />
        <PreviewTierCard tier="pro" interval={interval} highlighted />
      </div>

      <div className="aee-landing-pricing__table-wrap">
        <table className="aee-landing-pricing__table">
          <thead>
            <tr>
              <th scope="col">Billing</th>
              <th scope="col">Basic</th>
              <th scope="col">Pro</th>
            </tr>
          </thead>
          <tbody>
            {INTERVALS.map((dur) => {
              const basic = getBillingPlanTier("basic", dur);
              const pro = getBillingPlanTier("pro", dur);
              return (
                <tr key={dur} className={dur === interval ? "is-active" : undefined}>
                  <td>
                    {basic.label}
                    {basic.savingsBadge ? (
                      <span className="aee-landing-pricing__save">{basic.savingsBadge}</span>
                    ) : null}
                  </td>
                  <td>{formatPlanUsd(basic.totalUsd)}</td>
                  <td>{formatPlanUsd(pro.totalUsd)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="aee-landing-pricing__anchor">
        Monthly anchors: Basic {formatMonthlyPrice("basic")}/mo · Pro {formatMonthlyPrice("pro")}/mo
      </p>

      <LandingCta
        href={LANDING_TRIAL_HREF}
        className="aee-flagship-cta--hero aee-flagship-cta--xl group mx-auto mt-6 w-full max-w-md"
        icon={
          <ArrowRight
            className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        }
      >
        {formatTrialCtaLabel()}
      </LandingCta>

      <p className="aee-landing-pricing__disclosure">{BILLING_TRIAL_DISCLOSURE}</p>

      <Link href={ROUTES.pricing} className="aee-landing-pricing__full-link">
        View full pricing &amp; plan details →
      </Link>
    </div>
  );
}
