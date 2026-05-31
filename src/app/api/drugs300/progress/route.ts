import { NextResponse } from "next/server";
import { getDrugReviewDashboard } from "@/lib/drugs300";

export const runtime = "nodejs";

export async function GET() {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const auth = await requirePremiumApi();
  if (!auth.ok) return auth.response;

  try {
    const dashboard = await getDrugReviewDashboard(auth.userId);
    return NextResponse.json(dashboard);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unable to load drug review progress";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
