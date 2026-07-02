import { NextResponse } from "next/server";
import { getUserAccess } from "@/lib/access-control";
import { cacheGetOrSet, cacheKey, CACHE_TTL } from "@/lib/cache";
import { requireSessionGuard } from "@/lib/session-guard";
import {
  buildFullSubscriptionStatus,
  buildLiteSubscriptionStatus,
} from "@/lib/subscription/status-response";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(req: Request) {
  try {
  const guard = await requireSessionGuard(req);
  if (!guard.ok) return guard.response;

  const lite = new URL(req.url).searchParams.get("lite") === "1";

  const access = await cacheGetOrSet(
    cacheKey(["subscription-status", guard.userId]),
    CACHE_TTL.subscriptionStatus,
    () => getUserAccess(guard.userId)
  );

  const body = lite
    ? await buildLiteSubscriptionStatus(guard.userId, access)
    : await buildFullSubscriptionStatus(guard.userId, access);

  const headers: Record<string, string> = {};
  if (lite) {
    headers["Cache-Control"] = "private, max-age=15, stale-while-revalidate=30";
  }

  return NextResponse.json(body, { headers });
  } catch (error) {
    const { respondDbUnavailable } = await import("@/lib/api-db-error");
    const dbResponse = respondDbUnavailable(error);
    if (dbResponse) return dbResponse;
    console.error("[api/subscription/status]", error);
    return NextResponse.json(
      { error: "internal_error", message: "Could not load subscription status." },
      { status: 500 }
    );
  }
}
