import Link from "next/link";
import { Suspense } from "react";
import { PricingTiers } from "@/components/pricing/PricingTiers";
import { PricingQueryNotices } from "@/components/pricing/PricingQueryNotices";
import { PageShell } from "@/components/PageShell";
import { buildPricingMetadata, buildPricingJsonLd } from "@/lib/seo/marketing-metadata";
import { JsonLdScript } from "@/components/seo/JsonLdScript";

export const metadata = buildPricingMetadata();
export const revalidate = 3600;

export default async function PricingPage() {
  return (
    <>
      <JsonLdScript data={buildPricingJsonLd()} />
      <PageShell
        title="Pro"
        description="All 6 boards. One plan."
        align="center"
        maxWidth="max-w-lg"
        compact
      >
        <Suspense fallback={null}>
          <PricingQueryNotices />
        </Suspense>

        <div className="mt-8">
          <Suspense fallback={null}>
            <PricingTiers />
          </Suspense>
        </div>

        <p className="mx-auto mt-10 text-center text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
          Study tool only — not a guarantee of exam results.{" "}
          <Link href="/legal/terms" className="text-[var(--color-accent)] underline">
            Terms
          </Link>
        </p>
      </PageShell>
    </>
  );
}
