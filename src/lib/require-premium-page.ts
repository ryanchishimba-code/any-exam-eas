import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { getUserAccess, type UserAccess } from "@/lib/access-control";
import { redirectIfDbUnavailable } from "@/lib/page-access-error";
import { resolvePaywallRedirect } from "@/lib/reactivation";
import { ROUTES } from "@/lib/routes";

async function loadPageAccess(callbackPath: string): Promise<UserAccess> {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
  }

  let access: UserAccess;
  try {
    // Best-effort warm with a short budget — never burn the page timeout here.
    const { ensureNeonReady } = await import("@/lib/neon-warmup");
    await ensureNeonReady("access", { budgetMs: 3_000 });
    access = await getUserAccess(session.user.id);
  } catch (error) {
    redirectIfDbUnavailable(error);
  }

  if (access.blockReason === "suspended" || access.blockReason === "deleted") {
    redirect("/pricing?paywall=suspended");
  }

  return access;
}

const VERIFY_EMAIL_PATH = `${ROUTES.dashboard}?verify=1`;

/** Dashboard and account home — trial, paid, post-trial free, or email-verify gate. */
export async function requireAppPage(callbackPath = "/dashboard"): Promise<UserAccess> {
  const session = await getCachedSession();
  const access = await loadPageAccess(callbackPath);

  // Unverified trial users stay on dashboard verify UI — never send them to pricing.
  if (access.blockReason === "email_unverified") {
    return access;
  }

  if (!access.hasAppAccess) {
    const destination = await resolvePaywallRedirect(
      session!.user!.id,
      session!.user!.email,
      callbackPath,
      access.subscription
    );
    redirect(destination);
  }

  return access;
}

/** Question bank / study entry — trial or paid only (post-trial free stays on dashboard). */
export async function requireStudyPage(callbackPath = "/study"): Promise<UserAccess> {
  const session = await getCachedSession();
  const access = await loadPageAccess(callbackPath);

  if (access.blockReason === "email_unverified") {
    redirect(VERIFY_EMAIL_PATH);
  }

  if (!access.hasStudyAccess) {
    if (access.hasFreeTierAccess) {
      redirect(`/dashboard?upgrade=1&return=${encodeURIComponent(callbackPath)}`);
    }
    const destination = await resolvePaywallRedirect(
      session!.user!.id,
      session!.user!.email,
      callbackPath,
      access.subscription
    );
    redirect(destination);
  }

  return access;
}

export type StudyGuideAccessResult =
  | { status: "allowed"; access: UserAccess }
  | { status: "upsell"; signedIn: boolean };

/**
 * Study-guide pages render an upsell instead of sending anonymous visitors to login.
 * Email verification, suspension, and the premium reader stay on the existing rules.
 */
export async function resolveStudyGuideAccess(
  _callbackPath: string
): Promise<StudyGuideAccessResult> {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    return { status: "upsell", signedIn: false };
  }

  let access: UserAccess;
  try {
    const { ensureNeonReady } = await import("@/lib/neon-warmup");
    await ensureNeonReady("access", { budgetMs: 3_000 });
    access = await getUserAccess(session.user.id);
  } catch (error) {
    redirectIfDbUnavailable(error);
  }

  if (access.blockReason === "suspended" || access.blockReason === "deleted") {
    redirect("/pricing?paywall=suspended");
  }

  if (access.blockReason === "email_unverified") {
    redirect(`${ROUTES.dashboard}?verify=1`);
  }

  if (access.hasPremiumAccess) {
    return { status: "allowed", access };
  }

  return { status: "upsell", signedIn: true };
}

/** Server-side paywall — trial + paid only (blocks post-trial free tier). */
export async function requirePremiumPage(
  callbackPath = "/study"
): Promise<UserAccess> {
  const session = await getCachedSession();
  const access = await loadPageAccess(callbackPath);

  if (access.blockReason === "email_unverified") {
    redirect(VERIFY_EMAIL_PATH);
  }

  if (!access.hasPremiumAccess) {
    if (access.hasFreeTierAccess) {
      redirect(`/dashboard?upgrade=1&return=${encodeURIComponent(callbackPath)}`);
    }
    const destination = await resolvePaywallRedirect(
      session!.user!.id,
      session!.user!.email,
      callbackPath,
      access.subscription
    );
    redirect(destination);
  }

  return access;
}
