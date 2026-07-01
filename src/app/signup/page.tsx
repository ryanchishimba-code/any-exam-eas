import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SignupForm } from "@/components/SignupForm";
import { PageShell } from "@/components/PageShell";
import { AuthCard } from "@/components/ui/AuthCard";
import { contentWidth } from "@/lib/layout/shell-ui";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
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
          : `Create your account with email or social login — no payment required. Your ${TRIAL_DAYS}-day free trial includes ${TRIAL_LIFETIME_QUESTIONS} practice questions instantly. Must be 18 or older.`
      }
      align="center"
      maxWidth={contentWidth.auth}
      variant="premium"
    >
      <div className="mb-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          Return home
        </Link>
      </div>
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
