import { NextResponse } from "next/server";
import { privateFeedHeaders, requirePanceFeedApi } from "@/lib/pance-feed/api-guard";
import { loadPanceFeedCards } from "@/lib/pance-feed/load-cards";
import {
  readPanceFeedProgress,
  writePanceFeedProgress,
} from "@/lib/pance-feed/progress-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function knownIds(): Set<string> {
  return new Set(loadPanceFeedCards().map((card) => card.id));
}

export async function GET() {
  const authResult = await requirePanceFeedApi();
  if (!authResult.ok) return authResult.response;
  const progress = await readPanceFeedProgress(authResult.userId, knownIds());
  return NextResponse.json(progress, { headers: privateFeedHeaders });
}

export async function PUT(request: Request) {
  const authResult = await requirePanceFeedApi();
  if (!authResult.ok) return authResult.response;
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const progress = await writePanceFeedProgress(authResult.userId, knownIds(), body);
  return NextResponse.json(progress, { headers: privateFeedHeaders });
}
