import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { claimGoogleAdsTrial } from "@/lib/analytics/google-ads-claim";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Once per user, after the subscription row is a live free trial. */
export async function POST() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ fire: false }, { status: 401 });

  try {
    const claimed = await claimGoogleAdsTrial(userId);
    return NextResponse.json(claimed);
  } catch (error) {
    console.error("[ads] trial claim failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ fire: false }, { status: 500 });
  }
}
