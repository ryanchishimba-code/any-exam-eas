import { Suspense } from "react";
import { LEGAL_DISCLAIMERS, LEGAL_ENTITY } from "@/lib/legal";
import { formatPricingHeadline } from "@/lib/site";
import { PricingTiers } from "@/components/pricing/PricingTiers";
import { PageShell } from "@/components/PageShell";
import { PaywallNotice } from "@/components/PaywallNotice";

export const metadata = {
  title: "Pricing — Any Exam Easy",
  description:
    "7-day free trial, then from $32.99/mo. Save up to 20% on longer plans. Cancel anytime.",
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
      title="Simple pricing. Every board included."
      description={formatPricingHeadline()}
      align="center"
      maxWidth="max-w-2xl"
    >
      {paywall && <PaywallNotice reason={paywall} />}

      <div className="mt-10">
        <Suspense fallback={null}>
          <PricingTiers />
        </Suspense>
      </div>

      <p className="mt-12 text-left text-xs leading-relaxed text-[var(--color-ink-muted)]">
        {LEGAL_DISCLAIMERS.subscription} {LEGAL_DISCLAIMERS.refundsAndAccess}{" "}
        {LEGAL_DISCLAIMERS.planChanges} {LEGAL_DISCLAIMERS.noGuarantee}{" "}
        <a href="/legal/terms" className="text-[var(--color-accent)] underline">
          Full Terms of Service
        </a>
        . {LEGAL_ENTITY.productName} is a product of {LEGAL_ENTITY.companyName}.
      </p>
    </PageShell>
  );
}
