import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SignupScreen } from "@/components/auth/SignupScreen";
import { parseBoardSlug } from "@/lib/auth/board-intent";
import { isDailySignupArrival } from "@/lib/marketing/daily-trial";
import { getCachedSession } from "@/lib/auth/session";
import { resolveSignedInSignup, resolveSignupIntent } from "@/lib/auth/signup-intent";
import { startCardFreeTrialForUser } from "@/lib/billing/start-app-trial";
import { formatTrialSource } from "@/lib/billing/trial-alert-content";
import { assignBoardIfUnset } from "@/lib/edtech/exam-preference";
import { getSubscriptionAccess } from "@/lib/subscription-access";
import { hasConsumedTrial } from "@/lib/trial-eligibility";
import { SITE_NAME } from "@/lib/site";

const SIGNUP_TITLE = `Sign Up — ${SITE_NAME}`;
const SIGNUP_DESCRIPTION =
  "Create your AnyExamEasy account for NCLEX, USMLE, NAPLEX, PANCE, FNP & NPTE prep. Start a free trial or subscribe to Pro.";

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

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{
    plan?: string;
    promo?: string;
    code?: string;
    interval?: string;
    tier?: string;
    exam?: string;
    board?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const session = await getCachedSession();
  if (session?.user?.id) {
    const board = parseBoardSlug(params.board) ?? parseBoardSlug(params.exam);
    if (board) {
      try {
        await assignBoardIfUnset(session.user.id, board);
      } catch (error) {
        console.warn(
          "[signup] board intent skipped:",
          error instanceof Error ? error.message : error
        );
      }
    }

    let accessStatus: string | null = null;
    let trialAvailable = false;
    if (session.user.email) {
      const [access, consumed] = await Promise.all([
        getSubscriptionAccess(session.user.id),
        hasConsumedTrial(session.user.email),
      ]);
      accessStatus = access.status;
      trialAvailable = !consumed;
    }

    const decision = resolveSignedInSignup({
      plan: params.plan,
      interval: params.interval,
      tier: params.tier,
      promo: params.promo,
      exam: params.exam ?? params.board,
      accessStatus,
      trialAvailable,
    });

    if (decision.action === "start-trial" && session.user.email) {
      const started = await startCardFreeTrialForUser({
        userId: session.user.id,
        email: session.user.email,
        tier: params.tier,
        interval: params.interval,
        signupSource: formatTrialSource({
          utmSource: params.utm_source,
          utmMedium: params.utm_medium,
          utmCampaign: params.utm_campaign,
        }),
      });
      redirect(started.started ? decision.href : "/dashboard");
    }

    redirect(decision.href);
  }

  const intent = resolveSignupIntent(params);

  return (
    <SignupScreen
      initialPlan={intent.plan}
      initialPromo={intent.promo}
      initialPassCode={intent.passCode}
      initialInterval={intent.interval}
      initialTier={intent.tier}
      initialExam={intent.exam}
      arrivedFromDaily={isDailySignupArrival(params.utm_source)}
      utmSource={params.utm_source}
      utmMedium={params.utm_medium}
      utmCampaign={params.utm_campaign}
      termsNotice={
        params.error === "terms_required"
          ? "Check the terms box before creating an account with Google, Apple, or LinkedIn."
          : ""
      }
    />
  );
}
