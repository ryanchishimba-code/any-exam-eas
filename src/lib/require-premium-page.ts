import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { getUserAccess, type UserAccess } from "@/lib/access-control";
import { redirectIfDbUnavailable } from "@/lib/page-access-error";
import { resolvePaywallRedirect } from "@/lib/reactivation";

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

  if (access.blockReason === "email_unverified") {
    redirect("/pricing?paywall=verify");
  }

  return access;
}

/** Dashboard and account home — trial, paid, or post-trial free tier. */
export async function requireAppPage(callbackPath = "/dashboard"): Promise<UserAccess> {
  const session = await getCachedSession();
  const access = await loadPageAccess(callbackPath);

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

/** Server-side paywall — trial + paid only (blocks post-trial free tier). */
export async function requirePremiumPage(
  callbackPath = "/study"
): Promise<UserAccess> {
  const session = await getCachedSession();
  const access = await loadPageAccess(callbackPath);

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
