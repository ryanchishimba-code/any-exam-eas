import { NextResponse } from "next/server";
import { listQuickBiteProgressForUser } from "@/lib/quick-bites/progress-server";
import { requireUsmleVideoPlayer } from "@/lib/quick-bites/usmle-video-playback";
import { USMLE_VIDEO_QUICK_BITE_EPISODES } from "@/lib/quick-bites/usmle-video-catalog";

export const runtime = "nodejs";

const SLUGS = USMLE_VIDEO_QUICK_BITE_EPISODES.filter((episode) => episode.held !== true).map(
  (episode) => episode.slug
);

export async function GET(request: Request) {
  const gate = await requireUsmleVideoPlayer(request);
  if (!gate.ok) return gate.response;
  const progress = await listQuickBiteProgressForUser(gate.userId, SLUGS);
  return NextResponse.json(
    { progress },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
