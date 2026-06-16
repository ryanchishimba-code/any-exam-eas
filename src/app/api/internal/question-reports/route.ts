import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import { listQuestionReports } from "@/lib/question-reports/service";
import { logAdminAction } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireInternalPermission("feedback.view");
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? undefined;
  const fieldId = url.searchParams.get("fieldId") ?? undefined;
  const examSlug = url.searchParams.get("examSlug") ?? undefined;
  const limit = Number(url.searchParams.get("limit") ?? 50);
  const offset = Number(url.searchParams.get("offset") ?? 0);

  const result = await listQuestionReports({ status, fieldId, examSlug, limit, offset });

  void logAdminAction({
    actorId: auth.userId,
    action: "VIEW_QUESTION_REPORTS",
    metadata: { status, fieldId, examSlug },
    req,
  });

  return NextResponse.json(result);
}
