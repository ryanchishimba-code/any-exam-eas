import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SignupForm } from "@/components/SignupForm";
import { PageShell } from "@/components/PageShell";
import { AuthCard } from "@/components/ui/AuthCard";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { getCachedSession } from "@/lib/auth/session";
import { contentWidth } from "@/lib/layout/shell-ui";
import { TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { parseBillingInterval } from "@/lib/billing-plans";
import { parseSubscriptionTier } from "@/lib/subscription-tiers";
import { isExamSlug } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";
import type { SignupPlan } from "@/lib/validators/auth";
import { formatPricingCheckoutTrialOffer, MARKETING_DISCLAIMER, SITE_NAME } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

const SIGNUP_TITLE = `Sign Up — ${SITE_NAME}`;
const SIGNUP_DESCRIPTION =
  "Create your Any Exam Easy account for NCLEX, USMLE, NAPLEX, PANCE, FNP & NPTE prep. Start a free trial or subscribe to Pro.";

export const dynamic = "force-dynamic";

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
  const session = await getCachedSession();
  if (session?.user?.id) {
    redirect(ROUTES.dashboard);
  }

  const { plan, promo, interval, tier, exam } = await searchParams;
  const initialPlan = parseInitialPlan(plan);
  const initialInterval = interval ? parseBillingInterval(interval) : "monthly";
  const initialTier = parseSubscriptionTier(tier);
  const initialExam = parseInitialExam(exam);

  return (
    <PageShell
      eyebrow="AnyExamEasy"
      title="Create your account."
      description={`${formatPricingCheckoutTrialOffer()}. ${TRIAL_LIFETIME_QUESTIONS} practice questions included. Must be 18 or older.`}
      align="center"
      maxWidth={contentWidth.auth}
      variant="premium"
      compact
    >
      <div className="mb-2 flex flex-col items-center gap-4 text-center">
        <BrandLogo href={ROUTES.home} variant="nav" />
        <Link
          href="/"
          className="text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-accent)]"
        >
          ← Return home
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
