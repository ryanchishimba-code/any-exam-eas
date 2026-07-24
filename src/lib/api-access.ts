import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserAccess, userHasFeature, type UserAccess } from "@/lib/access-control";
import { subscriptionRequiredResponse, proFeatureRequiredResponse } from "@/lib/api-subscription";
import { isAccountDisabled } from "@/lib/account-security";
import { respondDbUnavailable } from "@/lib/api-db-error";
import type { SubscriptionFeature } from "@/lib/subscription-features";

export type ApiAuthResult =
  | { ok: true; userId: string; access: UserAccess }
  | { ok: false; response: NextResponse };

function accountDisabledResponse(status: string): NextResponse {
  const code = status === "deleted" ? "ACCOUNT_DELETED" : "ACCOUNT_SUSPENDED";
  const message =
    status === "deleted"
      ? "This account has been closed."
      : "Account suspended";
  return NextResponse.json({ error: message, code }, { status: 403 });
}

export async function requireAuthenticatedApi(_req?: Request): Promise<ApiAuthResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  let access: UserAccess;
  try {
    access = await getUserAccess(session.user.id);
  } catch (error) {
    const dbResponse = respondDbUnavailable(error);
    if (dbResponse) return { ok: false, response: dbResponse };
    throw error;
  }
  if (isAccountDisabled(access.accountStatus)) {
    return { ok: false, response: accountDisabledResponse(access.accountStatus) };
  }

  return { ok: true, userId: session.user.id, access };
}

export async function requirePremiumApi(req?: Request): Promise<ApiAuthResult> {
  const authResult = await requireAuthenticatedApi(req);
  if (!authResult.ok) return authResult;

  const { access } = authResult;
  if (!access.hasPremiumAccess) {
    if (access.blockReason === "suspended" || access.blockReason === "deleted") {
      return {
        ok: false,
        response: accountDisabledResponse(access.accountStatus),
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

/** Trial or paid study access — post-trial free is dashboard-only. */
export async function requireStudyApi(req?: Request): Promise<ApiAuthResult> {
  const authResult = await requireAuthenticatedApi(req);
  if (!authResult.ok) return authResult;

  const { access } = authResult;
  if (access.hasStudyAccess) {
    return authResult;
  }

  if (access.blockReason === "suspended" || access.blockReason === "deleted") {
    return {
      ok: false,
      response: accountDisabledResponse(access.accountStatus),
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
