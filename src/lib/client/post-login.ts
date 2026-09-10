"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { LoginMethod } from "@/lib/client/returning-user";
import { saveReturningUserHint } from "@/lib/client/returning-user";
import { sanitizeCallbackUrl } from "@/lib/client/auth-routes";
import { resolvePostLoginDestination as resolveDestination } from "@/lib/client/post-login-routing";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { markTrialWelcomePending } from "@/lib/client/trial-welcome";
import { ROUTES } from "@/lib/routes";
import type { LoginReactivationSnapshot } from "@/lib/auth/login-routing-snapshot";

export type ClientSubscriptionStatus = {
  hasAccess?: boolean;
  hasAppAccess?: boolean;
  hasStudyAccess?: boolean;
  status?: string;
  daysRemaining?: number | null;
  trialEndsAt?: string | null;
  trialDays?: number;
  emailVerified?: boolean;
  blockReason?: string | null;
  reactivation?: LoginReactivationSnapshot | null;
};

/** Optional routing hints already on the JWT/session after authorize. */
export type SessionLoginRouting = {
  hasAccess?: boolean;
  hasAppAccess?: boolean;
  subscriptionStatus?: string;
  trialDaysRemaining?: number | null;
  examSlug?: string | null;
  reactivation?: LoginReactivationSnapshot | null;
};

const SESSION_FETCH_TIMEOUT_MS = 800;
const BACKGROUND_FETCH_TIMEOUT_MS = 4_000;

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = SESSION_FETCH_TIMEOUT_MS
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

/**
 * Used by TrialWelcomeHost and billing UI — not on the login navigation critical path.
 */
export async function fetchSubscriptionStatus(): Promise<ClientSubscriptionStatus | null> {
  const attempts = 2;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const statusRes = await fetchWithTimeout(
      "/api/subscription/status?lite=1",
      undefined,
      2_500
    );
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

export function statusFromSessionRouting(
  routing: SessionLoginRouting | null | undefined
): { status: ClientSubscriptionStatus; examSlug: string | null } | null {
  if (!routing) return null;
  if (typeof routing.hasAccess !== "boolean" && typeof routing.hasAppAccess !== "boolean") {
    return null;
  }
  return {
    status: {
      hasAccess: routing.hasAccess,
      hasAppAccess: routing.hasAppAccess,
      status: routing.subscriptionStatus,
      daysRemaining: routing.trialDaysRemaining ?? null,
      reactivation: routing.reactivation ?? null,
    },
    examSlug: routing.examSlug ?? null,
  };
}

/** Best-effort: read JWT session once (no Prisma) for smart post-login routing. */
async function readSessionRouting(): Promise<SessionLoginRouting | null> {
  try {
    const { getSession } = await import("next-auth/react");
    const sessionPromise = getSession();
    const timedOut = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), SESSION_FETCH_TIMEOUT_MS);
    });
    const session = await Promise.race([sessionPromise, timedOut]);
    if (!session?.user) return null;
    return session.user;
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
      const meRes = await fetchWithTimeout("/api/me", undefined, BACKGROUND_FETCH_TIMEOUT_MS);
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
  return resolveDestination(callbackUrl, status, examSlug ?? null);
}

export type CompleteLoginResult = {
  destination: string;
  isPremium: boolean;
};

let loginFlowInFlight: Promise<CompleteLoginResult> | null = null;

/**
 * After credentials/OAuth succeed, navigate immediately.
 * Prefer JWT session routing fields (folded in at authorize) — never wait on
 * /api/subscription/status or /api/user/exam-preference. If the session snapshot
 * is missing, go to a safe default; destination pages gate billing/exam.
 */
export async function completeLoginFlow(params: {
  router: AppRouterInstance;
  callbackUrl: string;
  email: string;
  name?: string | null;
  method: LoginMethod;
  /** When the caller already has useSession data, skip getSession. */
  sessionRouting?: SessionLoginRouting | null;
}): Promise<CompleteLoginResult> {
  if (loginFlowInFlight) return loginFlowInFlight;

  loginFlowInFlight = (async () => {
    const safeCallback = sanitizeCallbackUrl(params.callbackUrl);

    saveReturningUserHint({
      email: params.email,
      name: params.name?.trim() || undefined,
      lastMethod: params.method === "magic" ? "email" : params.method,
    });
    rememberAccountNameInBackground(params.email, params.method, params.name);

    const fromParams = statusFromSessionRouting(params.sessionRouting);
    const fromSession =
      fromParams ?? statusFromSessionRouting(await readSessionRouting());

    const status = fromSession?.status ?? null;
    const examSlug = fromSession?.examSlug ?? null;

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
