import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PageShell } from "@/components/PageShell";
import { retrieveCheckoutSession } from "@/lib/stripe";
import { isStripeConfigured } from "@/lib/payments";

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

  if (sessionId && isStripeConfigured()) {
    try {
      const checkout = await retrieveCheckoutSession(sessionId);
      if (checkout.status === "complete") {
        status = "success";
        message = "Your subscription is active. You can start studying right away.";
      } else if (checkout.status === "open") {
        status = "pending";
        message = "Checkout was not completed. You can try again below.";
      } else {
        status = "failed";
        message = "Payment could not be completed. Please try again or use a different method.";
      }
    } catch {
      status = "pending";
      message = "Payment received — refresh your dashboard in a moment.";
    }
  }

  if (status === "success") {
    redirect("/studygub?checkout=success");
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
          <Link href="/studygub" className="text-sm text-[var(--color-accent)] hover:underline">
            Back to StudyGub
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
