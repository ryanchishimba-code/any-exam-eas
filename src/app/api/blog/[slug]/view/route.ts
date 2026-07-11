import { NextResponse } from "next/server";
import { incrementBlogViews } from "@/lib/blog/public";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

/** POST /api/blog/[slug]/view — increment public view counter. */
export async function POST(_req: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  if (!slug) return NextResponse.json({ error: "Missing slug." }, { status: 400 });

  try {
    await incrementBlogViews(slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[blog/view] failed", err);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}
