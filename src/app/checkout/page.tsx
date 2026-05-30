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
      eyebrow="Secure checkout"
      title={isTrial ? "Start your trial." : "Subscribe now."}
      description={
        isTrial
          ? `${formatTrialIntroPrice()} for ${formatTrialLabel()} · then ${formatMonthlyPrice()}/month`
          : `${formatMonthlyPrice()}/month · Cancel anytime`
      }
      maxWidth="max-w-lg"
    >
      <Suspense fallback={<p className="mt-8 text-sm text-[var(--color-ink-muted)]">Loading…</p>}>
        <EmbeddedStripeCheckout />
      </Suspense>
    </PageShell>
  );
}
