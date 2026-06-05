"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getSession } from "next-auth/react";
import type { LoginMethod } from "@/lib/client/returning-user";
import { saveReturningUserHint } from "@/lib/client/returning-user";
import { sanitizeCallbackUrl } from "@/lib/client/auth-routes";

export type ClientSubscriptionStatus = {
  hasAccess?: boolean;
  status?: string;
  daysRemaining?: number | null;
  trialEndsAt?: string | null;
  trialDays?: number;
};

export async function fetchSubscriptionStatus(): Promise<ClientSubscriptionStatus | null> {
  try {
    const statusRes = await fetch("/api/subscription/status", { cache: "no-store" });
    if (!statusRes.ok) return null;
    return (await statusRes.json()) as ClientSubscriptionStatus;
  } catch {
    return null;
  }
}

export async function resolvePostLoginDestination(
  callbackUrl: string,
  status: ClientSubscriptionStatus | null
): Promise<string> {
  const safe = sanitizeCallbackUrl(callbackUrl);

  if (!status?.hasAccess) {
    return "/pricing?paywall=1";
  }

  if (
    safe.startsWith("/study") ||
    safe.startsWith("/generate") ||
    safe.startsWith("/learn") ||
    safe.startsWith("/dashboard") ||
    safe.startsWith("/studygub")
  ) {
    return safe.startsWith("/dashboard") ? "/studygub" : safe;
  }

  return "/studygub";
}

async function fetchAccountName(): Promise<string | undefined> {
  try {
    const meRes = await fetch("/api/me", { cache: "no-store" });
    if (!meRes.ok) return undefined;
    const data = (await meRes.json()) as { user?: { name?: string | null } };
    return data.user?.name?.trim() || undefined;
  } catch {
    return undefined;
  }
}

export type CompleteLoginResult = {
  destination: string;
  isPremium: boolean;
};

export async function completeLoginFlow(params: {
  router: AppRouterInstance;
  callbackUrl: string;
  email: string;
  name?: string | null;
  method: LoginMethod;
}): Promise<CompleteLoginResult> {
  const safeCallback = sanitizeCallbackUrl(params.callbackUrl);
  const name = params.name?.trim() || (await fetchAccountName());

  saveReturningUserHint({
    email: params.email,
    name,
    lastMethod: params.method === "magic" ? "email" : params.method,
  });

  await getSession();
  params.router.refresh();

  const status = await fetchSubscriptionStatus();
  const destination = await resolvePostLoginDestination(safeCallback, status);

  params.router.push(destination);

  return {
    destination,
    isPremium: Boolean(status?.hasAccess),
  };
}
