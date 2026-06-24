import { NextResponse } from "next/server";
import { requireAdminPermission } from "@/lib/admin/auth";
import { logAdminAction } from "@/lib/audit";
import { cancelScheduledPost, publishScheduledPost } from "@/lib/social/publish";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** PATCH /api/admin/social/schedule/[id] — { action: "cancel" | "publish_now" }. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminPermission("social.publish");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as { action?: string } | null;

  try {
    if (body?.action === "publish_now") {
      const item = await publishScheduledPost(id);
      if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
      void logAdminAction({ actorId: auth.userId, action: "SOCIAL_POST_PUBLISH_NOW", req, metadata: { id } });
      return NextResponse.json({ item });
    }
    if (body?.action === "cancel") {
      const ok = await cancelScheduledPost(id);
      if (!ok) return NextResponse.json({ error: "Cannot cancel this post." }, { status: 400 });
      void logAdminAction({ actorId: auth.userId, action: "SOCIAL_POST_CANCEL", req, metadata: { id } });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (err) {
    console.error("[admin/social/schedule/:id] action failed", err);
    return NextResponse.json({ error: "Action failed." }, { status: 500 });
  }
}
