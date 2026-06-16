import { Suspense } from "react";
import { LEGAL_DISCLAIMERS, LEGAL_ENTITY } from "@/lib/legal";
import { formatPricingHeadline } from "@/lib/site";
import { PricingTiers } from "@/components/pricing/PricingTiers";
import { PageShell } from "@/components/PageShell";
import { PaywallNotice } from "@/components/PaywallNotice";
import { ProUpgradeBanner } from "@/components/pricing/ProUpgradeBanner";

export const metadata = {
  title: "Pricing — Any Exam Easy",
  description:
    "14-day free trial · Basic from $34.99/mo · Pro from $49.99/mo · Save up to 20% on annual. Cancel anytime.",
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ paywall?: string; return?: string; upgrade?: string; feature?: string }>;
}) {
  const { paywall, upgrade, feature } = await searchParams;

  return (
    <PageShell
      eyebrow="Pricing"
      title="Simple pricing. Every board included."
      description={formatPricingHeadline()}
      align="center"
      maxWidth="max-w-5xl"
    >
      {paywall && <PaywallNotice reason={paywall} />}
      {upgrade === "pro" && <ProUpgradeBanner feature={feature} />}

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
