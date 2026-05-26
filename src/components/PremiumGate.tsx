import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/auth";
import { getUserAccess } from "@/lib/access-control";
import { SubscriptionPaywall } from "./SubscriptionPaywall";
import { AccessBlockedNotice } from "./AccessBlockedNotice";

/** Renders children only when the user has trial, paid, staff, or comp access. */
export async function PremiumGate({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/study");
  }

  const access = await getUserAccess(session.user.id);

  if (access.blockReason === "suspended") {
    return <AccessBlockedNotice reason="suspended" />;
  }

  if (access.blockReason === "email_unverified") {
    return <AccessBlockedNotice reason="email_unverified" />;
  }

  if (!access.hasPremiumAccess) {
    return <SubscriptionPaywall access={access.subscription} />;
  }

  return <>{children}</>;
}
