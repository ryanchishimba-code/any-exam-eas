import { NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { requireSessionGuard } from "@/lib/session-guard";
import { createSocialPostSchema } from "@/lib/social/validators";
import { createUserPost } from "@/lib/social/posts";

export const runtime = "nodejs";

/**
 * POST /api/social/posts — authenticated users submit a community post.
 * Posts start unapproved and enter the moderation queue.
 */
export async function POST(req: Request) {
  const limited = await enforceRateLimit(req, "social-post-create", 10, 60_000);
  if (limited) return limited;

  const guard = await requireSessionGuard(req);
  if (!guard.ok) return guard.response;

  const body = await req.json().catch(() => null);
  const parsed = createSocialPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid post." },
      { status: 400 }
    );
  }

  try {
    const { id } = await createUserPost(guard.userId, parsed.data);
    return NextResponse.json(
      { id, status: "pending", message: "Thanks! Your post is awaiting review." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[social/posts] create failed", err);
    return NextResponse.json({ error: "Could not submit your post." }, { status: 500 });
  }
}
