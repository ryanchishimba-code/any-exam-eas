import Link from "next/link";
import type { Metadata } from "next";
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
import { formatMonthlyPrice, MARKETING_DISCLAIMER, SITE_NAME } from "@/lib/site";

const SIGNUP_TITLE = `Sign Up — ${SITE_NAME}`;
const SIGNUP_DESCRIPTION =
  "Create your Any Exam Easy account for NCLEX, USMLE, NAPLEX, PANCE, FNP & NPTE prep. Start a free trial or subscribe to Pro.";

export const metadata: Metadata = {
  title: { absolute: SIGNUP_TITLE },
  description: SIGNUP_DESCRIPTION,
  alternates: { canonical: "/signup" },
  robots: { index: false, follow: true },
  openGraph: {
    title: SIGNUP_TITLE,
    description: SIGNUP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: SIGNUP_TITLE,
    description: SIGNUP_DESCRIPTION,
  },
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

  return (
    <PageShell
      eyebrow="Get started"
      title="Create your account."
      description={`Start a ${TRIAL_DAYS}-day free trial (no card) or subscribe to Pro from ${formatMonthlyPrice("pro")}/mo. Your trial includes ${TRIAL_LIFETIME_QUESTIONS} practice questions. Must be 18 or older.`}
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
      <p className="mx-auto mt-6 max-w-md text-center text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
        {MARKETING_DISCLAIMER}
      </p>
    </PageShell>
  );
}
