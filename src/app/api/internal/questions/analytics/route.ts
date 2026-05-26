import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import { getQuestionAnalyticsOverview } from "@/lib/questions/analytics-server";
import { logAdminAction } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireInternalPermission("analytics.view_education");
  if (auth instanceof NextResponse) return auth;

  const days = Number(new URL(req.url).searchParams.get("days") ?? 30);
  const overview = await getQuestionAnalyticsOverview(days);

  void logAdminAction({
    actorId: auth.userId,
    action: "VIEW_QUESTION_ANALYTICS",
    req,
  });

  return NextResponse.json({ overview });
}
