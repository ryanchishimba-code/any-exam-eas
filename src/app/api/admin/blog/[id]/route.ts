import { NextResponse } from "next/server";
import { requireAdminPermission } from "@/lib/admin/auth";
import { updateBlogPostSchema } from "@/lib/admin/blog-validators";
import {
  getBlogPost,
  softDeleteBlogPost,
  updateBlogPost,
} from "@/lib/admin/blog-admin";
import { revalidatePublicBlog } from "@/lib/blog/revalidate";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** GET /api/admin/blog/[id] */
export async function GET(_req: Request, ctx: Ctx) {
  const auth = await requireAdminPermission("admin.blog");
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  try {
    const item = await getBlogPost(id);
    if (!item || item.deletedAt) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch (err) {
    console.error("[admin/blog] get failed", err);
    return NextResponse.json({ error: "Failed to load post." }, { status: 500 });
  }
}

/** PATCH /api/admin/blog/[id] */
export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await requireAdminPermission("admin.blog");
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = updateBlogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid update." },
      { status: 400 }
    );
  }

  try {
    const item = await updateBlogPost(id, parsed.data);
    if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
    revalidatePublicBlog(item.slug);
    return NextResponse.json({ item });
  } catch (err) {
    console.error("[admin/blog] update failed", err);
    return NextResponse.json({ error: "Failed to update post." }, { status: 500 });
  }
}

/** DELETE /api/admin/blog/[id] — soft delete */
export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await requireAdminPermission("admin.blog");
  if (auth instanceof NextResponse) return auth;

  const { id } = await ctx.params;
  try {
    const existing = await getBlogPost(id);
    const ok = await softDeleteBlogPost(id);
    if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
    revalidatePublicBlog(existing?.slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/blog] delete failed", err);
    return NextResponse.json({ error: "Failed to delete post." }, { status: 500 });
  }
}
