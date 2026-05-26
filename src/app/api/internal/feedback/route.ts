import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import { listFeedback } from "@/lib/feedback/service";
import type { FeedbackSort, FeedbackStatus } from "@/lib/feedback/types";
import { logAdminAction } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireInternalPermission("feedback.view");
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const category = url.searchParams.get("category") ?? undefined;
  const status = (url.searchParams.get("status") as FeedbackStatus | null) ?? undefined;
  const search = url.searchParams.get("q") ?? undefined;
  const sort = (url.searchParams.get("sort") as FeedbackSort | null) ?? "newest";
  const limit = Number(url.searchParams.get("limit") ?? 50);
  const offset = Number(url.searchParams.get("offset") ?? 0);

  const result = await listFeedback({
    category: category || undefined,
    status: status === "open" || status === "resolved" ? status : undefined,
    search,
    sort,
    limit,
    offset,
  });

  void logAdminAction({
    actorId: auth.userId,
    action: "VIEW_FEEDBACK_INBOX",
    metadata: { category, status, sort },
    req,
  });

  return NextResponse.json(result);
}
