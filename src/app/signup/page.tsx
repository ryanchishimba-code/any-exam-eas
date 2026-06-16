import { SignupForm } from "@/components/SignupForm";
import { PageShell } from "@/components/PageShell";
import { AuthCard } from "@/components/ui/AuthCard";
import { formatPricingHeadline } from "@/lib/site";
import { parseBillingInterval } from "@/lib/billing-plans";
import { parseSubscriptionTier } from "@/lib/subscription-tiers";
import type { SignupPlan } from "@/lib/validators/auth";

export const metadata = {
  title: "Sign Up — Any Exam Easy",
};

function parseInitialPlan(plan?: string): SignupPlan | "" {
  if (plan === "trial" || plan === "subscribe") return plan;
  return "";
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; promo?: string; interval?: string; tier?: string }>;
}) {
  const { plan, promo, interval, tier } = await searchParams;
  const initialPlan = parseInitialPlan(plan);
  const initialInterval = interval ? parseBillingInterval(interval) : "yearly";
  const initialTier = parseSubscriptionTier(tier);

  return (
    <PageShell
      eyebrow="Get started"
      title="Create your account."
      description={`${formatPricingHeadline()} · Must be 18 or older.`}
      align="center"
      maxWidth="max-w-lg"
      variant="premium"
    >
      <AuthCard>
        <SignupForm
          initialPlan={initialPlan}
          initialPromo={promo?.trim() ?? ""}
          initialInterval={initialInterval}
          initialTier={initialTier}
        />
      </AuthCard>
    </PageShell>
  );
}
