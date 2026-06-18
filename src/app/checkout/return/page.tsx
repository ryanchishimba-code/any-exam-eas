import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PageShell } from "@/components/PageShell";
import { ROUTES } from "@/lib/routes";
import { retrieveCheckoutSession } from "@/lib/stripe";
import { isStripeConfigured } from "@/lib/payments";
import { TRIAL_DAYS } from "@/lib/billing-config";

export const metadata = {
  title: "Payment complete — Any Exam Easy",
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

  if (sessionId && isStripeConfigured()) {
    try {
      const checkout = await retrieveCheckoutSession(sessionId);
      isTrialCheckout = checkout.metadata?.plan === "trial";
      if (checkout.status === "complete") {
        status = "success";
        message = isTrialCheckout
          ? `Your ${TRIAL_DAYS}-day free trial is active. You were not charged today — cancel anytime before the trial ends and you will not be billed.`
          : "Your subscription is active. You can start studying right away.";
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

  if (status === "success") {
    const welcome = isTrialCheckout ? "&welcome=trial" : "";
    redirect(`${ROUTES.dashboard}?checkout=success${welcome}`);
  }

  return (
    <PageShell title="Checkout status" align="center" maxWidth="max-w-md">
      <div className="apple-card mt-10 p-8 text-center">
        <p className="text-sm text-[var(--color-ink-muted)]">{message}</p>
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
      </div>
    </PageShell>
  );
}
