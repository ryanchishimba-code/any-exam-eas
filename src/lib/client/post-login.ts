"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getSession } from "next-auth/react";
import type { LoginMethod } from "@/lib/client/returning-user";
import { saveReturningUserHint } from "@/lib/client/returning-user";
import { sanitizeCallbackUrl } from "@/lib/client/auth-routes";
import { resolvePostLoginDestination as resolveDestination } from "@/lib/client/post-login-routing";

export type ClientSubscriptionStatus = {
  hasAccess?: boolean;
  status?: string;
  daysRemaining?: number | null;
  trialEndsAt?: string | null;
  trialDays?: number;
  reactivation?: {
    method: "checkout" | "update_payment";
    checkoutPath?: string;
    settingsPath?: string;
    message?: string;
    checkoutPlan?: "trial" | "subscribe";
    trialAvailable?: boolean;
  } | null;
};

export async function fetchSubscriptionStatus(): Promise<ClientSubscriptionStatus | null> {
  const attempts = 8;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const statusRes = await fetch("/api/subscription/status", { cache: "no-store" });
      if (statusRes.status === 401) {
        // Session cookie may not be visible to API routes yet right after sign-in.
        await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
        continue;
      }
      if (!statusRes.ok) {
        await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
        continue;
      }
      return (await statusRes.json()) as ClientSubscriptionStatus;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
    }
  }
  return null;
}

async function fetchExamSlug(): Promise<string | null> {
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const res = await fetch("/api/user/exam-preference", { cache: "no-store" });
      if (res.status === 401) {
        await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
        continue;
      }
      if (!res.ok) return null;
      const data = (await res.json()) as { examSlug?: string | null };
      return data.examSlug ?? null;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
    }
  }
  return null;
}

export async function resolvePostLoginDestination(
  callbackUrl: string,
  status: ClientSubscriptionStatus | null
): Promise<string> {
  const examSlug = await fetchExamSlug();
  return resolveDestination(callbackUrl, status, examSlug);
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

  for (let attempt = 0; attempt < 8; attempt++) {
    const session = await getSession();
    if (session?.user?.email) break;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  params.router.refresh();

  const status = await fetchSubscriptionStatus();
  const destination = await resolvePostLoginDestination(safeCallback, status);

  params.router.replace(destination);

  return {
    destination,
    isPremium: Boolean(status?.hasAccess),
  };
}
