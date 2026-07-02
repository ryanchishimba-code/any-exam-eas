import { NextResponse } from "next/server";
import { getDrugReviewDashboard } from "@/lib/drugs300";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET() {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const auth = await requirePremiumApi();
  if (!auth.ok) return auth.response;

  try {
    const dashboard = await getDrugReviewDashboard(auth.userId);
    return NextResponse.json(dashboard);
  } catch (error) {
    const { respondDbUnavailable } = await import("@/lib/api-db-error");
    const dbResponse = respondDbUnavailable(error);
    if (dbResponse) return dbResponse;
    const message = error instanceof Error ? error.message : "Unable to load drug review progress";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
