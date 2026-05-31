"use client";

import { getSession } from "next-auth/react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { LoginMethod } from "@/lib/client/returning-user";
import { saveReturningUserHint } from "@/lib/client/returning-user";
import { sanitizeCallbackUrl } from "@/lib/client/auth-routes";

export async function resolvePostLoginDestination(
  callbackUrl: string
): Promise<string> {
  const safe = sanitizeCallbackUrl(callbackUrl);

  try {
    const statusRes = await fetch("/api/subscription/status", { cache: "no-store" });
    const status = statusRes.ok
      ? ((await statusRes.json()) as { hasAccess?: boolean })
      : { hasAccess: false };
    return status.hasAccess ? safe : "/pricing?paywall=1";
  } catch {
    return safe;
  }
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

export async function completeLoginFlow(params: {
  router: AppRouterInstance;
  callbackUrl: string;
  email: string;
  name?: string | null;
  method: LoginMethod;
}): Promise<void> {
  const safeCallback = sanitizeCallbackUrl(params.callbackUrl);
  const name = params.name?.trim() || (await fetchAccountName());

  saveReturningUserHint({
    email: params.email,
    name,
    lastMethod: params.method === "magic" ? "email" : params.method,
  });

  await getSession();
  params.router.refresh();

  const destination = await resolvePostLoginDestination(safeCallback);
  params.router.push(destination);
}
