import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { EmbeddedStripeCheckout } from "@/components/EmbeddedStripeCheckout";
import { PageShell } from "@/components/PageShell";
import { formatTrialCheckoutDescription } from "@/lib/site";

export const metadata = {
  title: "Checkout — Any Exam Easy",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; reactivate?: string }>;
}) {
  const { plan, reactivate } = await searchParams;
  const isTrial = plan !== "subscribe";
  const isReactivate = reactivate === "1";

  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/checkout");

  return (
    <PageShell
      eyebrow={isReactivate ? "Reactivate" : "Checkout"}
      title={
        isReactivate
          ? isTrial
            ? "Reactivate with a free trial"
            : "Reactivate your subscription"
          : isTrial
            ? "Start your free trial"
            : "Subscribe"
      }
      description={
        isReactivate
          ? "Pick your plan and enter payment — full access restores automatically once payment is received."
          : isTrial
            ? formatTrialCheckoutDescription()
            : "Pick your billing cycle, then enter payment securely."
      }
      maxWidth="max-w-4xl"
    >
      <Suspense fallback={<p className="mt-8 text-sm text-[var(--color-ink-muted)]">Loading…</p>}>
        <EmbeddedStripeCheckout />
      </Suspense>
    </PageShell>
  );
}
