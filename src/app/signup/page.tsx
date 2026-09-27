import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SignupScreen } from "@/components/auth/SignupScreen";
import { getCachedSession } from "@/lib/auth/session";
import { parseBillingInterval } from "@/lib/billing-plans";
import { parseSubscriptionTier } from "@/lib/subscription-tiers";
import { isExamSlug } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";
import type { SignupPlan } from "@/lib/validators/auth";
import { SITE_NAME } from "@/lib/site";
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

  return (
    <SignupScreen
      initialPlan={parseInitialPlan(plan)}
      initialPromo={promo?.trim() ?? ""}
      initialInterval={interval ? parseBillingInterval(interval) : "monthly"}
      initialTier={parseSubscriptionTier(tier)}
      initialExam={parseInitialExam(exam)}
    />
  );
}
