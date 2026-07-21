"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Crown, Sparkles, Zap } from "lucide-react";
import type { BillingInterval } from "@/lib/billing-config";
import { BillingIntervalPicker } from "@/components/pricing/BillingIntervalPicker";
import { LandingCta } from "@/components/landing/LandingCta";
import {
  formatPlanUsd,
  getBillingPlanTier,
  BILLING_TRIAL_DISCLOSURE,
} from "@/lib/billing-plans";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import {
  PRO_FEATURES,
  PRICING_VALUE_HEADLINE,
  TIER_DEFINITIONS,
  TRIAL_STUDY_LIMITS,
} from "@/lib/subscription-tiers";
import { formatMonthlyPrice, formatTrialCtaLabel } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

const INTERVALS: BillingInterval[] = ["monthly", "quarterly", "semiannual", "yearly"];

function PreviewProCard({ interval }: { interval: BillingInterval }) {
  const def = TIER_DEFINITIONS.pro;
  const plan = getBillingPlanTier("pro", interval);
  const params = new URLSearchParams({ plan: "trial", interval, tier: "pro" });
  const href = `/signup?${params.toString()}`;

  return (
    <article className="aee-landing-pricing-card aee-landing-pricing-card--highlight">
      <span className="aee-landing-pricing-card__badge">
        {interval === "yearly" ? (
          <>
            <Crown className="h-3.5 w-3.5" aria-hidden />
            Best value
          </>
        ) : (
          <>
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Pro
          </>
        )}
      </span>

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

      <LandingCta href={href} className="aee-flagship-cta--hero aee-flagship-cta--xl group w-full">
        {formatTrialCtaLabel()}
      </LandingCta>

      <ul className="aee-landing-pricing-card__features">
        {PRO_FEATURES.slice(0, 8).map((item) => (
          <li key={item}>
            <Check className="h-4 w-4 shrink-0 text-[var(--flagship-teal)]" aria-hidden />
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
      <p className="aee-landing-pricing__value-line">{PRICING_VALUE_HEADLINE}</p>

      {/* Day-one trial features strip */}
      <div className="mb-6 mt-2 rounded-2xl border border-[color-mix(in_srgb,var(--color-accent)_25%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_7%,var(--color-surface-elevated))] px-5 py-4">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
          <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Unlocked from day one of your free trial
        </p>
        <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {TRIAL_STUDY_LIMITS.map((item) => (
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

      <div className="aee-landing-pricing__grid aee-landing-pricing__grid--single">
        <PreviewProCard interval={interval} />
      </div>

      <div className="aee-landing-pricing__table-wrap">
        <table className="aee-landing-pricing__table">
          <thead>
            <tr>
              <th scope="col">Billing</th>
              <th scope="col">Pro</th>
            </tr>
          </thead>
          <tbody>
            {INTERVALS.map((dur) => {
              const pro = getBillingPlanTier("pro", dur);
              return (
                <tr key={dur} className={dur === interval ? "is-active" : undefined}>
                  <td>
                    {pro.label}
                    {pro.savingsBadge ? (
                      <span className="aee-landing-pricing__save">{pro.savingsBadge}</span>
                    ) : null}
                  </td>
                  <td>{formatPlanUsd(pro.totalUsd)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="aee-landing-pricing__anchor">
        Pro at {formatMonthlyPrice("pro")}/mo for NCLEX, USMLE, NAPLEX, PANCE, FNP &amp; NPTE —
        typically less than stacking per-exam QBanks · {BILLING_TRIAL_DISCLOSURE}
      </p>

      <LandingCta href={LANDING_TRIAL_HREF} className="aee-flagship-cta--hero aee-flagship-cta--xl group mx-auto mt-6 w-full max-w-md">
        {formatTrialCtaLabel()}
      </LandingCta>

      <Link href={ROUTES.pricing} prefetch={false} className="aee-landing-pricing__full-link">
        View full pricing &amp; plan details →
      </Link>
    </div>
  );
}
