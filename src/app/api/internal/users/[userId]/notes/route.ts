import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import { addSupportNote } from "@/lib/crm/notes";
import { logAdminAction } from "@/lib/audit";
import { trackEvent } from "@/lib/analytics/events";
import { EVENT_TYPES } from "@/lib/analytics/types";

type Params = { params: Promise<{ userId: string }> };

export async function POST(req: Request, { params }: Params) {
  const auth = await requireInternalPermission("crm.edit_notes");
  if (auth instanceof NextResponse) return auth;

  const { userId } = await params;
  const { body, pinned } = await req.json();
  if (!body?.trim()) {
    return NextResponse.json({ error: "Note body required" }, { status: 400 });
  }

  const note = await addSupportNote({
    userId,
    authorId: auth.userId,
    body,
    pinned: Boolean(pinned),
  });

  void logAdminAction({
    actorId: auth.userId,
    action: "ADD_SUPPORT_NOTE",
    targetType: "user",
    targetId: userId,
    req,
  });
  trackEvent({
    userId: auth.userId,
    eventType: EVENT_TYPES.ADMIN_NOTE_ADDED,
    category: "admin",
    metadata: { targetUserId: userId },
    req,
  });

  return NextResponse.json({ note });
}
