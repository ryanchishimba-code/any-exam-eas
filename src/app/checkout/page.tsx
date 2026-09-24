import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { EmbeddedStripeCheckout } from "@/components/EmbeddedStripeCheckout";
import { PageShell } from "@/components/PageShell";
import { parseBillingInterval } from "@/lib/billing-plans";
import { formatCheckoutTrialPageDescription, TRIAL_CTA_LABEL } from "@/lib/site";

export const metadata = {
  title: "Checkout — Any Exam Easy",
};

function firstSearchValue(
  value: string | string[] | undefined
): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const plan = firstSearchValue(params.plan);
  const interval = parseBillingInterval(firstSearchValue(params.interval));
  const reactivate = firstSearchValue(params.reactivate);
  const isTrial = plan !== "subscribe";
  const isReactivate = reactivate === "1";
  const isUpgrade = !isTrial && !isReactivate;

  const session = await auth();
  if (!session?.user) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      const v = firstSearchValue(value);
      if (v != null && v !== "") qs.set(key, v);
    }
    const callback =
      qs.size > 0 ? `/checkout?${qs.toString()}` : "/checkout";
    redirect(`/login?callbackUrl=${encodeURIComponent(callback)}`);
  }

  return (
    <PageShell
      // "Upgrade" above "Upgrade to Pro" said the word twice.
      eyebrow={isReactivate ? "Reactivate" : undefined}
      title={
        isReactivate
          ? isTrial
            ? "Reactivate with a free trial"
            : "Reactivate your subscription"
          : isUpgrade
            ? "Upgrade to Pro"
            : TRIAL_CTA_LABEL
      }
      description={
        isReactivate
          ? "Full access restores as soon as payment is received."
          : isUpgrade
            ? undefined
            : formatCheckoutTrialPageDescription(interval)
      }
      maxWidth="max-w-2xl"
      compact
    >
      <Suspense fallback={<p className="mt-8 text-sm text-[var(--color-ink-muted)]">Loading…</p>}>
        <EmbeddedStripeCheckout />
      </Suspense>
    </PageShell>
  );
}
