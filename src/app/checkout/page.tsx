import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { EmbeddedStripeCheckout } from "@/components/EmbeddedStripeCheckout";
import { PageShell } from "@/components/PageShell";
import { formatMonthlyPrice } from "@/lib/site";

export const metadata = {
  title: "Checkout — Any Exam Easy",
};

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/checkout");

  return (
    <PageShell
      eyebrow="Secure checkout"
      title="Complete your subscription."
      description={`${formatMonthlyPrice()}/month · Cancel anytime from your dashboard`}
      maxWidth="max-w-lg"
    >
      <EmbeddedStripeCheckout />
    </PageShell>
  );
}
