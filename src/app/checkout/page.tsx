import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { EmbeddedStripeCheckout } from "@/components/EmbeddedStripeCheckout";
import { PageShell } from "@/components/PageShell";
import {
  paidSubscribeHrefFromCheckoutQuery,
  resolveCheckoutEntry,
  signupHrefFromCheckoutQuery,
} from "@/lib/billing/card-free-checkout";
import { startCardFreeTrialForUser } from "@/lib/billing/start-app-trial";
import { parseBillingInterval } from "@/lib/billing-plans";
import { PurchaseTrustNotes } from "@/components/marketing/PurchaseTrustNotes";
import { hasConsumedTrial } from "@/lib/trial-eligibility";
import { getSubscriptionAccess } from "@/lib/subscription-access";
import { ROUTES } from "@/lib/routes";

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
  const query: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(params)) {
    const v = firstSearchValue(value);
    if (v) query[key] = v;
  }

  const session = await auth();
  // Anything other than plan=subscribe is the card-free trial, never Stripe.
  if (plan !== "subscribe") {
    const decision = resolveCheckoutEntry({
      plan,
      loggedIn: Boolean(session?.user?.id && session.user.email),
      trialAvailable: session?.user?.email
        ? !(await hasConsumedTrial(session.user.email))
        : false,
      accessStatus: session?.user?.id
        ? (await getSubscriptionAccess(session.user.id)).status
        : null,
      query,
    });

    if (decision.kind === "signup") redirect(decision.href);
    if (decision.kind === "paid-subscribe") redirect(decision.href);
    if (decision.kind === "update-payment") redirect(decision.href);
    if (decision.kind === "dashboard") redirect(ROUTES.dashboard);
    if (decision.kind === "start-app-trial" && session?.user?.id && session.user.email) {
      const started = await startCardFreeTrialForUser({
        userId: session.user.id,
        email: session.user.email,
        tier: firstSearchValue(params.tier),
        interval,
      });
      redirect(started.started ? ROUTES.dashboard : paidSubscribeHrefFromCheckoutQuery(query));
    }
    redirect(signupHrefFromCheckoutQuery(query));
  }

  if (!session?.user) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) qs.set(key, value);
    }
    const callback = qs.size > 0 ? `/checkout?${qs.toString()}` : "/checkout";
    redirect(`/login?callbackUrl=${encodeURIComponent(callback)}`);
  }

  const isReactivate = reactivate === "1";

  return (
    <PageShell
      // "Upgrade" above "Upgrade to Pro" said the word twice.
      eyebrow={isReactivate ? "Reactivate" : undefined}
      title={isReactivate ? "Reactivate your subscription" : "Upgrade to Pro"}
      description={
        isReactivate ? "Full access restores as soon as payment is received." : undefined
      }
      maxWidth="max-w-2xl"
      compact
    >
      <PurchaseTrustNotes className="mt-4" showTrialOffer={false} />
      <Suspense fallback={<p className="mt-8 text-sm text-[var(--color-ink-muted)]">Loading…</p>}>
        <EmbeddedStripeCheckout />
      </Suspense>
    </PageShell>
  );
}
