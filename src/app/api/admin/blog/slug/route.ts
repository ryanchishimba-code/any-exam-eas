import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminPermission } from "@/lib/admin/auth";
import { isSlugAvailable } from "@/lib/admin/blog-admin";
import { slugifyTitle } from "@/lib/admin/blog-validators";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  excludeId: z.string().optional(),
});

/** POST /api/admin/blog/slug — generate or check slug uniqueness. */
export async function POST(req: Request) {
  const auth = await requireAdminPermission("admin.blog");
  if (auth instanceof NextResponse) return auth;

  const body = bodySchema.safeParse(await req.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const slug =
    body.data.slug?.trim() ||
    (body.data.title ? slugifyTitle(body.data.title) : "");

  if (!slug) {
    return NextResponse.json({ error: "Title or slug required." }, { status: 400 });
  }

  const available = await isSlugAvailable(slug, body.data.excludeId);
  return NextResponse.json({ slug, available });
}
