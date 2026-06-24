import { NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { likePost } from "@/lib/social/posts";

export const runtime = "nodejs";

/** POST /api/social/posts/[id]/like — increment a like on an approved post. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const limited = await enforceRateLimit(req, "social-like", 30, 60_000);
  if (limited) return limited;

  const { id } = await params;
  try {
    const likes = await likePost(id);
    if (likes === null) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, likes });
  } catch (err) {
    console.error("[social/like] failed", err);
    return NextResponse.json({ error: "Could not like the post." }, { status: 500 });
  }
}
