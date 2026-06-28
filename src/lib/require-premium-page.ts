import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { getUserAccess, type UserAccess } from "@/lib/access-control";
import { checkAndRecordAccountIp } from "@/lib/account-ip-limit";
import { resolvePaywallRedirect } from "@/lib/reactivation";

async function loadPageAccess(callbackPath: string): Promise<UserAccess> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
  }

  const ipCheck = await checkAndRecordAccountIp(
    session.user.id,
    session.user.role,
    undefined,
    await headers(),
    session.user.email
  );
  if (!ipCheck.ok) {
    redirect(
      `/login?error=${ipCheck.reason}&callbackUrl=${encodeURIComponent(callbackPath)}`
    );
  }

  let access;
  try {
    access = await getUserAccess(session.user.id);
  } catch {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
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
  const session = await auth();
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

/** Question bank / study entry — trial, paid, or free tier (usage caps apply in API). */
export async function requireStudyPage(callbackPath = "/study"): Promise<UserAccess> {
  const session = await auth();
  const access = await loadPageAccess(callbackPath);

  if (!access.hasStudyAccess) {
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
  const session = await auth();
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
