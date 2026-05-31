"use client";

import { signIn } from "next-auth/react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { LoginMethod } from "@/lib/client/returning-user";
import { saveReturningUserHint } from "@/lib/client/returning-user";

export async function completeLoginFlow(params: {
  router: AppRouterInstance;
  callbackUrl: string;
  email: string;
  name?: string | null;
  method: LoginMethod;
}): Promise<void> {
  saveReturningUserHint({
    email: params.email,
    name: params.name ?? undefined,
    lastMethod: params.method,
  });

  const statusRes = await fetch("/api/subscription/status");
  const status = statusRes.ok ? await statusRes.json() : { hasAccess: false };

  params.router.refresh();

  if (status.hasAccess) {
    params.router.push(params.callbackUrl);
  } else {
    params.router.push("/pricing?paywall=1");
  }
}

export async function signInWithMagicToken(
  magicToken: string,
  router: AppRouterInstance,
  callbackUrl: string
): Promise<string | null> {
  const res = await signIn("credentials", {
    magicToken,
    email: "magic@anyexameasy.test",
    password: "magic",
    redirect: false,
  });

  if (!res || res.error) {
    return "This sign-in link is invalid or has expired. Request a new one below.";
  }

  const meRes = await fetch("/api/me");
  const me = meRes.ok ? await meRes.json() : null;
  const email = me?.user?.email ?? "";

  await completeLoginFlow({
    router,
    callbackUrl,
    email,
    name: me?.user?.name,
    method: "magic",
  });

  return null;
}
