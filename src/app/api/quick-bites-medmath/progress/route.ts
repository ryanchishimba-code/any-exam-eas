import { NextResponse } from "next/server";
import { MEDMATH_EPISODES } from "@/lib/quick-bites/medmath-catalog";
import { requireMedmathPlayer } from "@/lib/quick-bites/medmath-playback";
import { listQuickBiteProgressForUser } from "@/lib/quick-bites/progress-server";

export const runtime = "nodejs";

const SLUGS = MEDMATH_EPISODES.filter((episode) => episode.held !== true).map((episode) => episode.slug);

export async function GET(request: Request) {
  const gate = await requireMedmathPlayer(request);
  if (!gate.ok) return gate.response;
  const progress = await listQuickBiteProgressForUser(gate.userId, SLUGS);
  return NextResponse.json({ progress }, { headers: { "Cache-Control": "private, no-store" } });
}
