import { NextResponse } from "next/server";
import { listPublicFeed } from "@/lib/social/posts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/social/feed?examType=&limit= — public approved community wall. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const examType = url.searchParams.get("examType") ?? undefined;
  const limitParam = Number(url.searchParams.get("limit"));
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : undefined;

  try {
    const items = await listPublicFeed({ examType, limit });
    return NextResponse.json(
      { items },
      // Short edge cache so the wall feels live without hammering the DB.
      { headers: { "Cache-Control": "public, max-age=15, stale-while-revalidate=60" } }
    );
  } catch (err) {
    console.error("[social/feed] failed", err);
    return NextResponse.json({ items: [] });
  }
}
