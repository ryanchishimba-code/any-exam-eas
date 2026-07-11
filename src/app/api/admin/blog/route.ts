import { NextResponse } from "next/server";
import { requireAdminPermission } from "@/lib/admin/auth";
import {
  bulkBlogActionSchema,
  createBlogPostSchema,
} from "@/lib/admin/blog-validators";
import {
  bulkBlogAction,
  countActiveBlogPosts,
  createBlogPost,
  listBlogPosts,
} from "@/lib/admin/blog-admin";
import { BlogPostLimitError, MAX_BLOG_POSTS } from "@/lib/blog/limits";
import { revalidatePublicBlog } from "@/lib/blog/revalidate";

export const dynamic = "force-dynamic";

/** GET /api/admin/blog?q=&status=&category= */
export async function GET(req: Request) {
  const auth = await requireAdminPermission("admin.blog");
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const statusParam = url.searchParams.get("status");
  const status =
    statusParam === "published" || statusParam === "draft" || statusParam === "all"
      ? statusParam
      : "all";
  const category = url.searchParams.get("category") ?? undefined;

  try {
    const [items, activeCount] = await Promise.all([
      listBlogPosts({ q, status, category }),
      countActiveBlogPosts(),
    ]);
    return NextResponse.json({
      items,
      activeCount,
      maxPosts: MAX_BLOG_POSTS,
      canCreate: activeCount < MAX_BLOG_POSTS,
    });
  } catch (err) {
    console.error("[admin/blog] list failed", err);
    return NextResponse.json({ error: "Failed to load blog posts." }, { status: 500 });
  }
}

/** POST /api/admin/blog — create post, or bulk action via { action, ids }. */
export async function POST(req: Request) {
  const auth = await requireAdminPermission("admin.blog");
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  if ("action" in body && "ids" in body) {
    const parsed = bulkBlogActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid bulk action." },
        { status: 400 }
      );
    }
    try {
      const count = await bulkBlogAction(parsed.data.ids, parsed.data.action);
      revalidatePublicBlog();
      return NextResponse.json({ ok: true, count });
    } catch (err) {
      console.error("[admin/blog] bulk failed", err);
      return NextResponse.json({ error: "Bulk action failed." }, { status: 500 });
    }
  }

  const parsed = createBlogPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid post." },
      { status: 400 }
    );
  }

  try {
    const item = await createBlogPost(parsed.data, auth.userId);
    revalidatePublicBlog(item.slug);
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    if (err instanceof BlogPostLimitError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 403 });
    }
    console.error("[admin/blog] create failed", err);
    return NextResponse.json({ error: "Failed to create post." }, { status: 500 });
  }
}
