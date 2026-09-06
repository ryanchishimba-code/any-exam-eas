"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { LoginMethod } from "@/lib/client/returning-user";
import { saveReturningUserHint } from "@/lib/client/returning-user";
import { sanitizeCallbackUrl } from "@/lib/client/auth-routes";
import { resolvePostLoginDestination as resolveDestination } from "@/lib/client/post-login-routing";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { markTrialWelcomePending } from "@/lib/client/trial-welcome";
import { ROUTES } from "@/lib/routes";

export type ClientSubscriptionStatus = {
  hasAccess?: boolean;
  hasAppAccess?: boolean;
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

const POST_LOGIN_FETCH_TIMEOUT_MS = 2_500;

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = POST_LOGIN_FETCH_TIMEOUT_MS
): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal, cache: "no-store" });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchSubscriptionStatus(): Promise<ClientSubscriptionStatus | null> {
  const attempts = 2;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const statusRes = await fetchWithTimeout("/api/subscription/status?lite=1");
    if (!statusRes) {
      await new Promise((resolve) => setTimeout(resolve, 80 * (attempt + 1)));
      continue;
    }
    if (statusRes.status === 401) {
      await new Promise((resolve) => setTimeout(resolve, 80 * (attempt + 1)));
      continue;
    }
    if (!statusRes.ok) {
      await new Promise((resolve) => setTimeout(resolve, 80 * (attempt + 1)));
      continue;
    }
    try {
      return (await statusRes.json()) as ClientSubscriptionStatus;
    } catch {
      return null;
    }
  }
  return null;
}

async function fetchExamSlug(): Promise<string | null> {
  const res = await fetchWithTimeout("/api/user/exam-preference");
  if (!res || !res.ok) return null;
  try {
    const data = (await res.json()) as { examSlug?: string | null };
    return data.examSlug ?? null;
  } catch {
    return null;
  }
}

/** Best-effort display name — never blocks navigation. */
function rememberAccountNameInBackground(email: string, method: LoginMethod, knownName?: string | null) {
  const trimmedKnown = knownName?.trim();
  if (trimmedKnown) {
    saveReturningUserHint({
      email,
      name: trimmedKnown,
      lastMethod: method === "magic" ? "email" : method,
    });
    return;
  }

  void (async () => {
    try {
      const meRes = await fetchWithTimeout("/api/me", undefined, 4_000);
      if (!meRes?.ok) return;
      const data = (await meRes.json()) as { user?: { name?: string | null } };
      const name = data.user?.name?.trim();
      if (!name) return;
      saveReturningUserHint({
        email,
        name,
        lastMethod: method === "magic" ? "email" : method,
      });
    } catch {
      /* ignore */
    }
  })();
}

export async function resolvePostLoginDestination(
  callbackUrl: string,
  status: ClientSubscriptionStatus | null,
  examSlug?: string | null
): Promise<string> {
  const slug = examSlug === undefined ? await fetchExamSlug() : examSlug;
  return resolveDestination(callbackUrl, status, slug);
}

export type CompleteLoginResult = {
  destination: string;
  isPremium: boolean;
};

let loginFlowInFlight: Promise<CompleteLoginResult> | null = null;

/**
 * After credentials/OAuth succeed, resolve where to go and hard-navigate.
 * Keeps the critical path to subscription + exam preference only — name/session
 * polling used to add multi-second delays on cold Neon.
 */
export async function completeLoginFlow(params: {
  router: AppRouterInstance;
  callbackUrl: string;
  email: string;
  name?: string | null;
  method: LoginMethod;
}): Promise<CompleteLoginResult> {
  if (loginFlowInFlight) return loginFlowInFlight;

  loginFlowInFlight = (async () => {
    const safeCallback = sanitizeCallbackUrl(params.callbackUrl);

    // Persist email/method immediately; name upgrades in the background.
    saveReturningUserHint({
      email: params.email,
      name: params.name?.trim() || undefined,
      lastMethod: params.method === "magic" ? "email" : params.method,
    });
    rememberAccountNameInBackground(params.email, params.method, params.name);

    const [status, examSlug] = await Promise.all([
      fetchSubscriptionStatus(),
      fetchExamSlug(),
    ]);

    let destination = resolveDestination(safeCallback, status, examSlug);

    if (
      status?.status === "trialing" &&
      status.hasAccess &&
      !destination.includes("welcome=trial")
    ) {
      if (!examSlug) {
        markTrialWelcomePending(status.daysRemaining ?? TRIAL_DAYS);
        destination += destination.includes("?") ? "&welcome=trial" : "?welcome=trial";
      }
    }

    // If routing APIs timed out, still leave login — dashboard/middleware will gate.
    if (!destination) destination = ROUTES.dashboard;

    // Hard navigation avoids soft-nav races (modal close on `/`, refresh on /login)
    // that briefly flash the marketing homepage before Study Hub.
    if (typeof window !== "undefined") {
      window.location.assign(destination);
    } else {
      params.router.replace(destination);
    }

    return {
      destination,
      isPremium: Boolean(status?.hasAccess),
    };
  })();

  try {
    return await loginFlowInFlight;
  } finally {
    // Keep the promise cached briefly so a remounted LoginForm effect shares it.
    const clear = () => {
      loginFlowInFlight = null;
    };
    if (typeof window !== "undefined") {
      window.setTimeout(clear, 2_000);
    } else {
      clear();
    }
  }
}
