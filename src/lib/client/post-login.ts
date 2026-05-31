"use client";

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
    lastMethod: params.method === "magic" ? "email" : params.method,
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
