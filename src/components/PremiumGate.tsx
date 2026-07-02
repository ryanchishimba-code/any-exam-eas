import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserAccess } from "@/lib/access-control";
import { redirectIfDbUnavailable } from "@/lib/page-access-error";
import { resolvePaywallRedirect } from "@/lib/reactivation";
import { AccessBlockedNotice } from "./AccessBlockedNotice";

/** Renders children only when the user has trial, paid, staff, or comp access. */
export async function PremiumGate({
  children,
  callbackPath = "/study",
}: {
  children: ReactNode;
  callbackPath?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
  }

  let access;
  try {
    access = await getUserAccess(session.user.id);
  } catch (error) {
    redirectIfDbUnavailable(error);
  }

  if (access.blockReason === "suspended") {
    return <AccessBlockedNotice reason="suspended" />;
  }

  if (access.blockReason === "email_unverified") {
    return <AccessBlockedNotice reason="email_unverified" />;
  }

  if (!access.hasPremiumAccess) {
    const destination = await resolvePaywallRedirect(
      session.user.id,
      session.user.email,
      callbackPath,
      access.subscription
    );
    redirect(destination);
  }

  return <>{children}</>;
}
