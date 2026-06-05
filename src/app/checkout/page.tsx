import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { EmbeddedStripeCheckout } from "@/components/EmbeddedStripeCheckout";
import { PageShell } from "@/components/PageShell";
import { formatMonthlyPrice, formatTrialIntroPrice, formatTrialLabel } from "@/lib/site";

export const metadata = {
  title: "Checkout — Any Exam Easy",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  const isTrial = plan === "trial";

  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/checkout");

  return (
    <PageShell
      eyebrow="Checkout"
      title={isTrial ? "Review & start your trial" : "Review & subscribe"}
      description="Confirm your plan, apply a discount code if you have one, then enter payment."
      maxWidth="max-w-xl"
    >
      <Suspense fallback={<p className="mt-8 text-sm text-[var(--color-ink-muted)]">Loading…</p>}>
        <EmbeddedStripeCheckout />
      </Suspense>
    </PageShell>
  );
}
