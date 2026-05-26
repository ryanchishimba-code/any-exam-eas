import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import { deleteFeedback, setFeedbackResolved } from "@/lib/feedback/service";
import { logAdminAction } from "@/lib/audit";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  const auth = await requireInternalPermission("feedback.manage");
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const body = await req.json().catch(() => ({}));
  const resolved = Boolean(body.resolved);

  const item = await setFeedbackResolved(id, resolved, auth.userId);
  if (!item) {
    return NextResponse.json({ error: "Feedback not found." }, { status: 404 });
  }

  void logAdminAction({
    actorId: auth.userId,
    action: resolved ? "FEEDBACK_RESOLVED" : "FEEDBACK_REOPENED",
    targetType: "feedback",
    targetId: id,
    req,
  });

  return NextResponse.json({ item });
}

export async function DELETE(req: Request, context: RouteContext) {
  const auth = await requireInternalPermission("feedback.manage");
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const ok = await deleteFeedback(id);
  if (!ok) {
    return NextResponse.json({ error: "Feedback not found." }, { status: 404 });
  }

  void logAdminAction({
    actorId: auth.userId,
    action: "FEEDBACK_DELETED",
    targetType: "feedback",
    targetId: id,
    req,
  });

  return NextResponse.json({ ok: true });
}
