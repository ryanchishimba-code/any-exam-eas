import { NextResponse } from "next/server";
import { getLearningProfileSnapshot } from "@/lib/learning/engine";

export const runtime = "nodejs";

export async function GET() {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const profile = await getLearningProfileSnapshot(premium.userId);
  return NextResponse.json({ profile });
}
