import { NextResponse } from "next/server";
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";
import { cacheGetOrSet, cacheKey, CACHE_TTL } from "@/lib/cache";

export const runtime = "nodejs";

export async function GET() {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const dashboard = await cacheGetOrSet(
    cacheKey(["student-dashboard", premium.userId]),
    CACHE_TTL.learningDashboard,
    () => getStudentDashboardData(premium.userId)
  );

  return NextResponse.json({ dashboard });
}
