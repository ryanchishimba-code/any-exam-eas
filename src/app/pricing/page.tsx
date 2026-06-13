import { Suspense } from "react";
import { LEGAL_DISCLAIMERS } from "@/lib/legal";
import {
  formatPricingHeadline,
  formatTrialTodayPrice,
  TRIAL_PAYMENT_DISCLOSURE,
} from "@/lib/site";
import { MONTHLY_PRICE_USD, TRIAL_DAYS } from "@/lib/billing-config";
import { PricingActions } from "@/components/PricingActions";
import { PaymentMethodsList } from "@/components/PaymentMethodsList";
import { PageShell } from "@/components/PageShell";
import { PaywallNotice } from "@/components/PaywallNotice";
import { LandingTrialTrust } from "@/components/home/LandingTrialTrust";
import { LANDING_PRICING_FEATURES } from "@/lib/landing/content";

export const metadata = {
  title: "Pricing — Any Exam Easy",
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ paywall?: string; return?: string }>;
}) {
  const { paywall } = await searchParams;

  return (
    <PageShell
      eyebrow="Pricing"
      title="Straightforward pricing for your prep."
      description={formatPricingHeadline()}
      align="center"
      maxWidth="max-w-lg"
    >
      {paywall && <PaywallNotice reason={paywall} />}

      <div className="apple-bento mt-8 p-10 shadow-[var(--shadow-apple-sm)]">
        <p className="text-sm font-medium text-[var(--color-accent)]">Pro · anyexameasy.com</p>
        <p className="mt-3 text-5xl font-semibold tracking-tight">
          {formatTrialTodayPrice()}
          <span className="text-lg font-normal text-[var(--color-ink-muted)]">
            {" "}
            / {TRIAL_DAYS}-day trial
          </span>
        </p>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Then ${MONTHLY_PRICE_USD.toFixed(2)}/month after your {TRIAL_DAYS}-day trial ·{" "}
          {TRIAL_PAYMENT_DISCLOSURE}
        </p>

        <ul className="mt-8 space-y-3.5 text-left text-[0.9375rem]">
          {LANDING_PRICING_FEATURES.map((item) => (
            <li key={item} className="flex gap-3 text-[var(--color-ink-muted)]">
              <span className="font-medium text-[var(--color-accent)]">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <PaymentMethodsList />

        <LandingTrialTrust className="mt-6" />

        <div className="mt-9">
          <Suspense fallback={null}>
            <PricingActions />
          </Suspense>
        </div>
      </div>

      <p className="mt-8 text-left text-xs leading-relaxed text-[var(--color-ink-muted)]">
        {LEGAL_DISCLAIMERS.noGuarantee} {LEGAL_DISCLAIMERS.aiGenerated}{" "}
        {LEGAL_DISCLAIMERS.subscription} {LEGAL_DISCLAIMERS.limitationOfLiability}
      </p>
    </PageShell>
  );
}
