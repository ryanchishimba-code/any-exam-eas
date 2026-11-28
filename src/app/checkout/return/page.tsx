import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ConfirmedPurchaseRedirect } from "@/components/analytics/ConfirmedPurchaseRedirect";
import { PageShell } from "@/components/PageShell";
import { purchaseFromCheckoutSession } from "@/lib/analytics/google-ads";
import { ROUTES } from "@/lib/routes";
import { retrieveCheckoutSession } from "@/lib/stripe";
import { isStripeConfigured } from "@/lib/payments";
import { TRIAL_DAYS } from "@/lib/billing-config";

export const metadata = {
  title: { absolute: "Payment complete — AnyExamEasy" },
};

export default async function CheckoutReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { session_id: sessionId } = await searchParams;

  let status: "success" | "pending" | "failed" = "pending";
  let message = "We are confirming your payment.";
  let isTrialCheckout = false;
  let purchase: ReturnType<typeof purchaseFromCheckoutSession> = null;

  if (sessionId && isStripeConfigured()) {
    try {
      const checkout = await retrieveCheckoutSession(sessionId);
      const ownerId = checkout.metadata?.userId ?? "";
      isTrialCheckout = checkout.metadata?.plan === "trial";
      if (ownerId && ownerId !== session.user.id) {
        status = "failed";
        message = "Payment could not be confirmed for this account.";
      } else if (checkout.status === "complete" && checkout.payment_status === "paid") {
        status = "success";
        purchase = purchaseFromCheckoutSession(
          {
            id: checkout.id,
            status: checkout.status,
            payment_status: checkout.payment_status,
            amount_total: checkout.amount_total,
            currency: checkout.currency,
            metadata: checkout.metadata,
            subscription: checkout.subscription,
          },
          session.user.id
        );
        message = isTrialCheckout
          ? `Your ${TRIAL_DAYS}-day free trial is active. You were not charged today — cancel anytime before the trial ends and you will not be billed.`
          : "Your subscription is active. You can start studying right away.";
      } else if (checkout.status === "complete") {
        status = "pending";
        message = "Payment received — refresh your Study Hub in a moment.";
      } else if (checkout.status === "open") {
        status = "pending";
        message = "Checkout was not completed. You can try again below.";
      } else {
        status = "failed";
        message = "Payment could not be completed. Please try again or use a different method.";
      }
    } catch {
      status = "pending";
      message = "Payment received — refresh your Study Hub in a moment.";
    }
  }

  const welcome = isTrialCheckout ? "&welcome=trial" : "";
  const nextHref = `${ROUTES.dashboard}?checkout=success${welcome}`;
  if (status === "success" && !purchase) {
    redirect(nextHref);
  }

  return (
    <PageShell title="Checkout status" align="center" maxWidth="max-w-md">
      {status === "success" && purchase ? (
        <ConfirmedPurchaseRedirect
          purchase={purchase}
          email={session.user.email ?? null}
          nextHref={nextHref}
        />
      ) : null}
      <div className="apple-card mt-10 p-8 text-center">
        <p className="text-sm text-[var(--color-ink-muted)]">{message}</p>
        {status === "success" ? (
          <div className="mt-6">
            <Link href={nextHref} className="text-sm text-[var(--color-accent)] hover:underline">
              Continue to Study Hub
            </Link>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/checkout"
              className="inline-flex justify-center rounded-full bg-[var(--color-accent)] px-7 py-3 text-sm font-medium text-white"
            >
              Try checkout again
            </Link>
            <Link href={ROUTES.dashboard} className="text-sm text-[var(--color-accent)] hover:underline">
              Back to Study Hub
            </Link>
          </div>
        )}
      </div>
    </PageShell>
  );
}
