import { NextResponse } from "next/server";
import { requireAdminPermission } from "@/lib/admin/auth";
import { logAdminAction } from "@/lib/audit";
import { createScheduledPostSchema } from "@/lib/social/validators";
import { createScheduledPost, listScheduledPosts } from "@/lib/social/publish";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET /api/admin/social/schedule — list scheduled + published brand posts. */
export async function GET() {
  const auth = await requireAdminPermission("social.publish");
  if (auth instanceof NextResponse) return auth;

  try {
    const items = await listScheduledPosts();
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[admin/social/schedule] list failed", err);
    return NextResponse.json({ error: "Failed to load scheduled posts." }, { status: 500 });
  }
}

/** POST /api/admin/social/schedule — schedule (future) or publish now. */
export async function POST(req: Request) {
  const auth = await requireAdminPermission("social.publish");
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = createScheduledPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid post." },
      { status: 400 }
    );
  }

  try {
    const item = await createScheduledPost(parsed.data, auth.userId);
    void logAdminAction({
      actorId: auth.userId,
      action: "SOCIAL_POST_SCHEDULE",
      req,
      metadata: { id: item.id, status: item.status, platforms: item.platforms.join(",") },
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error("[admin/social/schedule] create failed", err);
    return NextResponse.json({ error: "Failed to schedule post." }, { status: 500 });
  }
}
