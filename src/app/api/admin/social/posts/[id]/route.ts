import { NextResponse } from "next/server";
import { requireAdminPermission } from "@/lib/admin/auth";
import { logAdminAction } from "@/lib/audit";
import { moderatePostSchema } from "@/lib/social/validators";
import { moderatePost } from "@/lib/social/posts";

export const dynamic = "force-dynamic";

/** PATCH /api/admin/social/posts/[id] — approve | reject | delete | restore. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminPermission("social.moderate");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = moderatePostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid moderation action." }, { status: 400 });
  }

  try {
    const ok = await moderatePost(id, parsed.data.action, auth.userId);
    if (!ok) return NextResponse.json({ error: "Post not found." }, { status: 404 });

    void logAdminAction({
      actorId: auth.userId,
      action: "SOCIAL_POST_MODERATE",
      req,
      metadata: { postId: id, moderationAction: parsed.data.action },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/social/posts/:id] moderate failed", err);
    return NextResponse.json({ error: "Moderation failed." }, { status: 500 });
  }
}

/** DELETE /api/admin/social/posts/[id] — soft delete (undo via PATCH restore). */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminPermission("social.moderate");
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  try {
    const ok = await moderatePost(id, "delete", auth.userId);
    if (!ok) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    void logAdminAction({
      actorId: auth.userId,
      action: "SOCIAL_POST_DELETE",
      req,
      metadata: { postId: id },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/social/posts/:id] delete failed", err);
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
}
