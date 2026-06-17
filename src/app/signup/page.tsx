import { SignupForm } from "@/components/SignupForm";
import { PageShell } from "@/components/PageShell";
import { AuthCard } from "@/components/ui/AuthCard";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { parseBillingInterval } from "@/lib/billing-plans";
import { parseSubscriptionTier } from "@/lib/subscription-tiers";
import { isExamSlug } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";
import type { SignupPlan } from "@/lib/validators/auth";

export const metadata = {
  title: "Sign Up — Any Exam Easy",
};

function parseInitialPlan(plan?: string): SignupPlan | "" {
  if (plan === "trial" || plan === "subscribe") return plan;
  return "";
}

function parseInitialExam(exam?: string): ExamSlug | "" {
  return exam && isExamSlug(exam) ? exam : "";
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{
    plan?: string;
    promo?: string;
    interval?: string;
    tier?: string;
    exam?: string;
  }>;
}) {
  const { plan, promo, interval, tier, exam } = await searchParams;
  const initialPlan = parseInitialPlan(plan);
  const initialInterval = interval ? parseBillingInterval(interval) : "yearly";
  const initialTier = parseSubscriptionTier(tier);
  const initialExam = parseInitialExam(exam);
  const isSubscribe = initialPlan === "subscribe";

  return (
    <PageShell
      eyebrow={isSubscribe ? "Get started" : "Free trial"}
      title={isSubscribe ? "Create your account." : "Start your free trial."}
      description={
        isSubscribe
          ? "Create your account, then choose your plan and pay securely. Must be 18 or older."
          : `Create your account in seconds. Choose your plan and add payment after — no charge for ${TRIAL_DAYS} days. Must be 18 or older.`
      }
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
          initialExam={initialExam}
        />
      </AuthCard>
    </PageShell>
  );
}
