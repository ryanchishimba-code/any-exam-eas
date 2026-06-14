import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { getUserAccess, type UserAccess } from "@/lib/access-control";
import { checkAndRecordAccountIp } from "@/lib/account-ip-limit";

/** Server-side paywall — redirects unpaid users to pricing. Staff bypass included. */
export async function requirePremiumPage(
  callbackPath = "/study"
): Promise<UserAccess> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
  }

  const ipCheck = await checkAndRecordAccountIp(
    session.user.id,
    session.user.role,
    undefined,
    await headers()
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

  if (access.blockReason === "suspended") {
    redirect("/pricing?paywall=suspended");
  }

  if (access.blockReason === "email_unverified") {
    redirect("/pricing?paywall=verify");
  }

  if (!access.hasPremiumAccess) {
    redirect(`/pricing?paywall=1&return=${encodeURIComponent(callbackPath)}`);
  }

  return access;
}
