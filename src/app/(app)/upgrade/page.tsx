import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { requireAppPage } from "@/lib/require-premium-page";
import { TrialUpgradeScreen, type TrialUpgradeOfferView } from "@/components/trial/TrialUpgradeScreen";
import { OFFER_PUBLIC_MESSAGE } from "@/lib/billing/trial-upgrade-offer";
import { readTrialUpgradeOffer } from "@/lib/billing/trial-upgrade-offer-db";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getExamScopedStats } from "@/lib/edtech/stats";
import { fieldIdForExamSlug } from "@/lib/edtech/question-bank-scope";
import { consentedTestimonialForExam } from "@/lib/trial/consented-testimonial";
import { runPageDb } from "@/lib/page-access-error";
import { ROUTES } from "@/lib/routes";
import type { UserAccess } from "@/lib/access-control";

export const metadata = {
  title: { absolute: "Upgrade — AnyExamEasy" },
  description: "Subscribe to keep your board prep progress.",
};

async function loadUpgradeOffer(
  userId: string,
  offerToken: string
): Promise<TrialUpgradeOfferView | null> {
  if (!offerToken) return null;
  try {
    return await readTrialUpgradeOffer(userId, offerToken);
  } catch (error) {
    console.error("[upgrade] offer lookup failed", error instanceof Error ? error.message : error);
    return {
      status: "unavailable",
      message: OFFER_PUBLIC_MESSAGE.unavailable,
      expiresAt: null,
      token: null,
      percentOff: null,
    };
  }
}

function shouldShowUpgrade(access: UserAccess): boolean {
  if (access.role === "staff") return false;
  if (access.role === "subscriber" && access.subscription.status === "active") return false;
  return access.role === "trial" || access.role === "free";
}

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: Promise<{ return?: string; reason?: string; offer?: string }>;
}) {
  const [session, sp] = await Promise.all([getCachedSession(), searchParams]);
  if (!session?.user?.id) {
    const callback = new URLSearchParams();
    if (typeof sp.return === "string" && sp.return.startsWith("/")) callback.set("return", sp.return);
    if (sp.reason) callback.set("reason", sp.reason);
    if (sp.offer) callback.set("offer", sp.offer);
    const next = callback.size > 0 ? `${ROUTES.upgrade}?${callback.toString()}` : ROUTES.upgrade;
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(next)}`);
  }

  const returnPath =
    typeof sp.return === "string" && sp.return.startsWith("/") ? sp.return : ROUTES.dashboard;
  const capReached = sp.reason === "trial_total";
  const offerToken = typeof sp.offer === "string" ? sp.offer.trim() : "";

  const [access, pref] = await runPageDb(() =>
    Promise.all([
      requireAppPage(ROUTES.upgrade),
      getUserExamPreference(session.user.id),
    ])
  );

  if (!shouldShowUpgrade(access)) {
    redirect(returnPath);
  }

  if (!pref) redirect(ROUTES.selectExam);

  const fieldId = fieldIdForExamSlug(pref.examSlug);
  const exam = EXAM_CATALOG[pref.examSlug];
  const testimonial = consentedTestimonialForExam(pref.examSlug);
  const [stats, offer] = await Promise.all([
    runPageDb(() => getExamScopedStats(session.user.id, pref.examSlug, fieldId)),
    loadUpgradeOffer(session.user.id, offerToken),
  ]);

  return (
    <TrialUpgradeScreen
      examSlug={pref.examSlug}
      boardName={exam.shortName}
      questionsAnswered={stats.questionsAnswered}
      accuracyPct={stats.accuracyPct}
      testimonial={testimonial}
      returnPath={returnPath}
      capReached={capReached}
      offer={offer}
    />
  );
}
