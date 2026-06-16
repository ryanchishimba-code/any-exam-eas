import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { getUserAccess, userHasFeature, type UserAccess } from "@/lib/access-control";
import { subscriptionRequiredResponse, proFeatureRequiredResponse } from "@/lib/api-subscription";
import { enforceAccountIpLimit } from "@/lib/account-ip-limit";
import type { SubscriptionFeature } from "@/lib/subscription-features";

export type ApiAuthResult =
  | { ok: true; userId: string; access: UserAccess }
  | { ok: false; response: NextResponse };

export async function requireAuthenticatedApi(req?: Request): Promise<ApiAuthResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const headerStore = req ? undefined : await headers();
  const ipBlocked = await enforceAccountIpLimit(
    session.user.id,
    session.user.role,
    req,
    headerStore
  );
  if (ipBlocked) {
    return { ok: false, response: ipBlocked };
  }

  return { ok: true, userId: session.user.id, access: await getUserAccess(session.user.id) };
}

export async function requirePremiumApi(req?: Request): Promise<ApiAuthResult> {
  const authResult = await requireAuthenticatedApi(req);
  if (!authResult.ok) return authResult;

  const { access } = authResult;
  if (!access.hasPremiumAccess) {
    if (access.blockReason === "suspended") {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Account suspended", code: "ACCOUNT_SUSPENDED" },
          { status: 403 }
        ),
      };
    }
    if (access.blockReason === "email_unverified") {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Email verification required", code: "EMAIL_UNVERIFIED" },
          { status: 403 }
        ),
      };
    }
    return {
      ok: false,
      response: subscriptionRequiredResponse(access.subscription),
    };
  }

  return authResult;
}

export async function requireProFeatureApi(
  feature: SubscriptionFeature,
  req?: Request
): Promise<ApiAuthResult> {
  const authResult = await requirePremiumApi(req);
  if (!authResult.ok) return authResult;

  if (!userHasFeature(authResult.access, feature)) {
    return {
      ok: false,
      response: proFeatureRequiredResponse(authResult.access.subscription, feature),
    };
  }

  return authResult;
}
