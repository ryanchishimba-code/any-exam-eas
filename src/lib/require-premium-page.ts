import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserAccess, type UserAccess } from "@/lib/access-control";

/** Server-side paywall — redirects unpaid users to pricing. Staff bypass included. */
export async function requirePremiumPage(
  callbackPath = "/study"
): Promise<UserAccess> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
  }

  const access = await getUserAccess(session.user.id);

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
