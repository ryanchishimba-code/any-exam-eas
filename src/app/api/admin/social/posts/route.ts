import { NextResponse } from "next/server";
import { requireAdminPermission } from "@/lib/admin/auth";
import { createSocialPostSchema } from "@/lib/social/validators";
import { createOfficialPost, listModerationPosts } from "@/lib/social/posts";

export const dynamic = "force-dynamic";

/** GET /api/admin/social/posts?status=&includeDeleted= — moderation queue. */
export async function GET(req: Request) {
  const auth = await requireAdminPermission("social.moderate");
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status");
  const status =
    statusParam === "pending" || statusParam === "approved" || statusParam === "rejected"
      ? statusParam
      : undefined;
  const includeDeleted = url.searchParams.get("includeDeleted") === "true";

  try {
    const items = await listModerationPosts({ status, includeDeleted });
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[admin/social/posts] list failed", err);
    return NextResponse.json({ error: "Failed to load posts." }, { status: 500 });
  }
}

/** POST /api/admin/social/posts — publish an official post (auto-approved). */
export async function POST(req: Request) {
  const auth = await requireAdminPermission("social.publish");
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = createSocialPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid post." },
      { status: 400 }
    );
  }

  try {
    const { id } = await createOfficialPost(auth.userId, parsed.data);
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("[admin/social/posts] create failed", err);
    return NextResponse.json({ error: "Failed to publish post." }, { status: 500 });
  }
}
