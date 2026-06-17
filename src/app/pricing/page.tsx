import Link from "next/link";
import { Suspense } from "react";
import { LEGAL_DISCLAIMERS, LEGAL_ENTITY } from "@/lib/legal";
import { formatMonthlyPrice, formatPricingHeadline, formatTrialLabel } from "@/lib/site";
import { PricingTiers } from "@/components/pricing/PricingTiers";
import { HowWeCompare } from "@/components/home/HowWeCompare";
import { PageShell } from "@/components/PageShell";
import { PaywallNotice } from "@/components/PaywallNotice";
import { ProUpgradeBanner } from "@/components/pricing/ProUpgradeBanner";
import { LANDING_HERO_TRUST_SIGNALS } from "@/lib/landing/content";

import { buildPricingMetadata } from "@/lib/seo/marketing-metadata";

export const metadata = buildPricingMetadata();

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ paywall?: string; return?: string; upgrade?: string; feature?: string }>;
}) {
  const { paywall, upgrade, feature } = await searchParams;

  return (
    <PageShell
      eyebrow="6 Major Board Exams · One Subscription"
      title="Basic or Pro — every board included."
      description={formatPricingHeadline()}
      align="center"
      maxWidth="max-w-5xl"
    >
      {paywall && <PaywallNotice reason={paywall} />}
      {upgrade === "pro" && <ProUpgradeBanner feature={feature} />}

      <ul className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-semibold text-[var(--color-ink-muted)]" aria-label="Trust signals">
        {LANDING_HERO_TRUST_SIGNALS.map((signal) => (
          <li key={signal}>{signal}</li>
        ))}
      </ul>

      <p className="mx-auto mt-4 max-w-2xl text-center text-sm font-semibold text-[var(--color-accent)]">
        6 exams + powerful tools for less than one UWorld subscription · Basic from{" "}
        {formatMonthlyPrice("basic")}/mo · Pro from {formatMonthlyPrice("pro")}/mo ·{" "}
        {formatTrialLabel()}
      </p>

      <div className="mt-12">
        <Suspense fallback={null}>
          <PricingTiers />
        </Suspense>
      </div>

      <div className="mt-16">
        <HowWeCompare />
      </div>

      <p className="mt-12 text-left text-xs leading-relaxed text-[var(--color-ink-muted)]">
        {LEGAL_DISCLAIMERS.subscription} {LEGAL_DISCLAIMERS.refundsAndAccess}{" "}
        {LEGAL_DISCLAIMERS.planChanges} {LEGAL_DISCLAIMERS.noGuarantee}{" "}
        <Link href="/legal/terms" className="text-[var(--color-accent)] underline">
          Full Terms of Service
        </Link>
        . {LEGAL_ENTITY.productName} is a product of {LEGAL_ENTITY.companyName}.
      </p>
    </PageShell>
  );
}
