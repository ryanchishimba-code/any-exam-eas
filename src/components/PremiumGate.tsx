import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/auth";
import { getSubscriptionAccess } from "@/lib/subscription-access";
import { SubscriptionPaywall } from "./SubscriptionPaywall";

/** Renders children only when the user has trial or paid access. */
export async function PremiumGate({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const access = await getSubscriptionAccess(session.user.id);
  if (!access.hasAccess) {
    return <SubscriptionPaywall access={access} />;
  }

  return <>{children}</>;
}
